import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { usePrograms } from '../hooks/usePrograms';
import { managerService } from '../services/managerService';

// Note: This is a basic placeholder. For a real map, you'd use Leaflet or Mapbox
const GeofenceMap = () => {
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('programId');
  const { programs } = usePrograms();
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const program = programs.find(p => p.programId === programId);

  useEffect(() => {
    if (program?.geofence) {
      setCoordinates(program.geofence);
    }
  }, [program]);

  const saveGeofence = async () => {
    if (programId && coordinates.length > 0) {
      await managerService.updateGeofence(programId, coordinates);
      alert('Geofence saved successfully!');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Geofence Manager {program ? `- ${program.name}` : ''}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="bg-gray-100 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-gray-500">Map Component Placeholder</p>
              <p className="text-sm text-gray-400 mt-2">
                (In production, integrate Leaflet or Mapbox)
              </p>
              {coordinates.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  {coordinates.length} points drawn
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Controls */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Geofence Controls</h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {programId ? (
                <p>Drawing geofence for: <strong>{program?.name}</strong></p>
              ) : (
                <p className="text-yellow-600">Select a program to edit geofence</p>
              )}
            </div>
            
            <Button 
              onClick={() => setIsDrawing(!isDrawing)}
              variant="secondary"
              className="w-full"
              disabled={!programId}
            >
              {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
            </Button>
            
            <Button 
              onClick={() => setCoordinates([])}
              variant="outline"
              className="w-full"
              disabled={coordinates.length === 0}
            >
              Clear Points
            </Button>
            
            <Button 
              onClick={saveGeofence}
              variant="primary"
              className="w-full"
              disabled={coordinates.length === 0}
            >
              Save Geofence
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeofenceMap;