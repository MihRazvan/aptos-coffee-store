'use client';

import { ReactNode, useEffect } from 'react';
import {
    AptosWalletAdapterProvider,
    useWallet
} from '@aptos-labs/wallet-adapter-react';
import { Types } from 'aptos';

// Import wallet adapters (these are created automatically based on the TS SDK)
import { PetraWallet } from "@aptos-labs/wallet-adapter-react";

interface AptosWalletProviderProps {
    children: ReactNode;
}

export function AptosWalletProvider({ children }: AptosWalletProviderProps) {
    // Set up wallets that will be available to connect
    const wallets = [
        new PetraWallet()
    ];

    return (
        <AptosWalletAdapterProvider
            plugins={wallets}
            autoConnect={true}
        >
            {children}
        </AptosWalletAdapterProvider>
    );
}

export function WalletConnectButton() {
    const { connected, account, connect, disconnect } = useWallet();

    // Check if wallet is available
    useEffect(() => {
        console.log("Wallet connected status:", connected);
        if (connected && account) {
            console.log("Connected account:", account.address);
        }
    }, [connected, account]);

    if (connected && account) {
        return (
            <button
                onClick={disconnect}
                className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-3 py-1 rounded-full flex items-center text-sm"
            >
                {account.address.slice(0, 6)}...{account.address.slice(-4)}
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>
        );
    }

    return (
        <button
            onClick={() => connect()}
            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-3 py-1 rounded-full text-sm"
        >
            Connect Wallet
        </button>
    );
}