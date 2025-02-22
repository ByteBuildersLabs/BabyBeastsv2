// Starknet import
use starknet::ContractAddress;

// Model imports
use babybeasts::models::beast_stats::{BeastStats};

// Types imports
use babybeasts::types::clean_status::{CleanStatus};

#[derive(Drop, Serde, IntrospectPacked,  Debug)]
#[dojo::model]
pub struct BeastStatus {
    #[key]
    pub beast_id: u16,
    pub is_alive: bool,
    pub is_awake: bool,
    pub hunger: u8,
    pub energy: u8,
    pub happiness: u8,
    pub hygiene: u8,
    pub clean_status: felt252,
}

#[generate_trait]
impl BeastStatusImpl of BeastStatusTrait {

    #[inline(always)]
    fn update_clean_status(ref self: BeastStatus, hygiene: u8){
            if hygiene>=90{
                self.clean_status = CleanStatus::Clean.into();
            }
            if hygiene>=70 && hygiene<90 {
                self.clean_status = CleanStatus::SlightlyDirty.into();
            }
            if hygiene>=50 && hygiene<70 {
                self.clean_status = CleanStatus::Dirty.into();
            }
            if hygiene>=30 && hygiene<50 {
                self.clean_status = CleanStatus::VeryDirty.into();
            }
            if hygiene>=10 && hygiene<30 {
                self.clean_status = CleanStatus::SuperDirty.into();
            }
            if hygiene<10 {
                self.clean_status = CleanStatus::Filthy.into();
            }
    }

}

#[cfg(test)]
mod tests {
    use super::BeastStatus;
    use babybeasts::types::clean_status::{CleanStatus};

    #[test]
    #[available_gas(300000)]
    fn test_beast_status_initialization() {
        let beast_status = BeastStatus {
            beast_id: 1,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
        };

        assert_eq!(beast_status.beast_id, 1, "Beast ID should be 1");
        assert!(beast_status.is_alive, "Beast should be alive initially");
        assert!(beast_status.is_awake, "Beast should be awake initially");
        assert_eq!(beast_status.hunger, 100, "Initial hunger should be 100");
        assert_eq!(beast_status.energy, 100, "Initial energy should be 100");
        assert_eq!(beast_status.happiness, 100, "Initial happiness should be 100");
        assert_eq!(beast_status.hygiene, 100, "Initial hygiene should be 100");
        assert_eq!(beast_status.clean_status, 'Clean', "Initial clean status should be Clean");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_status_boundaries() {
        let max_stats_beast = BeastStatus {
            beast_id: 4,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
        };

        assert!(max_stats_beast.hunger <= 100, "Hunger should not exceed 100");
        assert!(max_stats_beast.energy <= 100, "Energy should not exceed 100");
        assert!(max_stats_beast.happiness <= 100, "Happiness should not exceed 100");
        assert!(max_stats_beast.hygiene <= 100, "Hygiene should not exceed 100");
        assert_eq!(max_stats_beast.clean_status, 'Clean', "Initial clean status should be Clean");
    }

    #[test]
    #[available_gas(300000)]
    fn test_beast_unique_ids() {
        let beast1 = BeastStatus {
            beast_id: 1,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
        };

        let beast2 = BeastStatus {
            beast_id: 2,
            is_alive: true,
            is_awake: true,
            hunger: 100,
            energy: 100,
            happiness: 100,
            hygiene: 100,
            clean_status: CleanStatus::Clean.into(),
        };

        assert!(
            beast1.beast_id != beast2.beast_id,
            "Different beasts should have unique IDs"
        );
    }

    #[test]
    #[available_gas(300000)]
    fn test_deceased_beast_state() {
        let deceased_beast = BeastStatus {
            beast_id: 5,
            is_alive: false,
            is_awake: false,
            hunger: 0,
            energy: 0,
            happiness: 0,
            hygiene: 0,
            clean_status: CleanStatus::Clean.into(),
        };

        assert!(!deceased_beast.is_alive, "Beast should be deceased");
        assert!(!deceased_beast.is_awake, "Deceased beast should not be awake");
        assert_eq!(deceased_beast.hunger, 0, "Deceased beast should have 0 hunger");
        assert_eq!(deceased_beast.energy, 0, "Deceased beast should have 0 energy");
    }

    #[test]
    #[available_gas(300000)]
    fn test_prevent_negative_stats() {
        let low_stats_beast = BeastStatus {
            beast_id: 6,
            is_alive: true,
            is_awake: true,
            hunger: 1,
            energy: 1,
            happiness: 1,
            hygiene: 1,
            clean_status: CleanStatus::Clean.into(),
        };

        assert!(low_stats_beast.hunger >= 0, "Hunger should never be negative");
        assert!(low_stats_beast.energy >= 0, "Energy should never be negative");
        assert!(low_stats_beast.happiness >= 0, "Happiness should never be negative");
        assert!(low_stats_beast.hygiene >= 0, "Hygiene should never be negative");

        assert_eq!(
            low_stats_beast.energy, 1,
            "Energy should be maintainable at minimum value without going negative"
        );
    }

    #[test]
    #[available_gas(300000)]
    fn test_stats_lower_bound() {
        let zero_stats_beast = BeastStatus {
            beast_id: 7,
            is_alive: true,
            is_awake: true,
            hunger: 0,
            energy: 0,
            happiness: 0,
            hygiene: 0,
            clean_status: CleanStatus::Filthy.into(),
        };

        assert_eq!(zero_stats_beast.hunger, 0, "Minimum hunger should be 0");
        assert_eq!(zero_stats_beast.energy, 0, "Minimum energy should be 0");
        assert_eq!(zero_stats_beast.happiness, 0, "Minimum happiness should be 0");
        assert_eq!(zero_stats_beast.hygiene, 0, "Minimum hygiene should be 0");
        assert_eq!(zero_stats_beast.clean_status, 'Filthy', "Minimun clean status should be Filthy");
    }
}
