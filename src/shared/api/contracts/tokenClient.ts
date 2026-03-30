import { CONTRACTS } from "./config";
import { scAddress, scI128, scU32 } from "./utils";

export const tokenClient = (wallet: any) => {
  const contractId = CONTRACTS.TOKEN;

  return {
    // 1. Approve (for Disbursement Contract)
    async approve(from: string, spender: string, amount: bigint, expiration: number) {
      return wallet.callContract({
        contractId,
        method: "approve",
        args: [
          scAddress(from),
          scAddress(spender),
          scI128(amount),
          scU32(expiration),
        ],
        address: from
      });
    },

    // 2. Get Balance (The missing piece for your Dashboard)
    async balance(account: string) {
      return wallet.callContract({
        contractId,
        method: "balance",
        args: [scAddress(account)],
      });
    },

    // 3. Get Allowance
    async allowance(from: string, spender: string) {
      return wallet.callContract({
        contractId,
        method: "allowance",
        args: [scAddress(from), scAddress(spender)]
      });
    },

    // 4. Mint (Useful for testing/donors adding funds)
    async mint(to: string, amount: bigint) {
      return wallet.callContract({
        contractId,
        method: "mint",
        args: [scAddress(to), scI128(amount)],
      });
    },

    // 5. Transfer
    async transfer(from: string, to: string, amount: bigint) {
      return wallet.callContract({
        contractId,
        method: "transfer",
        args: [scAddress(from), scAddress(to), scI128(amount)],
        address: from
      });
    }
  };
};