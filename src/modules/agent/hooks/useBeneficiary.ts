// hooks/useBeneficiary.ts
import { useState } from 'react';
import { agentService } from '../services/agentService';
import type { Beneficiary, RegisterFormData } from '../types/agent.types';

export const useBeneficiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);

  const register = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentService.registerBeneficiary(data);
      setBeneficiary(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (identifier: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentService.verifyBeneficiary(identifier);
      setBeneficiary(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyBiometric = async (fingerprintHash: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentService.verifyBiometric(fingerprintHash);
      setBeneficiary(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearBeneficiary = () => {
    setBeneficiary(null);
    setError(null);
  };

  return {
    loading,
    error,
    beneficiary,
    register,
    verify,
    verifyBiometric,
    clearBeneficiary
  };
};