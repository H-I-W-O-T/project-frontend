import { Card } from '../../../shared/components/Common/Card';
import type { DonorStats as DonorStatsType } from '../types/donor.types';

interface DonorStatsProps {
  stats: DonorStatsType;
  loading?: boolean;
}

export const DonorStats = ({ stats, loading }: DonorStatsProps) => {
  const statCards = [
    {
      label: 'Total Donated',
      value: `$${stats?.totalDonated?.toLocaleString() || 0}`,
      change: stats?.totalDonatedChange || 0,
      color: '#006666',
      bgColor: 'bg-primary',
    },
    {
      label: 'Active Programs',
      value: stats?.activePrograms?.toLocaleString() || 0,
      change: stats?.programsChange || 0,
      color: '#009999',
      bgColor: 'bg-primary-medium',
    },
    {
      label: 'Beneficiaries Reached',
      value: stats?.beneficiariesReached?.toLocaleString() || 0,
      change: stats?.beneficiariesReachedChange || 0,
      color: '#00CCCC',
      bgColor: 'bg-primary-light',
    },
    {
      label: 'Funds Remaining',
      value: `$${stats?.fundsRemaining?.toLocaleString() || 0}`,
      change: stats?.fundsRemainingChange || 0,
      color: '#003333',
      bgColor: 'bg-primary-dark',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.label} className="overflow-hidden hover-lift">
          <div className="p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className={`text-sm mt-2 ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from last month
            </p>
          </div>
          <div className={`h-1 ${stat.bgColor} rounded-full`} />
        </Card>
      ))}
    </div>
  );
};