'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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
    const supabase = createClientComponentClient()

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
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-100 text-slate-900">
            <div className="w-full max-w-md relative z-10">
                <Link href="/" className="flex items-center gap-3 justify-center mb-8">
                    <div className="w-64 h-24 relative flex items-center justify-center rounded-xl overflow-hidden">
                        <Image
                            src={logo}
                            alt="UNIAPEX Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-xl border rounded-3xl p-8 shadow-2xl bg-white border-slate-200"
                >
                    {/* Dual Toggle Slider */}
                    <div className="flex p-1 rounded-xl mb-8 relative bg-slate-100">
                        <motion.div
                            layoutId="auth-toggle"
                            className="absolute inset-1 w-[calc(50%-4px)] rounded-lg shadow-sm bg-white"
                        />
                        <button className="flex-1 relative z-10 py-2 text-sm font-medium text-center transition-colors text-slate-900">
                            Sign In
                        </button>
                        <Link href="/register" className="flex-1 relative z-10 py-2 text-sm font-medium text-center transition-colors text-slate-500">
                            Sign Up
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Sign in with your email and password</p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-900">
                                <Mail className="w-4 h-4 inline mr-1" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-900">
                                <Lock className="w-4 h-4 inline mr-1" />
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl text-sm bg-red-50 border border-red-200 text-red-600"
                            >
                                {message}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={formLoading}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
