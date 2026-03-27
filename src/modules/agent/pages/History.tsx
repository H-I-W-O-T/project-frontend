// pages/History.tsx
import React, { useState, useEffect } from 'react';
import { useDistribution } from '../hooks/useDistribution';

const History: React.FC = () => {
  const { history, loading, error } = useDistribution();
  const [filter, setFilter] = useState<'all' | 'cash' | 'food' | 'shelter' | 'medical' | 'water'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch = item.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Distribution History</h1>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full sm:w-auto border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="cash">Cash</option>
              <option value="food">Food</option>
              <option value="shelter">Shelter</option>
              <option value="medical">Medical</option>
              <option value="water">Water</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No distributions found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredHistory.map((item) => (
              <li key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {item.beneficiaryName}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'synced' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="font-medium mr-1">Type:</span> {item.type.toUpperCase()}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <span className="font-medium mr-1">Amount:</span> {item.amount} {item.currency || 'units'}
                        </p>
                        {item.items && (
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <span className="font-medium mr-1">Items:</span> {item.items.length}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{new Date(item.timestamp).toLocaleDateString()}</p>
                        <p className="ml-2">{new Date(item.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-400">ID: {item.id}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;