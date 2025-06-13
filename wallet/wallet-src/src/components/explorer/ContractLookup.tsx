import React, { useState, useContext } from 'react';
import { ExplorerContext } from '../../context/ExplorerContext';
import axios from 'axios';
import styles from './ContractLookup.module.css';

interface SourceCodeResponse {
  status: string;
  message: string;
  result: Array<{
    SourceCode: string;
    ABI: string;
    ContractName: string;
    CompilerVersion: string;
    // etc
  }>;
}

const ContractLookup: React.FC = () => {
  const { provider, etherscanApiKey, etherscanBaseUrl } = useContext(ExplorerContext)!;
  const [address, setAddress] = useState('');
  const [bytecode, setBytecode] = useState<string | null>(null);
  const [sourceCode, setSourceCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setError(null);
    setBytecode(null);
    setSourceCode(null);
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setError('유효한 컨트랙트 주소를 입력하세요.');
      return;
    }
    try {
      // 바이트코드 조회
      const code = await provider.getCode(address);
      setBytecode(code === '0x' ? null : code);

      // 소스코드 조회 via Etherscan API
      if (etherscanApiKey) {
        const params = {
          module: 'contract',
          action: 'getsourcecode',
          address,
          apikey: etherscanApiKey,
        };
        const resp = await axios.get<SourceCodeResponse>(etherscanBaseUrl, { params });
        if (resp.data.status === '1' && resp.data.result.length > 0) {
          setSourceCode(resp.data.result[0].SourceCode);
        } else {
          setSourceCode(null);
        }
      } else {
        console.warn('Etherscan API 키가 없어 소스코드 조회 불가');
      }
    } catch (e: any) {
      console.error(e);
      setError('컨트랙트 조회 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Contract Lookup</h3>
      <input
        type="text"
        placeholder="컨트랙트 주소 입력"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleLookup} className={styles.button}>조회</button>
      {error && <div className={styles.error}>{error}</div>}
      {bytecode !== null && <div className={styles.bytecode}>Bytecode: <pre className={styles.pre}>{bytecode}</pre></div>}
      {sourceCode !== null && <div className={styles.source}><h4>Source Code</h4><pre className={styles.pre}>{sourceCode}</pre></div>}
    </div>
  );
};

export default ContractLookup;
