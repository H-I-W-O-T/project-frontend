import { CONTRACTS } from "./config";
import { scAddress, scI128 } from "./utils";

export const tokenClient = (wallet: any) => {
  const contractId = CONTRACTS.TOKEN;

  return {
    async mint(to: string, amount: number) {
      return wallet.callContract({
        contractId,
        method: "mint",
        args: [
          scAddress(to),
          scI128(amount),
        ],
      });
    },

    async transfer(from: string, to: string, amount: number) {
      return wallet.callContract({
        contractId,
        method: "transfer",
        args: [
          scAddress(from),
          scAddress(to),
          scI128(amount),
        ],
      });
    },
  };
};