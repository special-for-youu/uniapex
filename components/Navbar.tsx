'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { GraduationCap, LayoutDashboard, School, Target, Sparkles, User, LogOut, Menu, X, Trophy, Briefcase, DollarSign, Map } from 'lucide-react'
import { signOut } from '@/lib/supabase'

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/test-intro', label: 'Tests', icon: Target },
        { href: '/career-test', label: 'Careers', icon: Briefcase },
        { href: '/universities', label: 'Universities', icon: School },
        { href: '/map', label: 'Map', icon: Map },
        { href: '/extracurriculars', label: 'Activities', icon: Trophy },
        { href: '/salaries', label: 'Salaries', icon: DollarSign },
        { href: '/ai-tutor', label: 'AI Tutor', icon: Sparkles },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block">Student OS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(item.href)
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            href="/profile"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive('/profile')
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/5"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/10">
                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${isActive(item.href)
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'text-gray-300 hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                            <Link
                                href="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${isActive('/profile')
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                <span>Profile</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    handleSignOut()
                                }}
                                className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
