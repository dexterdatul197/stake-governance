import { useAppSelector } from './../store/hooks';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CONNECTORS } from '../connectors/index';
import { injectedConnector } from '../connectors/injectedConnector';

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React();

  const { ethereumAddress, walletName } = useAppSelector((state) => ({
    ethereumAddress: state.wallet.ethereumAddress,
    walletName: state.wallet.walletName
  }));

  const [tried, setTried] = useState<boolean>(false);

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized: boolean) => {
      const connector = CONNECTORS[walletName as string];
      console.log('activate connector', !!connector);
      if (connector) {
        activate(connector, undefined, true)
          .then(() => console.log('activated', walletName))
          .catch(() => {
            setTried(true);
          });
      } else {
        setTried(true);
      }
    });
  }, [ethereumAddress, walletName]);

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active && tried) {
      setTried(true);
    }
  }, [active, tried]);

  return tried;
}
