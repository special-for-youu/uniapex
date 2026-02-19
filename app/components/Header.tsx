'use client';

import React from 'react';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Header() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center gap-4">
                <Link
                    href="/profile"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white transition-colors"
                    title="Profile"
                >
                    <User className="w-5 h-5" />
                </Link>
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
