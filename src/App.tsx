import { Autocomplete, MenuItem, Select, TextField } from '@material-ui/core';
import { makeStyles } from "@material-ui/styles";
import { CoinGeckoClient } from 'coingecko-api-v3';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Balances from './components/balances/Balances';
import AreaChart from './components/chart/AreaChart';
import { setSelectedCurrency } from './components/chart/redux/currency';
import ConnectWalletDialog from './components/connect-wallet-dialog/ConnectWalletDialog';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import History from './components/history/History';
import CustomSnackbar from './components/snackbar/Snackbar';
import { isConnected } from './helpers/connectWallet';
import { useAppSelector } from './store/hooks';
import './_app.scss';

const useStyles: any = makeStyles(() => ({
  root: {
    "& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)": {
      // Default transform is "translate(14px, 20px) scale(1)""
      // This lines up the label with the initial cursor position in the input
      // after changing its padding-left.
      transform: "translate(34px, 20px) scale(1);"
    }
  },
  inputRoot: {
    color: "purple",
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    ".MuiAutocomplete-root": {
      heght: "2em",
      width: "10%"
    },
    "&.MuiOutlinedInput-root": {
      borderRadius: "18px"
    },
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      paddingLeft: 26,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "green"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple"
    }
  }
}));

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});
const App: React.FC = () => {
  const classes = useStyles();
  const wallet = useAppSelector((state) => state.wallet);
  const [currencies, setCurrencies] = useState(['']);
  const dispatch = useDispatch();

  const getCurrencies = async() => {
    const coinGeckoCurrencies = await coinGeckoClient.simpleSupportedCurrencies();
    setCurrencies(coinGeckoCurrencies);
  }

  const handleOnChangeSelectCurrency = (event: any, value: any) => {
    dispatch(setSelectedCurrency(value|| 'usd'));
  }

  useEffect(() => {
    getCurrencies();
  }, []);

  return (
    <div className="App">
      <div className="Snackbar">
        <CustomSnackbar />
      </div>
      <Header />
      <div className="area-chart-main">
        {isConnected(wallet) ? (<div><Balances /> <History /></div>) : 
        <div>
          <div className={'text-head'}>
            <div className={'text-head-child'}>
              <div className={'price'}>$278,471,325</div>
              <Autocomplete 
                classes={classes}
                options={currencies} 
                onChange={handleOnChangeSelectCurrency}
                renderInput={(item) => 
                <TextField
                  {...item}
                  margin="normal"
                  fullWidth
                  className={'menu-item'}
                />}
                size={'small'}
                id="combo-box-demo"
              />
            </div>
            <div className={'securing-chain'}>Securing chain governance</div>
          </div>
          <AreaChart />
        </div>}
      </div>
      <div className="footer">
        <Footer />
      </div>
      <ConnectWalletDialog />
    </div>
  );
};

export default App;
