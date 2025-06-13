import React, { useState } from 'react';
import TxLookup from '../components/explorer/TxLookup';
import BlockLookup from '../components/explorer/BlockLookup';
import AddressLookup from '../components/explorer/AddressLookup';
import ContractLookup from '../components/explorer/ContractLookup';
import NetworkStats from '../components/explorer/NetworkStats';

const Explorer: React.FC = () => {
  const [view, setView] = useState<'tx'|'block'|'address'|'contract'|'stats'>('tx');

  return (
    <div className="explorer-container">
      <nav className="explorer-nav">
        <button onClick={() => setView('tx')}>Transaction</button>
        <button onClick={() => setView('block')}>Block</button>
        <button onClick={() => setView('address')}>Address</button>
        <button onClick={() => setView('contract')}>Contract</button>
        <button onClick={() => setView('stats')}>Network Stats</button>
      </nav>
      <div className="explorer-content">
        {view === 'tx' && <TxLookup />}
        {view === 'block' && <BlockLookup />}
        {view === 'address' && <AddressLookup />}
        {view === 'contract' && <ContractLookup />}
        {view === 'stats' && <NetworkStats />}
      </div>
    </div>
  );
};

export default Explorer;
