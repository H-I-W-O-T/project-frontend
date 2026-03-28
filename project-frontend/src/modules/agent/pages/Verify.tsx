// pages/Verify.tsx
import React, { useState } from 'react';
import { useBeneficiary } from '../hooks/useBeneficiary';
import { BiometricScanner } from '../components/BiometricScanner';
import { BeneficiaryCard } from '../components/BeneficiaryCard';
import { Button } from '../../../shared/components/Common';

const Verify: React.FC = () => {
  const { verify, verifyBiometric, beneficiary, loading, error, clearBeneficiary } = useBeneficiary();
  const [searchType, setSearchType] = useState<'id' | 'biometric'>('id');
  const [identifier, setIdentifier] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'id') {
      await verify(identifier);
    }
  };

  const handleBiometricVerify = async (fingerprintHash: string) => {
    try {
      await verifyBiometric(fingerprintHash);
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  const handleNewSearch = () => {
    clearBeneficiary();
    setIdentifier('');
  };

  if (beneficiary) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <BeneficiaryCard beneficiary={beneficiary} />
        <div className="mt-6 flex gap-4">
          <Button
            onClick={handleNewSearch}
            variant="primary"
            fullWidth
          >
            New Verification
          </Button>
          <Button
            onClick={() => window.location.href = '/agent/distribute'}
            variant="success"
            fullWidth
          >
            Proceed to Distribution
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Verify Beneficiary</h1>

      {/* Verification Method Toggle */}
      <div className="mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setSearchType('id')}
            className={`py-2 px-4 font-medium text-sm ${
              searchType === 'id'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search by ID/Phone
          </button>
          <button
            onClick={() => setSearchType('biometric')}
            className={`py-2 px-4 font-medium text-sm ${
              searchType === 'biometric'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Biometric Scan
          </button>
        </div>
      </div>

      {searchType === 'id' ? (
        <form onSubmit={handleSearch} className="bg-white shadow rounded-lg p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beneficiary ID or Phone Number
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter BEN-XXX or phone number"
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !identifier}
            variant="primary"
            fullWidth
            loading={loading}
          >
            Verify Beneficiary
          </Button>
        </form>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-4">
            Place your finger on the scanner to verify identity
          </p>
          <BiometricScanner onCapture={handleBiometricVerify} />
          {loading && <p className="mt-4 text-center text-gray-600">Verifying...</p>}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verify;