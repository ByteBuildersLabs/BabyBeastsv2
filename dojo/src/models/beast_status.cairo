// Starknet import
use starknet::ContractAddress;

// Model imports
use babybeasts::models::beast_stats::{BeastStats};

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct BeastStatus {
    #[key]
    pub beast_id: u32,
    pub is_alive: bool,
    pub is_awake: bool,
    pub hunger: u32,
    pub energy: u32,
    pub happiness: u32,
    pub hygiene: u32,
}
