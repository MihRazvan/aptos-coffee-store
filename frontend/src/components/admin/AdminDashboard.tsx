// src/components/admin/AdminDashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import CoffeeItem from './CoffeeItem';
import WithdrawFunds from './WithdrawFunds';
import { AptosClient } from 'aptos';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const GAS_BUFFER = 10_000;
const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1"; // or from env
const MODULE_ADDRESS = "0x42d6b2ad3ffcda85c6fd9b70861f56f35fd9a64cb94c16ac6546b37c23a7ff60"; // your module address
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase();

export default function AdminDashboard() {
    const { coffees, isLoading, error, fetchCoffees, updateCoffeePrice, updateCoffeeStock, withdrawFunds } = useAdmin();
    const { connected, account } = useWallet();
    const [shopFunds, setShopFunds] = useState('0');
    const [contractBalance, setContractBalance] = useState('0');

    useEffect(() => {
        if (connected && account) {
            console.log("Wallet connected, fetching coffees...");
            fetchCoffees();
        }
    }, [connected, account, fetchCoffees]);

    useEffect(() => {
        console.log("Fetching shop funds from:", `${apiUrl}/api/shop-funds`);
        fetch(`${apiUrl}/api/shop-funds`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched shop funds:", data.balance);
                setShopFunds(data.balance);
            });
    }, []);

    useEffect(() => {
        async function fetchContractBalance() {
            try {
                const client = new AptosClient(NODE_URL);
                const result = await client.view({
                    function: `${MODULE_ADDRESS}::simplified_coffee_shop::get_balance`,
                    type_arguments: [],
                    arguments: [MODULE_ADDRESS],
                });
                setContractBalance(result[0].toString());
                console.log("Fetched contract bookkeeping balance:", result[0].toString());
            } catch (e) {
                console.error("Error fetching contract balance:", e);
            }
        }
        fetchContractBalance();
    }, []);

    if (!connected) {
        console.log("Wallet not connected");
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
                <p className="text-gray-600 mb-4">Please connect your wallet to access the admin dashboard</p>
            </div>
        );
    }

    if (account?.address.toString().toLowerCase() !== ADMIN_ADDRESS) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Not authorized</h2>
                <p className="text-gray-600 mb-4">You must connect with the admin wallet to access this page.</p>
            </div>
        );
    }

    if (isLoading) {
        console.log("Admin dashboard is loading...");
        return (
            <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-2">Loading admin dashboard...</p>
            </div>
        );
    }

    if (error) {
        console.error("Admin dashboard error:", error);
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
                <h2>
                    Total Shop Revenue: {(Number(contractBalance) / 1e8).toFixed(4)} APT
                    <span className="text-gray-500 text-sm ml-2">({contractBalance} Octas)</span>
                </h2>
                <button
                    onClick={() => {
                        const withdrawAmount = Number(contractBalance);
                        if (withdrawAmount > 0) {
                            withdrawFunds(withdrawAmount);
                        } else {
                            alert("No shop revenue available to withdraw!");
                        }
                    }}
                >
                    Withdraw All
                </button>
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