import { CONTRACTS } from "./config";
import { toAddress, toScVal } from "./utils";

export const supplyClient = (server: any, wallet: any) => {
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
          toAddress(creator),
          toScVal(batchId),
          toScVal(description),
          toScVal(quantity, "u32"),
          toScVal(metadataHash),
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
          toAddress(sender),
          toScVal(batchId),
          toAddress(newCustodian),
          toScVal(location),
          toScVal(notes),
        ],
      });
    },

    async getBatch(batchId: string) {
      return wallet.callContract({
        contractId,
        method: "get_batch",
        args: [toScVal(batchId)],
      });
    },
  };
};