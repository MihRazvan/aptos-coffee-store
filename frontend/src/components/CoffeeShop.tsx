'use client';

import { useCoffeeShop } from '@/context/CoffeeShopContext';
import CoffeeCard from './CoffeeCard';

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

    // Display 5 items for each section as shown in the screenshot
    const displayItems = coffees.slice(0, 5);

    return (
        <div className="bg-gray-100 py-4 px-4 rounded-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-center text-white py-3 rounded-lg bg-blue-500 flex items-center justify-center mb-4">
                    <span className="mr-2">💰</span>
                    CURRENCY SHOP
                </h2>

                <div className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold">COMMON CURRENCY</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {displayItems.map((coffee) => (
                        <CoffeeCard
                            key={coffee.id}
                            id={coffee.id}
                            name={coffee.name}
                            price={coffee.price}
                            stock={coffee.stock}
                            image={coffee.image}
                        />
                    ))}
                </div>

                <div className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold">CREDITS</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {displayItems.map((coffee) => (
                        <CoffeeCard
                            key={`credit-${coffee.id}`}
                            id={coffee.id}
                            name={coffee.name}
                            price={coffee.price}
                            stock={coffee.stock}
                            image={coffee.image}
                            isCredit={true}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}