import { WalletData } from './../../../interfaces/WalletData';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Web3 from 'web3';

const ethereumAddress = localStorage.getItem('ethereumAddress') || '';

const initialState: WalletData = {
  openConnectDialog: false,
  bsc: '',
  trust: '',
  coinbase: '',
  walletconnect: '',
  ethereumAddress: Web3.utils.isAddress(ethereumAddress) ? ethereumAddress : ''
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setOpenConnectDialog: (state, action: PayloadAction<boolean>) => {
      state.openConnectDialog = action.payload;
    },
    setEthereumAddress: (state, action) => {
      state.ethereumAddress = action.payload;
    },
    setTrustAddress: (state, action) => {
      state.trust = action.payload;
    },
    setCoinbaseAddress: (state, action) => {
      state.coinbase = action.payload;
    }
  }
});
export const { setOpenConnectDialog, setEthereumAddress, setTrustAddress, setCoinbaseAddress } =
  walletSlice.actions;
const { reducer: walletReducer } = walletSlice;
export default walletReducer;
