@external
func test_add_player() {
    let starknet = Starknet::new();
    let contract_address: ContractAddress = starknet.deploy_contract('dojo/player.cairo');

    let player_address = 123;
    let balance = 1000;

    contract_address.add_player(player_address, balance);
    let (player) = contract_address.player_data(player_address).call();
    assert player.address == player_address;
    assert player.balance == balance;
    assert len(player.tamagotchis) == 0;
    return ();
}

@external
func test_assign_tamagotchi() {
    let starknet = Starknet::new();
    let contract_address: ContractAddress = starknet.deploy_contract('dojo/player.cairo');

    let player_address = 123;
    let balance = 1000;
    contract_address.add_player(player_address, balance);

    let beast_id = 789;
    let specie = 1;
    let hunger = 10;
    let max_hunger = 100;
    let energy = 50;
    let max_energy = 100;
    let happiness = 60;
    let max_happiness = 100;
    let hygiene = 30;
    let max_hygiene = 100;
    let attack = 20;
    let defense = 10;
    let speed = 15;
    let level = 1;
    let experience = 0;
    let next_level_experience = 100;

    contract_address.assign_tamagotchi(player_address, beast_id, specie, hunger, max_hunger, energy, max_energy, happiness, max_happiness, hygiene, max_hygiene, attack, defense, speed, level, experience, next_level_experience);

    let (player) = contract_address.player_data(player_address).call();
    assert len(player.tamagotchis) == 1;
    assert player.tamagotchis[0].beast_id == beast_id;
    assert player.tamagotchis[0].specie == specie;
    return ();
}

@external
func test_assign_tamagotchi_duplicate_beast_id() {
    let starknet = Starknet::new();
    let contract_address: ContractAddress = starknet.deploy_contract('dojo/player.cairo');

    let player_address = 123;
    let balance = 1000;
    contract_address.add_player(player_address, balance);

    let beast_id = 789;
    let specie = 1;
    let hunger = 10;
    let max_hunger = 100;
    let energy = 50;
    let max_energy = 100;
    let happiness = 60;
    let max_happiness = 100;
    let hygiene = 30;
    let max_hygiene = 100;
    let attack = 20;
    let defense = 10;
    let speed = 15;
    let level = 1;
    let experience = 0;
    let next_level_experience = 100;

    contract_address.assign_tamagotchi(player_address, beast_id, specie, hunger, max_hunger, energy, max_energy, happiness, max_happiness, hygiene, max_hygiene, attack, defense, speed, level, experience, next_level_experience);

    let success = contract_address.assign_tamagotchi(player_address, beast_id, specie, hunger, max_hunger, energy, max_energy, happiness, max_happiness, hygiene, max_hygiene, attack, defense, speed, level, experience, next_level_experience).call();
    assert success == 0, 'Expected failure due to duplicate beast_id';
    return ();
}
