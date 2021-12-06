import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    selectedCurrency: 'usd'
}
export const currencySlide = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setSelectedCurrency: (state, action) => {
            state.selectedCurrency = action.payload
        }
    }
})
export const { setSelectedCurrency } = currencySlide.actions;
const { reducer: currencyReducer } = currencySlide;
export default currencyReducer;