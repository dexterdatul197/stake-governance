import { MenuItem, Select } from '@material-ui/core';
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

const coinGeckoClient = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});
const App: React.FC = () => {
  const wallet = useAppSelector((state) => state.wallet);
  const [currencies, setCurrencies] = useState(['']);
  const dispatch = useDispatch();

  const getCurrencies = async() => {
    const coinGeckoCurrencies = await coinGeckoClient.simpleSupportedCurrencies();
    setCurrencies(coinGeckoCurrencies);
  }

  const handleOnChangeSelectCurrency = (event: any) => {
    dispatch(setSelectedCurrency(event.target.value));
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
            <span>$278,471,325</span>
            <Select onChange={handleOnChangeSelectCurrency} className={'mui-select'}>
              {currencies.map((item, key) => {
                return <MenuItem value={item} className={'menu-item-ui'} key={key}><div className={'menu-item'}>{item}</div></MenuItem>
              })}
            </Select>
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
