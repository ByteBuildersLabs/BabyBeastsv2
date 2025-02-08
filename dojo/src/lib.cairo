mod constants;
mod store;

mod systems {
    mod actions;
}

mod models {
    mod beast;
    mod beast_stats;
    mod beast_status;
    mod player;
    mod food;
}

mod types {
    mod food;
}

mod utils {
    mod random;
}

#[cfg(test)]
mod tests {
    mod test_random;
    mod test_actions;
    mod test_player;
}
