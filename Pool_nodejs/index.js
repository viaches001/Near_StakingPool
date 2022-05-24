const axios = require('axios');
const POOL = require("./constants").POOL;
const nearConfig = require("./constants").nearConfig;
const { connect, keyStores, Contract, InMemorySigner } = require('near-api-js');

const port = process.env.PORT || 3001
const express = require("express");
const app = express();
const cors = require("cors");

async function payReward() {
	let { contract } = await initContract();
	try {
		await contract.try_calc_reward({ args: {}});
		console.log("reward suceess");
	}
	catch(e) {
		console.log("reward failed");
	}
	return "success";
}

async function farm() {
	let { contract } = await initContract();
  let coinInfo = [];
  try {
    for(let coin of coins)
    {
      const instance = axios.create({
        baseURL: `https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=${coin.id}`
      });
      instance.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
      const res = await instance.get('');
      coinInfo.push({name: coin.name, price: res.data[coin.id].usd});
    }
  } catch (e) { }

	try {
		await contract.try_update_farm({args: {token_prices: coinInfo}});
		console.log("farm suceess");
	}
	catch(e) {
		console.log("farm failed");
	}
	return "success";
}

async function test() {
	res = await farm();
	console.log(res)
}

test();

const nodeCron = require("node-cron");
var job = nodeCron.schedule('0 0 0-23 * * *', async function () {
	console.log("pay reward start")
	let res = 'success';
	let count = 0;
	do {
		res = await payReward();
		await sleep(6000);
		count++;
	} while (res != 'success' && count < 10)

	console.log("community farm start")
	res = 'success';
	count = 0;
	do {
		res = await farm();
		await sleep(6000);
		count++;
	} while (res != 'success' && count < 10)
});


async function potProcess() {
	let { contract } = await initContract();
	try {
		await contract.try_process_pot({args: {}});
		console.log("reward pot_process");
	}
	catch(e) {
		console.log("pot_process failed");
	}
	return "success";
}

var job2 = nodeCron.schedule('0 59 * * * *', async function () {//s m h day month dayOfweek
	console.log("Pot process start")
	let res = 'success';
	let count = 0;
	do {
		res = await potProcess();
		await sleep(6000);
		count++;
	} while (res != 'success' && count < 10)
});


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send("success v19"))
app.listen(port, () => console.log(`Server listening on port ${port}!`))

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function initContract() {
	// Initialize connection to the NEAR testnet
	const keyStore = new keyStores.UnencryptedFileSystemKeyStore(`${__dirname}/.near-credentials/`);
	const near = await connect(
		Object.assign(
			{ deps: { keyStore: keyStore } },
			nearConfig
		)
	);
	const accountId = 'staking_voucher_tokens.testnet';
	const account = await near.account(accountId)

	// Initializing our contract APIs by contract name and configuration
	const contract = await new Contract(
		account,
		POOL,
		{
			// View methods are read only. They don't modify the state, but usually return some value.
			viewMethods: ["get_owner", "get_treasury", "get_token_info", "get_token_apr_history", "get_user_pool_info", "get_user_pot_info", "get_farm_price",
			"get_farm_start_time", "get_user_farm_info", "get_farm_total", "get_token_total_reward", "get_user_oper_history", "get_user_state"],
			// Change methods can modify the state. But you don't receive the returned value when called.
			changeMethods: ["new", "try_set_config", "try_add_token", "try_set_token_addr", "try_set_token_apr", "try_deposit", "try_withdraw", "try_calc_reward",
			"try_process_pot", "try_set_farm_start_time", "try_update_farm"],
		}
	);

	return { contract }
}
