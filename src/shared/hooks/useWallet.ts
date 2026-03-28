import { useState } from "react";
import {
  Contract,
  TransactionBuilder,
  rpc,
  Transaction,
  nativeToScVal,
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
  const server = new rpc.Server(NETWORK.RPC_URL);

  // -------------------------------
  // 1. CONNECT WALLET
  // -------------------------------
  const connectWallet = async () => {
    try {
      const connected = await isConnected();
      if (!connected) await requestAccess();

      const result = await getAddress();
      if (!result?.address) {
        throw new Error("Freighter locked or access denied.");
      }

      setPublicKey(result.address);
      console.log("✅ Connected wallet:", result.address);
      return result.address;
    } catch (error) {
      console.error("Connection error:", error);
      throw error;
    }
  };

  // -------------------------------
  // 2. CALL CONTRACT (CORE ENGINE)
  // -------------------------------
  const callContract = async ({
    contractId,
    method,
    args,
    address, // Accept explicit address to avoid React state lag
  }: {
    contractId: string;
    method: string;
    args: any[];
    address?: string;
  }) => {
    const activeAddress = address || publicKey;
    if (!activeAddress) throw new Error("Wallet not connected");

    const scArgs = args.map((arg) => {
      try {
        return nativeToScVal(arg);
      } catch (e) {
        console.error("Mapping error for argument:", arg);
        throw e;
      }
    });

    try {
      // A. Load Account
      const sourceAccount = await server.getAccount(activeAddress);

      // B. Build Skeleton Transaction
      // We cast to 'any' then 'Transaction' to satisfy TS while keeping methods
      let tx = new TransactionBuilder(sourceAccount, {
        fee: "1000", // Soroban requires higher base fees
        networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
      })
        .addOperation(new Contract(contractId).call(method, ...scArgs))
        .setTimeout(30)
        .build();

      // C. Simulate
      //   const sim = await server.simulateTransaction(tx);
      //   if (rpc.Api.isSimulationError(sim)) {
      //     console.error("❌ Simulation Failed:", sim.error);
      //     throw new Error(`Simulation failed: ${sim.error}`);
      //   }

      // D. ASSEMBLE
      const sim = await server.simulateTransaction(tx);
      if (rpc.Api.isSimulationError(sim)) {
        throw new Error(`Simulation failed: ${JSON.stringify(sim.error)}`);
      }

      const readyToSignTx = rpc.assembleTransaction(tx, sim).build();

      // rpc.assembleTransaction returns a Transaction or FeeBumpTransaction
      const assembledTx = rpc.assembleTransaction(tx, sim).build();

      // E. SIGN WITH FREIGHTER
      console.log("Pushing to Freighter...");

      // In v14+, assembledTx.toXDR() returns the XDR string. 
      // We pass this string directly to Freighter.
      // const xdrToSign = assembledTx.toXDR();
      // E. SIGN WITH FREIGHTER
      console.log("Pushing to Freighter...");
      const xdrString = readyToSignTx.toXDR();

      const signedResponse = await signTransaction(xdrString, {
        networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
      });

      // const signedResponse = await signTransaction(xdrToSign, {
      //   networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
      // });

      const signedXdr = typeof signedResponse === "string"
        ? signedResponse
        : signedResponse?.signedTxXdr;

      if (!signedXdr) throw new Error("Signing failed or cancelled");

      // F. Submit to Network
      const submission = await server.sendTransaction(
        TransactionBuilder.fromXDR(signedXdr, NETWORK.NETWORK_PASSPHRASE)
      );

      if (submission.status !== "PENDING") {
        throw new Error(`Submission Error: ${JSON.stringify(submission)}`);
      }

      console.log("⏳ Transaction Pending. Polling for result...", submission.hash);

      // G. Poll for Ledger Confirmation
      // This is vital for your TestFlow to prevent Sequence Number errors
      return await pollTransactionStatus(submission.hash);
    } catch (err) {
      console.error("❌ Contract call failed:", err);
      throw err;
    }
  };

  // -------------------------------
  // 3. HELPER: POLL FOR STATUS
  // -------------------------------
  const pollTransactionStatus = async (hash: string) => {
    let attempts = 0;
    while (attempts < 20) {
      const response = await server.getTransaction(hash);

      if (response.status === "SUCCESS") {
        console.log("✅ Transaction Confirmed on Ledger");
        return response;
      }

      if (response.status === "FAILED") {
        throw new Error("Transaction failed on-chain.");
      }

      // Wait 2 seconds before checking again
      await new Promise((resolve) => setTimeout(resolve, 2000));
      attempts++;
    }
    throw new Error("Transaction polling timed out (40s+)");
  };

  return {
    publicKey,
    connectWallet,
    callContract,
  };
};