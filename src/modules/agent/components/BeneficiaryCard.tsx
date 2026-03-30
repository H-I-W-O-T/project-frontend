// // components/BeneficiaryCard.tsx
// import React from 'react';
// import type { Beneficiary } from '../types/agent.types';

// interface BeneficiaryCardProps {
//   beneficiary: Beneficiary;
// }

// export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({ beneficiary }) => {
//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
//         <h3 className="text-lg font-semibold text-white">Beneficiary Information</h3>
//       </div>
      
//       <div className="p-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
//             <p className="mt-1 text-lg font-semibold text-gray-900">{beneficiary.fullName}</p>
//           </div>
          
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary ID</label>
//             <p className="mt-1 text-lg font-semibold text-gray-900">{beneficiary.id}</p>
//           </div>
          
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">National ID</label>
//             <p className="mt-1 text-gray-900">{beneficiary.nationalId}</p>
//           </div>
          
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</label>
//             <p className="mt-1 text-gray-900">{beneficiary.phoneNumber}</p>
//           </div>
          
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Biometric Status</label>
//             <p className="mt-1">
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 beneficiary.biometricRegistered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//               }`}>
//                 {beneficiary.biometricRegistered ? 'Registered' : 'Not Registered'}
//               </span>
//             </p>
//           </div>
          
//           <div>
//             <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Eligibility Score</label>
//             <p className="mt-1">
//               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 beneficiary.eligibility.score >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {beneficiary.eligibility.score}%
//               </span>
//             </p>
//           </div>
//         </div>
        
//         {beneficiary.eligibility.reason && (
//           <div className="mt-4 p-3 bg-yellow-50 rounded-md">
//             <p className="text-sm text-yellow-800">
//               <strong>Note:</strong> {beneficiary.eligibility.reason}
//             </p>
//           </div>
//         )}
        
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
//           <p className="mt-1 text-sm text-gray-600">
//             {beneficiary.location.address}<br />
//             <span className="text-xs text-gray-400">
//               ({beneficiary.location.latitude}, {beneficiary.location.longitude})
//             </span>
//           </p>
//         </div>
        
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</label>
//           <p className="mt-1 text-sm text-gray-600">
//             {new Date(beneficiary.registrationDate).toLocaleDateString()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };



// components/BeneficiaryCard.tsx
// components/BeneficiaryCard.tsx
import React from 'react';
import { Button } from '../../../shared/components/Common';
import type { Beneficiary } from '../types/agent.types';

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onDistribute?: () => void;
  onVerify?: () => void;
  isVerifying?: boolean;
}

export const BeneficiaryCard: React.FC<BeneficiaryCardProps> = ({ 
  beneficiary, 
  onDistribute,
  onVerify,
  isVerifying = false 
}) => {
  const getEligibilityColor = () => {
    if (!beneficiary.eligibility.isEligible) return 'bg-red-100 text-red-800';
    if (beneficiary.eligibility.score >= 80) return 'bg-green-100 text-green-800';
    if (beneficiary.eligibility.score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getEligibilityText = () => {
    if (!beneficiary.eligibility.isEligible) return 'Not Eligible';
    if (beneficiary.eligibility.score >= 80) return 'Highly Eligible';
    if (beneficiary.eligibility.score >= 60) return 'Eligible';
    return 'Limited Eligibility';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={`h-2 ${
        beneficiary.eligibility.isEligible 
          ? 'bg-gradient-to-r from-green-400 to-green-600' 
          : 'bg-gradient-to-r from-red-400 to-red-600'
      }`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{beneficiary.fullName}</h3>
            <p className="text-sm text-gray-500">ID: {beneficiary.nationalId}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEligibilityColor()}`}>
            {getEligibilityText()}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {beneficiary.phoneNumber}
          </div>
          
          {beneficiary.location && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {beneficiary.location.address}
            </div>
          )}
        </div>

        {/* Eligibility Details */}
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Eligibility Score</span>
            <span className="text-sm font-bold text-gray-900">{beneficiary.eligibility.score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                beneficiary.eligibility.score >= 80 ? 'bg-green-500' :
                beneficiary.eligibility.score >= 60 ? 'bg-yellow-500' :
                'bg-orange-500'
              }`}
              style={{ width: `${beneficiary.eligibility.score}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last assessed: {new Date(beneficiary.eligibility.lastAssessed).toLocaleDateString()}
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${beneficiary.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-600">
              {beneficiary.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Registered: {new Date(beneficiary.registrationDate).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onVerify && (
            <Button
              onClick={onVerify}
              disabled={isVerifying || !beneficiary.isActive}
              variant="secondary"
              size="sm"
              loading={isVerifying}
            >
              Verify
            </Button>
          )}
          {onDistribute && beneficiary.isActive && (
            <Button
              onClick={onDistribute}
              variant="primary"
              size="sm"
            >
              Distribute
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};