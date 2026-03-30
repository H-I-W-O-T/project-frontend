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

//version - 2

// import { useState } from 'react';
// import { useWallet } from '../../../shared/hooks/useWallet';
// import type { Beneficiary, RegisterFormData } from '../types/agent.types';

// // --- HELPERS ---

// const hexToBytes32 = (hex: string): Uint8Array => {
//   const cleanHex = hex.replace('0x', '').padStart(64, '0');
//   const array = new Uint8Array(32);
//   for (let i = 0; i < 32; i++) {
//     array[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
//   }
//   return array;
// };

// const generateHashBytes = async (data: string): Promise<Uint8Array> => {
//   const encoder = new TextEncoder();
//   const dataBytes = encoder.encode(data);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
//   return new Uint8Array(hashBuffer);
// };

// // --- HOOK ---

// export const useBeneficiary = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  
//   const { callContract, connectWallet, publicKey } = useWallet();

//   const register = async (data: RegisterFormData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       let activeKey = publicKey;
//       if (!activeKey) {
//         activeKey = await connectWallet();
//       }

//       const nullifier = hexToBytes32(data.fingerprint || ""); 
//       const rawMetadata = `${data.fullName}-${data.nationalId}-${data.phoneNumber}`;
//       const metadataHash = await generateHashBytes(rawMetadata);

//       const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";
//       if (!IDENTITY_CONTRACT_ID) {
//         throw new Error("VITE_IDENTITY_ADDRESS is missing in .env");
//       }

//       const txResponse = await callContract({
//         contractId: IDENTITY_CONTRACT_ID,
//         method: "register",
//         args: [activeKey, nullifier, metadataHash],
//         address: activeKey
//       });

//       // FIX: Map EVERY required field from your Beneficiary interface
//       const result: Beneficiary = {
//         id: data.nationalId, // Using nationalId as the ID
//         fullName: data.fullName,
//         nationalId: data.nationalId,
//         phoneNumber: data.phoneNumber,
//         fingerprintHash: data.fingerprint,
//         biometricRegistered: true,
//         eligibility: {
//           isEligible: true,
//           score: 100,
//           lastAssessed: new Date().toISOString(),
//         },
//         location: {
//           latitude: data.location.latitude,
//           longitude: data.location.longitude,
//           address: data.location.address || "Unknown Location",
//         },
//         registrationDate: new Date().toISOString(),
//       };

//       // Set the state and return
//       setBeneficiary(result);
//       return result;

//     } catch (err: any) {
//       console.error("Registration error:", err);
//       setError(err.message || "On-chain registration failed");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verify = async (fingerprintHash: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const activeKey = publicKey || await connectWallet();
//       const nullifier = hexToBytes32(fingerprintHash);
//       const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";

//       return await callContract({
//         contractId: IDENTITY_CONTRACT_ID,
//         method: "verify",
//         args: [activeKey, nullifier],
//         address: activeKey
//       });
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { loading, error, beneficiary, register, verify, clearBeneficiary: () => setBeneficiary(null) };
// };


//version 2

// import { useState } from 'react';
// import { useWallet } from '../../../shared/hooks/useWallet';
// import type { Beneficiary, RegisterFormData } from '../types/agent.types';

// // --- HELPERS ---

// const hexToBytes32 = (hex: string): Uint8Array => {
//   // Remove 0x prefix if present and ensure 64 characters (32 bytes)
//   const cleanHex = hex.replace('0x', '').padStart(64, '0');
//   const array = new Uint8Array(32);
//   for (let i = 0; i < 32; i++) {
//     array[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
//   }
//   return array;
// };

// const generateHashBytes = async (data: string): Promise<Uint8Array> => {
//   const encoder = new TextEncoder();
//   const dataBytes = encoder.encode(data);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
//   return new Uint8Array(hashBuffer);
// };

// const bytes32ToHex = (bytes: Uint8Array): string => {
//   return '0x' + Array.from(bytes)
//     .map(b => b.toString(16).padStart(2, '0'))
//     .join('');
// };

// // Store metadata in localStorage with the nullifier as key
// const storeOffChainMetadata = (nullifierHash: string, metadata: any) => {
//   const key = `beneficiary_${nullifierHash}`;
//   localStorage.setItem(key, JSON.stringify({
//     ...metadata,
//     registrationDate: new Date().toISOString(),
//     nullifierHash
//   }));
// };

// // --- HOOK ---

// export const useBeneficiary = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
//   const [registrationHash, setRegistrationHash] = useState<string | null>(null);
  
//   const { callContract, connectWallet, publicKey } = useWallet();

//   const register = async (data: RegisterFormData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       let activeKey = publicKey;
//       if (!activeKey) {
//         activeKey = await connectWallet();
//       }

//       // Generate nullifier from fingerprint (32 bytes)
//       const nullifierBytes = hexToBytes32(data.fingerprint);
//       const nullifierHash = bytes32ToHex(nullifierBytes);

//       // Create metadata JSON and hash it
//       const metadata = {
//         fullName: data.fullName,
//         nationalId: data.nationalId,
//         phoneNumber: data.phoneNumber,
//         registrationLocation: data.location || null,
//         registeredAt: new Date().toISOString(),
//         registeredBy: activeKey
//       };
      
//       const metadataString = JSON.stringify(metadata);
//       const metadataHashBytes = await generateHashBytes(metadataString);
//       const metadataHash = bytes32ToHex(metadataHashBytes);

//       // Store metadata locally (off-chain)
//       storeOffChainMetadata(nullifierHash, metadata);

//       const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";
//       if (!IDENTITY_CONTRACT_ID) {
//         throw new Error("VITE_IDENTITY_ADDRESS is missing in .env");
//       }

//       // Call the contract's register method
//       // Note: The contract expects (agent, nullifier, metadata_hash)
//       const txResponse = await callContract({
//         contractId: IDENTITY_CONTRACT_ID,
//         method: "register",
//         args: [activeKey, nullifierBytes, metadataHashBytes],
//         address: activeKey
//       });

//       // Create beneficiary object for UI display
//       const result: Beneficiary = {
//         id: nullifierHash,
//         fullName: data.fullName,
//         nationalId: data.nationalId,
//         phoneNumber: data.phoneNumber,
//         fingerprintHash: data.fingerprint,
//         nullifierHash: nullifierHash,
//         metadataHash: metadataHash,
//         biometricRegistered: true,
//         eligibility: {
//           isEligible: true,
//           score: 100,
//           lastAssessed: new Date().toISOString(),
//         },
//         location: data.location ? {
//           latitude: data.location.latitude,
//           longitude: data.location.longitude,
//           address: data.location.address || "Unknown Location",
//         } : undefined,
//         registrationDate: new Date().toISOString(),
//         isActive: true,
//       };

//       setBeneficiary(result);
//       setRegistrationHash(metadataHash);
//       return result;

//     } catch (err: any) {
//       console.error("Registration error:", err);
//       setError(err.message || "On-chain registration failed");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verify = async (fingerprintHash: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const activeKey = publicKey || await connectWallet();
//       const nullifierBytes = hexToBytes32(fingerprintHash);
//       const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";

//       return await callContract({
//         contractId: IDENTITY_CONTRACT_ID,
//         method: "verify",
//         args: [activeKey, nullifierBytes],
//         address: activeKey
//       });
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getBeneficiary = async (fingerprintHash: string) => {
//     setLoading(true);
//     try {
//       const nullifierHash = bytes32ToHex(hexToBytes32(fingerprintHash));
//       const storedData = localStorage.getItem(`beneficiary_${nullifierHash}`);
      
//       if (storedData) {
//         return JSON.parse(storedData);
//       }
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { 
//     loading, 
//     error, 
//     beneficiary, 
//     registrationHash,
//     register, 
//     verify, 
//     getBeneficiary,
//     clearBeneficiary: () => setBeneficiary(null) 
//   };
// };



//version 3

// hooks/useBeneficiary.ts
// import { useState } from 'react';
// import { useWallet } from '../../../shared/hooks/useWallet';
// import type { Beneficiary, RegisterFormData } from '../types/agent.types';

// // --- HELPERS ---

// const hexToBytes32 = (hex: string): Uint8Array => {
//   const cleanHex = hex.replace('0x', '').padStart(64, '0');
//   const array = new Uint8Array(32);
//   for (let i = 0; i < 32; i++) {
//     array[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
//   }
//   return array;
// };

// const generateHashBytes = async (data: string): Promise<Uint8Array> => {
//   const encoder = new TextEncoder();
//   const dataBytes = encoder.encode(data);
//   const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
//   return new Uint8Array(hashBuffer);
// };

// const bytes32ToHex = (bytes: Uint8Array): string => {
//   return '0x' + Array.from(bytes)
//     .map(b => b.toString(16).padStart(2, '0'))
//     .join('');
// };

// // Store metadata in localStorage with the nullifier as key
// const storeOffChainMetadata = (nullifierHash: string, metadata: any) => {
//   const key = `beneficiary_${nullifierHash}`;
//   localStorage.setItem(key, JSON.stringify({
//     ...metadata,
//     registrationDate: new Date().toISOString(),
//     nullifierHash
//   }));
// };

// // Helper to extract return value from query response
// const extractQueryReturnValue = (retval: any): boolean => {
//   if (!retval) return false;
  
//   try {
//     // Handle different return value formats
//     if (typeof retval === 'boolean') return retval;
//     if (typeof retval === 'number') return retval === 1;
//     if (typeof retval === 'string') {
//       if (retval === 'true' || retval === '0x01') return true;
//       if (retval === 'false' || retval === '0x00') return false;
//     }
//     // Handle ScVal format
//     if (retval._switch) {
//       // This is likely an xdr.ScVal
//       if (retval._switch?.value === 0) { // SCV_BOOL
//         return retval.b === true;
//       }
//     }
//     return false;
//   } catch (err) {
//     console.error('Error extracting return value:', err);
//     return false;
//   }
// };

// // --- HOOK ---

// export const useBeneficiary = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
//   const [registrationHash, setRegistrationHash] = useState<string | null>(null);
  
//   const { callContract, queryContract, connectWallet, publicKey } = useWallet();


//   const verifyByNationalId = async (nationalId: string): Promise<{ isValid: boolean; nullifierHash: string | null }> => {
//   setLoading(true);
//   setError(null);
//   try {
//     // Search through localStorage for beneficiary with matching nationalId
//     let foundNullifierHash: string | null = null;
//     let foundMetadata: any = null;
    
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       if (key && key.startsWith('beneficiary_')) {
//         const storedData = localStorage.getItem(key);
//         if (storedData) {
//           const metadata = JSON.parse(storedData);
//           if (metadata.nationalId === nationalId) {
//             foundNullifierHash = metadata.nullifierHash;
//             foundMetadata = metadata;
//             break;
//           }
//         }
//       }
//     }
    
//     if (!foundNullifierHash) {
//       return { isValid: false, nullifierHash: null };
//     }
    
//     // Verify on-chain
//     const isValid = await verify(foundNullifierHash);
    
//     if (isValid && foundMetadata) {
//       // Set beneficiary in state
//       setBeneficiary({
//         id: foundNullifierHash,
//         fullName: foundMetadata.fullName,
//         nationalId: foundMetadata.nationalId,
//         phoneNumber: foundMetadata.phoneNumber,
//         fingerprintHash: foundNullifierHash,
//         nullifierHash: foundNullifierHash,
//         metadataHash: "",
//         biometricRegistered: true,
//         eligibility: {
//           isEligible: true,
//           score: 100,
//           lastAssessed: new Date().toISOString(),
//         },
//         location: foundMetadata.registrationLocation,
//         registrationDate: foundMetadata.registrationDate,
//         isActive: true,
//       });
//     }
    
//     return { isValid, nullifierHash: foundNullifierHash };
    
//   } catch (err: any) {
//     console.error("National ID verification error:", err);
//     setError(err.message || "Verification failed");
//     return { isValid: false, nullifierHash: null };
//   } finally {
//     setLoading(false);
//   }
// };

// // Search for beneficiary by Phone Number
// const verifyByPhoneNumber = async (phoneNumber: string): Promise<{ isValid: boolean; nullifierHash: string | null }> => {
//   setLoading(true);
//   setError(null);
//   try {
//     // Search through localStorage for beneficiary with matching phone number
//     let foundNullifierHash: string | null = null;
//     let foundMetadata: any = null;
    
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       if (key && key.startsWith('beneficiary_')) {
//         const storedData = localStorage.getItem(key);
//         if (storedData) {
//           const metadata = JSON.parse(storedData);
//           // Normalize phone number for comparison (remove spaces, dashes, etc.)
//           const normalizedSearchPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, '');
//           const normalizedStoredPhone = metadata.phoneNumber.replace(/[\s\-\(\)\+]/g, '');
          
//           if (normalizedStoredPhone === normalizedSearchPhone) {
//             foundNullifierHash = metadata.nullifierHash;
//             foundMetadata = metadata;
//             break;
//           }
//         }
//       }
//     }
    
//     if (!foundNullifierHash) {
//       return { isValid: false, nullifierHash: null };
//     }
    
//     // Verify on-chain
//     const isValid = await verify(foundNullifierHash);
    
//     if (isValid && foundMetadata) {
//       // Set beneficiary in state
//       setBeneficiary({
//         id: foundNullifierHash,
//         fullName: foundMetadata.fullName,
//         nationalId: foundMetadata.nationalId,
//         phoneNumber: foundMetadata.phoneNumber,
//         fingerprintHash: foundNullifierHash,
//         nullifierHash: foundNullifierHash,
//         metadataHash: "",
//         biometricRegistered: true,
//         eligibility: {
//           isEligible: true,
//           score: 100,
//           lastAssessed: new Date().toISOString(),
//         },
//         location: foundMetadata.registrationLocation,
//         registrationDate: foundMetadata.registrationDate,
//         isActive: true,
//       });
//     }
    
//     return { isValid, nullifierHash: foundNullifierHash };
    
//   } catch (err: any) {
//     console.error("Phone number verification error:", err);
//     setError(err.message || "Verification failed");
//     return { isValid: false, nullifierHash: null };
//   } finally {
//     setLoading(false);
//   }
// };

//   const register = async (data: RegisterFormData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       let activeKey = publicKey;
//       if (!activeKey) {
//         activeKey = await connectWallet();
//       }

//       // Generate nullifier from fingerprint (32 bytes)
//       const nullifierBytes = hexToBytes32(data.fingerprint);
//       const nullifierHash = bytes32ToHex(nullifierBytes);

//       // Create metadata JSON and hash it
//       const metadata = {
//         fullName: data.fullName,
//         nationalId: data.nationalId,
//         phoneNumber: data.phoneNumber,
//         registrationLocation: data.location || null,
//         registeredAt: new Date().toISOString(),
//         registeredBy: activeKey
//       };
      
//       const metadataString = JSON.stringify(metadata);
//       const metadataHashBytes = await generateHashBytes(metadataString);
//       const metadataHash = bytes32ToHex(metadataHashBytes);

//       // Store metadata locally (off-chain)
//       storeOffChainMetadata(nullifierHash, metadata);

//       const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";
//       if (!IDENTITY_CONTRACT_ID) {
//         throw new Error("VITE_IDENTITY_ADDRESS is missing in .env");
//       }

//       // Call the contract's register method (requires wallet signature)
//       await callContract({
//         contractId: IDENTITY_CONTRACT_ID,
//         method: "register",
//         args: [activeKey, nullifierBytes, metadataHashBytes],
//         address: activeKey
//       });

//       // Create beneficiary object for UI display
//       const result: Beneficiary = {
//         id: nullifierHash,
//         fullName: data.fullName,
//         nationalId: data.nationalId,
//         phoneNumber: data.phoneNumber,
//         fingerprintHash: data.fingerprint,
//         nullifierHash: nullifierHash,
//         metadataHash: metadataHash,
//         biometricRegistered: true,
//         eligibility: {
//           isEligible: true,
//           score: 100,
//           lastAssessed: new Date().toISOString(),
//         },
//         location: data.location ? {
//           latitude: data.location.latitude,
//           longitude: data.location.longitude,
//           address: data.location.address || "Unknown Location",
//         } : undefined,
//         registrationDate: new Date().toISOString(),
//         isActive: true,
//       };

//       setBeneficiary(result);
//       setRegistrationHash(metadataHash);
//       return result;

//     } catch (err: any) {
//       console.error("Registration error:", err);
//       setError(err.message || "On-chain registration failed");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // READ-ONLY: Verify beneficiary - NO WALLET REQUIRED
//   const verify = async (nullifierHex: string): Promise<boolean> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const nullifierBytes = hexToBytes32(nullifierHex);
//       const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";

//       // Use queryContract for read-only operation (no wallet signature)
//       const retval = await queryContract({
//         contractId: IDENTITY_CONTRACT_ID,
//         method: "verify",
//         args: [nullifierBytes]  // Note: The contract's verify function expects (agent, nullifier)
//                                // but agent is not used in the function body, so we can pass a dummy
//                                // or we need to pass the agent address. Let's check the contract.
//       });
      
//       // Extract the boolean return value
//       const isValid = extractQueryReturnValue(retval);
//       return isValid;
      
//     } catch (err: any) {
//       console.error("Verification error:", err);
//       setError(err.message || "Verification failed");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // READ-ONLY: Verify using biometric fingerprint hash - NO WALLET REQUIRED
//   const verifyBiometric = async (fingerprintHash: string): Promise<boolean> => {
//     setLoading(true);
//     setError(null);
//     try {
//       const nullifierBytes = hexToBytes32(fingerprintHash);
//       const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";

//       // Use queryContract for read-only operation
//       // Note: The contract's verify function expects (agent, nullifier)
//       // Since agent is not used in the function, we can pass a dummy address
//       const dummyAgent = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
//       const retval = await queryContract({
//         contractId: IDENTITY_CONTRACT_ID,
//         method: "verify",
//         args: [dummyAgent, nullifierBytes]
//       });
      
//       const isValid = extractQueryReturnValue(retval);
      
//       if (isValid) {
//         // Get beneficiary from local storage
//         const nullifierHash = bytes32ToHex(nullifierBytes);
//         const storedData = localStorage.getItem(`beneficiary_${nullifierHash}`);
        
//         if (storedData) {
//           const metadata = JSON.parse(storedData);
//           setBeneficiary({
//             id: nullifierHash,
//             fullName: metadata.fullName,
//             nationalId: metadata.nationalId,
//             phoneNumber: metadata.phoneNumber,
//             fingerprintHash: fingerprintHash,
//             nullifierHash: nullifierHash,
//             metadataHash: "",
//             biometricRegistered: true,
//             eligibility: {
//               isEligible: true,
//               score: 100,
//               lastAssessed: new Date().toISOString(),
//             },
//             location: metadata.registrationLocation,
//             registrationDate: metadata.registrationDate,
//             isActive: true,
//           });
//         } else {
//           // If beneficiary exists on-chain but not in local storage,
//           // we need to fetch metadata from the contract
//           console.log("Beneficiary verified on-chain but no local data found");
//         }
//       }
      
//       return isValid;
      
//     } catch (err: any) {
//       console.error("Biometric verification error:", err);
//       setError(err.message || "Biometric verification failed");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getBeneficiary = async (fingerprintHash: string) => {
//     setLoading(true);
//     try {
//       const nullifierHash = bytes32ToHex(hexToBytes32(fingerprintHash));
//       const storedData = localStorage.getItem(`beneficiary_${nullifierHash}`);
      
//       if (storedData) {
//         return JSON.parse(storedData);
//       }
//       return null;
//     } catch (err: any) {
//       console.error("Error getting beneficiary:", err);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getBeneficiaryByNullifier = async (nullifierHex: string): Promise<any> => {
//     try {
//       const nullifierBytes = hexToBytes32(nullifierHex);
//       const nullifierHash = bytes32ToHex(nullifierBytes);
//       const storedData = localStorage.getItem(`beneficiary_${nullifierHash}`);
      
//       if (storedData) {
//         return JSON.parse(storedData);
//       }
//       return null;
//     } catch (err: any) {
//       console.error("Error getting beneficiary by nullifier:", err);
//       return null;
//     }
//   };

//   const clearBeneficiary = () => {
//     setBeneficiary(null);
//     setError(null);
//     setRegistrationHash(null);
//   };

//   return { 
//     loading, 
//   error, 
//   beneficiary, 
//   registrationHash,
//   register, 
//   verify,
//   verifyBiometric,
//   verifyByNationalId,  // Add this
//   verifyByPhoneNumber, // Add this
//   getBeneficiary,
//   getBeneficiaryByNullifier,
//   clearBeneficiary
//   };
// };




// version 
// hooks/useBeneficiary.ts
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

const bytes32ToHex = (bytes: Uint8Array): string => {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Store metadata in localStorage with the nullifier as key
const storeOffChainMetadata = (nullifierHash: string, metadata: any) => {
  const key = `beneficiary_${nullifierHash}`;
  localStorage.setItem(key, JSON.stringify({
    ...metadata,
    registrationDate: new Date().toISOString(),
    nullifierHash,
    isActive: true
  }));
};

// Search localStorage by National ID
const searchByNationalId = (nationalId: string): { nullifierHash: string | null; metadata: any | null } => {
  const searchId = nationalId.trim();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith('beneficiary_')) {
      try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          const metadata = JSON.parse(storedData);
          const storedNationalId = metadata.nationalId ? metadata.nationalId.trim() : '';
          
          if (storedNationalId === searchId) {
            return { nullifierHash: metadata.nullifierHash, metadata };
          }
        }
      } catch (err) {
        console.error('Error parsing stored data:', err);
      }
    }
  }
  
  return { nullifierHash: null, metadata: null };
};

// Search localStorage by Phone Number
const searchByPhoneNumber = (phoneNumber: string): { nullifierHash: string | null; metadata: any | null } => {
  const normalizePhone = (phone: string) => phone.replace(/[\s\-\(\)\+]/g, '');
  const normalizedSearchPhone = normalizePhone(phoneNumber);
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith('beneficiary_')) {
      try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
          const metadata = JSON.parse(storedData);
          const normalizedStoredPhone = normalizePhone(metadata.phoneNumber);
          
          if (normalizedStoredPhone === normalizedSearchPhone) {
            return { nullifierHash: metadata.nullifierHash, metadata };
          }
        }
      } catch (err) {
        console.error('Error parsing stored data:', err);
      }
    }
  }
  
  return { nullifierHash: null, metadata: null };
};

// Search localStorage by Fingerprint (nullifier)
const searchByFingerprint = (fingerprintHash: string): { nullifierHash: string | null; metadata: any | null } => {
  const nullifierBytes = hexToBytes32(fingerprintHash);
  const nullifierHash = bytes32ToHex(nullifierBytes);
  const key = `beneficiary_${nullifierHash}`;
  const storedData = localStorage.getItem(key);
  
  if (storedData) {
    try {
      const metadata = JSON.parse(storedData);
      return { nullifierHash, metadata };
    } catch (err) {
      console.error('Error parsing stored data:', err);
      return { nullifierHash: null, metadata: null };
    }
  }
  
  return { nullifierHash: null, metadata: null };
};

// --- HOOK ---

export const useBeneficiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [registrationHash, setRegistrationHash] = useState<string | null>(null);
  
  const { callContract, connectWallet, publicKey } = useWallet();

  const register = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      let activeKey = publicKey;
      if (!activeKey) {
        activeKey = await connectWallet();
      }

      // Generate nullifier from fingerprint (32 bytes)
      const nullifierBytes = hexToBytes32(data.fingerprint);
      const nullifierHash = bytes32ToHex(nullifierBytes);

      // Create metadata
      const metadata = {
        fullName: data.fullName,
        nationalId: data.nationalId.trim(),
        phoneNumber: data.phoneNumber.trim(),
        registrationLocation: data.location || null,
        registeredAt: new Date().toISOString(),
        registeredBy: activeKey
      };
      
      const metadataString = JSON.stringify(metadata);
      const metadataHashBytes = await generateHashBytes(metadataString);
      const metadataHash = bytes32ToHex(metadataHashBytes);

      // Store metadata locally (off-chain only)
      storeOffChainMetadata(nullifierHash, metadata);

      const IDENTITY_CONTRACT_ID: string = import.meta.env.VITE_IDENTITY_ADDRESS ?? "";
      if (!IDENTITY_CONTRACT_ID) {
        throw new Error("VITE_IDENTITY_ADDRESS is missing in .env");
      }

      // Try to register on blockchain, but don't fail if it doesn't work
      try {
        await callContract({
          contractId: IDENTITY_CONTRACT_ID,
          method: "register",
          args: [activeKey, nullifierBytes, metadataHashBytes],
          address: activeKey
        });
        console.log('Blockchain registration successful');
      } catch (blockchainError) {
        console.warn('Blockchain registration failed, but data saved locally:', blockchainError);
        // Continue anyway since we have local storage
      }

      // Create beneficiary object for UI display
      const result: Beneficiary = {
        id: nullifierHash,
        fullName: data.fullName,
        nationalId: data.nationalId.trim(),
        phoneNumber: data.phoneNumber.trim(),
        fingerprintHash: data.fingerprint,
        nullifierHash: nullifierHash,
        metadataHash: metadataHash,
        biometricRegistered: true,
        eligibility: {
          isEligible: true,
          score: 100,
          lastAssessed: new Date().toISOString(),
        },
        location: data.location ? {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
          address: data.location.address || "Unknown Location",
        } : undefined,
        registrationDate: new Date().toISOString(),
        isActive: true,
      };

      setBeneficiary(result);
      setRegistrationHash(metadataHash);
      return result;

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify by National ID (LocalStorage only)
  const verifyByNationalId = async (nationalId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { nullifierHash, metadata } = searchByNationalId(nationalId);
      
      if (!nullifierHash || !metadata) {
        setError('No beneficiary found with this National ID');
        return false;
      }
      
      // Set beneficiary in state
      setBeneficiary({
        id: nullifierHash,
        fullName: metadata.fullName,
        nationalId: metadata.nationalId,
        phoneNumber: metadata.phoneNumber,
        fingerprintHash: nullifierHash,
        nullifierHash: nullifierHash,
        metadataHash: "",
        biometricRegistered: true,
        eligibility: {
          isEligible: true,
          score: 100,
          lastAssessed: new Date().toISOString(),
        },
        location: metadata.registrationLocation,
        registrationDate: metadata.registrationDate,
        isActive: metadata.isActive !== false,
      });
      
      return true;
      
    } catch (err: any) {
      console.error("National ID verification error:", err);
      setError(err.message || "Verification failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify by Phone Number (LocalStorage only)
  const verifyByPhoneNumber = async (phoneNumber: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { nullifierHash, metadata } = searchByPhoneNumber(phoneNumber);
      
      if (!nullifierHash || !metadata) {
        setError('No beneficiary found with this phone number');
        return false;
      }
      
      // Set beneficiary in state
      setBeneficiary({
        id: nullifierHash,
        fullName: metadata.fullName,
        nationalId: metadata.nationalId,
        phoneNumber: metadata.phoneNumber,
        fingerprintHash: nullifierHash,
        nullifierHash: nullifierHash,
        metadataHash: "",
        biometricRegistered: true,
        eligibility: {
          isEligible: true,
          score: 100,
          lastAssessed: new Date().toISOString(),
        },
        location: metadata.registrationLocation,
        registrationDate: metadata.registrationDate,
        isActive: metadata.isActive !== false,
      });
      
      return true;
      
    } catch (err: any) {
      console.error("Phone number verification error:", err);
      setError(err.message || "Verification failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify by Biometric (Fingerprint) - LocalStorage only
  const verifyBiometric = async (fingerprintHash: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const { nullifierHash, metadata } = searchByFingerprint(fingerprintHash);
      
      if (!nullifierHash || !metadata) {
        setError('No beneficiary found with this biometric data');
        return false;
      }
      
      // Set beneficiary in state
      setBeneficiary({
        id: nullifierHash,
        fullName: metadata.fullName,
        nationalId: metadata.nationalId,
        phoneNumber: metadata.phoneNumber,
        fingerprintHash: fingerprintHash,
        nullifierHash: nullifierHash,
        metadataHash: "",
        biometricRegistered: true,
        eligibility: {
          isEligible: true,
          score: 100,
          lastAssessed: new Date().toISOString(),
        },
        location: metadata.registrationLocation,
        registrationDate: metadata.registrationDate,
        isActive: metadata.isActive !== false,
      });
      
      return true;
      
    } catch (err: any) {
      console.error("Biometric verification error:", err);
      setError(err.message || "Verification failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBeneficiary = async (fingerprintHash: string) => {
    try {
      const { metadata } = searchByFingerprint(fingerprintHash);
      return metadata;
    } catch (err: any) {
      console.error("Error getting beneficiary:", err);
      return null;
    }
  };

  // const getBeneficiaryByNullifier = async (nullifierHex: string): Promise<any> => {
  //   try {
  //     const key = `beneficiary_${nullifierHex}`;
  //     const storedData = localStorage.getItem(key);
      
  //     if (storedData) {
  //       return JSON.parse(storedData);
  //     }
  //     return null;
  //   } catch (err: any) {
  //     console.error("Error getting beneficiary by nullifier:", err);
  //     return null;
  //   }
  // };

const getBeneficiaryByNullifier = async (nullifierHex: string): Promise<any> => {
  console.log('=== getBeneficiaryByNullifier called ===');

  try {
    // 🔥 Normalize properly
    let normalized = nullifierHex.toLowerCase().trim();

    if (!normalized.startsWith('0x')) {
      normalized = '0x' + normalized;
    }

    const key = `beneficiary_${normalized}`;
    console.log('Looking for key:', key);

    const storedData = localStorage.getItem(key);

    if (!storedData) {
      console.log('❌ NOT FOUND in localStorage');
      console.log('Available keys:', Object.keys(localStorage)); // 🔥 debug
      return null;
    }

    const metadata = JSON.parse(storedData);

    const beneficiaryData: Beneficiary = {
      id: normalized,
      fullName: metadata.fullName,
      nationalId: metadata.nationalId,
      phoneNumber: metadata.phoneNumber,
      fingerprintHash: normalized,
      nullifierHash: normalized,
      metadataHash: "",
      biometricRegistered: true,
      eligibility: {
        isEligible: true,
        score: 100,
        lastAssessed: new Date().toISOString(),
      },
      location: metadata.registrationLocation,
      registrationDate: metadata.registrationDate,
      isActive: metadata.isActive !== false,
    };

    setBeneficiary(beneficiaryData);

    return metadata;

  } catch (err) {
    console.error(err);
    return null;
  }
};
  

  const clearBeneficiary = () => {
    setBeneficiary(null);
    setError(null);
    setRegistrationHash(null);
  };

  return { 
    loading, 
    error, 
    beneficiary, 
    registrationHash,
    register, 
    verifyBiometric,
    verifyByNationalId,
    verifyByPhoneNumber,
    getBeneficiary,
    getBeneficiaryByNullifier,
    clearBeneficiary
  };
};