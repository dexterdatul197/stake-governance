import WalletConnectProvider from '@walletconnect/web3-provider';

export const genProvider = () => {
  return new WalletConnectProvider({
    rpc: {
      4: 'https://rinkeby.infura.io/v3/6f446ee5f1b5485b8a2d3fa2708957c1'
    },
    infuraId: '6f446ee5f1b5485b8a2d3fa2708957c1',
    pollingInterval: 3000
  });
};
