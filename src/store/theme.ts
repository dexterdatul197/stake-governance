import { createSlice } from '@reduxjs/toolkit';
import { THEME_MODE } from './../constant/constants';
const initialState: any = {
    themeMode: THEME_MODE.LIGHT
};
export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            document.documentElement.setAttribute('data-theme', action.payload);
            state.themeMode = action.payload;
        }
    }
});
export const { setTheme } = themeSlice.actions;

const { reducer: themeReducer } = themeSlice;

export default themeReducer;