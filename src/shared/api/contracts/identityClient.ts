// identityClient.ts
import { nativeToScVal } from "@stellar/stellar-sdk";
import { scAddress } from "./utils";
import { stringToBytes32 } from "./encoder";
import { CONTRACTS } from "./config";

export const identityClient = (wallet: any) => {
  return {
    async register(address: string, nullifier: string, metadataHash: string) {
      const nullifierBytes = await stringToBytes32(nullifier);
      const metaBytes = await stringToBytes32(metadataHash);

      return wallet.callContract({
        address,
        contractId: CONTRACTS.IDENTITY,
        method: "register",
        args: [
          scAddress(address),
          nativeToScVal(nullifierBytes, { type: "bytes" }), // 32-byte fixed array
          nativeToScVal(metaBytes, { type: "bytes" }),      // 32-byte fixed array
        ],
      });
    },
  };
};