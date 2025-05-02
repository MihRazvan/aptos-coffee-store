module simplified_coffee_shop::simplified_coffee_shop {
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::signer;
    use aptos_framework::event;
    use aptos_framework::account;

    struct PaymentEvent has drop, store {
        payer: address,
        amount: u64,
        timestamp: u64,
    }

    struct EventStore has key {
        payment_events: event::EventHandle<PaymentEvent>,
    }

    struct ShopFunds has key {
        balance: u64,
        admin: address,
    }

    // Initialize the shop (admin only)
    public entry fun initialize_shop(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<ShopFunds>(admin_addr), 1);
        move_to(admin, ShopFunds { balance: 0, admin: admin_addr });
        move_to(admin, EventStore { payment_events: account::new_event_handle<PaymentEvent>(admin) });
    }

    // Pay to the shop (anyone)
    public entry fun pay(payer: &signer, admin_addr: address, amount: u64) acquires ShopFunds, EventStore {
        assert!(exists<ShopFunds>(admin_addr), 2);
        coin::transfer<AptosCoin>(payer, admin_addr, amount);

        let shop = borrow_global_mut<ShopFunds>(admin_addr);
        shop.balance = shop.balance + amount;

        let event_store = borrow_global_mut<EventStore>(admin_addr);
        event::emit_event(&mut event_store.payment_events, PaymentEvent {
            payer: signer::address_of(payer),
            amount,
            timestamp: aptos_framework::timestamp::now_seconds(),
        });
    }

    // Withdraw funds (admin only)
    public entry fun withdraw(admin: &signer, amount: u64) acquires ShopFunds {
        let admin_addr = signer::address_of(admin);
        let shop = borrow_global_mut<ShopFunds>(admin_addr);
        assert!(shop.admin == admin_addr, 3);
        assert!(shop.balance >= amount, 4);

        shop.balance = shop.balance - amount;
        // The admin can now transfer out using their wallet
    }

    // View function to get shop balance
    #[view]
    public fun get_balance(admin_addr: address): u64 acquires ShopFunds {
        if (exists<ShopFunds>(admin_addr)) {
            let shop = borrow_global<ShopFunds>(admin_addr);
            shop.balance
        } else {
            0
        }
    }
}