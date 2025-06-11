import React, { useState } from 'react';
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

  const handleTxSuccess = (receipt: any) => {
    const entry: HistoryEntry = {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
    };
    setHistory((prev: HistoryEntry[]) => [entry, ...prev]);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>간단 이더리움 지갑</h2>
      <GenerateWallet />
      <ImportWallet />
      <BalanceChecker />
      <SendTransaction onSuccess={handleTxSuccess} />
      <TransactionHistory entries={history} />
    </div>
  );
};

export default App;
