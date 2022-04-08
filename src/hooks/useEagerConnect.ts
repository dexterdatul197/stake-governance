import { useAppSelector } from './../store/hooks';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CONNECTORS } from '../connectors/index';
import { injectedConnector } from '../connectors/injectedConnector';
import { WALLET_NAMES } from 'src/components/connect-wallet/redux/wallet';
import { COINBASE_ADDRESS_KEY } from './useInactiveListener';

export function useEagerConnect(): boolean {
  const { activate, active, account } = useWeb3React();
  const [tried, setTried] = useState<boolean>(false);

  const { ethereumAddress, walletName } = useAppSelector((state) => ({
    ethereumAddress: state.wallet.ethereumAddress,
    walletName: state.wallet.walletName
  }));
  console.log(account, '----------------------');

  useEffect(() => {
    const checkIsValid = () => {
      if (walletName === WALLET_NAMES.WALLET_CONNECT && localStorage.getItem('walletconnect'))
        return true;

      if (walletName === WALLET_NAMES.METAMASK) return true;

      if(walletName === WALLET_NAMES.COINBASE && localStorage.getItem(COINBASE_ADDRESS_KEY)) return true
    };
    injectedConnector.isAuthorized().then((isAuthorized: Boolean) => {
      const isValid = checkIsValid();
      if (isValid) {
        const connector = CONNECTORS[walletName as string];
        activate(connector, undefined, true).catch((e: any) => {
          console.log('e', e);
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [walletName, ethereumAddress]);

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active && tried) {
      setTried(true);
    }
  }, [active, tried]);

  return tried;
}
