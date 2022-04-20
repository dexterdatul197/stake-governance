import { useWeb3React } from '@web3-react/core';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { BaseSocket } from 'src/socket/BaseSocket';
import Web3 from 'web3';
import Balances from './components/balances/Balances';
import Footer from './components/footer/Footer';
import CreateProposal from './components/governance/dialog/create-proposal/CreateProposal';
import Governance from './components/governance/Governance';
import LeaderBoard from './components/governance/leaderboard/LeaderBoard';
import LeaderBoardDetail from './components/governance/leaderBoardDetail';
import ProposalDetail from './components/governance/proposals/proposal-detail/ProposalDetail';
import Header from './components/header/Header';
import Main from './components/main/Main';
import CustomSnackbar from './components/snackbar/Snackbar';
import { walletconnect } from './connectors/walletconnectConnector';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { useInitial } from './hooks/useInitial';
import useIsMobile from './hooks/useMobile';
import { useAppDispatch } from './store/hooks';
import { setTheme } from './store/theme';
import './_app.scss';

const App: React.FC = () => {
  const context = useWeb3React<Web3>();
  const { connector, activate } = context;
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>();
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(844);
  const infoConnectWallet = localStorage.getItem('walletconnect');
  document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
  dispatch(setTheme(localStorage.getItem('theme') || 'light'));

  useEffect(() => {
    BaseSocket.getInstance().connect();
  }, []);

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);
  // const triedEager = useEagerConnect();

  // React.useEffect(() => {
  //   window.addEventListener('load', () => {
  //     activate(walletconnect, undefined, false);
  //   });
  // }, []);
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);
  // useInactiveListener(!triedEager || !!activatingConnector);
  useInitial();

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
          <Route exact path="/governance/leaderboard" component={LeaderBoard} />
          <Route
            exact
            path="/governance/leaderboard/leaderboard-detail/:address"
            component={LeaderBoardDetail}
          />
          <Route exact path="/proposal/:proposalId" component={ProposalDetail} />
        </Switch>
      </div>
      <div className="footer">
        <Footer />
      </div>
      <CreateProposal />
    </div>
  );
};

export default App;
