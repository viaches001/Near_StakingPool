import { AppContextInterface, ActionKind } from './store'
import { toast } from 'react-toastify';
import axios from 'axios';
import { successOption, errorOption, coins, POOL } from './constants';
import NearWalletSelector from "@near-wallet-selector/core";
import { providers, utils } from "near-api-js";
import { CodeResult } from "near-api-js/lib/providers/provider";

export function shortenAddress(address: string | undefined) {
  if (address) {
    let prefix = address.slice(0, 5);
    let suffix = address.slice(-5)
    return prefix + "..." + suffix;
  }
  return "";
}

function calcUSD(amountHistory: any, prices: any) {
  if (amountHistory == undefined) return undefined;

  for (let i = 0; i < amountHistory.length; i++) {
    amountHistory[i].totalUSD = 0;
    coins.forEach(coin => {
      amountHistory[i][coin.name + '_amount'] = floorNormalize(amountHistory[i][coin.name + '_amount']) + floorNormalize(amountHistory[i][coin.name + '_reward']);
      if(amountHistory[i][coin.name + '_amount'] && prices[coin.name])
        amountHistory[i].totalUSD += amountHistory[i][coin.name + '_amount'] * prices[coin.name];
    })
  }

  return amountHistory;
}
export async function fetchData(state: AppContextInterface, dispatch: React.Dispatch<any>) {
  const selector = state.nearSelector;
  if(!selector) return;

  dispatch({ type: ActionKind.setLoading, payload: true });

  const { nodeUrl } = selector.network;
  const provider = new providers.JsonRpcProvider({ url: nodeUrl });

  let amountHistory = undefined,
    aprHistory:any = undefined,
    coinInfo: any = undefined,
    userInfoCoin:any = undefined,
    farmPrice = undefined,
    farmInfo = undefined,
    portInfo = undefined,
    farmStartTime = undefined,
    status: any = undefined

  coinInfo = {};
  try {
    for(let coin of coins)
    {
      const instance = axios.create({
        baseURL: `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${coin.id}`
      });
      instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      const res = await instance.get('');
      coinInfo[coin.name] = res.data[coin.id].usd;
    }
  } catch (e) { }
  
  const rates:any = {};
  coins.forEach(coin => {
    rates[coin.name] = coinInfo[coin.name] ? coinInfo[coin.name] : state.coinPrice[coin.name];
    dispatch({ type: ActionKind.setCoinPrice, payload: { type: coin.name, data: rates[coin.name]} });
  })

  try {
    const res = await provider
    .query<CodeResult>({
      request_type: "call_function",
      account_id: POOL,
      method_name: `get_status`,
      args_base64: btoa(JSON.stringify({wallet: localStorage.getItem('accountId')})),
      finality: "optimistic",
    });
    status = JSON.parse(Buffer.from(res.result).toString());
    console.log(status)
  } catch (e) { }

  if (status) {
    if (status.amount_history !== undefined)
      dispatch({ type: ActionKind.setAmountHistory, payload: calcUSD(status.amount_history, rates) });
    if (status.farm_price !== undefined)
      dispatch({ type: ActionKind.setFarmPrice, payload: status.farm_price });
    if (status.farm_info !== undefined)
      dispatch({ type: ActionKind.setFarmInfo, payload: status.farm_info });
    if (status.farm_starttime !== undefined)
      dispatch({ type: ActionKind.setFarmStartTime, payload: status.farm_starttime });
    if(status.pot_info != undefined)
      dispatch({ type: ActionKind.setPotInfo, payload: status.pot_info });

    coins.forEach(async coin => {
      if (status[`apr_${coin.name}_history`] !== undefined)
        dispatch({ type: ActionKind.setAprHistory, payload: { type: coin.name, data: status[`apr_${coin.name}_history`] } });

      if (status[`userinfo_${coin.name}`] !== undefined)
        dispatch({ type: ActionKind.setUserInfoCoin, payload: { type: coin.name, data: status[`userinfo_${coin.name}`] } });

      if (status[`total_rewards_${coin.name}`] != undefined)
        dispatch({ type: ActionKind.setCoinTotalRewards, payload: { type: coin.name, data: parseInt(status[`total_rewards_${coin.name}`]) } });
    })
  }
  else {
    try {
      const amountsProvider = await provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: POOL,
        method_name: "get_amount_history",
        args_base64: "",
        finality: "optimistic",
      });
      amountHistory = JSON.parse(Buffer.from(amountsProvider.result).toString());
    } catch (e) { console.log(e) }
  
    try {
      if(!aprHistory) aprHistory = {};
      for(const coin of coins)
      {
        const res = await provider
        .query<CodeResult>({
          request_type: "call_function",
          account_id: POOL,
          method_name: `get_${coin.name}_apr_history`,
          args_base64: "",
          finality: "optimistic",
        });
        aprHistory[coin.name] = JSON.parse(Buffer.from(res.result).toString());
      }
    } catch (e) { console.log(e) }
  
    try {
      if(!userInfoCoin) userInfoCoin = {};
      for(const coin of coins)
      {
        const res = await provider
        .query<CodeResult>({
          request_type: "call_function",
          account_id: POOL,
          method_name: `get_${coin.name}_user_info`,
          args_base64: btoa(JSON.stringify({wallet: localStorage.getItem('accountId')})),
          finality: "optimistic",
        });
        userInfoCoin[coin.name] = JSON.parse(Buffer.from(res.result).toString());
      }
    } catch (e) { }
  
    try {
      const res = await provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: POOL,
        method_name: `get_farm_price`,
        args_base64: "",
        finality: "optimistic",
      });
      farmPrice = JSON.parse(Buffer.from(res.result).toString());
    } catch (e) { }
  
    try {
      const res = await provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: POOL,
        method_name: `get_farm_info`,
        args_base64: btoa(JSON.stringify({wallet: localStorage.getItem('accountId')})),
        finality: "optimistic",
      });
      farmInfo = JSON.parse(Buffer.from(res.result).toString());
    } catch (e) { }
  
    try {
      const res = await provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: POOL,
        method_name: `get_farm_starttime`,
        args_base64: "",
        finality: "optimistic",
      });
      farmStartTime = JSON.parse(Buffer.from(res.result).toString());
    } catch (e) { }
  
    try {
      const res = await provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: POOL,
        method_name: `get_pot_info`,
        args_base64: btoa(JSON.stringify({wallet: localStorage.getItem('accountId')})),
        finality: "optimistic",
      });
      portInfo = JSON.parse(Buffer.from(res.result).toString());
    } catch (e) { }
    
    if (amountHistory !== undefined)
      dispatch({ type: ActionKind.setAmountHistory, payload: calcUSD(amountHistory, rates) });
    if (farmPrice !== undefined)
      dispatch({ type: ActionKind.setFarmPrice, payload: farmPrice });
    if (farmInfo !== undefined)
      dispatch({ type: ActionKind.setFarmInfo, payload: farmInfo });
    if (farmStartTime !== undefined)
      dispatch({ type: ActionKind.setFarmStartTime, payload: farmStartTime });
    if(portInfo != undefined)
      dispatch({ type: ActionKind.setPotInfo, payload: portInfo });

    coins.forEach(async coin => {
      if (aprHistory[coin.name] !== undefined)
        dispatch({ type: ActionKind.setAprHistory, payload: { type: coin.name, data: aprHistory[coin.name] } });

      if (userInfoCoin[coin.name] !== undefined)
        dispatch({ type: ActionKind.setUserInfoCoin, payload: { type: coin.name, data: userInfoCoin[coin.name] } });
    })
  }

  dispatch({ type: ActionKind.setLoading, payload: false });
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function estimateSend(
  type: string,
  selector: any,
  lcd: any,
  amount: any,
  accountId: string | null,
  message: string,
  memo: string
) {
  if(!selector) 
    return undefined;

  const contractName = "passioneer3.testnet";
  const val = utils.format.parseNearAmount(amount || "0") || 0;
  const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;

  selector
  .signAndSendTransaction({
    receiverId: contractName,
    actions: [
      {
        type: "FunctionCall",
        params: {
          methodName: "mint",
          args: { amount: val, receiver_id: accountId },
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          deposit: utils.format.parseNearAmount("0")!,
          gas: BOATLOAD_OF_GAS
        }
      },
    ],
  })
  .then(async () => {
    toast("Successs! Please wait", successOption);
    // return e.result.txhash;
  })
  .catch((e: any) => {
    toast(e.message, errorOption);
    return undefined;
  });

  return undefined;  
}

export function checkNetwork(selector: NearWalletSelector | undefined, state: AppContextInterface) {
  //----------verify connection--------------------------------
  if (selector === undefined) {
    toast("Please connect near wallet first!", errorOption);
    console.log("Please connect near wallet first!");
    return false;
  }
  else {
    toast.dismiss();
  }

  if (state.net == 'mainnet' && selector.network.networkId == 'testnet') {
    toast("Please switch to mainnet!", errorOption);
    return false;
  }
  if (state.net == 'testnet' && selector.network.networkId == 'mainnet') {
    toast("Please switch to Testnet!", errorOption);
    return false;
  }
  return true;
}

export function floorNormalize(amount: number) {
  return Math.floor(amount / 10 ** 4) / 100;
}

export function floor(amount: number) {
  return Math.floor(amount * 100) / 100;
}

export function getDateString(time: number) {
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let datetime = new Date(time * 1000)
  return (month[datetime.getMonth()] + "   " + datetime.getDate() + " , " + datetime.getFullYear());
}