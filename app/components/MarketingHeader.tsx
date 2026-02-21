'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import logo from '@/components/assets/logo.png'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function MarketingHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setIsLoggedIn(!!user)
        setLoading(false)
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background border-border">
            <div className="container mx-auto px-6 py-2 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                >
                    <Link href="/" className="w-40 h-12 md:w-64 md:h-20 relative flex items-center justify-center rounded-xl overflow-hidden">
                        <Image
                            src={logo}
                            alt="UNIAPEX Logo"
                            fill
                            className="object-contain"
                        />
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground"
                >
                    <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                    <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                    <Link href="/for-universities" className="hover:text-primary transition-colors">For Universities</Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {!loading && (
                        <Link
                            href={isLoggedIn ? "/dashboard" : "/auth"}
                            className="px-6 py-2.5 rounded-full font-medium transition-all border border-border text-foreground hover:bg-secondary/50"
                        >
                            {isLoggedIn ? "Dashboard" : "Sign In"}
                        </Link>
                    )}
                </motion.div>
            </div>
        </nav>
    )
}
