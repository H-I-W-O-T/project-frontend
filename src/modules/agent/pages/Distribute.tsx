

// import React, { useState } from 'react';
// import { useDistribution } from '../hooks/useDistribution';
// import { useBeneficiary } from '../hooks/useBeneficiary';
// import { BeneficiaryCard } from '../components/BeneficiaryCard';
// import { Button } from '../../../shared/components/Common';

// const Distribute: React.FC = () => {
//   const { distributeAid, loading: distLoading, error: distError, distributions } = useDistribution();
//   const { beneficiary, verify, loading: verifyLoading, error: verifyError, clearBeneficiary } = useBeneficiary();
  
//   const [searchId, setSearchId] = useState('');
//   const [step, setStep] = useState<'search' | 'confirm'>('search');

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchId) return;

//     try {
//       // Step 1: Check if the beneficiary exists/is eligible on-chain
//       await verify(searchId);
//       setStep('confirm');
//     } catch (err) {
//       // Error handled by useBeneficiary hook
//     }
//   };

//   const handleConfirmDistribution = async () => {
//     if (!beneficiary) return;

//     try {
//       // Step 2: Trigger the disbursement contract
//       await distributeAid(beneficiary);
//       alert("Success! Aid distributed and recorded on-chain.");
      
//       // Reset for next distribution
//       setStep('search');
//       setSearchId('');
//       clearBeneficiary();
//     } catch (err) {
//       // Error handled by useDistribution hook
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Aid Distribution Portal</h1>

//       {step === 'search' ? (
//         <div className="bg-white shadow rounded-lg p-6">
//           <h2 className="text-lg font-medium mb-4">Step 1: Scan & Verify Beneficiary</h2>
//           <form onSubmit={handleVerify} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Fingerprint Nullifier (Hex Hash)
//               </label>
//               <input
//                 type="text"
//                 value={searchId}
//                 onChange={(e) => setSearchId(e.target.value)}
//                 placeholder="0x..."
//                 className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500"
//               />
//             </div>
//             <Button 
//               type="submit" 
//               fullWidth 
//               loading={verifyLoading}
//               disabled={!searchId}
//             >
//               Verify Identity
//             </Button>
//           </form>
//           {verifyError && <p className="mt-3 text-red-600 text-sm">{verifyError}</p>}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//              <h2 className="text-lg font-medium">Step 2: Confirm Distribution</h2>
//              <button onClick={() => setStep('search')} className="text-blue-600 text-sm">Cancel</button>
//           </div>

//           {beneficiary && <BeneficiaryCard beneficiary={beneficiary} />}

//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//             <p className="text-sm text-blue-800 font-medium">
//               Note: This action will deduct 1 unit from Program Budget and transfer it to the beneficiary.
//             </p>
//           </div>

//           <Button 
//             onClick={handleConfirmDistribution} 
//             loading={distLoading} 
//             variant="primary" 
//             fullWidth
//           >
//             Confirm & Distribute Aid
//           </Button>
//           {distError && <p className="text-red-600 text-sm">{distError}</p>}
//         </div>
//       )}

//       {/* Recent History Table */}
//       {distributions.length > 0 && (
//         <div className="mt-12">
//           <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Your Activity Today</h3>
//           <div className="bg-white shadow overflow-hidden rounded-md">
//             <ul className="divide-y divide-gray-200">
//               {distributions.map((dist) => (
//                 <li key={dist.id} className="p-4 flex justify-between items-center">
//                   <div>
//                     <p className="text-sm font-bold text-gray-900">{dist.beneficiaryName}</p>
//                     <p className="text-xs text-gray-500">{new Date(dist.timestamp).toLocaleTimeString()}</p>
//                   </div>
//                   <div className="text-right">
//                     <span className="text-red-600 font-mono font-bold">-1 Unit</span>
//                     <p className="text-[10px] text-green-600 font-bold uppercase">{dist.status}</p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Distribute;

//v2


// // pages/Distribute.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDistribution } from '../hooks/useDistribution';
// import { useBeneficiary } from '../hooks/useBeneficiary';
// import { usePrograms } from '../hooks/usePrograms';
// import { useWallet } from '../../../shared/hooks/useWallet';
// import { BeneficiaryCard } from '../components/BeneficiaryCard';
// import { Button } from '../../../shared/components/Common';
// import { useLocation as useGeoLocation } from '../hooks/useLocation';

// const Distribute: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const nullifierFromUrl = queryParams.get('nullifier');
//   const programIdFromUrl = queryParams.get('program');

//   console.log('=== Distribute Page Loaded ===');
//   console.log('URL Params - nullifier:', nullifierFromUrl);
//   console.log('URL Params - programId:', programIdFromUrl);

//   const { 
//     distribute, 
//     loading: distLoading, 
//     error: distError, 
//     distributions,
//     loadDistributions 
//   } = useDistribution();
  
//   const { 
//     beneficiary, 
//     getBeneficiaryByNullifier,
//     clearBeneficiary,
//     loading: beneficiaryLoading 
//   } = useBeneficiary();
  
//   const { getProgramById, programs, fetchPrograms, loading: programsLoading } = usePrograms();
//   const { publicKey, connectWallet, callContract } = useWallet();
//   const { location: geoLocation, getCurrentLocation, loading: locationLoading } = useGeoLocation();
  
//   const [selectedProgram, setSelectedProgram] = useState<any>(null);
//   const [distributing, setDistributing] = useState(false);
//   const [txHash, setTxHash] = useState<string | null>(null);
//   const [step, setStep] = useState<'initial' | 'ready' | 'success'>('initial');
//   const [loadingBeneficiary, setLoadingBeneficiary] = useState(false);

//   // Load programs on mount
//   useEffect(() => {
//     console.log('Fetching programs...');
//     fetchPrograms();
//   }, []);

//   // Load beneficiary from URL params when coming back from verification
//   // useEffect(() => {
//   //   const loadBeneficiaryAndProgram = async () => {
//   //     console.log('Checking URL params for data...');
      
//   //     if (nullifierFromUrl) {
//   //       console.log('Loading beneficiary from URL:', nullifierFromUrl);
//   //       setLoadingBeneficiary(true);
        
//   //       try {
//   //         const beneficiaryData = await getBeneficiaryByNullifier(nullifierFromUrl);
//   //         console.log('Beneficiary data from localStorage:', beneficiaryData);
          
//   //         if (beneficiaryData) {
//   //           console.log('Beneficiary loaded successfully:', beneficiaryData.fullName);
//   //           setStep('ready');
//   //         } else {
//   //           console.log('No beneficiary found for nullifier:', nullifierFromUrl);
//   //           setStep('initial');
//   //         }
//   //       } catch (err) {
//   //         console.error('Error loading beneficiary:', err);
//   //         setStep('initial');
//   //       } finally {
//   //         setLoadingBeneficiary(false);
//   //       }
//   //     } else {
//   //       console.log('No nullifier in URL, showing initial state');
//   //       setStep('initial');
//   //     }
      
//   //     if (programIdFromUrl) {
//   //       console.log('Loading program from URL:', programIdFromUrl);
//   //       // Small delay to ensure programs are loaded
//   //       setTimeout(() => {
//   //         const program = getProgramById(programIdFromUrl);
//   //         console.log('Program found:', program);
//   //         if (program) {
//   //           setSelectedProgram(program);
//   //         } else {
//   //           console.log('Program not found for ID:', programIdFromUrl);
//   //           console.log('Available programs:', programs);
//   //         }
//   //       }, 500);
//   //     }
//   //   };
    
//   //   loadBeneficiaryAndProgram();
//   // }, [nullifierFromUrl, programIdFromUrl, getBeneficiaryByNullifier, getProgramById, programs]);

//   // In Distribute.tsx, replace the useEffect with this:

// // Load beneficiary from URL params when coming back from verification
// useEffect(() => {
//   const loadBeneficiaryAndProgram = async () => {
//     console.log('=== Loading Beneficiary and Program ===');
//     console.log('URL nullifier:', nullifierFromUrl);
//     console.log('URL programId:', programIdFromUrl);
    
//     if (nullifierFromUrl) {
//       console.log('Loading beneficiary from URL:', nullifierFromUrl);
//       setLoadingBeneficiary(true);
      
//       try {
//         // This will update the hook's beneficiary state via setBeneficiary
//         const beneficiaryData = await getBeneficiaryByNullifier(nullifierFromUrl);
//         console.log('Beneficiary data result:', beneficiaryData);
        
//         if (!beneficiaryData) {
//           console.log('No beneficiary found for nullifier:', nullifierFromUrl);
//           setStep('initial');
//         }
//       } catch (err) {
//         console.error('Error loading beneficiary:', err);
//         setStep('initial');
//       } finally {
//         setLoadingBeneficiary(false);
//       }
//     } else {
//       console.log('No nullifier in URL, showing initial state');
//       setStep('initial');
//     }
    
//     if (programIdFromUrl) {
//       console.log('Loading program from URL:', programIdFromUrl);
//       setTimeout(() => {
//         const program = getProgramById(programIdFromUrl);
//         console.log('Program found:', program);
//         if (program) {
//           setSelectedProgram(program);
//         } else {
//           console.log('Program not found for ID:', programIdFromUrl);
//         }
//       }, 500);
//     }
//   };
  
//   loadBeneficiaryAndProgram();
// }, [nullifierFromUrl, programIdFromUrl, getBeneficiaryByNullifier, getProgramById]);

// // Watch for beneficiary changes from the hook
// useEffect(() => {
//   console.log('Beneficiary state updated in component:', beneficiary);
//   if (beneficiary) {
//     console.log('✅ Beneficiary is now set, moving to ready state');
//     setStep('ready');
//   }
// }, [beneficiary]);

//   // Helper function to convert hex to bytes32
//   const hexToBytes32 = (hex: string): Uint8Array => {
//     const cleanHex = hex.replace('0x', '').padStart(64, '0');
//     const array = new Uint8Array(32);
//     for (let i = 0; i < 32; i++) {
//       array[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
//     }
//     return array;
//   };

//   // Handle verify button click - go to verification page
//   const handleVerify = () => {
//     navigate('/agent/verify');
//   };

//   // Handle distribution
//   const handleDistribute = async () => {
//     console.log('Starting distribution...');
//     console.log('Beneficiary:', beneficiary);
//     console.log('Selected Program:', selectedProgram);
//     console.log('Geo Location:', geoLocation);
    
//     if (!beneficiary) {
//       alert('No beneficiary selected. Please verify first.');
//       return;
//     }

//     if (!selectedProgram) {
//       alert('No program selected. Please select a program.');
//       return;
//     }

//     if (!geoLocation) {
//       alert('Please enable location services to proceed with distribution.');
//       await getCurrentLocation();
//       return;
//     }

//     setDistributing(true);
    
//     try {
//       // Connect wallet if not connected
//       let agentAddress = publicKey;
//       if (!agentAddress) {
//         agentAddress = await connectWallet();
//       }
//       console.log('Agent address:', agentAddress);

//       // Get contract addresses from env
//       const DISBURSEMENT_CONTRACT_ID = import.meta.env.VITE_DISBURSEMENT_ADDRESS ?? "";
//       console.log('Disbursement contract:', DISBURSEMENT_CONTRACT_ID);
      
//       if (!DISBURSEMENT_CONTRACT_ID) {
//         throw new Error("VITE_DISBURSEMENT_ADDRESS is missing in .env");
//       }

//       // Convert parameters to contract format
//       const programIdBytes = hexToBytes32(selectedProgram.programId);
//       const nullifierBytes = hexToBytes32(beneficiary.nullifierHash);
      
//       // Create location object for contract
//       const locationForContract = {
//         lat: geoLocation.latitude,
//         lon: geoLocation.longitude
//       };

//       console.log('Calling distribute with:', {
//         contractId: DISBURSEMENT_CONTRACT_ID,
//         method: "distribute",
//         args: [
//           agentAddress,
//           programIdBytes,
//           nullifierBytes,
//           locationForContract,
//           null // batchId (optional)
//         ]
//       });

//       // Call the disbursement contract's distribute method
//       const result = await callContract({
//         contractId: DISBURSEMENT_CONTRACT_ID,
//         method: "distribute",
//         args: [
//           agentAddress,
//           programIdBytes,
//           nullifierBytes,
//           locationForContract,
//           null // batchId (optional)
//         ],
//         address: agentAddress
//       });

//       console.log('Distribution result:', result);
//       setTxHash(result?.txHash || 'success');
      
//       // Record distribution locally
//       await distribute({
//         beneficiaryId: beneficiary.id,
//         type: 'cash',
//         amount: Number(selectedProgram.amountPerPerson),
//         notes: `Program: ${selectedProgram.name || selectedProgram.programId}`
//       });
      
//       setStep('success');
      
//       // Clear the URL parameters after successful distribution
//       navigate('/agent/distribute', { replace: true });
      
//     } catch (err: any) {
//       console.error('Distribution error:', err);
//       alert(`Distribution failed: ${err.message || 'Unknown error'}`);
//     } finally {
//       setDistributing(false);
//     }
//   };

//   // Reset everything
//   const handleNewDistribution = () => {
//     clearBeneficiary();
//     setSelectedProgram(null);
//     setStep('initial');
//     setTxHash(null);
//     navigate('/agent/distribute', { replace: true });
//   };

//   // Render loading state
//   if (beneficiaryLoading || programsLoading || loadingBeneficiary) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         <div className="bg-white shadow rounded-lg p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Render initial state (no beneficiary verified)
//   const renderInitialState = () => {
//     return (
//       <div className="bg-white shadow rounded-lg p-8 text-center">
//         <div className="mb-6">
//           <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//           </svg>
//         </div>
//         <h2 className="text-xl font-semibold text-gray-900 mb-2">No Beneficiary Verified</h2>
//         <p className="text-gray-600 mb-6">
//           Please verify a beneficiary first before proceeding with distribution.
//         </p>
//         <Button onClick={handleVerify} variant="primary" size="lg">
//           Verify Beneficiary
//         </Button>
//       </div>
//     );
//   };

//   // Render ready state (beneficiary verified and program selected)
//   const renderReadyState = () => {
//     if (!beneficiary) {
//       console.log('No beneficiary in ready state, showing initial');
//       return renderInitialState();
//     }

//     console.log('Rendering ready state with beneficiary:', beneficiary.fullName);
//     console.log('Selected program:', selectedProgram);

//     return (
//       <div className="space-y-6">
//         {/* Success Banner */}
//         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="text-green-800 font-medium">Beneficiary Verified ✓</p>
//           </div>
//           <p className="text-sm text-green-700 mt-1">
//             Ready to distribute aid to {beneficiary.fullName}
//           </p>
//         </div>

//         {/* Beneficiary Card */}
//         <BeneficiaryCard beneficiary={beneficiary} />

//         {/* Selected Program Display */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Aid Program</h3>
          
//           {selectedProgram ? (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-sm font-medium text-blue-900">Program Details</p>
//                   <p className="text-blue-800 font-medium">
//                     {selectedProgram.name || selectedProgram.programId.substring(0, 20)}...
//                   </p>
//                   <p className="text-sm text-blue-700 mt-1">
//                     Amount: {selectedProgram.amountPerPerson} tokens
//                   </p>
//                   <p className="text-xs text-blue-600 mt-1">
//                     Frequency: Every {selectedProgram.frequencyDays} days
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setSelectedProgram(null);
//                     navigate('/agent/verify');
//                   }}
//                   className="text-sm text-blue-600 hover:text-blue-800"
//                 >
//                   Change Program
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-6">
//               <p className="text-gray-600 mb-4">No program selected</p>
//               <Button onClick={() => navigate('/agent/verify')} variant="secondary">
//                 Select Program
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Location Check */}
//         <div className="bg-white shadow rounded-lg p-6">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Location Verification</h3>
          
//           {geoLocation ? (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//               <div className="flex items-center">
//                 <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 <p className="text-green-800 font-medium">Location Available</p>
//               </div>
//               <p className="text-sm text-green-700 mt-1">
//                 Lat: {geoLocation.latitude.toFixed(6)}, Lon: {geoLocation.longitude.toFixed(6)}
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <p className="text-yellow-800">Location not available. Please enable location services.</p>
//               </div>
//               <Button onClick={getCurrentLocation} variant="secondary" loading={locationLoading}>
//                 Get Current Location
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Distribution Summary */}
//         {selectedProgram && geoLocation && (
//           <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//             <h3 className="font-medium text-gray-900 mb-3">Distribution Summary</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Beneficiary:</span>
//                 <span className="font-medium">{beneficiary.fullName}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">National ID:</span>
//                 <span className="font-medium">{beneficiary.nationalId}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Program:</span>
//                 <span className="font-medium">{selectedProgram.name || selectedProgram.programId.substring(0, 20)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Amount:</span>
//                 <span className="font-medium text-green-600">{selectedProgram.amountPerPerson} tokens</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Location:</span>
//                 <span className="font-medium">{geoLocation.latitude.toFixed(4)}, {geoLocation.longitude.toFixed(4)}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {distError && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//             {distError}
//           </div>
//         )}

//         <div className="flex gap-4">
//           <Button
//             onClick={handleDistribute}
//             disabled={distributing || !selectedProgram || !geoLocation}
//             variant="primary"
//             fullWidth
//             loading={distributing}
//             size="lg"
//           >
//             {distributing ? 'Processing Distribution...' : 'Confirm & Distribute'}
//           </Button>
//           <Button
//             onClick={handleNewDistribution}
//             variant="secondary"
//             fullWidth
//           >
//             Start Over
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   // Render success state
//   const renderSuccessState = () => {
//     return (
//       <div className="bg-white shadow rounded-lg p-8 text-center">
//         <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
//           <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Distribution Successful!</h2>
//         <p className="text-gray-600 mb-4">
//           Aid has been successfully distributed and recorded on the blockchain.
//         </p>
        
//         {beneficiary && (
//           <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
//             <p className="text-sm font-medium text-gray-700">Beneficiary:</p>
//             <p className="font-semibold">{beneficiary.fullName}</p>
//             <p className="text-sm text-gray-600 mt-2">Amount: {selectedProgram?.amountPerPerson} tokens</p>
//             {txHash && (
//               <p className="text-xs text-gray-500 mt-2 font-mono break-all">
//                 Tx: {txHash}
//               </p>
//             )}
//           </div>
//         )}
        
//         <div className="flex gap-4">
//           <Button
//             onClick={handleNewDistribution}
//             variant="primary"
//             fullWidth
//           >
//             New Distribution
//           </Button>
//           <Button
//             onClick={() => navigate('/agent/dashboard')}
//             variant="secondary"
//             fullWidth
//           >
//             Back to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   console.log('Current step:', step);

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-2">Aid Distribution</h1>
//       <p className="text-gray-600 mb-6">
//         {step === 'initial' && 'Step 1: Verify beneficiary'}
//         {step === 'ready' && 'Step 2: Confirm and complete distribution'}
//         {step === 'success' && 'Distribution Complete'}
//       </p>

//       {step === 'initial' && renderInitialState()}
//       {step === 'ready' && renderReadyState()}
//       {step === 'success' && renderSuccessState()}

//       {/* Debug Info */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
//           <p className="font-bold mb-2">Debug Info:</p>
//           <p>Step: {step}</p>
//           <p>Beneficiary: {beneficiary?.fullName || 'null'}</p>
//           <p>Selected Program: {selectedProgram?.name || 'null'}</p>
//           <p>Nullifier from URL: {nullifierFromUrl || 'null'}</p>
//           <p>Program ID from URL: {programIdFromUrl || 'null'}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Distribute;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDistribution } from '../hooks/useDistribution';
import { useBeneficiary } from '../hooks/useBeneficiary';
import { usePrograms } from '../hooks/usePrograms';
import { useWallet } from '../../../shared/hooks/useWallet';
import { BeneficiaryCard } from '../components/BeneficiaryCard';
import { Button } from '../../../shared/components/Common';
import { useLocation as useGeoLocation } from '../hooks/useLocation';

const Distribute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const nullifierFromUrl = queryParams.get('nullifier');
  const programIdFromUrl = queryParams.get('program');

  const { distribute, error: distError } = useDistribution();

  const {
    beneficiary,
    getBeneficiaryByNullifier,
    clearBeneficiary
  } = useBeneficiary();

  const {
    getProgramById,
    programs,
    fetchPrograms,
    loading: programsLoading
  } = usePrograms();

  const { publicKey, connectWallet, callContract } = useWallet();

  const {
    location: geoLocation,
    getCurrentLocation,
    loading: locationLoading
  } = useGeoLocation();

  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [loadingBeneficiary, setLoadingBeneficiary] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // ✅ STEP is DERIVED (no more bugs)
  const step = !beneficiary
    ? 'initial'
    : txHash
    ? 'success'
    : 'ready';

  // ✅ Load programs once
  useEffect(() => {
    fetchPrograms();
  }, []);

  // ✅ Load beneficiary from URL (ONLY ONCE)
  useEffect(() => {
    const load = async () => {
      if (!nullifierFromUrl) return;

      setLoadingBeneficiary(true);

      try {
        await getBeneficiaryByNullifier(nullifierFromUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBeneficiary(false);
      }
    };

    load();
  }, [nullifierFromUrl]);

  // ✅ Load program when programs ready
  useEffect(() => {
    if (programIdFromUrl && programs.length > 0) {
      const program = getProgramById(programIdFromUrl);
      if (program) setSelectedProgram(program);
    }
  }, [programIdFromUrl, programs]);

  // ✅ Convert hex → bytes32
  const hexToBytes32 = (hex: string): Uint8Array => {
    const cleanHex = hex.replace('0x', '').padStart(64, '0');
    const array = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      array[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
    }
    return array;
  };

  // ✅ Navigate to verify
  const handleVerify = () => {
    navigate('/agent/verify');
  };

  // ✅ DISTRIBUTE
  const handleDistribute = async () => {
    if (!beneficiary || !selectedProgram) {
      alert('Missing data');
      return;
    }

    if (!geoLocation) {
      await getCurrentLocation();
      return;
    }

    setDistributing(true);

    try {
      let agentAddress = publicKey || await connectWallet();

      const contractId = import.meta.env.VITE_DISBURSEMENT_ADDRESS;

      // const result = await callContract({
      //   contractId,
      //   method: "distribute",
      //   args: [
      //     agentAddress,
      //     hexToBytes32(selectedProgram.programId),
      //     hexToBytes32(beneficiary.nullifierHash),
      //     {
      //       lat: geoLocation.latitude,
      //       lon: geoLocation.longitude
      //     },
      //     null
      //   ],
      //   address: agentAddress
      // });

      const result = await callContract({
  contractId,
  method: "distribute",
  args: [
    agentAddress,
    hexToBytes32(selectedProgram.programId),
    hexToBytes32(beneficiary.nullifierHash),
    {
      lat: BigInt(Math.floor(geoLocation.latitude * 1_000_000)),
      lon: BigInt(Math.floor(geoLocation.longitude * 1_000_000))
    },
    null
  ],
  address: agentAddress
});

      setTxHash(result?.txHash || 'success');

      await distribute({
        beneficiaryId: beneficiary.id,
        type: 'cash',
        amount: Number(selectedProgram.amountPerPerson),
        notes: selectedProgram.name
      });

      // clear URL
      navigate('/agent/distribute', { replace: true });

    } catch (err: any) {
      alert(err.message);
    } finally {
      setDistributing(false);
    }
  };

  // ✅ RESET
  const handleReset = () => {
    clearBeneficiary();
    setSelectedProgram(null);
    setTxHash(null);
    navigate('/agent/distribute', { replace: true });
  };

  // ✅ LOADING STATE (FIXED)
  if (loadingBeneficiary || programsLoading) {
    return (
      <div className="text-center py-10">Loading...</div>
    );
  }

  // ================= UI =================

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Aid Distribution</h1>

      {step === 'initial' && (
        <div className="text-center">
          <p>No Beneficiary Verified</p>
          <Button onClick={handleVerify}>Verify Beneficiary</Button>
        </div>
      )}

      {step === 'ready' && beneficiary && (
        <div className="space-y-6">

          <BeneficiaryCard beneficiary={beneficiary} />

          {/* Program */}
          {selectedProgram ? (
            <div>
              <p>{selectedProgram.name}</p>
              <p>{selectedProgram.amountPerPerson} tokens</p>
            </div>
          ) : (
            <Button onClick={handleVerify}>Select Program</Button>
          )}

          {/* Location */}
          {geoLocation ? (
            <p>
              Location: {geoLocation.latitude}, {geoLocation.longitude}
            </p>
          ) : (
            <Button onClick={getCurrentLocation} loading={locationLoading}>
              Get Location
            </Button>
          )}

          <Button
            onClick={handleDistribute}
            disabled={!selectedProgram || !geoLocation}
            loading={distributing}
          >
            Distribute
          </Button>

          <Button onClick={handleReset} variant="secondary">
            Reset
          </Button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center">
          <h2>Success ✅</h2>
          <p>{beneficiary?.fullName}</p>
          <p>Tx: {txHash}</p>

          <Button onClick={handleReset}>New Distribution</Button>
        </div>
      )}

      {distError && <p className="text-red-500">{distError}</p>}
    </div>
  );
};

export default Distribute;