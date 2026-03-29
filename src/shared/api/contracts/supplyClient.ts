import { CONTRACTS } from "./config";
import { scString, scU32, scAddress } from "./utils";
import { hexToBytes32 } from "./encoder";

export const supplyClient = (wallet: any) => {
  const contractId = CONTRACTS.SUPPLY;

  return {
    // 1. Existing Create Method
    async createBatch(creator: string, batchId: string, description: string, quantity: number, metadataHash: string) {
      return wallet.callContract({
        contractId,
        method: "create_batch",
        args: [
          scAddress(creator),
          hexToBytes32(batchId),
          scString(description),
          scU32(quantity),
          hexToBytes32(metadataHash),
        ],
      });
    },

    // 2. ✅ ADD THIS: Get History Method
    async getBatchHistory(batchId: string) {
      return wallet.callContract({
        contractId,
        method: "get_batch_history",
        args: [
          hexToBytes32(batchId), // Convert the hex string to 32-byte Uint8Array
        ],
      });
    },

    // 3. Optional: Add a quick getter for the current batch state
    async getBatch(batchId: string) {
      return wallet.callContract({
        contractId,
        method: "get_batch",
        args: [hexToBytes32(batchId)],
      });
    }
  };
};