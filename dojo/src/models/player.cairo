// Starknet import
use starknet::ContractAddress;

// Model imports
use babybeasts::models::beast::{Beast};

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub address: ContractAddress, 
    pub current_beast_id: u32
}
