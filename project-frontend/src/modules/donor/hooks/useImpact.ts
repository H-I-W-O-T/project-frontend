import { useState, useEffect, useCallback } from 'react';
import { donorService } from '../services/donorService';
import type { ImpactData } from '../types/donor.types';
import { useToast } from '../../../shared/components/Common/ToastContainer';

export const useImpact = () => {
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchImpact = useCallback(async () => {
    setLoading(true);
    try {
      const data = await donorService.getImpact();
      setImpact(data);
    } catch (err) {
      toast.error('Failed to load impact data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchImpact();
  }, [fetchImpact]);

  return {
    impact,
    loading,
    refetch: fetchImpact,
  };
};