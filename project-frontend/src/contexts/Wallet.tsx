import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Interfaces for our Hiwot Protocol Wallet
export interface WalletState {
  publicKey: string | null;
  usdcBalance: number;
  isConnected: boolean;
  isConnecting: boolean;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  // Specific actions inspired by the Hiwot PDF rules
  registerOrganization: (orgName: string, initialUsdc: number) => Promise<boolean>;
  claimAid: (nullifierHash: string, programId: string) => Promise<boolean>;
  sendShipment: (shipmentId: string, metadata: string) => Promise<boolean>;
}

const defaultState: WalletState = {
  publicKey: null,
  usdcBalance: 0,
  isConnected: false,
  isConnecting: false,
};

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletState, setWalletState] = useState<WalletState>(defaultState);

  // Mocks connecting to a Stellar/Soroban Wallet (e.g., Freighter)
  const connect = async () => {
    setWalletState((prev) => ({ ...prev, isConnecting: true }));
    
    // Simulate network delay finding Freighter or another Stellar wallet
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Generating a dummy Stellar Public Key (G...)
        const dummyStellarKey = 'GABC' + Math.random().toString(36).substring(2, 15).toUpperCase() + 'HIWOT';
        
        setWalletState({
          publicKey: dummyStellarKey,
          usdcBalance: 1000.0, // Simulate having USDC for Hiwot protocol usage
          isConnected: true,
          isConnecting: false,
        });
        resolve();
      }, 1000);
    });
  };

  const disconnect = () => {
    setWalletState(defaultState);
  };

  /* ----- HIWOT PROTOCOL SPECIFIC MOCK ACTIONS (Soroban Integrations) ----- */
  
  // Phase 1: On-Chain Organization Onboarding 
  const registerOrganization = async (orgName: string, initialUsdc: number): Promise<boolean> => {
    if (!walletState.isConnected) throw new Error('Wallet not connected');
    
    console.log(`[Stellar Soroban] Registering org ${orgName} with ${initialUsdc} USDC in escrow...`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 800));
  };

  // Phase 2: Beneficiary Claims Aid (ZK Nullifier + Geo Verification)
  const claimAid = async (nullifierHash: string, programId: string): Promise<boolean> => {
    if (!walletState.isConnected) throw new Error('Wallet not connected');
    
    console.log(`[Stellar Soroban] Verifying ZK Proof for nullifier ${nullifierHash}...`);
    console.log(`[Stellar Soroban] Checking Eligibility for program ${programId}...`);
    console.log(`[Stellar Soroban] Executing logic... transferring 50 USDC to beneficiary...`);
    
    // Add 50 USDC to the mock balance
    setWalletState(prev => ({
      ...prev,
      usdcBalance: prev.usdcBalance + 50
    }));

    return new Promise((resolve) => setTimeout(() => resolve(true), 1200));
  };

  // Phase 3: Immutable Supply Chain Tracking
  const sendShipment = async (shipmentId: string, metadata: string): Promise<boolean> => {
    if (!walletState.isConnected) throw new Error('Wallet not connected');
    
    console.log(`[Stellar Blockchain] Logging shipment transit ${shipmentId} - ${metadata}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 600));
  };

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connect,
        disconnect,
        registerOrganization,
        claimAid,
        sendShipment,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
