import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useWallet } from "../shared/hooks/useWallet";
import { identityClient } from "../shared/api/contracts/identityClient";
import { disbursementClient } from "../shared/api/contracts/disbursementClient";
import { supplyClient } from "../shared/api/contracts/supplyClient";
import { tokenClient } from "../shared/api/contracts/tokenClient";
import { Spinner } from "../shared/components/Common";

interface StellarContextType {
  publicKey: string | null;
  connect: () => Promise<string>;
  callContract: ReturnType<typeof useWallet>['callContract'];
  queryContract: ReturnType<typeof useWallet>['queryContract'];
  clients: {
    identity: any;
    disbursement: any;
    supply: any;
    token: any;
  };
  isLoaded: boolean;
}

const StellarContext = createContext<StellarContextType | undefined>(undefined);

export const StellarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. All hooks MUST be declared here, before any 'return' statements
  const wallet = useWallet();
  const [isLoaded, setIsLoaded] = useState(false);

  // Clients update reactively when wallet state changes
  const clients = useMemo(() => ({
    identity: identityClient(wallet),
    disbursement: disbursementClient(wallet),
    supply: supplyClient(wallet),
    token: tokenClient(wallet),
  }), [wallet]);

  // Sync isLoaded with the wallet initialization state
  useEffect(() => {
    if (!wallet.isInitializing) {
      setIsLoaded(true);
    }
  }, [wallet.isInitializing]);

  // Memoize context value for performance
  const contextValue = useMemo(() => ({ 
    publicKey: wallet.publicKey, 
    connect: wallet.connectWallet, 
    callContract: wallet.callContract,
    queryContract: wallet.queryContract,
    clients, 
    isLoaded 
  }), [wallet.publicKey, wallet.connectWallet, wallet.callContract, wallet.queryContract, clients, isLoaded]);

  // 2. Handle conditional UI only in the JSX return
  return (
    <StellarContext.Provider value={contextValue}>
      {wallet.isInitializing ? (
        // Wrap spinner in a container to maintain layout if needed
        <div className="flex h-screen w-full items-center justify-center">
          <Spinner />
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