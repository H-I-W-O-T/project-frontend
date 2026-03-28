import type { DonorStats, Program, Shipment, ImpactData, VerificationResult } from '../types/donor.types';
import { 
  mockDonorStats, 
  mockPrograms, 
  mockShipments, 
  mockImpactData,
  mockVerificationResult 
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const donorService = {
  // Get donor statistics
  async getStats(): Promise<DonorStats> {
    await delay(800);
    return mockDonorStats;
  },

  // Get all programs funded by donor
  async getPrograms(): Promise<Program[]> {
    await delay(600);
    return mockPrograms;
  },

  // Get program details by ID
  async getProgram(programId: string): Promise<Program | undefined> {
    await delay(500);
    return mockPrograms.find(p => p.programId === programId);
  },

  // Create new aid program (simulates smart contract deployment)
  async createProgram(data: {
    name: string;
    budget: number;
    amountPerPerson: number;
    geofence: [number, number][];
    frequencyDays?: number;
  }): Promise<{ programId: string; transactionHash: string }> {
    await delay(1500);
    
    // Generate mock program ID and transaction hash
    const programId = `prog_${Math.random().toString(36).substr(2, 12)}`;
    const transactionHash = `0x${Math.random().toString(36).substr(2, 40)}`;
    
    // Add to mock programs (for demo purposes)
    const newProgram: Program = {
      programId,
      name: data.name,
      donor: '0x7a4f3d8e2c1b', // Current donor address
      manager: '0x2b9c5f1a8e3d', // Mock manager
      totalBudget: data.budget,
      remainingBudget: data.budget,
      amountPerPerson: data.amountPerPerson,
      beneficiariesReached: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      geofence: data.geofence,
    };
    
    mockPrograms.unshift(newProgram);
    
    // Create a mock shipment for this program
    const newShipment: Shipment = {
      batchId: `${data.name.slice(0, 4).toUpperCase()}-${Date.now()}`,
      description: data.name,
      quantity: Math.floor(data.budget / data.amountPerPerson),
      remaining: Math.floor(data.budget / data.amountPerPerson),
      status: 'created',
      currentLocation: 'Awaiting Pickup',
      currentCustodian: 'Manufacturer',
      createdAt: new Date().toISOString(),
      timeline: [
        {
          eventId: `evt_${Date.now()}`,
          eventType: 'create',
          to: 'Manufacturer',
          quantity: Math.floor(data.budget / data.amountPerPerson),
          location: 'Awaiting shipment',
          timestamp: new Date().toISOString(),
          notes: 'Program funded - shipment pending',
        },
      ],
    };
    
    mockShipments.unshift(newShipment);
    
    return { programId, transactionHash };
  },

  // Get all shipments funded by donor
  async getShipments(): Promise<Shipment[]> {
    await delay(700);
    return mockShipments;
  },

  // Get shipment tracking details
  async getShipment(batchId: string): Promise<Shipment | undefined> {
    await delay(500);
    return mockShipments.find(s => s.batchId === batchId);
  },

  // Get impact data for donor's programs
  async getImpact(): Promise<ImpactData> {
    await delay(800);
    return mockImpactData;
  },

  // Verify blockchain proof
  async verifyTransaction(transactionHash: string): Promise<VerificationResult> {
    await delay(1000);
    // Simulate verification - returns success for valid-looking hashes
    if (transactionHash && transactionHash.startsWith('0x') && transactionHash.length > 10) {
      return { ...mockVerificationResult, transactionHash };
    }
    return {
      verified: false,
      transactionHash,
      blockNumber: 0,
      timestamp: new Date().toISOString(),
      details: {
        programId: '',
        amount: 0,
        beneficiary: '',
      },
    };
  },
};