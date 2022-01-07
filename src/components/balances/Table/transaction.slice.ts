import { createSlice } from '@reduxjs/toolkit';
import { getTransactionHistory } from 'src/apis/apis';

export interface ITransaction {
  address: string;
  amount: string;
  block_hash: string;
  created_at: string;
  id: number;
  tx_hash: string;
  type: number;
  updated_at: string;
}

const initialState = {
  transactions: {
    data: [],
    metadata: {
      page: 0,
      limit: 0,
      totalItem: 0,
      totalPage: 0
    }
  }
};

export const transactionHistorySlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: {
    [getTransactionHistory.fulfilled.toString()]: (state, action) => {
      state.transactions = action.payload;
    }
  }
});

const { reducer: transactionReducer } = transactionHistorySlice;
export default transactionReducer;
