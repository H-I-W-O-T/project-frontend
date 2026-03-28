
// pages/Distribute.tsx
import React, { useState, useEffect } from 'react';
import { useDistribution } from '../hooks/useDistribution';
import { useBeneficiary } from '../hooks/useBeneficiary';
import { DistributionForm } from '../components/DistributionForm';
import { BeneficiaryCard } from '../components/BeneficiaryCard';
import { Button } from '../../../shared/components/Common';

const Distribute: React.FC = () => {
  const { distribute, loading, error: distError, distributions } = useDistribution();
  const { beneficiary, verify, loading: verifyLoading } = useBeneficiary();
  const [showForm, setShowForm] = useState(false);
  const [searchId, setSearchId] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId) {
      await verify(searchId);
      setShowForm(true);
    }
  };

  const handleDistribute = async (formData: any) => {
    if (beneficiary) {
      await distribute({
        ...formData,
        beneficiaryId: beneficiary.id
      });
      setShowForm(false);
      setSearchId('');
    }
  };

  if (showForm && beneficiary) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BeneficiaryCard beneficiary={beneficiary} />
        <div className="mt-6">
          <DistributionForm 
            beneficiary={beneficiary}
            onSubmit={handleDistribute}
            onCancel={() => {
              setShowForm(false);
              setSearchId('');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Distribute Aid</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Beneficiary</h2>
        
        <form onSubmit={handleSearch}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficiary ID or Phone Number
            </label>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter beneficiary ID or phone number"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={verifyLoading || !searchId}
            variant="primary"
            fullWidth
            loading={verifyLoading}
          >
            Continue
          </Button>
        </form>

        {distError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {distError}
          </div>
        )}
      </div>

      {/* Recent Distributions */}
      {distributions.length > 0 && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Distributions</h2>
          <div className="space-y-4">
            {distributions.slice(0, 5).map((dist) => (
              <div key={dist.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{dist.beneficiaryName}</p>
                    <p className="text-sm text-gray-600">
                      {dist.type.toUpperCase()} - {dist.amount} {dist.currency || 'units'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    dist.status === 'synced' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {dist.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(dist.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Distribute;