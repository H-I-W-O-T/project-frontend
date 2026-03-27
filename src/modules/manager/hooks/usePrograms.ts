import { useState, useEffect } from 'react';
import { managerService } from '../services/managerService';
import type { Program } from '../types/manager.types';

export const usePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await managerService.getPrograms();
      setPrograms(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch programs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async (programData: {
    name: string;
    budget: number;
    amountPerPerson: number;
    geofence: [number, number][];
    donor?: string;
    donorName?: string;
  }) => {
    try {
      const result = await managerService.createProgram(programData);
      // result contains { programId, program }
      setPrograms([result.program, ...programs]);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    createProgram,
  };
};