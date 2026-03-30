import { CONTRACTS } from "./config";
import { scString, scU32, scAddress, scI32 } from "./utils";
import { hexToBytes32 } from "./encoder";
import { xdr } from "@stellar/stellar-sdk";

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

    async getAllBatches() {
      return wallet.queryContract({
        contractId,
        method: "get_all_batches",
        args: [],
      });
    },

    async getBatchHistory(batchId: string | Uint8Array) {
      const bytes = hexToBytes32(batchId);
      
      return wallet.queryContract({
        contractId: CONTRACTS.SUPPLY,
        method: "get_batch_history",
        args: [xdr.ScVal.scvBytes(bytes as any)], 
      });
    },

    async getBatch(batchId: string) {
      return wallet.queryContract({
        contractId,
        method: "get_batch",
        args: [hexToBytes32(batchId)],
      });
    },

    async recordDamage(custodian: string, batchId: string, quantity: number, lat: number, lng: number, notes: string) {
      return wallet.callContract({
        contractId,
        method: "record_damage",
        args: [
          scAddress(custodian),
          hexToBytes32(batchId),
          scU32(quantity),
          // Soroban Tuple for location (i32, i32)
          { tag: 'Tuple', values: [scI32(Math.round(lat * 1000000)), scI32(Math.round(lng * 1000000))] },
          scString(notes),
        ],
      });
    },

    async transferCustody(sender: string, batchId: string, nextCustodian: string, lat: number, lng: number, notes: string) {
      return wallet.callContract({
        contractId,
        method: "transfer_custody",
        args: [
          scAddress(sender),
          hexToBytes32(batchId),
          scAddress(nextCustodian),
          { tag: 'Tuple', values: [scI32(Math.round(lat * 1000000)), scI32(Math.round(lng * 1000000))] },
          scString(notes),
        ],
      });
    },
  };
};