import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { usePrograms } from '../hooks/usePrograms';
import { managerService } from '../services/managerService';
import { GeofenceCircleMap } from '../../../shared/components/Forms/GeofenceMap';

// Define proper types
interface GeofenceCircle {
  type: 'circle';
  center: [number, number];
  radius: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface Program {
  programId: string;
  name: string;
  budget?: number;
  amountPerPerson?: number;
  geofence?: GeofenceCircle | [number, number][];
  donor?: string;
  donorName?: string;
}

const GeofenceManager = () => {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('programId');
  const { programs, loading, fetchPrograms } = usePrograms();
  const [center, setCenter] = useState<[number, number]>([9.03, 38.74]);
  const [radius, setRadius] = useState<number>(50000);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Type assertion for programs
  const typedPrograms = programs as Program[];
  const program = typedPrograms.find(p => p.programId === programId);

  // Helper function to check if geofence is a circle
  const isCircleGeofence = (geofence: any): geofence is GeofenceCircle => {
    return geofence && typeof geofence === 'object' && !Array.isArray(geofence) && geofence.type === 'circle';
  };

  // Helper function to check if geofence is a polygon
  const isPolygonGeofence = (geofence: any): geofence is [number, number][] => {
    return Array.isArray(geofence) && geofence.length > 0 && Array.isArray(geofence[0]);
  };

  // Load existing geofence data when program is selected
  useEffect(() => {
    if (program?.geofence) {
      // Check if geofence is stored as circle data
      if (isCircleGeofence(program.geofence)) {
        setCenter(program.geofence.center);
        setRadius(program.geofence.radius);
      } 
      // If geofence is stored as polygon coordinates array
      else if (isPolygonGeofence(program.geofence)) {
        // Calculate center from polygon (use average of all points)
        const sumLat = program.geofence.reduce((sum, point) => sum + point[0], 0);
        const sumLng = program.geofence.reduce((sum, point) => sum + point[1], 0);
        const centerLat = sumLat / program.geofence.length;
        const centerLng = sumLng / program.geofence.length;
        setCenter([centerLat, centerLng]);
        
        // Estimate radius from polygon (max distance from center)
        let maxDistance = 0;
        program.geofence.forEach(point => {
          const latDiff = point[0] - centerLat;
          const lngDiff = point[1] - centerLng;
          const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111320;
          maxDistance = Math.max(maxDistance, distance);
        });
        setRadius(Math.max(maxDistance, 1000));
      }
    }
  }, [program]);

  const handleGeofenceChange = (newCenter: [number, number], newRadius: number) => {
    setCenter(newCenter);
    setRadius(newRadius);
  };

  // Convert circle to polygon points for API compatibility
  const circleToPolygon = (center: [number, number], radiusInMeters: number, points: number = 36): [number, number][] => {
    const [lat, lng] = center;
    const radiusInDegrees = radiusInMeters / 111320; // Rough conversion
    
    const polygon: [number, number][] = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const deltaLat = radiusInDegrees * Math.cos(angle);
      const deltaLng = radiusInDegrees * Math.sin(angle) / Math.cos(lat * Math.PI / 180);
      polygon.push([lat + deltaLat, lng + deltaLng]);
    }
    return polygon;
  };

  const saveGeofence = async () => {
    if (!programId) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Convert circle to polygon for API compatibility
      const polygonCoordinates = circleToPolygon(center, radius);
      
      // Save as polygon coordinates array (expected by the API)
      await managerService.updateGeofence(programId, polygonCoordinates);
      setSaveSuccess(true);
      
      // Refetch programs to get updated data
      await fetchPrograms();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving geofence:', error);
      alert('Failed to save geofence. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = () => {
    setCenter([9.03, 38.74]);
    setRadius(50000);
  };

  const formatRadius = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading programs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Geofence Manager {program ? `- ${program.name}` : ''}
        </h1>
        {program && (
          <p className="text-gray-600">
            Define the crisis area for {program.name}. All beneficiaries within this radius will be eligible for aid.
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Component */}
        <div className="lg:col-span-2">
          {programId ? (
            <GeofenceCircleMap
              onChange={handleGeofenceChange}
              initialCenter={center}
              initialRadius={radius}
              height="500px"
            />
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="bg-gray-100 h-125 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-gray-500">Select a program to configure geofence</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Please select a program from the list to define its coverage area
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Controls */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Geofence Controls</h2>
          
          <div className="space-y-4">
            {/* Program Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">
                {programId && program ? (
                  <>
                    <p className="font-medium text-gray-900 mb-1">Current Program:</p>
                    <p><strong>{program.name}</strong></p>
                    {center && radius && (
                      <div className="mt-2 text-xs border-t pt-2">
                        <p>📍 Center: {center[0].toFixed(6)}°, {center[1].toFixed(6)}°</p>
                        <p>📏 Radius: {formatRadius(radius)}</p>
                        <p className="text-green-600 mt-1">
                          Coverage Area: ~{Math.round(Math.PI * Math.pow(radius / 1000, 2) * 10) / 10} km²
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-yellow-600">⚠️ No program selected. Please select a program to edit geofence.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={saveGeofence}
                variant="primary"
                className="w-full"
                disabled={!programId || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Geofence'}
              </Button>
              
              <Button 
                onClick={resetToDefault}
                variant="outline"
                className="w-full"
                disabled={!programId}
              >
                Reset to Default (Addis Ababa, 50km)
              </Button>
            </div>

            {/* Success Message */}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm flex items-center gap-2">
                  <span>✅</span>
                  Geofence saved successfully!
                </p>
              </div>
            )}

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">ℹ️ How it works:</span>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Click on the map to set the crisis center point</li>
                <li>Use the slider to adjust coverage radius</li>
                <li>Quick-select regions for common areas</li>
                <li>Manually enter coordinates if needed</li>
                <li>All beneficiaries within the circle will be eligible for aid</li>
              </ul>
            </div>

            {/* Tips */}
            {radius >= 100000 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">⚠️ Large Area Detected:</span>
                  <br />
                  Consider splitting into multiple programs for better coverage and more targeted aid distribution.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeofenceManager;