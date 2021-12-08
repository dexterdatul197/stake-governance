import { Autocomplete, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import { CoinGeckoClient } from 'coingecko-api-v3';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AreaChart from '../chart/AreaChart';
import { setCurrencyList, setSelectedCurrency } from '../chart/redux/currency';
import style from './Main.module.scss';
const cx = classNames.bind(style);

const useStyles: any = makeStyles(() => ({
  root: {
    width: '10%',
    '& > .css-17vbkzs-MuiFormControl-root-MuiTextField-root': {
      marginTop: 0,
    },
  },
  inputRoot: {
    background: 'rgba(114, 191, 101, 0.1);',
    '&.MuiOutlinedInput-root': {
      borderRadius: '18px',
    },
  },
  input: {
    textTransform: 'uppercase',
    color: '#72bf65 !important',
  },
  endAdornment: {
    '& > .MuiAutocomplete-clearIndicator': {
      display: 'none',
    },
    '& > .MuiAutocomplete-popupIndicator': {
      color: '#72bf65',
    },
  },
}));

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const Main: React.FC = () => {
  const classes = useStyles();
  // const wallet = useAppSelector((state) => state.wallet);
  const [currencies, setCurrencies] = useState(['']);
  const dispatch = useDispatch();

  const getCurrencies = async () => {
    const coinGeckoCurrencies =
      await coinGeckoClient.simpleSupportedCurrencies();
    setCurrencies(coinGeckoCurrencies);
    dispatch(setCurrencyList(coinGeckoCurrencies));
  };

  const handleOnChangeSelectCurrency = (event: any, value: any) => {
    dispatch(setSelectedCurrency(value || 'usd'));
  };

  useEffect(() => {
    getCurrencies();
  }, []);
  return (
    <div className={cx('text-head')}>
      <div className={cx('text-head-child')}>
        <div className={cx('price')}>$278,471,325</div>
        <Autocomplete
          classes={classes}
          options={currencies}
          defaultValue={'usd'}
          onChange={handleOnChangeSelectCurrency}
          renderInput={(item) => (
            <TextField {...item} margin="normal" fullWidth />
          )}
          size={'small'}
          id="combo-box-demo"
        />
      </div>
      <div className={cx('securing-chain')}>Securing chain governance</div>
      <AreaChart />
    </div>
  );
};
export default Main;
