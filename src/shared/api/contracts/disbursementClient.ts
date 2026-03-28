import { CONTRACTS } from "./config";
import { toAddress, toScVal } from "./utils";

export const disbursementClient = (server: any, wallet: any) => {
  const contractId = CONTRACTS.DISBURSEMENT;

  return {
    async createProgram(
      donor: string,
      programId: string,
      amountPerPerson: number,
      totalBudget: number,
      frequencyDays: number,
      geofence: [number, number][],
      startTime: number,
      endTime: number
    ) {
      return wallet.callContract({
        contractId,
        method: "create_program",
        args: [
          toAddress(donor),
          toScVal(programId),
          toScVal(amountPerPerson, "i128"),
          toScVal(totalBudget, "i128"),
          toScVal(frequencyDays, "u32"),
          toScVal(geofence),
          toScVal(startTime, "u64"),
          toScVal(endTime, "u64"),
        ],
      });
    },

    async distribute(
      agent: string,
      programId: string,
      nullifier: string,
      location: [number, number],
      batchId?: string
    ) {
      return wallet.callContract({
        contractId,
        method: "distribute",
        args: [
          toAddress(agent),
          toScVal(programId),
          toScVal(nullifier),
          toScVal(location),
          batchId ? toScVal(batchId) : null,
        ],
      });
    },

    async getProgram(programId: string) {
      return wallet.callContract({
        contractId,
        method: "get_program",
        args: [toScVal(programId)],
      });
    },
  };
};