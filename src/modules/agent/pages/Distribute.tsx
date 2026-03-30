
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useDistribution } from '../hooks/useDistribution';
// import { useBeneficiary } from '../hooks/useBeneficiary';
// import { usePrograms } from '../hooks/usePrograms';
// import { useWallet } from '../../../shared/hooks/useWallet';
// import { BeneficiaryCard } from '../components/BeneficiaryCard';
// import { Button } from '../../../shared/components/Common';
// import { useLocation as useGeoLocation } from '../hooks/useLocation';
// import { disbursementClient } from '../../../shared/api/contracts/disbursementClient';

// const Distribute: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const queryParams = new URLSearchParams(location.search);
//   const nullifierFromUrl = queryParams.get('nullifier');
//   const programIdFromUrl = queryParams.get('program');

//   const { distribute, error: distError } = useDistribution();

//   const {
//     beneficiary,
//     getBeneficiaryByNullifier,
//     clearBeneficiary
//   } = useBeneficiary();

//   const {
//     getProgramById,
//     programs,
//     fetchPrograms,
//     loading: programsLoading
//   } = usePrograms();

//   const { publicKey, connectWallet, callContract } = useWallet();

//   const {
//     location: geoLocation,
//     getCurrentLocation,
//     loading: locationLoading
//   } = useGeoLocation();

//   const [selectedProgram, setSelectedProgram] = useState<any>(null);
//   const [loadingBeneficiary, setLoadingBeneficiary] = useState(false);
//   const [distributing, setDistributing] = useState(false);
//   const [txHash, setTxHash] = useState<string | null>(null);

//   // ✅ STEP is DERIVED (no more bugs)
//   const step = !beneficiary
//     ? 'initial'
//     : txHash
//     ? 'success'
//     : 'ready';

//   // ✅ Load programs once
//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   // ✅ Load beneficiary from URL (ONLY ONCE)
//   useEffect(() => {
//     const load = async () => {
//       if (!nullifierFromUrl) return;

//       setLoadingBeneficiary(true);

//       try {
//         await getBeneficiaryByNullifier(nullifierFromUrl);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingBeneficiary(false);
//       }
//     };

//     load();
//   }, [nullifierFromUrl]);

//   // ✅ Load program when programs ready
//   useEffect(() => {
//     if (programIdFromUrl && programs.length > 0) {
//       const program = getProgramById(programIdFromUrl);
//       if (program) setSelectedProgram(program);
//     }
//   }, [programIdFromUrl, programs]);

//   // ✅ Convert hex → bytes32
//   const hexToBytes32 = (hex: string): Uint8Array => {
//     const cleanHex = hex.replace('0x', '').padStart(64, '0');
//     const array = new Uint8Array(32);
//     for (let i = 0; i < 32; i++) {
//       array[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
//     }
//     return array;
//   };

//   // ✅ Navigate to verify
//   const handleVerify = () => {
//     navigate('/agent/verify');
//   };

//   // ✅ DISTRIBUTE
//   const handleDistribute = async () => {
//     if (!beneficiary || !selectedProgram) {
//       alert('Missing data');
//       return;
//     }

//     if (!geoLocation) {
//       await getCurrentLocation();
//       return;
//     }

//     setDistributing(true);

//     try {
//       let agentAddress = publicKey || await connectWallet();

//       const contractId = import.meta.env.VITE_DISBURSEMENT_ADDRESS;

//       // const result = await callContract({
//       //   contractId,
//       //   method: "distribute",
//       //   args: [
//       //     agentAddress,
//       //     hexToBytes32(selectedProgram.programId),
//       //     hexToBytes32(beneficiary.nullifierHash),
//       //     {
//       //       lat: geoLocation.latitude,
//       //       lon: geoLocation.longitude
//       //     },
//       //     null
//       //   ],
//       //   address: agentAddress
//       // });

//      const client = disbursementClient({ callContract });

// const result = await client.distribute(
//   agentAddress,
//   selectedProgram.programId,
//   beneficiary.nullifierHash,
//   {
//     lat: BigInt(Math.floor(geoLocation.latitude * 1_000_000)),
//     lon: BigInt(Math.floor(geoLocation.longitude * 1_000_000))
//   },
//   undefined
// );
//       setTxHash(result?.txHash || 'success');

//       await distribute({
//         beneficiaryId: beneficiary.id,
//         type: 'cash',
//         amount: Number(selectedProgram.amountPerPerson),
//         notes: selectedProgram.name
//       });

//       // clear URL
//       navigate('/agent/distribute', { replace: true });

//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setDistributing(false);
//     }
//   };

//   // ✅ RESET
//   const handleReset = () => {
//     clearBeneficiary();
//     setSelectedProgram(null);
//     setTxHash(null);
//     navigate('/agent/distribute', { replace: true });
//   };

//   // ✅ LOADING STATE (FIXED)
//   if (loadingBeneficiary || programsLoading) {
//     return (
//       <div className="text-center py-10">Loading...</div>
//     );
//   }

//   // ================= UI =================

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-4">Aid Distribution</h1>

//       {step === 'initial' && (
//         <div className="text-center">
//           <p>No Beneficiary Verified</p>
//           <Button onClick={handleVerify}>Verify Beneficiary</Button>
//         </div>
//       )}

//       {step === 'ready' && beneficiary && (
//         <div className="space-y-6">

//           <BeneficiaryCard beneficiary={beneficiary} />

//           {/* Program */}
//           {selectedProgram ? (
//             <div>
//               <p>{selectedProgram.name}</p>
//               <p>{selectedProgram.amountPerPerson} tokens</p>
//             </div>
//           ) : (
//             <Button onClick={handleVerify}>Select Program</Button>
//           )}

//           {/* Location */}
//           {geoLocation ? (
//             <p>
//               Location: {geoLocation.latitude}, {geoLocation.longitude}
//             </p>
//           ) : (
//             <Button onClick={getCurrentLocation} loading={locationLoading}>
//               Get Location
//             </Button>
//           )}

//           <Button
//             onClick={handleDistribute}
//             disabled={!selectedProgram || !geoLocation}
//             loading={distributing}
//           >
//             Distribute
//           </Button>

//           <Button onClick={handleReset} variant="secondary">
//             Reset
//           </Button>
//         </div>
//       )}

//       {step === 'success' && (
//         <div className="text-center">
//           <h2>Success ✅</h2>
//           <p>{beneficiary?.fullName}</p>
//           <p>Tx: {txHash}</p>

//           <Button onClick={handleReset}>New Distribution</Button>
//         </div>
//       )}

//       {distError && <p className="text-red-500">{distError}</p>}
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
import { disbursementClient } from '../../../shared/api/contracts/disbursementClient';
import { Toast } from "../../../shared/components/Common/Toast";

const Distribute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const nullifierFromUrl = queryParams.get('nullifier');
  const programIdFromUrl = queryParams.get('program');

  const { distribute } = useDistribution();

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
  const [blocked, setBlocked] = useState(false);

  // ✅ TOAST STATE
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (type: any, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const step = !beneficiary
    ? 'initial'
    : txHash
    ? 'success'
    : 'ready';

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!nullifierFromUrl) return;

      setLoadingBeneficiary(true);
      try {
        await getBeneficiaryByNullifier(nullifierFromUrl);
      } finally {
        setLoadingBeneficiary(false);
      }
    };
    load();
  }, [nullifierFromUrl]);

  useEffect(() => {
    if (programIdFromUrl && programs.length > 0) {
      const program = getProgramById(programIdFromUrl);
      if (program) setSelectedProgram(program);
    }
  }, [programIdFromUrl, programs]);

  const handleVerify = () => {
    navigate('/agent/verify');
  };

  // ✅ DISTRIBUTE
  const handleDistribute = async () => {
    if (!beneficiary || !selectedProgram) {
      addToast('warning', 'Missing data');
      return;
    }

    if (!geoLocation) {
      await getCurrentLocation();
      return;
    }

    setDistributing(true);

    try {
      let agentAddress = publicKey || await connectWallet();

      const client = disbursementClient({ callContract });

      const result = await client.distribute(
        agentAddress,
        selectedProgram.programId,
        beneficiary.nullifierHash,
        {
          lat: BigInt(Math.floor(geoLocation.latitude * 1_000_000)),
          lon: BigInt(Math.floor(geoLocation.longitude * 1_000_000))
        },
        undefined
      );

      setTxHash(result?.txHash || 'success');

      // ✅ Try backend BUT DO NOT BREAK UI
      try {
        await distribute({
          beneficiaryId: beneficiary.id,
          type: 'cash',
          amount: Number(selectedProgram.amountPerPerson),
          notes: selectedProgram.name
        });
      } catch (backendErr) {
        console.warn("Backend failed but blockchain succeeded");
      }

      addToast('success', 'Distribution successful');

    } catch (err: any) {
      console.error("Distribution error:", err);

      const msg = err.message || "";

      if (msg.includes("#6")) {
        setBlocked(true);
        addToast('warning', 'This beneficiary already received aid.');
      } else if (msg.includes("#5")) {
        addToast('warning', 'Not eligible or conditions not met.');
      } else if (msg.includes("#4")) {
        addToast('error', 'Program budget finished.');
      } else if (msg.includes("#2")) {
        addToast('error', 'Program not found.');
      } else {
        addToast('error', 'Transaction failed.');
      }
    } finally {
      setDistributing(false);
    }
  };

  const handleReset = () => {
    clearBeneficiary();
    setSelectedProgram(null);
    setTxHash(null);
    setBlocked(false);
    navigate('/agent/distribute', { replace: true });
  };

  if (loadingBeneficiary || programsLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* ✅ TOAST UI */}
      <div className="fixed top-5 right-5 space-y-2 z-50">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">Aid Distribution</h1>

      {step === 'initial' && (
        <div className="text-center">
          <p>No Beneficiary Verified</p>
          <Button onClick={handleVerify}>Verify Beneficiary</Button>
        </div>
      )}

      {step === 'ready' && beneficiary && (
        <div className="space-y-6">

          <BeneficiaryCard beneficiary={beneficiary} />

          {selectedProgram ? (
            <div>
              <p>{selectedProgram.name}</p>
              <p>{selectedProgram.amountPerPerson} tokens</p>
            </div>
          ) : (
            <Button onClick={handleVerify}>Select Program</Button>
          )}

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
            disabled={!selectedProgram || !geoLocation || blocked}
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
    </div>
  );
};

export default Distribute;