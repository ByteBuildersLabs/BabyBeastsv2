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
struct TamagotchiStats {
    #[key]
    tamagotchi_id: u64,
    intelligence: u8,
    games_played: u32,
    consecutive_wins: u8,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
struct GameResult {
    #[key]
    player_id: ContractAddress,
    #[key]
    game_id: u64,
    score: u16,
    success: bool,
    completion_time: u64,
}
