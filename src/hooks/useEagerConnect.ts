import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../connectors/injectedConnector';
import { walletconnect } from '../connectors/walletconnectConnector';
import { useAppDispatch } from '../store/hooks';
import { setEthereumAddress } from '../components/connect-wallet/redux/wallet';

export function useEagerConnect(): boolean {
  const { activate, active, error, account, library } = useWeb3React();

  const dispatch = useAppDispatch();

  const [tried, setTried] = useState<boolean>(false);

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      if (!localStorage.getItem('ethereumAddress')) return;
      if (isAuthorized) {
        const connector = 'walletconnect' in localStorage ? walletconnect : injectedConnector;
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
