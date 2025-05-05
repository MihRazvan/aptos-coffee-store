// src/components/admin/AdminDashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import CoffeeItem from './CoffeeItem';
import WithdrawFunds from './WithdrawFunds';

export default function AdminDashboard() {
    const { coffees, isLoading, error, fetchCoffees, updateCoffeePrice, updateCoffeeStock, withdrawFunds } = useAdmin();
    const { connected, account } = useWallet();
    const [shopFunds, setShopFunds] = useState('0');

    useEffect(() => {
        if (connected && account) {
            fetchCoffees();
        }
    }, [connected, account, fetchCoffees]);

    useEffect(() => {
        fetch('/api/shop-funds')
            .then(res => res.json())
            .then(data => setShopFunds(data.balance));
    }, []);

    if (!connected) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
                <p className="text-gray-600 mb-4">Please connect your wallet to access the admin dashboard</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-2">Loading admin dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                <p>Error: {error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => fetchCoffees()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                <p className="mb-6">
                    Connected: {account?.address.toString().slice(0, 6)}...{account?.address.toString().slice(-4)}
                </p>
                <h2>Shop Funds: {shopFunds} Octas</h2>
                <button onClick={() => withdrawFunds(Number(shopFunds))}>Withdraw All</button>
                <h3 className="text-xl font-semibold mb-4">Manage Coffees</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coffee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (APT)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {(coffees || []).map((coffee) => (
                                <CoffeeItem key={coffee.id} {...coffee} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}