import React from 'react';

interface HistoryEntry {
  hash: string;
  blockNumber: number;
  gasUsed: bigint;
}

interface Props {
  entries: HistoryEntry[];
}

const TransactionHistory: React.FC<Props> = ({ entries }) => {
  if (entries.length === 0) return <div>전송 내역이 없습니다.</div>;
  return (
    <div style={{ margin: '1rem 0' }}>
      <h3>세션 내 전송 내역</h3>
      <ul>
        {entries.map((e, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>
            <div>해시: {e.hash}</div>
            <div>블록: {e.blockNumber}</div>
            <div>가스 사용: {e.gasUsed.toString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
