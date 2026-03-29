import { useState } from "react";
import { useWallet } from "../shared/hooks/useWallet";
import { identityClient } from "../shared/api/contracts/identityClient";
import { disbursementClient } from "../shared/api/contracts/disbursementClient";
import { supplyClient } from "../shared/api/contracts/supplyClient";
import { tokenClient } from "../shared/api/contracts/tokenClient";
import { CONTRACTS } from "../shared/api/contracts/config";
import { hexToBytes32 } from "../shared/api/contracts/encoder"; // ✅ Ensure you add this helper
import { BatchHistory } from "./BatchHistory";

export const TestFlow = () => {
  const wallet = useWallet();
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentBatchId, setCurrentBatchId] = useState<string>("");

  // --- HELPER: Coordinate Scaling ---
  const SCALE = 1_000_000n;
  const toScaledLocation = (lat: number, lon: number) => ({
    lat: BigInt(Math.round(lat * Number(SCALE))),
    lon: BigInt(Math.round(lon * Number(SCALE))),
  });

  // ✅ Updated: Generates a valid 64-char hex string (32 bytes)
  const create32ByteHex = () => {
    return Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleInit = async () => {
    try {
      const address = await wallet.connectWallet();
      console.log("🛠️ Initializing Disbursement Contract...");
      await wallet.callContract({
        contractId: CONTRACTS.DISBURSEMENT,
        method: "init",
        args: [
          address,            
          CONTRACTS.IDENTITY, 
          CONTRACTS.TOKEN,    
          CONTRACTS.SUPPLY    
        ],
        address
      });
      console.log("✅ Contract Initialized!");
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error("❌ Init Failed:", err);
    }
  };

  const runTest = async () => {
    try {
      const address = await wallet.connectWallet();
      if (!address) throw new Error("Wallet not connected");

      const identity = identityClient(wallet);
      const disbursement = disbursementClient(wallet);
      const supply = supplyClient(wallet);
      const token = tokenClient(wallet);

      // Generate unique IDs for THIS run
      const pId = create32ByteHex(); // Program ID
      const nId = create32ByteHex(); // Nullifier ID
      const bId = create32ByteHex(); // Batch ID
      const mHash = create32ByteHex(); // Metadata Hash

      console.log("--- STARTING FULL FLOW TEST ---");
      console.log("Target Batch ID:", bId);

      // 1. REGISTER
      console.log("Step 1: Registering Nullifier...");
      // We pass the hex string; the client should use hexToBytes32 internally
      await identity.register(address, nId, mHash);
      
      const check = await identity.verify(address, nId);
      console.log("✅ Identity verified:", check);

      // 2. TOKEN APPROVAL
      console.log("Step 2: Approving Token Allowance...");
      await token.approve(address, CONTRACTS.DISBURSEMENT, 5000n, 10000);

      // 3. CREATE PROGRAM
      console.log("Step 3: Creating Aid Program...");
      const now = Math.floor(Date.now() / 1000);
      const geofence = [
        toScaledLocation(9.0, 38.0),
        toScaledLocation(9.0, 39.0),
        toScaledLocation(10.0, 39.0),
        toScaledLocation(10.0, 38.0)
      ];

      await disbursement.createProgram(
        address,
        pId,
        10n,      
        1000n,    
        1,       
        geofence, 
        BigInt(now - 60), 
        BigInt(now + 86400)
      );

      // 4. CREATE BATCH
      console.log("Step 4: Creating Supply Chain Batch...");
      // ⚠️ IMPORTANT: Ensure supplyClient uses hexToBytes32(bId) and NOT stringToBytes32(bId)
      await supply.createBatch(address, bId, "Emergency Food Rations", 100, mHash);
      setCurrentBatchId(bId);

      // 5. DISTRIBUTE
      console.log("Step 5: Running Distribution...");
      const currentLoc = toScaledLocation(9.5, 38.5); 

      // This call links Program, Nullifier, and Batch
      await disbursement.distribute(
        address, 
        pId,
        nId,
        currentLoc, 
        bId 
      );

      // At the very end of runTest()
      console.log("Step 6: Verifying Audit Trail...");
      const history = await supply.getBatchHistory(bId);
      console.log("📜 Full History from Ledger:", history);

      console.log("🚀 FULL FLOW SUCCESS!");
      setRefreshKey(k => k + 1);

    } catch (err: any) {
      console.error("❌ TEST FAILED:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 flex flex-col gap-8 bg-gray-50 rounded-xl shadow-sm border border-gray-200 mt-10">
      <header className="border-b pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System E2E Validator</h1>
        <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Active Network: Testnet</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Step 1: Setup</h2>
            <button onClick={handleInit} className="w-full bg-slate-900 text-white px-6 py-3 rounded-md font-medium hover:bg-slate-800 transition-colors">
            Initialize Protocols
            </button>
            <p className="mt-3 text-xs text-slate-400">Links Token, Identity, and Supply Chain contracts.</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-400 uppercase mb-4">Step 2: Execution</h2>
            <button onClick={runTest} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-500 transition-all shadow-md active:scale-95">
            Run Full Flow Test
            </button>
            <p className="mt-3 text-xs text-slate-400">Performs Register → Approve → Create → Distribute.</p>
        </div>
      </div>

      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-5 rounded-r-lg">
        <div className="flex gap-3">
            <span className="text-indigo-600 font-bold text-lg">ℹ️</span>
            <div>
                <h3 className="text-indigo-900 font-semibold text-sm">Coordinate Integrity Check</h3>
                <p className="text-xs text-indigo-700 leading-relaxed mt-1">
                GPS data is scaled by <strong>10^6</strong> into <code>i128</code> integers. 
                Example: <code>9.5°</code> → <code>9,500,000</code>. This maintains high precision without floating-point errors.
                </p>
            </div>
        </div>
      </div>
      <BatchHistory wallet={wallet} batchId={currentBatchId}/>
    </div>
  );
};