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
export const userInfo = {
  amount: "0",
  deposit_time: "0",
  reward_amount: "0",
  wallet: ""
}
export const potInfo = {
  wallet: "",
  ust_amount: "0",
  luna_amount: "0",
  qualified_ust_amount: "0",
  qualified_luna_amount: "0"
}
export const amountHistory = [
  {
    time: 1641281704,
    ust_amount: 0,
    luna_amount: 0,
    totalUST: 0,
  },
  {
    time: 1643281704,
    ust_amount: 0,
    luna_amount: 0,
    totalUST: 0
  },
];


export const aprUstHistory = [
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


export const aprLunaHistory = [
  {
    time: 1648939268,
    apr: "1861",
  },
  {
    time: 1648939268,
    apr: "1861",
  },
  {
    time: 1648939268,
    apr: "1861",
  },
  {
    time: 1648939268,
    apr: "1861",
  },
  {
    time: 1648939268,
    apr: "1861",
  },
  {
    time: 1648939268,
    apr: "1861",
  },
];

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
