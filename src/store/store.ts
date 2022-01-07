import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from '../components/chart/redux/currency';
import walletReducer from '../components/connect-wallet/redux/wallet';
import proposalsReducer from '../components/governance/proposals/redux/proposal.slice';
import governanceReducer from '../components/governance/redux/Governance';
import snackbarReducer from './snackbar';
import themeReducer from './theme';
const store = configureStore({
  reducer: {
    wallet: walletReducer,
    snackbar: snackbarReducer,
    currency: currencyReducer,
    theme: themeReducer,
    governance: governanceReducer,
    proposals: proposalsReducer
  }
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
