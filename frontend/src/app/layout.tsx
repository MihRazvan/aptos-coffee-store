import type { Metadata } from "next";
import "./globals.css";
import WalletProvider from "./WalletProvider";

export const metadata: Metadata = {
  title: "Aptos Coffee Shop",
  description: "Buy coffee with APT on Aptos blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}