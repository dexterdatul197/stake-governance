import { useAppSelector } from './../store/hooks';
import { useDispatch } from 'react-redux';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { useEffect } from 'react';
import { openSnackbar, SnackbarVariant, closeSnackbar } from '../store/snackbar';
import { setEthereumAddress, setWalletName } from 'src/components/connect-wallet/redux/wallet';
import { removeManyItemsInLS } from 'src/helpers/common';

export const COINBASE_ADDRESS_KEY = '-walletlink:https://www.walletlink.org:Addresses';

export function useInactiveListener(suppress = false): void {
  const { active, error, activate, library, account, connector } = useWeb3React();
  const { address, walletName } = useAppSelector((state) => ({
    address: state.wallet.ethereumAddress,
    walletName: state.wallet.walletName
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      if (error instanceof UnsupportedChainIdError) {
        dispatch(
          openSnackbar({
            message: 'Please select the correct network',
            variant: SnackbarVariant.ERROR
          })
        );
        setTimeout(() => {
          dispatch(closeSnackbar());
        }, 5000);
      }
      localStorage.removeItem('ethereumAddress');
    }
  }, [error]);

  const handleDisconnect = () => {
    console.log('disconnected');
    dispatch(setEthereumAddress(''));
    dispatch(setWalletName(''));
    removeManyItemsInLS('walletconnect');
    removeManyItemsInLS('walletlink'); // coinbase
  };

  useEffect(() => {
    if (active && walletName && address && connector) {
      connector.getProvider().then((provider: any) => {
        const handleChainChanged = (chainId: string) => {
          console.log('listener chainId', chainId);
          // eat errors
          activate(connector, undefined, true).catch((err) => {
            console.error('Failed to activate after chain changed', err);
          });
        };

        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length > 0) {
            // eat errors
            activate(connector, undefined, true).catch((err) => {
              console.error('Failed to activate after accounts changed', err);
            });
          } else {
            dispatch(setEthereumAddress(''));
            dispatch(setWalletName(''));
          }
        };

        provider.on('chainChanged', handleChainChanged);
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('disconnect', handleDisconnect);

        return () => {
          if (provider?.removeListener) {
            provider.removeListener('chainChanged', handleChainChanged);
            provider.removeListener('accountsChanged', handleAccountsChanged);
            provider.removeListener('disconnect', handleDisconnect);
          }
        };
      });
    }
    if (walletName === 'COINBASE' && !localStorage.getItem(COINBASE_ADDRESS_KEY)) {
      handleDisconnect();
    }
    if (walletName === 'WALLET_CONNECT' && !localStorage.getItem('walletconnect')) {
      handleDisconnect();
    }
  }, [active, error, suppress, activate, address, walletName]);
}
