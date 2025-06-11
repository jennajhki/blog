import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import GenerateWallet from './components/GenereateWallet';
import ImportWallet from './components/ImportWallet';
import BalanceChecker from './components/BalanceChecker';
import SendTransaction from './components/SendTransaction';
import TransactionHistory from './components/TransactionHistory';

interface HistoryEntry {
  hash: string;
  blockNumber: number;
  gasUsed: bigint;
}

const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    document.title = 'wallet';
  }, []);

  const handleTxSuccess = (receipt: any) => {
    const entry: HistoryEntry = {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
    };
    setHistory((prev: HistoryEntry[]) => [entry, ...prev]);
  };

  return (
    <div className={styles.container}>

<header className={styles.navbar}>
        <div className={styles.logo}>jenna.dev</div>
        <nav className={styles['nav-links']}>
        <a href="https://jennajhki.github.io/blog/">home</a>
        </nav>
      </header>
      <h2 className={styles.header}>Ethereum Wallet</h2>
      <GenerateWallet />
      <ImportWallet />
      <BalanceChecker />
      <SendTransaction onSuccess={handleTxSuccess} />
      <TransactionHistory entries={history} />
    </div>
  );
};

export default App;
