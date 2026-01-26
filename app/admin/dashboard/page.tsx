'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Plus, Trash2, LogOut, Image as ImageIcon, Link as LinkIcon, FileText, MessageSquare, X, Upload } from 'lucide-react'
import { motion } from 'framer-motion'

interface Article {
    id: string
    title: string
    description: string
    content?: string
    image_url: string
    link_url: string
    tags?: string[]
    difficulty?: string
    is_translation?: boolean
    read_more_text?: string
    created_at: string
}

export default function AdminDashboard() {
    const router = useRouter()
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClientComponentClient()

    // Form State
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [difficulty, setDifficulty] = useState('Not Specified')
    const [isTranslation, setIsTranslation] = useState(false)
    const [description, setDescription] = useState('')
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [readMoreText, setReadMoreText] = useState('Read more')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        // Simple auth check
        const isAdmin = localStorage.getItem('admin_session')
        if (!isAdmin) {
            router.push('/admin')
            return
        }
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

    const handleLogout = () => {
        localStorage.removeItem('admin_session')
        router.push('/admin')
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = e.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('images').getPublicUrl(filePath)
            setImageUrl(data.publicUrl)
        } catch (error: any) {
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            // Generate automatic link URL from title
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
                .replace(/(^-|-$)+/g, '') // Remove leading/trailing hyphens

            const autoLinkUrl = `/articles/${slug}`
            const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t)

            const { data, error } = await supabase
                .from('articles')
                .insert({
                    title,
                    description,
                    content,
                    image_url: imageUrl,
                    link_url: autoLinkUrl,
                    tags: tagsArray,
                    difficulty,
                    is_translation: isTranslation,
                    read_more_text: readMoreText
                })
                .select()
                .single()

            if (error) throw error

            setArticles([data, ...articles])
            // Reset form
            setTitle('')
            setTags('')
            setDifficulty('Not Specified')
            setIsTranslation(false)
            setDescription('')
            setContent('')
            setImageUrl('')
            setReadMoreText('Read more')
        } catch (error) {
            console.error('Error adding article:', error)
            alert('Failed to add article. Make sure you are logged in to Supabase and have run the migration script.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return

        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id)

            if (error) throw error
            setArticles(articles.filter(a => a.id !== id))
        } catch (error) {
            console.error('Error deleting article:', error)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/admin/feedback')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Feedback
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-1 gap-8">
                    {/* Editor Section */}
                    <div className="bg-[var(--main-container-bg)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">New Publication</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-0 py-4 text-4xl font-bold bg-transparent border-b border-[var(--border-color)] focus:border-blue-500 outline-none placeholder-gray-600"
                                    placeholder="Title"
                                />
                            </div>

                            {/* Keywords */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Keywords</label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Enter keywords separated by commas (e.g. university, scholarship, usa)"
                                />
                            </div>

                            {/* Options Row */}
                            <div className="flex flex-wrap gap-8 items-start p-4 rounded-lg bg-black/20 border border-[var(--border-color)]">
                                {/* Translation */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-400">Translated Content</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isTranslation}
                                            onChange={e => setIsTranslation(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent"
                                        />
                                        <span className="text-sm">Publication is a translation</span>
                                    </label>
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-400">Difficulty Level</label>
                                    <div className="flex gap-4">
                                        {['Not Specified', 'Easy', 'Medium', 'Hard'].map((level) => (
                                            <label key={level} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="difficulty"
                                                    value={level}
                                                    checked={difficulty === level}
                                                    onChange={e => setDifficulty(e.target.value)}
                                                    className="w-4 h-4 border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent"
                                                />
                                                <span className="text-sm">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Cover Image</label>
                                <div className="relative border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 transition-colors hover:border-blue-500 group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        {imageUrl ? (
                                            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                                <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-white font-medium">Click to change image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                                    <Upload className="w-8 h-8 text-blue-500" />
                                                </div>
                                                <p className="font-medium mb-1">Click or drag image here</p>
                                                <p className="text-sm opacity-70">Recommended size: 780x440</p>
                                            </>
                                        )}
                                        {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Short Description (Abstract)</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
                                    placeholder="Brief summary displayed in the feed..."
                                />
                            </div>

                            {/* Full Content */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Full Content</label>
                                <textarea
                                    rows={15}
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    placeholder="Write your article content here (Markdown supported)..."
                                />
                            </div>

                            {/* Read More Text */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">"Read more" Button Text</label>
                                <input
                                    type="text"
                                    value={readMoreText}
                                    onChange={e => setReadMoreText(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Read more"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-[var(--border-color)]">
                                <button
                                    type="submit"
                                    disabled={submitting || uploading}
                                    className="px-8 py-3 bg-[#7aa600] hover:bg-[#8bbd00] text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Publishing...' : 'Send for Moderation (Publish)'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Published Articles List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4">Published Articles ({articles.length})</h2>
                        {articles.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-2xl border-gray-700">
                                No articles published yet.
                            </div>
                        ) : (
                            articles.map(article => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl border flex gap-4 items-start group"
                                    style={{
                                        backgroundColor: 'var(--main-container-bg)',
                                        borderColor: 'var(--border-color)'
                                    }}
                                >
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-32 h-24 rounded-lg object-cover bg-gray-800"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                                        <div className="flex gap-2 mb-2">
                                            {article.difficulty && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                                                    {article.difficulty}
                                                </span>
                                            )}
                                            {article.is_translation && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/50 text-blue-300">
                                                    Translation
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{article.description}</p>
                                        <a href={article.link_url} target="_blank" className="text-xs text-blue-500 hover:underline">
                                            {article.link_url}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
