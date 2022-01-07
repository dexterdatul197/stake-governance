import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Dialog, IconButton, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import classnames from 'classnames/bind';
import React, { useState, useCallback } from 'react';
import { MISSING_EXTENSION_ERROR } from '../../constant/uninstallExtentionException';
import {
  connectCoinbase,
  connectMetaMask,
  connectTrust,
} from '../../helpers/connectWallet';
import { openSnackbar, SnackbarVariant } from '../../store/snackbar';
import {
  setCoinbaseAddress,
  setEthereumAddress,
  setOpenConnectDialog,
  setTrustAddress,
} from '../connect-wallet/redux/wallet';
import { useAppDispatch, useAppSelector } from './../../store/hooks';
import styles from './ConnectWalletDialog.module.scss';
import metamask from '../../assets/icon/meta_mask.svg';
import trust from '../../assets/icon/trust.svg';
import coinbase from '../../assets/icon/coinbase.svg';
import wallet_connect from '../../assets/icon/wallet_connect.svg';

import { injectedConnector } from '../../connectors/injectedConnector';
import { switchNetwork } from '../../connectors/switchNetwork';
import { walletconnectConnector } from '../../connectors/walletconnectConnector';

const cx = classnames.bind(styles);

const ConnectWalletDialog: React.FC = () => {
  const { account, activate, deactivate } = useWeb3React<Web3>();
  const dispatch = useAppDispatch();
  const wallet = useAppSelector((state) => state.wallet);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [apiSecretError, setApiSecretError] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const openConnectWalletDialog = useAppSelector(
    (state) => state.wallet.openConnectDialog
  );
  const [coinbaseDialogOpen, setCoinbaseDialogOpen] = useState(false);
  const handleCloseConnectDialog = () => {
    dispatch(setOpenConnectDialog(false));
  };

  // Check network
  const checkNetwork = () => {
    if (!window.ethereum) {
      dispatch(
        openSnackbar({
          message:
            'Your brower are not install Metamask extension, please install it!',
          variant: SnackbarVariant.ERROR,
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
              variant: SnackbarVariant.ERROR,
            })
          );
        } else if (netId === 1 && process.env.REACT_APP_ENV === 'dev') {
          dispatch(
            openSnackbar({
              message:
                'You are currently visiting the Main Network for Strike Finance. Please change your metamask to access the Ropsten Test Network.',
              variant: SnackbarVariant.ERROR,
            })
          );
        }
      } else {
        dispatch(
          openSnackbar({
            message:
              'You are currently connected to another network. Please connect to Ethereum Network',
            variant: SnackbarVariant.ERROR,
          })
        );
      }
    }
  };
  // Connect MetaMask
  const handleConnectMetaMask = async () => {
    try {
      await deactivate();
      activate(injectedConnector).then(() => {
        localStorage.setItem('ethereumAddress', JSON.stringify(account));
        dispatch(setEthereumAddress(account));
      });
      switchNetwork(process.env.REACT_APP_CHAIN_ID || '');
    } catch (e: any) {
      if (e.message === MISSING_EXTENSION_ERROR) {
        dispatch(
          openSnackbar({
            message: 'Extension not install!',
            variant: SnackbarVariant.ERROR,
          })
        );
      }
    }
    handleCloseConnectDialog();
  };

  // Connect Wallet connect
  const handleConnectWalletConnect = async () => {
    try {
      await deactivate();
      activate(walletconnectConnector).then(() => {
        localStorage.setItem('ethereumAddress', JSON.stringify(account));
        dispatch(setEthereumAddress(account));
      });
      switchNetwork(process.env.REACT_APP_CHAIN_ID || '');
    } catch (e: any) {
      if (e.message === MISSING_EXTENSION_ERROR) {
        dispatch(
          openSnackbar({
            message: 'Extension not install!',
            variant: SnackbarVariant.ERROR,
          })
        );
      }
    }
    handleCloseConnectDialog();
  };

  // Connect Trust
  const handleConnectTrust = async () => {
    dispatch(setOpenConnectDialog(false));
    const connectedTrust = await connectTrust();
    if (connectedTrust.length > 0) {
      dispatch(setTrustAddress(connectedTrust[0]));
    } else {
      dispatch(
        openSnackbar({
          message: 'Connect to Trust wallet did not success!',
          variant: SnackbarVariant.WARNING,
        })
      );
    }
  };

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

  const handleConnectCoinbase = async () => {
    // validate api key api secret
    if (!apiKey) setApiKeyError(true);
    if (!apiSecret) setApiSecretError(true);
    if (apiKey && apiSecret) {
      const res: any = await connectCoinbase(apiKey, apiSecret);
      if (res.code === 401) {
        dispatch(
          openSnackbar({ variant: SnackbarVariant.ERROR, message: res.data })
        );
      } else {
        dispatch(setCoinbaseAddress(res.data.data.id));
      }
      setCoinbaseDialogOpen(false);
    }
  };

  const listIcon = [
    {
      icon: metamask,
      title: 'Meta Mask',
      onClickFunc: handleConnectMetaMask,
    },
    // {
    //   icon: trust,
    //   title: 'Trust Wallet',
    //   onClickFunc: handleConnectTrust,
    // },
    // {
    //   icon: coinbase,
    //   title: 'Coin Base',
    //   onClickFunc: handleConnectCoinBase,
    // },
    {
      icon: wallet_connect,
      title: 'Wallet Connect',
      onClickFunc: handleConnectWalletConnect,
    },
  ];

  const renderData = useCallback((content) => {
    return content
      ? content.map(({ icon, title, onClickFunc }: any, index: any) => {
          return (
            <Box
              key={index}
              onClick={onClickFunc}
              className={cx('list-wallet')}
            >
              <Button className={cx('button')} disableRipple={true}>
                <img className={cx('icon')} src={icon} alt="icon" />
                <Typography className={cx('title')}>{title}</Typography>
              </Button>
            </Box>
          );
        })
      : null;
  }, []);

  return (
    <>
      <Dialog
        open={openConnectWalletDialog}
        onClose={handleCloseConnectDialog}
        fullWidth={true}
        maxWidth={'xs'}
        disableEscapeKeyDown={true}
        PaperProps={{
          style: {
            backgroundColor: 'var(--background-dialog-color)',
            overflowY: 'unset',
          },
        }}
      >
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography component={'div'}>
            <IconButton size={'small'} className={cx('hidden')}>
              <CloseIcon />
            </IconButton>
          </Typography>
          <Typography component={'div'} className={cx('title')}>
            <Box>
              <div className={cx('connect-wallet-text-title')}>
                Connect your wallet
              </div>
            </Box>
          </Typography>
          <Typography component={'div'}>
            <IconButton
              onClick={handleCloseConnectDialog}
              size={'small'}
              className={cx('close-button')}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
        </Box>

        {listIcon.map((item, index) => {
          const { icon, title, onClickFunc } = item;
          const contents = [
            {
              icon: icon,
              title: title,
              onClickFunc: onClickFunc,
            },
          ];
          return (
            <Box style={{ margin: '-24px', padding: '11px' }} key={index}>
              {renderData(contents)}
            </Box>
          );
        })}
      </Dialog>
      {/* Coinbase login dialog */}
      <Dialog
        open={coinbaseDialogOpen}
        fullWidth={true}
        maxWidth={'xs'}
        disableEscapeKeyDown={true}
        PaperProps={{
          style: {
            backgroundColor: '#001C4E',
            color: '#fff',
          },
        }}
      >
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography component={'div'}>
            <IconButton size={'small'} className={cx('hidden')}>
              <CloseIcon />
            </IconButton>
          </Typography>
          <Typography component={'div'} className={cx('title')}>
            <Box>
              <div className={cx('connect-wallet-text')}>Connect Coinbase</div>
            </Box>
          </Typography>
          <Typography component={'div'}>
            <IconButton
              onClick={handleCloseConnectCoibaseDialog}
              size={'small'}
              className={cx('close-button')}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
        </Box>
        <Box padding={2}>
          <TextField
            required
            id="outlined-required"
            label="API KEY"
            defaultValue=""
            size="medium"
            fullWidth={true}
            error={apiKeyError}
            onChange={handleOnChangeApiKey}
            margin="dense"
          />
          <TextField
            required
            id="outlined-required"
            label="API SECRET"
            defaultValue=""
            size="medium"
            fullWidth={true}
            error={apiSecretError}
            onChange={handleOnChangeApiSecret}
            margin="dense"
          />
        </Box>
        <Button
          size="medium"
          style={{
            borderRadius: 20,
            backgroundColor: '#72BF65',
            padding: '18px 36px',
            color: '#fff',
            fontWeight: 'bold',
            width: '50%',
            textAlign: 'center',
            margin: 'auto',
            marginBottom: '10px',
          }}
          onClick={handleConnectCoinbase}
        >
          Connect
        </Button>
      </Dialog>
    </>
  );
};
export default ConnectWalletDialog;
