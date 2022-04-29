import { BigNumber } from '@0x/utils';
import {
  Box,
  Button, CircularProgress, DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import React, { useState } from 'react';
import { setTimeout } from 'timers';
import Web3 from 'web3';
import { ReactComponent as DoneIcon } from '../../../../assets/icon/Done-icon.svg';
import { stakingToken } from '../../../../helpers/ContractService';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../../store/snackbar';

interface Props {
  cx?: any;
  handleBack: () => void;
  value?: any;
  walletValue?: any;
  handleCloseModal: () => void;
  handleUpdateSmartContract: () => void;
  chnToken?: any;
  balanceValue?: any;
  isPercent: boolean;
  valueBalance: any;
  setValueBalance: any;
}


const Transaction = (props: Props) => {
  const {
    cx,
    handleBack,
    walletValue,
    handleCloseModal,
    value,
    handleUpdateSmartContract,
    chnToken,
    balanceValue,
    isPercent,
    valueBalance,
    setValueBalance
  } = props;

  const wallet = useAppSelector((state: any) => state.wallet);
  const web3 = new Web3();
  const dispatch = useAppDispatch();
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(false);
  const amount = new BigNumber(value.default).multipliedBy(
    web3.utils.fromWei(chnToken.toString(), 'ether')
  );
  const price = new BigNumber(value.default).multipliedBy(walletValue).dividedBy(100);
  const formatAmount = new BigNumber(amount).dividedBy(100);

  const handleConfirmTransaction = async () => {
    setProgress(true);
    const contract = await stakingToken();
    if (value.default === 100) {
      contract
        .stake(0, web3.utils.toWei(String(formatAmount), 'ether'))
        .then(async (res: any) => {
          await res.wait();
          handleCloseModal();
          handleUpdateSmartContract();
          setDone(true);
          setProgress(false);

          dispatch(
            openSnackbar({
              message: 'Staking success',
              variant: SnackbarVariant.SUCCESS
            })
          );
          handleUpdateSmartContract();
        })
        .catch((e: any) => {
          console.log(e);
        })
        .finally(() => {
          handleCloseTransaction();
        });
    } else if (valueBalance) {
      contract
        .stake(0, web3.utils.toWei(valueBalance?.replaceAll(',', ''), 'ether'))
        .then(async (res: any) => {
          await res.wait();
          handleCloseModal();
          handleUpdateSmartContract();
          setDone(true);
          setProgress(false);
          dispatch(
            openSnackbar({
              message: 'Staking success',
              variant: SnackbarVariant.SUCCESS
            })
          );
        })
        .catch((e: any) => {
          console.log(e);
        })
        .finally(() => {
          handleCloseTransaction();
        });
    } else {
      contract
        .stake(0, web3.utils.toWei(String(price), 'ether'))
        .then(async (res: any) => {
          await res.wait();
          handleCloseModal();
          handleUpdateSmartContract();
          setDone(true);
          setProgress(false);
          dispatch(
            openSnackbar({
              message: 'Staking success',
              variant: SnackbarVariant.SUCCESS
            })
          );
        })
        .catch((e: any) => {
          console.log(e);
        })
        .finally(() => {
          handleCloseTransaction();
        });
    }
  };

  const handleCloseTransaction = () => {
    setTimeout(() => {
      handleCloseModal();
      setTimeout(() => {
        handleBack();
        setValueBalance('');
      }, 500);
    }, 1000);
  };
  const handleCloseModalTrans = () => {
    handleCloseModal();
    setTimeout(() => {
      handleBack();
      setValueBalance('');
    }, 300);
  };

  return (
    <React.Fragment>
      <DialogTitle className={cx('dialog-title__transaction')}>
        <Box className={cx('children_content')}>
          <Button onClick={handleBack} className={cx('icon_right')} disabled={progress === true}>
            <ArrowBackIosIcon />
          </Button>
          <Typography className={cx('confirm-title')}>Confirm Transaction</Typography>
          <Button
            onClick={handleCloseModalTrans}
            className={cx('icon_left')}
            disabled={progress === true}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent className={cx('dialog-content__transaction')}>
        <Box className={cx('children_content')}>
          {done === false ? (
            <React.Fragment>
              <Typography className={cx('token-quantity')}>
                {progress ? <CircularProgress /> : valueBalance}
              </Typography>
              <Typography className={cx('token-stake')}>XCN STAKE</Typography>
            </React.Fragment>
          ) : (
            <DoneIcon style={{ margin: 'auto' }} />
          )}
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-actions__transaction')}>
        <Button
          disabled={done || progress}
          onClick={handleConfirmTransaction}
          className={cx('dialog-actions__transaction__confirm')}>
          Confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default Transaction;
