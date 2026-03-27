import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrograms } from '../hooks/usePrograms';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { Input } from '../../../shared/components/Forms/Input';

const CreateProgram = () => {
  const navigate = useNavigate();
  const { createProgram } = usePrograms();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budget: 0,
    amountPerPerson: 0,
    donorName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createProgram({
        name: formData.name,
        budget: formData.budget,
        amountPerPerson: formData.amountPerPerson,
        geofence: [], // Will be set later in geofence page
        donorName: formData.donorName || undefined,
      });
      
      // Navigate to the program details page
      navigate(`/manager/programs/${result.programId}`);
    } catch (error) {
      console.error('Failed to create program:', error);
      alert('Failed to create program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Aid Program</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Program Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Emergency Food Relief - Tigray"
          />
          
          <Input
            label="Total Budget (USDC)"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
            required
            min={0}
            step={100}
            placeholder="e.g., 50000"
          />
          
          <Input
            label="Amount Per Person (USDC)"
            type="number"
            value={formData.amountPerPerson}
            onChange={(e) => setFormData({ ...formData, amountPerPerson: parseFloat(e.target.value) || 0 })}
            required
            min={0}
            step={5}
            placeholder="e.g., 25"
          />
          
          <Input
            label="Donor Name (Optional)"
            value={formData.donorName}
            onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
            placeholder="e.g., World Food Program"
          />
          
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-sm text-blue-800">
              <strong>Summary:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Budget: ${formData.budget.toLocaleString()}</li>
                <li>• Per person: ${formData.amountPerPerson}</li>
                <li>• Estimated beneficiaries: {Math.floor(formData.budget / (formData.amountPerPerson || 1)).toLocaleString()}</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/manager/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateProgram;