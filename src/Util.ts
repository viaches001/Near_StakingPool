import { AppContextInterface, ActionKind } from './store'
import { MsgExecuteContract, WasmAPI, Coin, LCDClient, Fee } from '@terra-money/terra.js'
import { ConnectedWallet } from '@terra-money/wallet-provider'
import { toast } from 'react-toastify';
import axios from 'axios';
import { successOption, errorOption, POOL } from './constants';

export function shortenAddress(address: string | undefined) {
  if (address) {
    let prefix = address.slice(0, 5);
    let suffix = address.slice(-5)
    return prefix + "..." + suffix;
  }
  return "";
}

function calcUSD(amountHistory: any, ustPrice: number, lunaPrice: number) {
  if (amountHistory == undefined) return undefined;

  for (let i = 0; i < amountHistory.length; i++) {
    amountHistory[i].ust_amount = floorNormalize(amountHistory[i].ust_amount) + floorNormalize(amountHistory[i].ust_reward);
    amountHistory[i].luna_amount = floorNormalize(amountHistory[i].luna_amount) + floorNormalize(amountHistory[i].luna_reward);
    amountHistory[i].totalUST =
      amountHistory[i].ust_amount + amountHistory[i].luna_amount * lunaPrice / ustPrice;
  }

  return amountHistory;
}
export async function fetchData(state: AppContextInterface, dispatch: React.Dispatch<any>) {
  dispatch({ type: ActionKind.setLoading, payload: true });

  const wallet = state.wallet;
  const api = new WasmAPI(state.lcd.apiRequester);

  let amountHistory = undefined,
    aprUstHistory = undefined,
    aprLunaHistory = undefined,
    ustInfo = undefined,
    lunaInfo = undefined,
    userInfoUst = undefined,
    userInfoLuna = undefined,
    farmPrice = undefined,
    farmInfo = undefined,
    farmStartTime = undefined,
    ust_total_rewards = undefined,
    luna_total_rewards = undefined,
    status: any = undefined

  try {
    lunaInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=LUNA`
    );
  } catch (e) { }

  try {
    ustInfo = await axios.get(
      `https://api.extraterrestrial.money/v1/api/prices?symbol=UST`
    );
  } catch (e) { }
  const ustPrice = ustInfo ? ustInfo?.data.prices.UST.price : state.ustPrice;
  const lunaPrice = lunaInfo ? lunaInfo?.data.prices.LUNA.price : state.lunaPrice;

  if (ustPrice !== undefined)
    dispatch({ type: ActionKind.setUstPrice, payload: ustPrice });
  if (lunaPrice !== undefined)
    dispatch({ type: ActionKind.setLunaPrice, payload: lunaPrice });

  try {
    status = await api.contractQuery(
      POOL,
      {
        get_status: { wallet: wallet?.walletAddress }
      });
  } catch (e) {
    console.log(e)
  }
  console.log(status)

  if (status) {
    if (status.amount_history !== undefined)
      dispatch({ type: ActionKind.setAmountHistory, payload: calcUSD(status.amount_history, ustPrice, lunaPrice) });
    if (status.apr_ust_history !== undefined)
      dispatch({ type: ActionKind.setAprUstHistory, payload: status.apr_ust_history });
    if (status.apr_luna_history !== undefined)
      dispatch({ type: ActionKind.setAprLunaHistory, payload: status.apr_luna_history });

    if (status.userinfo_ust !== undefined)
      dispatch({ type: ActionKind.setUserInfoUst, payload: status.userinfo_ust });
    if (status.userinfo_luna !== undefined)
      dispatch({ type: ActionKind.setUserInfoLuna, payload: status.userinfo_luna });

    if (status.farm_price !== undefined)
      dispatch({ type: ActionKind.setFarmPrice, payload: parseInt(status.farm_price) });
    if (status.farm_info !== undefined)
      dispatch({ type: ActionKind.setFarmInfo, payload: status.farm_info });
    if (status.farm_starttime !== undefined)
      dispatch({ type: ActionKind.setFarmStartTime, payload: parseInt(status.farm_starttime) });

    if (status.total_rewards_ust != undefined)
      dispatch({ type: ActionKind.setUstTotalRewards, payload: parseInt(status.total_rewards_ust) });
    if (status.total_rewards_luna != undefined)
      dispatch({ type: ActionKind.setLunaTotalRewards, payload: parseInt(status.total_rewards_luna) });

    if(status.pot_info != undefined)
      dispatch({ type: ActionKind.setPotInfo, payload: status.pot_info });
  }
  else {
    try {
      amountHistory = await api.contractQuery(
        POOL,
        {
          get_amount_history: {}
        });
    } catch (e) { }

    try {
      aprUstHistory = await api.contractQuery(
        POOL,
        {
          get_history_of_apr_ust: {}
        }
      )
    } catch (e) { }

    try {
      aprLunaHistory = await api.contractQuery(
        POOL,
        {
          get_history_of_apr_luna: {}
        }
      )
    } catch (e) { }

    try {
      userInfoUst = await api.contractQuery(
        POOL,
        {
          get_user_info_ust: {
            wallet: wallet?.walletAddress
          }
        }
      )
    } catch (e) { }

    try {
      userInfoLuna = await api.contractQuery(
        POOL,
        {
          get_user_info_luna: {
            wallet: wallet?.walletAddress
          }
        }
      )
    } catch (e) { }

    try {
      farmPrice = await api.contractQuery(
        POOL,
        {
          get_farm_price: {}
        }
      )
    } catch (e) { }

    try {
      farmInfo = await api.contractQuery(
        POOL,
        {
          get_farm_info: {
            wallet: wallet?.walletAddress
          }
        }
      )
    } catch (e) { }

    try {
      farmStartTime = await api.contractQuery(
        POOL,
        {
          get_farm_starttime: {}
        }
      )
    } catch (e) { }

    if (amountHistory !== undefined)
      dispatch({ type: ActionKind.setAmountHistory, payload: calcUSD(amountHistory, ustPrice, lunaPrice) });
    if (aprUstHistory !== undefined)
      dispatch({ type: ActionKind.setAprUstHistory, payload: aprUstHistory });
    if (aprLunaHistory !== undefined)
      dispatch({ type: ActionKind.setAprLunaHistory, payload: aprLunaHistory });

    if (userInfoUst !== undefined)
      dispatch({ type: ActionKind.setUserInfoUst, payload: userInfoUst });
    if (userInfoLuna !== undefined)
      dispatch({ type: ActionKind.setUserInfoLuna, payload: userInfoLuna });

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
  wallet: ConnectedWallet,
  lcd: LCDClient,
  msgs: MsgExecuteContract[],
  message: string,
  memo: string
) {
  console.log(msgs);
  const obj = new Fee(10_000, { uusd: 4500 })

  let accountInfo: any | undefined = undefined;

  await lcd.auth.accountInfo(
    wallet.walletAddress
  )
    .then((e) => {
      accountInfo = e;
    })
    .catch((e) => {
      toast(e.message, errorOption)
      console.log(e.message);
    })
  console.log(accountInfo);
  if (!accountInfo)
    return undefined;

  let txOptions =
  {
    msgs: msgs,
    memo: memo,
    gasPrices: obj.gasPrices(),
    gasAdjustment: 1.7,
  };

  let rawFee: any | undefined = undefined;
  await lcd.tx.estimateFee(
    [
      {
        sequenceNumber: accountInfo.getSequenceNumber(),
        publicKey: accountInfo.getPublicKey(),
      },
    ],
    txOptions
  )
    .then((e) => {
      rawFee = e;
    })
    .catch((e) => {
      toast(e.message, errorOption)
      console.log(e.message);
    })

  if (!rawFee)
    return undefined;

  return await wallet
    .post({
      msgs: msgs,
      memo: memo,
      fee: rawFee,
      gasPrices: obj.gasPrices(),
      gasAdjustment: 1.7,
    })
    .then(async (e) => {
      if (e.success) {
        toast("Successs! Please wait", successOption);
        return e.result.txhash;
      } else {
        toast(e.result.raw_log, errorOption);
        console.log(e.result.raw_log);
        return undefined;
      }
    })
    .catch((e) => {
      toast(e.message, errorOption);
      console.log(e.message);
      return undefined;
    })
}

export function checkNetwork(wallet: ConnectedWallet | undefined, state: AppContextInterface) {
  //----------verify connection--------------------------------
  if (wallet === undefined) {
    toast("Please connect wallet first!", errorOption);
    console.log("Please connect wallet first!");
    return false;
  }
  else {
    toast.dismiss();
  }

  if (state.net == 'mainnet' && wallet.network.name == 'testnet') {
    toast("Please switch to mainnet!", errorOption);
    return false;
  }
  if (state.net == 'testnet' && wallet.network.name == 'mainnet') {
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