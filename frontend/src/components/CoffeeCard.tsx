'use client';

import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useCoffeeShop } from '@/context/CoffeeShopContext';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CoffeeCardProps {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    isCredit?: boolean;
}

export default function CoffeeCard({ id, name, price, stock, image, isCredit = false }: CoffeeCardProps) {
    const { purchaseCoffee, isLoading } = useCoffeeShop();
    const { connected } = useWallet();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchaseClick = async () => {
        console.log("BUY button clicked for coffee", id, name);
        if (!connected) {
            toast.error('Please connect your wallet first');
            return;
        }
        if (stock <= 0) {
            toast.error('Sorry, this item is out of stock');
            return;
        }
        setIsPurchasing(true);
        try {
            await purchaseCoffee(id, price);
            toast.success(`Successfully purchased ${name}!`);
        } catch (error) {
            toast.error('Failed to purchase item');
            console.error(error);
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <div className="bg-white rounded p-3 shadow-sm">
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 relative mb-2">
                    {isCredit ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-teal-500 rounded-full">
                            <span className="text-white text-2xl font-bold">C</span>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            {image ? (
                                <Image
                                    src={`/images/${image}`}
                                    alt={name}
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            ) : (
                                <div className="text-yellow-500 text-4xl">🪙</div>
                            )}
                        </div>
                    )}
                </div>
                <div className="text-3xl font-bold mb-2 text-center">550</div>
                <div className="w-full flex justify-between items-center bg-blue-500 text-white rounded px-2 py-1">
                    <span className="font-bold text-lg">${(price / 100).toFixed(2)}</span>
                    <button
                        onClick={handlePurchaseClick}
                        disabled={isPurchasing || isLoading || stock <= 0}
                        className={`py-1 px-2 rounded font-semibold ${stock <= 0
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : isPurchasing || isLoading
                                ? 'bg-green-400 cursor-wait'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                    >
                        BUY
                    </button>
                </div>
            </div>
        </div>
    );
}