import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  openCreateProposalDialog: false,
  voteingWeight: ''
};
export const GovernanceSlice = createSlice({
    name: 'governance',
    initialState,
    reducers: {
        setOpenCreateProposalDialog: (state, action) => {
            state.openCreateProposalDialog = action.payload;
        },
        setVotingWeight: (state, action) => {
            state.voteingWeight = action.payload;
        }
    }
});
export const { setOpenCreateProposalDialog, setVotingWeight } = GovernanceSlice.actions;
const { reducer: governanceReducer } = GovernanceSlice;
export default governanceReducer;
