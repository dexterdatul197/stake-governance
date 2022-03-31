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
import { currencyFormatter, currentAddress } from '../../../helpers/common';
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
          }}>
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
    const contract = await stakingToken();
    const stakeValue = await contract.userInfo(0, connectedAddress);
    const earnValues = await contract.pendingReward(0, connectedAddress);
    const formatStake = web3.utils.fromWei(String(stakeValue.amount), 'ether');

    setValue({
      ...value,
      defaultValue: Number(parseFloat(formatStake).toFixed(4)),
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
      const contract = await stakingToken();
      console.log(new BigNumber(stake.toFixed(4).toString()).eq(value.defaultValue.toString()));

      // withdraw max
      if (new BigNumber(stake.toFixed(4).toString()).eq(value.defaultValue.toString())) {
        const res = (await contract.withdraw(0, value.stake)) as any;
        await res.wait();
        setDone(false);
        dispatch(
          openSnackbar({
            message: 'Withdraw Success',
            variant: SnackbarVariant.SUCCESS
          })
        );
        handleUpdateSmartContract();

        // custom withdraw
      } else if (stake !== 0) {
        const priceDefault = web3.utils.toWei(String(value.defaultValue), 'ether');
        const res = await contract.withdraw(0, priceDefault);
        await res.wait();
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
      handleUpdateSmartContract();
    } catch (error) {
      console.log(error);
      handleCloseModalRefresh();
      setProgress(false);
    } finally {
      setDone(false);
      setProgress(false);
      handleCloseModalRefresh();
      handleUpdateSmartContract();
    }
  };

  useEffect(() => {
    if (done === false) {
      handleCloseModalRefresh();
    }
  }, [done]);

  const validateNumberField = (myNumber: any) => {
    const numberRegEx = /^\d+(\.)?(\.\d{1,4})?$/;
    return numberRegEx.test(String(myNumber));
  };

  const handleInputChange = useCallback(
    (event: any) => {
      const { value } = event.target;
      const isValid = !value || validateNumberField(value);
      if (isValid) {
        setValue({ ...value, defaultValue: value, isValid });
      }
    },
    [value.defaultValue]
  );

  return (
    <Dialog
      className={cx('dialog-container')}
      open={openWithdraw}
      onClose={() => {
        handleCloseModalRefresh();
      }}
      maxWidth="md"
      disableEscapeKeyDown>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={() => {
          handleCloseModalRefresh();
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
              <Typography className={cx('token-text')}>XCN</Typography>
            </Box>
          </Box>
          <Box className={cx('main-right')}>
            <Typography className={cx('main-right__price')}>
              {earnValue ? earnValue.toFixed(4) : 0}
            </Typography>
            <Input
              className={cx('main-right__quantity')}
              disableUnderline
              type="text"
              onChange={handleInputChange}
              placeholder="0"
              value={value.defaultValue === 0 ? '' : value.defaultValue}
            />
            <span onClick={getValueStake} className={cx('text-all')}>
              Max
            </span>
            {value.defaultValue > Number(new BigNumber(stake).toFixed(4)) && (
              <div style={{ color: 'red' }}>Insufficient XCN balance</div>
            )}
            {!value.isValid  && <div style={{ color: 'red' }}>Entered Number is invalid</div>}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-actions')}>
        <Button
          disabled={
            !value.isValid ||
            value.defaultValue > Number(new BigNumber(stake).toFixed(4)) ||
            value.defaultValue === 0 ||
            value.defaultValue.toString() < '1' ||
            value.defaultValue.toString() === '' ||
            done === true
          }
          onClick={handleWithdraw}
          className={cx('button-action')}>
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
