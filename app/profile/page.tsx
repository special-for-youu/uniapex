'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { getProfile, updateProfile, createProfile } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import Link from 'next/link'
import { User, Mail, GraduationCap, MapPin, Target, Sparkles, LogOut, Save, Book, Award, Briefcase, CheckCircle, AlertCircle, FileText, MessageSquare } from 'lucide-react'

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
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6 pt-20 md:p-8" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-600 text-white">
                                <User className="w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-bold">Your Profile</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Update your information to get personalized recommendations</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/cv-maker"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-white/20 transition-all shadow-sm group"
                        >
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                            <span>CV Maker</span>
                        </Link>
                    </div>
                </div>

                <div className="backdrop-blur-lg rounded-2xl p-8 border" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                                Full Name
                            </label>
                            <input
                                id="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="target_country" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                                Target Country
                            </label>
                            <select
                                id="target_country"
                                value={formData.target_country}
                                onChange={(e) => setFormData({ ...formData, target_country: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                            >
                                <option value="">Select a country</option>
                                <option value="Kazakhstan">Kazakhstan</option>
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                                <option value="Canada">Canada</option>
                                <option value="Germany">Germany</option>
                                <option value="Korea">South Korea</option>
                                <option value="Japan">Japan</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="current_gpa" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
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
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="ielts_score" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
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
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                            />
                        </div>

                        <div>
                            <label htmlFor="sat_score" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
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
                                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                            />
                        </div>

                        {message && (
                            <div
                                className={`flex items-center gap-3 p-4 rounded-lg ${message.type === 'success'
                                    ? 'bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/50 text-green-700 dark:text-green-300'
                                    : 'bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-300'
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
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
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
