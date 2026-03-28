import { nativeToScVal } from "@stellar/stellar-sdk";
import { CONTRACTS } from "./config";
import { scAddress, scString, scU32 } from "./utils";
import { stringToBytes32 } from "./encoder";

export const supplyClient = (wallet: any) => {
  const contractId = CONTRACTS.SUPPLY;

  return {
    async createBatch(address: string, batchId: string, description: string, quantity: number, metadataHash: string) {
      return wallet.callContract({
        address,
        contractId,
        method: "create_batch",
        args: [
          scAddress(address),
          await stringToBytes32(batchId),
          scString(description),
          scU32(quantity),
          await stringToBytes32(metadataHash),
        ],
      });
    },
  };
};