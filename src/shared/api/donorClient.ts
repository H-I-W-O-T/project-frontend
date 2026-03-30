import { hiwotApi } from './hiwotApi';
import { parseScVal } from './contracts/utils';

/**
 * DonorServiceClient
 * Coordinates data between the Hiwot Backend and the Stellar Blockchain.
 */
export const donorClient = (stellarClients: any, publicKey: string) => {
  return {
    /**
     * Fetches the full dashboard state:
     * - Backend: Program titles, stats, and history.
     * - Blockchain: Real-time wallet balance.
     */
    async getDashboardSummary() {
      try {
        // Run both in parallel for speed
        const [backendData, rawBalance] = await Promise.all([
          hiwotApi.donor.getDashboard(publicKey),
          stellarClients.token.balance(publicKey)
        ]);

        return {
          ...backendData,
          onChainBalance: Number(parseScVal(rawBalance) || 0),
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error("DonorClient: Failed to fetch dashboard", error);
        throw error;
      }
    },

    /**
     * Get a unified view of a program (Cash or Goods)
     */
    async getProgramDetails(programId: string) {
      const isCash = programId.startsWith('cash');
      
      try {
        // Fetch from backend
        const apiDetails = isCash 
          ? await hiwotApi.programs.getCashDetails(programId)
          : await hiwotApi.programs.getGoodsDetails(programId);

        // Fetch live budget from blockchain for "Source of Truth"
        const rawBudget = await stellarClients.disbursement.getRemainingBudget(programId);
        
        return {
          ...apiDetails.program,
          liveRemainingBudget: Number(parseScVal(rawBudget) || 0)
        };
      } catch (error) {
        console.error(`DonorClient: Error fetching program ${programId}`, error);
        throw error;
      }
    },

    /**
     * Get all shipments for the donor
     */
    async getShipmentHistory(status?: string) {
      return hiwotApi.shipments.getByDonor(publicKey, status);
    },

    /**
     * Get deep impact metrics
     */
    async getImpactReport(params?: { from_date?: string; group_by?: 'region' | 'program' }) {
      return hiwotApi.donor.getImpact(publicKey, params);
    }
  };
};