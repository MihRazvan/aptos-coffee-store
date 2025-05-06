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
    const [tab, setTab] = useState<'inventory' | 'orders' | 'funds'>('inventory');

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

    const totalRevenue = (Number(contractBalance) / 1e8).toFixed(2);
    const productCount = coffees?.length || 0;

    // Example: orders array (replace with real data if available)
    const orders = [
        { id: 1, product: 'Espresso', quantity: 1, price: 0.34, customer: '0xabcd...7890', date: '05/05/2025', status: 'confirmed' },
        { id: 2, product: 'Cappuccino', quantity: 2, price: 1.02, customer: '0xabcd...7890', date: '05/05/2025', status: 'confirmed' },
    ];

    return (
        <div className="py-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-2">ADMIN DASHBOARD</h2>
                <p className="text-gray-500 mb-8">Manage your coffee shop inventory and orders.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-light-blue rounded-lg p-6 flex flex-col items-center">
                        <span className="text-gray-500">Total Revenue</span>
                        <span className="text-2xl font-bold text-brand-pink">{totalRevenue} APT</span>
                    </div>
                    <div className="bg-light-blue rounded-lg p-6 flex flex-col items-center">
                        <span className="text-gray-500">Products</span>
                        <span className="text-2xl font-bold text-brand-pink">{productCount}</span>
                    </div>
                    <div className="bg-light-blue rounded-lg p-6 flex flex-col items-center">
                        <span className="text-gray-500">Orders</span>
                        <span className="text-2xl font-bold text-brand-pink">—</span>
                    </div>
                </div>
                <div className="mb-6 flex gap-2">
                    <button
                        className={`px-4 py-2 rounded-t ${tab === 'inventory' ? 'bg-white font-bold border-b-2 border-brand-pink' : 'bg-light-gray text-gray-500'}`}
                        onClick={() => setTab('inventory')}
                    >
                        Inventory
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t ${tab === 'orders' ? 'bg-white font-bold border-b-2 border-brand-pink' : 'bg-light-gray text-gray-500'}`}
                        onClick={() => setTab('orders')}
                    >
                        Orders
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t ${tab === 'funds' ? 'bg-white font-bold border-b-2 border-brand-pink' : 'bg-light-gray text-gray-500'}`}
                        onClick={() => setTab('funds')}
                    >
                        Funds
                    </button>
                </div>
                <div className="bg-white rounded-b-lg shadow p-6">
                    {tab === 'inventory' && (
                        <>
                            <h3 className="text-xl font-semibold mb-4">Inventory</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
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
                        </>
                    )}
                    {tab === 'orders' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Orders</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4">{order.id}</td>
                                                <td className="px-6 py-4">{order.product}</td>
                                                <td className="px-6 py-4">{order.quantity}</td>
                                                <td className="px-6 py-4">{order.price.toFixed(2)} APT</td>
                                                <td className="px-6 py-4">{order.customer}</td>
                                                <td className="px-6 py-4">{order.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">{order.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {tab === 'funds' && (
                        <div className="flex flex-col items-center">
                            <div className="bg-light-blue rounded-lg p-8 w-full max-w-md flex flex-col items-center shadow">
                                <img src="/logo/logo.svg" alt="Aptos Coffee" className="h-16 mb-4" />
                                <h3 className="text-2xl font-bold mb-2">FUND MANAGEMENT</h3>
                                <p className="text-gray-600 mb-4">Manage your shop's funds and transactions.</p>
                                <div className="mb-4 w-full">
                                    <div className="flex justify-between w-full">
                                        <span className="font-semibold">Total Revenue:</span>
                                        <span className="text-brand-pink font-bold">{(Number(contractBalance) / 1e8).toFixed(2)} APT</span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <span className="font-semibold">Octas:</span>
                                        <span className="text-gray-700">{contractBalance} Octas</span>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary w-full"
                                    onClick={() => {
                                        const withdrawAmount = Number(contractBalance);
                                        if (withdrawAmount > 0) {
                                            withdrawFunds(withdrawAmount);
                                        } else {
                                            alert("No shop revenue available to withdraw!");
                                        }
                                    }}
                                    disabled={Number(contractBalance) === 0}
                                >
                                    Withdraw All
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}