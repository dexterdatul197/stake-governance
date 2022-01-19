import classnames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import AddContainedSVG from '../../assets/icon/AddContainedSVG';
import ArrowDown from '../../assets/icon/ArrowDown';
import BscSVG from '../../assets/icon/BscSVG';
import { isConnected } from '../../helpers/connectWallet';
import useOnClickOutside from '../../helpers/useClickOutside';
import { useAppSelector } from '../../store/hooks';
import styles from './ConnectWallet.module.scss';
import { setOpenConnectDialog, setEthereumAddress, setWalletName } from './redux/wallet';
import { ReactComponent as ConectWalletIcon } from '../../assets/icon/wallet.svg';
import useIsMobile from '../../hooks/useMobile';
import { removeManyItemsInLS } from 'src/helpers/common';

const cx = classnames.bind(styles);

const ConnectWallet: React.FC = () => {
  const isMobile = useIsMobile(576);
  const { deactivate } = useWeb3React<Web3>();
  const history = useHistory();
  const dispatch = useDispatch();
  const handleOpenConnectWalletDialog = () => {
    dispatch(setOpenConnectDialog(true));
  };
  const wallet = useAppSelector((state) => state.wallet);
  const ref = useRef<any>();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [address, setAddress] = useState('');
  const handleOpenDropdown = () => {
    setOpenDropdown(true);
  };
  const handleCloseDropdown = () => {
    console.log('HANDLE CLICK OUTSITE');
    
    setOpenDropdown(false);
  };
  useOnClickOutside(ref, handleCloseDropdown);

  useEffect(() => {
    handleCloseDropdown();
    const address = wallet.ethereumAddress.slice(0, 4) + '...' + wallet.ethereumAddress.slice(-4);
    setAddress(address);
  }, [wallet]);

  const handleLogout = async () => {
    await deactivate();
    removeManyItemsInLS('walletconnect');
    removeManyItemsInLS('walletlink'); // coinbase
    dispatch(setEthereumAddress(''));
    dispatch(setWalletName(''));
    history.push('/');
    setOpenDropdown(false);
    window.location.reload();
  };

  return (
    <>
      {wallet.ethereumAddress ? (
        <>
          <div className={cx('button-logout', 'center-items')} onClick={handleOpenDropdown}>
            <span className={cx('button__text')}>{address.toLowerCase()}</span>
          </div>
          <div onClick={handleLogout} className={cx('btn-logout', `${openDropdown ? 'show-btn' : ''}`)} ref={ref}>
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
