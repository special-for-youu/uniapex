'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Left Side: Copyright & Links */}
                    <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span>© 2024 UNIAPEX. All rights reserved.</span>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/support" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Support
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Actions & Socials */}
                    <div className="flex items-center gap-4">
                        {/* Notification Button */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors relative group"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                        <div className="flex gap-4 text-gray-400">
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
