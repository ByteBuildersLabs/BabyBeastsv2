// Starknet import
use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Food {
    #[key]
    pub player: ContractAddress, 
    #[key]
    pub id: u8,
    pub name: felt252,
    pub amount: u32,
}
