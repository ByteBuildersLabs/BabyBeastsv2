// Starknet import
use starknet::ContractAddress;

// Models import
use babybeasts::models::beast_stats::{BeastStats};
use babybeasts::models::beast_status::{BeastStatus};

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Beast {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub beast_id: u32,
    pub specie: u32,
    pub status: BeastStatus,
    pub stats: BeastStats
}
