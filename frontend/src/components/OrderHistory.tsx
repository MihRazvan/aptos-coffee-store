// src/components/OrderHistory.tsx
import { useCoffeeShop } from '@/context/CoffeeShopContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

export default function OrderHistory() {
    const { orders, isLoading } = useCoffeeShop();
    const { connected } = useWallet();

    if (!connected) {
        return (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                <p className="text-gray-500">Connect your wallet to view your order history</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                <p>Loading your orders...</p>
            </div>
        );
    }

    if (!Array.isArray(orders)) {
        return <div>Error: Orders data is not an array.</div>;
    }

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Orders</h2>

            {Array.isArray(orders) && orders.length === 0 ? (
                <p className="text-gray-500">You haven't placed any orders yet</p>
            ) : (
                Array.isArray(orders) && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coffee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {(orders || []).map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.coffeeName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {(order.price / 100).toFixed(2)} APT
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.transactionHash ? (
                                                <a
                                                    href={`https://explorer.aptoslabs.com/txn/${order.transactionHash}?network=devnet`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    View
                                                </a>
                                            ) : (
                                                "Processing..."
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
}