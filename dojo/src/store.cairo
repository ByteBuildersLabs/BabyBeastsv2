// Starknet imports
use starknet::{ContractAddress, get_caller_address};

// Dojo imports
use dojo::world::WorldStorage;
use dojo::model::ModelStorage;

// Models imports
use babybeasts::models::beast::{Beast};
use babybeasts::models::beast_stats::{BeastStats};
use babybeasts::models::beast_status::{BeastStatus};
use babybeasts::models::player::{Player};
use babybeasts::models::food::{Food};

// types import
use babybeasts::types::food::{FoodType};

// Constants import
use babybeasts::constants;

// Store struct.
#[derive(Copy, Drop)]
struct Store {
    world: WorldStorage,
}

//Implementation of the `StoreTrait` trait for the `Store` struct.
#[generate_trait]
impl StoreImpl of StoreTrait {
    #[inline(always)]
    fn new(world: WorldStorage) -> Store {
        Store { world: world }
    }

    // --------- Getters ---------
    #[inline(always)]
    fn read_player(self: Store) -> Beast {
        let player_address = get_caller_address();
        self.world.read_model(player_address)
    }

    #[inline(always)]
    fn read_beast(self: Store, beast_id: u32) -> Beast {
        let player_address = get_caller_address();
        self.world.read_model((player_address, beast_id))
    }

    #[inline(always)]
    fn read_food(self: Store, food_id: u32) -> Food {
        let player_address = get_caller_address();
        self.world.read_model((player_address, food_id))
    }

    // --------- Setters ---------
    #[inline(always)]
    fn write_player(mut self: Store, mut player: Player) {
        self.world.write_model(@player)
    }

    fn write_beast(mut self: Store, mut beast: Beast) {
        self.world.write_model(@beast)
    }

    fn write_food(mut self: Store, mut food: Food) {
        self.world.write_model(@food)
    }
    
    // --------- New entities ---------
    #[inline(always)]
    fn new_player(mut self: Store, beast_id: u32) {
        let caller = get_caller_address();

        let new_player = Player {
            address: caller, 
            current_beast_id: beast_id
        };

        self.world.write_model(@new_player)
    }

    #[inline(always)]
    fn new_apples(mut self: Store) {
        let caller = get_caller_address();

        let apples = Food {
            player: caller,
            id: FoodType::Apple.into(),
            name: FoodType::Apple.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@apples);
    }

    #[inline(always)]
    fn new_bananas(mut self: Store) {
        let caller = get_caller_address();

        let bananas = Food {
            player: caller,
            id: FoodType::Banana.into(),
            name: FoodType::Banana.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@bananas);
    }

    #[inline(always)]
    fn new_cherries(mut self: Store) {
        let caller = get_caller_address();

        let cherries = Food {
            player: caller,
            id: FoodType::Cherry.into(),
            name: FoodType::Cherry.into(),
            amount: constants::MAX_FOOD_AMOUNT
        };
        self.world.write_model(@cherries);
    }

    #[inline(always)]
    fn new_beast(mut self: Store, beast_id: u32, specie: u32) {
        let player = get_caller_address();

        let mut initial_beast_stats = BeastStats {
            beast_id: beast_id,
            attack: 5,
            defense: 5,
            speed: 5,
            level: 1,
            experience: 0,
            next_level_experience: 60,
        };

        let mut initial_beast_status = BeastStatus {
            beast_id: beast_id,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
        };

        let mut new_beast = Beast {
            player: player,
            beast_id: beast_id,
            specie: specie,
            status: initial_beast_status,
            stats: initial_beast_stats,
            evolved: false,
            vaulted: false
        };

        self.world.write_model(@new_beast);
    }

    // Delete
}