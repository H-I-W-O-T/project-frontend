const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Generic Fetch Wrapper
 * Handles error parsing and standardized response formatting
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      // Add Auth headers here if needed: 'Authorization': `Bearer ${token}`
    },
    ...options,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || 'API Request Failed');
  }

  return result.data || result; // Handles both standard and nested data responses
}

export const hiwotApi = {
  // 1. Dashboard & Impact
  donor: {
    getDashboard: (wallet: string) => 
      request<any>(`/donors/${wallet}/dashboard`),
    
    getImpact: (wallet: string, params?: { from_date?: string; to_date?: string }) => {
      const query = new URLSearchParams(params).toString();
      return request<any>(`/donors/${wallet}/impact?${query}`);
    },
    
    getProfile: (wallet: string) => 
      request<any>(`/donors/${wallet}`),
  },

  // 2. Programs
  programs: {
    getCashDetails: (id: string) => 
      request<any>(`/v1/cash-programs/${id}`),
    
    getGoodsDetails: (id: string) => 
      request<any>(`/v1/goods-programs/${id}`),
    
    getSummary: (id: string) => 
      request<any>(`/verify/program/${id}/summary`),
  },

  // 3. Shipments & Logistics
  shipments: {
    getById: (id: string) => 
      request<any>(`/shipments/${id}`),
    
    getByDonor: (wallet: string, status?: string) => {
      const query = status ? `?status=${status}` : '';
      return request<any>(`/donors/${wallet}/shipments${query}`);
    },
  },

  // 4. Verification
  verify: {
    transaction: (programId: string, txHash: string) => 
      request<any>(`/verify/program/${programId}/transaction/${txHash}`),
  }
};