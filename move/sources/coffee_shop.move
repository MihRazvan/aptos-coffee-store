module coffee_shop::coffee_shop {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;
    
    // Error constants
    const ERROR_SHOP_DOES_NOT_EXIST: u64 = 0;
    const ERROR_COFFEE_DOES_NOT_EXIST: u64 = 1;
    const ERROR_NOT_SHOP_OWNER: u64 = 2;
    const ERROR_INSUFFICIENT_STOCK: u64 = 3;
    
    // Basic data structures
    struct Coffee has store, drop, copy {
        id: u64,
        name: String,
        price: u64,
        stock: u64,
    }
    
    struct CoffeeShop has key {
        coffees: vector<Coffee>,
        owner: address,
        coffee_counter: u64,
    }
    
    // Initialize a new coffee shop
    public entry fun initialize_shop(owner: &signer) {
        let owner_addr = signer::address_of(owner);
        
        // Check if the shop already exists
        if (exists<CoffeeShop>(owner_addr)) {
            return
        };
        
        // Create a new shop
        let shop = CoffeeShop {
            coffees: vector::empty<Coffee>(),
            owner: owner_addr,
            coffee_counter: 0,
        };
        
        // Store the shop in the owner's account
        move_to(owner, shop);
    }
}