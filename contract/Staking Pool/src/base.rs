use near_sdk::{AccountId, Balance};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::json_types::U128;

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AprInfo {
    pub token_name: String,
	pub apr: u128,
    pub time: u64,
}
pub type TokenAprHistory = Vec<AprInfo>;

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenUserPoolInfo {
    pub token_name: String,
	pub wallet: AccountId,
	pub deposit_amount: Balance,
	pub reward_amount: Balance,
    pub deposit_time: u64
}
pub type TokenPoolInfo = UnorderedMap<AccountId, TokenUserPoolInfo>;

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenUserPotInfo {
    pub token_name: String,
    pub wallet: AccountId,
    pub qualified_amount: Balance,
    pub unqualified_amount: Balance,
}
pub type TokenPotInfo = UnorderedMap<AccountId, TokenUserPotInfo>;

pub const FARM_AMOUNT: Balance = 114_000_000;
// pub const FARM_PERIOD: u64 = 5_184_000;         //60 days in second
pub const FARM_PERIOD: u64 = 1152921504606846976;

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct UserFarmInfo {
    pub wallet: AccountId,
	pub amount: Balance,
}

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenAmountInfo {
    pub token_name: String,
	pub deposit_amount: Balance,
    pub reward_amount: Balance,
    pub time: u64,
}
pub type TokenAmountHistory = Vec<TokenAmountInfo>;

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenInfo {
    pub name: String,
	pub price: u128,
    pub u_addr: AccountId,
    pub v_addr: AccountId,
    pub apr: u128,
}

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenPriceInfo {
    pub name: String,
	pub price: U128,
}

#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct UserOperInfo {
    pub wallet: AccountId,
    pub token_name: String,
    pub amount: Balance,
    pub io: bool,   // true: deposit, false: withdraw
    pub txhash: u64,
    pub timestampe: u64,
}
pub type UserOperHistory = Vec<UserOperInfo>;
