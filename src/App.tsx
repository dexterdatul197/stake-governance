import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { BaseSocket } from "src/socket/BaseSocket";
import Balances from "./components/balances/Balances";
import ConnectWalletDialog from "./components/connect-wallet-dialog/ConnectWalletDialog";
import Footer from "./components/footer/Footer";
import CreateProposal from "./components/governance/dialog/create-proposal/CreateProposal";
import Governance from "./components/governance/Governance";
import ProposalDetail from "./components/governance/proposals/proposal-detail/ProposalDetail";
import Header from "./components/header/Header";
import Main from "./components/main/Main";
import CustomSnackbar from "./components/snackbar/Snackbar";
import "./_app.scss";

const App: React.FC = () => {
  useEffect(() => {
    BaseSocket.getInstance().connect();
  }, []);
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
          <Route
            exact
            path="/proposal/:proposalId"
            component={ProposalDetail}
          />
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
