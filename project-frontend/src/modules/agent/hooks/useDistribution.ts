// hooks/useDistribution.ts
import { useState, useEffect } from 'react';
import { agentService } from '../services/agentService';
import type { Distribution, DistributionFormData } from '../types/agent.types';

export const useDistribution = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [history, setHistory] = useState<Distribution[]>([]);

  const distribute = async (data: DistributionFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentService.submitDistribution(data);
      setDistributions(prev => [result, ...prev]);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadDistributions = async (beneficiaryId?: string) => {
    setLoading(true);
    try {
      const data = await agentService.getDistributions(beneficiaryId);
      setDistributions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (limit?: number) => {
    setLoading(true);
    try {
      const data = await agentService.getDistributionHistory(limit);
      setHistory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return {
    loading,
    error,
    distributions,
    history,
    distribute,
    loadDistributions,
    loadHistory
  };
};