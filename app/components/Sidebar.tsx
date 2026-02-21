'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    BookOpen,
    Award,
    Briefcase,
    User,
    ChevronLeft,
    Moon,
    Sun,
    LogOut,
    Sparkles,
    Target,
    Zap,
    School,
    Menu,
    MessageSquare,
    X,
    PieChart
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import logo from '@/components/assets/logo.png';
import FeedbackModal from './FeedbackModal';

export default function Sidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isShrink, setIsShrink] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const pathname = usePathname();
    const supabase = createClient();

    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                setUserEmail(session.user.email);
            }
        };
        getUser();

        // Enforce dark mode
        document.body.classList.add('dark');
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }, []);


    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleShrink = () => {
        setIsShrink(!isShrink);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Universities', icon: School, path: '/universities' },
        { name: 'Extracurriculars', icon: Zap, path: '/extracurriculars' },
        { name: 'Analyse', icon: PieChart, path: '/analyse' },
        { name: 'Careers', icon: Briefcase, path: '/careers' },
        { name: 'AI Tutor', icon: Sparkles, path: '/ai-tutor' },
    ];

    return (
        <>
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg text-foreground hover:bg-white/10 transition-colors"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/60 z-[100] backdrop-blur-md"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside
                className={`fixed md:relative z-[101] h-screen transition-all duration-300 ease-in-out 
                ${isShrink ? 'w-[92px]' : 'w-[280px]'} 
                ${isMobileOpen ? 'translate-x-[0px]' : '-translate-x-full md:translate-x-0'}
                border-r border-white/5 bg-[#020212]/80 backdrop-blur-xl shadow-2xl
                flex flex-col
                `}
            >
                <div className="flex items-center justify-between p-6">
                    <div className={`overflow-hidden transition-all duration-300 flex justify-center ${isShrink ? 'w-0 opacity-0' : 'w-full opacity-100'}`}>
                        <div className="relative h-14 w-40 flex justify-center items-center">
                            <Image
                                src="/logodark.png"
                                alt="UniApex"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <button
                        onClick={toggleShrink}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors hidden md:block"
                    >
                        <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isShrink ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <div className="px-4 mb-6">
                    {/* Theme toggle removed for forced Dark Mode */}
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={index}
                                href={item.path}
                                className={`
                                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                                    ${isActive
                                        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white hover:border hover:border-white/5'
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#3b82f6]" />
                                )}
                                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]' : 'group-hover:scale-110'}`} />
                                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isShrink ? 'opacity-0 w-0' : 'opacity-100'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <button
                        onClick={() => setIsFeedbackOpen(true)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-blue-400 transition-colors ${isShrink ? 'justify-center' : ''}`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className={`${isShrink ? 'hidden' : 'block'}`}>Feedback</span>
                    </button>
                </div>
            </aside>

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userEmail={userEmail} />
        </>
    );
}
