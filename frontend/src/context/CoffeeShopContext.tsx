'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import axios from 'axios';
import toast from 'react-hot-toast';

// Configure Aptos client
const networkName = (process.env.NEXT_PUBLIC_APTOS_NETWORK || 'devnet') as Network;
const aptosConfig = new AptosConfig({
    network: networkName,
    fullnode: process.env.NEXT_PUBLIC_APTOS_NODE_URL
});
const aptosClient = new Aptos(aptosConfig);

// Types
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
    createdAt: string;
}

interface CoffeeShopContextType {
    coffees: Coffee[];
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchCoffees: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    purchaseCoffee: (coffeeId: number, price: number) => Promise<void>;
}

// Create the context
const CoffeeShopContext = createContext<CoffeeShopContextType | undefined>(undefined);

// Provider component
export function CoffeeShopProvider({ children }: { children: ReactNode }) {
    const { account, signAndSubmitTransaction } = useWallet();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

    const fetchCoffees = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching coffees from API:", `${apiUrl}/coffees`);
            const response = await axios.get(`${apiUrl}/coffees`);
            console.log("Coffee data:", response.data);
            setCoffees(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error fetching coffees:", err);
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
            const response = await axios.get(`${apiUrl}/orders/buyer?address=${account.address}`);
            setOrders(response.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const purchaseCoffee = async (coffeeId: number, price: number) => {
        if (!account?.address) throw new Error("Wallet not connected");

        setIsLoading(true);
        setError(null);
        try {
            const { data: order } = await axios.post(`${apiUrl}/orders`, {
                coffeeId,
                price,
                buyerAddress: account.address.toString(),
            });
            console.log("Order response:", order);

            const payload = {
                type: "entry_function_payload",
                function: `${moduleAddress}::coffee_shop::buy_coffee`,
                type_arguments: [],
                arguments: [moduleAddress, coffeeId],
            };
            console.log("Transaction payload:", payload);

            console.log("About to call signAndSubmitTransaction");
            const txResult = await signAndSubmitTransaction({
                sender: account.address,
                data: payload,
            });
            console.log("Transaction result:", txResult);

            await axios.patch(`${apiUrl}/orders/${order.id}/transaction`, {
                transactionHash: txResult.hash,
            });

            await fetchOrders();
            await fetchCoffees();
        } catch (err: any) {
            setError(err.message || 'Failed to purchase coffee');
            console.error("Error in purchaseCoffee:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch coffees on initial load
    useEffect(() => {
        fetchCoffees();
    }, []);

    // Fetch orders when account changes
    useEffect(() => {
        if (account?.address) {
            fetchOrders();
        }
    }, [account?.address]);

    const value = {
        coffees,
        orders,
        isLoading,
        error,
        fetchCoffees,
        fetchOrders,
        purchaseCoffee,
    };

    return <CoffeeShopContext.Provider value={value}>{children}</CoffeeShopContext.Provider>;
}

// Hook to use the context
export function useCoffeeShop() {
    const context = useContext(CoffeeShopContext);
    if (context === undefined) {
        throw new Error('useCoffeeShop must be used within a CoffeeShopProvider');
    }
    return context;
}