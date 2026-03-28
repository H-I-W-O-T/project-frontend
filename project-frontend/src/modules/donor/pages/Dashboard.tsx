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
  const { stats, programs, loading } = useDonorData();

  // Recent activity mock data
  const recentActivities = [
    {
      id: 1,
      type: 'distribution',
      title: 'Distribution Completed',
      description: '5,000 beneficiaries received food aid in Amhara',
      time: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'shipment',
      title: 'Shipment Arrived',
      description: 'BISC-ETH-2026-001 arrived at Bahir Dar warehouse',
      time: '5 hours ago',
      status: 'info',
    },
    {
      id: 3,
      type: 'program',
      title: 'New Program Created',
      description: 'Medical Supplies - Tigray has been funded',
      time: '1 day ago',
      status: 'success',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Low Inventory Alert',
      description: 'Rice supplies running low in Oromia region',
      time: '2 days ago',
      status: 'warning',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your impact overview.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/donor/fund')}
          leftIcon={<span className="text-lg">💰</span>}
          className="shadow-md hover:shadow-lg"
        >
          Fund New Program
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && <DonorStats stats={stats} />}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Programs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Active Programs</h2>
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
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-gray-500 mb-4">You haven't funded any programs yet.</p>
              <Button onClick={() => navigate('/donor/fund')}>
                Fund Your First Program
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.slice(0, 4).map((program) => (
                <ProgramCard
                  key={program.programId}
                  program={program}
                  onViewDetails={(id: any) => navigate(`/donor/shipments?program=${id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'distribution' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600">👥</span>
                        </div>
                      )}
                      {activity.type === 'shipment' && (
                        <div className="w-8 h-8 bg-primary-light/20 rounded-full flex items-center justify-center">
                          <span className="text-primary">🚚</span>
                        </div>
                      )}
                      {activity.type === 'program' && (
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-primary">📋</span>
                        </div>
                      )}
                      {activity.type === 'alert' && (
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600">⚠️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                        <StatusBadge 
                          status={activity.status as any} 
                          size="sm"
                          showDot={false}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats Summary */}
          <Card className="p-4 bg-gradient-brand text-white">
            <h3 className="font-semibold text-white/90 mb-2">Quick Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Total Beneficiaries</span>
                <span className="font-bold">{stats?.beneficiariesReached?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Avg. Cost per Person</span>
                <span className="font-bold">
                  ${stats?.totalDonated && stats?.beneficiariesReached 
                    ? (stats.totalDonated / stats.beneficiariesReached).toFixed(2)
                    : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Programs Completed</span>
                <span className="font-bold">
                  {programs.filter(p => p.status === 'completed').length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Impact Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Impact Snapshot</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/donor/impact')}
            rightIcon={<span>→</span>}
          >
            View Full Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center hover-lift">
            <p className="text-3xl font-bold text-primary">18%</p>
            <p className="text-sm text-gray-500 mt-1">Beneficiary Growth</p>
            <p className="text-xs text-gray-400">vs last month</p>
          </Card>
          <Card className="p-4 text-center hover-lift">
            <p className="text-3xl font-bold text-primary-medium">5</p>
            <p className="text-sm text-gray-500 mt-1">Regions Reached</p>
            <p className="text-xs text-gray-400">Amhara, Oromia, Tigray, Somali, Benishangul</p>
          </Card>
          <Card className="p-4 text-center hover-lift">
            <p className="text-3xl font-bold text-primary-light">98%</p>
            <p className="text-sm text-gray-500 mt-1">Funds Utilized</p>
            <p className="text-xs text-gray-400">2% remaining in active programs</p>
          </Card>
        </div>
      </div>
    </div>
  );
};