// frontend/src/app/admin/page.tsx
'use client';

import Header from "@/components/Header";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminProvider } from "@/context/AdminContext";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <AdminProvider>
                    <AdminDashboard />
                </AdminProvider>
            </main>
            <footer className="py-6 bg-blue-600 text-white text-center">
                <p>© {new Date().getFullYear()} Aptos Coffee Shop. All rights reserved.</p>
            </footer>
            <Toaster position="top-right" />
        </div>
    );
}