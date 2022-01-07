import React from 'react';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { Route, Switch } from 'react-router-dom';
import Balances from './components/balances/Balances';
import ConnectWalletDialog from './components/connect-wallet-dialog/ConnectWalletDialog';
import Footer from './components/footer/Footer';
import CreateProposal from './components/governance/dialog/create-proposal/CreateProposal';
import Governance from './components/governance/Governance';
import ProposalDetail from './components/governance/proposals/proposal-detail/ProposalDetail';
import Header from './components/header/Header';
import Main from './components/main/Main';
import CustomSnackbar from './components/snackbar/Snackbar';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';

import './_app.scss';

const App: React.FC = () => {
  const context = useWeb3React<Web3>();
  const { connector } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

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
          <Route exact path="/proposal/:proposalId" component={ProposalDetail} />
        </Switch>
      </div>
      <div className="footer">
        <Footer />
      </div>
      <ConnectWalletDialog />
      <CreateProposal />
    </div>
  );
};

export default App;
