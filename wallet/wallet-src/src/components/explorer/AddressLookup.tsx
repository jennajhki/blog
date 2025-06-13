import React, { useState, useContext } from 'react';
import { ExplorerContext } from '../../context/ExplorerContext';
import { formatEther, isAddress } from 'ethers';
import styles from './AddressLookup.module.css';

const AddressLookup: React.FC = () => {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error('ExplorerContext not found');
  const { provider } = context;
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setError(null);
    setBalance(null);
    if (!isAddress(address)) {
      setError('유효한 이더리움 주소를 입력하세요.');
      return;
    }
    try {
      const bal = await provider.getBalance(address);
      setBalance(formatEther(bal));
    } catch (e: any) {
      console.error(e);
      setError('잔액 조회 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Address Lookup</h3>
      <input
        type="text"
        placeholder="이더리움 주소 입력"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLookup} className={styles.button}>조회</button>
      {error && <div className={styles.error}>{error}</div>}
      {balance && (
        <div className={styles.result}>
          <div>Address: {address}</div>
          <div>Balance: {balance} ETH</div>
        </div>
      )}
    </div>
  );
};

export default AddressLookup;
