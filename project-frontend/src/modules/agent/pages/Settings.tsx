// pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import { useOffline } from '../hooks/useOffline';
import { Button } from '../../../shared/components/Common';

const Settings: React.FC = () => {
  const { location, getCurrentLocation, permission } = useLocation();
  const { clearSynced, queue } = useOffline();
  const [settings, setSettings] = useState({
    autoSync: true,
    highAccuracyLocation: true,
    offlineStorageLimit: 100,
    notificationsEnabled: true
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('agentSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('agentSettings', JSON.stringify(newSettings));
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data? This will remove all offline transactions.')) {
      clearSynced();
      alert('Cache cleared successfully');
    }
  };

  const handleRequestLocation = async () => {
    try {
      await getCurrentLocation();
      alert('Location permission granted and location fetched');
    } catch (error) {
      alert('Failed to get location permission');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Location Settings */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Location Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Location Permission</p>
              <p className="text-sm text-gray-500">
                Status: {permission === 'granted' ? '✅ Granted' : permission === 'denied' ? '❌ Denied' : '⏳ Not requested'}
              </p>
            </div>
            <Button
              onClick={handleRequestLocation}
              variant="primary"
              size="sm"
            >
              Request Location
            </Button>
          </div>

          {location && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">Current Location:</p>
              <p className="text-xs font-mono mt-1">
                Lat: {location.latitude.toFixed(6)}<br />
                Lng: {location.longitude.toFixed(6)}<br />
                Accuracy: {location.accuracy.toFixed(1)}m
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">High Accuracy Location</p>
              <p className="text-sm text-gray-500">Use GPS for precise location</p>
            </div>
            <button
              onClick={() => saveSettings({ ...settings, highAccuracyLocation: !settings.highAccuracyLocation })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.highAccuracyLocation ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.highAccuracyLocation ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sync Settings */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sync Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700">Auto Sync</p>
              <p className="text-sm text-gray-500">Automatically sync when online</p>
            </div>
            <button
              onClick={() => saveSettings({ ...settings, autoSync: !settings.autoSync })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSync ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoSync ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Offline Storage Limit (MB)
            </label>
            <input
              type="number"
              value={settings.offlineStorageLimit}
              onChange={(e) => saveSettings({ ...settings, offlineStorageLimit: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current queue size: {queue.length} transactions
            </p>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <Button
            onClick={handleClearCache}
            variant="danger"
            fullWidth
          >
            Clear All Cached Data
          </Button>
          
          <Button
            onClick={() => {
              const data = {
                settings,
                queue,
                timestamp: new Date().toISOString()
              };
              const dataStr = JSON.stringify(data, null, 2);
              const blob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `agent-backup-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            variant="secondary"
            fullWidth
          >
            Export Data Backup
          </Button>
        </div>
      </div>

      {/* About */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
        
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Agent ID:</strong> AGT-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
          <p><strong>Last Sync:</strong> {new Date().toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-4">
            This application is designed for offline-first operations.
            All data is stored locally and synced when online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;