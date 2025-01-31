use babybeasts::models::{TamagotchiStats, GameResult};
use babybeasts::constants::{
    MAX_INTELLIGENCE, BASE_INTELLIGENCE_GAIN, STREAK_BONUS_MULTIPLIER, PERFECT_SCORE,
};
use starknet::ContractAddress;

#[starknet::interface]
trait IMemoryGame<TContractState> {
    fn validate_sequence(
        self: @TContractState,
        player_id: ContractAddress,
        tamagotchi_id: u64,
        input_sequence: Array<u8>,
        target_sequence: Array<u8>,
        completion_time: u64,
    ) -> (bool, u16);
}

#[dojo::contract]
mod MemoryGame {
    use super::*;
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;

    #[abi(embed_v0)]
    impl MemoryGameImpl of IMemoryGame<ContractState> {
        fn validate_sequence(
            self: @ContractState,
            player_id: ContractAddress,
            tamagotchi_id: u64,
            input_sequence: Array<u8>,
            target_sequence: Array<u8>,
            completion_time: u64,
        ) -> (bool, u16) {
            let mut world = self.world_default();

            assert(input_sequence.len() == target_sequence.len(), 'Invalid sequence length');

            let mut correct = true;
            let mut score: u16 = PERFECT_SCORE;

            // Compare sequences
            let mut i: usize = 0;
            loop {
                if i >= input_sequence.len() {
                    break;
                }

                if *input_sequence.at(i) != *target_sequence.at(i) {
                    correct = false;
                    score -= 200;
                }

                i += 1;
            };

            // Adjust score based on completion time (faster = better)
            let time_penalty = (completion_time / 1000).try_into().unwrap(); // Convert to seconds
            if time_penalty < 250 {
                score -= time_penalty;
            }

            // Update Tamagotchi stats
            let mut stats = world.read_model(tamagotchi_id)

            if correct {
                stats.consecutive_wins += 1;

                // Calculate intelligence gain with streak bonus
                let mut intelligence_gain = BASE_INTELLIGENCE_GAIN;
                if stats.consecutive_wins > 3 {
                    intelligence_gain *= STREAK_BONUS_MULTIPLIER;
                }

                // Apply intelligence gain with cap
                let new_intelligence = stats
                    .intelligence
                    .checked_add(intelligence_gain)
                    .unwrap_or(MAX_INTELLIGENCE);
                stats.intelligence = min(new_intelligence, MAX_INTELLIGENCE);
            } else {
                stats.consecutive_wins = 0;
            }

            stats.games_played += 1;

            // Store updated stats
            world.write_model(stats)

            // Store game result
            let game_result = GameResult {
                player_id,
                game_id: stats.games_played.into(),
                score,
                success: correct,
                completion_time,
            };
            world.write_model(game_result)

            (correct, score)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "starkludo". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"babybeasts")
        }
    }

    // Helper function to get minimum of two numbers
    fn min(a: u8, b: u8) -> u8 {
        if a < b {
            a
        } else {
            b
        }
    }
}

// Tests module
#[cfg(test)]
mod tests {
    use super::*;
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;

    #[test]
    fn test_perfect_sequence() {
        // Initialize test environment
        let world = setup_world();
        let contract = deploy_contract(world);

        let player = starknet::contract_address_const::<1>();
        let tamagotchi_id = 1_u64;

        // Create matching sequences
        let input = array![1_u8, 2_u8, 3_u8, 4_u8];
        let target = array![1_u8, 2_u8, 3_u8, 4_u8];

        let (success, score) = contract
            .validate_sequence(
                player, tamagotchi_id, input, target, 1000 // 1 second completion time
            );

        assert(success, 'Should succeed for perfect match');
        assert(score > 900, 'Should get high score');
    }

    #[test]
    fn test_incorrect_sequence() {
        // Initialize test environment
        let world = setup_world();
        let contract = deploy_contract(world);

        let player = starknet::contract_address_const::<1>();
        let tamagotchi_id = 1_u64;

        // Create non-matching sequences
        let input = array![1_u8, 2_u8, 4_u8, 3_u8];
        let target = array![1_u8, 2_u8, 3_u8, 4_u8];

        let (success, score) = contract
            .validate_sequence(player, tamagotchi_id, input, target, 1000);

        assert(!success, 'Should fail for mismatch');
        assert(score < 800, 'Should get reduced score');
    }
}
