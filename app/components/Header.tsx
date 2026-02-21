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
        <header className="sticky top-0 z-20 w-full bg-slate-950 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center gap-4">
                <Link
                    href="/profile"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 text-gray-400 hover:text-primary transition-all duration-300 border border-white/5 hover:border-primary/30"
                    title="Profile"
                >
                    <User className="w-5 h-5" />
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-all duration-300 border border-white/5 hover:border-red-500/30"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
