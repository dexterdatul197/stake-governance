import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: [1, 4, 3, 5, 42],
  infuraId: '6f446ee5f1b5485b8a2d3fa2708957c1',
  bridge: process.env.REACT_APP_TRUST_BRIDGE
});
