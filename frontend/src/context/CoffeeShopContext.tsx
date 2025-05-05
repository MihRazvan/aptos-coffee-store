'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS; // Your Petra wallet address as string

interface Coffee {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    available: boolean;
}

interface Order {
    id: number;
    coffeeId: number;
    coffeeName: string;
    price: number;
    buyerAddress: string;
    transactionHash?: string;
    status: 'pending' | 'paid' | 'failed';
    createdAt: string;
}

interface CoffeeShopContextType {
    coffees: Coffee[];
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchCoffees: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    buyCoffee: (coffee: Coffee) => Promise<void>;
}

const CoffeeShopContext = createContext<CoffeeShopContextType | undefined>(undefined);

export function CoffeeShopProvider({ children }: { children: ReactNode }) {
    const { account, signAndSubmitTransaction, connected } = useWallet();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCoffees = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${apiUrl}/coffees`);
            console.log("Fetched coffees:", data);
            setCoffees(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to fetch coffees');
            setCoffees([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrders = async () => {
        if (!account?.address) return;
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${apiUrl}/orders/buyer`, {
                params: { address: account.address.toString() },
            });
            console.log("Fetched orders:", data);
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to fetch orders');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    // The new buy flow
    const buyCoffee = async (coffee: Coffee) => {
        console.log("buyCoffee called with", coffee);
        if (!connected || !account?.address) {
            console.log("Not connected or no account");
            toast.error('Please connect your wallet first');
            return;
        }
        if (!adminAddress) {
            console.log("Admin address missing");
            toast.error('Admin address is not set!');
            return;
        }
        if (typeof coffee.price !== 'number') {
            console.log("Invalid coffee price");
            toast.error('Coffee price is invalid!');
            return;
        }
        if (coffee.stock <= 0) {
            console.log("Out of stock");
            toast.error('Sorry, this item is out of stock');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            console.log("Posting order to backend...");
            // 1. Create order in backend
            const { data: order } = await axios.post(`${apiUrl}/orders`, {
                coffeeId: coffee.id,
                price: coffee.price,
                buyerAddress: account.address.toString(),
            });

            // 2. Prompt wallet to transfer APT to admin
            const payload = {
                type: "entry_function_payload",
                function: "0x1::coin::transfer",
                type_arguments: ["0x1::aptos_coin::AptosCoin"],
                arguments: [adminAddress, coffee.price.toString()],
            };

            console.log("Payload to signAndSubmitTransaction:", payload);

            console.log("signAndSubmitTransaction:", signAndSubmitTransaction);

            const txResult = await signAndSubmitTransaction({ data: payload as any });

            // 3. PATCH order with transaction hash
            await axios.patch(`${apiUrl}/orders/${order.id}/transaction`, {
                transactionHash: txResult.hash,
            });

            toast.success(`Successfully purchased ${coffee.name}!`);
            await fetchOrders();
            await fetchCoffees();
        } catch (err: any) {
            setError(err.message || 'Failed to purchase coffee');
            toast.error('Failed to purchase coffee');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoffees();
        if (account?.address) {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account?.address]);

    const value = {
        coffees,
        orders,
        isLoading,
        error,
        fetchCoffees,
        fetchOrders,
        buyCoffee,
    };

    return <CoffeeShopContext.Provider value={value}>{children}</CoffeeShopContext.Provider>;
}

export function useCoffeeShop() {
    const context = useContext(CoffeeShopContext);
    if (context === undefined) {
        throw new Error('useCoffeeShop must be used within a CoffeeShopProvider');
    }
    return context;
}