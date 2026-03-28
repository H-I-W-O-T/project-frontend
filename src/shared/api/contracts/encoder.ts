import { nativeToScVal } from "@stellar/stellar-sdk";

export const stringToBytes32 = async (input: string) => {
  if (!input) throw new Error("Invalid Bytes input");

  const data = new TextEncoder().encode(input);

  const hash = await crypto.subtle.digest("SHA-256", data);

  return nativeToScVal(new Uint8Array(hash), { type: "bytes" });
};