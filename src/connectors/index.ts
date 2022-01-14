import { walletconnect } from './walletconnectConnector';
import { walletLinkConnector } from './walletlinkConnector';

interface IConnector {
  [key: string]: any;
  METAMASK: any;
  WALLET_CONNECT: any;
  COINBASE: any;
}

export const CONNECTORS: IConnector = {
  METAMASK: window.ethereum,
  WALLET_CONNECT: walletconnect,
  COINBASE: walletLinkConnector
};

export const getConnector = async () => {
  const walletName = localStorage.getItem('walletName');
  if (!walletName) throw Error('No provider');
  return CONNECTORS[walletName];
};
