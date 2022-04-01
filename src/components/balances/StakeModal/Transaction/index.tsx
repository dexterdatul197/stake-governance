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
import { currentAddress, format } from '../../../../helpers/common';
import { getCHNBalance, stakingToken } from '../../../../helpers/ContractService';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../../store/snackbar';
import { ReactComponent as DoneIcon } from '../../../../assets/icon/Done-icon.svg';
import { setTimeout } from 'timers';
import Web3 from 'web3';
import { ContractFactory } from 'ethers';

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
}

const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

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
    isPercent
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
    if (isPercent) {
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
    } else {
      if (balanceValue.default) {
        contract
          .stake(0, web3.utils.toWei(String(balanceValue.default), 'ether'))
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
    }
  };

  const handleConfirm = async () => {
    try {
      setProgress(true);
      const contract = await getCHNBalance();
      const handleConfirm = await contract.allowance(
        currentAddress(wallet),
        process.env.REACT_APP_STAKE_TESTNET_ADDRESS
      );
      console.log(handleConfirm._hex.toString() === '0x00');
      if (handleConfirm._hex.toString() === '0x00') {
        await contract
          .approve(process.env.REACT_APP_STAKE_TESTNET_ADDRESS, MAX_INT)
          .then(async (res: any) => {
            await res.wait();
            handleConfirmTransaction();
          })
          .catch((e: any) => console.log(e))
          .finally(() => {
            handleCloseTransaction();
          });
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseTransaction = () => {
    setTimeout(() => {
      handleCloseModal();
      setTimeout(() => {
        handleBack();
      }, 500);
    }, 1000);
  };
  const handleCloseModalTrans = () => {
    handleCloseModal();
    setTimeout(() => {
      handleBack();
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
                {progress ? (
                  <CircularProgress />
                ) : isPercent ? (
                  format(
                    new BigNumber(value.default)
                      .multipliedBy(new BigNumber(walletValue))
                      .div(new BigNumber('100'))
                      .toFixed(4)
                      .toString()
                  )
                ) : balanceValue.default ? (
                  balanceValue.default
                ) : (
                  0
                )}
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
          onClick={handleConfirm}
          className={cx('dialog-actions__transaction__confirm')}>
          Confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default Transaction;
