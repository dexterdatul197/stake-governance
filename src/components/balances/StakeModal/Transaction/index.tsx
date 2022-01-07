import { BigNumber } from '@0x/utils';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import React, { useCallback, useEffect, useState } from 'react';
import { currentAddress } from '../../../../helpers/common';
import { getCHNBalance, stakingToken } from '../../../../helpers/ContractService';
import { useAppSelector } from '../../../../store/hooks';

interface Props {
  cx?: any;
  handleBack: () => void;
  handleNext: () => void;
  value?: any;
  walletValue?: any;
  handleCloseModal: () => void;
}

const Transaction = (props: Props) => {
  const {
    cx,
    handleBack,
    handleNext,
    walletValue,
    handleCloseModal,
    value,
  } = props;
  const wallet = useAppSelector((state: any) => state.wallet);

  const handleConfirmTransaction = () => {
    handleNext();
  };

  const handleCloseTransaction = () => {
    handleCloseModal();
    setTimeout(() => {
      handleBack();
    }, 500);
  };
  return (
    <React.Fragment>
      <DialogTitle className={cx('dialog-title__transaction')}>
        <Box className={cx('children_content')}>
          <ArrowBackIosIcon onClick={handleBack} className={cx('icon_right')} />
          <Typography className={cx('confirm-title')}>Confirm Transaction</Typography>
          <CloseIcon onClick={handleCloseTransaction} className={cx('icon_left')} />
        </Box>
      </DialogTitle>
      <DialogContent className={cx('dialog-content__transaction')}>
        <Box className={cx('children_content')}>
          <Typography className={cx('token-quantity')}>
            {((value.default * walletValue) / 100).toFixed(4)}
          </Typography>
          <Typography className={cx('token-stake')}>CHN STAKE</Typography>
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-actions__transaction')}>
        <Button
          onClick={handleConfirmTransaction}
          className={cx('dialog-actions__transaction__confirm')}>
          Confirm
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default Transaction;
