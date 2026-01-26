'use client'

import { useState, useRef, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Send, Sparkles, User, Bot, Loader2, Plus, MessageSquare, Trash2, Menu, X, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
    id?: string
    role: 'user' | 'assistant'
    content: string
    created_at?: string
}

interface Session {
    id: string
    title: string
    created_at: string
}

export default function AITutorPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [sessions, setSessions] = useState<Session[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClientComponentClient()

    // Initial Load
    useEffect(() => {
        fetchSessions()
    }, [])

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Fetch Sessions
    const fetchSessions = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching sessions:', error)
        else setSessions(data || [])
    }

    // Create New Session
    const createNewSession = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({ user_id: user.id, title: 'New Chat' })
            .select()
            .single()

        if (error) {
            console.error('Error creating session:', error)
            return
        }

        setSessions([data, ...sessions])
        setCurrentSessionId(data.id)
        setMessages([{ role: 'assistant', content: getWelcomeMessage() }])

        // On mobile, close sidebar after creating new chat
        if (window.innerWidth < 768) setIsSidebarOpen(false)
    }

    // Load Session Messages
    const loadSession = async (sessionId: string) => {
        setCurrentSessionId(sessionId)
        setLoading(true)

        // On mobile, close sidebar after selecting chat
        if (window.innerWidth < 768) setIsSidebarOpen(false)

        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true })

        if (error) console.error('Error loading messages:', error)
        else {
            if (data && data.length > 0) {
                setMessages(data)
            } else {
                setMessages([{ role: 'assistant', content: getWelcomeMessage() }])
            }
        }
        setLoading(false)
    }

    // Delete Session
    const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation()
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId)

        if (error) console.error('Error deleting session:', error)
        else {
            setSessions(sessions.filter(s => s.id !== sessionId))
            if (currentSessionId === sessionId) {
                setCurrentSessionId(null)
                setMessages([])
            }
        }
    }

    const getWelcomeMessage = () => {
        return "Hello! I'm your AI Tutor. Ask me anything about universities, applications, or exams."
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')

        // Optimistic UI update
        const tempUserMsg: Message = { role: 'user', content: userMessage }
        setMessages(prev => [...prev, tempUserMsg])
        setLoading(true)

        // Ensure session exists
        let activeSessionId = currentSessionId
        if (!activeSessionId) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('chat_sessions')
                    .insert({
                        user_id: user.id,
                        title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : '')
                    })
                    .select()
                    .single()

                if (data) {
                    activeSessionId = data.id
                    setCurrentSessionId(data.id)
                    setSessions([data, ...sessions])
                }
            }
        }

        // Save User Message to DB
        if (activeSessionId) {
            await supabase.from('chat_messages').insert({
                session_id: activeSessionId,
                role: 'user',
                content: userMessage
            })
        }

        try {
            const response = await fetch('/api/ai-tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'chat',
                    message: userMessage,
                    history: messages.slice(-5) // Send last 5 messages for context
                }),
            })

            const data = await response.json()
            if (data.error) throw new Error(data.error)

            const aiResponse = data.response

            // Save AI Message to DB
            if (activeSessionId) {
                await supabase.from('chat_messages').insert({
                    session_id: activeSessionId,
                    role: 'assistant',
                    content: aiResponse
                })
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
        } catch (error) {
            console.error('Error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-full overflow-hidden" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className={`fixed right-0 md:relative z-50 w-72 h-full md:border-r border-l md:border-l-0 flex flex-col transition-colors duration-300 bg-background
                            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                        `}
                        style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}
                    >
                        <div className="p-4 border-b" style={{ borderColor: 'var(--item-hover)' }}>
                            <div className="flex items-center justify-between mb-4 md:hidden">
                                <span className="font-bold text-lg">Chats</span>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={createNewSession}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                                New Chat
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {sessions.length === 0 && (
                                <div className="text-center text-gray-500 mt-10 text-sm">
                                    No saved chats yet.
                                </div>
                            )}
                            {sessions.map(session => (
                                <div
                                    key={session.id}
                                    onClick={() => loadSession(session.id)}
                                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${currentSessionId === session.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate text-sm font-medium">{session.title || 'Untitled Chat'}</span>
                                    </div>
                                    <button
                                        onClick={(e) => deleteSession(e, session.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-md transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Header */}
                <div className="h-16 border-b flex items-center justify-between px-6 md:px-8" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                    <div className="flex items-center gap-3 ml-16 md:ml-0">
                        <Sparkles className="w-6 h-6 text-blue-500" />
                        <h1 className="font-bold text-lg hidden sm:block">AI Tutor</h1>
                    </div>

                    {/* Mobile Sidebar Toggle (Moved here) */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                            <Sparkles className="w-16 h-16 mb-4 text-blue-500" />
                            <h3 className="text-xl font-semibold mb-2">Start a new conversation</h3>
                            <p className="max-w-md">Ask me anything about universities, applications, or exams.</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                            </div>

                            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10'
                                }`}>
                                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'}`}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 md:p-6 border-t" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                    <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="w-full pl-6 pr-14 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                            style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        AI can make mistakes. Verify important information.
                    </p>
                </div>
            </div>
        </div>
    )
}
