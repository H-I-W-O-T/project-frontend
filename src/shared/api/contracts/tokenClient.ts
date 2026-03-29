import { nativeToScVal } from "@stellar/stellar-sdk";
import { CONTRACTS } from "./config";

export const tokenClient = (wallet: any) => {
  const contractId = CONTRACTS.TOKEN;

  return {
    async approve(from: string, spender: string, amount: bigint, expiration: number) {
      return wallet.callContract({
        contractId,
        method: "approve",
        args: [
          nativeToScVal(from, { type: "address" }),
          nativeToScVal(spender, { type: "address" }),
          nativeToScVal(amount, { type: "i128" }),
          nativeToScVal(expiration, { type: "u32" }), // Force u32 wrapping
        ],
        address: from
      });
    },

    async allowance(from: string, spender: string) {
      return wallet.callContract({
        contractId,
        method: "allowance",
        args: [
          nativeToScVal(from, { type: "address" }),
          nativeToScVal(spender, { type: "address" })
        ]
      });
    },
    
    // ... keep your mint and transfer logic here, but use nativeToScVal similarly!
  };
};