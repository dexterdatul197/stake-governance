import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setEthereumAddress, setWalletName } from 'src/components/connect-wallet/redux/wallet';
import { removeManyItemsInLS } from 'src/helpers/common';
import { closeSnackbar, openSnackbar, SnackbarVariant } from '../store/snackbar';
import { useAppSelector } from './../store/hooks';

export const COINBASE_ADDRESS_KEY = '-walletlink:https://www.walletlink.org:Addresses';

export interface EthereumProvider {
  on?: (...args: any[]) => void;
  removeListener?: (...args: any[]) => void;
  autoRefreshOnNetworkChange?: boolean;
}

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
      dispatch(setEthereumAddress(''));
    }
  }, [error]);

  const handleDisconnect = () => {
    dispatch(setEthereumAddress(''));
    dispatch(setWalletName(''));
    removeManyItemsInLS('walletconnect');
    removeManyItemsInLS('walletlink'); // coinbase
  };

  useEffect(() => {
    const ethereum = (window as any).ethereum as EthereumProvider;
    if (ethereum && ethereum.on && !active && walletName && address && connector) {
      // connector.getProvider().then((provider: any) => {
      const handleChainChanged = (chainId: string) => {
        //eat errors
        activate(connector, undefined, true).catch((err: any) => {
          console.error('Failed to activate after chain changed', err);
        });
      };
      const handleAccountChanged = (account: string[]) => {
        console.log(account[0]);
        if (account.length > 0) {
          activate(connector, undefined, true)
            .then(() => {
              dispatch(setEthereumAddress(account[0]));
            })
            .catch((err) => {
              console.error('Failed to activate after accounts changed', err);
            });
        } else {
          dispatch(setEthereumAddress(''));
          dispatch(setWalletName(''));
        }
      };

      ethereum?.on('chainChanged', handleChainChanged);
      ethereum?.on('accountsChanged', handleAccountChanged);
      ethereum?.on('disconnect', handleDisconnect);

      return () => {
        if (ethereum?.removeListener) {
          ethereum?.removeListener('chainChanged', handleChainChanged);
          ethereum?.removeListener('accountsChanged', handleAccountChanged);
          ethereum?.removeListener('disconnect', handleDisconnect);
        }
      };
      // });
    }
    if (walletName === 'WALLET_CONNECT' && !localStorage.getItem('walletconnect')) {
      handleDisconnect();
    }
    if (walletName === 'COINBASE' && !localStorage.getItem(COINBASE_ADDRESS_KEY)) {
      handleDisconnect();
    }
  }, [active, error, suppress, activate, address, walletName]);
}
