import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AptosWalletProvider } from "@/components/AptosWalletProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aptos Coffee Shop",
  description: "Buy coffee with APT on Aptos blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AptosWalletProvider>
          {children}
          <Toaster position="top-right" />
        </AptosWalletProvider>
      </body>
    </html>
  );
}