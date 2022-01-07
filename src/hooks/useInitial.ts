import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/store/hooks';
import { useEffect } from 'react';
import { setEthereumAddress, walletsConfig } from '../components/connect-wallet/redux/wallet';

export const useInitial = () => {
  const { wallet } = useAppSelector((state: any) => ({
    wallet: state.wallet
  }));
  const dispatch = useDispatch();
  useEffect(() => {
    const infoConnectWallet = localStorage.getItem('walletconnect');
    if (wallet.walletName === walletsConfig[1] && infoConnectWallet) {
      const { chainId, connected, accounts } = JSON.parse(infoConnectWallet);
      if (connected) {
        dispatch(setEthereumAddress(accounts[0]));
        localStorage.setItem('ethereumAddress', accounts[0]);
      } else {
        localStorage.removeItem('walletconnect');
      }
    }
  }, [wallet.walletName]);
  return undefined;
};
