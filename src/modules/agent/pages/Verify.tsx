// // pages/Verify.tsx
// import React, { useState } from 'react';
// import { useBeneficiary } from '../hooks/useBeneficiary';
// import { BiometricScanner } from '../components/BiometricScanner';
// import { BeneficiaryCard } from '../components/BeneficiaryCard';
// import { Button } from '../../../shared/components/Common';

// const Verify: React.FC = () => {
//   const { verify, verifyBiometric, beneficiary, loading, error, clearBeneficiary } = useBeneficiary();
//   const [searchType, setSearchType] = useState<'id' | 'biometric'>('id');
//   const [identifier, setIdentifier] = useState('');

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchType === 'id') {
//       await verify(identifier);
//     }
//   };

//   const handleBiometricVerify = async (fingerprintHash: string) => {
//     try {
//       await verifyBiometric(fingerprintHash);
//     } catch (err) {
//       console.error('Verification failed:', err);
//     }
//   };

//   const handleNewSearch = () => {
//     clearBeneficiary();
//     setIdentifier('');
//   };

//   if (beneficiary) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         <BeneficiaryCard beneficiary={beneficiary} />
//         <div className="mt-6 flex gap-4">
//           <Button
//             onClick={handleNewSearch}
//             variant="primary"
//             fullWidth
//           >
//             New Verification
//           </Button>
//           <Button
//             onClick={() => window.location.href = '/agent/distribute'}
//             variant="success"
//             fullWidth
//           >
//             Proceed to Distribution
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Verify Beneficiary</h1>

//       {/* Verification Method Toggle */}
//       <div className="mb-6">
//         <div className="flex gap-4 border-b border-gray-200">
//           <button
//             onClick={() => setSearchType('id')}
//             className={`py-2 px-4 font-medium text-sm ${
//               searchType === 'id'
//                 ? 'border-b-2 border-blue-500 text-blue-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Search by ID/Phone
//           </button>
//           <button
//             onClick={() => setSearchType('biometric')}
//             className={`py-2 px-4 font-medium text-sm ${
//               searchType === 'biometric'
//                 ? 'border-b-2 border-blue-500 text-blue-600'
//                 : 'text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             Biometric Scan
//           </button>
//         </div>
//       </div>

//       {searchType === 'id' ? (
//         <form onSubmit={handleSearch} className="bg-white shadow rounded-lg p-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Beneficiary ID or Phone Number
//             </label>
//             <input
//               type="text"
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               placeholder="Enter BEN-XXX or phone number"
//               className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>

//           {error && (
//             <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           <Button
//             type="submit"
//             disabled={loading || !identifier}
//             variant="primary"
//             fullWidth
//             loading={loading}
//           >
//             Verify Beneficiary
//           </Button>
//         </form>
//       ) : (
//         <div className="bg-white shadow rounded-lg p-6">
//           <p className="text-sm text-gray-600 mb-4">
//             Place your finger on the scanner to verify identity
//           </p>
//           <BiometricScanner onCapture={handleBiometricVerify} />
//           {loading && <p className="mt-4 text-center text-gray-600">Verifying...</p>}
//           {error && (
//             <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Verify;



// // pages/Verify.tsx
// import React, { useState } from 'react';
// import { useBeneficiary } from '../hooks/useBeneficiary';
// import { usePrograms } from '../hooks/usePrograms';
// import { BiometricScanner } from '../components/BiometricScanner';
// import { BeneficiaryCard } from '../components/BeneficiaryCard';
// import { Button } from '../../../shared/components/Common';
// import { useLocation } from '../hooks/useLocation';

// interface SearchResult {
//   nullifierHash: string;
//   beneficiaryData: any;
// }

// const Verify: React.FC = () => {
//   const { 
//     verifyBiometric, 
//     beneficiary, 
//     loading, 
//     error, 
//     clearBeneficiary,
//     verifyByNationalId,
//     verifyByPhoneNumber,
//     getBeneficiaryByNullifier
//   } = useBeneficiary();
  
//   const { programs, getActivePrograms } = usePrograms();
//   const { location, getCurrentLocation, loading: locationLoading } = useLocation();
  
//   const [searchType, setSearchType] = useState<'biometric' | 'nationalId' | 'phone'>('biometric');
//   const [searchValue, setSearchValue] = useState('');
//   const [selectedProgram, setSelectedProgram] = useState<string>('');
//   const [verificationStep, setVerificationStep] = useState<'search' | 'program' | 'location' | 'complete'>('search');
//   const [verifiedNullifier, setVerifiedNullifier] = useState<string>('');
//   const [localError, setLocalError] = useState<string | null>(null);
//   const [searchLoading, setSearchLoading] = useState(false);

//   // Handle search by National ID
//   const handleSearchByNationalId = async () => {
//     if (!searchValue.trim()) {
//       setLocalError('Please enter a National ID');
//       return;
//     }
    
//     setSearchLoading(true);
//     setLocalError(null);
    
//     try {
//       const result = await verifyByNationalId(searchValue);
//       if (result.isValid && result.nullifierHash) {
//         setVerifiedNullifier(result.nullifierHash);
//         setVerificationStep('program');
//       } else {
//         setLocalError('Beneficiary not found with this National ID');
//       }
//     } catch (err: any) {
//       setLocalError(err.message || 'Search failed');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   // Handle search by Phone Number
//   const handleSearchByPhone = async () => {
//     if (!searchValue.trim()) {
//       setLocalError('Please enter a phone number');
//       return;
//     }
    
//     setSearchLoading(true);
//     setLocalError(null);
    
//     try {
//       const result = await verifyByPhoneNumber(searchValue);
//       if (result.isValid && result.nullifierHash) {
//         setVerifiedNullifier(result.nullifierHash);
//         setVerificationStep('program');
//       } else {
//         setLocalError('Beneficiary not found with this phone number');
//       }
//     } catch (err: any) {
//       setLocalError(err.message || 'Search failed');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   // Handle biometric verification
//   const handleBiometricVerify = async (fingerprintHash: string) => {
//     setLocalError(null);
//     setSearchLoading(true);
//     try {
//       const isValid = await verifyBiometric(fingerprintHash);
      
//       if (isValid) {
//         const beneficiaryData = await getBeneficiaryByNullifier(fingerprintHash);
//         if (beneficiaryData) {
//           setVerifiedNullifier(fingerprintHash);
//           setVerificationStep('program');
//         } else {
//           setLocalError('Beneficiary found on blockchain but no local data found');
//         }
//       } else {
//         setLocalError('Beneficiary not found or inactive');
//       }
//     } catch (err: any) {
//       console.error('Verification failed:', err);
//       setLocalError(err.message || 'Verification failed');
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   // Handle program selection for distribution
//   const handleProgramSelect = (programId: string) => {
//     setSelectedProgram(programId);
//     setVerificationStep('location');
//   };

//   // Handle location verification and proceed to distribution
//   const handleLocationCheck = async () => {
//     if (!location) {
//       await getCurrentLocation();
//       return;
//     }
    
//     setVerificationStep('complete');
//   };

//   const handleNewSearch = () => {
//     clearBeneficiary();
//     setVerificationStep('search');
//     setSelectedProgram('');
//     setVerifiedNullifier('');
//     setSearchValue('');
//     setLocalError(null);
//   };

//   const activePrograms = getActivePrograms();

//   // Render search interface
//   const renderSearchInterface = () => {
//     return (
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Find Beneficiary</h2>
        
//         {/* Search Type Tabs */}
//         <div className="mb-6">
//           <div className="flex gap-2 border-b border-gray-200">
//             <button
//               onClick={() => setSearchType('biometric')}
//               className={`py-2 px-4 font-medium text-sm transition-colors ${
//                 searchType === 'biometric'
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
//               </svg>
//               Biometric
//             </button>
//             <button
//               onClick={() => setSearchType('nationalId')}
//               className={`py-2 px-4 font-medium text-sm transition-colors ${
//                 searchType === 'nationalId'
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
//               </svg>
//               National ID
//             </button>
//             <button
//               onClick={() => setSearchType('phone')}
//               className={`py-2 px-4 font-medium text-sm transition-colors ${
//                 searchType === 'phone'
//                   ? 'border-b-2 border-blue-500 text-blue-600'
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//               </svg>
//               Phone Number
//             </button>
//           </div>
//         </div>

//         {/* Search Input */}
//         {searchType === 'biometric' ? (
//           <div>
//             <p className="text-sm text-gray-600 mb-4">
//               Place your finger on the scanner to verify identity
//             </p>
//             <BiometricScanner onCapture={handleBiometricVerify} disabled={searchLoading} />
//             {searchLoading && <p className="mt-4 text-center text-gray-600">Verifying...</p>}
//           </div>
//         ) : (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {searchType === 'nationalId' ? 'National ID Number' : 'Phone Number'}
//             </label>
//             <input
//               type={searchType === 'phone' ? 'tel' : 'text'}
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//               placeholder={searchType === 'nationalId' ? 'e.g., 123456789' : 'e.g., +251 912 345 678'}
//               className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   searchType === 'nationalId' ? handleSearchByNationalId() : handleSearchByPhone();
//                 }
//               }}
//             />
//             <Button
//               onClick={searchType === 'nationalId' ? handleSearchByNationalId : handleSearchByPhone}
//               disabled={searchLoading || !searchValue.trim()}
//               variant="primary"
//               fullWidth
//               loading={searchLoading}
//               className="mt-4"
//             >
//               Search Beneficiary
//             </Button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render program selection
//   const renderProgramSelection = () => {
//     return (
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Select Aid Program</h2>
        
//         {beneficiary && (
//           <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
//             <h3 className="text-sm font-medium text-green-900 mb-2">Verified Beneficiary:</h3>
//             <p className="font-medium text-green-900">{beneficiary.fullName}</p>
//             <p className="text-sm text-green-700">ID: {beneficiary.nationalId}</p>
//             <p className="text-sm text-green-700">Phone: {beneficiary.phoneNumber}</p>
//           </div>
//         )}
        
//         <div className="space-y-3 max-h-96 overflow-y-auto">
//           {activePrograms.map((program) => (
//             <button
//               key={program.programId}
//               onClick={() => handleProgramSelect(program.programId)}
//               className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-medium text-gray-900">
//                     {program.name || program.programId.substring(0, 20)}...
//                   </h3>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Amount: {program.amountPerPerson} tokens
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Frequency: Every {program.frequencyDays} days
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-medium text-gray-900">
//                     Remaining: {program.remainingBudget} / {program.totalBudget}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {Number(program.remainingBudget) >= Number(program.amountPerPerson) 
//                       ? '✅ Available' 
//                       : '❌ Insufficient'}
//                   </p>
//                 </div>
//               </div>
//             </button>
//           ))}
          
//           {activePrograms.length === 0 && (
//             <p className="text-center text-gray-500 py-4">No active programs available</p>
//           )}
//         </div>
        
//         <Button
//           onClick={handleNewSearch}
//           variant="secondary"
//           fullWidth
//           className="mt-6"
//         >
//           Start Over
//         </Button>
//       </div>
//     );
//   };

//   // Render location verification
//   const renderLocationVerification = () => {
//     return (
//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-lg font-medium text-gray-900 mb-4">Location Verification</h2>
//         <p className="text-sm text-gray-600 mb-4">
//           Your location will be verified against the program's geofence
//         </p>
        
//         {location ? (
//           <div className="bg-gray-50 rounded-md p-4 mb-4">
//             <p className="text-sm text-gray-700">
//               <strong>Current Location:</strong><br />
//               Latitude: {location.latitude}<br />
//               Longitude: {location.longitude}<br />
//               {location.accuracy && <span>Accuracy: {location.accuracy}m</span>}
//             </p>
//           </div>
//         ) : (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
//             <p className="text-yellow-800">Location not available. Please enable location services.</p>
//           </div>
//         )}
        
//         <div className="flex gap-4">
//           <Button
//             onClick={handleLocationCheck}
//             disabled={!location && !locationLoading}
//             variant="primary"
//             fullWidth
//             loading={locationLoading}
//           >
//             {!location ? 'Get Location First' : 'Proceed to Distribution'}
//           </Button>
//           <Button
//             onClick={() => setVerificationStep('program')}
//             variant="secondary"
//             fullWidth
//           >
//             Back
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   // Render completion
//   const renderCompletion = () => {
//     return (
//       <div className="bg-white shadow rounded-lg p-6">
//         <div className="text-center">
//           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//             <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="mt-3 text-lg font-medium text-gray-900">Verification Complete!</h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Beneficiary is verified and ready for distribution
//           </p>
          
//           {beneficiary && (
//             <div className="mt-6 p-4 bg-blue-50 rounded-md text-left">
//               <p className="text-sm font-medium text-blue-900 mb-2">Beneficiary Details:</p>
//               <p className="text-sm text-blue-800">
//                 <strong>Name:</strong> {beneficiary.fullName}<br />
//                 <strong>ID:</strong> {beneficiary.nationalId}<br />
//                 <strong>Phone:</strong> {beneficiary.phoneNumber}<br />
//                 <strong>Status:</strong> {beneficiary.isActive ? 'Active ✓' : 'Inactive'}
//               </p>
//             </div>
//           )}
          
//           <div className="mt-6 flex gap-4">
//             <Button
//               onClick={() => {
//                 window.location.href = `/agent/distribute?nullifier=${verifiedNullifier}&program=${selectedProgram}`;
//               }}
//               variant="primary"
//               fullWidth
//             >
//               Go to Distribution
//             </Button>
//             <Button
//               onClick={handleNewSearch}
//               variant="secondary"
//               fullWidth
//             >
//               Verify Another
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const displayError = localError || error;

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Beneficiary</h1>
//       <p className="text-gray-600 mb-6">
//         Search by biometric, national ID, or phone number to verify beneficiary
//       </p>

//       {displayError && (
//         <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//           <p className="font-medium">Verification Error</p>
//           <p className="text-sm">{displayError}</p>
//           <button
//             onClick={() => {
//               setLocalError(null);
//               if (error) clearBeneficiary();
//             }}
//             className="mt-2 text-sm text-red-600 hover:text-red-800"
//           >
//             Dismiss
//           </button>
//         </div>
//       )}

//       {verificationStep === 'search' && renderSearchInterface()}
//       {verificationStep === 'program' && renderProgramSelection()}
//       {verificationStep === 'location' && renderLocationVerification()}
//       {verificationStep === 'complete' && renderCompletion()}
//     </div>
//   );
// };

// export default Verify;


// pages/Verify.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBeneficiary } from '../hooks/useBeneficiary';
import { usePrograms } from '../hooks/usePrograms';
import { BiometricScanner } from '../components/BiometricScanner';
import { Button } from '../../../shared/components/Common';

const Verify: React.FC = () => {
  const navigate = useNavigate();
  const { 
    verifyBiometric, 
    verifyByNationalId,
    verifyByPhoneNumber,
    beneficiary, 
    loading, 
    error, 
    clearBeneficiary 
  } = useBeneficiary();
  
  const { programs, getActivePrograms } = usePrograms();
  
  const [searchType, setSearchType] = useState<'biometric' | 'nationalId' | 'phone'>('biometric');
  const [searchValue, setSearchValue] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const activePrograms = getActivePrograms();

  // Handle search by National ID
  const handleSearchByNationalId = async () => {
    if (!searchValue.trim()) {
      setLocalError('Please enter a National ID');
      return;
    }
    
    setSearchLoading(true);
    setLocalError(null);
    
    try {
      const success = await verifyByNationalId(searchValue);
      if (!success) {
        setLocalError('Beneficiary not found');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search by Phone Number
  const handleSearchByPhone = async () => {
    if (!searchValue.trim()) {
      setLocalError('Please enter a phone number');
      return;
    }
    
    setSearchLoading(true);
    setLocalError(null);
    
    try {
      const success = await verifyByPhoneNumber(searchValue);
      if (!success) {
        setLocalError('Beneficiary not found');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle biometric verification
  const handleBiometricVerify = async (fingerprintHash: string) => {
    setLocalError(null);
    setSearchLoading(true);
    try {
      const success = await verifyBiometric(fingerprintHash);
      if (!success) {
        setLocalError('Beneficiary not found');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Verification failed');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle continue - redirect back to distribution with selected program
  const handleContinue = () => {
    if (beneficiary && selectedProgram) {
      navigate(`/agent/distribute?nullifier=${beneficiary.nullifierHash}&program=${selectedProgram.programId}`);
    }
  };

  // Handle cancel - go back to distribution
  const handleCancel = () => {
    clearBeneficiary();
    navigate('/agent/distribute');
  };

  // Render search interface
  const renderSearchInterface = () => {
    if (beneficiary) {
      // Show beneficiary found and program selection
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Beneficiary Found</h2>
            <button
              onClick={() => {
                clearBeneficiary();
                setSelectedProgram(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-medium text-green-900 mb-2">✅ Verified Beneficiary:</h3>
            <p className="font-medium text-green-900">{beneficiary.fullName}</p>
            <p className="text-sm text-green-700">ID: {beneficiary.nationalId}</p>
            <p className="text-sm text-green-700">Phone: {beneficiary.phoneNumber}</p>
          </div>

          <h3 className="text-md font-medium text-gray-900 mb-3">Select Aid Program</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
            {activePrograms.map((program) => (
              <button
                key={program.programId}
                onClick={() => setSelectedProgram(program)}
                className={`w-full text-left p-4 border rounded-lg transition-all ${
                  selectedProgram?.programId === program.programId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {program.name || program.programId.substring(0, 20)}...
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Amount: {program.amountPerPerson} tokens
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Frequency: Every {program.frequencyDays} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      Remaining: {program.remainingBudget} / {program.totalBudget}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Number(program.remainingBudget) >= Number(program.amountPerPerson) 
                        ? '✅ Available' 
                        : '❌ Insufficient'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedProgram}
              variant="primary"
              fullWidth
            >
              Continue to Distribution
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    // Show search interface
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Find Beneficiary</h2>
          <button
            onClick={handleCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        
        {/* Search Type Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setSearchType('biometric')}
              className={`py-2 px-4 font-medium text-sm transition-colors ${
                searchType === 'biometric'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🔍 Biometric
            </button>
            <button
              onClick={() => setSearchType('nationalId')}
              className={`py-2 px-4 font-medium text-sm transition-colors ${
                searchType === 'nationalId'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🆔 National ID
            </button>
            <button
              onClick={() => setSearchType('phone')}
              className={`py-2 px-4 font-medium text-sm transition-colors ${
                searchType === 'phone'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📞 Phone Number
            </button>
          </div>
        </div>

        {/* Search Input */}
        {searchType === 'biometric' ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Place your finger on the scanner to verify identity
            </p>
            <BiometricScanner onCapture={handleBiometricVerify} disabled={searchLoading} />
            {searchLoading && <p className="mt-4 text-center text-gray-600">Verifying...</p>}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {searchType === 'nationalId' ? 'National ID Number' : 'Phone Number'}
            </label>
            <input
              type={searchType === 'phone' ? 'tel' : 'text'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchType === 'nationalId' ? 'e.g., ETH0001' : 'e.g., 0912345678'}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchType === 'nationalId' ? handleSearchByNationalId() : handleSearchByPhone();
                }
              }}
            />
            <Button
              onClick={searchType === 'nationalId' ? handleSearchByNationalId : handleSearchByPhone}
              disabled={searchLoading || !searchValue.trim()}
              variant="primary"
              fullWidth
              loading={searchLoading}
              className="mt-4"
            >
              Search Beneficiary
            </Button>
          </div>
        )}
      </div>
    );
  };

  const displayError = localError || error;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Beneficiary</h1>
      <p className="text-gray-600 mb-6">
        Search by biometric, national ID, or phone number to verify beneficiary
      </p>

      {displayError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">Verification Error</p>
          <p className="text-sm">{displayError}</p>
          <button
            onClick={() => {
              setLocalError(null);
              if (error) clearBeneficiary();
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {renderSearchInterface()}
    </div>
  );
};

export default Verify;