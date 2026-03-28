import { useState } from 'react';
import { donorService } from '../services/donorService';
import type { VerificationResult } from '../types/donor.types';
import { useToast } from '../../../shared/components/Common/ToastContainer';

export const useVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const toast = useToast();

  const verifyTransaction = async (transactionHash: string) => {
    if (!transactionHash || transactionHash.length < 10) {
      toast.error('Please enter a valid transaction hash');
      return null;
    }

    setVerifying(true);
    try {
      const verificationResult = await donorService.verifyTransaction(transactionHash);
      setResult(verificationResult);
      return verificationResult;
    } catch (err) {
      toast.error('Failed to verify transaction');
      console.error(err);
      return null;
    } finally {
      setVerifying(false);
    }
  };

  const clearResult = () => setResult(null);

  return {
    verifyTransaction,
    verifying,
    result,
    clearResult,
  };
};