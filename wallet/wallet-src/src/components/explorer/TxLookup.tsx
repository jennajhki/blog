import React, { useState, useContext } from 'react';
import { ExplorerContext } from '../../context/ExplorerContext';
import { TransactionResponse, TransactionReceipt, isHexString, formatEther, formatUnits, Provider } from 'ethers';
import styles from './TxLookup.module.css';

const TxLookup: React.FC = () => {
  const context = useContext(ExplorerContext);
  if (!context) throw new Error('ExplorerContext not found');
  const { provider } = context;
  const [txHash, setTxHash] = useState('');
  const [txInfo, setTxInfo] = useState<TransactionResponse | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setError(null);
    setTxInfo(null);
    setReceipt(null);
    if (!isHexString(txHash) || txHash.length !== 66) {
      setError('유효한 Tx Hash를 입력하세요.');
      return;
    }
    try {
      const tx = await provider.getTransaction(txHash);
      if (!tx) {
        setError('트랜잭션을 찾을 수 없습니다.');
        return;
      }
      setTxInfo(tx);
      const rec = await provider.getTransactionReceipt(txHash);
      setReceipt(rec);
    } catch (e: any) {
      console.error(e);
      setError('트랜잭션 조회 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Transaction Lookup</h3>
      <input
        type="text"
        placeholder="Tx Hash 입력"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLookup} className={styles.button}>조회</button>
      {error && <div className={styles.error}>{error}</div>}
      {txInfo && (
        <div className={styles.result}>
          <div>Hash: {txInfo.hash}</div>
          <div>Status: {receipt?.status ? (Number(receipt.status) === 1 ? '완료' : '실패') : '보류'}</div>
          <div>Block: {txInfo.blockNumber}</div>
          <div>From: {txInfo.from}</div>
          <div>To: {txInfo.to}</div>
          <div>Value: {formatEther(txInfo.value)} ETH</div>
          <div>Gas Price: {txInfo.gasPrice ? formatUnits(txInfo.gasPrice, 'gwei') + ' gwei' : '-'}</div>
          <div>Gas Used: {receipt?.gasUsed.toString()}</div>
          <div>Transaction Fee: {receipt ? formatEther(receipt.gasUsed * BigInt(txInfo.gasPrice || 0))+' ETH' : '-'}</div>
        </div>
      )}
    </div>
  );
};

export default TxLookup;
