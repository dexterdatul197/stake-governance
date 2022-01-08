import { useEffect } from 'react';
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
import { connectCoinbase, connectMetaMask, connectTrust } from '../../helpers/connectWallet';
import { openSnackbar, SnackbarVariant } from '../../store/snackbar';
import {
  setEthereumAddress,
  setOpenConnectDialog,
  setWalletName,
  walletsConfig
} from '../connect-wallet/redux/wallet';
import { useAppDispatch, useAppSelector } from './../../store/hooks';
import styles from './ConnectWalletPage.module.scss';
import metamask from '../../assets/icon/meta_mask.svg';
import trust from '../../assets/icon/trust.svg';
import coinbase from '../../assets/icon/coinbase.svg';
import wallet_connect from '../../assets/icon/wallet_connect.svg';

import { injectedConnector } from '../../connectors/injectedConnector';
import { switchNetwork } from '../../connectors/switchNetwork';
import {
  walletconnectConnector,
  web3WalletConnect,
  provider
} from '../../connectors/walletconnectConnector';
import bannerImg from '../../assets/imgs/bg-connect.png';
const cx = classnames.bind(styles);

const ConnectWalletPage: React.FC = () => {
  const history = useHistory();
  const { connector, library, chainId, account, activate, deactivate, active, error } =
    useWeb3React<Web3>();
  const dispatch = useAppDispatch();
  const wallet = useAppSelector((state) => state.wallet);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [apiSecretError, setApiSecretError] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const openConnectWalletDialog = useAppSelector((state) => state.wallet.openConnectDialog);
  const [coinbaseDialogOpen, setCoinbaseDialogOpen] = useState(false);
  const handleCloseConnectDialog = () => {
    dispatch(setOpenConnectDialog(false));
  };

  // Check network
  const checkNetwork = () => {
    if (!window.ethereum) {
      dispatch(
        openSnackbar({
          message: 'Your brower are not install Metamask extension, please install it!',
          variant: SnackbarVariant.ERROR
        })
      );
    }
    const netId = window.ethereum.networkVersion
      ? +window.ethereum.networkVersion
      : +window.ethereum.chainId;
    if (netId) {
      if (netId === 1 || netId === 3) {
        if (netId === 3 && process.env.REACT_APP_ENV === 'prod') {
          dispatch(
            openSnackbar({
              message:
                'You are currently visiting the Ropsten Test Network for Strike Finance. Please change your metamask to access the Ethereum Mainnet.',
              variant: SnackbarVariant.ERROR
            })
          );
        } else if (netId === 1 && process.env.REACT_APP_ENV === 'dev') {
          dispatch(
            openSnackbar({
              message:
                'You are currently visiting the Main Network for Strike Finance. Please change your metamask to access the Ropsten Test Network.',
              variant: SnackbarVariant.ERROR
            })
          );
        }
      } else {
        dispatch(
          openSnackbar({
            message:
              'You are currently connected to another network. Please connect to Ethereum Network',
            variant: SnackbarVariant.ERROR
          })
        );
      }
    }
  };

  const windowObj = window as any;

  // Connect MetaMask
  const handleConnectMetaMask = async () => {
    if (isMobile && !windowObj?.ethereum?.isMetaMask) {
      window.location.assign(process.env.REACT_APP_DEEP_LINK_METAMASK || '#');
      return;
    }
    try {
      activate(injectedConnector).then(() => {
        dispatch(setWalletName(walletsConfig[0]));
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
      activate(walletconnectConnector)
        .then(() => {
          dispatch(setWalletName(walletsConfig[1]));
        })
        .finally(() => {
          handleCloseConnectDialog();
        });
    } catch (error: any) {
      console.log('handleConnectWalletConnect', error);
    }
  };

  // Connect Trust
  const handleConnectTrust = async () => {};

  // Connect Coinbase
  const handleConnectCoinBase = () => {
    dispatch(setOpenConnectDialog(false));
    setCoinbaseDialogOpen(true);
  };

  const handleCloseConnectCoibaseDialog = () => {
    setCoinbaseDialogOpen(false);
  };

  const handleOnChangeApiKey = (event: any) => {
    setApiKey(event.target.value);
    setApiKeyError(false);
  };

  const handleOnChangeApiSecret = (event: any) => {
    setApiSecret(event.target.value);
    setApiSecretError(false);
  };

  const handleConnectCoinbase = async () => {};

  const listIcon = [
    {
      icon: metamask,
      title: 'Metamask',
      onClickFunc: handleConnectMetaMask
    },
    // {
    //   icon: trust,
    //   title: 'Trust Wallet',
    //   onClickFunc: handleConnectTrust,
    // },
    // {
    //   icon: coinbase,
    //   title: 'Coinbase',
    //   onClickFunc: handleConnectCoinBase,
    // },
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
