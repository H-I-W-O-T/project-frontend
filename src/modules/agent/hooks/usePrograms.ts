

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
          // programId: "6a7bb77f7641c524a7158dc3a1114aac1c75f48b7f67b5077d0e0bbf3a63674f",
          programId: "aa79ee17faa069cabb0fb198e984f4ac400416be341e5df99d595d0e577073dc",

          donor: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
          manager: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
          token: "0x2222222222222222222222222222222222222222",
          totalBudget: "1000000",
          remainingBudget: "750000",
          amountPerPerson: "100",
          frequencyDays: 30,
          isActive: true,
          geofenceVertices: [
            { lat: 9.03, lon: 38.74 },
            { lat: 9.05, lon: 38.76 },
            { lat: 9.02, lon: 38.78 }
          ],
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          name: "Emergency Food Aid Program"
        },
        {
          // programId: "c8fd1a2114add5080b97c70bdea6652b869cb97e06ce64275a3295a7fc6423fb",
          programId: "469df37a40a0e982a3418eba7663ae7ad57c55861d57222e6aef27fb81f603d5",

          donor: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
          manager: "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF",
          token: "0x2222222222222222222222222222222222222222",
          totalBudget: "500000",
          remainingBudget: "500000",
          amountPerPerson: "50",
          frequencyDays: 14,
          isActive: true,
          geofenceVertices: [
            { lat: 9.01, lon: 38.72 },
            { lat: 9.04, lon: 38.74 },
            { lat: 9.00, lon: 38.76 }
          ],
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          name: "Shelter Support Program"
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

