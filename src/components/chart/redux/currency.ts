import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  selectedCurrency: 'usd',
  currenciesList: []
};
export const currencySlide = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setSelectedCurrency: (state, action) => {
      state.selectedCurrency = action.payload;
    },
    setCurrencyList: (state, action) => {
      state.currenciesList = action.payload;
    }
  }
});
export const { setSelectedCurrency, setCurrencyList } = currencySlide.actions;
const { reducer: currencyReducer } = currencySlide;
export default currencyReducer;
