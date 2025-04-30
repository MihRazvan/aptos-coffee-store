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

    // Add a new coffee to the shop
    public entry fun add_coffee(
        owner: &signer,
        name: String,
        price: u64,
        stock: u64
    ) acquires CoffeeShop {
        let owner_addr = signer::address_of(owner);

        // Check if the shop exists and is owned by the signer
        assert!(exists<CoffeeShop>(owner_addr), error::not_found(ERROR_SHOP_DOES_NOT_EXIST));

        let shop = borrow_global_mut<CoffeeShop>(owner_addr);
        assert!(shop.owner == owner_addr, error::permission_denied(ERROR_NOT_SHOP_OWNER));

        // Create a new coffee with incremented id
        let coffee_id = shop.coffee_counter + 1;
        let coffee = Coffee {
            id: coffee_id,
            name,
            price,
            stock,
        };

        // Add the coffee to the shop and increment the counter
        vector::push_back(&mut shop.coffees, coffee);
        shop.coffee_counter = coffee_id;
    }

    // View function to get all coffees in a shop
    #[view]
    public fun get_coffees(shop_addr: address): vector<Coffee> acquires CoffeeShop {
        assert!(exists<CoffeeShop>(shop_addr), error::not_found(ERROR_SHOP_DOES_NOT_EXIST));

        let shop = borrow_global<CoffeeShop>(shop_addr);
        shop.coffees
    }

    // Public getter functions for Coffee fields
    public fun get_coffee_id(coffee: &Coffee): u64 {
        coffee.id
    }

    public fun get_coffee_name(coffee: &Coffee): &String {
        &coffee.name
    }

    public fun get_coffee_price(coffee: &Coffee): u64 {
        coffee.price
    }

    public fun get_coffee_stock(coffee: &Coffee): u64 {
        coffee.stock
    }
}