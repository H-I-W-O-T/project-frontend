
// // components/BiometricScanner.tsx
// import React, { useState } from 'react';
// import { Button } from '../../../shared/components/Common';

// interface BiometricScannerProps {
//   onCapture: (fingerprintHash: string) => void;
// }

// export const BiometricScanner: React.FC<BiometricScannerProps> = ({ onCapture }) => {
//   const [scanning, setScanning] = useState(false);

//   const simulateBiometricScan = () => {
//     setScanning(true);
//     // Simulate fingerprint scanning with delay
//     setTimeout(() => {
//       const mockFingerprintHash = `fp_${Math.random().toString(36).substr(2, 16)}`;
//       onCapture(mockFingerprintHash);
//       setScanning(false);
//     }, 2000);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
//       <div className="text-center">
//         <svg
//           className="mx-auto h-12 w-12 text-gray-400"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
//           />
//         </svg>
//         <Button
//           onClick={simulateBiometricScan}
//           disabled={scanning}
//           variant="primary"
//           loading={scanning}
//           className="mt-4"
//         >
//           Scan Fingerprint
//         </Button>
//         <p className="mt-2 text-sm text-gray-500">
//           {scanning ? 'Please hold your finger on the scanner...' : 'Click to simulate biometric scan'}
//         </p>
//       </div>
//     </div>
//   );
// };


// components/BiometricScanner.tsx
import React, { useState } from 'react';
import { Button } from '../../../shared/components/Common';

interface BiometricScannerProps {
  onCapture: (fingerprintHash: string) => void;
  disabled?: boolean;
}

export const BiometricScanner: React.FC<BiometricScannerProps> = ({ 
  onCapture, 
  disabled = false 
}) => {
  const [scanning, setScanning] = useState(false);

  const simulateBiometricScan = () => {
    setScanning(true);
    // Simulate fingerprint scanning with delay
    setTimeout(() => {
      // Generate a deterministic hash for demo purposes
      // In production, this would come from actual hardware scanner
      const mockFingerprintHash = `0x${Array(64).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      onCapture(mockFingerprintHash);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
          />
        </svg>
        <Button
          onClick={simulateBiometricScan}
          disabled={scanning || disabled}
          variant="primary"
          loading={scanning}
          className="mt-4"
        >
          Scan Fingerprint
        </Button>
        <p className="mt-2 text-sm text-gray-500">
          {scanning ? 'Please hold your finger on the scanner...' : 'Click to simulate biometric scan'}
        </p>
      </div>
    </div>
  );
};
