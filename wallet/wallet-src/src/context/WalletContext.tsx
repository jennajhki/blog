import React, { createContext, useState, ReactNode } from 'react';
import { Wallet, InfuraProvider, getDefaultProvider } from 'ethers';

interface WalletContextType {
  wallet?: Wallet;       // ethers.Wallet (provider에 연결된)
  address?: string;      // 지갑 주소
  setPrivateKey: (key: string) => void;
  clearWallet: () => void;
}

export const WalletContext = createContext<WalletContextType>({
  setPrivateKey: () => {},
  clearWallet: () => {},
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  // provider: 테스트넷 또는 메인넷 설정. 환경변수 사용 권장.
  const provider = (() => {
    const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
    if (projectId) {
      // 메인넷 사용 시 'homestead', 테스트넷 예: 'goerli'
      return new InfuraProvider('goerli', projectId);
    }
    // 키가 없으면 default provider (제한적)
    return getDefaultProvider('goerli');
  })();

  const setPrivateKey = (key: string) => {
    try {
      // ethers.Wallet: private key로 새 Wallet 객체 생성 후 provider에 연결
      const w = new Wallet(key, provider);
      setWallet(w);
      setAddress(w.address);
    } catch (err) {
      console.error('Invalid private key:', err);
      alert('유효하지 않은 프라이빗 키입니다.');
    }
  };

  const clearWallet = () => {
    setWallet(undefined);
    setAddress(undefined);
  };

  return (
    <WalletContext.Provider value={{ wallet, address, setPrivateKey, clearWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
