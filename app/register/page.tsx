'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { GraduationCap, ArrowRight, Loader2, User, Mail, Lock, Calendar, Globe, FileText } from 'lucide-react'
import Link from 'next/link'

import Image from 'next/image'
import logo from '@/components/assets/logo.png'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: '',
        grade: '',
        country: '',
        bio: '',
        interests: '',
        goals: ''
    })
    const supabase = createClientComponentClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: `${formData.firstName} ${formData.lastName}`,
                    }
                }
            })

            if (authError) throw authError

            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: authData.user.id,
                        email: formData.email,
                        full_name: `${formData.firstName} ${formData.lastName}`,
                        age: parseInt(formData.age),
                        grade: formData.grade,
                        target_country: formData.country,
                        bio: formData.bio,
                        interests: formData.interests.split(',').map(s => s.trim()),
                        goals: formData.goals.split(',').map(s => s.trim())
                    })

                if (profileError) throw profileError

                // Use window.location for full page reload to apply session cookies
                window.location.href = '/welcome'
            }
        } catch (error: any) {
            console.error('Registration error:', error)
            alert(error.message || 'An error occurred during registration')
        } finally {
            setLoading(false)
        }
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
                            className="absolute inset-1 left-[50%] w-[calc(50%-4px)] rounded-lg shadow-sm bg-white"
                        />
                        <Link href="/auth" className="flex-1 relative z-10 py-2 text-sm font-medium text-center transition-colors text-slate-500">
                            Sign In
                        </Link>
                        <button className="flex-1 relative z-10 py-2 text-sm font-medium text-center transition-colors text-slate-900">
                            Sign Up
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-slate-500">Start your university journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {step === 1 ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-900">
                                            <User className="w-4 h-4 inline mr-1" />
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-900">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-900">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-900">
                                        <Lock className="w-4 h-4 inline mr-1" />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:scale-105"
                                >
                                    Next Step
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-900">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="age"
                                            required
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                            placeholder="17"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-900">Grade</label>
                                        <input
                                            type="text"
                                            name="grade"
                                            required
                                            value={formData.grade}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                            placeholder="11th Grade"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-900">
                                        <Globe className="w-4 h-4 inline mr-1" />
                                        Target Country
                                    </label>
                                    <select
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-slate-50 border border-transparent text-slate-900"
                                    >
                                        <option value="" className="bg-white">Select Country</option>
                                        <option value="USA" className="bg-white">USA</option>
                                        <option value="UK" className="bg-white">UK</option>
                                        <option value="Canada" className="bg-white">Canada</option>
                                        <option value="Kazakhstan" className="bg-white">Kazakhstan</option>
                                        <option value="Europe" className="bg-white">Europe</option>
                                        <option value="Asia" className="bg-white">Asia</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-900">
                                        <FileText className="w-4 h-4 inline mr-1" />
                                        Bio & Interests
                                    </label>
                                    <textarea
                                        name="bio"
                                        rows={3}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none bg-slate-50 border border-transparent text-slate-900"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 py-4 border border-slate-200 rounded-xl font-semibold transition-all hover:bg-slate-100 text-slate-900"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-2/3 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
