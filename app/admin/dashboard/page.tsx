'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, LogOut, Image as ImageIcon, Link as LinkIcon, FileText, MessageSquare, X, Upload, Edit } from 'lucide-react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import rehypeSanitize from 'rehype-sanitize'

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
)

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
    const [supabase] = useState(() => createClient())

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
    const [editingId, setEditingId] = useState<string | null>(null)

    const resetForm = () => {
        setTitle('')
        setTags('')
        setDifficulty('Not Specified')
        setIsTranslation(false)
        setDescription('')
        setContent('')
        setImageUrl('')
        setReadMoreText('Read more')
        setEditingId(null)
    }

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

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' })
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

            const articleData = {
                title,
                description,
                content,
                image_url: imageUrl,
                link_url: autoLinkUrl,
                tags: tagsArray,
                difficulty,
                is_translation: isTranslation,
                read_more_text: readMoreText
            }

            let data: any, error: any;

            if (editingId) {
                const result = await supabase
                    .from('articles')
                    .update(articleData)
                    .eq('id', editingId)
                    .select()
                    .single()
                data = result.data;
                error = result.error;

                if (!error) {
                    setArticles(articles.map(a => a.id === editingId ? data : a))
                }
            } else {
                const result = await supabase
                    .from('articles')
                    .insert(articleData)
                    .select()
                    .single()
                data = result.data;
                error = result.error;

                if (!error) {
                    setArticles([data, ...articles])
                }
            }

            if (error) throw error

            resetForm()
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

    const handleEdit = (article: Article) => {
        setEditingId(article.id)
        setTitle(article.title)
        setTags(article.tags?.join(', ') || '')
        setDifficulty(article.difficulty || 'Not Specified')
        setIsTranslation(article.is_translation || false)
        setDescription(article.description || '')
        setContent(article.content || '')
        setImageUrl(article.image_url || '')
        setReadMoreText(article.read_more_text || 'Read more')

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-grid-pattern text-white">Loading...</div>

    return (
        <div className="min-h-screen p-8 bg-grid-pattern text-foreground relative">
            {/* Background glow for admin dashboard */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="flex gap-3">
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
                    <div className="glass-card border border-white/10 rounded-2xl p-8 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingId ? 'Edit Publication' : 'New Publication'}
                            </h2>
                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-0 py-4 text-4xl font-bold bg-transparent border-b border-white/10 focus:border-primary outline-none placeholder-gray-600 text-white"
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
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Enter keywords separated by commas (e.g. university, scholarship, usa)"
                                />
                            </div>

                            {/* Options Row */}
                            <div className="flex flex-wrap gap-8 items-start p-4 rounded-lg bg-black/20 border border-white/10">
                                {/* Translation */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-400">Translated Content</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isTranslation}
                                            onChange={e => setIsTranslation(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-transparent"
                                        />
                                        <span className="text-sm text-white font-medium">Publication is a translation</span>
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
                                                    className="w-4 h-4 border-gray-600 text-primary focus:ring-primary bg-transparent"
                                                />
                                                <span className="text-sm text-white font-medium">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Cover Image</label>
                                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 transition-colors hover:border-primary group bg-black/20">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        {imageUrl ? (
                                            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                                <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-white font-medium">Click to change image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                                    <Upload className="w-8 h-8 text-primary" />
                                                </div>
                                                <p className="font-medium mb-1 text-white">Click or drag image here</p>
                                                <p className="text-sm opacity-50">Recommended size: 780x440</p>
                                            </>
                                        )}
                                        {uploading && <p className="text-primary mt-2">Uploading...</p>}
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
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-primary outline-none resize-none font-mono text-sm"
                                    placeholder="Brief summary displayed in the feed..."
                                />
                            </div>

                            {/* Full Content */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">Full Content</label>
                                <div data-color-mode="dark" className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
                                    <MDEditor
                                        value={content}
                                        onChange={(val) => setContent(val || '')}
                                        previewOptions={{
                                            rehypePlugins: [[rehypeSanitize]],
                                        }}
                                        height={500}
                                        className="!bg-transparent markdown-editor custom-editor"
                                        textareaProps={{
                                            placeholder: 'Write your article content here (Markdown supported)...'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Read More Text */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-400">"Read more" Button Text</label>
                                <input
                                    type="text"
                                    value={readMoreText}
                                    onChange={e => setReadMoreText(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-white focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Read more"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-white/10">
                                <button
                                    type="submit"
                                    disabled={submitting || uploading}
                                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
                                >
                                    {submitting ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Publication' : 'Send for Moderation (Publish)')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Published Articles List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold mb-4 text-white">Published Articles ({articles.length})</h2>
                        {articles.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-2xl border-white/10 bg-black/20">
                                No articles published yet.
                            </div>
                        ) : (
                            articles.map(article => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl border border-white/10 flex gap-4 items-start group glass-card hover:bg-white/5 transition-all"
                                >
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-32 h-24 rounded-lg object-cover bg-gray-800"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-lg mb-1 text-white">{article.title}</h3>
                                        <div className="flex gap-2 mb-2">
                                            {article.difficulty && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                                                    {article.difficulty}
                                                </span>
                                            )}
                                            {article.is_translation && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                                    Translation
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{article.description}</p>
                                        <a href={article.link_url} target="_blank" className="text-xs text-primary hover:underline">
                                            {article.link_url}
                                        </a>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
