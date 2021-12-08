import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Balances from './components/balances/Balances';
import AreaChart from './components/chart/AreaChart';
import ConnectWalletDialog from './components/connect-wallet-dialog/ConnectWalletDialog';
import Footer from './components/footer/Footer';
import Governance from './components/governance/Governance';
import Header from './components/header/Header';
import Main from './components/main/Main';
import CustomSnackbar from './components/snackbar/Snackbar';
import './_app.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="Snackbar">
        <CustomSnackbar />
      </div>
      <Header />
      <div className="area-chart-main">
        <Switch>
          <Route exact path="/" component={Main} />
          <Route exact path="/stake" component={Balances} />
          <Route exact path="/governance" component={Governance} />
        </Switch>
      </div>
      <div className="footer">
        <Footer />
      </div>
      <ConnectWalletDialog />
    </div>
  );
};

export default App;
