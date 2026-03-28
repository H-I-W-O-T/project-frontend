export interface ProgramInput {
  programId: string;
  amountPerPerson: number;
  totalBudget: number;
  frequencyDays: number;
  geofence: [number, number][];
  startTime: number;
  endTime: number;
}

export interface DistributionInput {
  programId: string;
  nullifier: string;
  location: [number, number];
  batchId?: string;
}