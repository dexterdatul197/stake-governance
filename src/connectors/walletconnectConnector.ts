import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [parseInt(process.env.REACT_APP_CHAIN_ID as string)],
  infuraId: process.env.REACT_APP_INFURA_ID,
  bridge: 'https://uniswap.bridge.walletconnect.org',
  qrcode: true,
  qrcodeModalOptions: {
    mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
    desktopLinks: ['encrypted ink']
  }
});
