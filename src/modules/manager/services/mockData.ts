// src/modules/manager/services/mockData.ts

import type { Program, Agent, InventoryItem, ProgramStats } from '../types/manager.types';

// Mock Programs
export const mockPrograms: Program[] = [
  {
    programId: 'prog_abc123',
    name: 'Emergency Food Relief - Tigray',
    donor: '0x7a4f3d8e2c1b9a5e8d2f4c6b7a1e3d5f8c2b4a6e',
    donorName: 'World Food Program',
    totalBudget: 50000,
    remainingBudget: 23500,
    amountPerPerson: 25,
    geofence: [
      [13.5, 39.5], // Mekelle
      [14.0, 39.8],
      [13.8, 40.0],
      [13.3, 39.6],
    ],
    isActive: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    beneficiariesReached: 842,
    distributionsCount: 842,
  },
  {
    programId: 'prog_def456',
    name: 'Clean Water Initiative - Afar',
    donor: '0x2c8e5f1a7d3b9e4c6f8a2d5b7e1c3f9a4d6b8e2c',
    donorName: 'UNICEF',
    totalBudget: 75000,
    remainingBudget: 45000,
    amountPerPerson: 15,
    geofence: [
      [11.8, 41.2],
      [12.2, 41.5],
      [11.9, 41.8],
      [11.5, 41.4],
    ],
    isActive: true,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
    beneficiariesReached: 1240,
    distributionsCount: 1240,
  },
  {
    programId: 'prog_ghi789',
    name: 'Medical Supplies - Amhara',
    donor: '0x3f9a2d6b8e1c4f7a9d2b5e8c1f4a7d9b2e5c8f1a',
    donorName: 'Doctors Without Borders',
    totalBudget: 120000,
    remainingBudget: 89000,
    amountPerPerson: 40,
    geofence: [
      [11.6, 37.4],
      [12.0, 37.8],
      [11.8, 38.2],
      [11.4, 37.6],
    ],
    isActive: true,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    beneficiariesReached: 620,
    distributionsCount: 620,
  },
  {
    programId: 'prog_jkl012',
    name: 'Shelter Program - Somali',
    donor: '0x4d2b8e5c1f7a9d4b6e8c2f5a7d9b2e4c8f1a6d3b',
    donorName: 'Red Cross',
    totalBudget: 150000,
    remainingBudget: 150000,
    amountPerPerson: 100,
    geofence: [
      [7.5, 44.5],
      [8.0, 44.8],
      [7.8, 45.2],
      [7.3, 44.7],
    ],
    isActive: false,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
    beneficiariesReached: 0,
    distributionsCount: 0,
  },
];

// Mock Agents
export const mockAgents: Agent[] = [
  {
    agentId: 'agent_001',
    name: 'Alemitu Bekele',
    email: 'alemitu.bekele@hiwot.org',
    phone: '+251-911-234-567',
    isActive: true,
    programsAssigned: ['prog_abc123', 'prog_def456'],
    lastActive: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    totalDistributions: 342,
  },
  {
    agentId: 'agent_002',
    name: 'Tadesse Mekonnen',
    email: 'tadesse.mekonnen@hiwot.org',
    phone: '+251-922-345-678',
    isActive: true,
    programsAssigned: ['prog_abc123'],
    lastActive: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    totalDistributions: 185,
  },
  {
    agentId: 'agent_003',
    name: 'Hiwot Alemu',
    email: 'hiwot.alemu@hiwot.org',
    phone: '+251-933-456-789',
    isActive: true,
    programsAssigned: ['prog_def456', 'prog_ghi789'],
    lastActive: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
    totalDistributions: 498,
  },
  {
    agentId: 'agent_004',
    name: 'Getachew Worku',
    email: 'getachew.worku@hiwot.org',
    phone: '+251-944-567-890',
    isActive: false,
    programsAssigned: ['prog_jkl012'],
    lastActive: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    totalDistributions: 0,
  },
  {
    agentId: 'agent_005',
    name: 'Meron Assefa',
    email: 'meron.assefa@hiwot.org',
    phone: '+251-955-678-901',
    isActive: true,
    programsAssigned: ['prog_ghi789'],
    lastActive: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
    totalDistributions: 267,
  },
];

// Mock Inventory Items
export const mockInventory: InventoryItem[] = [
  {
    itemId: 'inv_001',
    name: 'Wheat Flour',
    category: 'food',
    quantity: 2450,
    unit: 'kg',
    warehouse: 'Addis Ababa Central',
    lowStockThreshold: 500,
  },
  {
    itemId: 'inv_002',
    name: 'Cooking Oil',
    category: 'food',
    quantity: 890,
    unit: 'liters',
    warehouse: 'Addis Ababa Central',
    lowStockThreshold: 200,
  },
  {
    itemId: 'inv_003',
    name: 'Water Purification Tablets',
    category: 'water',
    quantity: 15000,
    unit: 'tablets',
    warehouse: 'Mekelle Hub',
    lowStockThreshold: 3000,
  },
  {
    itemId: 'inv_004',
    name: 'Antimalarial Drugs',
    category: 'medicine',
    quantity: 3200,
    unit: 'doses',
    warehouse: 'Gondar Medical',
    lowStockThreshold: 1000,
  },
  {
    itemId: 'inv_005',
    name: 'Emergency Tents',
    category: 'shelter',
    quantity: 45,
    unit: 'units',
    warehouse: 'Jijiga Warehouse',
    lowStockThreshold: 20,
  },
  {
    itemId: 'inv_006',
    name: 'Blankets',
    category: 'shelter',
    quantity: 1200,
    unit: 'units',
    warehouse: 'Addis Ababa Central',
    lowStockThreshold: 300,
  },
  {
    itemId: 'inv_007',
    name: 'USDC Stablecoin',
    category: 'cash',
    quantity: 87500,
    unit: 'USDC',
    warehouse: 'Digital Wallet',
    lowStockThreshold: 10000,
  },
];

// Mock Program Stats
export const mockProgramStats: { [key: string]: ProgramStats } = {
  prog_abc123: {
    totalBeneficiaries: 842,
    totalDistributed: 21050, // 842 * $25
    remainingFunds: 23500,
    activeAgents: 2,
    distributionsByDay: [
      { date: '2024-03-19', count: 45 },
      { date: '2024-03-20', count: 52 },
      { date: '2024-03-21', count: 48 },
      { date: '2024-03-22', count: 61 },
      { date: '2024-03-23', count: 73 },
      { date: '2024-03-24', count: 82 },
      { date: '2024-03-25', count: 68 },
    ],
  },
  prog_def456: {
    totalBeneficiaries: 1240,
    totalDistributed: 18600, // 1240 * $15
    remainingFunds: 45000,
    activeAgents: 2,
    distributionsByDay: [
      { date: '2024-03-19', count: 120 },
      { date: '2024-03-20', count: 135 },
      { date: '2024-03-21', count: 142 },
      { date: '2024-03-22', count: 158 },
      { date: '2024-03-23', count: 165 },
      { date: '2024-03-24', count: 172 },
      { date: '2024-03-25', count: 148 },
    ],
  },
  prog_ghi789: {
    totalBeneficiaries: 620,
    totalDistributed: 24800, // 620 * $40
    remainingFunds: 89000,
    activeAgents: 2,
    distributionsByDay: [
      { date: '2024-03-19', count: 35 },
      { date: '2024-03-20', count: 42 },
      { date: '2024-03-21', count: 48 },
      { date: '2024-03-22', count: 55 },
      { date: '2024-03-23', count: 63 },
      { date: '2024-03-24', count: 71 },
      { date: '2024-03-25', count: 66 },
    ],
  },
  prog_jkl012: {
    totalBeneficiaries: 0,
    totalDistributed: 0,
    remainingFunds: 150000,
    activeAgents: 0,
    distributionsByDay: [],
  },
};
