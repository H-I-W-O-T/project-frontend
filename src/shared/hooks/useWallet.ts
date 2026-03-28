// src/shared/hooks/useWallet.ts

import { useState } from "react";
import {
  Contract,
  TransactionBuilder,
  rpc,
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
  // CONNECT WALLET
  // -------------------------------
  const connectWallet = async () => {
    const connected = await isConnected();

    if (!connected) {
      await requestAccess();
    }

    const result = await getAddress();

    if (!result || !result.address) {
      throw new Error("Failed to get wallet address");
    }

    const address = result.address;

    setPublicKey(address);

    console.log("✅ Connected wallet:", address);

    return address;
  };

  // -------------------------------
  // CALL CONTRACT (CORE ENGINE)
  // -------------------------------
  const callContract = async ({
    contractId,
    method,
    args,
  }: {
    contractId: string;
    method: string;
    args: any[];
  }) => {
    if (!publicKey) {
      throw new Error("Wallet not connected");
    }

    try {
      // -------------------------------
      // LOAD ACCOUNT
      // -------------------------------
      const sourceAccount = await server.getAccount(publicKey);

      const contract = new Contract(contractId);

      // -------------------------------
      // BUILD TRANSACTION
      // -------------------------------
      const tx = new TransactionBuilder(sourceAccount, {
        fee: "100",
        networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(method, ...args))
        .setTimeout(30)
        .build();

      // -------------------------------
      // SIMULATE
      // -------------------------------
      const sim = await server.simulateTransaction(tx);

      if (rpc.Api.isSimulationError(sim)) {
        console.error("❌ Simulation failed:", sim);
        throw new Error("Simulation failed");
      }

      // -------------------------------
      // ASSEMBLE (returns builder)
      // -------------------------------
      const assembledTx = rpc.assembleTransaction(tx, sim);

      // -------------------------------
      // BUILD FINAL TRANSACTION
      // -------------------------------
      const finalTx = assembledTx.build();

      // -------------------------------
      // SIGN WITH FREIGHTER
      // -------------------------------
      const signed = await signTransaction(finalTx.toXDR(), {
        networkPassphrase: NETWORK.NETWORK_PASSPHRASE,
      });

      if (!signed || !signed.signedTxXdr) {
        throw new Error("Signing failed");
      }

      const signedTx = TransactionBuilder.fromXDR(
        signed.signedTxXdr,
        NETWORK.NETWORK_PASSPHRASE
      );

      // -------------------------------
      // SEND TRANSACTION
      // -------------------------------
      const result = await server.sendTransaction(signedTx);

      console.log("✅ TX SUCCESS:", result);

      return result;
    } catch (err) {
      console.error("❌ Contract call failed:", err);
      throw err;
    }
  };

  return {
    publicKey,
    connectWallet,
    callContract,
  };
};