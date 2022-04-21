import { useWeb3React } from '@web3-react/core';
import classnames from 'classnames/bind';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { walletconnect } from 'src/connectors/walletconnectConnector';
import { removeManyItemsInLS } from 'src/helpers/common';
import Web3 from 'web3';
import { ReactComponent as ConectWalletIcon } from '../../assets/icon/wallet.svg';
import useOnClickOutside from '../../helpers/useClickOutside';
import useIsMobile from '../../hooks/useMobile';
import { useAppSelector } from '../../store/hooks';
import styles from './ConnectWallet.module.scss';
import { setEthereumAddress, setOpenConnectDialog, setWalletName } from './redux/wallet';

const cx = classnames.bind(styles);

const ConnectWallet: React.FC = () => {
  const isMobile = useIsMobile(844);
  const { deactivate, account } = useWeb3React<Web3>();
  const history = useHistory();
  const dispatch = useDispatch();
  const handleOpenConnectWalletDialog = () => {
    dispatch(setOpenConnectDialog(true));
  };
  const walletConnect = localStorage.getItem('walletconnect');
  const wallet = useAppSelector((state) => state.wallet);
  const ref = useRef<any>();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [address, setAddress] = useState('');
  const handleOpenDropdown = () => {
    setOpenDropdown(true);
  };
  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };
  useOnClickOutside(ref, handleCloseDropdown);

  // const handleUpdateAddress = useCallback(() => {
  //   const address = wallet.ethereumAddress.slice(0, 4) + '...' + wallet.ethereumAddress.slice(-4);
  //   setAddress(address);
  // }, [address, wallet]);

  useEffect(() => {
    handleCloseDropdown();
    // handleUpdateAddress();
  }, []);

  const handleLogout = async () => {
    deactivate();
    removeManyItemsInLS('walletconnect');
    removeManyItemsInLS('walletlink'); 
    removeManyItemsInLS('ethereumAddress'); // coinbase
    dispatch(setEthereumAddress(''));
    dispatch(setWalletName(''));
    if ((window as any)?.localStorage?.getItem('walletconnect')) {
      walletconnect.close();
      walletconnect.walletConnectProvider = null;
    }
    removeManyItemsInLS('-walletlink:https://www.walletlink.org:Addresses');
    history.push('/');
    setOpenDropdown(false);
  };

  return (
    <>
      {wallet.ethereumAddress ? (
        <>
          <div
            className={cx(
              'button-logout',
              'center-items',
              `${
                wallet.ethereumAddress.slice(0, 4) + '...' + wallet.ethereumAddress.slice(-4)
                  ? 'btn-address-style'
                  : ''
              }`
            )}
            onClick={handleOpenDropdown}>
            <span className={cx('button__text')}>
              {wallet.ethereumAddress.slice(0, 4) +
                '...' +
                wallet.ethereumAddress.slice(-4).toLowerCase()}
            </span>
          </div>
          <div
            onClick={handleLogout}
            className={cx(
              'btn-logout',
              `${openDropdown ? 'show-btn' : ''}`,
              `${
                wallet.ethereumAddress.slice(0, 4) + '...' + wallet.ethereumAddress.slice(-4)
                  ? 'btn-address-style'
                  : ''
              }`
            )}
            ref={ref}>
            <span className={cx('button__text')}>Logout</span>
          </div>
        </>
      ) : (
        <div className={cx('button')} onClick={handleOpenConnectWalletDialog}>
          <ConectWalletIcon stroke="var(--text-color-stake)" />{' '}
          <span className={cx('button__text')}>Connect wallet</span>
        </div>
      )}
    </>
  );
};
export default ConnectWallet;
