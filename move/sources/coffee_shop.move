// sources/coffee_shop.move
module coffee_shop::coffee_shop {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use std::vector;

    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_framework::timestamp;

    // Error constants
    const ERROR_SHOP_DOES_NOT_EXIST: u64 = 0;
    const ERROR_COFFEE_DOES_NOT_EXIST: u64 = 1;
    const ERROR_NOT_SHOP_OWNER: u64 = 2;
    const ERROR_INSUFFICIENT_STOCK: u64 = 3;

    // Event emit struct and store
    struct OrderEvent has drop, store {
        buyer: address,
        coffee_id: u64,
        coffee_name: String,
        price: u64,
        timestamp: u64,
    }

    struct EventStore has key {
        order_events: event::EventHandle<OrderEvent>,
    }

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

        // Create event store
        let event_store = EventStore {
            order_events: account::new_event_handle<OrderEvent>(owner),
        };

        // Store the shop and event store in the owner's account
        move_to(owner, shop);
        move_to(owner, event_store);
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

    // Buy a coffee
    public entry fun buy_coffee(
        buyer: &signer,
        shop_addr: address,
        coffee_id: u64
    ) acquires CoffeeShop, EventStore {
        // Check if the shop exists
        assert!(exists<CoffeeShop>(shop_addr), error::not_found(ERROR_SHOP_DOES_NOT_EXIST));

        let shop = borrow_global_mut<CoffeeShop>(shop_addr);

        // Find the coffee
        let len = vector::length(&shop.coffees);
        let i = 0;
        let coffee_found = false;
        let coffee_price = 0;
        let coffee_name = string::utf8(b"");
        let coffee_ref = &mut shop.coffees[0]; // Initialize with a default reference

        while (i < len) {
            let coffee = &mut shop.coffees[i];
            if (coffee.id == coffee_id) {
                // Check if there's enough stock
                assert!(coffee.stock > 0, error::resource_exhausted(ERROR_INSUFFICIENT_STOCK));

                coffee_price = coffee.price;
                coffee_name = coffee.name;
                coffee.stock = coffee.stock - 1;
                coffee_ref = coffee;
                coffee_found = true;
                break
            };
            i = i + 1;
        };

        // Ensure coffee was found
        assert!(coffee_found, error::not_found(ERROR_COFFEE_DOES_NOT_EXIST));

        // Process payment
        let buyer_addr = signer::address_of(buyer);

        // Transfer APT from buyer to shop owner
        coin::transfer<AptosCoin>(buyer, shop_addr, coffee_price);

        // Emit order event
        let event_store = borrow_global_mut<EventStore>(shop_addr);
        event::emit_event(&mut event_store.order_events, OrderEvent {
            buyer: buyer_addr,
            coffee_id,
            coffee_name,
            price: coffee_price,
            timestamp: timestamp::now_seconds(),
        });
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