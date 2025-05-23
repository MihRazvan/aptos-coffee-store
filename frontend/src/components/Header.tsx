'use client';

import Link from 'next/link';

export default function Header() {
    return (
        <header className="max-w-4xl mx-auto py-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Aptos Coffee Shop</h1>
                <nav className="space-x-4">
                    <Link href="/" className="text-purple-600 hover:underline">
                        Shop
                    </Link>
                    <Link href="/admin" className="text-purple-600 hover:underline">
                        Admin
                    </Link>
                </nav>
            </div>
        </header>
    );
}