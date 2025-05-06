'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Home Page', href: '/', icon: '/icons/home.svg' },
    { label: 'Menu', href: '/menu', icon: '/icons/menu.svg' },
    { label: 'My Orders', href: '/orders', icon: '/icons/orders.svg' },
    { label: 'History', href: '/history', icon: '/icons/history.svg' },
    { label: 'Admin', href: '/admin', icon: '/icons/admin.svg' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="bg-white h-screen w-[260px] flex flex-col py-10 px-4 border-r border-light-gray fixed left-0 top-0 z-20 shadow-lg">
            <div className="flex flex-col items-center mb-12">
                <img src="/logo/logo.svg" alt="Aptos Coffee" className="h-20 mb-4" />
            </div>
            <ul className="menu menu-vertical w-full">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.label} className="mb-2">
                            <Link
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-brand-pink text-white font-bold'
                                    : 'hover:bg-light-blue text-dark-gray'
                                    }`}
                            >
                                <img src={item.icon} alt={item.label} className="h-7 w-7" />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className="mt-auto px-4">
                <button className="btn btn-outline btn-error w-full flex items-center gap-2">
                    <img src="/icons/logout.svg" alt="Log out" className="h-6 w-6" />
                    Log Out
                </button>
            </div>
        </aside>
    );
}
