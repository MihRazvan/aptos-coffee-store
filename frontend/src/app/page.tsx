'use client';

import Header from "@/components/Header";
import CoffeeShop from "@/components/CoffeeShop";
import { CoffeeShopProvider } from "@/context/CoffeeShopContext";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <CoffeeShopProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <CoffeeShop />
        </main>
        <footer className="py-6 bg-blue-600 text-white text-center">
          <p>© {new Date().getFullYear()} Aptos Coffee Shop. All rights reserved.</p>
        </footer>
        <Toaster position="top-right" />
      </div>
    </CoffeeShopProvider>
  );
}