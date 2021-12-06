import { WalletData } from './../../../interfaces/WalletData';
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState: WalletData = {
    openConnectDialog: false,
    bsc: '',
    ethereumAddress: '',
    trust: '',
    coinbase: '',
    walletconnect: ''
}
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
})
export const { setOpenConnectDialog, setEthereumAddress, setTrustAddress, setCoinbaseAddress } = walletSlice.actions;
const { reducer: walletReducer } = walletSlice;
export default walletReducer;