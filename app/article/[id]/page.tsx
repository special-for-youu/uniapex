'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'
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
    const supabase = createClientComponentClient()

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
        <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>

            {/* Hero Image */}
            <div className="relative h-[400px] w-full">
                <div className="absolute inset-0">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--main-bg)] via-[var(--main-bg)]/60 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm mb-6 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold mb-4 text-white"
                    >
                        {article.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap items-center gap-4 text-sm text-gray-300"
                    >
                        {article.author && (
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-1.5" />
                                {article.author}
                            </div>
                        )}
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1.5" />
                            {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1.5" />
                            {Math.ceil((article.content?.length || 0) / 1000)} min read
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 md:px-8 mt-8">
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
            </main>
        </div>
    )
}
