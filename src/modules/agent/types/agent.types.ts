

// export interface Beneficiary {
//   id: string;
//   fullName: string;
//   nationalId: string;
//   phoneNumber: string;
//   fingerprintHash?: string;
//   biometricRegistered: boolean;
//   eligibility: {
//     isEligible: boolean;
//     score: number;
//     lastAssessed: string;
//     reason?: string;
//   };
//   location: {
//     latitude: number;
//     longitude: number;
//     address: string;
//   };
//   registrationDate: string;
// }



// types/agent.types.ts
export interface Beneficiary {
  id: string; // nullifier hash
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  fingerprintHash: string;
  nullifierHash: string;
  metadataHash: string;
  biometricRegistered: boolean;
  eligibility: {
    isEligible: boolean;
    score: number;
    lastAssessed: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  registrationDate: string;
  isActive: boolean;
}

export interface RegisterFormData {
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  fingerprint?: string;
  // location?: {
  //   latitude: number;
  //   longitude: number;
  //   address?: string;
  //   accuracy?: number;
  // };
   location: Location;

}
export interface Distribution {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  type: 'cash' | 'food' | 'shelter' | 'medical' | 'water';
  amount: number;
  currency?: string;
  items?: Array<{ name: string; quantity: number }>;
  status: 'pending' | 'synced' | 'failed';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  syncedAt?: string;  // ✅ Added this property
  offlineQueueId?: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  type: string;
  items: Array<{ name: string; quantity: number }>;
  origin: string;
  destination: string;
  status: 'pending' | 'scanned' | 'distributed';
  qrCode: string;
  scanDate?: string;
}

export interface Transaction {
  id: string;
  type: 'registration' | 'verification' | 'distribution';
  beneficiaryId: string;
  beneficiaryName: string;
  data: any;
  timestamp: string;
  status: 'queued' | 'synced' | 'failed';
  retryCount: number;
  syncedAt?: string;  // ✅ Added this property
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

export interface DistributionFormData {
  beneficiaryId: string;
  type: 'cash' | 'food' | 'shelter' | 'medical' | 'water';
  amount: number;
  items?: Array<{ name: string; quantity: number }>;
  notes?: string;
}

export interface RegisterFormData {
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  fingerprint?: string;
  location: Location;
}


export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}