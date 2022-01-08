import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/store/hooks';
import { useEffect } from 'react';
import {
  setEthereumAddress,
  setWalletName,
  walletsConfig
} from '../components/connect-wallet/redux/wallet';

const KEY_ADDRESS_COINBASE = '-walletlink:https://www.walletlink.org:Addresses';

export const useInitial = () => {
  const { wallet } = useAppSelector((state: any) => ({
    wallet: state.wallet
  }));
  const dispatch = useDispatch();

  const checkConnectionWalletLinkCoinbase = () => {
    const timer = setInterval(() => {
      const addressCoinbaseWallet = localStorage.getItem(KEY_ADDRESS_COINBASE);
      if (!addressCoinbaseWallet) {
        clearInterval(timer);
        localStorage.clear();
        dispatch(setEthereumAddress(''));
        dispatch(setWalletName(''));
      }
    }, 3000);
  };

  useEffect(() => {
    const infoConnectWallet = localStorage.getItem('walletconnect');
    const addressCoinbaseWallet = localStorage.getItem(KEY_ADDRESS_COINBASE);

    // wallet-connect
    if (wallet.walletName === walletsConfig[1] && infoConnectWallet) {
      const { chainId, connected, accounts } = JSON.parse(infoConnectWallet);
      if (connected) {
        dispatch(setEthereumAddress(accounts[0]));
      } else {
        localStorage.removeItem('walletconnect');
      }
    }

    // wallet-link coinbase
    if (wallet.walletName === walletsConfig[3] && addressCoinbaseWallet) {
      checkConnectionWalletLinkCoinbase();
      dispatch(setEthereumAddress(addressCoinbaseWallet as string));
    }
  }, [wallet.walletName]);
  return undefined;
};
