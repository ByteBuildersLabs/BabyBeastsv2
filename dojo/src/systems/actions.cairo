use babybeasts::models::Beast;

#[starknet::interface]
trait IActions<T> {
    fn spawn(ref self: T, specie: u32);
    fn decrease_stats(ref self: T);
    fn feed(ref self: T);
    fn sleep(ref self: T);
    fn awake(ref self: T);
    fn play(ref self: T);
    fn clean(ref self: T);
    fn revive(ref self: T);
}

#[dojo::contract]
pub mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address};
    use babybeasts::models::{Beast};
    use babybeasts::models::{BeastId};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState, specie: u32) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut initial_stats = Beast {
                player: player,
                beast_id: 0,
                specie: specie,
                is_alive: true,
                is_awake: true,
                hunger: 100,
                max_hunger: 100,
                energy: 100,
                max_energy: 100,
                happiness: 100,
                max_happiness: 100,
                hygiene: 100,
                max_hygiene: 100,
                attack: 5,
                defense: 5,
                speed: 5,
                level: 1,
                experience: 0,
                next_level_experience: 60,
            };

            let mut id: BeastId = world.read_model(1);
            if id.id == 1 {
                id.beast_id = id.beast_id + 1;
                world.write_model(@id);
                initial_stats.beast_id = id.beast_id;
            } else {
                create_initial_id(ref self);
                initial_stats.beast_id = 1;
            }
            world.write_model(@initial_stats);
        }

        fn decrease_stats(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                if beast.happiness == 0 || beast.hygiene == 0 {
                    beast.energy = beast.energy - 2;
                } else {
                    beast.energy = beast.energy - 1;
                }
                if beast.energy < 0 {
                    beast.energy = 0;
                }

                beast.hunger = beast.hunger - 2;
                if beast.hunger < 0 {
                    beast.hunger = 0;
                }

                beast.happiness = beast.happiness - 1;
                if beast.happiness < 0 {
                    beast.happiness = 0;
                }

                beast.hygiene = beast.hygiene - 1;
                if beast.hygiene < 0 {
                    beast.hygiene = 0;
                }

                if beast.energy == 0 || beast.hunger == 0 {
                    beast.is_alive = false;
                }

                world.write_model(@beast);
            }
        }

        fn feed(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.hunger = beast.hunger + 30;
                if beast.hunger > beast.max_hunger {
                    beast.hunger = beast.max_hunger;
                }
                beast.energy = beast.energy + 10;
                if beast.energy > beast.max_energy {
                    beast.energy = beast.max_energy;
                }
                world.write_model(@beast);
            }
        }

        fn sleep(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.energy = beast.energy + 40;
                if beast.energy > beast.max_energy {
                    beast.energy = beast.max_energy;
                }
                beast.happiness = beast.happiness + 10;
                if beast.happiness > beast.max_happiness {
                    beast.happiness = beast.max_happiness;
                }
                beast.is_awake = false;
                world.write_model(@beast);
            }
        }

        fn awake(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.is_awake = true;
                world.write_model(@beast);
            }
        }

        fn play(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.happiness = beast.happiness + 30;
                if beast.happiness > beast.max_happiness {
                    beast.happiness = beast.max_happiness;
                }
                beast.energy = beast.energy - 20;
                beast.hunger = beast.hunger - 10;

                beast.experience = beast.experience + 10;
                if beast.experience >= beast.next_level_experience {
                    beast.level = beast.level + 1;
                    beast.experience = 0;
                    beast.next_level_experience = beast.next_level_experience + 20;
                }
                world.write_model(@beast);
            }
        }

        fn clean(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == true {
                beast.hygiene = beast.hygiene + 40;
                if beast.hygiene > beast.max_hygiene {
                    beast.hygiene = beast.max_hygiene;
                }
                beast.happiness = beast.happiness + 10;
                if beast.happiness > beast.max_happiness {
                    beast.happiness = beast.max_happiness;
                }
                beast.experience = beast.experience + 10;
                if beast.experience >= beast.next_level_experience {
                    beast.level = beast.level + 1;
                    beast.experience = 0;
                    beast.next_level_experience = beast.next_level_experience + 20;
                    beast.attack = beast.attack + 1;
                    beast.defense = beast.defense + 1;
                    beast.speed = beast.speed + 1;
                }
                world.write_model(@beast);
            }
        }

        fn revive(ref self: ContractState) {
            let mut world = self.world(@"babybeasts");
            let player = get_caller_address();
            let mut beast: Beast = world.read_model(player);

            if beast.is_alive == false {
                beast.is_alive = true;
                beast.hunger = 100;
                beast.energy = 100;
                beast.happiness = 100;
                beast.hygiene = 100;
                beast.experience = 0;

                if beast.attack < 0 {
                    beast.attack = 0;
                } else {
                    beast.attack = beast.attack - 1;
                }

                if beast.defense < 0 {
                    beast.defense = 0;
                } else {
                    beast.defense = beast.defense - 1;
                }

                if beast.speed < 0 {
                    beast.speed = 0;
                } else {
                    beast.speed = beast.speed - 1;
                }

                world.write_model(@beast);
            }
        }
    }
    fn create_initial_id(ref self: ContractState) {
        let mut world = self.world(@"babybeasts");
        let initial_id = BeastId {
            id: 1,
            beast_id: 1,
        };
        world.write_model(@initial_id);
    }
}
