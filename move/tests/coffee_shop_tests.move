#[test_only]
module coffee_shop::coffee_shop_tests {
    use std::signer;
    use aptos_framework::account;
    use coffee_shop::coffee_shop;
    
    #[test(shop_owner = @0x42)]
    public fun test_initialize_shop(shop_owner: &signer) {
        // Create test account
        account::create_account_for_test(signer::address_of(shop_owner));
        
        // Initialize coffee shop
        coffee_shop::initialize_shop(shop_owner);
        
        // Testing successful initialization is implicit - if the function doesn't abort, it worked
    }
}