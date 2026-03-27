// manager types
export interface Program {
  programId: string;
  name: string;
  donor: string;
  donorName?: string;
  totalBudget: number;
  remainingBudget: number;
  amountPerPerson: number;
  geofence: [number, number][]; 
  isActive: boolean;
  createdAt: number;
  beneficiariesReached: number;
  distributionsCount: number;
}

export interface Agent {
  agentId: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  programsAssigned: string[]; 
  lastActive: number;
  totalDistributions: number;
}

export interface InventoryItem {
  itemId: string;
  name: string;
  category: 'food' | 'water' | 'medicine' | 'shelter' | 'cash';
  quantity: number;
  unit: string; // kg, liters, units, etc.
  warehouse: string;
  lowStockThreshold: number;
}

export interface ProgramStats {
  totalBeneficiaries: number;
  totalDistributed: number;
  remainingFunds: number;
  activeAgents: number;
  distributionsByDay: { date: string; count: number }[];
}

export interface GeofenceData {
  programId: string;
  coordinates: [number, number][];
  center: [number, number];
  zoom: number;
}