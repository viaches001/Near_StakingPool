import React, { createContext, useContext, useReducer } from 'react'
import { ConnectedWallet } from '@terra-money/wallet-provider'
import { LCDClient } from '@terra-money/terra.js'

import { floor, floorNormalize } from './Util'
import { amountHistory, aprUstHistory, aprLunaHistory, userInfo, farmInfo, potInfo } from './constants'

export type COINTYPE = 'usdc' | 'usdt' | 'dai' | 'usn' | 'wbtc' | 'eth' | 'wnear';

interface Action {
  type: ActionKind;
  payload: any;
}

export interface AppContextInterface {
  loading: boolean,
  net: "mainnet" | "testnet",
  connected: Boolean,
  lcd: LCDClient,
  wallet: ConnectedWallet | undefined,
  uusdBalance: number,
  ulunaBalance: number,
  tab: "dashboard" | "mypage" | "earn" | "utility",
  openDepositModal: (() => void) | undefined,
  openWithdrawModal: (() => void) | undefined,
  openWaitingModal: (() => void) | undefined,
  closeWaitingModal: (() => void) | undefined,
  coinType: COINTYPE,
  isPending: boolean,
  amountHistory: any[],
  aprUstHistory: any,
  aprLunaHistory: any,
  ustPrice: number,
  lunaPrice: number,
  userInfoUst: any,
  userInfoLuna: any,
  farmPrice: number,
  farmInfo: any,
  farmStartTime: number,
  ust_total_rewards: number,
  luna_total_rewards: number,
  txhash: string | undefined,
  qualified: boolean,
  potInfo: any,
}

const initialState: AppContextInterface = {
  loading: false,
  net: "testnet",
  connected: false,
  lcd: new LCDClient({ //
    URL: 'https://lcd.terra.dev',
    chainID: 'columbus-5',
    gasPrices: { uusd: 0.45 },
  }),
  wallet: undefined,
  uusdBalance: 0,
  ulunaBalance: 0,
  tab: 'dashboard',
  openDepositModal: undefined,
  openWithdrawModal: undefined,
  openWaitingModal: undefined,
  closeWaitingModal: undefined,
  coinType: 'usdc',
  isPending: false,
  amountHistory: amountHistory,
  aprUstHistory: aprUstHistory,
  aprLunaHistory: aprLunaHistory,
  ustPrice: 1,
  lunaPrice: 100,
  userInfoUst: userInfo,
  userInfoLuna: userInfo,
  farmPrice: 25,
  farmInfo: farmInfo,
  farmStartTime: Date.now()/1000,
  ust_total_rewards: 0,
  luna_total_rewards: 0,
  txhash: undefined,
  qualified: false,
  potInfo: potInfo,
}

export enum ActionKind{
  setLoading,
  setNet,
  setPoolAddr,
  setLcd,
  setConnected,
  setWallet,
  setUusdBalance,
  setUlunaBalance,
  setTab,
  setOpenDepositModal,
  setOpenWithdrawModal,
  setOpenWaitingModal,
  setCloseWaitingModal,
  setCoinType,
  setIsPending,
  setAmountHistory,
  setAprUstHistory,
  setAprLunaHistory,
  setUstPrice,
  setLunaPrice,
  setUserInfoUst,
  setUserInfoLuna,
  setFarmPrice,
  setFarmInfo,
  setFarmStartTime,
  setUstTotalRewards,
  setLunaTotalRewards,
  setTxhash,
  setQualified,
  setPotInfo
}

const StoreContext = createContext<{ state: AppContextInterface; dispatch: React.Dispatch<any>; }>
({
  state: initialState,
  dispatch: () => null
});

export const reducer = (state: AppContextInterface,  action: Action ) => {
  switch (action.type) {
    case ActionKind.setLoading:
      return { ...state, loading: action.payload}
    case ActionKind.setNet:
      return { ...state, net: action.payload}
    case ActionKind.setConnected:
      return { ...state, connected: action.payload }
    case ActionKind.setLcd:
      return { ...state, lcd: action.payload }
    case ActionKind.setWallet:
      return { ...state, wallet: action.payload }
    case ActionKind.setUusdBalance:
      return { ...state, uusdBalance: action.payload }
    case ActionKind.setUlunaBalance:
      return { ...state, ulunaBalance: action.payload }
    case ActionKind.setTab:
      return { ...state, tab: action.payload }
    case ActionKind.setOpenDepositModal:
      return { ...state, openDepositModal: action.payload}
    case ActionKind.setOpenWithdrawModal:
      return { ...state, openWithdrawModal: action.payload}
    case ActionKind.setOpenWaitingModal:
      return { ...state, openWaitingModal: action.payload}
    case ActionKind.setCloseWaitingModal:
      return { ...state, closeWaitingModal: action.payload}      
    case ActionKind.setCoinType:
      return { ...state, coinType: action.payload}
    case ActionKind.setIsPending:
      return {...state, isPending: action.payload}
    case ActionKind.setAmountHistory:
      return {...state, amountHistory: action.payload }
    case ActionKind.setAprUstHistory:
      return {...state, aprUstHistory: action.payload}
    case ActionKind.setAprLunaHistory:
      return {...state, aprLunaHistory: action.payload}
    case ActionKind.setUstPrice:
      return {...state, ustPrice: action.payload}
    case ActionKind.setLunaPrice:
      return {...state, lunaPrice: action.payload}
    case ActionKind.setUserInfoUst:
      return {...state, userInfoUst: action.payload}
    case ActionKind.setUserInfoLuna:
      return {...state, userInfoLuna: action.payload}
    case ActionKind.setFarmPrice:
      return {...state, farmPrice: action.payload}
    case ActionKind.setFarmInfo:
      return {...state, farmInfo: action.payload}
    case ActionKind.setFarmStartTime:
      return {...state, farmStartTime: action.payload}
    case ActionKind.setUstTotalRewards:
      return {...state, ust_total_rewards: action.payload}
    case ActionKind.setLunaTotalRewards:
      return {...state, luna_total_rewards: action.payload}
    case ActionKind.setTxhash:
      return {...state, txhash: action.payload}
    case ActionKind.setQualified:
      return {...state, qualified: action.payload}
    case ActionKind.setPotInfo:
      return {...state, potInfo: action.payload}
    default:
      return state
  }
}

export const StoreProvider: React.FC = ({ children}) => 
{
  const [state, dispatch] = useReducer(reducer, initialState)

  // useEffect(()=>{
  //   let net = window.localStorage.getItem('net') || "mainnet";
  //   if( net == "testnet" ){
  //     Set2Testnet(state, dispatch);
  //   }
  //   else{
  //     Set2Mainnet(state, dispatch);
  //   }
  // }, []);

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
export const useWallet = () => {
  const {state, dispatch} = useStore();
  return state.wallet;
}
export const useLCD = () => {
  const {state, dispatch} = useStore();
  return state.lcd;
}

export const useTerraAPIURL = () => {
  const {state, dispatch} = useStore();

  let baseURL: string;
  if(state.net == 'mainnet')
    baseURL =  "https://api.terra.dev";
  else
    baseURL = "https://bombay-api.terra.dev";

  return baseURL;
}

export const useNetworkName = () => {
  const {state, dispatch} = useStore();
  return state.net;
}

export const useUSTBalance = () => {
  const {state, dispatch} = useStore();
  let balance = state.uusdBalance;
  return floorNormalize(balance);
}

export const useLUNABalance = () => {
  const {state, dispatch} = useStore();
  let balance = state.ulunaBalance;
  return floorNormalize(balance);
}

export const useUSTDeposited = () => {
  const {state, dispatch} = useStore();
  let balance = state.userInfoUst.amount;
  return floorNormalize(balance);
}

export const useLUNADeposited = () => {
  const {state, dispatch} = useStore();
  let balance = state.userInfoLuna.amount;
  return floorNormalize(balance);
}

export const useUSTApr = () => {
  const {state, dispatch} = useStore();
  const data = state.aprUstHistory;
  const last = data.length - 1;
  const apr = parseInt(data[last].apr) / 100;
  return apr;
}

export const useLUNAApr = () => {
  const {state, dispatch} = useStore();
  const data = state.aprLunaHistory;
  const last = data.length - 1;
  const apr = parseInt(data[last].apr) / 100;
  return apr;
}

export const useExchangeRate = () => {
  const {state, dispatch} = useStore();
  return state.lunaPrice/state.ustPrice;
}

export const OpenDepositModal = (state:AppContextInterface , dispatch: React.Dispatch<any>, type: COINTYPE) => {
  dispatch({type: ActionKind.setCoinType, payload: type});

  if(state.openDepositModal != undefined)
    state.openDepositModal()
}

export const OpenWithdrawModal = (state:AppContextInterface , dispatch: React.Dispatch<any>, type: COINTYPE) => 
{
  dispatch({type: ActionKind.setCoinType, payload: type});

  if(state.openWithdrawModal != undefined)
    state.openWithdrawModal()
}

// const baseURL = "https://api.coingecko.com/api/v3/";

// export const useUstPrice = () => { 
//   const fetch = useCallback(
//     async () =>{
//       const res = await axios.get(
//          `simple/price?ids=terrausd&vs_currencies=usd`,
//          { baseURL }
//        );
//      return res;
//     },
//     []
//   )
//   const {data, isFetched} =  useQuery(
//     "terrausd",
//     fetch,
//     { staleTime: Infinity, retry: false }
//   )
//   if(isFetched)
//     return parseFloat(data?.data.terrausd.usd);
//   return 1;
// }

// export const useLunaPrice = () => { 
//   const fetch = useCallback(
//     async () =>{
//       const res = await axios.get(
//          `simple/price?ids=terra-luna&vs_currencies=usd`,
//          { baseURL }
//        );
//      return res;
//     },
//     []
//   )
//   const {data, isFetched} =  useQuery(
//     "terraluna",
//     fetch,
//     { staleTime: Infinity, retry: false }
//   )
//   if(isFetched)
//     return parseFloat(data?.data["terra-luna"].usd);

//   return 109;
// }

