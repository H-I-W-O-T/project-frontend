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
import { useStellar } from '../../../contexts/StellarContext'; 
import { CONTRACTS } from '../../../shared/api/contracts/config';

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

const StepIcon = ({ status }: { status: 'pending' | 'loading' | 'complete' }) => {
  if (status === 'loading') return <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
  if (status === 'complete') return <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] font-bold">✓</div>;
  return <div className="w-5 h-5 border-2 border-white/20 rounded-full" />;
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
  const { clients, publicKey, connect } = useStellar();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStep, setTxStep] = useState<'idle' | 'approving' | 'creating' | 'success'>('idle');
  const [crisisCenter, setCrisisCenter] = useState<[number, number]>([9.03, 38.74]);
  const [radius, setRadius] = useState<number>(50000);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FundProgramForm>({
    defaultValues: {
      name: '', budget: 50000, amountPerPerson: 10, frequencyDays: 30,
      aidType: 'food', description: '', targetRegion: 'amhara',
    },
  });

  const budget = watch('budget');
  const amountPerPerson = watch('amountPerPerson');
  const estimatedBeneficiaries = budget && amountPerPerson ? Math.floor(budget / amountPerPerson) : 0;

  const handleGeofenceChange = (center: [number, number], radiusValue: number) => {
    setCrisisCenter(center);
    setRadius(radiusValue);
  };

  // const onSubmit = async (data: FundProgramForm) => {
  //   if (!crisisCenter || !radius) {
  //     toast.warning('Please define the crisis center and coverage radius');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setTxStep('approving');

  //   try {
  //     // 1. Ensure wallet is connected
  //     const activeAddress = publicKey || (await connect());

  //     // 2. Prepare Geofence Data
  //     const SCALE = 1_000_000n;
  //     const geofencePolygon = circleToPolygon(crisisCenter, radius).map(([lat, lon]) => ({
  //       lat: BigInt(Math.round(lat * Number(SCALE))),
  //       lon: BigInt(Math.round(lon * Number(SCALE))),
  //     }));

  //     // 3. Generate a Unique Hex Program ID (32 bytes)
  //     const generatedProgramId = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
  //       .map(b => b.toString(16).padStart(2, "0"))
  //       .join("");

  //     // --- STEP 1: TOKEN APPROVAL ---
  //     // This gives the Disbursement Contract permission to pull the budget from your wallet
  //     await clients.token.approve(
  //       activeAddress, 
  //       CONTRACTS.DISBURSEMENT, 
  //       BigInt(data.budget), 
  //       10000 
  //     );

  //     setTxStep('creating');

  //     // --- STEP 2: CREATE PROGRAM ON-CHAIN ---
  //     const now = Math.floor(Date.now() / 1000);
  //     const createResult = await clients.disbursement.createProgram(
  //       activeAddress,
  //       generatedProgramId,
  //       BigInt(data.amountPerPerson),
  //       BigInt(data.budget),
  //       data.frequencyDays,
  //       geofencePolygon,
  //       BigInt(now),
  //       BigInt(now + 2592000) // 30 day duration
  //     );

  //     // --- STEP 3: SAVE TO LOCAL DISCOVERY INDEX ---
  //     // This is the CRITICAL part for your dashboard to see the program!
  //     const storageKey = `funded_programs_${activeAddress}`;
  //     const existingIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
  //     // Add the new ID to our local list
  //     const updatedIds = [...new Set([...existingIds, generatedProgramId])];
  //     localStorage.setItem(storageKey, JSON.stringify(updatedIds));

  //     setTxStep('success');
  //     toast.success('Smart Contract Deployed Successfully!');
      
  //     // Small delay so the user can see the "Success" state in the UI
  //     setTimeout(() => {
  //       navigate(`/donor/dashboard`);
  //     }, 1500);
      
  //   } catch (error: any) {
  //     console.error("Deployment Error:", error);
  //     setTxStep('idle');
  //     toast.error(error.message || 'Transaction failed. Check Freighter for details.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (data: FundProgramForm) => {
    if (!crisisCenter || !radius) {
      toast.warning('Please define the crisis center and coverage radius');
      return;
    }

    setIsSubmitting(true);
    setTxStep('approving');

    try {
      const activeAddress = publicKey || (await connect());
      
      // --- 1. CONSTANTS & SCALING ---
      const STR_SCALE = 10_000_000n; // 7 Decimals for Stellar Assets (USDC)
      const GEO_SCALE = 1_000_000n;  // Scale for Lat/Lon coordinates
      
      const scaledBudget = BigInt(Math.round(data.budget)) * STR_SCALE;
      const scaledAmount = BigInt(Math.round(data.amountPerPerson)) * STR_SCALE;

      // --- 2. FORMAT PROGRAM ID (Hex String -> Uint8Array) ---
      const generatedProgramId = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
      
      // Convert to the byte array format the contract expects (BytesN<32>)
      const programIdBytes = new Uint8Array(
        generatedProgramId.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
      );

      // --- 3. PREPARE GEOFENCE ---
      const geofencePolygon = circleToPolygon(crisisCenter, radius).map(([lat, lon]) => ({
        lat: BigInt(Math.round(lat * Number(GEO_SCALE))),
        lon: BigInt(Math.round(lon * Number(GEO_SCALE))),
      }));

      // --- STEP 1: TOKEN APPROVAL ---
      // This allows the Disbursement Contract to pull the 'scaledBudget' from the donor
      await clients.token.approve(
        activeAddress, 
        CONTRACTS.DISBURSEMENT, 
        scaledBudget, 
        2000 // Valid for ~3 hours (2000 ledgers)
      );

      setTxStep('creating');

      // --- STEP 2: CREATE PROGRAM ON-CHAIN ---
      const now = Math.floor(Date.now() / 1000);
      
      // Ensure the order matches your Rust: donor, id, amount, budget, freq, geo, start, end
      await clients.disbursement.createProgram(
        activeAddress,
        // programIdBytes,
        generatedProgramId,
        scaledAmount,
        scaledBudget,
        data.frequencyDays,
        geofencePolygon,
        BigInt(now),
        BigInt(now + 2592000) // 30 days
      );

      // --- STEP 3: INDEX FOR DASHBOARD ---
      const storageKey = `funded_programs_${activeAddress}`;
      const existingIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...new Set([...existingIds, generatedProgramId])]));

      setTxStep('success');
      toast.success('Program Created and Funded!');
      setTimeout(() => navigate(`/donor/dashboard`), 1500);
      
    } catch (error: any) {
      console.error("Deployment Error:", error);
      setTxStep('idle');
      // Provide a more helpful error message
      const msg = error.message?.includes("User Rejected") ? "Transaction cancelled." : "Transaction failed. Ensure you have enough USDC and XLM.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRadius = (meters: number): string => {
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
    return `${meters} m`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gradient">Fund New Aid Program</h1>
        <p className="text-gray-600 mt-1">Deploy humanitarian aid directly to the Stellar blockchain.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Program Details</h2>
          <div className="space-y-4">
            <Input label="Program Name" {...register('name', { required: 'Required' })} error={errors.name?.message} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Aid Type" options={aidTypeOptions} {...register('aidType')} />
              <Select label="Target Region" options={regionOptions} {...register('targetRegion')} />
            </div>
            <TextArea label="Description" rows={3} {...register('description')} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">💰 Budget & Distribution</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Total Budget (USDC)" type="number" {...register('budget', { required: 'Required', valueAsNumber: true })} />
              <Input label="Amount Per Person (USDC)" type="number" {...register('amountPerPerson', { required: 'Required', valueAsNumber: true })} />
            </div>
            <Input label="Distribution Frequency (Days)" type="number" {...register('frequencyDays', { valueAsNumber: true })} />
            {estimatedBeneficiaries > 0 && (
              <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light/30 text-primary font-bold">
                {estimatedBeneficiaries.toLocaleString()} estimated beneficiaries
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Crisis Zone</h2>
          <GeofenceCircleMap onChange={handleGeofenceChange} initialCenter={crisisCenter} initialRadius={radius} height="400px" />
        </Card>

        {/* Updated Summary Card with Transaction Stepper */}
        <Card className={`p-6 transition-all duration-500 ${isSubmitting ? 'bg-slate-900' : 'bg-gradient-brand'} text-white`}>
          <h2 className="text-lg font-semibold mb-3">Program Summary</h2>
          
          {isSubmitting && (
            <div className="mb-6 space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <StepIcon status={txStep === 'approving' ? 'loading' : (txStep === 'creating' || txStep === 'success' ? 'complete' : 'pending')} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Step 1: Token Allowance</p>
                  <p className="text-xs text-white/60">Approving {budget} USDC for disbursement</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StepIcon status={txStep === 'creating' ? 'loading' : (txStep === 'success' ? 'complete' : 'pending')} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Step 2: Smart Contract Deployment</p>
                  <p className="text-xs text-white/60">Registering program on Stellar</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm opacity-90">
            <div><p className="text-white/70">Budget</p><p className="font-medium">{budget?.toLocaleString()} USDC</p></div>
            <div><p className="text-white/70">Radius</p><p className="font-medium">{formatRadius(radius)}</p></div>
            <div className="col-span-2"><p className="text-white/70">Center</p><p className="font-medium">{crisisCenter[0].toFixed(4)}, {crisisCenter[1].toFixed(4)}</p></div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/donor/dashboard')}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>Deploy Smart Contract</Button>
        </div>
      </form>
    </div>
  );
};