import { BigNumber } from '@0x/utils';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  Typography
} from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import loadingSvg from 'src/assets/icon/loading.svg';
import Web3 from 'web3';
import CHN_icon from '../../../assets/icon/CHN.svg';
import { currentAddress } from '../../../helpers/common';
import { stakingToken } from '../../../helpers/ContractService';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../store/snackbar';
import styles from './styles.module.scss';

const web3 = new Web3();

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

const cx = classNames.bind(styles);

interface Props {
  openWithdraw: boolean;
  handleCloseModalWithDraw: () => void;
  walletValue?: any;
  earn?: any;
  stake?: any;
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
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const WithDraw = (props: Props) => {
  const { openWithdraw, handleCloseModalWithDraw, earn, stake, handleUpdateSmartContract } = props;
  const wallet = useAppSelector((state: any) => state.wallet);
  const [value, setValue] = useState({
    defaultValue: 0,
    stake: 0,
    earn: 0,
    isValid: true
  });
  const [progress, setProgress] = useState(false);
  const dispatch = useAppDispatch();
  const [earnValue, setEarnValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (earn) {
      setEarnValue(earn);
    }
  }, [earn]);

  const getValueStake = async () => {
    const connectedAddress = currentAddress(wallet);
    const stakeValue = await stakingToken().methods.userInfo(0, connectedAddress).call();
    const earnValues = await stakingToken().methods.pendingReward(0, connectedAddress).call();
    const formatStake =
      Math.floor(
        Number(
          String(new BigNumber(stakeValue.amount).dividedBy('1e18')).match(/^\d+(?:\.\d{0,5})?/)
        ) * 10000
      ) / 10000;
    setValue({
      ...value,
      defaultValue: formatStake,
      stake: stakeValue.amount,
      earn: earnValues
    });
  };

  const handleCloseModalRefresh = () => {
    handleCloseModalWithDraw();
    setEarnValue(earn);
    setValue({ ...value, defaultValue: 0 });
  };

  const handleWithdraw = async () => {
    try {
      setProgress(true);
      setDone(true);
      setTimeout(() => {
        setProgress(false);
      }, 1000);

      if (stake > 0) {
        await stakingToken()
          .methods.withdraw(
            0,
            new BigNumber(web3.utils.toWei(String(value.stake), 'ether')).div('1e18')
          )
          .send({ from: currentAddress(wallet) });
        setDone(false);
        dispatch(
          openSnackbar({
            message: 'Withdraw Success',
            variant: SnackbarVariant.SUCCESS
          })
        );
        handleUpdateSmartContract();
      } else if (stake === value.stake) {
        await stakingToken()
          .methods.withdraw(0, web3.utils.toWei(String(value.stake), 'ether'))
          .send({ from: currentAddress(wallet) });
        setDone(false);
        dispatch(
          openSnackbar({
            message: 'Withdraw Success',
            variant: SnackbarVariant.SUCCESS
          })
        );
        handleUpdateSmartContract();
      } else if (value.earn > 0) {
        handleCloseModalRefresh();
        await stakingToken()
          .methods.withdraw(0, web3.utils.toWei(String(value.earn), 'ether'))
          .send({ from: currentAddress(wallet) });

        setDone(false);
        dispatch(
          openSnackbar({
            message: 'Withdraw Success',
            variant: SnackbarVariant.SUCCESS
          })
        );
        handleUpdateSmartContract();
      } else {
        dispatch(
          openSnackbar({
            message: 'Withdraw Failed',
            variant: SnackbarVariant.ERROR
          })
        );
      }
    } catch (error) {
      console.log(error);
      handleCloseModalRefresh();
      setProgress(false);
    } finally {
      setDone(false);
    }
  };

  useEffect(() => {
    if (done === false) {
      handleCloseModalRefresh();
    }
  }, [done]);

  const validateNumberField = (myNumber: any) => {
    const numberRegEx = /\d+(\.)?(\d+)?$/;
    return numberRegEx.test(String(myNumber));
  };

  const handleInputChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      const isValid = !value || validateNumberField(value);
      setValue({ ...value, defaultValue: value, isValid });
    },
    [value.defaultValue]
  );
  useEffect(() => {
    console.log(value.stake);
  }, [value.stake]);
  return (
    <Dialog
      className={cx('dialog-container')}
      open={openWithdraw}
      onClose={() => {
        handleCloseModalRefresh();
      }}
      maxWidth="md"
      disableEscapeKeyDown
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => {
          handleCloseModalRefresh();
        }}
      >
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
            <Typography className={cx('main-right__price')}>{earnValue ? earnValue : 0}</Typography>
            <Input
              className={cx('main-right__quantity')}
              disableUnderline
              type="text"
              onChange={handleInputChange}
              value={value.defaultValue}
            />
            <span onClick={getValueStake} className={cx('text-all')}>
              Max
            </span>
            {value.defaultValue > Number(stake) && (
              <div style={{ color: 'red' }}>Insufficient CHN balance</div>
            )}
            {!value.isValid && <div style={{ color: 'red' }}>Entered Number is invalid</div>}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-actions')}>
        <Button
          disabled={
            !value.isValid ||
            value.defaultValue > Number(stake) ||
            (value.defaultValue === 0 && Number(earnValue) === 0) ||
            done === true
          }
          onClick={handleWithdraw}
          className={cx('button-action')}
        >
          {done ? (
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
