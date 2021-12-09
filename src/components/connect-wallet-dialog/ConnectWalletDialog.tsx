import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  ButtonBase,
  Dialog,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import classnames from 'classnames/bind';
import React, { useState } from 'react';
import CoinBaseSVG from '../../assets/icon/CoinBaseSVG';
import MetamaskSVG from '../../assets/icon/MetamaskSVG';
import TrustSVG from '../../assets/icon/TrustSVG';
import WalletConnectSVG from '../../assets/icon/WalletConnectSVG';
import { MISSING_EXTENSION_ERROR } from '../../constant/uninstallExtentionException';
import { connectCoinbase, connectMetaMask, connectTrust } from '../../helpers/connectWallet';
import { openSnackbar, SnackbarVariant } from '../../store/snackbar';
import {
  setCoinbaseAddress, setEthereumAddress,
  setOpenConnectDialog,
  setTrustAddress
} from '../connect-wallet/redux/wallet';
import { useAppDispatch, useAppSelector } from './../../store/hooks';
import styles from './ConnectWalletDialog.module.scss';

const cx = classnames.bind(styles);

const ConnectWalletDialog: React.FC = () => {
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
      if (wallet.ethereumAddress) {
        dispatch(
          openSnackbar({
            message:
              'Please open MetaMask extension in your browser to change wallet address!',
            variant: SnackbarVariant.ERROR,
          })
        );
      } else {
        checkNetwork();
        const publicKey = await connectMetaMask();
        dispatch(setEthereumAddress(publicKey));
      }
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
  }

  const handleOnChangeApiSecret = (event: any) => {
    setApiSecret(event.target.value);
    setApiSecretError(false);
  }

  const handleConnectCoinbase = async () => {
    // validate api key api secret
    if (!apiKey) setApiKeyError(true);
    if (!apiSecret) setApiSecretError(true);
    if (apiKey && apiSecret) {
      const res: any = await connectCoinbase(apiKey, apiSecret);
      if (res.code === 401) {
        dispatch(openSnackbar({ variant: SnackbarVariant.ERROR, message: res.data }))
      } else {
        dispatch(setCoinbaseAddress(res.data.data.id))
      }
      setCoinbaseDialogOpen(false);
    }
  }

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
            backgroundColor: '#001C4E',
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
            <Box><div className={cx('connect-wallet-text')}>Connect your wallet</div></Box>
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

        <ButtonBase
          disableRipple={true}
          className={cx('button')}
          onClick={handleConnectMetaMask}
        >
          <MetamaskSVG size={'xl'} />
          <p className={cx('connect-wallet-text')}>MetaMask</p>
        </ButtonBase>
        <ButtonBase
          disableRipple={true}
          className={cx('button')}
          onClick={handleConnectTrust}
        >
          <TrustSVG size={'xl'} />
          <p className={cx('connect-wallet-text')}>Trust Wallet</p>
        </ButtonBase>
        <ButtonBase
          disableRipple={true}
          className={cx('button')}
          onClick={handleConnectCoinBase}
        >
          <CoinBaseSVG size={'xl'} />
          <p className={cx('connect-wallet-text')}>Coinbase</p>
        </ButtonBase>
        <ButtonBase
          disableRipple={true}
          className={cx('button')}
          onClick={handleConnectTrust}
        >
          <WalletConnectSVG size={'xl'} />
          <p className={cx('connect-wallet-text')}>Wallet Connect</p>
        </ButtonBase>
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
            color: '#fff'
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
            <Box><div className={cx('connect-wallet-text')}>Connect Coinbase</div></Box>
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
            marginBottom: '10px'
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
