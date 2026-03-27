// components/QRScanner.tsx
import React, { useRef, useState } from 'react';
import { Button } from '../../../shared/components/Common';

interface QRScannerProps {
  onScan: (result: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate QR scanner since we're using mock data
  // In a real implementation, you'd use a library like html5-qrcode
  const simulateQRScan = () => {
    setScanning(true);
    setTimeout(() => {
      // Mock QR code data
      const mockQRData = 'BATCH-001';
      onScan(mockQRData);
      setScanning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-square bg-gray-900 rounded-lg overflow-hidden">
        {/* This is a mock scanner UI */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-400">
              {scanning ? 'Scanning...' : 'Position QR code in frame'}
            </p>
          </div>
        </div>
        
        {/* Scanner frame overlay */}
        <div className="absolute inset-0 border-2 border-blue-500 m-8 rounded-lg pointer-events-none">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500"></div>
        </div>
      </div>
      
      <Button
        onClick={simulateQRScan}
        disabled={scanning}
        variant="primary"
        loading={scanning}
        className="mt-4"
      >
        Start Scanning
      </Button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-4 text-xs text-gray-500 text-center">
        In production, this will use your device's camera<br />
        Currently in simulation mode
      </p>
    </div>
  );
};