'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { GraduationCap, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import Image from 'next/image'
import logo from '@/components/assets/logo.png'

function AuthContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [formLoading, setFormLoading] = useState(false)
    const [message, setMessage] = useState('')
    const supabase = createClient()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const redirectTo = searchParams.get('redirectTo') || '/dashboard'
                router.push(redirectTo)
            }
        } catch (error) {
            console.error('Error checking user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormLoading(true)
        setMessage('')

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                // Provide user-friendly error messages
                if (error.message.includes('Invalid login credentials')) {
                    setMessage('❌ Email or password is incorrect. Please try again.')
                } else if (error.message.includes('Email not confirmed')) {
                    setMessage('⚠️ Please confirm your email before signing in.')
                } else if (error.message.includes('User not found')) {
                    setMessage('❌ No account found with this email. Please sign up first.')
                } else {
                    setMessage(`Error: ${error.message}`)
                }
                return
            }

            if (data.user) {
                // Use window.location for full page reload to apply session cookies
                const redirectTo = searchParams.get('redirectTo') || '/profile'
                window.location.href = redirectTo
            }
        } catch (error: any) {
            console.error('Sign in error:', error)
            setMessage('❌ Failed to sign in. Please try again.')
        } finally {
            setFormLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--background))' }}>
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-grid-pattern text-foreground relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-md relative z-10">
                <Link href="/" className="flex items-center gap-3 justify-center mb-8">
                    <div className="w-64 h-24 relative flex items-center justify-center">
                        <Image
                            src="/logodark.png"
                            alt="UNIAPEX Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Dual Toggle Slider */}
                    <div className="flex p-1 rounded-xl mb-8 relative bg-black/20 border border-white/5">
                        <motion.div
                            layoutId="auth-toggle"
                            className="absolute inset-1 w-[calc(50%-4px)] rounded-lg shadow-sm bg-primary/20 border border-primary/20"
                        />
                        <button className="flex-1 relative z-10 py-2 text-sm font-medium text-center transition-colors text-white">
                            Sign In
                        </button>
                        <Link href="/register" className="flex-1 relative z-10 py-2 text-sm font-medium text-center transition-colors text-[#9ca3af] hover:text-white">
                            Sign Up
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2 text-white">Welcome Back</h2>
                        <p className="text-[#9ca3af]">Sign in with your email and password</p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#d1d5db]">
                                <Mail className="w-4 h-4 inline mr-1 text-primary" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-black/20 focus:bg-black/40 border border-white/10 text-white placeholder:text-[#6b7280] [&:-webkit-autofill]:bg-black/20 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:transition-colors [&:-webkit-autofill]:duration-[5000s]"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#d1d5db]">
                                <Lock className="w-4 h-4 inline mr-1 text-primary" />
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-black/20 focus:bg-black/40 border border-white/10 text-white placeholder:text-[#6b7280] [&:-webkit-autofill]:bg-black/20 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:transition-colors [&:-webkit-autofill]:duration-[5000s]"
                                placeholder="••••••••"
                            />
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-[#f87171]"
                            >
                                {message}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={formLoading}
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {formLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--background))' }}>
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
        }>
            <AuthContent />
        </Suspense>
    )
}
