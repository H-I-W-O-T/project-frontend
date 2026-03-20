import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Input } from '../../../shared/components/Forms/Input';
import { TextArea } from '../../../shared/components/Forms/TextArea';
import { Select } from '../../../shared/components/Forms/Select';
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

export const FundProgram = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geofence, setGeofence] = useState<[number, number][]>([]);
  const [showMap, setShowMap] = useState(false);

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

  const onSubmit = async (data: FundProgramForm) => {
    if (geofence.length === 0 && data.targetRegion !== 'multiple') {
      toast.warning('Please draw a geofence on the map or select a region');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await donorService.createProgram({
        name: data.name,
        budget: data.budget,
        amountPerPerson: data.amountPerPerson,
        geofence: geofence.length > 0 ? geofence : [[9.0, 38.0], [9.0, 39.0], [8.0, 39.0], [8.0, 38.0]], // Default Amhara
        frequencyDays: data.frequencyDays,
      });

      toast.success('Program created successfully!', 'Program Funded');
      navigate(`/donor/shipments?program=${result.programId}`);
    } catch (error) {
      toast.error('Failed to create program. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo geofence drawing
  const drawDemoGeofence = () => {
    if (showMap) {
      setGeofence([]);
      setShowMap(false);
    } else {
      setGeofence([
        [9.0, 38.0],
        [9.0, 39.0],
        [8.0, 39.0],
        [8.0, 38.0],
      ]);
      setShowMap(true);
      toast.info('Demo: Geofence drawn around Amhara region');
    }
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-primary">📋</span> Program Details
          </h2>

          <div className="space-y-4">
            <Input
              label="Program Name"
              placeholder="e.g., Emergency Food Aid - Amhara"
              {...register('name', { required: 'Program name is required' })}
              error={errors.name?.message}
              required
              leftIcon={<span>📌</span>}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Aid Type"
                options={aidTypeOptions}
                {...register('aidType')}
              />
              <Select
                label="Target Region"
                options={regionOptions}
                {...register('targetRegion')}
              />
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-primary">💰</span> Budget & Distribution
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Total Budget (USDC)"
                type="number"
                placeholder="50000"
                {...register('budget', {
                  required: 'Budget is required',
                  min: { value: 100, message: 'Minimum budget is 100 USDC' },
                })}
                error={errors.budget?.message}
                required
                leftIcon={<span>💵</span>}
              />

              <Input
                label="Amount Per Person (USDC)"
                type="number"
                placeholder="10"
                {...register('amountPerPerson', {
                  required: 'Amount per person is required',
                  min: { value: 1, message: 'Minimum amount is 1 USDC' },
                })}
                error={errors.amountPerPerson?.message}
                required
                leftIcon={<span>👤</span>}
              />
            </div>

            <Input
              label="Distribution Frequency (Days)"
              type="number"
              placeholder="30"
              {...register('frequencyDays', {
                min: { value: 1, message: 'Minimum 1 day' },
              })}
              error={errors.frequencyDays?.message}
              helper="How often the same person can receive aid"
              leftIcon={<span>📅</span>}
            />

            {/* Estimated Beneficiaries */}
            {estimatedBeneficiaries > 0 && (
              <div className="mt-4 p-4 bg-primary-light/10 rounded-lg border border-primary-light/30">
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

        {/* Geofence Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-primary">🗺️</span> Crisis Zone (Geofence)
          </h2>
          <p className="text-sm text-gray-500 mb-3">
            Draw the affected area on the map. Only beneficiaries within this zone will receive aid.
          </p>

          <div className={`map-container bg-gray-100 rounded-lg border border-gray-200 transition-all ${showMap ? 'h-80' : 'h-32'}`}>
            {!showMap ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-3">🗺️ Geofence not set</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={drawDemoGeofence}
                  >
                    Draw Demo Geofence (Amhara Region)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full relative">
                {/* Simplified Map Visualization */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto">
                      {/* Simple polygon visualization */}
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <polygon
                          points="50,30 150,30 170,100 150,170 50,170 30,100"
                          fill="none"
                          stroke="#006666"
                          strokeWidth="3"
                          fillOpacity="0.2"
                          className="fill-primary/20"
                        />
                        <circle cx="100" cy="100" r="4" fill="#006666" />
                        <text x="100" y="190" textAnchor="middle" className="text-xs fill-gray-600">
                          Amhara Region (Demo)
                        </text>
                      </svg>
                      <p className="text-xs text-gray-500 mt-2">
                        {geofence.length} points drawn
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={drawDemoGeofence}
                      className="mt-2"
                    >
                      Reset Geofence
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {geofence.length > 0 && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <span>✓</span> Geofence drawn with {geofence.length} points - Amhara region selected
            </p>
          )}
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