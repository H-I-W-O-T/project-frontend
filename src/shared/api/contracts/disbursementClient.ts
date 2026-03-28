import { CONTRACTS } from "./config";
import {
  scAddress,
  scI128,
  scU32,
  scU64,
  scVec,
} from "./utils";
import { stringToBytes32 } from "./encoder";

export const disbursementClient = (wallet: any) => {
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
          scAddress(donor),
          await stringToBytes32(programId),
          scI128(amountPerPerson),
          scI128(totalBudget),
          scU32(frequencyDays),
          scVec(geofence),
          scU64(startTime),
          scU64(endTime),
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
          scAddress(agent),
          await stringToBytes32(programId),
          await stringToBytes32(nullifier),
          scVec(location),
          batchId ? await stringToBytes32(batchId) : null,
        ],
      });
    },
  };
};