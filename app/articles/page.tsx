'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Calendar, Clock, ChevronRight, User, BookOpen, Search, Filter, Tag } from 'lucide-react'

interface Article {
    id: string
    title: string
    description?: string
    author?: string
    date?: string
    image_url?: string
    read_time?: string
    link_url: string
    category?: string
    tags?: string[]
    difficulty?: string
    content?: string
    published_at?: string
    created_at?: string
}

export default function ArticlesPage() {
    const supabase = createClient()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setArticles(data || [])
        } catch (error) {
            console.error('Error fetching articles:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-grid-pattern flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary relative z-10"></div>
            </div>
        )
    }

    // Extract unique tags
    const allTags = Array.from(new Set(articles.flatMap(article => article.tags || []))).sort()

    // Filter articles
    const filteredArticles = articles.filter(article => {
        const matchesSearch =
            (article.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (article.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || // Use article.summary as per interface
            (article.category || '').toLowerCase().includes(searchQuery.toLowerCase())

        const matchesTag = selectedTag ? article.tags?.includes(selectedTag) : true

        return matchesSearch && matchesTag
    })

    return (
        <div className="min-h-screen bg-grid-pattern text-foreground pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />
            <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        <span>Knowledge Base</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
                        All Articles & Guides
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0">
                        Explore our comprehensive library of resources covering university admissions, career advice, and academic success.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-10 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search articles, guides, and insights..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-muted-foreground flex items-center gap-1 mr-2">
                                <Filter className="w-4 h-4" /> Filter by:
                            </span>
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${selectedTag === null
                                    ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                    : 'bg-black/40 text-muted-foreground border-white/5 hover:border-white/20 hover:text-foreground'
                                    }`}
                            >
                                All
                            </button>
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(tag)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${selectedTag === tag
                                        ? 'bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                        : 'bg-black/40 text-muted-foreground border-white/5 hover:border-white/20 hover:text-foreground'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Articles Grid */}
                {filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredArticles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="group glass-card bg-black/20 border border-white/10 hover:border-primary/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col h-full"
                                >
                                    <div className="h-48 relative overflow-hidden bg-white/5">
                                        {article.image_url ? (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${article.image_url})` }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20" />
                                        )}
                                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white uppercase tracking-wider">
                                            {article.category || 'General'}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                                        {/* Tags & Difficulty Row */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {article.difficulty && (
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${article.difficulty.toLowerCase() === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    article.difficulty.toLowerCase() === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                                    }`}>
                                                    {article.difficulty}
                                                </span>
                                            )}
                                            {article.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/5 text-muted-foreground border border-white/10 flex items-center gap-1">
                                                    <Tag className="w-3 h-3" /> {tag}
                                                </span>
                                            ))}
                                            {(article.tags?.length || 0) > 2 && (
                                                <span className="text-[10px] font-medium text-muted-foreground">
                                                    +{article.tags!.length - 2} more
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                            <Link href={article.link_url || `/article/${article.id}`}>
                                                {article.title}
                                            </Link>
                                        </h3>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                                            {article.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4 mt-auto">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{article.published_at || article.created_at ? new Date(article.published_at || article.created_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{article.read_time || `${Math.max(1, Math.ceil(((article.content || article.description || '').trim().split(/\\s+/).length) / 200))} min read`}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 glass-card bg-black/20 rounded-2xl border border-white/10 shadow-2xl"
                    >
                        <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                        {(searchQuery || selectedTag) && (
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                                className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm font-medium transition-colors border border-white/10"
                            >
                                Clear all filters
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
