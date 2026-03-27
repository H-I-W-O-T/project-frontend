import { useState } from 'react';
import { useAgents } from '../hooks/useAgents';
import { AgentTable } from '../components/AgentTable';
import { Button } from '../../../shared/components/Common/Button';
import { Card } from '../../../shared/components/Common/Card';
import { Modal } from '../../../shared/components/Common/Modal';
import { Input } from '../../../shared/components/Forms/Input';
import { Select } from '../../../shared/components/Forms/Select';
import { Spinner } from '../../../shared/components/Common/Spinner';
import { usePrograms } from '../hooks/usePrograms';

const Agents = () => {
  const { agents, loading, addAgent, updateAgent, deleteAgent } = useAgents();
  const { programs } = usePrograms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    programsAssigned: [] as string[],
    isActive: true,
  });

  const handleSubmit = async () => {
    if (editingAgent) {
      await updateAgent(editingAgent.agentId, formData);
    } else {
      await addAgent(formData);
    }
    setIsModalOpen(false);
    setEditingAgent(null);
    setFormData({ name: '', email: '', phone: '', programsAssigned: [], isActive: true });
  };

  const handleEdit = (agent: any) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      programsAssigned: agent.programsAssigned,
      isActive: agent.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      await deleteAgent(agentId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Field Agents</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          + Add New Agent
        </Button>
      </div>

      <Card className="p-6">
        <AgentTable 
          agents={agents} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAgent(null);
        }}
        title={editingAgent ? 'Edit Agent' : 'Add New Agent'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Select
                      label="Assigned Programs"
                      multiple
                      value={formData.programsAssigned}
                      onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value);
                          setFormData({ ...formData, programsAssigned: values });
                      } } options={[]}          >
            {programs.map((program) => (
              <option key={program.programId} value={program.programId}>
                {program.name}
              </option>
            ))}
          </Select>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive">Active</label>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingAgent ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Agents;