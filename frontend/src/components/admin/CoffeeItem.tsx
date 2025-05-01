// src/components/admin/CoffeeItem.tsx
import { useState } from 'react';
import Image from 'next/image';
import { useAdmin } from '@/context/AdminContext';
import toast from 'react-hot-toast';

interface CoffeeItemProps {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    available: boolean;
}

export default function CoffeeItem({ id, name, price, stock, image, available }: CoffeeItemProps) {
    const { updateCoffeePrice, updateCoffeeStock, updateCoffeeAvailability, isLoading } = useAdmin();

    const [isEditing, setIsEditing] = useState(false);
    const [newPrice, setNewPrice] = useState(price);
    const [newStock, setNewStock] = useState(stock);
    const [isAvailable, setIsAvailable] = useState(available);

    const handleSave = async () => {
        try {
            if (newPrice !== price) {
                await updateCoffeePrice(id, newPrice);
                toast.success(`Updated price for ${name}`);
            }

            if (newStock !== stock) {
                await updateCoffeeStock(id, newStock);
                toast.success(`Updated stock for ${name}`);
            }

            if (isAvailable !== available) {
                await updateCoffeeAvailability(id, isAvailable);
                toast.success(`Updated availability for ${name}`);
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update coffee:', error);
            toast.error('Failed to update coffee');
        }
    };

    const handleCancel = () => {
        setNewPrice(price);
        setNewStock(stock);
        setIsAvailable(available);
        setIsEditing(false);
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                        {image ? (
                            <Image
                                src={`/images/${image}`}
                                alt={name}
                                fill
                                className="object-cover rounded-full"
                            />
                        ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                ☕
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{name}</div>
                        <div className="text-sm text-gray-500">ID: {id}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(parseInt(e.target.value))}
                        className="border rounded p-1 w-20"
                        min="1"
                    />
                ) : (
                    <div className="text-sm text-gray-900">{(price / 100).toFixed(2)} APT</div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(parseInt(e.target.value))}
                        className="border rounded p-1 w-20"
                        min="0"
                    />
                ) : (
                    <div className="text-sm text-gray-900">{stock}</div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {isEditing ? (
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                    </label>
                ) : (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {available ? 'Available' : 'Unavailable'}
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {isEditing ? (
                    <div className="flex space-x-2 justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-indigo-600 hover:text-indigo-900"
                    >
                        Edit
                    </button>
                )}
            </td>
        </tr>
    );
}