'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, User } from 'lucide-react'
import { motion } from 'framer-motion'

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
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--main-bg)] via-black/80 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-8 pb-24 max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-6 text-white text-sm font-semibold mb-6 drop-shadow-md">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Admissions Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {(() => {
                  const text = article.content || article.description || ''
                  const words = text.trim().split(/\s+/).length
                  const minutes = Math.ceil(words / 200)
                  return `${minutes} min read`
                })()}
              </span>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {article.title}
          </motion.h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-[var(--main-container-bg)] rounded-2xl p-8 md:p-12 shadow-xl border border-[var(--item-hover)]">

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
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl leading-relaxed mb-6 font-medium text-[var(--text-color)] opacity-90">
              {article.description}
            </p>

            <div className="space-y-6 text-[var(--text-color)] opacity-80">
              {article.content ? (
                <div className="whitespace-pre-wrap font-sans">{article.content}</div>
              ) : (
                <>
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
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
