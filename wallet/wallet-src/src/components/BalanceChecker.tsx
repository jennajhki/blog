import React, { useContext, useState } from 'react';
import { InfuraProvider, getDefaultProvider, formatEther } from 'ethers';
import { WalletContext } from '../context/WalletContext';

const BalanceChecker: React.FC = () => {
  const { address } = useContext(WalletContext);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Context의 provider가 아닌 별도 provider를 쓰려면 Context에서 꺼내올 수도 있음.
  const provider = (() => {
    const projectId = process.env.REACT_APP_INFURA_PROJECT_ID;
    if (projectId) {
      return new InfuraProvider('goerli', projectId);
    }
    return getDefaultProvider('goerli');
  })();

  const fetchBalance = async () => {
    if (!address) {
      alert('먼저 지갑을 생성하거나 불러오세요.');
      return;
    }
    setLoading(true);
    try {
      const bal = await provider.getBalance(address);
      setBalance(formatEther(bal));
    } catch (err) {
      console.error(err);
      alert('잔액 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <div>Address: {address ?? '-'}</div>
      <button onClick={fetchBalance} disabled={loading || !address} style={{ marginTop: '0.5rem' }}>
        {loading ? '조회 중...' : '잔액 조회'}
      </button>
      {balance !== null && (
        <div style={{ marginTop: '0.5rem' }}>잔액: {balance} ETH</div>
      )}
    </div>
  );
};

export default BalanceChecker;
