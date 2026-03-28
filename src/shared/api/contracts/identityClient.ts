import { CONTRACTS } from "./config";
import { toAddress, toScVal } from "./utils";

export const identityClient = (server: any, wallet: any) => {
  const contractId = CONTRACTS.IDENTITY;

  return {
    async register(agent: string, nullifier: string, metadataHash: string) {
      return wallet.callContract({
        contractId,
        method: "register",
        args: [
          toAddress(agent),
          toScVal(nullifier),
          toScVal(metadataHash),
        ],
      });
    },

    async verify(agent: string, nullifier: string) {
      return wallet.callContract({
        contractId,
        method: "verify",
        args: [
          toAddress(agent),
          toScVal(nullifier),
        ],
      });
    },
  };
};