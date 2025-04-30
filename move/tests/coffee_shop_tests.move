#[test_only]
module coffee_shop::coffee_shop_tests {
    use std::signer;
    use aptos_framework::account;
    use coffee_shop::coffee_shop;
    use std::string::{Self, String};
    use std::vector;

    #[test(shop_owner = @0x42)]
    public fun test_initialize_shop(shop_owner: &signer) {
        // Create test account
        account::create_account_for_test(signer::address_of(shop_owner));

        // Initialize coffee shop
        coffee_shop::initialize_shop(shop_owner);

        // Testing successful initialization is implicit - if the function doesn't abort, it worked
    }

    #[test(shop_owner = @0x42)]
    public fun test_add_coffee(shop_owner: &signer) {
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
}