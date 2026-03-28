import type { Program, Agent, InventoryItem, ProgramStats } from '../types/manager.types';
import { 
  mockPrograms, 
  mockAgents, 
  mockInventory, 
  mockProgramStats,
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const managerService = {
  // Program Management
  async getPrograms(): Promise<Program[]> {
    await delay(800);
    return mockPrograms;
  },

  async getProgram(programId: string): Promise<Program | undefined> {
    await delay(500);
    return mockPrograms.find(p => p.programId === programId);
  },

  async createProgram(programData: {
    name: string;
    budget: number;
    amountPerPerson: number;
    geofence: [number, number][];
    donor?: string;
    donorName?: string;
  }): Promise<{ programId: string; program: Program }> {
    await delay(1500);
    
    // Generate mock program ID
    const programId = `prog_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create new program
    const newProgram: Program = {
      programId,
      name: programData.name,
      donor: programData.donor || '0x7a4f3d8e2c1b9a5e8d2f4c6b7a1e3d5f8c2b4a6e',
      donorName: programData.donorName || 'Anonymous Donor',
      totalBudget: programData.budget,
      remainingBudget: programData.budget,
      amountPerPerson: programData.amountPerPerson,
      geofence: programData.geofence,
      isActive: true,
      createdAt: Date.now(),
      beneficiariesReached: 0,
      distributionsCount: 0,
    };
    
    // Add to mock programs array (for demo)
    mockPrograms.unshift(newProgram);
    
    return { programId, program: newProgram };
  },

  async getProgramStats(programId: string): Promise<ProgramStats> {
    await delay(600);
    const stats = mockProgramStats[programId];
    if (!stats) {
      return {
        totalBeneficiaries: 0,
        totalDistributed: 0,
        remainingFunds: 0,
        activeAgents: 0,
        distributionsByDay: [],
      };
    }
    return stats;
  },

  // Geofence Management
  async updateGeofence(programId: string, coordinates: [number, number][]): Promise<void> {
    await delay(800);
    // Find and update program in mock data
    const program = mockPrograms.find(p => p.programId === programId);
    if (program) {
      program.geofence = coordinates;
    }
  },

  // Agent Management
  async getAgents(): Promise<Agent[]> {
    await delay(700);
    return mockAgents;
  },

  async getAgent(agentId: string): Promise<Agent | undefined> {
    await delay(500);
    return mockAgents.find(a => a.agentId === agentId);
  },

  async createAgent(agentData: {
    name: string;
    email: string;
    phone: string;
    programsAssigned?: string[];
  }): Promise<Agent> {
    await delay(1000);
    
    const agentId = `agent_${Math.random().toString(36).substr(2, 3)}`;
    const newAgent: Agent = {
      agentId,
      name: agentData.name,
      email: agentData.email,
      phone: agentData.phone,
      isActive: true,
      programsAssigned: agentData.programsAssigned || [],
      lastActive: Date.now(),
      totalDistributions: 0,
    };
    
    mockAgents.push(newAgent);
    return newAgent;
  },

  async updateAgent(agentId: string, agentData: Partial<Agent>): Promise<Agent> {
    await delay(800);
    
    const index = mockAgents.findIndex(a => a.agentId === agentId);
    if (index === -1) {
      throw new Error('Agent not found');
    }
    
    const updatedAgent = { ...mockAgents[index], ...agentData };
    mockAgents[index] = updatedAgent;
    return updatedAgent;
  },

  async deleteAgent(agentId: string): Promise<void> {
    await delay(600);
    
    const index = mockAgents.findIndex(a => a.agentId === agentId);
    if (index !== -1) {
      mockAgents.splice(index, 1);
    }
  },

  // Inventory Management
  async getInventory(): Promise<InventoryItem[]> {
    await delay(600);
    return mockInventory;
  },

  async updateInventory(itemId: string, quantity: number): Promise<InventoryItem> {
    await delay(700);
    
    const index = mockInventory.findIndex(i => i.itemId === itemId);
    if (index === -1) {
      throw new Error('Inventory item not found');
    }
    
    const updatedItem = { ...mockInventory[index], quantity };
    mockInventory[index] = updatedItem;
    return updatedItem;
  },

  // ZK Queries (Zero-Knowledge Proof Queries)
  async runZKQuery(query: {
    type: string;
    programId?: string;
    dateRange?: { start: number; end: number };
  }): Promise<{
    result: any;
    proof: string;
    executionTime: number;
  }> {
    await delay(1200);
    
    // Mock ZK query responses
    if (query.type === 'unique_beneficiaries') {
      return {
        result: 2106, // Total unique beneficiaries across all programs
        proof: '0x8f4e2d1c7b3a9e5f6d8c2b4a7e1f3d5c8b2a4e6f9',
        executionTime: 342,
      };
    }
    
    if (query.type === 'distribution_by_region') {
      return {
        result: {
          'Tigray': 842,
          'Afar': 1240,
          'Amhara': 620,
          'Oromia': 0,
          'Somali': 0,
        },
        proof: '0x7e3d2c1b9a8f5e4d6c7b2a3f8e1d4c9b5a7e2f3d',
        executionTime: 456,
      };
    }
    
    if (query.type === 'avg_distribution_amount') {
      return {
        result: {
          average: 28.50,
          median: 25.00,
          mode: 25.00,
        },
        proof: '0x9f2e4d1c7b3a8e5f6d9c2b4a7e1f3d5c8b2a4e6f',
        executionTime: 289,
      };
    }
    
    // Default response
    return {
      result: { message: 'Query executed successfully', data: query },
      proof: '0xabcdef1234567890',
      executionTime: 350,
    };
  },
};