import { injectedConnector } from 'src/connectors/injectedConnector';
import { walletconnect } from 'src/connectors/walletconnectConnector';
import { walletLinkConnector } from 'src/connectors/walletlinkConnector';
import { AbstractConnector } from 'web3-react-abstract-connector';
interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  mobile?: boolean;
  mobileOnly?: boolean;
  href: string | null;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injectedConnector,
    name: 'METAMASK',
    href: null,
    mobile: true,
  },
  TRUST: {
    connector: injectedConnector,
    name: 'TRUST',
    mobile: true,
    href: null
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WALLET_CONNECT',
    mobile: true,
    href: null
  },
  WALLET_LINK: {
    connector: walletLinkConnector,
    name: 'COINBASE',
    mobile: true,
    mobileOnly: true,
    href: 'https://go.cb-w.com/mtUDhEZPy1'
  }
};
