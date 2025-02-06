#[derive(Copy, Drop, Serde)]
enum FoodType {
    Apple,
    Banana,
    Cherry,
}

impl IntoFoodTypeFelt252 of core::Into<FoodType, felt252> {
    #[inline(always)]
    fn into(self: FoodType) -> felt252 {
        match self {
            FoodType::Apple => 'Apple',
            FoodType::Banana => 'Banana',
            FoodType::Cherry => 'Cherry',
        }
    }
}

impl IntoFoodTypeU8 of core::Into<FoodType, u8> {
    #[inline(always)]
    fn into(self: FoodType) -> u8 {
        match self {
            FoodType::Apple => 0,
            FoodType::Banana => 1,
            FoodType::Cherry => 2,
        }
    }
}

