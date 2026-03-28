import { nativeToScVal } from "@stellar/stellar-sdk";
import { CONTRACTS } from "./config";
import { scAddress, scI128, scU32, scU64 } from "./utils";
import { stringToBytes32 } from "./encoder";

export const disbursementClient = (wallet: any) => {
  const contractId = CONTRACTS.DISBURSEMENT;

  return {
    async createProgram(
      address: string, // Pass address explicitly
      programId: string,
      amountPerPerson: number,
      totalBudget: number,
      frequencyDays: number,
      geofence: [number, number][],
      startTime: number,
      endTime: number
    ) {
      return wallet.callContract({
        address, // Send to wallet hook
        contractId,
        method: "create_program",
        args: [
          scAddress(address),
          await stringToBytes32(programId),
          scI128(amountPerPerson),
          scI128(totalBudget),
          scU32(frequencyDays),
          nativeToScVal(geofence), // Let SDK handle nested vectors
          scU64(startTime),
          scU64(endTime),
        ],
      });
    },

    async distribute(
      address: string,
      programId: string,
      nullifier: string,
      location: [number, number],
      batchId?: string
    ) {
      return wallet.callContract({
        address,
        contractId,
        method: "distribute",
        args: [
          scAddress(address),
          await stringToBytes32(programId),
          await stringToBytes32(nullifier),
          nativeToScVal(location), 
          batchId ? await stringToBytes32(batchId) : nativeToScVal(null),
        ],
      });
    },
  };
};