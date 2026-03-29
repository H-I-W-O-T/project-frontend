import { useState, useEffect, useCallback } from "react";
import {
  Contract,
  TransactionBuilder,
  rpc,
  Address,
  nativeToScVal,
  xdr,
  Account,
} from "@stellar/stellar-sdk";

import {
  getAddress,
  signTransaction,
  isConnected,
  requestAccess,
} from "@stellar/freighter-api";

import { NETWORK } from "../api/contracts/config";

export const useWallet = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); // New flag
  const server = new rpc.Server(NETWORK.RPC_URL);

  useEffect(() => {
    const checkExistingConnection = async () => {
      try {
        const connected = await isConnected();
        if (connected) {
          const result = await getAddress();
          if (result?.address) {
            setPublicKey(result.address);
          }
        }
      } catch (e) {
        console.warn("Auto-connect check failed:", e);
      } finally {
        setIsInitializing(false); // Always finish initializing
      }
    };
    checkExistingConnection();
  }, []);

  // -------------------------------
  // 1. CONNECT WALLET
  // -------------------------------
  const connectWallet = useCallback(async () => {
    try {
      const connected = await isConnected();
      if (!connected) await requestAccess();

      const result = await getAddress();
      if (!result?.address) throw new Error("Freighter locked or access denied.");

      setPublicKey(result.address);
      return result.address;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  }, []);

  // -------------------------------
  // 2. QUERY (READ-ONLY) - No Freighter Popups
  // -------------------------------
  const queryContract = useCallback(async ({
    contractId,
    method,
    args = [],
  }: {
    contractId: string;
    method: string;
    args?: any[];
  }) => {
    try {
      // useWallet.ts (Inside your scArgs.map)

      const scArgs = args.map((arg) => {
        if (arg instanceof xdr.ScVal) return arg;

        // Check for 64-character Hex string (32-byte ID)
        if (typeof arg === "string" && /^[0-9a-fA-F]{64}$/.test(arg)) {
          // Convert hex string to Uint8Array natively
          const bytes = new Uint8Array(arg.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
          return xdr.ScVal.scvBytes(bytes as any);
        }

        if (typeof arg === "string" && (arg.startsWith("G") || arg.startsWith("C"))) {
          return Address.fromString(arg).toScVal();
        }

        return nativeToScVal(arg);
      });

      // Use a dummy account for simulation to avoid needing a real sequence number
      const dummyAccount = new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0");
      
      const tx = new TransactionBuilder(dummyAccount, {
        networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
        fee: "100",
      })
        .addOperation(new Contract(contractId).call(method, ...scArgs))
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);

      if (rpc.Api.isSimulationError(sim)) {
        throw new Error(`Simulation failed: ${sim.error}`);
      }

      return sim.result?.retval;
    } catch (err) {
      console.error(`Query failed for ${method}:`, err);
      return null;
    }
  }, [server]);

  // -------------------------------
  // 3. CALL (WRITE) - Requires Freighter Signature
  // -------------------------------
  const callContract = useCallback(async ({
    contractId,
    method,
    args,
    address,
  }: {
    contractId: string;
    method: string;
    args: any[];
    address?: string;
  }) => {
    const activeAddress = address || publicKey;
    if (!activeAddress) throw new Error("Wallet not connected");

    const scArgs = args.map((arg) => {
      if (arg instanceof xdr.ScVal) return arg;
      if (typeof arg === "string" && (arg.startsWith("G") || arg.startsWith("C"))) {
        return Address.fromString(arg).toScVal();
      }
      return nativeToScVal(arg);
    });

    try {
      // A. Load Real Account for Sequence Number
      const sourceAccount = await server.getAccount(activeAddress);

      // B. Build & Simulate
      const tx = new TransactionBuilder(sourceAccount, {
        fee: "1000",
        networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
      })
        .addOperation(new Contract(contractId).call(method, ...scArgs))
        .setTimeout(30)
        .build();

      const sim = await server.simulateTransaction(tx);
      if (rpc.Api.isSimulationError(sim)) {
        throw new Error(`Simulation failed: ${JSON.stringify(sim.error)}`);
      }

      // C. Assemble & Sign (This triggers Freighter)
      const readyToSignTx = rpc.assembleTransaction(tx, sim).build();
      console.log("Pushing to Freighter for signature...");
      
      const signedResponse = await signTransaction(readyToSignTx.toXDR(), {
        networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
      });

      const signedXdr = typeof signedResponse === "string" 
        ? signedResponse 
        : signedResponse?.signedTxXdr;

      if (!signedXdr) throw new Error("Signing failed or cancelled");

      // D. Submit
      const submission = await server.sendTransaction(
        TransactionBuilder.fromXDR(signedXdr, NETWORK.NETWORK_PASSPHRASE)
      );

      if (submission.status !== "PENDING") {
        throw new Error(`Submission Error: ${JSON.stringify(submission)}`);
      }

      // E. Poll
      return await pollTransactionStatus(submission.hash);
    } catch (err) {
      console.error("❌ Contract call failed:", err);
      throw err;
    }
  }, [publicKey, server]);

  // -------------------------------
  // 4. POLL FOR STATUS
  // -------------------------------
  const pollTransactionStatus = async (hash: string) => {
    let attempts = 0;
    while (attempts < 20) {
      const response = await server.getTransaction(hash);
      if (response.status === "SUCCESS") return response;
      if (response.status === "FAILED") throw new Error("Transaction failed on-chain.");
      
      await new Promise((res) => setTimeout(res, 2000));
      attempts++;
    }
    throw new Error("Polling timed out");
  };

  return {
    publicKey,
    isInitializing,
    connectWallet,
    callContract,
    queryContract,
  };
};