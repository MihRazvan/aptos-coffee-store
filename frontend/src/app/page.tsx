// src/app/page.tsx
'use client';

import Header from "@/components/Header";
import CoffeeShop from "@/components/CoffeeShop";
import OrderHistory from "@/components/OrderHistory";
import { CoffeeShopProvider } from "@/context/CoffeeShopContext";

export default function Home() {
  return (
    <CoffeeShopProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <CoffeeShop />
          <OrderHistory />
        </main>
        <footer className="py-6 bg-blue-600 text-white text-center">
          <p>© {new Date().getFullYear()} Aptos Coffee Shop. All rights reserved.</p>
        </footer>
      </div>
    </CoffeeShopProvider>
  );
}