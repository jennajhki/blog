import React, { useState, useContext } from 'react';
import { ExplorerContext } from '../../context/ExplorerContext';
import { ethers, Block, TransactionResponse, formatEther, formatUnits } from 'ethers';
import styles from './BlockLookup.module.css';

const BlockLookup: React.FC = () => {
  const { provider } = useContext(ExplorerContext)!;
  const [blockNumber, setBlockNumber] = useState('');
  const [blockInfo, setBlockInfo] = useState<Block | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setError(null);
    setBlockInfo(null);
    setTransactions([]);
    const blockNum = parseInt(blockNumber);
    if (isNaN(blockNum)) {
      setError('유효한 블록 번호를 입력하세요.');
      return;
    }
    try {
      const block = await provider.getBlock(blockNum, true);
      if (!block) {
        setError('블록을 찾을 수 없습니다.');
        return;
      }
      setBlockInfo(block);
      setTransactions(block.transactions as unknown as TransactionResponse[]);
    } catch (e: any) {
      console.error(e);
      setError('블록 조회 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Block Lookup</h3>
      <input
        type="number"
        placeholder="Block Number 입력"
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLookup} className={styles.button}>조회</button>
      {error && <div className={styles.error}>{error}</div>}
      {blockInfo && (
        <div className={styles.result}>
          <div>Block Number: {blockInfo.number}</div>
          <div>Hash: {blockInfo.hash}</div>
          <div>Timestamp: {new Date(Number(blockInfo.timestamp.toString()) * 1000).toLocaleString()}</div>
          <div>Miner: {blockInfo.miner}</div>
          <div>Gas Used: {blockInfo.gasUsed.toString()}</div>
          <div>Gas Limit: {blockInfo.gasLimit.toString()}</div>
          <div>Base Fee: {blockInfo.baseFeePerGas ? formatUnits(blockInfo.baseFeePerGas, 'gwei') + ' gwei' : '-'}</div>
          <div>Transactions: {transactions.length}</div>
          <div className={styles.transactions}>
            <h4>Transaction List</h4>
            {transactions.map((tx) => (
              <div key={tx.hash} className={styles.txItem}>
                <div>Hash: {tx.hash}</div>
                <div>From: {tx.from}</div>
                <div>To: {tx.to}</div>
                <div>Value: {formatEther(tx.value)} ETH</div>
                <div>Gas Price: {tx.gasPrice ? formatUnits(tx.gasPrice, 'gwei') + ' gwei' : '-'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockLookup; 