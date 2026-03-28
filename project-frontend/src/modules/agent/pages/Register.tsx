// pages/Register.tsx
import React, { useState } from 'react';
import { useBeneficiary } from '../hooks/useBeneficiary';
import { useLocation } from '../hooks/useLocation';
import { BiometricScanner } from '../components/BiometricScanner';
import { Button } from '../../../shared/components/Common';

const Register: React.FC = () => {
  const { register, loading, error, beneficiary } = useBeneficiary();
  const { location, getCurrentLocation, loading: locationLoading } = useLocation();
  
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    fingerprint: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      alert('Please allow location access to register');
      return;
    }

    try {
      await register({
        ...formData,
        location
      });
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleBiometricCapture = (fingerprintHash: string) => {
    setFormData(prev => ({ ...prev, fingerprint: fingerprintHash }));
  };

  if (beneficiary) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Registration Successful!</h2>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600"><strong>Beneficiary ID:</strong> {beneficiary.id}</p>
            <p className="text-sm text-gray-600 mt-1"><strong>Name:</strong> {beneficiary.fullName}</p>
            <p className="text-sm text-gray-600 mt-1"><strong>Eligibility Score:</strong> {beneficiary.eligibility.score}</p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            fullWidth
          >
            Register Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Register New Beneficiary</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">National ID</label>
              <input
                id="nationalId"
                type="text"
                required
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Biometric Registration */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Biometric Registration</h2>
          <BiometricScanner onCapture={handleBiometricCapture} />
          {formData.fingerprint && (
            <p className="mt-2 text-sm text-green-600">✓ Biometric data captured</p>
          )}
        </div>

        {/* Location */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
          {location ? (
            <div className="text-sm text-gray-600">
              <p>Latitude: {location.latitude}</p>
              <p>Longitude: {location.longitude}</p>
              <p>Accuracy: {location.accuracy}m</p>
            </div>
          ) : (
            <Button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              variant="primary"
              loading={locationLoading}
            >
              Get Current Location
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !location || !formData.fingerprint}
          variant="primary"
          fullWidth
          loading={loading}
        >
          Register Beneficiary
        </Button>
      </form>
    </div>
  );
};

export default Register;