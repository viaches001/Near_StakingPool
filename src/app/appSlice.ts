import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from './store';

export type tabStatus = 'dashboard' | 'mypage' | 'earn' | 'utility';
export type depositTabStatus = 'all' | 'stable' | 'volatile';
export interface State {
  tab: tabStatus,
  depositTab: depositTabStatus,
}

const initialState: State = {
  tab: 'dashboard',
  depositTab: 'all',
};

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setTabStatus: (state, action: PayloadAction<tabStatus>) => {
      state.tab = action.payload;
    },
    setDepositTabStatus: (state, action: PayloadAction<depositTabStatus>) => {
      state.depositTab = action.payload;
    },
  },
});

export const { setTabStatus } = appSlice.actions;

export const selectApp = (state: RootState) => state.app;
export const selectTab = (state: RootState) => state.app.tab;
export const selectDepositTab = (state: RootState) => state.app.depositTab;

export default appSlice.reducer;
