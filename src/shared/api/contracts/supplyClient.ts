import { CONTRACTS } from "./config";
import { scAddress, scString, scU32, scVec } from "./utils";
import { stringToBytes32 } from "./encoder";

export const supplyClient = (wallet: any) => {
  const contractId = CONTRACTS.SUPPLY;

  return {
    async createBatch(
      creator: string,
      batchId: string,
      description: string,
      quantity: number,
      metadataHash: string
    ) {
      return wallet.callContract({
        contractId,
        method: "create_batch",
        args: [
          scAddress(creator),
          await stringToBytes32(batchId),
          scString(description),
          scU32(quantity),
          await stringToBytes32(metadataHash),
        ],
      });
    },

    async transferCustody(
      sender: string,
      batchId: string,
      newCustodian: string,
      location: [number, number],
      notes: string
    ) {
      return wallet.callContract({
        contractId,
        method: "transfer_custody",
        args: [
          scAddress(sender),
          await stringToBytes32(batchId),
          scAddress(newCustodian),
          scVec(location),
          scString(notes),
        ],
      });
    },
  };
};