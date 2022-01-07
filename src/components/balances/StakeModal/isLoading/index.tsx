import React, { useEffect, useState } from 'react';
import { BigNumber } from '@0x/utils';
import { CircularProgress, DialogContent, DialogActions, Button } from '@mui/material';
import styles from '../styles.module.scss';
import classNames from 'classnames/bind';

import { getCHNBalance, stakingToken } from '../../../../helpers/ContractService';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { currentAddress } from '../../../../helpers/common';
import { openSnackbar, SnackbarVariant } from '../../../../store/snackbar';
import { ReactComponent as DoneIcon } from '../../../../assets/icon/Done-icon.svg';

const cx = classNames.bind(styles);

const MAX_INT = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

interface Props {
  value?: any;
  walletValue?: any;
  handleUpdateSmartContract: () => void;
  handleCloseModal: () => void;
  handleBackBegin: () => void;
}

const IsLoading = (props: Props) => {
  const { value, walletValue, handleUpdateSmartContract, handleCloseModal, handleBackBegin } =
    props;
  const [approve, setApprove] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(10);
  const wallet = useAppSelector((state: any) => state.wallet);
  const amount = value.default * walletValue;
  const formatAmount = new BigNumber(amount / 100).multipliedBy('1e18');
  const dispatch = useAppDispatch();

  const handleConfirmStake = () => {
    stakingToken()
      .methods.stake(0, formatAmount)
      .send({ from: currentAddress(wallet) })
      .then((res: any) => {
        if (res.status === true) {
          setDone(true);
          handleUpdateSmartContract();
          setTimeout(() => {
            handleCloseModal();
            handleBackBegin();
          }, 3000);
        } else {
          dispatch(
            openSnackbar({
              message: 'Staking failed',
              variant: SnackbarVariant.ERROR
            })
          );
        }
      });
  };

  useEffect(() => {
    getCHNBalance()
      .methods.allowance(currentAddress(wallet), process.env.REACT_APP_STAKE_TESTNET_ADDRESS)
      .call()
      .then((res: any) => {
        console.log('res allowance: ', res);
        if (res.toString() !== MAX_INT) {
          getCHNBalance()
            .methods.approve(process.env.REACT_APP_STAKE_TESTNET_ADDRESS, MAX_INT)
            .send({ from: currentAddress(wallet) })
            .then((res: any) => {
              if (res.status === true) {
                dispatch(
                  openSnackbar({
                    message: 'Approve successful, please click confirm button',
                    variant: SnackbarVariant.SUCCESS
                  })
                );
                setApprove(true);
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
          dispatch(
            openSnackbar({
              message: 'Allowance Failed',
              variant: SnackbarVariant.ERROR
            })
          );
        }
      })
      .catch((e: any) => console.log(e));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <React.Fragment>
      <DialogContent className={cx('dialog-content_loading')}>
        {done === false ? (
          <CircularProgress
            className={cx('dialog-content_loading__progress')}
            value={progress}
            variant="determinate"
          />
        ) : (
          <DoneIcon className={cx('icon-done')} />
        )}
      </DialogContent>
      <DialogActions className={cx('dialog-actions_loading')}>
        {done === false ? (
          <React.Fragment>
            <Button className={cx('pending')}>pending</Button>
            <Button
              onClick={() => {
                if (approve === true) {
                  handleConfirmStake();
                } else {
                  dispatch(
                    openSnackbar({
                      message: 'You have not been approved',
                      variant: SnackbarVariant.ERROR
                    })
                  );
                }
              }}
              className={cx('confirm')}
            >
              confirmation
            </Button>
          </React.Fragment>
        ) : (
          <span className={cx('text_done')}>Done</span>
        )}
      </DialogActions>
    </React.Fragment>
  );
};

export default IsLoading;
