import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/store/hooks';
import { useEffect } from 'react';
import {
  setEthereumAddress,
  setWalletName,
  WALLET_NAMES
} from '../components/connect-wallet/redux/wallet';
import { removeManyItemsInLS } from 'src/helpers/common';

const KEY_ADDRESS_COINBASE = '-walletlink:https://www.walletlink.org:Addresses';

export const useInitial = () => {
  const { wallet } = useAppSelector((state: any) => ({
    wallet: state.wallet
  }));
  const dispatch = useDispatch();
  const infoConnectWallet = localStorage.getItem('walletconnect');
  const addressCoinbaseWallet = localStorage.getItem(KEY_ADDRESS_COINBASE);

  const checkConnectionWalletLinkCoinbase = () => {
    const timer = setInterval(() => {
      if (!addressCoinbaseWallet) {
        clearInterval(timer);
        removeManyItemsInLS('walletlink'); // coinbase
        dispatch(setEthereumAddress(''));
        dispatch(setWalletName(''));
      }
    }, 3000);
  };

  useEffect(() => {
    // wallet-connect
    if (wallet.walletName === WALLET_NAMES.WALLET_CONNECT && infoConnectWallet) {
      const { connected, accounts } = JSON.parse(infoConnectWallet);
      if (connected) {
        dispatch(setEthereumAddress(accounts[0]));
      }
    }

    // wallet-link coinbase
    if (wallet.walletName === WALLET_NAMES.COINBASE && addressCoinbaseWallet) {
      checkConnectionWalletLinkCoinbase();
      dispatch(setEthereumAddress(addressCoinbaseWallet as string));
    }
  }, [wallet.walletName && infoConnectWallet && addressCoinbaseWallet]);

  return undefined;
};
