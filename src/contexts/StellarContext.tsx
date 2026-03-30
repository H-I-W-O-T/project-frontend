import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { scValToNative } from "@stellar/stellar-sdk";
import { useWallet } from "../shared/hooks/useWallet";
import { identityClient } from "../shared/api/contracts/identityClient";
import { disbursementClient } from "../shared/api/contracts/disbursementClient";
import { supplyClient } from "../shared/api/contracts/supplyClient";
import { tokenClient } from "../shared/api/contracts/tokenClient";
import { Spinner } from "../shared/components/Common";
import { CONTRACTS } from "../shared/api/contracts/config";

interface UserProfile {
  address: string;
  name: string;
  role: number; // 0=Donor, 1=Manager, 2=Agent
  organization: string;
}

interface StellarContextType {
  publicKey: string | null;
  userProfile: UserProfile | null;
  userRole: number | null;
  connect: () => Promise<string | null>;
  disconnect: () => void;
  callContract: ReturnType<typeof useWallet>['callContract'];
  queryContract: ReturnType<typeof useWallet>['queryContract'];
  clients: {
    identity: any;
    disbursement: any;
    supply: any;
    token: any;
  };
  isLoaded: boolean;
  needsRegistration: boolean;
}

const StellarContext = createContext<StellarContextType | undefined>(undefined);

export const StellarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const clients = useMemo(() => ({
    identity: identityClient(wallet),
    disbursement: disbursementClient(wallet),
    supply: supplyClient(wallet),
    token: tokenClient(wallet),
  }), [wallet]);

  useEffect(() => {
    const syncProfile = async () => {
      // Reset profile if wallet is disconnected
      if (!wallet.publicKey) {
        setUserProfile(null);
        if (!wallet.isInitializing) setIsLoaded(true);
        return;
      }

      try {
        const result = await wallet.queryContract({
          contractId: CONTRACTS.IDENTITY,
          method: "get_user_profile",
          args: [wallet.publicKey]
        });

        if (result) {
          const native = scValToNative(result) as UserProfile;
          setUserProfile(native);
        }
      } catch (e) {
        // Contract likely threw Error::NotRegistered
        const isNotRegistered = (e as any).toString().includes("#2") || (e as any).toString().includes("NotRegistered");
    
        if (isNotRegistered) {
          console.log("User not yet registered on-chain. Redirecting to registration...");
          setUserProfile(null);
        } else {
          console.error("Actual Contract Error:", e);
        }
        setUserProfile(null);
      } finally {
        if (!wallet.isInitializing) setIsLoaded(true);
      }
    };

    syncProfile();
  }, [wallet.publicKey, wallet.isInitializing]);

  const contextValue = useMemo(() => ({ 
    publicKey: wallet.publicKey,
    userProfile,
    userRole: userProfile !== null ? userProfile.role : null,
    connect: wallet.connectWallet, 
    disconnect: wallet.disconnectWallet,
    callContract: wallet.callContract,
    queryContract: wallet.queryContract,
    clients, 
    isLoaded,
    needsRegistration: wallet.publicKey !== null && userProfile === null && isLoaded
  }), [wallet, userProfile, clients, isLoaded]);

  return (
    <StellarContext.Provider value={contextValue}>
      {wallet.isInitializing ? (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-sm text-gray-500 font-medium">Connecting to Stellar...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </StellarContext.Provider>
  );
};

export const useStellar = () => {
  const context = useContext(StellarContext);
  if (!context) throw new Error("useStellar must be used within a StellarProvider");
  return context;
};