

// import React, { useEffect, useRef } from "react";
// import { Html5Qrcode } from "html5-qrcode";

// interface Props {
//   onScan: (result: string) => void;
// }

// export const QRScanner: React.FC<Props> = ({ onScan }) => {
//   const scannerRef = useRef<Html5Qrcode | null>(null);
//   const isRunningRef = useRef(false);

//   useEffect(() => {
//     let isMounted = true;

//     const startScanner = async () => {
//       try {
//         // Wait for DOM to exist (FIX for clientWidth error)
//         await new Promise((res) => setTimeout(res, 300));

//         if (!isMounted) return;

//         const scanner = new Html5Qrcode("qr-reader");
//         scannerRef.current = scanner;

//         const devices = await Html5Qrcode.getCameras();

//         if (!devices || devices.length === 0) {
//           console.error("No camera found");
//           return;
//         }

//         const backCamera = devices.find(d =>
//           d.label.toLowerCase().includes("back")
//         );

//         const cameraId = backCamera ? backCamera.id : devices[0].id;

//         await scanner.start(
//           cameraId,
//           {
//             fps: 10,
//             qrbox: 250,
//           },
//           (decodedText) => {
//             if (!isRunningRef.current) return;

//             onScan(decodedText);

//             isRunningRef.current = false;

//             scanner.stop().catch(() => {});
//           },
//           () => {}
//         );

//         isRunningRef.current = true;

//       } catch (err) {
//         console.error("Camera start error:", err);
//       }
//     };

//     startScanner();

//     return () => {
//       isMounted = false;

//       if (scannerRef.current && isRunningRef.current) {
//         scannerRef.current.stop().catch(() => {});
//         isRunningRef.current = false;
//       }
//     };
//   }, [onScan]);

//   return (
//     <div className="flex justify-center">
//       <div id="qr-reader" style={{ width: "300px" }} />
//     </div>
//   );
// };


// export default QRScanner;


import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface Props {
  onScan: (result: any) => void;
}

// ✅ MOCK DATA
const MOCK_BATCHES: Record<string, any> = {
  "BATCH-001": {
    batch_id: "BATCH-001",
    description: "Food Supplies - Rice & Oil",
    quantity: 1000,
    remaining: 750,
    status: 1,
    created_by: "Donor A",
  },
  "BATCH-002": {
    batch_id: "BATCH-002",
    description: "Medical Kits",
    quantity: 500,
    remaining: 500,
    status: 0,
    created_by: "NGO Health",
  },
  "BATCH-003": {
    batch_id: "BATCH-003",
    description: "Cash Aid Batch",
    quantity: 100,
    remaining: 0,
    status: 3,
    created_by: "Gov Program",
  },
};

export const QRScanner: React.FC<Props> = ({ onScan }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        setError(null);

        if (
          window.location.protocol !== "https:" &&
          window.location.hostname !== "localhost"
        ) {
          setError("Camera requires HTTPS or localhost.");
          return;
        }

        await new Promise((res) => setTimeout(res, 300));

        if (!isMounted) return;

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          setError("No camera found.");
          return;
        }

        const cameraId = devices[0].id;

        await scanner.start(
          cameraId,
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            if (!isRunningRef.current) return;

            const batch = MOCK_BATCHES[decodedText];

            if (batch) {
              onScan(batch);
            } else {
              onScan({
                batch_id: decodedText,
                description: "Unknown Batch",
                quantity: 0,
                remaining: 0,
                status: -1,
              });
            }

            isRunningRef.current = false;
            scanner.stop().catch(() => {});
          },
          () => {}
        );

        isRunningRef.current = true;
      } catch (err: any) {
        console.error("Camera error:", err);
        setError("Camera failed or permission denied.");
      }
    };

    startScanner();

    return () => {
      isMounted = false;

      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
  <div className="flex flex-col items-center gap-4">

    {/* 🧾 Title */}
    <h2 className="text-xl font-semibold">
      Scan Batch QR Code
    </h2>

    {/* ℹ️ Instructions */}
    <p className="text-sm text-gray-500 text-center max-w-xs">
      Align the QR code within the frame to scan a batch.
    </p>

    {/* ❌ Error */}
    {error && (
      <p className="text-red-500 text-sm text-center">
        {error}
      </p>
    )}

    {/* 📷 Scanner Box */}
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-2"
    >
      <div id="qr-reader" style={{ width: "300px" }} />
    </div>

    {/* 🔄 Status */}
    {!error && (
      <p className="text-xs text-gray-400">
        Scanning...
      </p>
    )}

  </div>
);
};

export default QRScanner;