'use client';

import { ReactNode, useEffect } from 'react';
import { AptosWalletAdapterProvider, useWallet } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk'; // Changed from NetworkName to Network

interface AptosWalletProviderProps {
    children: ReactNode;
}

export function AptosWalletProvider({ children }: AptosWalletProviderProps) {
    return (
        <AptosWalletAdapterProvider
            plugins={[]}
            autoConnect={true}
        >
            {children}
        </AptosWalletAdapterProvider>
    );
}

export function WalletConnectButton() {
    const { connected, account, connect, disconnect, wallets } = useWallet();

    // Check if wallet is available
    useEffect(() => {
        console.log("Available wallets:", wallets);
        console.log("Wallet connected status:", connected);
        if (connected && account) {
            console.log("Connected account:", account.address);
        }
    }, [connected, account, wallets]);

    const handleConnect = async () => {
        try {
            await connect();
        } catch (err) {
            console.error("Failed to connect:", err);
            alert("Failed to connect to wallet. Please make sure you have Petra wallet installed and unlocked.");
        }
    };

    if (connected && account) {
        return (
            <button
                onClick={disconnect}
                className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-3 py-1 rounded-full flex items-center text-sm"
            >
                {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)}
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>
        );
    }

    return (
        <button
            onClick={handleConnect}
            className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-3 py-1 rounded-full text-sm"
        >
            Connect Wallet
        </button>
    );
}