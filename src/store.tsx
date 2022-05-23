import React, { createContext, useContext, useReducer } from 'react'
import { floor, floorNormalize } from './Util'
import { amountHistory, aprHistory, userInfo, farmInfo, potInfo, coins, uCoinBalance, coinPrice } from './constants'
import NearWalletSelector from "@near-wallet-selector/core";

export type COINTYPE = 'usdc' | 'usdt' | 'dai' | 'usn' | 'wbtc' | 'eth' | 'wnear' | 'neart';

interface Action {
  type: ActionKind;
  payload: any;
}

export interface AppContextInterface {
  loading: boolean,
  net: "mainnet" | "testnet",
  uCoinBalance: any,
  tab: "dashboard" | "mypage" | "earn" | "utility",
  openDepositModal: (() => void) | undefined,
  openWithdrawModal: (() => void) | undefined,
  openWaitingModal: (() => void) | undefined,
  closeWaitingModal: (() => void) | undefined,
  openFailedTxModal: (() => void) | undefined,
  closeFailedTxModal: (() => void) | undefined,
  coinType: COINTYPE,
  isPending: boolean,
  amountHistory: any[],
  aprHistory: any,
  coinPrice: any,
  userInfoCoin: any,
  farmPrice: number,
  farmInfo: any,
  farmStartTime: number,
  coin_total_rewards: any,
  txhash: string | undefined,
  qualified: boolean,
  potInfo: any,
  connectedNear: Boolean,
  nearSelector: NearWalletSelector | undefined,
}

const initialState: AppContextInterface = {
  loading: false,
  net: "testnet",
  uCoinBalance: uCoinBalance,
  tab: 'dashboard',
  openDepositModal: undefined,
  openWithdrawModal: undefined,
  openWaitingModal: undefined,
  closeWaitingModal: undefined,
  openFailedTxModal: undefined,
  closeFailedTxModal: undefined,
  coinType: 'usdc',
  isPending: false,
  amountHistory: amountHistory,
  aprHistory: aprHistory,
  coinPrice: coinPrice,
  userInfoCoin: userInfo,
  farmPrice: 25,
  farmInfo: farmInfo,
  farmStartTime: Date.now()/1000,
  coin_total_rewards: {},
  txhash: undefined,
  qualified: false,
  potInfo: potInfo,
  connectedNear: false,
  nearSelector: undefined,
}

export enum ActionKind{
  setLoading,
  setNet,
  setPoolAddr,
  setUCoinBalance,
  setTab,
  setOpenDepositModal,
  setOpenWithdrawModal,
  setOpenWaitingModal,
  setCloseWaitingModal,
  setOpenTxFailedModal,
  setCloseTxFailedModal,
  setCoinType,
  setIsPending,
  setAmountHistory,
  setAprHistory,
  setCoinPrice,
  setUserInfoCoin,
  setFarmPrice,
  setFarmInfo,
  setFarmStartTime,
  setCoinTotalRewards,
  setTxhash,
  setQualified,
  setPotInfo,
  setConnectedNear,
  setNearSelector,
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
    case ActionKind.setUCoinBalance:
      return { ...state, uCoinBalance: { ...state.uCoinBalance, [action.payload.type]: action.payload.data } }
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
    case ActionKind.setOpenTxFailedModal:
      return { ...state, openFailedTxModal: action.payload}
    case ActionKind.setCloseTxFailedModal:
      return { ...state, closeFailedTxModal: action.payload}         
    case ActionKind.setCoinType:
      return { ...state, coinType: action.payload}
    case ActionKind.setIsPending:
      return {...state, isPending: action.payload}
    case ActionKind.setAmountHistory:
      return {...state, amountHistory: action.payload }
    case ActionKind.setAprHistory:
      return {...state, aprHistory: { ...state.aprHistory, [action.payload.type]: action.payload.data }}
    case ActionKind.setCoinPrice:
      return {...state, coinPrice: { ...state.coinPrice, [action.payload.type]: action.payload.data}}
    case ActionKind.setUserInfoCoin:
      return {...state, userInfoCoin: { ...state.userInfoCoin, [action.payload.type]: action.payload.data}}
    case ActionKind.setFarmPrice:
      return {...state, farmPrice: action.payload}
    case ActionKind.setFarmInfo:
      return {...state, farmInfo: action.payload}
    case ActionKind.setFarmStartTime:
      return {...state, farmStartTime: action.payload}
    case ActionKind.setCoinTotalRewards:
      return {...state, coin_total_rewards: { ...state.coin_total_rewards, [action.payload.type]: action.payload.data}}
    case ActionKind.setTxhash:
      return {...state, txhash: action.payload}
    case ActionKind.setQualified:
      return {...state, qualified: action.payload}
    case ActionKind.setPotInfo:
      return {...state, potInfo: action.payload}
    case ActionKind.setConnectedNear:
      return {...state, connectedNear: action.payload}
    case ActionKind.setNearSelector:
      return {...state, nearSelector: action.payload}
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

export const useNearSelector = () => {
  const {state, dispatch} = useStore();
  return state.nearSelector;
}

export const useNearAPIURL = () => {
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

export const useCoinBalance = () => {
  const {state, dispatch} = useStore();
  let results:any = {};
  coins.forEach(coin => {
    let balance = state.uCoinBalance[coin.name];
    results[coin.name] = balance;
  })

  return results;
}

export const useCoinDeposited = () => {
  const {state, dispatch} = useStore();
  let results:any = {};
  coins.forEach(coin => {
    let balance = state.userInfoCoin[coin.name].amount;
    results[coin.name] = floorNormalize(balance);
  })

  return results;
}

export const useCoinApr = () => {
  const {state, dispatch} = useStore();
  const apr: any = {};
  coins.forEach(coin => {
    const data = state.aprHistory[coin.name];
    const last = data? data.length - 1: -1;
    apr[coin.name] = last >= 0? parseInt(data[last].apr) / 10 ** 6: 0;
  })
  
  return apr;
}

export const useExchangeRate = () => {
  const {state, dispatch} = useStore();
  return state.coinPrice;
}

export const useConnectedCoin = () => {
  const {state} = useStore();
  const res: any = {};

  coins.forEach(coin => {
    res[coin.name] = (state as any)[`connected${coin.system}`];
  })
  return res;
}

export const useConnectWallet = () => {
  const {state, dispatch} = useStore();
  const nearSelector = useNearSelector();
  return () => {
    nearSelector?.show();
  }
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

