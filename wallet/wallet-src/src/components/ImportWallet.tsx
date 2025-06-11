import React, { useState, useContext } from 'react';
import styles from './ImportWallet.module.css';
import { WalletContext } from '../context/WalletContext';

const ImportWallet: React.FC = () => {
  const { setPrivateKey } = useContext(WalletContext);
  const [input, setInput] = useState('');

  const handleImport = () => {
    if (!input.trim()) {
      alert('프라이빗 키를 입력하세요.');
      return;
    }
    if (window.confirm('입력하신 프라이빗 키로 지갑을 불러오시겠습니까?')) {
      setPrivateKey(input.trim());
      setInput('');
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Private Key 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleImport} className={styles.button}>
        지갑 불러오기
      </button>
    </div>
  );
};

export default ImportWallet;
