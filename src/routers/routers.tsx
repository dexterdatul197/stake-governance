import { Route } from 'react-router-dom';
import Balances from '../components/balances/Balances';
import Governance from '../components/governance/Governance';
import LeaderBoard from '../components/governance/leaderboard/LeaderBoard';
import ProposalDetail from '../components/governance/proposals/proposal-detail/ProposalDetail';
import LeaderBoardDetail from '../components/governance/leaderBoardDetail';
const routers = {
  stake: {
    exact: true,
    path: '/stake',
    component: Balances,
    route: Route
  },
  governance: {
    exact: true,
    path: '/governance',
    component: Governance,
    route: Route
  },
  proposalDetail: {
    exact: true,
    path: '/proposal/:proposalId',
    component: ProposalDetail,
    route: Route
  },
  leaderBoard: {
    exact: true,
    path: '/governance/leaderboard',
    component: LeaderBoard,
    route: Route
  },
  LeaderBoardDetail: {
    exact: true,
    path: '/governance/leaderboard/leaderboard-detail',
    component: LeaderBoardDetail,
    route: Route
  }
};
export default routers;
