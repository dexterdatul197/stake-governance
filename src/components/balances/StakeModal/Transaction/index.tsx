import { BigNumber } from '@0x/utils';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import React, { useCallback, useEffect, useState } from 'react';
import { currentAddress } from '../../../../helpers/common';
import { getCHNBalance, stakingToken } from '../../../../helpers/ContractService';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../../store/snackbar';
import { ReactComponent as DoneIcon } from '../../../../assets/icon/Done-icon.svg';
import { setTimeout } from 'timers';
import { ethers } from 'ethers';
import Web3 from 'web3';

interface Props {
  cx?: any;
  handleBack: () => void;
  value?: any;
  walletValue?: any;
  handleCloseModal: () => void;
  handleUpdateSmartContract: () => void;
}

const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const Transaction = (props: Props) => {
  const { cx, handleBack, walletValue, handleCloseModal, value, handleUpdateSmartContract } = props;
  const wallet = useAppSelector((state: any) => state.wallet);
  const web3 = new Web3();
  const dispatch = useAppDispatch();
  const amount = value.default * walletValue;
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(false);
  const formatAmount = new BigNumber(amount / 100)
  // web3.utils.toWei(String(formatAmount));

  // useEffect(() => {
  //   const connectedAddress = currentAddress(wallet);
  //   const getValueCHN = async () => {
  //     await getCHNBalance().methods.balanceOf(connectedAddress).call();
  //   };
  // }, []);

  const handleConfirmTransaction = () => {
    setProgress(true);
    stakingToken()
      .methods.stake(0, web3.utils.toWei(String(formatAmount),'ether'))
      .send({ from: currentAddress(wallet) })
      .then((res: any) => {
        if (res.status === true) {
          setDone(true);
          setProgress(false);
          dispatch(
            openSnackbar({
              message: 'Staking success',
              variant: SnackbarVariant.SUCCESS
            })
          );
          handleUpdateSmartContract();
        } else {
          dispatch(
            openSnackbar({
              message: 'Staking failed',
              variant: SnackbarVariant.ERROR
            })
          );
          handleCloseTransaction();
        }
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        handleCloseTransaction();
      });
  };

  const handleConfirm = () => {
    setProgress(true);
    getCHNBalance()
      .methods.allowance(currentAddress(wallet), process.env.REACT_APP_STAKE_TESTNET_ADDRESS)
      .call()
      .then((res: any) => {
        if (res === '0') {
          getCHNBalance()
            .methods.approve(process.env.REACT_APP_STAKE_TESTNET_ADDRESS, MAX_INT)
            .send({ from: currentAddress(wallet) })
            .then((res: any) => {
              console.log('res approve: ', res);
              if (res.status === true) {
                dispatch(
                  openSnackbar({
                    message: 'Approve successful, please click confirm button',
                    variant: SnackbarVariant.SUCCESS
                  })
                );
              } else {
                dispatch(
                  openSnackbar({
                    message: 'Approve faled',
                    variant: SnackbarVariant.ERROR
                  })
                );
              }
            })
            .catch((e: any) => console.log(e));
        } else {
          setProgress(false);
          dispatch(
            openSnackbar({
              message: 'Please wait a moment',
              variant: SnackbarVariant.SUCCESS
            })
          );
          handleConfirmTransaction();
        }
      });
  };

  const handleCloseTransaction = () => {
    setTimeout(() => {
      handleCloseModal();
    }, 500);
    setTimeout(() => {
      handleBack();
    }, 700);
  };

  return (
    <React.Fragment>
      <DialogTitle className={cx('dialog-title__transaction')}>
        <Box className={cx('children_content')}>
          <Button onClick={handleBack} className={cx('icon_right')} disabled={progress === false}>
            <ArrowBackIosIcon />
          </Button>
          <Typography className={cx('confirm-title')}>Confirm Transaction</Typography>
          <CloseIcon onClick={handleCloseTransaction} className={cx('icon_left')} />
        </Box>
      </DialogTitle>
      <DialogContent className={cx('dialog-content__transaction')}>
        <Box className={cx('children_content')}>
          {done === false ? (
            <React.Fragment>
              <Typography className={cx('token-quantity')}>
                {progress ? <CircularProgress /> : ((value.default * walletValue) / 100).toFixed(4)}
              </Typography>
              <Typography className={cx('token-stake')}>CHN STAKE</Typography>
            </React.Fragment>
          ) : (
            <DoneIcon style={{ margin: 'auto' }} />
          )}
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-actions__transaction')}>
        <Button
          disabled={done || progress}
          onClick={handleConfirm}
          className={cx('dialog-actions__transaction__confirm')}
        >
          Confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default Transaction;
