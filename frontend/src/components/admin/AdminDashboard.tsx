// src/components/admin/AdminDashboard.tsx
import { useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

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
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                <p className="mb-6">
                    Connected: {account?.address.toString().slice(0, 6)}...{account?.address.toString().slice(-4)}
                </p>

                <h3 className="text-xl font-semibold mb-4">Manage Coffees</h3>
                <div className="space-y-4">
                    {(coffees || []).map((coffee) => (
                        <div key={coffee.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm">
                            <div>
                                <p className="font-bold">{coffee.name}</p>
                                <p>${(coffee.price / 100).toFixed(2)} - Stock: {coffee.stock}</p>
                            </div>
                            <div>
                                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}