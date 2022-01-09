import { BigNumber } from '@0x/utils';
import { Autocomplete, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames/bind';
import { CoinGeckoClient } from 'coingecko-api-v3';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import { getTVLData } from '../../apis/apis';
import { convertOHCL, dateBeforeMonth, format } from '../../helpers/common';
import { TVLDataRes } from '../../interfaces/SFormData';
import { useAppSelector } from '../../store/hooks';
import AreaChart from '../chart/AreaChart';
import { setCurrencyList, setSelectedCurrency } from '../chart/redux/currency';
import ConnectWalletPage from '../connect-wallet-page/ConnectWalletPage';
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

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true
});

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

  const getCurrencies = useCallback(async () => {
    const coinGeckoCurrencies = await coinGeckoClient.simpleSupportedCurrencies();
    setCurrencies(coinGeckoCurrencies);
    dispatch(setCurrencyList(coinGeckoCurrencies));
  }, [dispatch]);

  const handleOnChangeSelectCurrency = (event: any, value: any) => {
    dispatch(setSelectedCurrency(value || 'usd'));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTotalSupply = async (ohcl: any) => {
    const res = convertOHCL(ohcl);
    const latestOhcl = res[res.length - 1];

    const param = {
      startTime: dateBeforeMonth(new Date(), 1).getTime(),
      endTime: new Date().getTime()
    };
    let tvlData = await getTVLData(param);
    setTvlData(tvlData);
    const lastTvlItem = tvlData[tvlData.length - 1];
    const totalLock = new BigNumber(latestOhcl[1]).multipliedBy(new BigNumber(lastTvlItem.tvl));
    setTotalSupply(format(totalLock.toFixed(4).toString()));
  };

  const getCoinGecko = async () => {
    const getOHCL = await coinGeckoClient.coinIdOHLC({
      id: 'chain',
      vs_currency: `${selectedCrc}`,
      days: 30
    });
    getTotalSupply(getOHCL);
    setOhclData(getOHCL);
  };

  useEffect(() => {
    getCoinGecko();
  }, [selectedCrc]);

  useEffect(() => {
    getCurrencies();
  }, [getCurrencies]);

  return (
    <div className={cx('text-head')}>
      {wallet.openConnectDialog ? (
        <ConnectWalletPage />
      ) : (
        <>
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
          {tvlData.length > 0 && ohclData.length > 0 ? (
            <AreaChart tvlData={tvlData} ohclData={ohclData} />
          ) : (
            <CircularProgress
              size={50}
              color="primary"
              sx={{
                position: 'absolute',
                top: '50%'
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
export default Main;
