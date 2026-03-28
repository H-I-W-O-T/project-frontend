import { nativeToScVal } from "@stellar/stellar-sdk";

export const scAddress = (addr: string) => {
  if (!addr || typeof addr !== "string") {
    throw new Error("Invalid address");
  }
  return nativeToScVal(addr, { type: "address" });
};

export const scString = (val: string) =>
  nativeToScVal(val, { type: "string" });

export const scU32 = (val: number) =>
  nativeToScVal(val, { type: "u32" });

export const scU64 = (val: number) =>
  nativeToScVal(val, { type: "u64" });

export const scI128 = (val: number) =>
  nativeToScVal(val, { type: "i128" });

export const scVec = (arr: any[]) =>
  nativeToScVal(arr, { type: "vec" });