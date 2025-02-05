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
    use super::{IMemoryGame};
    use core::num::traits::CheckedAdd;
    use core::cmp::min;
    use starknet::ContractAddress;
    use dojo::model::ModelStorage;
    use babybeasts::models::{TamagotchiStats, GameResult};
    use babybeasts::constants::{
        MAX_INTELLIGENCE, BASE_INTELLIGENCE_GAIN, STREAK_BONUS_MULTIPLIER, PERFECT_SCORE,
    };

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
            let mut stats: TamagotchiStats = world.read_model(tamagotchi_id);

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
            world.write_model(@stats);

            // Store game result
            let game_result = GameResult {
                player_id,
                game_id: stats.games_played.into(),
                score,
                success: correct,
                completion_time,
            };
            world.write_model(@game_result);

            (correct, score)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

#[cfg(test)]
mod tests {}
