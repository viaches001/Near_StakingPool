use near_sdk::{env, near_bindgen, setup_alloc, ext_contract, AccountId, Balance, Gas, Promise};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::json_types::U128;
use near_sdk::serde_json::{Value, Map};
use crate::base::*;

mod base;

setup_alloc!();

pub const APR_DECIMALS: u128 = 10_000u128;
pub const YEAR_DAYS: u128 = 365u128;
pub const BASE_GAS: Gas = 5_000_000_000_000;

#[ext_contract(ext_ft)]
pub trait ExtFT {
    fn mint(receiver_id: AccountId, amount: U128);
    fn burn(receiver_id: AccountId, amount: U128);
}

#[ext_contract(ext_self)]
pub trait ExtSelf {
    fn deposit(token_name: String, amount: u128, qualified: bool) -> U128;
//     fn withdraw(token_name: String, amount: U128);
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
	pub owner: AccountId,
    pub treasury: AccountId,
 
	pub token_count: u16,
	pub token_infos: UnorderedMap<String, TokenInfo>,

	pub apr_historys: UnorderedMap<String, TokenAprHistory>,
    pub pool_infos: UnorderedMap<String, TokenPoolInfo>,
    pub pot_infos: UnorderedMap<String, TokenPotInfo>,
	
    pub farm_start_time: u64,
    pub farm_price: u128,
    pub farm_total: Balance,
    pub farm_infos: UnorderedMap<AccountId, UserFarmInfo>,
    pub total_rewards: UnorderedMap<String, Balance>,
	
	pub oper_historys: UnorderedMap<AccountId, UserOperHistory>,
	pub amount_historys: UnorderedMap<String, TokenAmountHistory>,
}

impl Default for Contract {
    fn default() -> Self {
        env::panic(b"Contract is not initialized");
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(treasury: AccountId) -> Self {
		let this = Self {
			owner: env::predecessor_account_id(),
			treasury: treasury,
			
			token_count: 0,
			token_infos: UnorderedMap::new(b"token_infos".to_vec()),
			
			apr_historys: UnorderedMap::new(b"apr_historys by token".to_vec()),
			pool_infos: UnorderedMap::new(b"pool_infos by token".to_vec()),
			pot_infos: UnorderedMap::new(b"pot_infos by token".to_vec()),
			total_rewards: UnorderedMap::new(b"total_rewards by token".to_vec()),
			
			farm_start_time: env::block_timestamp(),
			farm_price: 25u128,
			farm_total: 0,
			farm_infos: UnorderedMap::new(b"farm_infos by token".to_vec()),
			
			oper_historys: UnorderedMap::new(b"oper_historys".to_vec()),
			amount_historys: UnorderedMap::new(b"amount_historys by token".to_vec()),
		};

		this
    }

	pub fn try_set_config(&mut self, owner: AccountId, treasury: AccountId) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");

		self.owner = owner;
		self.treasury = treasury;
	}

	pub fn try_add_token(&mut self, token_name: String, u_token_addr: AccountId, v_token_addr: AccountId, apr: U128) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");

		self.add_token(token_name.clone(), u_token_addr, v_token_addr, apr.0);
		self.append_token_apr_history(token_name.clone(), apr.0);
	}

	// Will Remove
	pub fn try_set_token_addr(&mut self, token_name: String, u_token_addr: AccountId, v_token_addr: AccountId) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");

		let mut token_info = self.get_token_info(token_name.clone());
		token_info.u_addr = u_token_addr;
		token_info.v_addr = v_token_addr;
		self.token_infos.insert(&token_name, &token_info);
	}

	pub fn try_set_token_apr(&mut self, token_name: String, apr: U128) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");
		
		self.append_token_apr_history(token_name, apr.0);
	}

	pub fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> Promise {
		let json: Value = near_sdk::serde_json::from_str(&msg).unwrap();
		let params: Map<String, Value> = json.as_object().unwrap().clone();
		
		let token_name = params.get(&"token_name".to_string()).unwrap().as_str().unwrap().to_string();
		let qualified = params.get(&"qualified".to_string()).unwrap().as_bool().unwrap();
		let token_info = self.get_token_info(token_name);
		
		ext_ft::mint(sender_id.clone(), amount, &token_info.v_addr, 0, 50_000_000_000)
		.then(
			ext_self::deposit(token_info.name.clone(), amount.0, qualified, &env::current_account_id(), 0, 50_000_000_000)
		)
	}

	// pub fn try_deposit(&mut self, token_name: String, amount: U128, qualified: bool) /*-> Promise*/ {
	// 	let wallet = env::predecessor_account_id();
	// 	let token_info = self.get_token_info(token_name.clone());

		// Transfer to Treasury
		// ext_ft::ft_transfer(self.treasury.clone(), amount, &token_info.u_addr, 0, 20_000_000_000_000)
		// .then(
			// Mint Voucher Token
			// ext_ft::mint(wallet.clone(), amount, &token_info.v_addr, 0, 5_000_000_000_000).then(
				// ext_self::deposit(token_name, amount, qualified, &env::current_account_id(), 0, 5_000_000_000_000)
			// )
		// )

		// ext_ft::ft_on_transfer(env::predecessor_account_id(), amount, "Received".to_string(), &token_info.u_addr, 1, 20_000_000_000_000);

		// self.deposit(wallet.clone(), token_name, amount.0, qualified);
		// ext_ft::mint(wallet.clone(), amount, &token_info.v_addr, 0, 500_000_000);
	// }

	pub fn try_withdraw(&mut self, token_name: String, amount: U128, token_prices: Vec<TokenPriceInfo>) /*-> Promise*/ {
		self.save_token_prices(token_prices);
		
		let wallet = env::predecessor_account_id();
		let token_info: TokenInfo = self.get_token_info(token_name.clone());

		// Burn
		// ext_ft::burn(wallet.clone(), amount, &token_info.v_addr, 0, BASE_GAS).then(
			// ext_self::withdraw(token_name, amount, &env::current_account_id(), 0, BASE_GAS)
		// )
		self.withdraw(wallet.clone(), token_name, amount.0);
		ext_ft::burn(wallet.clone(), amount, &token_info.v_addr, 0, 5_000_000_000_000);
	}

	pub fn try_calc_reward(&mut self) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");

		let all_tokens = self.token_infos.keys_as_vector().to_vec();
		for token_name in all_tokens.iter() {
			let mut token_pool_info = self.pool_infos.get(&token_name)
				.unwrap_or(UnorderedMap::new(b"try_rewards:token_pool_info".to_vec()));
			let mut token_total_reward = self.total_rewards.get(&token_name).unwrap_or(0);
			
			let all_wallets = token_pool_info.keys_as_vector().to_vec();
			for wallet in all_wallets.iter() {
				let mut token_user_pool_info = token_pool_info.get(&wallet).unwrap();
				let apr = self.get_token_info(token_name.clone()).apr;
	
				// Calc User Reward
				let reward = (token_user_pool_info.deposit_amount + token_user_pool_info.reward_amount) * apr / APR_DECIMALS / YEAR_DAYS;
				token_user_pool_info.reward_amount += reward;
				token_pool_info.insert(&wallet, &token_user_pool_info);
				
				// Calc Total Reward
				token_total_reward += reward;
				
				if reward > 0 {
					let token_info = self.token_infos.get(&token_name).unwrap();
					ext_ft::burn(wallet.clone(), U128::from(reward), &token_info.v_addr, 0, BASE_GAS);
				}
			}
			self.pool_infos.insert(&token_name, &token_pool_info);
			self.total_rewards.insert(&token_name, &token_total_reward);
		}
	}
	
	pub fn try_process_pot(&mut self) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");

		let all_tokens = self.pot_infos.keys_as_vector().to_vec();
		for token_name in all_tokens.iter() {
			let mut token_pot_info = self.pot_infos.get(&token_name).unwrap();
			let all_wallets = token_pot_info.keys_as_vector().to_vec();
			for wallet in all_wallets.iter() {
				let mut token_user_pot_info  = token_pot_info.get(&wallet).unwrap();
				
				token_user_pot_info.qualified_amount += token_user_pot_info.unqualified_amount;
				token_user_pot_info.unqualified_amount = 0;

				token_pot_info.insert(&wallet, &token_user_pot_info);
			}
			self.pot_infos.insert(&token_name, &token_pot_info);
		}
	}

	pub fn try_set_farm_start_time(&mut self, time: u64) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");

		self.farm_start_time = time;
	}

	pub fn try_update_farm(&mut self, token_prices: Vec<TokenPriceInfo>) {
		assert!(env::predecessor_account_id() == self.owner, "must be owner");

		self.save_token_prices(token_prices);

		let current_time = env::block_timestamp();
		let farm_endtime = self.farm_start_time + current_time;

		// Check Condition
		assert!(!(self.farm_start_time == 0 || current_time < self.farm_start_time), "farm not started");
		assert!(farm_endtime > current_time, "wait");
		assert!(self.farm_total < FARM_AMOUNT, "full farmed");

		let mut total_as_usd = 0;
		let all_wallets = self.pool_infos.keys_as_vector().to_vec();
		for wallet in all_wallets.iter() {
			let user_amount_as_usd = self.get_user_deposit_amount_as_usd(wallet.clone());
			total_as_usd += user_amount_as_usd;
			
			//(x/10^6) * (price / 10^2) / 10^3 * 24 = x*price*24/10^11
			let farm = user_amount_as_usd * 24u128 / (10u64.pow(11u32) as u128);
			self.update_user_farm(wallet.clone(), farm.clone());
			self.farm_total += farm;
		}
		
		// Update Farm Price
		// (x / 10^6) * (price / 10^2) / 20,000,000
		let multiple = total_as_usd / 100_000_000u128 / 20_000_000u128;
		
		// old_price * (1.2)^multiple = old_price / 10^2 * (12^ multiple) / (10^multiple) * 10^2
		self.farm_price = self.farm_price * (12u64.pow(multiple as u32) as u128) / (10u64.pow(multiple as u32)) as u128;
	}

	pub fn get_owner(&self) -> AccountId {
		self.owner.clone()
	}

	pub fn get_treasury(&self) -> AccountId {
		self.treasury.clone()
	}

	pub fn get_token_info(&self, token_name: String) -> TokenInfo {
		assert!(!self.token_infos.get(&token_name).is_none(), "This Token Not Exist");
		
		self.token_infos.get(&token_name).unwrap()
	}

	pub fn get_token_apr_history(&self, token_name: String) -> Vec<AprInfo> {
		self.apr_historys.get(&token_name).unwrap()
	}

	pub fn get_user_pool_info(&self, wallet: AccountId) -> Vec<TokenUserPoolInfo> {
		let mut user_pool_info = Vec::new();
		
		let all_tokens = self.token_infos.keys_as_vector().to_vec();
		for token_name in all_tokens.iter() {
			let token_pool_info = self.pool_infos.get(&token_name)
				.unwrap_or(UnorderedMap::new(b"get_user_pot_info:token_pool_info".to_vec()));
			let token_user_pool_info = token_pool_info.get(&wallet)
				.unwrap_or(TokenUserPoolInfo {
					token_name: token_name.clone(),
					wallet: wallet.clone(),
					deposit_amount: 0,
					reward_amount: 0,
					deposit_time: env::block_timestamp(),
				});
			
			user_pool_info.push(token_user_pool_info);
		}

		user_pool_info
	}

	pub fn get_user_pot_info(&self, wallet: AccountId) -> Vec<TokenUserPotInfo> {
		let mut user_pot_info = Vec::new();
		
		let all_tokens = self.token_infos.keys_as_vector().to_vec();
		for token_name in all_tokens.iter() {
			let token_pot_info = self.pot_infos.get(&token_name)
				.unwrap_or(UnorderedMap::new(b"get_token_user_pot_info:token_pot_info".to_vec()));
			let token_user_pot_info = token_pot_info.get(&wallet)
				.unwrap_or(TokenUserPotInfo {
					token_name: token_name.clone(),
					wallet: wallet.clone(),
					qualified_amount: 0,
					unqualified_amount: 0,
				});
			user_pot_info.push(token_user_pot_info);
		}

		user_pot_info
	}

	pub fn get_farm_price(&self) -> u128 {
		self.farm_price
	}

	pub fn get_farm_start_time(&self) -> u64 {
		self.farm_start_time
	}

	pub fn get_user_farm_info(&self, wallet: AccountId) -> UserFarmInfo {
		self.farm_infos.get(&wallet)
			.unwrap_or(UserFarmInfo {
				wallet: wallet,
				amount: 0,
			})
	}

	pub fn get_farm_total(&self) -> Balance {
		self.farm_total
	}

	pub fn get_token_total_reward(&self, token_name: String) -> Balance {
		self.total_rewards.get(&token_name).unwrap_or(0)
	}

	pub fn get_user_oper_history(&self, wallet: String) -> UserOperHistory {
		self.oper_historys.get(&wallet).unwrap_or(Vec::new())
	}

	pub fn get_user_state(&self, wallet: AccountId) -> Map<String, Value> {
		let mut res: Map<String, Value> = Map::new();
		let mut json_str: String = "".to_string();
		let mut json: Value = Value::String("0".to_string());

		let all_tokens = self.token_infos.keys_as_vector().to_vec();
		
		// Total Amount History
		let mut res_amount_history: Vec<Value> = Vec::new();
		for token_name in all_tokens.iter() {
			let token_amount_history: TokenAmountHistory = self.amount_historys.get(&token_name).unwrap_or(Vec::new());
			for i in 1..token_amount_history.len() {
				let mut res_amount_info: Map<String, Value> = Map::new();
				
				if res_amount_history.len() <= i {
					res_amount_info.insert("time".to_string(), Value::Number(token_amount_history[i].time.into()));
				} else {
					res_amount_info = res_amount_history[i].as_object().unwrap().clone();
				}
				
				res_amount_info.insert(format!("{}_deposit_amount", token_name), Value::String(format!("{}", token_amount_history[i].deposit_amount)));
				res_amount_info.insert(format!("{}_reward_amount", token_name), Value::String(format!("{}", token_amount_history[i].deposit_amount)));
				res_amount_info.insert(format!("totalUSD"), Value::String(format!("{}", 0)));
				res_amount_history.push(Value::Object(res_amount_info));
			}

			// Token Apr History
			let token_apr_history = self.apr_historys.get(&token_name).unwrap_or(Vec::new());
			json_str = near_sdk::serde_json::to_string(&token_apr_history).unwrap();
			json = near_sdk::serde_json::from_str(&json_str).unwrap();
			// let res_token_apr_history: Vec<Value> = json.as_array().unwrap().to_vec();
			res.insert(format!("{}_apr_history", token_name), json);

			// User Pool Info
			let token_pool_info = self.pool_infos.get(&token_name)
				.unwrap_or(UnorderedMap::new(b"get_user_status:token_pool_info".to_vec()));
			let token_user_pool_info = token_pool_info.get(&wallet)
				.unwrap_or(TokenUserPoolInfo {
					token_name: token_name.clone(),
					wallet: wallet.clone(),
					deposit_amount: 0,
					reward_amount: 0,
					deposit_time: env::block_timestamp(),
				});
			json_str = near_sdk::serde_json::to_string(&token_user_pool_info).unwrap();
			json = near_sdk::serde_json::from_str(&json_str).unwrap();
			res.insert(format!("{}_user_info", token_name), json);

			// User Pot Info
			let token_pot_info = self.pot_infos.get(&token_name)
				.unwrap_or(UnorderedMap::new(b"get_user_status:token_pot_info".to_vec()));
			let token_user_pot_info = token_pot_info.get(&wallet)
				.unwrap_or(TokenUserPotInfo {
					token_name: token_name.clone(),
					wallet: wallet.clone(),
					qualified_amount: 0,
					unqualified_amount: 0,
				});
			json_str = near_sdk::serde_json::to_string(&token_user_pot_info).unwrap();
			json = near_sdk::serde_json::from_str(&json_str).unwrap();
			res.insert(format!("{}_user_pot_info", token_name), json);

			// User Farm Info
			let user_farm_info = self.farm_infos.get(&wallet)
				.unwrap_or(UserFarmInfo {
					wallet: wallet.clone(),
					amount: 0,
				});
			json_str = near_sdk::serde_json::to_string(&user_farm_info).unwrap();
			json = near_sdk::serde_json::from_str(&json_str).unwrap();
			res.insert(format!("user_farn_info"), json);

			// Toke Total Reward
			let token_total_reward = self.total_rewards.get(&token_name).unwrap_or(0);
			res.insert(format!("{}_total_reward", token_name), Value::String(format!("{}", token_total_reward)));
			
			// Farm Info
			res.insert(format!("farm_price"), Value::String(format!("{}", self.farm_price)));
			res.insert(format!("farm_start_time"), Value::String(format!("{}", self.farm_start_time)));
		}
		res.insert("amount_history".to_string(), Value::Array(res_amount_history));

		// User Oper History
		let user_oper_history = self.oper_historys.get(&wallet).unwrap_or(Vec::new());
		json_str = near_sdk::serde_json::to_string(&user_oper_history).unwrap();
		json = near_sdk::serde_json::from_str(&json_str).unwrap();
		res.insert(format!("user_oper_history"), json);
		
		res
	}
}

impl Contract {
	fn deposit(&mut self, wallet: AccountId, token_name: String, amount: Balance, qualified: bool) -> U128 {
		let mut token_pool_info = self.pool_infos.get(&token_name)
			.unwrap_or(UnorderedMap::new(b"try_deposit:token_pool_info".to_vec()));
		let mut token_user_pool_info = token_pool_info.get(&wallet)
			.unwrap_or(TokenUserPoolInfo {
				token_name: token_name.clone(),
				wallet: wallet.clone(),
				deposit_amount: 0,
				reward_amount: 0,
				deposit_time: env::block_timestamp(),
			});
			
		// Upgrade Amount in Pool
		token_user_pool_info.deposit_amount += amount;
		token_pool_info.insert(&wallet, &token_user_pool_info);
		self.pool_infos.insert(&token_name, &token_pool_info);
		
		// Deposit To Pot
		self.deposit_pot(token_name.clone(), wallet.clone(), amount, qualified);

		// Log
		self.append_user_oper_history(wallet.clone(), token_name.clone(), amount, true);
		self.append_token_amount_history(token_name.clone(), amount, true);

		return U128(0);
	}

	fn withdraw(&mut self, wallet: AccountId, token_name: String, amount: Balance) {
		let mut token_pool_info = self.pool_infos.get(&token_name)
			.unwrap_or(UnorderedMap::new(b"try_withdraw:token_pool_info".to_vec()));
		let mut token_user_pool_info = token_pool_info.get(&wallet)
			.unwrap_or(TokenUserPoolInfo {
				token_name: token_name.clone(),
				wallet: wallet.clone(),
				deposit_amount: 0,
				reward_amount: 0,
				deposit_time: env::block_timestamp(),
			});
		
		// Calc Remain Amount
		let mut withdraw_amount = amount;
		if token_user_pool_info.deposit_amount >= amount {
			token_user_pool_info.deposit_amount -= amount;
		} else {
			withdraw_amount = token_user_pool_info.deposit_amount;
			token_user_pool_info.deposit_amount = 0;
			
			assert!(token_user_pool_info.reward_amount >= amount - withdraw_amount, "should be smaller than current amount");
			token_user_pool_info.reward_amount -= amount - withdraw_amount;

			// Upgrade Total Reward
			let mut token_total_reward = self.total_rewards.get(&token_name).unwrap_or(0);
			token_total_reward -= amount - withdraw_amount;
			self.total_rewards.insert(&token_name, &token_total_reward);
		}
		token_user_pool_info.deposit_time = env::block_timestamp();
		
		// Log
		self.append_user_oper_history(wallet.clone(), token_name.clone(), withdraw_amount, false);
		self.append_token_amount_history(token_name.clone(), withdraw_amount, false);

		// Withdraw
		self.withdraw_pot(token_name.clone(), wallet.clone(), withdraw_amount.clone());

		self.withdraw_farm(wallet.clone(), token_name.clone(), withdraw_amount);
		
		// Save
		token_pool_info.insert(&wallet, &token_user_pool_info);
		self.pool_infos.insert(&token_name, &token_pool_info);
	}

	fn append_user_oper_history(&mut self, wallet: AccountId, token_name: String, amount: Balance, io: bool) {
		let mut user_oper_history = self.oper_historys.get(&wallet).unwrap_or(Vec::new());
		user_oper_history.push(UserOperInfo {
			wallet: wallet.clone(),
			token_name: token_name.clone(),
			amount: amount,
			io: io,
			txhash: env::block_index(),
			timestampe: env::block_timestamp(),
		});
		self.oper_historys.insert(&wallet, &user_oper_history);
	}

	fn get_user_deposit_amount_as_usd(&self, wallet: AccountId) -> Balance {
		let mut total_as_usd = 0;

		let all_tokens = self.token_infos.keys_as_vector().to_vec();
		for token_name in all_tokens.iter() {
			let token_info = self.get_token_info(token_name.clone());
			let token_pool_info = self.pool_infos.get(&token_name)
				.unwrap_or(UnorderedMap::new(b"get_user_deposit_amount_as_usd:token_pool_info".to_vec()));
			let token_user_pool_info = token_pool_info.get(&wallet)
				.unwrap_or(TokenUserPoolInfo {
					token_name: token_name.clone(),
					wallet: wallet.clone(),
					deposit_amount: 0,
					reward_amount: 0,
					deposit_time: env::block_timestamp(),
				});
			total_as_usd += token_user_pool_info.deposit_amount * token_info.price;
		}

		total_as_usd
	}

	fn add_token(&mut self, token_name: String, u_token_addr: AccountId, v_token_addr: AccountId, apr: u128) {
		assert!(self.token_infos.get(&token_name).is_none(), "Already Exists");
		
		self.token_count += 1;
		let token_info = TokenInfo {
			name: token_name.clone(),
			price: 0,
			u_addr: u_token_addr,
			v_addr: v_token_addr,
			apr: apr,
		};
		self.token_infos.insert(&token_name, &token_info);
	}

	fn save_token_prices(&mut self, token_prices: Vec<TokenPriceInfo>) {
		for each_token in token_prices.iter() {
			let mut token_info = self.token_infos.get(&each_token.name).unwrap();
			token_info.price = each_token.price.0;
			self.token_infos.insert(&each_token.name, &token_info);
		}
	}

	fn append_token_apr_history(&mut self, token_name: String, apr: u128) {
		let mut token_info = self.get_token_info(token_name.clone());
		token_info.apr = apr;
		self.token_infos.insert(&token_name, &token_info);

		let mut apr_history = self.apr_historys.get(&token_name).unwrap_or(Vec::new());
		apr_history.push(AprInfo {
			token_name: token_name.clone(),
			apr: apr,
			time: env::block_timestamp(),
		});

		self.apr_historys.insert(&token_name, &apr_history);
	}
	
	fn deposit_pot(&mut self, token_name: String, wallet: AccountId, amount: Balance, qualified: bool) {
		let mut token_pot_info = self.pot_infos.get(&token_name)
			.unwrap_or(UnorderedMap::new(b"deposit_pot:token_pot_info".to_vec()));
		let mut token_user_pot_info = token_pot_info.get(&wallet)
			.unwrap_or(TokenUserPotInfo {
				token_name: token_name.clone(),
				wallet: wallet.clone(),
				qualified_amount: 0,
				unqualified_amount: 0,
			});

		// Calc & Save
		if qualified {
			token_user_pot_info.qualified_amount += amount;
		} else {
			token_user_pot_info.unqualified_amount += amount;
		}

		token_pot_info.insert(&wallet, &token_user_pot_info);
		self.pot_infos.insert(&token_name, &token_pot_info);
	}

	fn withdraw_pot(&mut self, token_name: String, wallet: AccountId, amount: Balance) {
		let mut token_pot_info = self.pot_infos.get(&token_name)
			.unwrap_or(UnorderedMap::new(b"withdraw_pot:token_pot_info".to_vec()));
		let mut token_user_pot_info = token_pot_info.get(&wallet)
			.unwrap_or(TokenUserPotInfo {
				token_name: token_name.clone(),
				wallet: wallet.clone(),
				qualified_amount: 0,
				unqualified_amount: 0,
			});

		if token_user_pot_info.qualified_amount >= amount {
			token_user_pot_info.qualified_amount -= amount;
		} else {
			assert!(token_user_pot_info.unqualified_amount >= amount, "should be smaller than current amount");

			let prev_qualified_amount = token_user_pot_info.qualified_amount;
			token_user_pot_info.qualified_amount = 0;
			token_user_pot_info.unqualified_amount -= amount - prev_qualified_amount;
		}

		token_pot_info.insert(&wallet, &token_user_pot_info);
		self.pot_infos.insert(&token_name, &token_pot_info);
	}

	fn withdraw_farm(&mut self, wallet: AccountId, token_name: String, amount: Balance) {
		let current_time = env::block_timestamp();
		let farm_endtime = self.farm_start_time + FARM_PERIOD;
	
		// Check Condition
		assert!(!(self.farm_start_time == 0 || current_time < self.farm_start_time), "farm not started");
		assert!(farm_endtime > current_time, "wait");
	
		// Calc Current User All Tokens' Amount as USD
		let total_as_usd = self.get_user_deposit_amount_as_usd(wallet.clone());
		if total_as_usd > 0 {
			// Calc Withdraw Amount as USD
			let token_info = self.get_token_info(token_name.clone());
			let mut withdraw_as_usd = amount * token_info.price;

			if withdraw_as_usd > total_as_usd {
				withdraw_as_usd = total_as_usd;
			}
			
			let mut user_farm_info = self.farm_infos.get(&wallet)
				.unwrap_or(UserFarmInfo {
					wallet: wallet.clone(),
					amount: 0,
				});

			// Calc (old/new)*withdraw
			let withdraw_amount = withdraw_as_usd * user_farm_info.amount / total_as_usd;
			user_farm_info.amount -= withdraw_amount;
			
			// Save
			self.farm_infos.insert(&wallet, &user_farm_info);
			self.farm_total -= withdraw_amount;
		}
	}

	fn update_user_farm(&mut self, wallet: AccountId, amount: Balance) {
		let mut user_farm_info = self.farm_infos.get(&wallet)
			.unwrap_or(UserFarmInfo {
				wallet: wallet.clone(),
				amount: 0,
			});
		user_farm_info.amount = amount;

		self.farm_infos.insert(&wallet, &user_farm_info);
	}

	fn append_token_amount_history(&mut self, token_name: String, amount: Balance, bAdd: bool) {
		let mut token_amount_history = self.amount_historys.get(&token_name)
			.unwrap_or(Vec::new());

		if token_amount_history.len() == 0 {
			token_amount_history.push(TokenAmountInfo {
				token_name: token_name.clone(),
				deposit_amount: amount,
				reward_amount: 0,
				time: env::block_timestamp(),
			});
		} else {
			let last_index = token_amount_history.len() - 1;
			let mut last_amount_info = token_amount_history[last_index].clone();
			if bAdd {
				last_amount_info.deposit_amount += amount;
			} else {
				last_amount_info.deposit_amount -= amount;
			}
			last_amount_info.time = env::block_timestamp();
			last_amount_info.reward_amount = self.total_rewards.get(&token_name).unwrap_or(0);
	
			// Save
			token_amount_history.push(last_amount_info);
			if last_index > 50 {
				let mut retain = vec![true; token_amount_history.len()];
				retain[0] = false;
	
				let mut iter = retain.iter();
				token_amount_history.retain(|_| *iter.next().unwrap());
			}
		}

		self.amount_historys.insert(&token_name, &token_amount_history);
	}
}