import axios from 'axios';

export interface TxListResponse {
  status: string;
  message: string;
  result: any[]; // 실제 타입으로 정의 가능
}

export async function fetchTxListByAddress(address: string, apiKey: string): Promise<TxListResponse> {
  const url = `https://api-sepolia.etherscan.io/api`;
  const params = {
    module: 'account',
    action: 'txlist',
    address,
    startblock: 0,
    endblock: 99999999,
    sort: 'desc',
    apikey: apiKey,
  };
  const resp = await axios.get<TxListResponse>(url, { params });
  return resp.data;
}

export async function fetchContractSourceCode(address: string, apiKey: string): Promise<any> {
  const url = `https://api-sepolia.etherscan.io/api`;
  const params = {
    module: 'contract',
    action: 'getsourcecode',
    address,
    apikey: apiKey,
  };
  const resp = await axios.get(url, { params });
  return resp.data;
}

