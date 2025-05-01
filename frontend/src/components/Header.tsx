'use client';

import Link from 'next/link';
import { WalletConnectButton } from './AptosWalletProvider';

export default function Header() {
    return (
        <header className="bg-blue-500 text-white py-2 px-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
                        <div className="text-yellow-500 text-2xl">🪙</div>
                    </div>
                    <h1 className="text-xl font-bold hidden sm:block">Aptos Currency Shop</h1>
                </div>

                <div className="flex space-x-4 items-center">
                    <nav className="hidden md:flex space-x-4">
                        <Link href="/" className="hover:underline">
                            Shop
                        </Link>
                        <Link href="/admin" className="hover:underline">
                            Admin
                        </Link>
                    </nav>

                    <WalletConnectButton />
                </div>
            </div>
        </header>
    );
}