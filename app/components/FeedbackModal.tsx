'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    userEmail: string | null
}

export default function FeedbackModal({ isOpen, onClose, userEmail }: FeedbackModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setStatus('idle')

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, userEmail }),
            })

            if (!response.ok) throw new Error('Failed to send feedback')

            setStatus('success')
            setTimeout(() => {
                onClose()
                setTitle('')
                setDescription('')
                setStatus('idle')
            }, 2000)
        } catch (error) {
            console.error('Feedback error:', error)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    // Use portal to render modal at root level
    if (typeof window === 'undefined') return null

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Send Feedback</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Feedback Sent!</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Thank you for helping us improve.</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-80">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Brief summary of the issue or idea"
                                            className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 opacity-80">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Tell us more details..."
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                            required
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Failed to send. Please try again.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !title.trim() || !description.trim()}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Send Feedback
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </form>

                    </motion.div>
                </div>
            )
            }
        </AnimatePresence >,
        document.body
    )
}
