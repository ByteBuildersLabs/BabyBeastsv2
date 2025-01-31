%lang starknet

use dojo::models::Beast;

struct Player {
    address: felt,
    balance: felt,
    tamagotchis: Array<Beast>,
}

@storage_var
func player_data(player_address: felt) -> (Player) {
}

@external
func add_player(player_address: felt, balance: felt) {
    // Check if the player already exists
    let (player) = player_data.read(player_address);
    assert player.address == 0, 'Player already exists';
    // Create new player
    let new_player = Player(player_address, balance, ArrayTrait::new());
    player_data.write(player_address, new_player);
    return ();
}

@external
func assign_tamagotchi(player_address: felt, beast_id: felt, specie: u32, hunger: u32, max_hunger: u32, energy: u32, max_energy: u32, happiness: u32, max_happiness: u32, hygiene: u32, max_hygiene: u32, attack: u32, defense: u32, speed: u32, level: u32, experience: u32, next_level_experience: u32) {
    // Check if the player exists
    let (mut player) = player_data.read(player_address);
    assert player.address != 0, 'Player does not exist';

    // Check if the Beast (Tamagotchi) already exists for the player
    for beast in player.tamagotchis {
        assert beast.beast_id != beast_id, 'Tamagotchi already assigned';
    }

    // Create new Beast and assign it to the player
    let new_beast = Beast {
        beast_id,
        player: player_address,
        specie,
        is_alive: true,
        is_awake: true,
        hunger,
        max_hunger,
        energy,
        max_energy,
        happiness,
        max_happiness,
        hygiene,
        max_hygiene,
        attack,
        defense,
        speed,
        level,
        experience,
        next_level_experience,
    };

    // Append the new Beast (Tamagotchi) to the player's list
    ArrayTrait::append(ref player.tamagotchis, new_beast);
    player_data.write(player_address, player);

    return ();
}
