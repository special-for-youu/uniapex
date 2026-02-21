'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, User } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Article {
  id: string
  title: string
  description: string
  image_url: string
  link_url: string
  created_at: string
  content?: string // Optional for now as it's not in the DB schema yet
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.slug) return

      try {
        const slug = params.slug as string
        const linkUrl = `/articles/${slug}`

        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('link_url', linkUrl)
          .single()

        if (error) throw error
        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--main-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--main-bg)] text-[var(--text-color)]">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--main-bg)] text-[var(--text-color)] pb-20">
      {/* Hero Section - Flyer Style */}
      <div className="relative w-full min-h-[85vh] flex flex-col justify-center items-center p-6 bg-grid-pattern">
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

        {/* Back Button - Top Left */}
        <div className="absolute top-8 left-8 z-20">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white hover:scale-105 transition-all bg-black/30 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full shadow-lg group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Flyer Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-4xl w-full mx-auto"
        >
          <div className="glass-card p-10 md:p-14 rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] text-center backdrop-blur-xl bg-black/40">
            {/* Metadata Badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8 text-white/90">
              <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium backdrop-blur-md">
                <Calendar className="w-4 h-4" />
                {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium backdrop-blur-md">
                <Clock className="w-4 h-4" />
                {(() => {
                  const text = article.content || article.description || ''
                  const words = text.trim().split(/\s+/).length
                  const minutes = Math.ceil(words / 200)
                  return `${minutes} min read`
                })()}
              </span>
              <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/10 text-sm font-medium backdrop-blur-md">
                <User className="w-4 h-4" />
                Admissions Team
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl md:leading-tight font-black text-white mb-6 tracking-tight drop-shadow-lg">
              {article.title}
            </h1>

            {/* Subtle Divider */}
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full mb-8 opacity-80" />

            {/* Abstract/Description (Optional in Hero) */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-2xl mx-auto drop-shadow-md">
              {article.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 mt-8 relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 bg-black/20">

          {/* Action Bar */}
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-[var(--item-hover)]">
            <div className="flex gap-4">
              <button className="p-2 rounded-full hover:bg-[var(--item-hover)] transition-colors text-gray-500 hover:text-blue-500">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-[var(--item-hover)] transition-colors text-gray-500 hover:text-blue-500">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Article Body */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none"
            style={{
              '--tw-prose-body': 'var(--text-color)',
              '--tw-prose-headings': 'var(--text-color)',
              '--tw-prose-links': '#3b82f6', // Tailwind blue-500
              '--tw-prose-bold': 'var(--text-color)',
              '--tw-prose-counters': 'currentColor',
              '--tw-prose-bullets': 'currentColor',
              '--tw-prose-quotes': 'currentColor',
            } as any}
          >
            {article.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.content}
              </ReactMarkdown>
            ) : (
              <>
                <p className="text-xl leading-relaxed mb-6 font-medium text-[var(--text-color)] opacity-90">
                  {article.description}
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h3 className="text-2xl font-bold mt-8 mb-4">Key Takeaways</h3>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Understanding the requirements is the first step to success.</li>
                  <li>Prepare your documents well in advance.</li>
                  <li>Don't hesitate to ask for help from counselors.</li>
                </ul>
              </>
            )}
          </motion.article>

        </div>
      </div>
    </div>
  )
}
