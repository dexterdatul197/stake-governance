import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Typography,
  CircularProgress
} from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import CHN_icon from '../../../assets/icon/CHN.svg';
import { currentAddress } from '../../../helpers/common';
import { stakingToken } from '../../../helpers/ContractService';
import useIsMobile from '../../../hooks/useMobile';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../store/snackbar';
import styles from './styles.module.scss';
import { BigNumber } from '@0x/utils';
import loadingSvg from 'src/assets/icon/loading.svg';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

const cx = classNames.bind(styles);

interface Props {
  openWithdraw: boolean;
  handleCloseModalWithDraw: () => void;
  handleUpdateSmartContract: () => void;
}

const BootstrapDialogTitle = (props: any) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle className={cx('dialig-title')} sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const WithDraw = (props: Props) => {
  const { openWithdraw, handleCloseModalWithDraw, handleUpdateSmartContract } = props;
  const wallet = useAppSelector((state: any) => state.wallet);
  const [stake, setStake] = useState(0);
  const [earn, setEarn] = useState(0);
  const [hide, setHide] = useState(false);
  const [progress, setProgress] = useState(false);
  const dispatch = useAppDispatch();

  const [value, setValue] = useState({
    value: 0,
    isValid: true
  });

  const validateNumberField = (myNumber: any) => {
    const numberRegEx = /\-?\d*\.?\d{1,2}/;
    return numberRegEx.test(String(myNumber).toLowerCase());
  };

  const getValueSC = async () => {
    try {
      const connectedAddress = currentAddress(wallet);
      const getValueStake = await stakingToken().methods.userInfo(0, connectedAddress).call();
      const getValueEarned = await stakingToken().methods.pendingReward(0, connectedAddress).call();
      setStake(getValueStake.amount);
      setEarn(getValueEarned);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (stake > 0) {
      setValue({ ...value, value: stake });
    }
  }, [stake]);

  // useEffect(() => {
  //   if (Number(stake.default) > 0) {
  //     Number(new BigNumber(stake.default).dividedBy('1e18'));
  //   }

  // }, [Number(stake.default)]);

  // useEffect(() => {
  //   getValueSC();
  // }, []);

  // const handleWithdraw = async () => {
  //   try {
  //     setProgress(true);
  //     setTimeout(() => {
  //       setProgress(false);
  //     }, 1000);

  //     if (stake > 0) {
  //       handleCloseModalWithDraw();
  //       await stakingToken()
  //         .methods.withdraw(0, new BigNumber(value.defaultValue).multipliedBy('1e18'))
  //         .send({ from: currentAddress(wallet) });
  //       dispatch(
  //         openSnackbar({
  //           message: 'Withdraw Success',
  //           variant: SnackbarVariant.SUCCESS
  //         })
  //       );
  //       handleUpdateSmartContract();
  //     } else if (earn > 0) {
  //       handleCloseModalWithDraw();
  //       await stakingToken()
  //         .methods.withdraw(0, new BigNumber(earn).multipliedBy('1e18'))
  //         .send({ from: currentAddress(wallet) });
  //       dispatch(
  //         openSnackbar({
  //           message: 'Withdraw Success',
  //           variant: SnackbarVariant.SUCCESS
  //         })
  //       );
  //       handleUpdateSmartContract();
  //     } else {
  //       dispatch(
  //         openSnackbar({
  //           message: 'Withdraw Failed',
  //           variant: SnackbarVariant.ERROR
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     handleCloseModalWithDraw();
  //     setProgress(false);
  //   }
  // };

  const handleInputChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      const isValid = !value || validateNumberField(value);
      setValue({ ...value, value, isValid });
    },
    [stake]
  );

  return (
    <Dialog
      className={cx('dialog-container')}
      open={openWithdraw}
      onClose={() => {
        handleCloseModalWithDraw();
        setStake(0);
        setEarn(0);
      }}
      maxWidth="md"
      disableEscapeKeyDown>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => {
          handleCloseModalWithDraw();
          setStake(0);
          setEarn(0);
        }}>
        Withdraw
      </BootstrapDialogTitle>
      <DialogContent className={cx('dialog-content')}>
        <Box className={cx('dialog-content__title')}>
          <Typography className={cx('amount')}>Amount</Typography>
          <Typography className={cx('available')}>Available</Typography>
        </Box>
        <Box className={cx('dialog-content__children')}>
          <Box className={cx('main-left')}>
            <img className={cx('main-left__icon')} src={CHN_icon} alt="CHN_icon" />
            <Box className={cx('main-left__text')}>
              <Typography className={cx('token-title')}>Token</Typography>
              <Typography className={cx('token-text')}>CHN</Typography>
            </Box>
          </Box>
          <Box className={cx('main-right')}>
            <Typography className={cx('main-right__price')}>
              {Math.floor(
                Number(String(new BigNumber(earn).dividedBy('1e18')).match(/^\d+(?:\.\d{0,5})?/)) *
                  10000
              ) / 10000}
            </Typography>
            <Input
              className={cx('main-right__quantity')}
              disableUnderline
              onChange={handleInputChange}
              value={Math.floor(value.value * Math.pow(10, -18) * 10000) / 10000}
            />
            <span className={cx('text-all')} onClick={getValueSC}>
              Max
            </span>

            {!value.isValid && <div style={{ color: 'red' }}>Entered Number is invalid</div>}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-actions')}>
        <Button onClick={() => {}} className={cx('button-action')}>
          {progress ? (
            <img
              src={loadingSvg}
              className={cx('loading-rotate')}
              style={{ width: 18, margin: 0 }}
              alt=""
            />
          ) : (
            'Withdraw'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WithDraw;
