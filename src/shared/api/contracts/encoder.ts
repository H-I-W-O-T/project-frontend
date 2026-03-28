// encoder.ts
export const stringToBytes32 = async (input: string): Promise<Uint8Array> => {
  if (!input) throw new Error("Invalid Bytes input");

  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Return the raw Uint8Array (32 bytes)
  return new Uint8Array(hashBuffer);
};