import { WalletLinkConnector } from '@web3-react/walletlink-connector';

export const walletLinkConnector = new WalletLinkConnector({
  url: process.env.REACT_APP_WALLET_LINK_URL as string,
  appName: 'strike',
  supportedChainIds: [Number(process.env.REACT_APP_CHAIN_ID)]
});
