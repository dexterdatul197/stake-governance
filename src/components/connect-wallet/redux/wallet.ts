import { WalletData } from './../../../interfaces/WalletData';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Web3 from 'web3';

const ethereumAddress = localStorage.getItem('ethereumAddress') || '';

export const wallets = ['METAMASK', 'WALLET_CONNECT', 'TRUST', 'COINBASE'];

const initialState: WalletData = {
  openConnectDialog: false,
  bsc: '',
  ethereumAddress: Web3.utils.isAddress(ethereumAddress) ? ethereumAddress : '',
  walletName: ''
};
export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setOpenConnectDialog: (state, action: PayloadAction<boolean>) => {
      state.openConnectDialog = action.payload;
    },
    setEthereumAddress: (state, action) => {
      localStorage.setItem('ethereumAddress', JSON.stringify(action.payload));
      return {
        ...state,
        ethereumAddress: action.payload
      };
    },
    setWalletName: (state, action) => {
      return {
        ...state,
        walletName: action.payload
      };
    }
  }
});
export const { setOpenConnectDialog, setEthereumAddress, setWalletName } = walletSlice.actions;
const { reducer: walletReducer } = walletSlice;
export default walletReducer;
