import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Input } from '../../../shared/components/Forms/Input';
import { TextArea } from '../../../shared/components/Forms/TextArea';
import { Select } from '../../../shared/components/Forms/Select';
import { GeofenceCircleMap } from '../../../shared/components/Forms/GeofenceMap';
import { useToast } from '../../../shared/components/Common/ToastContainer';
import { donorService } from '../services/donorService';

interface FundProgramForm {
  name: string;
  budget: number;
  amountPerPerson: number;
  frequencyDays: number;
  aidType: string;
  description: string;
  targetRegion: string;
}

const aidTypeOptions = [
  { value: 'food', label: 'Food Aid' },
  { value: 'cash', label: 'Cash Assistance' },
  { value: 'medical', label: 'Medical Supplies' },
  { value: 'water', label: 'Water & Sanitation' },
  { value: 'shelter', label: 'Shelter & NFI' },
  { value: 'education', label: 'Education Support' },
];

const regionOptions = [
  { value: 'amhara', label: 'Amhara Region' },
  { value: 'oromia', label: 'Oromia Region' },
  { value: 'tigray', label: 'Tigray Region' },
  { value: 'somali', label: 'Somali Region' },
  { value: 'benishangul', label: 'Benishangul-Gumuz' },
  { value: 'multiple', label: 'Multiple Regions' },
];

// Helper function to convert circle to polygon points
const circleToPolygon = (center: [number, number], radiusInMeters: number, points = 32): [number, number][] => {
  const [lat, lng] = center;
  const earthRadius = 6371000; // Earth's radius in meters
  const latRad = lat * Math.PI / 180;
  
  const polygon: [number, number][] = [];
  
  for (let i = 0; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const dx = radiusInMeters * Math.cos(angle);
    const dy = radiusInMeters * Math.sin(angle);
    
    // Convert meters to degrees
    const deltaLat = (dy / earthRadius) * (180 / Math.PI);
    const deltaLng = (dx / (earthRadius * Math.cos(latRad))) * (180 / Math.PI);
    
    polygon.push([lat + deltaLat, lng + deltaLng]);
  }
  
  return polygon;
};

export const FundProgram = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crisisCenter, setCrisisCenter] = useState<[number, number]>([9.03, 38.74]);
  const [radius, setRadius] = useState<number>(50000); // 50km in meters

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FundProgramForm>({
    defaultValues: {
      name: '',
      budget: 50000,
      amountPerPerson: 10,
      frequencyDays: 30,
      aidType: 'food',
      description: '',
      targetRegion: 'amhara',
    },
  });

  const budget = watch('budget');
  const amountPerPerson = watch('amountPerPerson');
  const estimatedBeneficiaries = budget && amountPerPerson ? Math.floor(budget / amountPerPerson) : 0;

  const handleGeofenceChange = (center: [number, number], radiusValue: number) => {
    setCrisisCenter(center);
    setRadius(radiusValue);
  };

  const onSubmit = async (data: FundProgramForm) => {
    // Validate geofence
    if (!crisisCenter || !radius) {
      toast.warning('Please define the crisis center and coverage radius on the map');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert circle to polygon for the geofence
      const geofencePolygon = circleToPolygon(crisisCenter, radius);
      
      // Call the service with the correct interface
      const result = await donorService.createProgram({
        name: data.name,
        budget: data.budget,
        amountPerPerson: data.amountPerPerson,
        geofence: geofencePolygon,
        frequencyDays: data.frequencyDays,
      });

      toast.success('Program created successfully! Smart contract deployed.');
      navigate(`/donor/shipments?program=${result.programId}`);
    } catch (error) {
      toast.error('Failed to create program. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format radius for display
  const formatRadius = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Fund New Aid Program</h1>
        <p className="text-gray-600 mt-1">
          Create a new humanitarian program. Define budget, distribution rules, and target area.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Program Details Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Program Details</h2>
          <div className="space-y-4">
            <Input
              label="Program Name"
              placeholder="e.g., Emergency Food Aid - Amhara"
              {...register('name', { required: 'Program name is required' })}
              error={errors.name?.message}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Aid Type" options={aidTypeOptions} {...register('aidType')} />
              <Select label="Target Region" options={regionOptions} {...register('targetRegion')} />
            </div>
            <TextArea
              label="Description"
              placeholder="Describe the program goals, target population, and expected outcomes..."
              rows={3}
              {...register('description')}
            />
          </div>
        </Card>

        {/* Budget Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 Budget & Distribution</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Total Budget (USDC)"
                type="number"
                {...register('budget', { 
                  required: 'Budget is required', 
                  valueAsNumber: true,
                  min: { value: 100, message: 'Minimum budget is 100 USDC' }
                })}
                error={errors.budget?.message}
                required
              />
              <Input
                label="Amount Per Person (USDC)"
                type="number"
                {...register('amountPerPerson', { 
                  required: 'Amount per person is required', 
                  valueAsNumber: true,
                  min: { value: 1, message: 'Minimum amount is 1 USDC' }
                })}
                error={errors.amountPerPerson?.message}
                required
              />
            </div>
            <Input
              label="Distribution Frequency (Days)"
              type="number"
              {...register('frequencyDays', { 
                valueAsNumber: true,
                min: { value: 1, message: 'Minimum 1 day' }
              })}
              helper="How often the same person can receive aid"
              error={errors.frequencyDays?.message}
            />
            {estimatedBeneficiaries > 0 && (
              <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light/30">
                <p className="text-sm text-gray-600 mb-1">Estimated Beneficiaries</p>
                <p className="text-2xl font-bold text-primary">
                  {estimatedBeneficiaries.toLocaleString()} people
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on ${budget.toLocaleString()} USDC at ${amountPerPerson} USDC per person
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Crisis Zone Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Crisis Zone</h2>
          <p className="text-sm text-gray-500 mb-4">
            Define the crisis center and coverage radius. Click on the map to set the center point, or use the quick select buttons.
          </p>
          <GeofenceCircleMap
            onChange={handleGeofenceChange}
            initialCenter={crisisCenter}
            initialRadius={radius}
            height="500px"
          />
        </Card>

        {/* Summary Card */}
        <Card className="p-6 bg-gradient-brand text-white">
          <h2 className="text-lg font-semibold mb-3">Program Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/70">Program Name</p>
              <p className="font-medium">{watch('name') || 'Not set'}</p>
            </div>
            <div>
              <p className="text-white/70">Aid Type</p>
              <p className="font-medium">{aidTypeOptions.find(o => o.value === watch('aidType'))?.label || 'Not set'}</p>
            </div>
            <div>
              <p className="text-white/70">Total Budget</p>
              <p className="font-medium">{budget?.toLocaleString() || 0} USDC</p>
            </div>
            <div>
              <p className="text-white/70">Per Person</p>
              <p className="font-medium">{amountPerPerson || 0} USDC</p>
            </div>
            <div>
              <p className="text-white/70">Crisis Center</p>
              <p className="font-medium">{crisisCenter[0].toFixed(4)}°, {crisisCenter[1].toFixed(4)}°</p>
            </div>
            <div>
              <p className="text-white/70">Coverage Radius</p>
              <p className="font-medium">{formatRadius(radius)}</p>
            </div>
            <div>
              <p className="text-white/70">Target Region</p>
              <p className="font-medium">{regionOptions.find(o => o.value === watch('targetRegion'))?.label || 'Not set'}</p>
            </div>
            <div>
              <p className="text-white/70">Est. Beneficiaries</p>
              <p className="font-medium">{estimatedBeneficiaries.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/donor/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            leftIcon={<span>🚀</span>}
          >
            Deploy Smart Contract
          </Button>
        </div>
      </form>
    </div>
  );
};