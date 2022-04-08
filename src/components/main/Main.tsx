import { BigNumber } from '@0x/utils';
import { Autocomplete, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames/bind';
import { CoinGeckoClient } from 'coingecko-api-v3';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'util';
import Web3 from 'web3';
import { getCurrency, getOHCL, getTVLData } from '../../apis/apis';
import { THEME_MODE } from '../../constant/constants';
import {
  addMissingDataOHCL,
  convertDateToString, convertOHCLdata,
  currencyFormatter,
  dateBeforeMonth
} from '../../helpers/common';
import { TVLDataRes } from '../../interfaces/SFormData';
import { useAppSelector } from '../../store/hooks';
import AreaChart from '../chart/AreaChart';
import { setCurrencyList, setSelectedCurrency } from '../chart/redux/currency';
import ConnectWalletPage from '../connect-wallet-page/ConnectWalletPage';
import dark_logo from './../../assets/icon/CHN_light_logo.png';
import logo from './../../assets/icon/CHN_dark_logo.png';
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
    textTransform: 'uppercase',
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

const Main: React.FC = () => {
  const { account } = useWeb3React<Web3>();
  const classes = useStyles();
  const [currencies, setCurrencies] = useState(['']);
  const { wallet } = useAppSelector((state) => ({
    wallet: state.wallet
  }));
  const dispatch = useDispatch();
  const [totalSupply, setTotalSupply] = useState('0');
  const [tvlData, setTvlData] = useState<TVLDataRes[]>([]);
  const [ohclData, setOhclData] = useState<number[][]>([]);
  const selectedCrc = useAppSelector((state) => state.currency.selectedCurrency);
  const theme = useAppSelector((state) => state.theme.themeMode);

  const getCurrencies = useCallback(async () => {
    const coinGeckoCurrencies = await getCurrency();
    const res = coinGeckoCurrencies.data
      .filter((item: any) => {
        return (
          item.symbol === 'USD' ||
          item.symbol === 'EUR' ||
          (item.symbol === 'XCN' && item.slug === 'chain')
        );
      })
      .map((item: any) => {
        return item.symbol.toUpperCase();
      });
    setCurrencies(res);
    dispatch(setCurrencyList(res));
  }, [dispatch]);

  const handleOnChangeSelectCurrency = (event: any, value: any) => {
    dispatch(setSelectedCurrency(value ? value.toLowerCase() : 'usd'));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTotalSupply = async () => {
    const startTime = dateBeforeMonth(new Date(), 1);
    const endTime = new Date();
    const param = {
      startTime: convertDateToString(startTime),
      endTime: convertDateToString(endTime),
      convert: selectedCrc || 'usd'
    };
    const ohclHistory = await getOHCL(param);
    const paramTVL = {
      startTime: startTime.getTime(),
      endTime: endTime.getTime()
    };
    let tvlData = await getTVLData(paramTVL);
    const ohclData = convertOHCLdata(ohclHistory?.data?.quotes, selectedCrc);

    const addMissingData = addMissingDataOHCL(ohclData, startTime, endTime);
    setOhclData(addMissingData);
    setTvlData(tvlData);
    const latestOHCL = ohclData[ohclData.length - 1].price;
    const latestTVL = tvlData[tvlData.length - 1].tvl;
    const totalLock = new BigNumber(latestOHCL).multipliedBy(new BigNumber(latestTVL));
    setTotalSupply(format(totalLock.toFixed(4).toString()));
  };

  useEffect(() => {
    getTotalSupply();
  }, [selectedCrc]);

  useEffect(() => {
    getCurrencies();
  }, [getCurrencies]);

  const showIconCurrency = () => {
    if (selectedCrc === 'usd') {
      return '$'
    }
    if (selectedCrc === 'eur') {
      return '€'
    }
  }

  return (
    <div className={cx('text-head')}>
      {wallet.openConnectDialog ? (
        <ConnectWalletPage />
      ) : (
        <>
          <div className={cx('text-head-child')}>
            <div className={cx('price')}>
              {showIconCurrency()}
              {`${currencyFormatter(Number(totalSupply.replaceAll(',', '')))}`}
            </div>
            <Autocomplete
              classes={classes}
              options={currencies}
              defaultValue={'usd'}
              onChange={handleOnChangeSelectCurrency}
              renderInput={(item) => <TextField {...item} margin="normal" fullWidth />}
              popupIcon={
                <svg
                  width="20"
                  height="10"
                  viewBox="0 0 23 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.22803 1.58691L11.3367 11.6956L21.4454 1.58691"
                    stroke="#107DEF"
                    strokeWidth="2"
                  />
                </svg>
              }
              size={'small'}
              id="combo-box-demo"
            />
          </div>
          <div className={cx('securing-chain')}>Securing Chain Governance</div>
          {tvlData.length > 0 && ohclData.length > 0 ? (
            <AreaChart tvlData={tvlData} ohclData={ohclData} />
          ) : (
            <CircularProgress size={50} color="primary" className={cx('spinner')} />
          )}
        </>
      )}
    </div>
  );
};
export default Main;
