// src/shared/api/contracts/tokenClient.ts

import { CONTRACTS } from "./config";
import { toAddress, toScVal } from "./utils";

export const tokenClient = (server: any, wallet: any) => {

  const contractId = CONTRACTS.TOKEN;

  return {
    async mint(to: string, amount: number) {
      return wallet.callContract({
        contractId,
        method: "mint",
        args: [
          toAddress(to),
          toScVal(amount, "i128"),
        ],
      });
    },

    async transfer(from: string, to: string, amount: number) {
      return wallet.callContract({
        contractId,
        method: "transfer",
        args: [
          toAddress(from),
          toAddress(to),
          toScVal(amount, "i128"),
        ],
      });
    },

    async balance(account: string) {
      return wallet.callContract({
        contractId,
        method: "balance",
        args: [toAddress(account)],
      });
    },
  };
};