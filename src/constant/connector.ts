import { injectedConnector } from 'src/connectors/injectedConnector';
import { walletconnect } from 'src/connectors/walletconnectConnector';
import { walletLinkConnector } from 'src/connectors/walletlinkConnector';
import { AbstractConnector } from 'web3-react-abstract-connector';
interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injectedConnector,
    name: 'Injected'
  },
  METAMASK: {
    connector: injectedConnector,
    name: 'MetaMask'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect'
  },
  WALLET_LINK: {
    connector: walletLinkConnector,
    name: 'Coinbase Wallet'
  }
};
