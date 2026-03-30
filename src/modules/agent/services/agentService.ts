


// // services/agentService.ts
// import type { Beneficiary, Distribution, Batch, RegisterFormData, DistributionFormData } from '../types/agent.types';

// // Mock data storage
// const mockBeneficiaries: Map<string, Beneficiary> = new Map();
// const mockDistributions: Distribution[] = [];
// const mockBatches: Batch[] = [];

// // Initialize mock data
// const initializeMockData = () => {
//   // Sample beneficiaries
//   const sampleBeneficiaries: Beneficiary[] = [
//     {
//       id: 'BEN-001',
//       fullName: 'Abebe Kebede',
//       nationalId: 'ETH123456789',
//       phoneNumber: '+251911234567',
//       biometricRegistered: true,
//       eligibility: { isEligible: true, score: 85, lastAssessed: '2026-03-20' },
//       location: { latitude: 9.03, longitude: 38.74, address: 'Addis Ababa, Ethiopia' },
//       registrationDate: '2026-03-15'
//     },
//     {
//       id: 'BEN-002',
//       fullName: 'Tigist Haile',
//       nationalId: 'ETH987654321',
//       phoneNumber: '+251922345678',
//       biometricRegistered: false,
//       eligibility: { isEligible: true, score: 92, lastAssessed: '2026-03-21' },
//       location: { latitude: 9.03, longitude: 38.74, address: 'Addis Ababa, Ethiopia' },
//       registrationDate: '2026-03-18'
//     },
//     {
//       id: 'BEN-003',
//       fullName: 'Solomon Desta',
//       nationalId: 'ETH456789123',
//       phoneNumber: '+251933456789',
//       biometricRegistered: true,
//       eligibility: { isEligible: false, score: 45, lastAssessed: '2026-03-19', reason: 'Income above threshold' },
//       location: { latitude: 9.03, longitude: 38.74, address: 'Addis Ababa, Ethiopia' },
//       registrationDate: '2026-03-10'
//     }
//   ];

//   sampleBeneficiaries.forEach(b => mockBeneficiaries.set(b.id, b));

//   // Sample distributions
//   mockDistributions.push(
//     {
//       id: 'DIST-001',
//       beneficiaryId: 'BEN-001',
//       beneficiaryName: 'Abebe Kebede',
//       type: 'cash',
//       amount: 5000,
//       currency: 'ETB',
//       status: 'synced',
//       location: { latitude: 9.03, longitude: 38.74, address: 'Addis Ababa' },
//       timestamp: '2026-03-25T10:30:00Z',
//       syncedAt: '2026-03-25T10:30:05Z'
//     },
//     {
//       id: 'DIST-002',
//       beneficiaryId: 'BEN-002',
//       beneficiaryName: 'Tigist Haile',
//       type: 'food',
//       amount: 50,
//       items: [{ name: 'Wheat Flour', quantity: 25 }, { name: 'Cooking Oil', quantity: 5 }],
//       status: 'pending',
//       location: { latitude: 9.03, longitude: 38.74, address: 'Addis Ababa' },
//       timestamp: '2026-03-26T09:15:00Z'
//     }
//   );

//   // Sample batches
//   mockBatches.push(
//     {
//       id: 'BATCH-001',
//       batchNumber: 'SHIP-2026-001',
//       type: 'Food Supplies',
//       items: [{ name: 'Rice', quantity: 1000 }, { name: 'Beans', quantity: 500 }],
//       origin: 'Central Warehouse',
//       destination: 'Addis Ababa Distribution Center',
//       status: 'pending',
//       qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BATCH-001'
//     },
//     {
//       id: 'BATCH-002',
//       batchNumber: 'SHIP-2026-002',
//       type: 'Cash Transfer',
//       items: [{ name: 'Cash', quantity: 500000 }],
//       origin: 'Central Bank',
//       destination: 'Addis Ababa Distribution Center',
//       status: 'scanned',
//       qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BATCH-002',
//       scanDate: '2026-03-26T08:00:00Z'
//     }
//   );
// };

// initializeMockData();

// export const agentService = {
//   // Beneficiary APIs
//   registerBeneficiary: async (data: RegisterFormData): Promise<Beneficiary> => {
//     await mockDelay(1000);
//     const newBeneficiary: Beneficiary = {
//       id: `BEN-${Math.floor(Math.random() * 1000)}`,
//       fullName: data.fullName,
//       nationalId: data.nationalId,
//       phoneNumber: data.phoneNumber,
//       fingerprintHash: data.fingerprint,
//       biometricRegistered: !!data.fingerprint,
//       eligibility: { isEligible: true, score: Math.floor(Math.random() * 100), lastAssessed: new Date().toISOString() },
//       location: {
//         latitude: data.location.latitude,
//         longitude: data.location.longitude,
//         address: data.location.address || 'Unknown location'  // ✅ Provide default address
//       },
//       registrationDate: new Date().toISOString()
//     };
//     mockBeneficiaries.set(newBeneficiary.id, newBeneficiary);
//     return newBeneficiary;
//   },

//   verifyBeneficiary: async (identifier: string): Promise<Beneficiary> => {
//     await mockDelay(800);
//     let beneficiary = mockBeneficiaries.get(identifier);
//     if (!beneficiary) {
//       beneficiary = Array.from(mockBeneficiaries.values()).find(
//         b => b.phoneNumber === identifier || b.nationalId === identifier
//       );
//     }
//     if (!beneficiary) {
//       throw new Error('Beneficiary not found');
//     }
//     return beneficiary;
//   },

//   verifyBiometric: async (fingerprintHash: string): Promise<Beneficiary> => {
//     await mockDelay(500);
//     const beneficiary = Array.from(mockBeneficiaries.values()).find(
//       b => b.fingerprintHash === fingerprintHash
//     );
//     if (!beneficiary) {
//       throw new Error('Biometric verification failed');
//     }
//     return beneficiary;
//   },

//   // Distribution APIs
//   submitDistribution: async (data: DistributionFormData): Promise<Distribution> => {
//     await mockDelay(1000);
//     const beneficiary = mockBeneficiaries.get(data.beneficiaryId);
//     if (!beneficiary) {
//       throw new Error('Beneficiary not found');
//     }
    
//     const distribution: Distribution = {
//       id: `DIST-${Date.now()}`,
//       beneficiaryId: data.beneficiaryId,
//       beneficiaryName: beneficiary.fullName,
//       type: data.type,
//       amount: data.amount,
//       items: data.items,
//       status: 'synced',
//       location: beneficiary.location,
//       timestamp: new Date().toISOString(),
//       syncedAt: new Date().toISOString()
//     };
    
//     mockDistributions.push(distribution);
//     return distribution;
//   },

//   getDistributions: async (beneficiaryId?: string): Promise<Distribution[]> => {
//     await mockDelay(500);
//     if (beneficiaryId) {
//       return mockDistributions.filter(d => d.beneficiaryId === beneficiaryId);
//     }
//     return mockDistributions;
//   },

//   getDistributionHistory: async (limit: number = 50): Promise<Distribution[]> => {
//     await mockDelay(500);
//     return mockDistributions.slice(0, limit);
//   },

//   // Batch APIs
//   scanBatch: async (qrCode: string): Promise<Batch> => {
//     await mockDelay(1000);
//     const batch = mockBatches.find(b => b.qrCode === qrCode || b.batchNumber === qrCode);
//     if (!batch) {
//       throw new Error('Batch not found');
//     }
//     batch.status = 'scanned';
//     batch.scanDate = new Date().toISOString();
//     return batch;
//   },

//   getBatchDetails: async (batchId: string): Promise<Batch> => {
//     await mockDelay(500);
//     const batch = mockBatches.find(b => b.id === batchId);
//     if (!batch) {
//       throw new Error('Batch not found');
//     }
//     return batch;
//   },

//   // Sync APIs
//   syncOfflineData: async (offlineData: any[]): Promise<{ synced: number; failed: number }> => {
//     await mockDelay(2000);
//     return { synced: offlineData.length, failed: 0 };
//   },

//   // Dashboard Stats
//   getDashboardStats: async (): Promise<any> => {
//     await mockDelay(500);
//     return {
//       todayDistributions: mockDistributions.filter(d => 
//         new Date(d.timestamp).toDateString() === new Date().toDateString()
//       ).length,
//       pendingSync: mockDistributions.filter(d => d.status === 'pending').length,
//       totalBeneficiaries: mockBeneficiaries.size,
//       eligibleBeneficiaries: Array.from(mockBeneficiaries.values()).filter(b => b.eligibility.isEligible).length,
//       offlineQueueSize: 0
//     };
//   }
// };

// const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

import type { Beneficiary, Distribution, Batch, RegisterFormData, DistributionFormData } from '../types/agent.types';


const mockBeneficiaries: Map<string, Beneficiary> = new Map();
const mockDistributions: Distribution[] = [];
const mockBatches: Batch[] = [];

// Initialize mock data
const initializeMockData = () => {
  const sampleBeneficiaries: Beneficiary[] = [
    {
      id: 'BEN-001',
      fullName: 'Abebe Kebede',
      nationalId: 'ETH123456789',
      phoneNumber: '+251911234567',

      // REQUIRED by your type (NOT optional)
      fingerprintHash: 'fp_001',
      nullifierHash: 'null_001',
      metadataHash: 'meta_001',

      biometricRegistered: true,

      eligibility: {
        isEligible: true,
        score: 85,
        lastAssessed: '2026-03-20'
      },

      location: {
        latitude: 9.03,
        longitude: 38.74,
        address: 'Addis Ababa, Ethiopia'
      },

      registrationDate: '2026-03-15',

      // REQUIRED
      isActive: true
    },

    {
      id: 'BEN-002',
      fullName: 'Tigist Haile',
      nationalId: 'ETH987654321',
      phoneNumber: '+251922345678',

      fingerprintHash: '',
      nullifierHash: 'null_002',
      metadataHash: 'meta_002',

      biometricRegistered: false,

      eligibility: {
        isEligible: true,
        score: 92,
        lastAssessed: '2026-03-21'
      },

      location: {
        latitude: 9.03,
        longitude: 38.74,
        address: 'Addis Ababa, Ethiopia'
      },

      registrationDate: '2026-03-18',

      isActive: true
    },

    {
      id: 'BEN-003',
      fullName: 'Solomon Desta',
      nationalId: 'ETH456789123',
      phoneNumber: '+251933456789',

      fingerprintHash: 'fp_003',
      nullifierHash: 'null_003',
      metadataHash: 'meta_003',

      biometricRegistered: true,

      eligibility: {
        isEligible: false,
        score: 45,
        lastAssessed: '2026-03-19'
      },

      location: {
        latitude: 9.03,
        longitude: 38.74,
        address: 'Addis Ababa, Ethiopia'
      },

      registrationDate: '2026-03-10',

      isActive: true
    }
  ];

  sampleBeneficiaries.forEach(b => mockBeneficiaries.set(b.id, b));

  // Sample distributions
  mockDistributions.push(
    {
      id: 'DIST-001',
      beneficiaryId: 'BEN-001',
      beneficiaryName: 'Abebe Kebede',
      type: 'cash',
      amount: 5000,
      currency: 'ETB',
      status: 'synced',
      location: {
        latitude: 9.03,
        longitude: 38.74,
        address: 'Addis Ababa'
      },
      timestamp: '2026-03-25T10:30:00Z',
      syncedAt: '2026-03-25T10:30:05Z'
    },
    {
      id: 'DIST-002',
      beneficiaryId: 'BEN-002',
      beneficiaryName: 'Tigist Haile',
      type: 'food',
      amount: 50,
      items: [
        { name: 'Wheat Flour', quantity: 25 },
        { name: 'Cooking Oil', quantity: 5 }
      ],
      status: 'pending',
      location: {
        latitude: 9.03,
        longitude: 38.74,
        address: 'Addis Ababa'
      },
      timestamp: '2026-03-26T09:15:00Z'
    }
  );

  // Sample batches
  mockBatches.push(
    {
      id: 'BATCH-001',
      batchNumber: 'SHIP-2026-001',
      type: 'Food Supplies',
      items: [
        { name: 'Rice', quantity: 1000 },
        { name: 'Beans', quantity: 500 }
      ],
      origin: 'Central Warehouse',
      destination: 'Addis Ababa Distribution Center',
      status: 'pending',
      qrCode: 'BATCH-001'
    },
    {
      id: 'BATCH-002',
      batchNumber: 'SHIP-2026-002',
      type: 'Cash Transfer',
      items: [{ name: 'Cash', quantity: 500000 }],
      origin: 'Central Bank',
      destination: 'Addis Ababa Distribution Center',
      status: 'scanned',
      qrCode: 'BATCH-002',
      scanDate: '2026-03-26T08:00:00Z'
    }
  );
};

initializeMockData();

const mockDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const agentService = {
  // ✅ REGISTER
  registerBeneficiary: async (data: RegisterFormData): Promise<Beneficiary> => {
    await mockDelay(1000);

    const newBeneficiary: Beneficiary = {
      id: `BEN-${Date.now()}`,

      fullName: data.fullName,
      nationalId: data.nationalId,
      phoneNumber: data.phoneNumber,

      fingerprintHash: data.fingerprint || '',
      nullifierHash: `null_${Date.now()}`,
      metadataHash: `meta_${Date.now()}`,

      biometricRegistered: !!data.fingerprint,

      eligibility: {
        isEligible: true,
        score: Math.floor(Math.random() * 100),
        lastAssessed: new Date().toISOString()
      },

      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        address: data.location.address || 'Unknown'
      },

      registrationDate: new Date().toISOString(),

      isActive: true
    };
    

    mockBeneficiaries.set(newBeneficiary.id, newBeneficiary);
    return newBeneficiary;
  },

  getDistributionHistory: async (filters?: any) => {
    console.warn('getDistributionHistory not fully implemented yet');
    return [];
  },

  syncOfflineData: async (options?: any) => {
    console.warn('syncOfflineData not fully implemented yet');
    return { success: true, synced: 0 };
  },

  getBatchDetails: async (batchId: string) => {
    console.warn('getBatchDetails not fully implemented yet');
    return {
      id: batchId,
      items: [],
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  },
  
  // For useDistribution.ts
  getDistributions: async (filters?: any) => {
    console.warn('getDistributions not fully implemented yet');
    return [];
  },

  // ✅ VERIFY
  verifyBeneficiary: async (identifier: string): Promise<Beneficiary> => {
    await mockDelay(800);

    let beneficiary = mockBeneficiaries.get(identifier);

    if (!beneficiary) {
      beneficiary = Array.from(mockBeneficiaries.values()).find(
        b =>
          b.phoneNumber === identifier ||
          b.nationalId === identifier ||
          b.nullifierHash === identifier
      );
    }

    if (!beneficiary) {
      throw new Error('Beneficiary not found');
    }

    return beneficiary;
  },

  // ✅ DISTRIBUTE
  submitDistribution: async (
    data: DistributionFormData
  ): Promise<Distribution> => {
    await mockDelay(1000);

    const beneficiary = mockBeneficiaries.get(data.beneficiaryId);

    if (!beneficiary) {
      throw new Error('Beneficiary not found');
    }

    const distribution: Distribution = {
      id: `DIST-${Date.now()}`,
      beneficiaryId: data.beneficiaryId,
      beneficiaryName: beneficiary.fullName,
      type: data.type,
      amount: data.amount,
      items: data.items,
      status: 'synced',
      location: beneficiary.location!,
      timestamp: new Date().toISOString(),
      syncedAt: new Date().toISOString()
    };

    mockDistributions.push(distribution);
    return distribution;
  },

  // ✅ BATCH
  scanBatch: async (qrCode: string): Promise<Batch> => {
    await mockDelay(1000);

    const batch = mockBatches.find(
      b => b.qrCode === qrCode || b.batchNumber === qrCode
    );

    if (!batch) {
      throw new Error('Batch not found');
    }

    batch.status = 'scanned';
    batch.scanDate = new Date().toISOString();

    return batch;
  },

  getDashboardStats: async () => {
    await mockDelay(500);

    return {
      todayDistributions: mockDistributions.length,
      pendingSync: mockDistributions.filter(d => d.status === 'pending').length,
      totalBeneficiaries: mockBeneficiaries.size,
      eligibleBeneficiaries: Array.from(mockBeneficiaries.values()).filter(
        b => b.eligibility.isEligible
      ).length,
      offlineQueueSize: 0
    };
  }
};