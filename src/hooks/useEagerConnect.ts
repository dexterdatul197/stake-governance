import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CONNECTORS } from '../connectors/index';
import { injectedConnector } from '../connectors/injectedConnector';

export function useEagerConnect(): boolean {
  const { activate, active, error, account, library } = useWeb3React();

  const [tried, setTried] = useState<boolean>(false);

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (!localStorage.getItem('ethereumAddress')) return;
      if (isAuthorized) {
        const walletName = localStorage.getItem('walletName');
        const connector = CONNECTORS[walletName as string];
        if (!connector) return;
        activate(connector, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, []);

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}
