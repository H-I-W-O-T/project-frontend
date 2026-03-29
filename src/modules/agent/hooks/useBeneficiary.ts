// // hooks/useBeneficiary.ts
// import { useState } from 'react';
// import { agentService } from '../services/agentService';
// import type { Beneficiary, RegisterFormData } from '../types/agent.types';

// export const useBeneficiary = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);

//   const register = async (data: RegisterFormData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await agentService.registerBeneficiary(data);
//       setBeneficiary(result);
//       return result;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verify = async (identifier: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await agentService.verifyBeneficiary(identifier);
//       setBeneficiary(result);
//       return result;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyBiometric = async (fingerprintHash: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await agentService.verifyBiometric(fingerprintHash);
//       setBeneficiary(result);
//       return result;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearBeneficiary = () => {
//     setBeneficiary(null);
//     setError(null);
//   };

//   return {
//     loading,
//     error,
//     beneficiary,
//     register,
//     verify,
//     verifyBiometric,
//     clearBeneficiary
//   };
// };



import { useState } from 'react';
import { useWallet } from '../../../shared/hooks/useWallet';
import type { Beneficiary, RegisterFormData } from '../types/agent.types';

// --- HELPERS ---

const hexToBytes32 = (hex: string): Uint8Array => {
  const cleanHex = hex.replace('0x', '').padStart(64, '0');
  const array = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    array[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return array;
};

const generateHashBytes = async (data: string): Promise<Uint8Array> => {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  return new Uint8Array(hashBuffer);
};

// --- HOOK ---

export const useBeneficiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  
  const { callContract, connectWallet, publicKey } = useWallet();

  const register = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      let activeKey = publicKey;
      if (!activeKey) {
        activeKey = await connectWallet();
      }

      const nullifier = hexToBytes32(data.fingerprint || ""); 
      const rawMetadata = `${data.fullName}-${data.nationalId}-${data.phoneNumber}`;
      const metadataHash = await generateHashBytes(rawMetadata);

      const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";
      if (!IDENTITY_CONTRACT_ID) {
        throw new Error("VITE_IDENTITY_ADDRESS is missing in .env");
      }

      const txResponse = await callContract({
        contractId: IDENTITY_CONTRACT_ID,
        method: "register",
        args: [activeKey, nullifier, metadataHash],
        address: activeKey
      });

      // FIX: Map EVERY required field from your Beneficiary interface
      const result: Beneficiary = {
        id: data.nationalId, // Using nationalId as the ID
        fullName: data.fullName,
        nationalId: data.nationalId,
        phoneNumber: data.phoneNumber,
        fingerprintHash: data.fingerprint,
        biometricRegistered: true,
        eligibility: {
          isEligible: true,
          score: 100,
          lastAssessed: new Date().toISOString(),
        },
        location: {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          address: data.location.address || "Unknown Location",
        },
        registrationDate: new Date().toISOString(),
      };

      // Set the state and return
      setBeneficiary(result);
      return result;

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "On-chain registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (fingerprintHash: string) => {
    setLoading(true);
    setError(null);
    try {
      const activeKey = publicKey || await connectWallet();
      const nullifier = hexToBytes32(fingerprintHash);
      const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";

      return await callContract({
        contractId: IDENTITY_CONTRACT_ID,
        method: "verify",
        args: [activeKey, nullifier],
        address: activeKey
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, beneficiary, register, verify, clearBeneficiary: () => setBeneficiary(null) };
};