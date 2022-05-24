use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, setup_alloc, AccountId, Balance};
use std::time::SystemTime;

setup_alloc!();

// MoveInfo
#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct MoveInfo
{
    which_token: String,
    when: String,
    for_whom: AccountId,
    how_many: Balance,
}

impl MoveInfo
{
    #[allow(unused_variables)]
    pub fn new(which_token: String, when: SystemTime, for_whom: AccountId, how_many: Balance) -> Self {
        Self {
            which_token: which_token,
            when: ("2000-09-18").to_string(),
            for_whom: for_whom,
            how_many: how_many,
        }
    }
}

// VoucherTokenInfo & History
#[derive(Clone, Deserialize, Serialize, BorshDeserialize, BorshSerialize)]
#[serde(crate = "near_sdk::serde")]
pub struct VoucherTokenInfo
{
    token_name: String,
    // inout_history: Vec<MoveInfo>,
    current_balance: Balance,
}

impl VoucherTokenInfo
{
    pub fn new(token_name: String, amount: Balance) -> Self {
        let mut ft = Self {
            token_name: token_name,
            // inout_history: Vec::new(),
            current_balance: amount,
        };
        ft.mint(env::predecessor_account_id(), amount);
        ft
    }

    #[allow(unused_variables)]
    pub fn mint(&mut self, for_whom: AccountId, how_many: Balance) {
        // let token_name = self.token_name.clone();
        // self.inout_history.push(MoveInfo::new(token_name, SystemTime::now(), for_whom, how_many));

        self.current_balance += how_many;
    }

    pub fn get_balance(&self) -> Balance {
        self.current_balance
    }
}

// Voucher Token Manager
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct VoucherTokens
{
    pub tokens: UnorderedMap<String, VoucherTokenInfo>,
    pub greeting: String,
}

impl Default for VoucherTokens
{
    fn default() -> Self {
        Self {
            tokens: UnorderedMap::new(b"voucher_tokens".to_vec()),
            greeting: "Init Your Greeting".to_string(),
        }
    }
}

#[near_bindgen]
impl VoucherTokens
{
    pub fn init(&mut self, greeting: String) {
        self.tokens.clear();
        self.greeting = greeting;
    }

    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }
    
    pub fn make_token(&mut self, token_name: String, amount: Balance) {
        // assert!(!self.tokens.get(&token_name).unwrap(), "Already Exist");
        self.tokens.remove(&token_name);
        assert!(amount > 0, "must be bigger than 0");
        
        let new_token_info = VoucherTokenInfo::new(token_name.clone(), amount);
        self.tokens.insert(&token_name, &new_token_info);
    }

    pub fn mint_token(&mut self, which_token: String, for_whom: AccountId, how_many: Balance) {
        // assert!(self.tokens.get(&which_token).unwrap(), "Not Exist");
        assert!(how_many > 0, "must be bigger than 0");
        
        let mut chg_token_info = self.tokens.get(&which_token).unwrap();
        chg_token_info.mint(for_whom, how_many);
        self.tokens.insert(&which_token, &chg_token_info);
    }

    pub fn get_all_tokens(&self) -> Vec<VoucherTokenInfo> {
        self.tokens.values_as_vector().to_vec()
    }

    pub fn get_token_info(&self, which_token: String) -> VoucherTokenInfo {
        // assert!(self.tokens.get(&which_token).unwrap(), "Not Exist");

        let token_info = self.tokens.get(&which_token).unwrap();
        token_info
    }

    pub fn get_token_balance(&self, which_token: String) -> Balance {
        // assert!(self.tokens.get(&which_token).unwrap(), "Not Exist");

        let token_info = self.tokens.get(&which_token).unwrap();
        token_info.get_balance()
    }
}
