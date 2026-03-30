import { nativeToScVal, xdr, Address } from "@stellar/stellar-sdk"; // Fixed import
import { CONTRACTS } from "./config";

// Helper to ensure the Location object is explicitly tagged as i128
// Using ScVal as a type here
const packLocationToScVal = (loc: { lat: bigint; lon: bigint }): xdr.ScVal => {
  return xdr.ScVal.scvMap([
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol("lat"),
      val: nativeToScVal(loc.lat, { type: "i128" }),
    }),
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol("lon"),
      val: nativeToScVal(loc.lon, { type: "i128" }),
    }),
  ]);
};

const scBytes32 = (hex: string) => {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(
    cleanHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );
  return nativeToScVal(bytes, { type: "bytes" });
};

export const disbursementClient = (wallet: any) => {
  const contractId = CONTRACTS.DISBURSEMENT;

  return {
    async createProgram(
      address: string,
      programId: string,
      amountPerPerson: bigint,
      totalBudget: bigint,
      frequencyDays: number,
      geofence: { lat: bigint; lon: bigint }[],
      startTime: bigint,
      endTime: bigint
    ) {
      // Explicitly pack every vertex in the geofence Vec
      const geofenceScVal = xdr.ScVal.scvVec(
        geofence.map(point => packLocationToScVal(point))
      );

      return wallet.callContract({
        address,
        contractId,
        method: "create_program",
        args: [
          nativeToScVal(address, { type: "address" }),
          scBytes32(programId),
          nativeToScVal(amountPerPerson, { type: "i128" }),
          nativeToScVal(totalBudget, { type: "i128" }),
          nativeToScVal(frequencyDays, { type: "u32" }),
          geofenceScVal, 
          nativeToScVal(startTime, { type: "u64" }),
          nativeToScVal(endTime, { type: "u64" }),
        ],
      });
    },

    async distribute(
      address: string,
      programId: string,
      nullifier: string,
      location: { lat: bigint; lon: bigint },
      batchId?: string
    ) {
      // For Option<BytesN<32>>, if it's undefined, we pass an ScVal representing Void/None
      // const batchVal = batchId ? scBytes32(batchId) : nativeToScVal(void 0);
      const batchVal = batchId
  ? xdr.ScVal.scvVec([scBytes32(batchId)]) // Some(value)
  : xdr.ScVal.scvVoid();   

      return wallet.callContract({
        address,
        contractId,
        method: "distribute",
        args: [
          nativeToScVal(address, { type: "address" }),
          scBytes32(programId),
          scBytes32(nullifier),
          packLocationToScVal(location),
          batchVal,
        ],
      });
    },
    async getProgram(programId: string) {
      return wallet.callContract({
        contractId,
        method: "get_program",
        args: [scBytes32(programId)],
      });
    },

    async getRemainingBudget(programId: string) {
      return wallet.callContract({
        contractId,
        method: "get_remaining_budget",
        args: [scBytes32(programId)],
      });
    },

    async getAllPrograms() {
      return wallet.queryContract({
        contractId,
        method: "get_all_programs",
        args: [],
      });
    },

    // New: Fetch programs specific to the logged-in donor
    async getProgramsByDonor(donorAddress: string) {
      return wallet.queryContract({
        contractId,
        method: "get_programs_by_donor",
        args: [Address.fromString(donorAddress).toScVal()],
      });
    },

    // New: Fetch programs based on current GPS (for Agents)
    async getActiveProgramsAtLocation(lat: bigint, lon: bigint) {
      const locationScVal = packLocationToScVal({ lat, lon });
      return wallet.queryContract({
        contractId,
        method: "get_active_programs_at_location",
        args: [locationScVal],
      });
    },
  };
};