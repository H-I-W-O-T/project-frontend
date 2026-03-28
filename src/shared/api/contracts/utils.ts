import { nativeToScVal, xdr } from "@stellar/stellar-sdk";

export const scAddress = (addr: string) => {
  return nativeToScVal(addr, { type: "address" });
};

export const scString = (val: string) =>
  nativeToScVal(val, { type: "string" });

export const scU32 = (val: number) =>
  nativeToScVal(Math.floor(val), { type: "u32" });

// Use BigInt for u64 and i128 to prevent overflow/type errors
export const scU64 = (val: number | bigint) =>
  nativeToScVal(BigInt(val), { type: "u64" });

export const scI128 = (val: number | bigint) =>
  nativeToScVal(BigInt(val), { type: "i128" });

// Recursive helper for nested vectors (like your geofence)
export const scVec = (arr: any[]) => {
  return nativeToScVal(arr); 
  // Note: nativeToScVal usually handles nested arrays fine 
  // without the { type: "vec" } hint if the elements are standard.
};