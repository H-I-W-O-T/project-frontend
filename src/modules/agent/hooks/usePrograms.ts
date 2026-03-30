// // hooks/usePrograms.ts
// import { useState, useEffect } from 'react';
// import { useWallet } from '../../../shared/hooks/useWallet';

// export interface AidProgram {
//   programId: string;
//   donor: string;
//   manager: string;
//   token: string;
//   totalBudget: string;
//   remainingBudget: string;
//   amountPerPerson: string;
//   frequencyDays: number;
//   isActive: boolean;
//   geofenceVertices: Array<{ lat: number; lon: number }>;
//   startTime: string;
//   endTime: string;
//   name?: string; // Optional display name
// }

// export const usePrograms = () => {
//   const [programs, setPrograms] = useState<AidProgram[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const { callContract, publicKey, connectWallet } = useWallet();

//   // Mock function to fetch programs - replace with actual contract call
//   const fetchPrograms = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const activeKey = publicKey || await connectWallet();
      
//       // In production, you'd call your contract to fetch programs
//       // For now, return mock data
//       const mockPrograms: AidProgram[] = [
//         {
//           programId: "0x1111111111111111111111111111111111111111111111111111111111111111",
//           donor: activeKey,
//           manager: activeKey,
//           token: "0x2222222222222222222222222222222222222222",
//           totalBudget: "1000000",
//           remainingBudget: "750000",
//           amountPerPerson: "100",
//           frequencyDays: 30,
//           isActive: true,
//           geofenceVertices: [
//             { lat: 9.03, lon: 38.74 },
//             { lat: 9.05, lon: 38.76 },
//             { lat: 9.02, lon: 38.78 }
//           ],
//           startTime: new Date().toISOString(),
//           endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
//           name: "Emergency Food Aid Program"
//         },
//         {
//           programId: "0x3333333333333333333333333333333333333333333333333333333333333333",
//           donor: activeKey,
//           manager: activeKey,
//           token: "0x2222222222222222222222222222222222222222",
//           totalBudget: "500000",
//           remainingBudget: "500000",
//           amountPerPerson: "50",
//           frequencyDays: 14,
//           isActive: true,
//           geofenceVertices: [
//             { lat: 9.01, lon: 38.72 },
//             { lat: 9.04, lon: 38.74 },
//             { lat: 9.00, lon: 38.76 }
//           ],
//           startTime: new Date().toISOString(),
//           endTime: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
//           name: "Shelter Support Program"
//         }
//       ];
      
//       setPrograms(mockPrograms);
//       return mockPrograms;
      
//     } catch (err: any) {
//       console.error("Error fetching programs:", err);
//       setError(err.message || "Failed to fetch programs");
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getActivePrograms = () => {
//     return programs.filter(p => p.isActive);
//   };

//   const getProgramById = (programId: string) => {
//     return programs.find(p => p.programId === programId);
//   };

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   return {
//     programs,
//     loading,
//     error,
//     fetchPrograms,
//     getActivePrograms,
//     getProgramById
//   };
// };


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
          programId: "03c3fb836de5271c819b2653391a2d682069f5a4d940677ce46364261ce5ee53",
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
          programId: "b23604ddea2c5a7a3c11d625f97bd3ef77032c4fca9b270df8ec52cac0dfd0c2",
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