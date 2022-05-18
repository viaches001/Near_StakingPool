import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import counterReducer from '../features/counter/counterSlice';
import connectReducer from '../Pages/Navbar/ConnectWallet/connectionSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    connection: connectReducer,

    counter: counterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
