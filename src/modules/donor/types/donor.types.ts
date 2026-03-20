// Donor types
export interface DonorStats {
  totalDonated: number;
  activePrograms: number;
  beneficiariesReached: number;
  fundsRemaining: number;
  totalDonatedChange: number;
  beneficiariesReachedChange: number;
  programsChange: number;
  fundsRemainingChange: number;
}

export interface Program {
  programId: string;
  name: string;
  donor: string;
  manager: string;
  totalBudget: number;
  remainingBudget: number;
  amountPerPerson: number;
  beneficiariesReached: number;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  geofence: [number, number][];
}

export interface Shipment {
  batchId: string;
  description: string;
  quantity: number;
  remaining: number;
  status: 'created' | 'in-transit' | 'in-storage' | 'distributed';
  currentLocation: string;
  currentCustodian: string;
  createdAt: string;
  distributedAt?: string;
  timeline: ShipmentEvent[];
}

export interface ShipmentEvent {
  eventId: string;
  eventType: 'create' | 'transfer' | 'damage' | 'distribute';
  from?: string;
  to?: string;
  quantity: number;
  location: string;
  timestamp: string;
  notes?: string;
  evidenceHash?: string;
}

// Define types for the data items with optional color
export interface RegionData {
  name: string;
  value: number;
  color?: string;
}

export interface DemographicData {
  name: string;
  value: number;
  color?: string;
}

export interface AidTypeData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyTrendData {
  month: string;
  beneficiaries: number;
  amount: number;
}

export interface ImpactData {
  totalBeneficiaries: number;
  byRegion: RegionData[];
  byDemographic: DemographicData[];
  byAidType: AidTypeData[];
  monthlyTrend: MonthlyTrendData[];
}

export interface VerificationResult {
  verified: boolean;
  transactionHash: string;
  blockNumber: number;
  timestamp: string;
  details: {
    programId: string;
    amount: number;
    beneficiary: string;
    batchId?: string;
  };
}