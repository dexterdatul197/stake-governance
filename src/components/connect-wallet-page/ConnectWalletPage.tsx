import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, IconButton, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import classnames from 'classnames/bind';
import React, { useState, useCallback } from 'react';
import { MISSING_EXTENSION_ERROR } from '../../constant/uninstallExtentionException';
import { openSnackbar, SnackbarVariant } from '../../store/snackbar';
import {
  setEthereumAddress,
  setOpenConnectDialog,
  setWalletName,
  setProvider,
  WALLET_NAMES
} from '../connect-wallet/redux/wallet';
import { useAppDispatch, useAppSelector } from './../../store/hooks';
import styles from './ConnectWalletPage.module.scss';
import metamask from '../../assets/icon/meta_mask.svg';
import trust from '../../assets/icon/trust.svg';
import coinbase from '../../assets/icon/coinbase.svg';
import wallet_connect from '../../assets/icon/wallet_connect.svg';

import { injectedConnector } from '../../connectors/injectedConnector';
import { switchNetwork } from '../../connectors/switchNetwork';
import { walletLinkConnector } from '../../connectors/walletlinkConnector';
import { genProvider } from '../../connectors/walletconnectConnector';
import { CONNECTORS } from '../../connectors';
import bannerImg from '../../assets/imgs/bg-connect.png';
const cx = classnames.bind(styles);

const ConnectWalletPage: React.FC = () => {
  const { connector, library, chainId, account, activate, deactivate, active, error } =
    useWeb3React<Web3>();
  const dispatch = useAppDispatch();

  const handleCloseConnectDialog = () => {
    dispatch(setOpenConnectDialog(false));
  };

  const windowObj = window as any;

  // Connect MetaMask
  const handleConnectMetaMask = async () => {
    if (isMobile && !windowObj?.ethereum?.isMetaMask) {
      window.location.assign(process.env.REACT_APP_DEEP_LINK_METAMASK || '#');
      return;
    }
    if (!windowObj?.ethereum?.isMetaMask) {
      dispatch(
        openSnackbar({
          message: 'Please install Metamask',
          variant: SnackbarVariant.ERROR
        })
      );
      return;
    }
    try {
      activate(injectedConnector).then(() => {
        dispatch(setWalletName(WALLET_NAMES.METAMASK));
        dispatch(setProvider(CONNECTORS.METAMASK));
      });
      switchNetwork(process.env.REACT_APP_CHAIN_ID || '');
    } catch (e: any) {
      if (e.message === MISSING_EXTENSION_ERROR) {
        dispatch(
          openSnackbar({
            message: 'Extension not install!',
            variant: SnackbarVariant.ERROR
          })
        );
      }
    }
    handleCloseConnectDialog();
  };

  // Connect Wallet connect
  const handleConnectWalletConnect = async () => {
    try {
      const provider = genProvider();
      const addresses = (await provider.enable()) || [];
      provider.on('connect', (e: any) => console.log('connect', e));
      provider.on('disconnect', (code: number, error: string) => {
        console.log('disconnect', code, error);
        dispatch(setWalletName(''));
        dispatch(setEthereumAddress(''));
        dispatch(setProvider(undefined));
      });
      provider.on('accountsChanged', (accounts: string[]) => {
        console.log('accountsChanged', accounts);
        dispatch(setEthereumAddress(accounts[0]));
      });
      provider.on('chainChanged', (chainId: number) => {
        console.log('chainChanged ID', chainId);
        if (String(chainId) !== process.env.REACT_APP_CHAIN_ID) {
          dispatch(
            openSnackbar({
              message: 'No support this chain',
              variant: SnackbarVariant.ERROR
            })
          );
        }
      });
      dispatch(setWalletName(WALLET_NAMES.WALLET_CONNECT));
      dispatch(setEthereumAddress(addresses[0]));
      dispatch(setProvider(provider));
      handleCloseConnectDialog();
    } catch (error: any) {
      console.log('handleConnectWalletConnect', error);
    }
  };

  // Connect Coinbase
  const handleConnectCoinBase = () => {
    try {
      activate(walletLinkConnector)
        .then(() => {
          dispatch(setWalletName(WALLET_NAMES.COINBASE));
        })
        .finally(() => {
          handleCloseConnectDialog();
        });
    } catch (e: any) {
      console.log('handleConnectCoinBase', e);
    }
  };

  const listIcon = [
    {
      icon: metamask,
      title: 'Metamask',
      onClickFunc: handleConnectMetaMask
    },
    {
      icon: trust,
      title: 'Trust Wallet',
      onClickFunc: handleConnectWalletConnect
    },
    {
      icon: coinbase,
      title: 'Coinbase',
      onClickFunc: handleConnectCoinBase
    },
    {
      icon: wallet_connect,
      title: 'Wallet Connect',
      onClickFunc: handleConnectWalletConnect
    }
  ];

  const renderData = useCallback((content) => {
    return content
      ? content.map(({ icon, title, onClickFunc }: any) => {
          return (
            <Box key={title} onClick={onClickFunc} className={cx('list-wallet')}>
              <Button className={cx('button')} disableRipple={true}>
                <img className={cx('icon')} src={icon} alt="icon" />
                <span className={cx('title')}>{title}</span>
              </Button>
            </Box>
          );
        })
      : null;
  }, []);

  return (
    <>
      <div className={cx('banner-connect')}>
        <img src={bannerImg} alt="" />
        <span>Hi! Welcome today!</span>
      </div>
      <div className={cx('title-connect')}>Connect your wallet</div>
      {listIcon.map((item, index) => {
        const { icon, title, onClickFunc } = item;
        const contents = [
          {
            icon: icon,
            title: title,
            onClickFunc: onClickFunc
          }
        ];
        return (
          <Box style={{ margin: '-24px', padding: '11px' }} key={title}>
            {renderData(contents)}
          </Box>
        );
      })}
    </>
  );
};
export default ConnectWalletPage;
