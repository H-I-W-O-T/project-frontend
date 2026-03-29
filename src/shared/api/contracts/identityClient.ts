import { nativeToScVal, xdr } from "@stellar/stellar-sdk";
import { CONTRACTS } from "./config";

// Helper to convert hex string directly to Uint8Array
const hexToBytes32 = (hex: string): Uint8Array => {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (cleanHex.length !== 64) throw new Error("Invalid hex length for BytesN<32>");
  return new Uint8Array(
    cleanHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );
};

export const identityClient = (wallet: any) => {
  return {
    async register(address: string, nullifier: string, metadataHash: string) {
      // FIX: Use hexToBytes32 instead of stringToBytes32
      const nullifierBytes = hexToBytes32(nullifier);
      const metaBytes = hexToBytes32(metadataHash);

      return wallet.callContract({
        address,
        contractId: CONTRACTS.IDENTITY,
        method: "register",
        args: [
          nativeToScVal(address, { type: "address" }),
          nativeToScVal(nullifierBytes, { type: "bytes" }),
          nativeToScVal(metaBytes, { type: "bytes" }),
        ],
      });
    },
    
    // Add a verify method so you can check registration in TestFlow
    async verify(address: string, nullifier: string) {
      const nullifierBytes = hexToBytes32(nullifier);
      return wallet.callContract({
        address,
        contractId: CONTRACTS.IDENTITY,
        method: "verify",
        args: [
          nativeToScVal(address, { type: "address" }),
          nativeToScVal(nullifierBytes, { type: "bytes" }),
        ],
      });
    }
  };
};