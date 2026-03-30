export const hexToBytes32 = (hex: string | Uint8Array): Uint8Array => {
  // 1. If it's already a Uint8Array (from the ledger), return it directly
  if (hex instanceof Uint8Array) {
    if (hex.length !== 32) {
      throw new Error(`Invalid byte length: expected 32, got ${hex.length}`);
    }
    return hex;
  }

  // 2. Otherwise, treat it as a hex string
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  
  if (cleanHex.length !== 64) {
    throw new Error(`Hex string must be 64 characters (32 bytes). Got: ${cleanHex.length}`);
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