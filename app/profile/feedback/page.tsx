'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, MessageSquare, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface Feedback {
    id: string
    title: string
    description: string
    status: 'pending' | 'replied'
    admin_reply?: string
    created_at: string
}

export default function UserFeedback() {
    const router = useRouter()
    const [feedback, setFeedback] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/auth')
                return
            }

            const { data, error } = await supabase
                .from('feedback')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setFeedback(data || [])
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error fetching feedback:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen p-8 pt-24 bg-grid-pattern text-foreground">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.push('/profile')}
                        className="p-2 hover:bg-white/10 text-muted-foreground hover:text-white rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-white">My Feedback</h1>
                </div>

                <div className="grid gap-6">
                    {feedback.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50 text-primary" />
                            <p className="text-lg text-white">You haven't sent any feedback yet.</p>
                            <p className="text-sm mt-2">Use the "Feedback" button in the sidebar to send us a message.</p>
                        </div>
                    ) : (
                        feedback.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-2xl border relative overflow-hidden bg-slate-900 border-slate-700 hover:border-primary/50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1 text-white">{item.title}</h3>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm
                                        ${item.status === 'replied'
                                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                            : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
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

                                <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 text-gray-300">
                                    {item.description}
                                </div>

                                {item.status === 'replied' && item.admin_reply && (
                                    <div className="border-t border-slate-700 pt-4 mt-4">
                                        <h4 className="text-sm font-bold text-primary mb-2">Admin Reply:</h4>
                                        <div className="text-sm text-gray-300 whitespace-pre-wrap px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 shadow-inner">
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
