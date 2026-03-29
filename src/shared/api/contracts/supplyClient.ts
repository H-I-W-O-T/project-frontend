import { CONTRACTS } from "./config";
import { scAddress, scString, scU32 } from "./utils";
// Use the standard Buffer or a consistent hex-to-bytes helper
import { hexToBytes32 } from "./encoder"; 

// supplyClient.ts
export const supplyClient = (wallet: any) => {
  const contractId = CONTRACTS.SUPPLY;

  return {
    async createBatch(creator: string, batchId: string, description: string, quantity: number, metadataHash: string) {
      return wallet.callContract({
        contractId,
        method: "create_batch",
        args: [
          scAddress(creator),
          hexToBytes32(batchId), // ❌ No more hashing!
          scString(description),
          scU32(quantity),
          hexToBytes32(metadataHash),
        ],
      });
    },
  };
};