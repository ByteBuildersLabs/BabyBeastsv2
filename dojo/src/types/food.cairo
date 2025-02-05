#[derive(Copy, Drop, Serde)]
enum FoodType {
    Apple,
    Cookie,
    Fish,
}

impl IntoFoodTypeFelt252 of core::Into<FoodType, felt252> {
    #[inline(always)]
    fn into(self: FoodType) -> felt252 {
        match self {
            FoodType::Apple => 'Apple',
            FoodType::Cookie => 'Cookie',
            FoodType::Fish => 'Fish',
        }
    }
}

impl IntoFoodTypeU8 of core::Into<FoodType, u8> {
    #[inline(always)]
    fn into(self: FoodType) -> u8 {
        match self {
            FoodType::Apple => 0,
            FoodType::Cookie => 1,
            FoodType::Fish => 2,
        }
    }
}

