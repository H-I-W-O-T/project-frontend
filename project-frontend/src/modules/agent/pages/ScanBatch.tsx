
// pages/ScanBatch.tsx
import React, { useState } from 'react';
import { useBatches } from '../hooks/useBatches';
import { QRScanner } from '../components/QRScanner';
import { Button } from '../../../shared/components/Common';

const ScanBatch: React.FC = () => {
  const { scanBatch, batch, loading, error, clearBatch } = useBatches();
  const [showScanner, setShowScanner] = useState(true);
  const [manualCode, setManualCode] = useState('');

  const handleScan = async (result: string) => {
    setShowScanner(false);
    try {
      await scanBatch(result);
    } catch (err) {
      console.error('Scan failed:', err);
      setShowScanner(true);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode) {
      try {
        await scanBatch(manualCode);
        setManualCode('');
      } catch (err) {
        console.error('Verification failed:', err);
      }
    }
  };

  const handleNewScan = () => {
    clearBatch();
    setShowScanner(true);
  };

  if (batch) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Batch Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Batch Number</label>
              <p className="text-lg font-semibold text-gray-900">{batch.batchNumber}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="text-gray-900">{batch.type}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Items</label>
              <div className="mt-2 space-y-2">
                {batch.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-200 py-2">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Origin</label>
                <p className="text-gray-900">{batch.origin}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Destination</label>
                <p className="text-gray-900">{batch.destination}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                batch.status === 'scanned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {batch.status}
              </span>
            </div>

            {batch.scanDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">Scanned At</label>
                <p className="text-gray-900">{new Date(batch.scanDate).toLocaleString()}</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleNewScan}
            variant="primary"
            fullWidth
          >
            Scan Another Batch
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Scan Shipment Batch</h1>

      <div className="bg-white shadow rounded-lg p-6">
        {showScanner ? (
          <div>
            <QRScanner onScan={handleScan} />
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or enter manually</span>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="mt-6">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter batch code manually"
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  type="submit"
                  disabled={!manualCode}
                  variant="secondary"
                  fullWidth
                >
                  Verify Batch
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing scan...</p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && !showScanner && (
          <div className="mt-4 text-center text-gray-600">Loading batch details...</div>
        )}
      </div>
    </div>
  );
};

export default ScanBatch;