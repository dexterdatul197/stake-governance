import Balances from "../components/balances/Balances";
import { Route } from 'react-router-dom';
import Governance from "../components/governance/Governance";
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
    }
}
export default routers;