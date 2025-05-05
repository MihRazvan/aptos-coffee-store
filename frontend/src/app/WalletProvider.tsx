'use client';

import { AptosWalletAdapterProvider, useWallet } from '@aptos-labs/wallet-adapter-react';

function WalletConnectButton() {
    const { connected, account, connect, disconnect, wallets } = useWallet();

    if (!wallets || wallets.length === 0) {
        return <span>No Aptos wallets detected. Please install Petra or another wallet.</span>;
    }

    if (connected && account) {
        return (
            <button onClick={disconnect}>
                {account.address.toString().slice(0, 6)}...{account.address.toString().slice(-4)} (Disconnect)
            </button>
        );
    }

    // Find Petra wallet
    const petra = wallets.find(w => w.name === "Petra");

    return (
        <button
            onClick={async () => {
                if (petra) {
                    await connect(petra.name);
                } else {
                    await connect(wallets[0].name);
                }
            }}
        >
            Connect Wallet
        </button>
    );
}

export default function WalletProvider({ children }: { children: React.ReactNode }) {
    return (
        <AptosWalletAdapterProvider>
            <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                <WalletConnectButton />
            </div>
            {children}
        </AptosWalletAdapterProvider>
    );
}