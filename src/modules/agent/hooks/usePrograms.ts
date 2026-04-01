

// hooks/usePrograms.ts
import { useState, useEffect } from 'react';
import { useWallet } from '../../../shared/hooks/useWallet';

export interface AidProgram {
  programId: string;
  donor: string;
  manager: string;
  token: string;
  totalBudget: string;
  remainingBudget: string;
  amountPerPerson: string;
  frequencyDays: number;
  isActive: boolean;
  geofenceVertices: Array<{ lat: number; lon: number }>;
  startTime: string;
  endTime: string;
  name?: string;
}

export const usePrograms = () => {
  const [programs, setPrograms] = useState<AidProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
//   const { callContract, queryContract, publicKey, connectWallet } = useWallet();

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock programs for testing
      const mockPrograms: AidProgram[] = [
        {
          programId: "aa79ee17faa069cabb0fb198e984f4ac400416be341e5df99d595d0e577073dc",
          donor: "UN",
          manager: "UB",
          token: "0x2222222222222222222222222222222222222222",
          totalBudget: "1",
          remainingBudget: "1",
          amountPerPerson: "1",
          frequencyDays: 30,
          isActive: true,
          geofenceVertices: [
            { lat: 9.03, lon: 38.74 },
            { lat: 9.05, lon: 38.76 },
            { lat: 9.02, lon: 38.78 }
          ],
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          name: "Program aa79"
        },
        {
          programId: "469df37a40a0e982a3418eba7663ae7ad57c55861d57222e6aef27fb81f603d5",
          donor: "UB",
          manager: "UB",
          token: "0x2222222222222222222222222222222222222222",
          totalBudget: "5",
          remainingBudget: "5",
          amountPerPerson: "1",
          frequencyDays: 14,
          isActive: true,
          geofenceVertices: [
            { lat: 9.01, lon: 38.72 },
            { lat: 9.04, lon: 38.74 },
            { lat: 9.00, lon: 38.76 }
          ],
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          name: "program 469d"
        }
      ];
      
      setPrograms(mockPrograms);
      console.log('Programs loaded:', mockPrograms);
      return mockPrograms;
      
    } catch (err: any) {
      console.error("Error fetching programs:", err);
      setError(err.message || "Failed to fetch programs");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getActivePrograms = () => {
    const active = programs.filter(p => p.isActive);
    console.log('Active programs:', active);
    return active;
  };

  const getProgramById = (programId: string) => {
    const program = programs.find(p => p.programId === programId);
    console.log(`Looking for program ${programId}:`, program);
    return program;
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    getActivePrograms,
    getProgramById
  };
};

