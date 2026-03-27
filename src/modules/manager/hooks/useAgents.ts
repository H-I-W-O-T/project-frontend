import { useState, useEffect } from 'react';
import { managerService } from '../services/managerService';
import type { Agent } from '../types/manager.types';

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await managerService.getAgents();
      setAgents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (agentData: {
    name: string;
    email: string;
    phone: string;
    programsAssigned?: string[];
  }) => {
    try {
      const newAgent = await managerService.createAgent(agentData);
      setAgents([newAgent, ...agents]); // Add to beginning for better UX
      return newAgent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateAgent = async (agentId: string, agentData: Partial<Agent>) => {
    try {
      const updated = await managerService.updateAgent(agentId, agentData);
      setAgents(agents.map(a => a.agentId === agentId ? updated : a));
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteAgent = async (agentId: string) => {
    try {
      await managerService.deleteAgent(agentId);
      setAgents(agents.filter(a => a.agentId !== agentId));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return {
    agents,
    loading,
    error,
    fetchAgents,
    addAgent,
    updateAgent,
    deleteAgent,
  };
};