import { injectedConnector } from './../connectors/injectedConnector';
import { useDispatch } from 'react-redux';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { useEffect } from 'react';
import { openSnackbar, SnackbarVariant, closeSnackbar } from '../store/snackbar';
import { setEthereumAddress, setWalletName } from 'src/components/connect-wallet/redux/wallet';

export function useInactiveListener(suppress = false): void {
  const { active, error, activate, library, account, connector } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      console.log('useInactiveListener', error instanceof UnsupportedChainIdError, error);
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

  // useEffect(() => {
  //   if (library && library.provider && active && !error && !suppress && connector) {
  //     const handleChainChanged = (chainId: string) => {
  //       // eat errors
  //       activate(connector, undefined, true).catch((err) => {
  //         console.error('Failed to activate after chain changed', err);
  //       });
  //     };

  //     const handleAccountsChanged = (accounts: string[]) => {
  //       if (accounts.length > 0) {
  //         // eat errors
  //         activate(connector, undefined, true).catch((err) => {
  //           console.error('Failed to activate after accounts changed', err);
  //         });
  //       } else {
  //         dispatch(setEthereumAddress(''));
  //         dispatch(setWalletName(''));
  //       }
  //     };

  //     library.provider.on('chainChanged', handleChainChanged);
  //     library.provider.on('accountsChanged', handleAccountsChanged);

  //     return () => {
  //       if (library.provider?.removeListener) {
  //         library.provider.removeListener('chainChanged', handleChainChanged);
  //         library.provider.removeListener('accountsChanged', handleAccountsChanged);
  //       }
  //     };
  //   }
  // }, [active, error, suppress, activate]);

  // Metamask
  useEffect(() => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && active && !error) {
      const handleConnect = (e: any) => {
        activate(injectedConnector);
      };

      const handleChainChanged = (chainId: string) => {
        // eat errors
        activate(injectedConnector, undefined, true).catch((err) => {
          console.error('Failed to activate after chain changed', err);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          activate(injectedConnector, undefined, true).catch((err) => {
            console.error('Failed to activate after accounts changed', err);
          });
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('connect', handleConnect);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
