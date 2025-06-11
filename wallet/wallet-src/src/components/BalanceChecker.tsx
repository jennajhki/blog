import React, { useContext, useState } from 'react';
import { InfuraProvider, AlchemyProvider, JsonRpcProvider, formatEther } from 'ethers';
import { WalletContext } from '../context/WalletContext';
import styles from './BalanceChecker.module.css';

const BalanceChecker: React.FC = () => {
  const { address } = useContext(WalletContext);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const provider = (() => {
    const infuraId = process.env.REACT_APP_INFURA_PROJECT_ID;
    const alchemyKey = process.env.REACT_APP_ALCHEMY_API_KEY;
    if (infuraId) {
      console.log('Using InfuraProvider with ID:', infuraId);
      return new InfuraProvider('goerli', infuraId);
    }
    if (alchemyKey) {
      console.log('Using AlchemyProvider with Key:', alchemyKey);
      return new AlchemyProvider('goerli', alchemyKey);
    }
    console.log('No Infura/Alchemy key found, using public JsonRpcProvider');
    return new JsonRpcProvider('https://rpc.ankr.com/eth_goerli');
  })();

  const fetchBalance = async () => {
    console.log('Using provider:', provider);
    console.log('Fetching balance for address:', address);
    if (!address) {
      alert('먼저 지갑을 생성하거나 불러오세요.');
      return;
    }
    setLoading(true);
    try {
      const bal = await provider.getBalance(address);
      setBalance(formatEther(bal));
    } catch (err) {
      console.error('Balance fetch error:', err);
      alert('잔액 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Address</div>
      <div className={styles.addressBox}>{address ?? '-'}</div>
      <button onClick={fetchBalance} disabled={loading || !address} className={styles.button}>
        {loading ? '조회 중...' : '잔액 조회'}
      </button>
      {balance !== null && (
        <div className={styles.balance}>잔액: {balance} ETH</div>
      )}
    </div>
  );
};

export default BalanceChecker;
