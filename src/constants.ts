export let net = "testnet";

export const POOL_MAIN = "terra1cn6mggfxa3jp6dgteuerj2nx05xmrav6985r3f";
export const POOL_TEST = "terra1yl8ad8n2uqz3560akwqs2k7zc0zn9dg9z9tjuv";
export const POOL = net == 'mainnet'? POOL_MAIN: POOL_TEST;

export const VUST_MAIN = "terra1cfpye9qfwgxq2qewng0atk30jtufjt90h4zp6g";
export const VUST_TEST = "terra1hx9v3xu7kc7fuleqxzsags5pezwn8x5wmjxm5p";
export const VUST = net == 'mainnet'? VUST_MAIN : VUST_TEST;

export const VLUNA_MAIN = "terra1ldzv0yhxpeszkm9wup7g20y7q8m9txkw35wqn5";
export const VLUNA_TEST = "terra1swr7jq37664wgqn48qtnlfgexg77dglm9ytxgg";
export const VLUNA = net == 'mainnet'? VLUNA_MAIN : VLUNA_TEST;

export const MOTHER_WALLET = "terra1qvyj7tqs35hckd395rglc7lsyf2acuhgdcmj77";
export const REQUEST_ENDPOINT = "https://stakingplatformalenzer.herokuapp.com/";

export const farmInfo = {
  wallet: '',
  amount: '0'
}
export const coins = [
  {
    img: 'img/usdc.svg',
    currency: 'USDC',
    name: 'usdc',
    blockchain: 'USD Coin',
    id: 'usd-coin',
    stable: true,
    available: true
  },
  // {
  //   img: 'img/usdt.svg',
  //   currency: 'USDT',
  //   name: 'usdt',
  //   blockchain: 'USD Tether',
  //   id: 'tether',
  //   stable: true,
  //   available: true
  // },
  // {
  //   img: 'img/dai.svg',
  //   currency: 'DAI',
  //   name: 'dai',
  //   id: 'dai',
  //   blockchain: 'Dai',
  //   stable: true,
  //   available: true
  // },
  // {
  //   img: 'img/usn.svg',
  //   currency: 'USN',
  //   name: 'usn',
  //   id: 'usn',
  //   blockchain: 'USD NEAR',
  //   stable: true,
  //   available: true
  // },
  // {
  //   img: 'img/eth.svg',
  //   currency: 'ETH',
  //   name: 'eth',
  //   id: 'ethereum',
  //   blockchain: 'Ethereum',
  //   stable: false,
  //   available: true
  // },
  // {
  //   img: 'img/wbtc.svg',
  //   currency: 'wBTC',
  //   name: 'wbtc',
  //   blockchain: 'Wrapped Bitcoin',
  //   id: 'wrapped-bitcoin',
  //   stable: false,
  //   available: true
  // },
  {
    img: 'img/wnear.svg',
    currency: 'wNEAR',
    name: 'wnear',
    id: 'wrapped-near',
    blockchain: 'Wrapped Near',
    stable: false,
    available: true
  },
  // {
  //   img: 'img/neart.svg',
  //   currency: 'NEARt',
  //   name: 'neart',
  //   blockchain: 'NEARt Treasury(Coming Soon)',
  //   stable: false,
  //   available: false
  // },
];

export const stableCoinCount = coins.filter(coin => coin.stable && coin.available).length;
export const volatileCoinCount = coins.filter(coin => !coin.stable && coin.available).length;

const userInfo_:any = {};
coins.forEach(coin => {
  userInfo_[coin.name] = {
    amount: "0",
    deposit_time: "0",
    reward_amount: "0",
    wallet: ""
  }
})
export const userInfo = userInfo_;

const uCoinBalance_:any = { near: 0 };
coins.forEach(coin => {
  uCoinBalance_[coin.name] = 0;
})
export const uCoinBalance = uCoinBalance_;

const coinPrice_:any = {};
coins.forEach(coin => {
  coinPrice_[coin.name] = 0;
})
export const coinPrice = coinPrice_;

const potInfo_:any = {
  wallet: "",
}
coins.forEach(coin => {
  potInfo_[coin.name + '_amount'] = "0";
  potInfo_["qualified_" + coin.name + "_amount"] = "0";
})
export const potInfo = potInfo_;

const amountHistory_ = [];
const historyInfo:any = {
  time: 1641281704,
  totalUSD: 0,
}
coins.forEach(coin => {
  historyInfo[coin.name + '_amount'] = "0";
})
amountHistory_.push(historyInfo);
export const amountHistory = amountHistory_;

const apiHistoryInfo:any = {};
coins.forEach(coin => {
  apiHistoryInfo[coin.name] = [
    {
      time: 1648939268,
      apr: "3547",
    },
    {
      time: 1648939268,
      apr: "3547",
    },
    {
      time: 1648939268,
      apr: "3547",
    },
    {
      time: 1648939268,
      apr: "3547",
    },
    {
      time: 1648939268,
      apr: "3547",
    },
    {
      time: 1648939268,
      apr: "3547",
    },
  ];
})
export const aprHistory = apiHistoryInfo;

export const successOption: any = {
  position: "top-right",
  type: "success",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const errorOption: any = {
  position: "top-right",
  type: "error",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};
