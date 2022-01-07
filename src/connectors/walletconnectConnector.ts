import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const walletconnectConnector = new WalletConnectConnector({
  rpc: {
    [process.env.REACT_APP_CHAIN_ID as string]:
      process.env.REACT_APP_TRUST_BRIDGE || '',
  },
});
