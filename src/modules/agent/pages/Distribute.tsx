
// // pages/Distribute.tsx
// import React, { useState, useEffect } from 'react';
// import { useDistribution } from '../hooks/useDistribution';
// import { useBeneficiary } from '../hooks/useBeneficiary';
// import { DistributionForm } from '../components/DistributionForm';
// import { BeneficiaryCard } from '../components/BeneficiaryCard';
// import { Button } from '../../../shared/components/Common';

// const Distribute: React.FC = () => {
//   const { distribute, loading, error: distError, distributions } = useDistribution();
//   const { beneficiary, verify, loading: verifyLoading } = useBeneficiary();
//   const [showForm, setShowForm] = useState(false);
//   const [searchId, setSearchId] = useState('');

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchId) {
//       await verify(searchId);
//       setShowForm(true);
//     }
//   };

//   const handleDistribute = async (formData: any) => {
//     if (beneficiary) {
//       await distribute({
//         ...formData,
//         beneficiaryId: beneficiary.id
//       });
//       setShowForm(false);
//       setSearchId('');
//     }
//   };

//   if (showForm && beneficiary) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         <BeneficiaryCard beneficiary={beneficiary} />
//         <div className="mt-6">
//           <DistributionForm 
//             beneficiary={beneficiary}
//             onSubmit={handleDistribute}
//             onCancel={() => {
//               setShowForm(false);
//               setSearchId('');
//             }}
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Distribute Aid</h1>

//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Select Beneficiary</h2>
        
//         <form onSubmit={handleSearch}>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Beneficiary ID or Phone Number
//             </label>
//             <input
//               type="text"
//               value={searchId}
//               onChange={(e) => setSearchId(e.target.value)}
//               placeholder="Enter beneficiary ID or phone number"
//               className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={verifyLoading || !searchId}
//             variant="primary"
//             fullWidth
//             loading={verifyLoading}
//           >
//             Continue
//           </Button>
//         </form>

//         {distError && (
//           <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//             {distError}
//           </div>
//         )}
//       </div>

//       {/* Recent Distributions */}
//       {distributions.length > 0 && (
//         <div className="mt-8 bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Distributions</h2>
//           <div className="space-y-4">
//             {distributions.slice(0, 5).map((dist) => (
//               <div key={dist.id} className="border-b border-gray-200 pb-4">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="font-medium text-gray-900">{dist.beneficiaryName}</p>
//                     <p className="text-sm text-gray-600">
//                       {dist.type.toUpperCase()} - {dist.amount} {dist.currency || 'units'}
//                     </p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                     dist.status === 'synced' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {dist.status}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {new Date(dist.timestamp).toLocaleString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Distribute;



import React, { useState } from 'react';
import { useDistribution } from '../hooks/useDistribution';
import { useBeneficiary } from '../hooks/useBeneficiary';
import { BeneficiaryCard } from '../components/BeneficiaryCard';
import { Button } from '../../../shared/components/Common';

const Distribute: React.FC = () => {
  const { distributeAid, loading: distLoading, error: distError, distributions } = useDistribution();
  const { beneficiary, verify, loading: verifyLoading, error: verifyError, clearBeneficiary } = useBeneficiary();
  
  const [searchId, setSearchId] = useState('');
  const [step, setStep] = useState<'search' | 'confirm'>('search');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    try {
      // Step 1: Check if the beneficiary exists/is eligible on-chain
      await verify(searchId);
      setStep('confirm');
    } catch (err) {
      // Error handled by useBeneficiary hook
    }
  };

  const handleConfirmDistribution = async () => {
    if (!beneficiary) return;

    try {
      // Step 2: Trigger the disbursement contract
      await distributeAid(beneficiary);
      alert("Success! Aid distributed and recorded on-chain.");
      
      // Reset for next distribution
      setStep('search');
      setSearchId('');
      clearBeneficiary();
    } catch (err) {
      // Error handled by useDistribution hook
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Aid Distribution Portal</h1>

      {step === 'search' ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Step 1: Scan & Verify Beneficiary</h2>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fingerprint Nullifier (Hex Hash)
              </label>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="0x..."
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
              />
            </div>
            <Button 
              type="submit" 
              fullWidth 
              loading={verifyLoading}
              disabled={!searchId}
            >
              Verify Identity
            </Button>
          </form>
          {verifyError && <p className="mt-3 text-red-600 text-sm">{verifyError}</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-medium">Step 2: Confirm Distribution</h2>
             <button onClick={() => setStep('search')} className="text-blue-600 text-sm">Cancel</button>
          </div>

          {beneficiary && <BeneficiaryCard beneficiary={beneficiary} />}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              Note: This action will deduct 1 unit from Program Budget and transfer it to the beneficiary.
            </p>
          </div>

          <Button 
            onClick={handleConfirmDistribution} 
            loading={distLoading} 
            variant="primary" 
            fullWidth
          >
            Confirm & Distribute Aid
          </Button>
          {distError && <p className="text-red-600 text-sm">{distError}</p>}
        </div>
      )}

      {/* Recent History Table */}
      {distributions.length > 0 && (
        <div className="mt-12">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Your Activity Today</h3>
          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-200">
              {distributions.map((dist) => (
                <li key={dist.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{dist.beneficiaryName}</p>
                    <p className="text-xs text-gray-500">{new Date(dist.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-red-600 font-mono font-bold">-1 Unit</span>
                    <p className="text-[10px] text-green-600 font-bold uppercase">{dist.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Distribute;