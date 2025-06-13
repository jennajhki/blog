import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import GenerateWallet from './components/GenereateWallet';
import ImportWallet from './components/ImportWallet';
import BalanceChecker from './components/BalanceChecker';
import SendTransaction from './components/SendTransaction';
import TransactionHistory from './components/TransactionHistory';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Explorer from './pages/Explorer';



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
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className={styles.container}>
        <header className={styles.navbar}>
          <div className={styles.logo}>jenna.dev</div>
          <nav className={styles['nav-links']}>
            <Link to="/">Wallet</Link>
            <Link to="/explorer">Explorer</Link>
            <a href="https://jennajhki.github.io/blog/">Blog</a>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={
            <>
              <h2 className={styles.header}>Ethereum Wallet</h2>
              <GenerateWallet />
              <ImportWallet />
              <BalanceChecker />
              <SendTransaction onSuccess={handleTxSuccess} />
              <TransactionHistory entries={history} />
            </>
          } />
          <Route path="/explorer" element={<Explorer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
