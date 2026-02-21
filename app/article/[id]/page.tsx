'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Clock, Calendar, User, LogOut } from 'lucide-react'
import Link from 'next/link'

interface Article {
    id: string
    title: string
    description: string
    content: string
    image_url: string
    author: string
    published_at: string
    created_at: string
}

export default function ArticlePage() {
    const params = useParams()
    const router = useRouter()
    const [article, setArticle] = useState<Article | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (params.id) {
            fetchArticle(params.id as string)
        }
    }, [params.id])

    const fetchArticle = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            setArticle(data)
        } catch (error) {
            console.error('Error fetching article:', error)
            router.push('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 w-48 bg-gray-800 rounded"></div>
                </div>
            </div>
        )
    }

    if (!article) return null

    return (
        <div className="min-h-screen pb-20 flex flex-col" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>

            {/* Hero Section - Flyer Style */}
            <div className="relative w-full min-h-[70vh] flex flex-col justify-center items-center p-6 pt-16 md:pt-20 pb-16 bg-grid-pattern text-white">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--main-bg)] via-transparent to-black/60" />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-start gap-6">
                    {/* Flow Layout Back Button */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-white/90 hover:text-white hover:scale-105 transition-all bg-black/40 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full shadow-lg group w-max"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Dashboard</span>
                    </Link>

                    {/* Flyer Content Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <div className="glass-card p-8 md:p-10 rounded-2xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] text-center backdrop-blur-xl bg-black/50">
                            {/* Metadata Badges */}
                            <div className="flex flex-wrap justify-center items-center gap-4 mb-8 text-white/90">
                                <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium backdrop-blur-md">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium backdrop-blur-md">
                                    <Clock className="w-4 h-4" />
                                    {Math.max(1, Math.ceil(((article.content || article.description || '').trim().split(/\\s+/).length) / 200))} min read
                                </span>
                                {article.author && (
                                    <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium backdrop-blur-md">
                                        <User className="w-4 h-4" />
                                        {article.author}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl md:leading-tight font-black text-white mb-6 tracking-tight drop-shadow-lg">
                                {article.title}
                            </h1>

                            {/* Subtle Divider */}
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full mb-8 opacity-80" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 md:px-8 mt-8 relative z-10">
                <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 bg-black/20">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-invert prose-lg max-w-none"
                        style={{
                            '--tw-prose-body': 'var(--text-color)',
                            '--tw-prose-headings': 'var(--text-color)',
                            '--tw-prose-links': 'var(--accent-color)',
                            '--tw-prose-bold': 'var(--text-color)',
                            '--tw-prose-counters': 'var(--text-secondary)',
                            '--tw-prose-bullets': 'var(--text-secondary)',
                            '--tw-prose-quotes': 'var(--text-secondary)',
                        } as any}
                    >
                        {/* Render Markdown Content */}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {article.content || article.description}
                        </ReactMarkdown>
                    </motion.article>
                </div>
            </main>
        </div>
    )
}
