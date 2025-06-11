import React, { useContext } from 'react';
import { WalletContext } from '../context/WalletContext';
import { Wallet } from 'ethers';
import styles from './GenerateWallet.module.css';

const GenerateWallet: React.FC = () => {
  const { setPrivateKey } = useContext(WalletContext);

  const handleGenerate = () => {
    const newWallet = Wallet.createRandom();
    const msg = `New Wallet Created\nAddress: ${newWallet.address}\nPrivate Key: ${newWallet.privateKey}\n\n이 정보를 안전하게 보관하세요. 이 정보 없이는 복구할 수 없습니다. 계속하시겠습니까?`;
    if (window.confirm(msg)) {
      setPrivateKey(newWallet.privateKey);
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <button onClick={handleGenerate} className={styles.button}>CREATE A NEW WALLET</button>
    </div>
  );
};

export default GenerateWallet;
