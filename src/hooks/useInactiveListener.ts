import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { injectedConnector } from '../connectors/injectedConnector';

export function useInactiveListener(suppress = false): void {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    if (error) {
      console.log('useInactiveListener', error);
      localStorage.removeItem('ethereumAddress');
      window.location.reload();
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
