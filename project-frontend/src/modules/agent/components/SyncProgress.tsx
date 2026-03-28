// components/SyncProgress.tsx
import React from 'react';

interface SyncProgressProps {
  progress: number;
  total: number;
  status: 'syncing' | 'completed' | 'error';
}

export const SyncProgress: React.FC<SyncProgressProps> = ({ progress, total, status }) => {
  const percentage = total > 0 ? (progress / total) * 100 : 0;
  
  const getStatusColor = () => {
    switch (status) {
      case 'syncing':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing...';
      case 'completed':
        return 'Sync Complete';
      case 'error':
        return 'Sync Failed';
      default:
        return 'Preparing...';
    }
  };
  
  if (progress === 0 && status !== 'syncing') return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {status === 'syncing' && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span className="text-sm font-medium text-gray-900">{getStatusText()}</span>
          </div>
          <span className="text-sm text-gray-500">
            {progress} / {total} items
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getStatusColor()} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};