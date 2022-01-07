import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const walletconnectConnector = new WalletConnectConnector({
  rpc: {
    [process.env.REACT_APP_CHAIN_ID as string]: process.env.REACT_APP_TRUST_BRIDGE || ''
  },
  qrcode: true
});

//  Create WalletConnect Provider
export const provider = new WalletConnectProvider({
  rpc: {
    1: 'https://mainnet.mycustomnode.com',
    3: 'https://ropsten.mycustomnode.com',
    100: 'https://dai.poa.network'
  }
});

export const web3WalletConnect = new Web3(provider as any);
