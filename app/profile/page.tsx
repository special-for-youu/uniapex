'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { getProfile, updateProfile, createProfile } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import Link from 'next/link'
import { User, Mail, GraduationCap, MapPin, Target, Sparkles, LogOut, Save, Book, Award, Briefcase, CheckCircle, AlertCircle, FileText, MessageSquare } from 'lucide-react'
import CountrySelect from '@/app/components/CountrySelect'

export default function Profile() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const [formData, setFormData] = useState({
        full_name: '',
        target_country: '',
        current_gpa: '',
        ielts_score: '',
        sat_score: '',
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session || !session.user) {
                router.push('/auth?redirectTo=/profile')
                return
            }

            const user = session.user
            let profile = await getProfile(user.id, supabase)

            if (!profile) {
                profile = await createProfile(user.id, user.email!, supabase)
            }

            if (profile) {
                setFormData({
                    full_name: profile.full_name || '',
                    target_country: profile.target_country || '',
                    current_gpa: profile.current_gpa?.toString() || '',
                    ielts_score: profile.ielts_score?.toString() || '',
                    sat_score: profile.sat_score?.toString() || '',
                })
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error loading profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session || !session.user) {
                setMessage({ type: 'error', text: 'Not authenticated. Redirecting to login...' })
                setTimeout(() => router.push('/auth?redirectTo=/profile'), 1500)
                return
            }

            const user = session.user

            const updates: Partial<Profile> = {
                full_name: formData.full_name || null,
                target_country: formData.target_country || null,
                current_gpa: formData.current_gpa ? parseFloat(formData.current_gpa) : null,
                ielts_score: formData.ielts_score ? parseFloat(formData.ielts_score) : null,
                sat_score: formData.sat_score ? parseInt(formData.sat_score) : null,
            }

            await updateProfile(user.id, updates, supabase)

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (error: any) {
            if (process.env.NODE_ENV === 'development') console.error('Profile update error:', error)
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-grid-pattern">
                <div className="text-xl text-white">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6 pt-20 md:p-8 bg-grid-pattern text-foreground relative">
            {/* Background glow for profile page */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                <User className="w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">Your Profile</h1>
                        </div>
                        <p className="text-gray-400">Update your information to get personalized recommendations</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/cv-maker"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all shadow-sm group text-white"
                        >
                            <FileText className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                            <span>CV Maker</span>
                        </Link>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium mb-2 text-muted-foreground">
                                Full Name
                            </label>
                            <input
                                id="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
                            />
                        </div>

                        <div>
                            <CountrySelect
                                label="Target Country"
                                value={formData.target_country}
                                onChange={(value) => setFormData({ ...formData, target_country: value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="current_gpa" className="block text-sm font-medium mb-2 text-muted-foreground">
                                    Current GPA (0.0 - 4.0)
                                </label>
                                <input
                                    id="current_gpa"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    value={formData.current_gpa}
                                    onChange={(e) => setFormData({ ...formData, current_gpa: e.target.value })}
                                    placeholder="3.5"
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
                                />
                            </div>

                            <div>
                                <label htmlFor="ielts_score" className="block text-sm font-medium mb-2 text-muted-foreground">
                                    IELTS Score (0.0 - 9.0)
                                </label>
                                <input
                                    id="ielts_score"
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    max="9"
                                    value={formData.ielts_score}
                                    onChange={(e) => setFormData({ ...formData, ielts_score: e.target.value })}
                                    placeholder="6.5"
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
                                />
                            </div>

                            <div>
                                <label htmlFor="sat_score" className="block text-sm font-medium mb-2 text-muted-foreground">
                                    SAT Score (400 - 1600)
                                </label>
                                <input
                                    id="sat_score"
                                    type="number"
                                    min="400"
                                    max="1600"
                                    value={formData.sat_score}
                                    onChange={(e) => setFormData({ ...formData, sat_score: e.target.value })}
                                    placeholder="1200"
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {message && (
                            <div
                                className={`flex items-center gap-3 p-4 rounded-lg transform transition-all ${message.type === 'success'
                                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                    }`}
                            >
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div >
            </div >
        </div >
    )
}
