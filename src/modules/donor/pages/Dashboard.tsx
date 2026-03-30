import { useNavigate } from 'react-router-dom';
import { DonorStats } from '../components/DonorStats';
import { ProgramCard } from '../components/ProgramCard';
import { useDonorData } from '../hooks/useDonorData';
import { Button } from '../../../shared/components/Common/Button';
import { Card } from '../../../shared/components/Common/Card';
import { Spinner } from '../../../shared/components/Common/Spinner';
import { StatusBadge } from '../../../shared/components/Common/StatusBadge';

export const Dashboard = () => {
  const navigate = useNavigate();
  // Using refresh to pull latest ledger state on demand
  const { stats, programs, loading, refresh } = useDonorData();

  // Blockchain-focused: Group regions by checking active on-chain programs
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

      {/* Stats Cards: Fed directly by the on-chain aggregate logic */}
      {stats && <DonorStats stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Programs (Smart Contract instances) */}
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
                  onViewDetails={(id: string) => navigate(`/donor/shipments?program=${id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - On-Chain Context */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Chain Context</h2>
          
          <Card className="p-4 bg-gray-50 border-none shadow-inner">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Sync Status</h4>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Connected to Stellar
            </div>
            <p className="text-xs text-gray-400 mt-2 italic">Data is pulled directly from the Soroban RPC.</p>
          </Card>

          <Card className="p-4 bg-gradient-brand text-white shadow-xl">
            <h3 className="font-semibold text-white/90 mb-2">Efficiency Analysis</h3>
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

      {/* Impact Snapshot */}
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
              {programs.filter(p => !p.is_active).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Fully Disbursed Contracts</p>
            <p className="text-xs text-gray-400">Archived on the Stellar ledger.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};