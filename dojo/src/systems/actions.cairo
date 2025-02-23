// Types import
use tamagotchi::models::beast_status::BeastStatus;

// Interface definition
#[starknet::interface]
pub trait IActions<T> {
    // Player methods
    fn spawn_player(ref self: T);
    fn add_initial_food(ref self: T);
    fn set_current_beast(ref self: T, beast_id: u16);
    // Beast Methods
    fn spawn(ref self: T, specie: u8, beast_type: u8);
    fn decrease_status(ref self: T);
    fn feed(ref self: T, food_id: u8);
    fn sleep(ref self: T);
    fn awake(ref self: T);
    fn play(ref self: T);
    fn pet(ref self: T);
    fn clean(ref self: T);
    fn revive(ref self: T);
    // Other methods
    fn init_tap_counter(ref self: T);
    fn tap(ref self: T, specie: u8, beast_type: u8);
    fn get_timestamp_based_status(ref self: T) -> BeastStatus;
}

#[dojo::contract]
pub mod actions {
    // Starknet imports
    use starknet::{ContractAddress};
    use starknet::get_block_timestamp;
    use starknet::storage::{
        Map,   
        StoragePointerWriteAccess, 
        StoragePointerReadAccess, 
        StoragePathEntry
    };
    
    // Local import
    use super::{IActions};
    
    // Model imports
    #[allow(unused_imports)]
    use tamagotchi::models::beast::{Beast, BeastTrait};
    use tamagotchi::models::beast_status::{BeastStatus, BeastStatusTrait};
    use tamagotchi::models::player::{Player, PlayerAssert};
    use tamagotchi::models::food::{Food};

    // Constants import
    use tamagotchi::constants;

    // Store import
    use tamagotchi::store::{StoreTrait};

    // Dojo Imports
    #[allow(unused_imports)]
    use dojo::model::{ModelStorage};

    #[allow(unused_imports)]
    use dojo::event::EventStorage;

    // Storage
    #[storage]
    struct Storage {
        beast_counter: u16,
        tap_counter: Map<ContractAddress, u8>,
    }

    // Constructor
    fn dojo_init( ref self: ContractState) {
        self.beast_counter.write(1);
    }

    // Implementation of the interface methods
    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn_player(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            store.new_player();

            self.add_initial_food();
            self.init_tap_counter();
        }

        fn add_initial_food(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            store.init_player_food();
        }
        
        fn set_current_beast(ref self: ContractState, beast_id: u16) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);

            let mut player: Player = store.read_player();
            player.assert_exists();
            player.current_beast_id = beast_id;

            store.write_player(@player);
        }

        fn spawn(ref self: ContractState, specie: u8, beast_type: u8) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let current_beast_id = self.beast_counter.read();

            store.new_beast_stats(current_beast_id);
            store.new_beast_status(current_beast_id);
            store.new_beast(current_beast_id, specie, beast_type);

            self.beast_counter.write(current_beast_id+1);
        }

        fn decrease_status(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast_status = store.read_beast_status(beast_id);
            
            let current_timestamp = get_block_timestamp();
            beast_status.calculate_timestamp_based_status(current_timestamp)
        }

        fn feed(ref self: ContractState, food_id: u8) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);
            let mut food: Food = store.read_food(food_id);
           
            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                // Validate food is not negative
                if food.amount > 0 {
                    food.amount = food.amount - 1;
                    // Get stats accordingly to the beast favorite meals
                    let (hunger, happiness, energy) = beast.feed(food_id);
                    beast_status.hunger = beast_status.hunger + hunger;
                    beast_status.happiness = beast_status.happiness + happiness;
                    beast_status.energy = beast_status.energy + energy;

                    if beast_status.hunger > constants::MAX_HUNGER {
                        beast_status.hunger = constants::MAX_HUNGER;
                    }
                    if beast_status.energy > constants::MAX_ENERGY {
                        beast_status.energy = constants::MAX_ENERGY;
                    }
                    if beast_status.happiness > constants::MAX_HAPPINESS {
                        beast_status.happiness = constants::MAX_HAPPINESS;
                    }

                    store.write_food(@food);
                    store.write_beast(@beast);
                    store.write_beast_status(@beast_status);
                }
            }
        }

        fn sleep(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                beast_status.energy = beast_status.energy + constants::XL_UPDATE_POINTS;
                if beast_status.energy > constants::MAX_ENERGY {
                    beast_status.energy = constants::MAX_ENERGY;
                }
                beast_status.happiness = beast_status.happiness + constants::M_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }
                beast_status.is_awake = false;
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
            }
        }

        fn awake(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);

           // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                beast_status.is_awake = true;
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
            }
        }

        fn play(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            let mut beast_stats = store.read_beast_stats(beast_id);

            if beast_status.is_alive == true {
                // Increase happiness
                beast_status.happiness = beast_status.happiness + constants::XL_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }

                // Decrease energy safety avoiding overflow
                beast_status.energy = if beast_status.energy >= constants::L_UPDATE_POINTS {
                    beast_status.energy - constants::L_UPDATE_POINTS
                } else {
                    0
                };

                // Decrease hunger safety avoiding overflow
                beast_status.hunger = if beast_status.hunger >= constants::M_UPDATE_POINTS {
                    beast_status.hunger - constants::M_UPDATE_POINTS
                } else {
                    0
                };

                beast_stats.experience = beast_stats.experience + constants::S_UPDATE_POINTS;
                if beast_stats.experience >= beast_stats.next_level_experience {
                    beast_stats.level = beast_stats.level + 1;
                    // Evolution level reached
                    if beast_stats.level >= constants::MAX_BABY_LEVEL {
                        beast.evolved = true;
                        beast.vaulted = true;
                    }
                    beast_stats.experience = 0;
                    beast_stats.next_level_experience = beast_stats.next_level_experience + constants::NEXT_LEVEL_EXPERIENCE;
                }
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
                store.write_beast_stats(@beast_stats);
            }
        }

        fn pet(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            if beast_status.is_alive == true {
                beast_status.energy = beast_status.energy + constants::S_UPDATE_POINTS;
                if beast_status.energy > constants::MAX_ENERGY {
                    beast_status.energy = constants::MAX_ENERGY;
                }
                beast_status.happiness = beast_status.happiness + constants::S_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }
                beast_status.is_awake = false;
                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
            }
        }

        fn clean(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();

            let mut beast_stats = store.read_beast_stats(beast_id);

            if beast_status.is_alive == true {
                beast_status.hygiene = beast_status.hygiene + constants::XL_UPDATE_POINTS;
                if beast_status.hygiene > constants::MAX_HYGIENE{
                    beast_status.hygiene = constants::MAX_HYGIENE;
                }
                beast_status.happiness = beast_status.happiness + constants::L_UPDATE_POINTS;
                if beast_status.happiness > constants::MAX_HAPPINESS {
                    beast_status.happiness = constants::MAX_HAPPINESS;
                }
                beast_stats.experience = beast_stats.experience + constants::L_UPDATE_POINTS;
                if beast_stats.experience >= beast_stats.next_level_experience {
                    beast_stats.level = beast_stats.level + 1;
                    // Evolution level reached
                    if beast_stats.level >= constants::MAX_BABY_LEVEL {
                        beast.evolved = true;
                        beast.vaulted = true;
                    }
                    beast_stats.experience = 0;
                    beast_stats.next_level_experience = beast_stats.next_level_experience + constants::NEXT_LEVEL_EXPERIENCE;
                    beast_stats.attack = beast_stats.attack + 1;
                    beast_stats.defense = beast_stats.defense + 1;
                    beast_stats.speed = beast_stats.speed + 1;
                }
                // update beast clean status
                beast_status.update_clean_status(beast_status.hygiene);

                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
                store.write_beast_stats(@beast_stats);
            }
        }

        fn revive(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();
            let beast_id = player.current_beast_id;
            let mut beast: Beast = store.read_beast(beast_id);

            // Status retrieved by calculation
            let mut beast_status = self.get_timestamp_based_status();
            
            let mut beast_stats = store.read_beast_stats(beast_id);

            if beast_status.is_alive == false {
                beast_status.is_alive = true;
                beast_status.hunger = 100;
                beast_status.energy = 100;
                beast_status.happiness = 100;
                beast_status.hygiene = 100;
                beast_stats.experience = 0;

                // Reduce attack safety avoiding overflow
                beast_stats.attack = if beast_stats.attack >= 1 {
                    beast_stats.attack - 1
                } else {
                    0
                };

                // Reduce defense safety avoiding overflow
                beast_stats.defense = if beast_stats.defense >= 1 {
                    beast_stats.defense - 1
                } else {
                    0
                };

                // Reduce speed safety avoiding overflow
                beast_stats.speed = if beast_stats.speed >= 1 {
                    beast_stats.speed - 1
                } else {
                    0
                };

                store.write_beast(@beast);
                store.write_beast_status(@beast_status);
                store.write_beast_stats(@beast_stats);
            }
        }

        fn init_tap_counter(ref self: ContractState) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            self.tap_counter.entry(player.address).write(0);
        }


        fn tap(ref self: ContractState, specie: u8, beast_type: u8) {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            let current_tap_counter = self.tap_counter.entry(player.address).read();

            if current_tap_counter == constants::MAX_TAP_COUNTER {
                self.spawn(specie, beast_type);
                self.init_tap_counter();
            }

            self.tap_counter.entry(player.address).write(current_tap_counter+1);
        }

        fn get_timestamp_based_status(ref self: ContractState) -> BeastStatus {
            let mut world = self.world(@"tamagotchi");
            let store = StoreTrait::new(world);
            
            let player: Player = store.read_player();
            player.assert_exists();

            let beast_id = player.current_beast_id;
            let mut beast_status = store.read_beast_status(beast_id);
            
            let current_timestampt = get_block_timestamp();
            beast_status.calculate_timestamp_based_status(current_timestampt);

            beast_status
        }
    }
}
