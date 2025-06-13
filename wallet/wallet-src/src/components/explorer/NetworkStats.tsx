import React, { useState, useEffect, useContext } from 'react';
import { ExplorerContext } from '../../context/ExplorerContext';
import styles from './NetworkStats.module.css';

const NetworkStats: React.FC = () => {
  const { provider } = useContext(ExplorerContext)!;
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [avgBlockTime, setAvgBlockTime] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const blockNum = await provider.getBlockNumber();
        if (!isMounted) return;
        setLatestBlock(blockNum);

        // 평균 블록 타임 계산: 최신 블록과 이전 N블록의 타임스탬프 차이
        const N = 10;
        const latest = await provider.getBlock(blockNum);
        const prev = await provider.getBlock(blockNum - N);
        if (latest && prev) {
          const avg = (latest.timestamp - prev.timestamp) / N;
          setAvgBlockTime(avg);
        }
        // 가스 가격
        const feeData = await provider.getFeeData();
        if (feeData.maxFeePerGas) {
          const gwei = (Number(feeData.maxFeePerGas) / 1e9).toFixed(2);
          setGasPrice(`${gwei} gwei`);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 15000); // 15초마다 갱신
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [provider]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Network Stats</h3>
      {latestBlock !== null && <div>Latest Block: {latestBlock}</div>}
      {avgBlockTime !== null && <div>Average Block Time: {avgBlockTime.toFixed(2)}s</div>}
      {gasPrice && <div>Gas Price: {gasPrice}</div>}
    </div>
  );
};

export default NetworkStats;
