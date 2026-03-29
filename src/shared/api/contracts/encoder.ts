// encoder.ts

// ✅ Use this for ID strings (batch_id, distribution_id)
export const hexToBytes32 = (hex: string): Uint8Array => {
  // Remove '0x' if present
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (cleanHex.length !== 64) {
    throw new Error("Hex string must be exactly 64 characters (32 bytes)");
  }
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 64; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
};

// Keep your hashing function ONLY for metadata or passwords
export const stringToHash32 = async (input: string): Promise<Uint8Array> => {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
};