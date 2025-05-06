// frontend/src/app/admin/page.tsx
'use client';

import AdminDashboard from "@/components/admin/AdminDashboard";
import { AdminProvider } from "@/context/AdminContext";
import { Toaster } from "react-hot-toast";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="container mx-auto px-4 py-8">
                <AdminProvider>
                    <AdminDashboard />
                </AdminProvider>
            </main>
            <Toaster position="top-right" />
        </div>
    );
}