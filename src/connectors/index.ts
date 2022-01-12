import { genProvider } from './walletconnectConnector';
import { walletLinkConnector } from './walletlinkConnector';

interface IConnector {
  [key: string]: any;
  METAMASK: any;
  WALLET_CONNECT: any;
  COINBASE: any;
}

export const CONNECTORS: IConnector = {
  METAMASK: window.ethereum,
  WALLET_CONNECT: genProvider,
  COINBASE: walletLinkConnector
};
