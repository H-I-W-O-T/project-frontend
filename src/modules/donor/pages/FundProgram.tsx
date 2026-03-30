import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Input } from '../../../shared/components/Forms/Input';
import { TextArea } from '../../../shared/components/Forms/TextArea';
import { Select } from '../../../shared/components/Forms/Select';
import { GeofenceCircleMap } from '../../../shared/components/Forms/GeofenceMap';
import { useToast } from '../../../shared/components/Common/ToastContainer';
import { useStellar } from '../../../contexts/StellarContext'; 
import { CONTRACTS } from '../../../shared/api/contracts/config';
import { parseScVal } from '../../../shared/api/contracts/utils';
import { Wallet, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

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

const STR_SCALE = 10_000_000n;

const StepIcon = ({ status }: { status: 'pending' | 'loading' | 'complete' | 'error' }) => {
  if (status === 'loading') {
    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        <Loader2 className="w-4 h-4 text-primary animate-pulse" />
      </div>
    );
  }
  if (status === 'complete') {
    return (
      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
        <CheckCircle2 className="w-5 h-5 text-white" />
      </div>
    );
  }
  return <div className="w-8 h-8 border-2 border-gray-200 rounded-full bg-white shadow-inner" />;
};

const circleToPolygon = (center: [number, number], radiusInMeters: number, points = 32): [number, number][] => {
  const [lat, lng] = center;
  const earthRadius = 6371000;
  const latRad = lat * Math.PI / 180;
  const polygon: [number, number][] = [];
  for (let i = 0; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const dx = radiusInMeters * Math.cos(angle);
    const dy = radiusInMeters * Math.sin(angle);
    const deltaLat = (dy / earthRadius) * (180 / Math.PI);
    const deltaLng = (dx / (earthRadius * Math.cos(latRad))) * (180 / Math.PI);
    polygon.push([lat + deltaLat, lng + deltaLng]);
  }
  return polygon;
};

export const FundProgram = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { clients, publicKey, connect, queryContract } = useStellar();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStep, setTxStep] = useState<'idle' | 'approving' | 'creating' | 'success'>('idle');
  const [crisisCenter, setCrisisCenter] = useState<[number, number]>([9.03, 38.74]);
  const [radius, setRadius] = useState<number>(50000);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FundProgramForm>({
    defaultValues: {
      name: '', budget: 100, amountPerPerson: 10, frequencyDays: 30,
      aidType: 'food', description: '', targetRegion: 'amhara',
    },
  });

  const budget = watch('budget');
  const amountPerPerson = watch('amountPerPerson');
  const aidType = watch('aidType');
  const targetRegion = watch('targetRegion');
  const estimatedBeneficiaries = budget && amountPerPerson ? Math.floor(budget / amountPerPerson) : 0;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !queryContract) return;
      try {
        const raw = await queryContract({
          contractId: CONTRACTS.TOKEN,
          method: "balance",
          args: [publicKey]
        });
        const balance = Number(parseScVal(raw) || 0) / Number(STR_SCALE);
        setWalletBalance(balance);
      } catch (err) {
        console.error("Balance fetch failed:", err);
      }
    };
    fetchBalance();
  }, [publicKey, queryContract]);

  const handleGeofenceChange = (center: [number, number], radiusValue: number) => {
    setCrisisCenter(center);
    setRadius(radiusValue);
  };

  const onSubmit = async (data: FundProgramForm) => {
    if (data.budget > walletBalance) {
      toast.error(`Insufficient funds. You have ${walletBalance} USDC.`);
      return;
    }

    setIsSubmitting(true);
    setTxStep('approving');

    try {
      const activeAddress = publicKey || (await connect());
      const GEO_SCALE = 1_000_000n;
      const scaledBudget = BigInt(Math.round(data.budget)) * STR_SCALE;
      const scaledAmount = BigInt(Math.round(data.amountPerPerson)) * STR_SCALE;

      const generatedProgramId = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      
      const geofencePolygon = circleToPolygon(crisisCenter, radius).map(([lat, lon]) => ({
        lat: BigInt(Math.round(lat * Number(GEO_SCALE))),
        lon: BigInt(Math.round(lon * Number(GEO_SCALE))),
      }));

      await clients.token.approve(activeAddress, CONTRACTS.DISBURSEMENT, scaledBudget, 2000);

      setTxStep('creating');

      const now = Math.floor(Date.now() / 1000);
      await clients.disbursement.createProgram(
        activeAddress,
        generatedProgramId,
        scaledAmount,
        scaledBudget,
        data.frequencyDays,
        geofencePolygon,
        BigInt(now),
        BigInt(now + 2592000)
      );

      const storageKey = `funded_programs_${activeAddress}`;
      const existingIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...new Set([...existingIds, generatedProgramId])]));

      setTxStep('success');
      toast.success('Program Created and Funded!');
      setTimeout(() => navigate(`/donor/dashboard`), 1500);
      
    } catch (error: any) {
      setTxStep('idle');
      toast.error(error.message?.includes("User Rejected") ? "Transaction cancelled." : "Transaction failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Fund New Aid Program</h1>
          <p className="text-gray-600 mt-1">Deploy humanitarian aid directly to the Stellar blockchain.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
          <Wallet className="text-primary" size={20} />
          <span className="font-bold text-primary">{walletBalance.toLocaleString()} USDC</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">📋 Program Details</h2>
          <div className="space-y-4">
            <Input label="Program Name" {...register('name', { required: 'Required' })} error={errors.name?.message} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Aid Type" options={aidTypeOptions} {...register('aidType')} />
              <Select label="Target Region" options={regionOptions} {...register('targetRegion')} />
            </div>
            <TextArea label="Description" rows={3} {...register('description')} />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-primary">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">💰 Budget & Distribution</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Total Budget (USDC)" 
                type="number" 
                {...register('budget', { 
                  required: 'Required', 
                  valueAsNumber: true,
                  min: { value: 1, message: 'Must be at least 1 USDC' },
                  validate: (val) => val <= walletBalance || 'Insufficient wallet balance'
                })} 
                error={errors.budget?.message}
              />
              <Input 
                label="Amount Per Person (USDC)" 
                type="number" 
                {...register('amountPerPerson', { 
                  required: 'Required', 
                  valueAsNumber: true,
                  min: { value: 0.1, message: 'Must be at least 0.1 USDC' },
                  validate: (val) => val <= budget || 'Cannot exceed total budget'
                })} 
                error={errors.amountPerPerson?.message}
              />
            </div>
            <Input 
              label="Distribution Frequency (Days)" 
              type="number" 
              {...register('frequencyDays', { 
                valueAsNumber: true,
                min: { value: 1, message: 'Must be at least 1 day' }
              })} 
              error={errors.frequencyDays?.message}
            />

            {errors.budget?.type === 'validate' && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">Warning: Budget exceeds available balance.</span>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">🗺️ Crisis Zone</h2>
          <GeofenceCircleMap onChange={handleGeofenceChange} initialCenter={crisisCenter} initialRadius={radius} height="400px" />
        </Card>

        <Card className={`relative overflow-hidden transition-all duration-700 ${isSubmitting ? 'border-primary shadow-2xl scale-[1.01]' : 'border-gray-100'}`}>
          <div className={`p-4 ${isSubmitting ? 'bg-primary text-white' : 'bg-gray-50 text-gray-900'} transition-colors`}>
            <h2 className="text-lg font-bold flex items-center gap-2">
              {isSubmitting ? '🚀 Deploying to Stellar...' : '📋 Program Summary'}
            </h2>
          </div>

          <div className="p-6 space-y-8">
            {isSubmitting ? (
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100 -z-0" />
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <StepIcon status={txStep === 'approving' ? 'loading' : (txStep === 'creating' || txStep === 'success' ? 'complete' : 'pending')} />
                    <div>
                      <p className={`font-bold ${txStep === 'approving' ? 'text-primary' : 'text-gray-900'}`}>1. Token Authorization</p>
                      <p className="text-xs text-gray-500 mt-1">Granting permission to move <span className="font-mono font-bold text-gray-700">{budget} USDC</span>.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <StepIcon status={txStep === 'creating' ? 'loading' : (txStep === 'success' ? 'complete' : 'pending')} />
                    <div>
                      <p className={`font-bold ${txStep === 'creating' ? 'text-primary' : 'text-gray-900'}`}>2. Smart Contract Injection</p>
                      <p className="text-xs text-gray-500 mt-1">Broadcasting <span className="font-bold text-gray-700">{aidTypeOptions.find(o => o.value === aidType)?.label}</span> to Soroban.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <StepIcon status={txStep === 'success' ? 'complete' : 'pending'} />
                    <div>
                      <p className={`font-bold ${txStep === 'success' ? 'text-green-600' : 'text-gray-400'}`}>3. Finalizing Ledger Entry</p>
                      <p className="text-xs text-gray-400 mt-1">Syncing your dashboard with the global state.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Total Funding</p>
                  <p className="text-xl font-bold text-primary">{budget?.toLocaleString() || 0} USDC</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Target Reach</p>
                  <p className="text-xl font-bold text-gray-900">{estimatedBeneficiaries.toLocaleString()} People</p>
                </div>
                <div className="col-span-2 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3">
                  <div className="text-xl">📍</div>
                  <div>
                    <p className="text-xs font-bold text-blue-800">{regionOptions.find(r => r.value === targetRegion)?.label}</p>
                    <p className="text-[10px] text-blue-600 uppercase">Selected Operation Zone</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/donor/dashboard')}>Cancel</Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={isSubmitting}
            disabled={isSubmitting || !!Object.keys(errors).length}
          >
            Deploy Smart Contract
          </Button>
        </div>
      </form>
    </div>
  );
};