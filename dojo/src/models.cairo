use starknet::ContractAddress;

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Beast {
    #[key]
    pub player: ContractAddress,
    pub specie: u32,
    pub is_alive: bool,
    pub is_awake: bool,
    pub hunger: u32,
    pub max_hunger: u32,
    pub energy: u32,
    pub max_energy: u32,
    pub happiness: u32,
    pub max_happiness: u32,
    pub hygiene: u32,
    pub max_hygiene: u32,
    pub attack: u32,
    pub defense: u32,
    pub speed: u32,
    pub level: u32,
    pub experience: u32,
    pub next_level_experience: u32,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Score {
    #[key]
    pub player_id: ContractAddress,
    pub tamagotchi_id: ContractAddress,
    pub score: u32,
}