import { MenuItem, Select } from '@material-ui/core';
import React from 'react';
import Balances from './components/balances/Balances';
import AreaChart from './components/chart/AreaChart';
import ConnectWalletDialog from './components/connect-wallet-dialog/ConnectWalletDialog';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import History from './components/history/History';
import CustomSnackbar from './components/snackbar/Snackbar';
import { isConnected } from './helpers/connectWallet';
import { useAppSelector } from './store/hooks';
import './_app.scss';

const App: React.FC = () => {
  const wallet = useAppSelector((state) => state.wallet);
  return (
    <div className="App">
      <div className="Snackbar">
        <CustomSnackbar />
      </div>
      <Header name="hung" />
      <div className="area-chart-main">
        {isConnected(wallet) ? (<div><Balances /> <History /></div>) : 
        <div>
          <div className={'text-head'}>
            <span>$278,471,325</span>
            <Select>
              <MenuItem value={'USD'}>USD</MenuItem>
              <MenuItem value={'USDT'}>USDT</MenuItem>
              <MenuItem value={'USDC'}>USDC</MenuItem>
              <MenuItem value={'USDC'}>CHN</MenuItem>
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
