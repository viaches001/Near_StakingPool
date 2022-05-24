import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../app/store';
import {
  ConnectedWallet,
} from '@terra-money/wallet-provider'

export interface ConnectionState {
  wallet: ConnectedWallet | undefined;
  connected: Boolean;
}

const initialState: ConnectionState = {
  wallet: undefined,
  connected: false
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
  },
});

export const { setWallet, setConnection } = connectionSlice.actions;

export const selectWallet = (state: RootState) => state.connection.wallet;
export const selectConnected = (state: RootState) => state.connection.connected;
export default connectionSlice.reducer;
