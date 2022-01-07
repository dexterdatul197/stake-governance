import { useDispatch } from 'react-redux';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { useEffect } from 'react';
import { injectedConnector } from '../connectors/injectedConnector';
import { openSnackbar, SnackbarVariant, closeSnackbar } from '../store/snackbar';

export function useInactiveListener(suppress = false): void {
  const { active, error, activate } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      console.log('useInactiveListener', error instanceof UnsupportedChainIdError, error);
      if (error instanceof UnsupportedChainIdError) {
        dispatch(
          openSnackbar({
            message: String(error).replace('UnsupportedChainIdError: ', ''),
            variant: SnackbarVariant.ERROR
          })
        );
        setTimeout(() => {
          dispatch(closeSnackbar());
        }, 4000);
      }
      localStorage.removeItem('ethereumAddress');
    }
  }, [error]);
  useEffect(() => {
    const { ethereum } = window as any;

    if (ethereum && ethereum.on && active && !error && !suppress) {
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
          // eat errors
          activate(injectedConnector, undefined, true).catch((err) => {
            console.error('Failed to activate after accounts changed', err);
          });
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('connect', handleConnect);
      ethereum.on('disconnect', (args: any) => console.log('disconnected', args));

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
