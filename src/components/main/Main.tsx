import { BigNumber } from '@0x/utils';
import { Autocomplete, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames/bind';
import { CoinGeckoClient } from 'coingecko-api-v3';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getTVLData } from '../../apis/apis';
import { dateBeforeMonth, format } from '../../helpers/common';
import AreaChart from '../chart/AreaChart';
import { setCurrencyList, setSelectedCurrency } from '../chart/redux/currency';
import style from './Main.module.scss';
const cx = classNames.bind(style);

const useStyles: any = makeStyles(() => ({
  root: {
    width: '10%',
    '& > .css-17vbkzs-MuiFormControl-root-MuiTextField-root': {
      marginTop: 0
    }
  },
  inputRoot: {
    background: 'var(--main-background-dropdow)',
    '&.MuiOutlinedInput-root': {
      borderRadius: '18px'
    }
  },
  input: {
    color: 'var(--btn-hover-blue-green) !important'
  },
  endAdornment: {
    '& > .MuiAutocomplete-clearIndicator': {
      display: 'none'
    },
    '& > .MuiAutocomplete-popupIndicator': {
      color: 'var(--btn-hover-blue-green)'
    }
  }
}));

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true
});

const Main: React.FC = () => {
  const classes = useStyles();
  const [currencies, setCurrencies] = useState(['']);
  const dispatch = useDispatch();
  const [totalSupply, setTotalSupply] = useState('0');

  const getCurrencies = useCallback(async () => {
    const coinGeckoCurrencies = await coinGeckoClient.simpleSupportedCurrencies();
    setCurrencies(coinGeckoCurrencies);
    dispatch(setCurrencyList(coinGeckoCurrencies));
  }, [dispatch]);

  const handleOnChangeSelectCurrency = (event: any, value: any) => {
    dispatch(setSelectedCurrency(value || 'usd'));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTotalSupply = async () => {
    const getPriceOnUsd = await coinGeckoClient.simplePrice({ ids: 'chain', vs_currencies: 'usd' });
    const param = {
      startTime: dateBeforeMonth(new Date(), 1).getTime(),
      endTime: new Date().getTime()
    };
    let tvlData = await getTVLData(param);
    const lastTvlItem = tvlData[tvlData.length - 1];
    const totalLock = new BigNumber(getPriceOnUsd.chain.usd).multipliedBy(
      new BigNumber(lastTvlItem.tvl)
    );
    setTotalSupply(format(totalLock.toFixed(4).toString()));
  };

  useEffect(() => {
    getCurrencies();
    getTotalSupply();
  }, [getCurrencies]);

  return (
    <div className={cx('text-head')}>
      <div className={cx('text-head-child')}>
        <div className={cx('price')}>${totalSupply}</div>
        <Autocomplete
          classes={classes}
          options={currencies}
          defaultValue={'usd'}
          onChange={handleOnChangeSelectCurrency}
          renderInput={(item) => <TextField {...item} margin="normal" fullWidth />}
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
