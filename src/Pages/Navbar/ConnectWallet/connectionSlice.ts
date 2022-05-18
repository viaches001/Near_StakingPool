import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../app/store';
import {
  ConnectedWallet,
} from '@terra-money/wallet-provider'

export interface ConnectionState {
  wallet: ConnectedWallet | undefined;
  connected: Boolean;
  ustBalance: number | undefined;
  lunaBalance: number | undefined;
}

const initialState: ConnectionState = {
  wallet: undefined,
  connected: false,
  ustBalance: 0,
  lunaBalance: 0
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setWallet: (state, action: PayloadAction<ConnectedWallet | undefined>) => {
      state.wallet = action.payload;
    },
    setConnection: (state, action: PayloadAction<Boolean>) => {
      state.connected = action.payload;
    },
    setUstBalance: (state, action: PayloadAction<number | undefined>) => {
      state.ustBalance = action.payload;
    },
    setLunaBalance: (state, action: PayloadAction<number | undefined>) => {
      state.lunaBalance = action.payload;
    },
  },
});

export const { setWallet, setConnection, setUstBalance, setLunaBalance } = connectionSlice.actions;

export const selectWallet = (state: RootState) => state.connection.wallet;
export const selectConnected = (state: RootState) => state.connection.connected;
export const selectUstBalance = (state: RootState) => state.connection.ustBalance;
export const selectLunaBalance = (state: RootState) => state.connection.lunaBalance;
export default connectionSlice.reducer;
