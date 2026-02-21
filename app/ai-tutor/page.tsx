'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
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
    const supabase = createClient()

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

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return

        const userMessage = text.trim()
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await sendMessage(input)
    }

    const suggestions = [
        "What universities are acceptable for my profile?",
        "Help me create a plan to research universities",
        "What are my academic strengths based on my profile?",
        "Can you help me identify universities in USA?"
    ]

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#020617] text-slate-100 selection:bg-primary/30 font-sans">

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence mode='wait'>
                {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.aside
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className={`fixed left-0 lg:relative z-50 w-80 h-full flex flex-col border-r border-slate-800 bg-[#0f172a] shadow-2xl lg:shadow-none
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        `}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8 lg:hidden">
                                <span className="font-bold text-lg text-white">Chats</span>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={createNewSession}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 mb-8"
                            >
                                <Plus className="w-5 h-5" />
                                New Session
                            </button>

                            <nav className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-4 px-3">Recent Counseling</p>

                                {sessions.length === 0 && (
                                    <div className="text-center text-slate-500 mt-4 text-sm px-3">
                                        No saved chats yet.
                                    </div>
                                )}

                                {sessions.map(session => (
                                    <div
                                        key={session.id}
                                        onClick={() => loadSession(session.id)}
                                        className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${currentSessionId === session.id
                                            ? 'bg-slate-800/50 border-slate-700/50 text-primary font-medium'
                                            : 'hover:bg-slate-800/50 border-transparent hover:border-slate-700/50 text-slate-400'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <MessageSquare className="w-5 h-5 flex-shrink-0" />
                                            <span className="truncate text-sm">{session.title || 'Untitled Chat'}</span>
                                        </div>
                                        <button
                                            onClick={(e) => deleteSession(e, session.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-red-400 rounded-md transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full bg-[#020617] relative">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 -ml-2"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            <Sparkles className="text-primary w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-tight text-white">UniApex AI Advisor</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Counseling</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* placeholder for future icons */}
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-10 scroll-smooth custom-scrollbar">

                    {messages.length > 0 && (
                        <div className="flex justify-center my-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-slate-800/40 px-4 py-1.5 rounded-full border border-slate-700/30">Session Started</span>
                        </div>
                    )}

                    {messages.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">How can I help you today?</h3>
                            <p className="max-w-md text-slate-400 mb-8">
                                Ask me anything about universities, applications, or exams.
                            </p>

                            <div className="grid gap-3 w-full max-w-2xl">
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => sendMessage(suggestion)}
                                        className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-primary/30 text-slate-300 transition-all text-sm font-medium text-left hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <AnimatePresence key={idx}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 max-w-4xl mx-auto group ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center self-start mt-1 ${msg.role === 'user' ? 'bg-slate-800 border border-slate-700' : 'bg-primary/20 border border-primary/30'}`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5 text-slate-300" /> : <Bot className="w-5 h-5 text-primary" />}
                                </div>

                                <div className={`space-y-2 flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                                    <div className={`inline-block p-5 text-left ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-2xl rounded-tr-none shadow-lg max-w-lg'
                                        : 'bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none shadow-sm text-slate-300'
                                        }`}>
                                        <div className={`prose prose-sm max-w-none leading-relaxed ${msg.role === 'user' ? 'prose-invert font-medium' : 'prose-invert'}`}>
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                    <div className={`flex gap-2 mr-2 ${msg.role === 'user' ? 'justify-end' : 'ml-2'}`}>
                                        <span className="text-[10px] font-medium text-slate-600">
                                            {msg.role === 'user' ? 'Seen' : ''} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ))}

                    {loading && (
                        <div className="flex gap-4 max-w-4xl mx-auto group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 self-start mt-1">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <div className="inline-block bg-slate-900 border border-slate-800 p-5 rounded-2xl rounded-tl-none shadow-sm text-slate-300">
                                    <div className="flex gap-1.5 items-center h-5">
                                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input Area */}
                <footer className="p-4 md:p-6 pt-2 bg-[#020617]/80 backdrop-blur-md sticky bottom-0 z-20">


                    <div className="max-w-4xl mx-auto relative">
                        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl flex items-end p-2.5 pr-4 transition-colors focus-within:border-primary/50 shadow-2xl">
                            <button type="button" className="p-2.5 text-slate-500 hover:text-primary transition-colors flex-shrink-0">
                                <Plus className="w-5 h-5" />
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message here..."
                                className="flex-1 w-full border-none focus:ring-0 bg-transparent text-slate-100 py-3 px-3 text-sm focus:outline-none placeholder:text-slate-600"
                            />

                            <div className="flex items-center gap-2 mb-0.5 flex-shrink-0 pl-2">
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="bg-primary text-white p-2.5 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5 ml-1" />
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-[0.1em] font-medium mb-1">
                            UniApex AI may provide inaccurate info. Always verify official deadlines.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    )
}
