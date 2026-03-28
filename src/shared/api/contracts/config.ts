export const CONTRACTS = {
  TOKEN: import.meta.env.VITE_TOKEN_ADDRESS,
  IDENTITY: import.meta.env.VITE_IDENTITY_ADDRESS,
  SUPPLY: import.meta.env.VITE_SUPPLY_ADDRESS,
  DISBURSEMENT: import.meta.env.VITE_DISBURSEMENT_ADDRESS,
};

// Add validation
if (!CONTRACTS.TOKEN) {
  console.warn('Missing contract addresses in environment variables');
}

export const NETWORK = {
  RPC_URL: "https://soroban-testnet.stellar.org",
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
};