// components/BeneficiaryCard.tsx
import React from 'react';
import type { Beneficiary } from '../types/agent.types';

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({ beneficiary }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <h3 className="text-lg font-semibold text-white">Beneficiary Information</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{beneficiary.fullName}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary ID</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{beneficiary.id}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">National ID</label>
            <p className="mt-1 text-gray-900">{beneficiary.nationalId}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
            <p className="mt-1 text-gray-900">{beneficiary.phoneNumber}</p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Biometric Status</label>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                beneficiary.biometricRegistered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {beneficiary.biometricRegistered ? 'Registered' : 'Not Registered'}
              </span>
            </p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Eligibility Score</label>
            <p className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                beneficiary.eligibility.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {beneficiary.eligibility.score}%
              </span>
            </p>
          </div>
        </div>
        
        {beneficiary.eligibility.reason && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> {beneficiary.eligibility.reason}
            </p>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
          <p className="mt-1 text-sm text-gray-600">
            {beneficiary.location.address}<br />
            <span className="text-xs text-gray-400">
              ({beneficiary.location.latitude}, {beneficiary.location.longitude})
            </span>
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</label>
          <p className="mt-1 text-sm text-gray-600">
            {new Date(beneficiary.registrationDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};