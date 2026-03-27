// pages/OfflineQueue.tsx
import React, { useState } from 'react';
import { useOffline } from '../hooks/useOffline';
import { agentService } from '../services/agentService';

const OfflineQueue: React.FC = () => {
  const { 
    isOnline, 
    queue, 
    syncing, 
    syncQueue, 
    removeFromQueue, 
    clearSynced,
    queueSize,
    pendingCount 
  } = useOffline();
  
  const [syncingNow, setSyncingNow] = useState(false);

  const handleSync = async () => {
    setSyncingNow(true);
    await syncQueue(async (data) => {
      // Mock sync function - replace with actual API calls
      return await agentService.syncOfflineData(data);
    });
    setSyncingNow(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Offline Queue</h1>

      {/* Status Banner */}
      <div className={`mb-6 p-4 rounded-lg ${isOnline ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isOnline ? 'text-green-800' : 'text-yellow-800'}`}>
              {isOnline ? '✅ You are online' : '⚠️ You are offline'}
            </p>
            <p className="text-sm mt-1">
              {queueSize} transactions in queue ({pendingCount} pending sync)
            </p>
          </div>
          {isOnline && queueSize > 0 && (
            <button
              onClick={handleSync}
              disabled={syncing || syncingNow}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {syncing || syncingNow ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </div>
      </div>

      {/* Queue List */}
      {queue.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-500">No offline transactions</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {queue.map((item) => (
              <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {item.type.toUpperCase()} - {item.beneficiaryName}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="font-medium mr-1">Beneficiary ID:</span> {item.beneficiaryId}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    {item.status === 'failed' && (
                      <p className="mt-2 text-sm text-red-600">
                        Failed to sync - will retry automatically
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {queue.some(t => t.status === 'synced') && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={clearSynced}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear synced items
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineQueue;