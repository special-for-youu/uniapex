'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { ArrowRight, Sparkles, Rocket } from 'lucide-react'
import Image from 'next/image'
import logo from '@/components/assets/logo.png'

export default function WelcomePage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', user.id)
                        .maybeSingle()

                    if (profile?.full_name) {
                        setName(profile.full_name.split(' ')[0])
                    }
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') console.error('Error fetching profile:', error)
            }
        }
        getUser()
    }, [])

    return (
        <div className="min-h-screen bg-background dark:bg-gradient-to-b dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-30">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-3xl w-full text-center space-y-8"
            >

                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center p-6 bg-card/50 dark:bg-white/5 backdrop-blur-xl rounded-full border border-border dark:border-white/10 shadow-lg"
                >
                    <Sparkles className="w-12 h-12 text-yellow-400" />
                </motion.div>

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-4">
                        Hello, <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                            {name || 'Student'}
                        </span>!
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                >
                    <div className="text-2xl md:text-3xl font-semibold text-foreground flex items-center justify-center gap-3">
                        Welcome to
                        <div className="w-64 h-24 relative">
                            <Image src={logo} alt="UNIAPEX" fill className="object-contain" />
                        </div>
                        🎓
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        Here you will discover which professions suit you, how to apply, and what tests you need to get into your dream university.
                    </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-8"
                >
                    <button
                        onClick={() => router.push('/onboarding')}
                        className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-3 mx-auto"
                    >
                        <Rocket className="w-6 h-6" />
                        Start My Path
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Info Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="pt-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 dark:bg-white/5 border border-border dark:border-white/10 rounded-full text-sm text-muted-foreground backdrop-blur-sm">
                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                        First, let's get to know you better
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
