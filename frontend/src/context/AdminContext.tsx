// src/context/AdminContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Types } from 'aptos';
import axios from 'axios';

interface Coffee {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    available: boolean;
}

interface AdminContextType {
    coffees: Coffee[];
    isLoading: boolean;
    error: string | null;
    fetchCoffees: () => Promise<void>;
    updateCoffeePrice: (id: number, price: number) => Promise<void>;
    updateCoffeeStock: (id: number, stock: number) => Promise<void>;
    updateCoffeeAvailability: (id: number, available: boolean) => Promise<void>;
    withdrawFunds: (amount: number) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const { account, signAndSubmitTransaction } = useWallet();
    const [coffees, setCoffees] = useState<Coffee[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS;

    const fetchCoffees = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${apiUrl}/coffees/admin`);
            setCoffees(response.data);
        } catch (err) {
            setError('Failed to fetch coffees');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Update coffee price in both backend and blockchain
    const updateCoffeePrice = async (id: number, price: number) => {
        if (!account?.address) {
            setError('Please connect your wallet');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. Update in backend
            await axios.patch(`${apiUrl}/coffees/${id}`, { price });

            // 2. Update in blockchain
            const payload: Types.TransactionPayload = {
                type: "entry_function_payload",
                function: `${moduleAddress}::coffee_shop::update_coffee_price`,
                type_arguments: [],
                arguments: [id, price]
            };

            await signAndSubmitTransaction(payload);

            // 3. Refresh coffees list
            await fetchCoffees();
        } catch (err: any) {
            setError(err.message || 'Failed to update coffee price');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Update coffee stock in both backend and blockchain
    const updateCoffeeStock = async (id: number, stock: number) => {
        if (!account?.address) {
            setError('Please connect your wallet');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. Update in backend
            await axios.patch(`${apiUrl}/coffees/${id}/stock`, { stock });

            // 2. Update in blockchain
            const payload: Types.TransactionPayload = {
                type: "entry_function_payload",
                function: `${moduleAddress}::coffee_shop::update_coffee_stock`,
                type_arguments: [],
                arguments: [id, stock]
            };

            await signAndSubmitTransaction(payload);

            // 3. Refresh coffees list
            await fetchCoffees();
        } catch (err: any) {
            setError(err.message || 'Failed to update coffee stock');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Update coffee availability (backend only)
    const updateCoffeeAvailability = async (id: number, available: boolean) => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.patch(`${apiUrl}/coffees/${id}`, { available });
            await fetchCoffees();
        } catch (err: any) {
            setError(err.message || 'Failed to update coffee availability');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Withdraw funds from the contract
    const withdrawFunds = async (amount: number) => {
        if (!account?.address) {
            setError('Please connect your wallet');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const payload: Types.TransactionPayload = {
                type: "entry_function_payload",
                function: `${moduleAddress}::coffee_shop::withdraw_funds`,
                type_arguments: [],
                arguments: [amount]
            };

            await signAndSubmitTransaction(payload);
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to withdraw funds');
            console.error(err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoffees();
    }, []);

    const value = {
        coffees,
        isLoading,
        error,
        fetchCoffees,
        updateCoffeePrice,
        updateCoffeeStock,
        updateCoffeeAvailability,
        withdrawFunds,
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}