'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, RefreshCw, CheckCircle, Clock, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

interface Feedback {
    id: string
    user_email: string
    title: string
    description: string
    status: 'pending' | 'replied'
    admin_reply?: string
    created_at: string
}

export default function AdminFeedback() {
    const router = useRouter()
    const [feedback, setFeedback] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = async () => {
        try {
            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setFeedback(data || [])
        } catch (error) {
            console.error('Error fetching feedback:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSync = async () => {
        setSyncing(true)
        try {
            const res = await fetch('/api/feedback/sync', { method: 'POST' })
            const data = await res.json()

            if (data.success) {
                alert(`Synced! Updated ${data.syncedCount} items.`)
                fetchFeedback()
            } else {
                alert('Sync failed: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Sync error:', error)
            alert('Failed to sync')
        } finally {
            setSyncing(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-3xl font-bold">User Feedback</h1>
                    </div>

                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg hover:shadow-blue-500/20"
                    >
                        <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync from Gmail'}
                    </button>
                </div>

                <div className="grid gap-6">
                    {feedback.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-2xl border-gray-700">
                            No feedback received yet.
                        </div>
                    ) : (
                        feedback.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-2xl border relative overflow-hidden"
                                style={{
                                    backgroundColor: 'var(--main-container-bg)',
                                    borderColor: 'var(--border-color)'
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Mail className="w-4 h-4" />
                                            {item.user_email}
                                            <span>•</span>
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2
                                        ${item.status === 'replied'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}
                                    >
                                        {item.status === 'replied' ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Replied
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="w-4 h-4" />
                                                Pending
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl mb-4 text-gray-700 dark:text-gray-300">
                                    {item.description}
                                </div>

                                {item.status === 'replied' && item.admin_reply && (
                                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                                        <h4 className="text-sm font-bold text-blue-500 mb-2">Your Reply:</h4>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                                            {item.admin_reply}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
