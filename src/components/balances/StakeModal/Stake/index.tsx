import { BigNumber } from '@0x/utils';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Slider,
  Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../../store/snackbar';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

interface Props {
  cx?: any;
  walletValue?: any;
  handleNext: () => void;
  value?: any;
  setValue: (value: any) => void;
  handleCloseModal?: () => void;
}

const Stake = (props: Props) => {
  const { cx, walletValue, handleNext, value, setValue, handleCloseModal } = props;
  const [isActivePercent1, setIsActivePercent1] = useState(false);
  const [isActivePercent2, setIsActivePercent2] = useState(false);
  const [isActivePercent3, setIsActivePercent3] = useState(false);
  const [isActivePercent4, setIsActivePercent4] = useState(false);
  const dispatch = useAppDispatch();
  const handleChangeValue = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: event.target.value };
      setValue(_value);
    },
    [value]
  );

  const valueText = (value: any) => {
    return `${value}%`;
  };

  const handleChangeInputPercent = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 25 };
      setValue(_value);
    },
    [value]
  );

  const handkeChangeInputPercent2 = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 50 };
      setValue(_value);
    },
    [value]
  );

  const handkeChangeInputPercent3 = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 75 };
      setValue(_value);
    },
    [value]
  );

  const handkeChangeInputPercent4 = useCallback(
    (event: any) => {
      let _value = { ...value };
      _value = { ..._value, default: 100 };
      setValue(_value);
    },
    [value]
  );

  const handleNextStep = () => {
    if (value.default === 0) {
      dispatch(
        openSnackbar({
          message: 'Please enter the wallet balance you want to stake',
          variant: SnackbarVariant.ERROR
        })
      );
    } else {
      handleNext();
    }
  };
  useEffect(() => {
    if (value.default === value.value1) {
      setIsActivePercent1(true);
    } else {
      setIsActivePercent1(false);
    }
    if (value.default === value.value2) {
      setIsActivePercent2(true);
    } else {
      setIsActivePercent2(false);
    }
    if (value.default === value.value3) {
      setIsActivePercent3(true);
    } else {
      setIsActivePercent3(false);
    }
    if (value.default === value.all) {
      setIsActivePercent4(true);
    } else {
      setIsActivePercent4(false);
    }
  }, [value.default]);
  return (
    <React.Fragment>
      <DialogTitle className={cx('title-dialog')}>
        <Typography className={cx('text-stake')}>Stake</Typography>
        <CloseIcon
          onClick={handleCloseModal}
          style={{ color: 'var(--text-color-balance)', cursor: 'pointer' }}
        />
      </DialogTitle>
      <DialogContent className={cx('dialog-content')}>
        <Box className={cx('dialog-content__amount')}>
          <Typography className={cx('title')}>Amount</Typography>
          <Input
            disabled
            disableUnderline
            className={cx('input')}
            value={`${value.default}%`}
            size="small"
            onChange={handleChangeValue}
          />
          <Slider
            className={cx('slider')}
            value={typeof value.default === 'number' ? value.default : 0}
            onChange={handleChangeValue}
            getAriaValueText={valueText}
          />
          <Box className={cx('dialog-content__percent')}>
            <span
              onClick={handleChangeInputPercent}
              className={cx('percent-number', { 'percent-number-active': isActivePercent1 })}>
              {valueText(value.value1)}
            </span>
            <span
              onClick={handkeChangeInputPercent2}
              className={cx('percent-number', { 'percent-number-active': isActivePercent2 })}>
              {valueText(value.value2)}
            </span>
            <span
              onClick={handkeChangeInputPercent3}
              className={cx('percent-number', { 'percent-number-active': isActivePercent3 })}>
              {valueText(value.value3)}
            </span>
            <span
              onClick={handkeChangeInputPercent4}
              className={cx('percent-number', { 'percent-number-active': isActivePercent4 })}>
              {value.all ? 'All' : 0}
            </span>
          </Box>
        </Box>
        <Box className={cx('balance')}>
          <Box className={cx('balance__wallet-balance')}>
            <Typography className={cx('title')}>
              Wallet Balance: {walletValue > 0 ? walletValue : 0.0}
            </Typography>
            <span className={cx('token')}>CHN</span>
          </Box>
          <Box className={cx('balance__stake-balance')}>
            <Typography className={cx('title')}>
              Stake Balance: {((value.default * walletValue) / 100).toFixed(4)}
            </Typography>
            <span className={cx('token')}>CHN</span>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className={cx('dialog-action')}>
        <Button
          onClick={handleNextStep}
          className={cx('button-stake')}
          disabled={new BigNumber(walletValue).lte(0)}>
          Stake
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default Stake;
