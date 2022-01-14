import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [1, 4, 3, 5, 42],
  infuraId: process.env.REACT_APP_INFURA_ID,
  bridge: 'https://uniswap.bridge.walletconnect.org'
  // bridge: process.env.REACT_APP_TRUST_BRIDGE
});
