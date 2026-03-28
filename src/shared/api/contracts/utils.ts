import {
  Address,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";

// Convert string → Address
export const toAddress = (addr: string) => {
  return Address.fromString(addr);
};

// Convert normal JS → Soroban value
export const toScVal = (value: any, type?: string) => {
  return nativeToScVal(value, { type });
};

// Convert Soroban → JS
export const fromScVal = (val: any) => {
  return scValToNative(val);
};