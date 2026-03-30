import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DonorStats } from '../components/DonorStats';
import { ProgramCard } from '../components/ProgramCard';
import { useDonorData } from '../hooks/useDonorData';
import { Button } from '../../../shared/components/Common/Button';
import { Card } from '../../../shared/components/Common/Card';
import { Spinner } from '../../../shared/components/Common/Spinner';
import { StatusBadge } from '../../../shared/components/Common/StatusBadge';
import { Modal } from '../../../shared/components/Common/Modal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { stats, programs, loading, refresh } = useDonorData();
  
  // State to control the modal and which program to show
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  const reachedRegions = [...new Set(programs.map(p => p.region).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Sync Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time ledger data from Stellar Network.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={refresh}
            leftIcon={<span className={loading ? "animate-spin" : ""}>🔄</span>}
          >
            Refresh Ledger
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/donor/fund')}
            leftIcon={<span className="text-lg">💰</span>}
            className="shadow-md hover:shadow-lg"
          >
            Fund New Program
          </Button>
        </div>
      </div>

      {stats && <DonorStats stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Active Smart Contracts</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/donor/shipments')}
              rightIcon={<span>→</span>}
            >
              View All
            </Button>
          </div>

          {programs.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-gray-200">
              <div className="text-6xl mb-4">⚓</div>
              <p className="text-gray-500 mb-4">No active aid programs found for this wallet address.</p>
              <Button onClick={() => navigate('/donor/fund')}>
                Deploy First Aid Program
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.slice(0, 4).map((program) => (
                <ProgramCard
                  key={program.programId}
                  program={program}
                  // Open modal instead of navigating
                  onViewDetails={() => setSelectedProgram(program)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Chain Context */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Chain Context</h2>
          <Card className="p-4 bg-gray-50 border-none shadow-inner">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Sync Status</h4>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected to Stellar
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">Data pulled from Soroban RPC.</p>
          </Card>

          <Card className="p-4 bg-gradient-brand text-white shadow-xl">
            <h3 className="font-semibold text-white/90 mb-2 text-sm">Efficiency Analysis</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Verified Distributions</span>
                <span className="font-bold">{stats?.beneficiariesReached?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Budget Utilization</span>
                <span className="font-bold">
                  {stats?.totalDonated > 0 
                    ? (((stats.totalDonated - stats.fundsRemaining) / stats.totalDonated) * 100).toFixed(1) 
                    : '0.0'}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Program Detail Modal */}
      <Modal
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        title="Program Details"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setSelectedProgram(null)}>Close</Button>
            <Button 
              variant="primary" 
              onClick={() => navigate(`/donor/shipments?program=${selectedProgram?.programId}`)}
            >
              Track Shipments
            </Button>
          </div>
        }
      >
        {selectedProgram && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedProgram.name}</h3>
                <p className="text-sm text-gray-500 font-mono mt-1">ID: {selectedProgram.programId}</p>
              </div>
              <StatusBadge status={selectedProgram.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-blue-50 border-none">
                <p className="text-xs text-blue-600 font-semibold uppercase">Total Budget</p>
                <p className="text-xl font-bold text-blue-900">{selectedProgram.totalBudget.toLocaleString()} XLM</p>
              </Card>
              <Card className="p-4 bg-green-50 border-none">
                <p className="text-xs text-green-600 font-semibold uppercase">Remaining</p>
                <p className="text-xl font-bold text-green-900">{selectedProgram.remainingBudget.toLocaleString()} XLM</p>
              </Card>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Utilization Progress</span>
                <span className="font-semibold">{((1 - (selectedProgram.remainingBudget / selectedProgram.totalBudget)) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(1 - (selectedProgram.remainingBudget / selectedProgram.totalBudget)) * 100}%` }}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Impact Data</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-500">Beneficiaries Reached:</span>
                <span className="text-right font-medium">{selectedProgram.beneficiariesReached}</span>
                <span className="text-gray-500">Amount Per Person:</span>
                <span className="text-right font-medium">{selectedProgram.amountPerPerson} XLM</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Impact Snapshot Section ... (remains unchanged) */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Geographic Footprint</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{reachedRegions.length}</p>
            <p className="text-sm text-gray-500 mt-1">Ethiopian Regions Supported</p>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {reachedRegions.length > 0 ? reachedRegions.join(', ') : 'Waiting for contract data...'}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary-medium">100%</p>
            <p className="text-sm text-gray-500 mt-1">Transaction Integrity</p>
            <p className="text-xs text-gray-400">All aid flows are cryptographically signed.</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-primary-light">
              {programs.filter(p => p.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Fully Disbursed Contracts</p>
            <p className="text-xs text-gray-400">Archived on the Stellar ledger.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};