import { AppContextInterface, ActionKind } from './store'
import { toast } from 'react-toastify';
import axios from 'axios';
import { successOption, errorOption, POOL, coins } from './constants';
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
    farmStartTime = undefined,
    // coin_total_rewards = undefined,
    status: any = undefined

  coinInfo = {};
  try {
    for(let coin of coins)
    {
      axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${coin.id}`
      );
      coinInfo[coin.name] = res.data[coin.id].usd;
    }
  } catch (e) { }
  
  const rates:any = {};
  coins.forEach(coin => {
    rates[coin.name] = coinInfo[coin.name] ? coinInfo[coin.name] : state.coinPrice[coin.name];
  })
  console.log(rates)

  coins.forEach(coin => {
    if (rates[coin.name] !== undefined)
      dispatch({ type: ActionKind.setCoinPrice, payload: { type: coin.name, data: rates[coin.name]} });
  })

  // try {
  //   status = await api.contractQuery(
  //     POOL,
  //     {
  //       get_status: { wallet: wallet?.walletAddress }
  //     });
  // } catch (e) {
  //   console.log(e)
  // }

  status = {
    amount_history: [
      {
        time: 1641281704,
        usdc_amount: 10000000000,
        wnear_amount: 20000000000,
        usdc_reward: 100000000,
        wnear_reward: 20000000,
        totalUSD: 0,
      },
      {
        time: 1641282000,
        usdc_amount: 13400000000,
        wnear_amount: 23400000000,
        usdc_reward: 100000000,
        wnear_reward: 20000000,
        totalUSD: 0,
      },
    ],
    apr_usdc_history: [
      {
        time: 1648939268,
        apr: "3547",
      }
    ],
    apr_wnear_history: [
      {
        time: 1648939268,
        apr: "3547",
      }
    ],
    userinfo_usdc: {
      amount: "0",
      deposit_time: "0",
      reward_amount: "0",
      wallet: ""
    },
    userinfo_wnear: {
      amount: "0",
      deposit_time: "0",
      reward_amount: "0",
      wallet: ""
    },
    total_rewards_usdc: 1000,
    total_rewards_wnear: 1000,
  }

  if (status) {
    if (status.amount_history !== undefined)
      dispatch({ type: ActionKind.setAmountHistory, payload: calcUSD(status.amount_history, rates) });
    coins.forEach(coin => {
      if (status[`apr_${coin.name}_history`] !== undefined)
        dispatch({ type: ActionKind.setAprHistory, payload: { type: coin.name, data: status[`apr_${coin.name}_history`] } });

      if (status[`userinfo_${coin.name}`] !== undefined)
        dispatch({ type: ActionKind.setUserInfoCoin, payload: { type: coin.name, data: status[`userinfo_${coin.name}`] } });

      if (status[`total_rewards_${coin.name}`] != undefined)
        dispatch({ type: ActionKind.setCoinTotalRewards, payload: { type: coin.name, data: parseInt(status[`total_rewards_${coin.name}`]) } });
    })
  
    if (status.farm_price !== undefined)
      dispatch({ type: ActionKind.setFarmPrice, payload: parseInt(status.farm_price) });
    if (status.farm_info !== undefined)
      dispatch({ type: ActionKind.setFarmInfo, payload: status.farm_info });
    if (status.farm_starttime !== undefined)
      dispatch({ type: ActionKind.setFarmStartTime, payload: parseInt(status.farm_starttime) });

    if(status.pot_info != undefined)
      dispatch({ type: ActionKind.setPotInfo, payload: status.pot_info });
  }
  else {
    try {
      // amountHistory = await api.contractQuery(
      //   POOL,
      //   {
      //     get_amount_history: {}
      //   });

      amountHistory = await provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: selector.getContractId(),
        method_name: "getMessages",
        args_base64: "",
        finality: "optimistic",
      });

      amountHistory = JSON.parse(Buffer.from(amountHistory.result).toString());
    } catch (e) { }

    coins.forEach(async coin => {
      // try {
      //   aprHistory[coin.name] = await api.contractQuery(
      //     POOL,
      //     {
      //       [`get_history_of_apr_${coin.name}`]: {}
      //     }
      //   )
      // } catch (e) { }

      // try {
      //   userInfoCoin[coin.name] = await api.contractQuery(
      //     POOL,
      //     {
      //       [`get_user_info_${coin.name}`]: {
      //         wallet: wallet?.walletAddress
      //       }
      //     }
      //   )
      // } catch (e) { }
    })

    // try {
    //   farmPrice = await api.contractQuery(
    //     POOL,
    //     {
    //       get_farm_price: {}
    //     }
    //   )
    // } catch (e) { }

    // try {
    //   farmInfo = await api.contractQuery(
    //     POOL,
    //     {
    //       get_farm_info: {
    //         wallet: wallet?.walletAddress
    //       }
    //     }
    //   )
    // } catch (e) { }

    // try {
    //   farmStartTime = await api.contractQuery(
    //     POOL,
    //     {
    //       get_farm_starttime: {}
    //     }
    //   )
    // } catch (e) { }

    if (amountHistory !== undefined)
      dispatch({ type: ActionKind.setAmountHistory, payload: calcUSD(amountHistory,rates) });

    coins.forEach(async coin => {
      if (aprHistory !== undefined)
        dispatch({ type: ActionKind.setAprHistory, payload: { type: coin.name, data: aprHistory[coin.name] } });

      if (userInfoCoin !== undefined)
        dispatch({ type: ActionKind.setUserInfoCoin, payload: { type: coin.name, data: userInfoCoin[coin.name] } });
    })

    if (farmPrice !== undefined)
      dispatch({ type: ActionKind.setFarmPrice, payload: farmPrice });
    if (farmInfo !== undefined)
      dispatch({ type: ActionKind.setFarmInfo, payload: farmInfo });
    if (farmStartTime !== undefined)
      dispatch({ type: ActionKind.setFarmStartTime, payload: farmStartTime });
  }

  dispatch({ type: ActionKind.setLoading, payload: false });
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function estimateSend(
  type: string,
  selector: NearWalletSelector | undefined,
  lcd: any,
  msg: any,
  account_id: string,
  message: string,
  memo: string
) {
  if(!selector) 
    return undefined;

  if (!account_id)
    return undefined;

  const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;

  if(type == 'usn') {
    selector
    .signAndSendTransaction({
      signerId: account_id!,
      actions: [
        {
          type: "FunctionCall",
          params: {
            ...msg,
            gas: BOATLOAD_OF_GAS
          }
        },
      ],
    })
    .then(async () => {
      toast("Successs! Please wait", successOption);
      // return e.result.txhash;
    })
    .catch((e) => {
      toast(e.message, errorOption);
      console.log(e.message);
      return undefined;
    });
  }

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