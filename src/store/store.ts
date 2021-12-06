import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from '../components/chart/redux/currency';
import walletReducer from '../components/connect-wallet/redux/wallet';
import snackbarReducer from './snackbar';
const store = configureStore({
    reducer: {
        wallet: walletReducer,
        snackbar: snackbarReducer,
        currency: currencyReducer,
    }
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;