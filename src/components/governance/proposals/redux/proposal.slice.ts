import { createSlice } from '@reduxjs/toolkit';
import { getProposalList } from '../../../../apis/apis';
const initialState = {
  proposals: {
      data: [],
      metadata: {
          page: 0,
          limit: 0,
          totalItem: 0,
          totalPage: 0
      }
  }
};
export const proposalsSlice = createSlice({
    name: 'proposals',
    initialState,
    reducers: {},
    extraReducers: {
        [getProposalList.fulfilled.toString()]: (state, action) => {
            state.proposals = action.payload;
        }
    }
});
const { reducer: proposalsReducer } = proposalsSlice;
export default proposalsReducer;
