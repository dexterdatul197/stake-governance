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
import { setOpenConnectDialog, setEthereumAddress } from './redux/wallet';
import { ReactComponent as ConectWalletIcon } from '../../assets/icon/wallet.svg';
import useIsMobile from '../../hooks/useMobile';

const cx = classnames.bind(styles);

const ConnectWallet: React.FC = () => {
  const isMobile = useIsMobile(576);
  const { account } = useWeb3React<Web3>();
  const history = useHistory();
  const dispatch = useDispatch();
  const handleOpenConnectWalletDialog = () => {
    dispatch(setOpenConnectDialog(true));
  };
  const wallet = useAppSelector((state) => state.wallet);
  const ref = useRef<any>();
  const [openDropdown, setOpenDropdown] = useState(false);
  const getShortAddress = (address: string) => {
    return address.slice(0, 2) + '...' + address.slice(-4);
  };
  const handleOpenDropdown = () => {
    setOpenDropdown(true);
  };
  const handleCloseDropdown = () => {
    setOpenDropdown(false);
  };
  useOnClickOutside(ref, handleCloseDropdown);
  useEffect(() => {
    handleCloseDropdown();
  }, [wallet]);

  const handleLogout = () => {
    localStorage.removeItem('ethereumAddress');
    dispatch(setEthereumAddress(''));
    history.push('/');
  };

  return (
    <>
      {wallet.ethereumAddress ? (
        <div className={cx('button', 'center-items')} onClick={handleLogout}>
          <ConectWalletIcon stroke="var(--text-color-stake)" />{' '}
          <span className={cx('button__text')}>Logout</span>
        </div>
      ) : (
        <div className={cx('button', 'center-items')} onClick={handleOpenConnectWalletDialog}>
          <ConectWalletIcon stroke="var(--text-color-stake)" />{' '}
          <span className={cx('button__text')}>Connect wallet</span>
        </div>
      )}
    </>
  );
};
export default ConnectWallet;
