import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "./WalletProvider";
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: "Aptos Coffee Shop",
  description: "Buy coffee with APT on Aptos blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex bg-light-gray min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-[260px] p-8">
            <WalletProvider>
              {children}
            </WalletProvider>
          </main>
        </div>
      </body>
    </html>
  );
}