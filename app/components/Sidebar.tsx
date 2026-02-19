'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './sidebar.css';
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
    const [isDark, setIsDark] = useState(false);
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

        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');

        // Default to light. Only set dark if explicitly saved as 'dark'
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
        }
    }, []);


    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

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
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-gray-200 dark:border-white text-gray-700 dark:text-white"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-[100] backdrop-blur-md"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div className={`sidebar-container ${isShrink ? 'shrink' : ''} fixed md:relative z-[101] h-full transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <button className="sidebar-viewButton hidden md:flex" onClick={toggleShrink}>
                    <ChevronLeft />
                </button>

                <div className="sidebar-wrapper">
                    <div className={`flex items-center justify-center mb-6 mt-4 transition-all duration-300 ${isShrink ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-24'} gap-3`}>
                        <div className="w-48 h-20 relative rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                                src={isDark ? '/logodark.png' : logo}
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <div className="sidebar-themeContainer">
                        <label className={`sidebar-themeLabel ${isDark ? 'switched' : ''}`} onClick={toggleTheme}>
                            <div className="sidebar-themeType light">
                                <Sun />
                                <span className="sidebar-themeInputText">Light</span>
                            </div>
                            <div className="sidebar-themeType dark">
                                <Moon />
                                <span className="sidebar-themeInputText">Dark</span>
                            </div>
                        </label>
                    </div>

                    <ul className="sidebar-list">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                                <li key={index} className={`sidebar-listItem ${isActive ? 'active' : ''}`}>
                                    <Link href={item.path}>
                                        <Icon className="sidebar-listIcon" />
                                        <span className="sidebar-listItemText">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-auto border-t border-gray-200 dark:border-white/10 pt-4 px-2">
                        <div
                            className="sidebar-profileSection mb-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            onClick={() => setIsFeedbackOpen(true)}
                        >
                            <MessageSquare className="sidebar-listIcon text-blue-500" />
                            <span className="sidebar-listItemText text-blue-500 font-medium">Feedback</span>
                        </div>


                    </div>
                </div>
            </div>

            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} userEmail={userEmail} />
        </>
    );
}
