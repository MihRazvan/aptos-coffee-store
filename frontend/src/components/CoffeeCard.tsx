'use client';

import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useCoffeeShop } from '@/context/CoffeeShopContext';
import toast from 'react-hot-toast';

interface CoffeeCardProps {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    isCredit?: boolean;
}

export default function CoffeeCard({ id, name, price, stock, image, isCredit = false }: CoffeeCardProps) {
    const { buyCoffee, isLoading } = useCoffeeShop();
    const { connected } = useWallet();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const imageFile = image?.endsWith('.svg') ? image : `${name.toLowerCase()}.svg`;
    const placeholderDescription = "A delicious coffee made with care. Enjoy a perfect cup every time!";

    const handlePurchaseClick = async () => {
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
            await buyCoffee({ id, name, price, stock, image, available: true });
            toast.success(`Successfully purchased ${name}!`);
        } catch (error) {
            toast.error('Failed to purchase item');
            console.error(error);
        } finally {
            setIsPurchasing(false);
        }
    };

    return (
        <div className="card bg-white shadow-xl rounded-xl p-6 flex flex-col items-center min-h-[340px]">
            <figure className="mb-4">
                <img
                    src={`/icons/${imageFile}`}
                    alt={name}
                    className="object-contain h-24 w-24"
                />
            </figure>
            <div className="card-body items-center text-center p-0">
                <h3 className="card-title text-2xl text-royal-blue mb-2">{name}</h3>
                <div className="text-xs text-dark-gray mb-2 font-medium">
                    {stock > 0 ? `${stock} in stock` : <span className="text-brand-pink">Out of stock</span>}
                </div>
                <div className="text-sm text-dark-gray mb-4">{placeholderDescription}</div>
                <div className="flex flex-row gap-2 mb-4">
                    <button className="btn btn-xs btn-outline">Small</button>
                    <button className="btn btn-xs btn-outline">Medium</button>
                    <button className="btn btn-xs btn-outline">Large</button>
                </div>
                <div className="flex items-center justify-between w-full mb-4">
                    <span className="text-xl font-bold text-brand-pink">
                        {(price / 100).toFixed(2)} APT
                    </span>
                </div>
                <button
                    onClick={handlePurchaseClick}
                    disabled={isPurchasing || isLoading || stock <= 0}
                    className="btn btn-primary w-full"
                >
                    {isPurchasing ? "Processing..." : "Buy"}
                </button>
            </div>
        </div>
    );
}