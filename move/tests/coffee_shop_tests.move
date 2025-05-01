// tests/coffee_shop_tests.move
module coffee_shop::coffee_shop_tests {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;

    use aptos_framework::account;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::coin::{Self};
    use aptos_framework::timestamp;

    use coffee_shop::coffee_shop;

    #[test(aptos_framework = @0x1, shop_owner = @0x42, buyer = @0x43)]
    public fun test_initialize_shop(aptos_framework: &signer, shop_owner: &signer, buyer: &signer) {
        // Create test account
        account::create_account_for_test(signer::address_of(shop_owner));

        // Initialize coffee shop
        coffee_shop::initialize_shop(shop_owner);

        // Testing successful initialization is implicit - if the function doesn't abort, it worked
    }

    #[test(aptos_framework = @0x1, shop_owner = @0x42, buyer = @0x43)]
    public fun test_add_coffee(aptos_framework: &signer, shop_owner: &signer, buyer: &signer) {
        // Create test account
        let owner_addr = signer::address_of(shop_owner);
        account::create_account_for_test(owner_addr);

        // Initialize coffee shop
        coffee_shop::initialize_shop(shop_owner);

        // Add a coffee
        coffee_shop::add_coffee(
            shop_owner,
            string::utf8(b"Espresso"),
            250, // 2.50 APT
            10
        );

        // Verify the coffee was added
        let coffees = coffee_shop::get_coffees(owner_addr);
        assert!(vector::length(&coffees) == 1, 0);

        // Get the first coffee
        let coffee = vector::borrow(&coffees, 0);
        assert!(coffee_shop::get_coffee_id(coffee) == 1, 0);
        assert!(coffee_shop::get_coffee_name(coffee) == &string::utf8(b"Espresso"), 0);
        assert!(coffee_shop::get_coffee_price(coffee) == 250, 0);
        assert!(coffee_shop::get_coffee_stock(coffee) == 10, 0);
    }

    #[test(aptos_framework = @0x1, shop_owner = @0x42, buyer = @0x43)]
    public fun test_buy_coffee(aptos_framework: &signer, shop_owner: &signer, buyer: &signer) {
        // Set up timestamp for testing
        timestamp::set_time_has_started_for_testing(aptos_framework);

        // Set up AptosCoin for testing
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        // Create accounts and register with AptosCoin
        let owner_addr = signer::address_of(shop_owner);
        let buyer_addr = signer::address_of(buyer);

        account::create_account_for_test(owner_addr);
        account::create_account_for_test(buyer_addr);

        coin::register<AptosCoin>(shop_owner);
        coin::register<AptosCoin>(buyer);

        // Mint some coins for the buyer
        let coins = coin::mint<AptosCoin>(1000, &mint_cap);
        coin::deposit(buyer_addr, coins);

        // Initialize coffee shop
        coffee_shop::initialize_shop(shop_owner);

        // Add a coffee
        coffee_shop::add_coffee(
            shop_owner,
            string::utf8(b"Espresso"),
            250, // 2.50 APT
            10
        );

        // Initial balances
        let owner_balance_before = coin::balance<AptosCoin>(owner_addr);
        let buyer_balance_before = coin::balance<AptosCoin>(buyer_addr);

        // Buy the coffee
        coffee_shop::buy_coffee(buyer, owner_addr, 1);

        // Check balances after purchase
        let owner_balance_after = coin::balance<AptosCoin>(owner_addr);
        let buyer_balance_after = coin::balance<AptosCoin>(buyer_addr);

        // Owner should have received the coffee price
        assert!(owner_balance_after == owner_balance_before + 250, 0);
        // Buyer should have paid the coffee price
        assert!(buyer_balance_after == buyer_balance_before - 250, 0);

        // Check that stock was decremented
        let coffees = coffee_shop::get_coffees(owner_addr);
        let coffee = vector::borrow(&coffees, 0);
        assert!(coffee_shop::get_coffee_stock(coffee) == 9, 0); // Started with 10, now has 9

        // Clean up test resources
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @0x1, shop_owner = @0x42, buyer = @0x43)]
    public fun test_track_and_withdraw_funds(
        aptos_framework: &signer,
        shop_owner: &signer,
        buyer: &signer
    ) {
        // Set up timestamp for testing
        timestamp::set_time_has_started_for_testing(aptos_framework);

        // Set up AptosCoin for testing
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        // Create accounts and register with AptosCoin
        let owner_addr = signer::address_of(shop_owner);
        let buyer_addr = signer::address_of(buyer);

        account::create_account_for_test(owner_addr);
        account::create_account_for_test(buyer_addr);

        coin::register<AptosCoin>(shop_owner);
        coin::register<AptosCoin>(buyer);

        // Mint some coins for the buyer
        let coins = coin::mint<AptosCoin>(1000, &mint_cap);
        coin::deposit(buyer_addr, coins);

        // Initialize coffee shop
        coffee_shop::initialize_shop(shop_owner);

        // Add a coffee
        coffee_shop::add_coffee(
            shop_owner,
            string::utf8(b"Espresso"),
            250, // 2.50 APT
            10
        );

        // Buy the coffee
        coffee_shop::buy_coffee(buyer, owner_addr, 1);

        // Check that funds were tracked
        let shop_funds = coffee_shop::get_shop_funds(owner_addr);
        assert!(shop_funds == 250, 0);

        // Withdraw funds
        coffee_shop::withdraw_funds(shop_owner, 100);

        // Check that funds were decreased
        let shop_funds_after_withdrawal = coffee_shop::get_shop_funds(owner_addr);
        assert!(shop_funds_after_withdrawal == 150, 0);

        // Clean up test resources
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(shop_owner = @0x42)]
    public fun test_update_coffee_price_and_stock(shop_owner: &signer) {
        // Create test account
        let owner_addr = signer::address_of(shop_owner);
        account::create_account_for_test(owner_addr);

        // Initialize coffee shop
        coffee_shop::initialize_shop(shop_owner);

        // Add a coffee
        coffee_shop::add_coffee(
            shop_owner,
            string::utf8(b"Espresso"),
            250, // 2.50 APT
            10
        );

        // Update coffee price
        coffee_shop::update_coffee_price(shop_owner, 1, 300);

        // Update coffee stock
        coffee_shop::update_coffee_stock(shop_owner, 1, 15);

        // Verify updates
        let coffees = coffee_shop::get_coffees(owner_addr);
        let coffee = vector::borrow(&coffees, 0);
        assert!(coffee_shop::get_coffee_price(coffee) == 300, 0); // Price updated from 250 to 300
        assert!(coffee_shop::get_coffee_stock(coffee) == 15, 0);  // Stock updated from 10 to 15
    }
}