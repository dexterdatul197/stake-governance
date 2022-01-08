import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Slider,
  Typography
} from '@material-ui/core';
import React, { useCallback } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { openSnackbar, SnackbarVariant } from '../../../../store/snackbar';

const commaNumber = require('comma-number');
const format = commaNumber.bindWith(',', '.');

interface Props {
  cx?: any;
  walletValue?: any;
  handleNext: () => void;
  progress: Boolean;
  value?: any;
  setValue: (value: any) => void;
}

const Stake = (props: Props) => {
  const { cx, walletValue, handleNext, progress, value, setValue } = props;

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

  return (
    <React.Fragment>
      <DialogTitle className={cx('title-dialog')}>
        <Typography className={cx('text-stake')}>Stake</Typography>
        <Box></Box>
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
            <Input
              onClick={handleChangeInputPercent}
              className={cx('percent-number')}
              disabled
              disableUnderline
              value={valueText(value.value1)}
            />
            <Input
              onClick={handkeChangeInputPercent2}
              className={cx('percent-number')}
              disabled
              disableUnderline
              value={valueText(value.value2)}
            />
            <Input
              onClick={handkeChangeInputPercent3}
              className={cx('percent-number')}
              disabled
              disableUnderline
              value={valueText(value.value3)}
            />
            <Input
              onClick={handkeChangeInputPercent4}
              className={cx('percent-number')}
              disabled
              disableUnderline
              value={value.all ? 'All' : 0}
            />
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
        <Button onClick={handleNextStep} className={cx('button-stake')}>
          {progress ? <CircularProgress style={{ color: '#ffffff' }} /> : 'Stake'}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

export default Stake;
