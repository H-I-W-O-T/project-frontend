import { useState, useEffect, useCallback } from 'react';
import { donorService } from '../services/donorService';
import type { DonorStats, Program } from '../types/donor.types';
import { useToast } from '../../../shared/components/Common/ToastContainer';

export const useDonorData = () => {
  const [stats, setStats] = useState<DonorStats | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, programsData] = await Promise.all([
        donorService.getStats(),
        donorService.getPrograms(),
      ]);
      setStats(statsData);
      setPrograms(programsData);
    } catch (err) {
      setError('Failed to load donor data');
      toast.error('Failed to load donor data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => fetchData();

  return {
    stats,
    programs,
    loading,
    error,
    refetch,
  };
};