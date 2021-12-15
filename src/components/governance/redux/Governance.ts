import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  openCreateProposalDialog: false,
};
export const GovernanceSlice = createSlice({
    name: 'governance',
    initialState,
    reducers: {
        setOpenCreateProposalDialog: (state, action) => {
            state.openCreateProposalDialog = action.payload;
        }
    }
});
export const { setOpenCreateProposalDialog } = GovernanceSlice.actions;
const { reducer: governanceReducer } = GovernanceSlice;
export default governanceReducer;
