// // hooks/useBatches.ts
// import { useState } from 'react';
// import { agentService } from '../services/agentService';
// import type { Batch } from '../types/agent.types';

// export const useBatches = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [batch, setBatch] = useState<Batch | null>(null);

//   const scanBatch = async (qrCode: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await agentService.scanBatch(qrCode);
//       setBatch(result);
//       return result;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getBatchDetails = async (batchId: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await agentService.getBatchDetails(batchId);
//       setBatch(result);
//       return result;
//     } catch (err: any) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearBatch = () => {
//     setBatch(null);
//     setError(null);
//   };

//   return {
//     loading,
//     error,
//     batch,
//     scanBatch,
//     getBatchDetails,
//     clearBatch
//   };
// };