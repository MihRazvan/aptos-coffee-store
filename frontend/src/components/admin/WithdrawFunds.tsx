// src/components/admin/WithdrawFunds.tsx
import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function WithdrawFunds() {
    const { withdrawFunds, isLoading } = useAdmin();
    const { account } = useWallet();
    const [amount, setAmount] = useState<number>(0);
    const [shopFunds, setShopFunds] = useState<number | null>(null);

    // Fetch shop funds when component mounts
    const fetchShopFunds = async () => {
        try {
            if (!account?.address) return;

            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.get(
                `${apiUrl}/shop-funds?address=${account.address}`
            );

            if (response.data && response.data.funds) {
                setShopFunds(response.data.funds);
            }
        } catch (error) {
            console.error('Failed to fetch shop funds:', error);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!account?.address) {
            toast.error('Please connect your wallet');
            return;
        }

        try {
            const success = await withdrawFunds(amount);
            if (success) {
                toast.success(`Successfully withdrew ${amount / 100} APT`);
                setAmount(0);
                // Refresh shop funds
                await fetchShopFunds();
            }
        } catch (error) {
            console.error('Failed to withdraw funds:', error);
            toast.error('Failed to withdraw funds');
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Withdraw Funds
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Withdraw funds from your coffee shop
                </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount (APT)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                                placeholder="0.00"
                                value={amount / 100 || ''}
                                onChange={(e) => setAmount(Math.floor(parseFloat(e.target.value) * 100) || 0)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">APT</span>
                            </div>
                        </div>
                    </div>
                    <div className="sm:self-end">
                        <button
                            type="button"
                            onClick={handleWithdraw}
                            disabled={isLoading || !amount || amount <= 0}
                            className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                ${isLoading || !amount || amount <= 0
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {isLoading ? 'Processing...' : 'Withdraw'}
                        </button>
                    </div>
                </div>

                {shopFunds !== null && (
                    <div className="mt-4 text-sm text-gray-700">
                        <p>Available shop funds: <span className="font-medium">{(shopFunds / 100).toFixed(2)} APT</span></p>
                    </div>
                )}
            </div>
        </div>
    );
}