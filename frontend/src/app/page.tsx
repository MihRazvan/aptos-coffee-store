// src/app/page.tsx
'use client';

import CoffeeShop from "@/components/CoffeeShop";
import OrderHistory from "@/components/OrderHistory";
import { CoffeeShopProvider } from "@/context/CoffeeShopContext";

export default function Home() {
  return (
    <CoffeeShopProvider>
      <main className="w-full">
        <CoffeeShop />
        <OrderHistory />
      </main>
    </CoffeeShopProvider>
  );
}