import { useWallet } from "../shared/hooks/useWallet";

import { identityClient } from "../shared/api/contracts/identityClient";
import { disbursementClient } from "../shared/api/contracts/disbursementClient";
import { supplyClient } from "../shared/api/contracts/supplyClient";

export const TestFlow = () => {
  const wallet = useWallet();

  const runTest = async () => {
    
    try {
      // -----------------------------
      // 1. CONNECT WALLET
      // -----------------------------
      const address = await wallet.connectWallet();
      if (!address || typeof address !== "string") {
        throw new Error("Wallet failed");
      }
      console.log("Wallet:", address);

      // Initialize clients
      const identity = identityClient(wallet);
      const disbursement = disbursementClient(wallet);
      const supply = supplyClient(wallet);

      // -----------------------------
      // 2. GENERATE TEST DATA
      // -----------------------------
      const nullifier = "user-" + Math.random();
      const programId = "program-" + Math.random();
      const batchId = "batch-" + Math.random();
      const metadata = "meta-" + Math.random();

      // -----------------------------
      // 3. REGISTER BENEFICIARY
      // -----------------------------
      console.log("Registering...");
      await identity.register(address, nullifier, metadata);
      console.log("✅ Registered");

      // -----------------------------
      // 4. CREATE PROGRAM
      // -----------------------------
      console.log("Creating program...");
      await disbursement.createProgram(
        address,
        programId,
        10, // amount per person
        1000, // total budget
        1, // frequency
        [[9, 38], [9, 39], [10, 39], [10, 38]], // simple square geofence
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000) + 86400
      );
      console.log("✅ Program created");

      // -----------------------------
      // 5. CREATE SUPPLY BATCH
      // -----------------------------
      console.log("Creating batch...");
      await supply.createBatch(
        address,
        batchId,
        "Food Aid",
        100,
        metadata
      );
      console.log("✅ Batch created");

      // -----------------------------
      // 6. DISTRIBUTE
      // -----------------------------
      console.log("Distributing...");
      await disbursement.distribute(
        address,
        programId,
        nullifier,
        [9, 38],
        batchId
      );
      console.log("✅ Distribution SUCCESS");

    } catch (err) {
      console.error("❌ ERROR:", err);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={runTest}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Run Full Flow Test
      </button>
    </div>
  );
};