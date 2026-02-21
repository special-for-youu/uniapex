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
    const [errorMessage, setErrorMessage] = useState('')

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

            const data = await response.json().catch(() => ({}))

            if (!response.ok) throw new Error(data.error || 'Failed to send feedback')

            setStatus('success')
            setTimeout(() => {
                onClose()
                setTitle('')
                setDescription('')
                setStatus('idle')
            }, 2000)
        } catch (error: any) {
            console.error('Feedback error:', error)
            setErrorMessage(error.message || 'Failed to send. Please try again.')
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
                        className="relative w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-10 text-foreground"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Send Feedback</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 text-muted-foreground hover:text-white rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-white">Feedback Sent!</h3>
                                    <p className="text-muted-foreground">Thank you for helping us improve.</p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Brief summary of the issue or idea"
                                            className="w-full px-4 py-3 rounded-xl border bg-slate-950 border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all text-white placeholder:text-gray-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Tell us more details..."
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border bg-slate-950 border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-white placeholder:text-gray-500"
                                            required
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || !title.trim() || !description.trim()}
                                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
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
