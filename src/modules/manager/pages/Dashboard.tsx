// src/modules/manager/pages/Dashboard.tsx

import { usePrograms } from '../hooks/usePrograms';
import { DistributionChart } from '../components/DistributionChart';
import { Card } from '../../../shared/components/Common/Card';
import { Button } from '../../../shared/components/Common/Button';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../../shared/components/Common/Spinner';

const Dashboard = () => {
  const { programs, loading, error } = usePrograms();
  const navigate = useNavigate();

  // Calculate totals
  const totalBudget = programs.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalRemaining = programs.reduce((sum, p) => sum + p.remainingBudget, 0);
  const totalBeneficiaries = programs.reduce((sum, p) => sum + p.beneficiariesReached, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Program Manager Dashboard</h1>
        <Button onClick={() => navigate('/manager/create-program')} variant="primary">
          + Create New Program
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Programs</div>
          <div className="text-2xl font-bold">{programs.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Total Budget</div>
          <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Remaining Funds</div>
          <div className="text-2xl font-bold">${totalRemaining.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Beneficiaries Reached</div>
          <div className="text-2xl font-bold">{totalBeneficiaries.toLocaleString()}</div>
        </Card>
      </div>

      {/* Program List */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Programs</h2>
        <div className="space-y-3">
          {programs.map((program) => (
            <div key={program.programId} className="border rounded p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{program.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    Donor: {program.donorName || 'Anonymous'} | Budget: ${program.totalBudget}
                  </div>
                  <div className="text-sm mt-2">
                    Progress: {((program.totalBudget - program.remainingBudget) / program.totalBudget * 100).toFixed(0)}%
                  </div>
                  <div className="w-64 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${((program.totalBudget - program.remainingBudget) / program.totalBudget * 100)}%` }}
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => navigate(`/manager/programs/${program.programId}`)}
                  variant="secondary"
                  size="sm"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Distribution Trends</h2>
          <DistributionChart programs={programs} />
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/manager/geofence')}
              variant="outline"
              className="w-full justify-start"
            >
              📍 Update Geofence Zones
            </Button>
            <Button 
              onClick={() => navigate('/manager/agents')}
              variant="outline"
              className="w-full justify-start"
            >
              👥 Manage Field Agents
            </Button>
            <Button 
              onClick={() => navigate('/manager/inventory')}
              variant="outline"
              className="w-full justify-start"
            >
              📦 Check Inventory
            </Button>
            <Button 
              onClick={() => navigate('/manager/analytics')}
              variant="outline"
              className="w-full justify-start"
            >
              📊 Run Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;