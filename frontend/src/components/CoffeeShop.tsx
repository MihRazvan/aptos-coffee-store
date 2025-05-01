'use client';

import { useCoffeeShop } from '@/context/CoffeeShopContext';
import CoffeeCard from './CoffeeCard';
import Image from 'next/image';

export default function CoffeeShop() {
    const { coffees, isLoading, error } = useCoffeeShop();

    if (isLoading) {
        return (
            <div className="text-center p-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-2">Loading items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-500">
                <p>Error: {error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    // Simple display of coffee items based on the screenshot
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
                ☕ COFFEE SHOP
            </h2>

            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">COFFEE MENU</h3>
                <div className="space-y-4">
                    {coffees.map((coffee) => (
                        <div key={coffee.id} className="flex items-center gap-4 bg-white p-4 rounded-md shadow-sm">
                            <div className="w-20 h-20 relative">
                                <Image
                                    src={`/images/${coffee.image || 'espresso.png'}`}
                                    alt={coffee.name}
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="font-bold">550</div>
                                <div>{coffee.name}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">${(coffee.price / 100).toFixed(2)}</span>
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold hover:bg-green-600"
                                    onClick={() => { }}
                                >
                                    BUY
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}