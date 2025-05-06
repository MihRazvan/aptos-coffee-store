'use client';

import { useCoffeeShop } from '@/context/CoffeeShopContext';
import CoffeeCard from './CoffeeCard';

export default function CoffeeShop() {
    const { coffees, isLoading, error } = useCoffeeShop();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-brand-pink"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-red-500">
                <p>Error: {error}</p>
                <button
                    className="btn btn-primary mt-4"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-brand-pink mb-10 mt-2">COFFEE MENU</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(coffees) && coffees.map((coffee) => (
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
        </div>
    );
}