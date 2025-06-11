import React, { useContext, useState } from 'react';
import { WalletContext } from '../context/WalletContext';
import { parseEther, isAddress, formatEther } from 'ethers';

interface SendTransactionProps {
  onSuccess?: (receipt: any) => void;
}

const SendTransaction: React.FC<SendTransactionProps> = ({ onSuccess }) => {
  const { wallet } = useContext(WalletContext);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any | null>(null);

  const openConfirmModal = async () => {
    if (!wallet) {
      alert('먼저 지갑을 생성하거나 불러오세요.');
      return;
    }
    if (!isAddress(to)) {
      alert('유효한 수신 주소를 입력하세요.');
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('올바른 금액을 입력하세요.');
      return;
    }
    // 예상 가스비 계산
    setEstimating(true);
    try {
      const wConnected = wallet.connect(wallet.provider!);
      const txReq = {
        to,
        value: parseEther(amount),
      };
      const gasEstimate = await wConnected.estimateGas(txReq);
      const feeData = await wConnected.provider!.getFeeData();
      const maxFeePerGas = feeData.maxFeePerGas;
      if (maxFeePerGas == null) throw new Error('Cannot get fee data');
      const fee = gasEstimate * maxFeePerGas;
      setEstimatedFee(formatEther(fee));
    } catch (err) {
      console.error(err);
      setEstimatedFee(null);
    } finally {
      setEstimating(false);
      setModalOpen(true);
    }
  };

  const send = async () => {
    if (!wallet) return;
    setModalOpen(false);
    setStatus('전송 중...');
    try {
      const wConnected = wallet.connect(wallet.provider!);
      const txResponse = await wConnected.sendTransaction({
        to,
        value: parseEther(amount),
      });
      setStatus(`Tx 전송됨. 해시: ${txResponse.hash}. 블록 포함 대기 중...`);
      const rec = await txResponse.wait();
      setReceipt(rec);
      setStatus('Tx가 블록에 포함되었습니다.');
      if (onSuccess) {
        onSuccess(rec);
      }
    } catch (err: any) {
      console.error(err);
      setStatus(`오류 발생: ${err.message || err}`);
    }
  };

  return (
    <div style={{ margin: '1rem 0' }}>
      <h3>송금</h3>
      <input
        type="text"
        placeholder="수신 주소"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <input
        type="text"
        placeholder="금액 (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <button onClick={openConfirmModal} disabled={!wallet || estimating}>
        {estimating ? '예상 가스비 계산 중...' : '송금 확인'}
      </button>

      {modalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="modal-content" style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', maxWidth: '90%', width: '300px' }}>
            <h4>송금 확인</h4>
            <p>To: {to}</p>
            <p>Amount: {amount} ETH</p>
            {estimatedFee !== null ? (
              <p>예상 가스비: 약 {estimatedFee} ETH</p>
            ) : (
              <p>예상 가스비를 계산할 수 없습니다.</p>
            )}
            <button onClick={() => setModalOpen(false)} style={{ marginRight: '0.5rem' }}>취소</button>
            <button onClick={send}>확인</button>
          </div>
        </div>
      )}

      {status && <div style={{ marginTop: '0.5rem' }}><strong>{status}</strong></div>}
      {receipt && (
        <div style={{ marginTop: '0.5rem' }}>
          <h4>트랜잭션 영수증</h4>
          <div>블록 번호: {receipt.blockNumber}</div>
          <div>거래 해시: {receipt.transactionHash}</div>
          <div>가스 사용량: {receipt.gasUsed.toString()}</div>
        </div>
      )}
    </div>
  );
};

export default SendTransaction;
