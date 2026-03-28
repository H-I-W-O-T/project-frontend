import { CONTRACTS } from "./config";
import { scAddress } from "./utils";
import { stringToBytes32 } from "./encoder";

export const identityClient = (wallet: any) => {
  const contractId = CONTRACTS.IDENTITY;

  return {
    async register(agent: string, nullifier: string, metadataHash: string) {
      return wallet.callContract({
        contractId,
        method: "register",
        args: [
          scAddress(agent),
          await stringToBytes32(nullifier),
          await stringToBytes32(metadataHash),
        ],
      });
    },

    async verify(agent: string, nullifier: string) {
      return wallet.callContract({
        contractId,
        method: "verify",
        args: [
          scAddress(agent),
          await stringToBytes32(nullifier),
        ],
      });
    },
  };
};