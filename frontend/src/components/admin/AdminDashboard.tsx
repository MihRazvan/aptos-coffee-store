// src/components/admin/AdminDashboard.tsx
import { useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import CoffeeItem from './CoffeeItem';
import WithdrawFunds from './WithdrawFunds';

export default function AdminDashboard() {
    const { coffees, isLoading, error, fetchCoffees } = useAdmin();
    const { connected, account } = useWallet();

    useEffect(() => {
        if (connected && account) {
            fetchCoffees();
        }
    }, [connected, account, fetchCoffees]);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your coffee shop items and withdraw funds
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <span className="px-4 py-2 rounded-full bg-green-100 text-green-800">
                            Connected: {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
                        </span>
                    </div>
                </div>

                <WithdrawFunds />

                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Coffees</h3>

                    <div className="flex flex-col">
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Coffee
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stock
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Edit</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {coffees.map((coffee) => (
                                                <CoffeeItem
                                                    key={coffee.id}
                                                    id={coffee.id}
                                                    name={coffee.name}
                                                    price={coffee.price}
                                                    stock={coffee.stock}
                                                    image={coffee.image}
                                                    available={coffee.available}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}