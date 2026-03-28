import { useState } from 'react';
import { Card } from '../../../shared/components/Common/Card';
import { Tabs } from '../../../shared/components/Common/Tabs';
import { Spinner } from '../../../shared/components/Common/Spinner';
import { ImpactChart } from '../components/ImpactChart';
import { useImpact } from '../hooks/useImpact';

export const ImpactReports = () => {
  const { impact, loading } = useImpact();
  const [activeTab, setActiveTab] = useState('region');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!impact) {
    return (
      <Card className="p-12 text-center">
        <p className="text-gray-500">No impact data available yet.</p>
      </Card>
    );
  }

  const tabs = [
    { id: 'region', label: 'By Region', content: <ImpactChart data={impact} type="region" /> },
    { id: 'demographic', label: 'By Demographic', content: <ImpactChart data={impact} type="demographic" /> },
    { id: 'trend', label: 'Monthly Trend', content: <ImpactChart data={impact} type="trend" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient">Impact Reports</h1>
        <p className="text-gray-600 mt-1">
          See how your donations are making a difference in Ethiopia.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Total Beneficiaries</p>
          <p className="text-3xl font-bold text-primary mt-1">
            {impact.totalBeneficiaries.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-2">↑ 18% from last month</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Active Programs</p>
          <p className="text-3xl font-bold text-primary-medium mt-1">7</p>
          <p className="text-xs text-green-600 mt-2">↑ 2 new this month</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Average Cost per Person</p>
          <p className="text-3xl font-bold text-primary-light mt-1">
            ${(impact.totalBeneficiaries > 0 
              ? (2450000 / impact.totalBeneficiaries).toFixed(2) 
              : '0')}
          </p>
          <p className="text-xs text-gray-500 mt-2">Below industry average</p>
        </Card>
      </div>

      {/* Charts */}
      <Card className="p-6">
        <Tabs tabs={tabs} defaultTab="region" onChange={setActiveTab} variant="pills" />
      </Card>

      {/* Aid Type Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aid Type Distribution</h3>
        <div className="space-y-3">
          {impact.byAidType.map((type) => (
            <div key={type.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{type.name}</span>
                <span className="font-medium text-gray-900">{type.value}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${type.value}%`, backgroundColor: type.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};