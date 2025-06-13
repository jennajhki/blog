import React, { createContext, ReactNode, useMemo } from 'react';
import { InfuraProvider, AlchemyProvider, JsonRpcProvider, Provider } from 'ethers';

interface ExplorerContextType {
  provider: Provider;
  etherscanApiKey: string | undefined;
  etherscanBaseUrl: string;
}

export const ExplorerContext = createContext<ExplorerContextType | null>(null);

export const ExplorerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const provider = useMemo(() => {
    const infuraId = process.env.REACT_APP_INFURA_PROJECT_ID;
    const alchemyKey = process.env.REACT_APP_ALCHEMY_API_KEY;
    if (infuraId) {
      return new InfuraProvider('sepolia', infuraId);
    }
    if (alchemyKey) {
      return new AlchemyProvider('sepolia', alchemyKey);
    }
    // public RPC: 신뢰성 낮으므로 테스트용
    return new JsonRpcProvider('https://rpc.sepolia.org'); // 또는 다른 public endpoint
  }, []);

  const etherscanApiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
  const etherscanBaseUrl = 'https://api-sepolia.etherscan.io/api';

  return (
    <ExplorerContext.Provider value={{ provider, etherscanApiKey, etherscanBaseUrl }}>
      {children}
    </ExplorerContext.Provider>
  );
};
