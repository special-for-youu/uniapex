
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { getProfile, createProfile } from '@/lib/supabase'
import { Profile } from '@/lib/supabase'
import { BookOpen, School, Target, Sparkles, TrendingUp, Award, ChevronRight, FileText } from 'lucide-react'
import ArticleCard from './components/ArticleCard'
import TodoList from './components/TodoList'

interface Article {
    id: string
    title: string
    description: string
    image_url: string
    link_url: string
    content?: string
}

export default function DashboardPage() {
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [articles, setArticles] = useState<Article[]>([])
    const supabase = createClient()

    useEffect(() => {
        loadUserData()
        fetchArticles()
    }, [])

    const loadUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/auth')
                return
            }

            let userProfile = await getProfile(user.id, supabase)

            if (!userProfile) {
                userProfile = await createProfile(user.id, user.email!, supabase)
            }

            setProfile(userProfile)
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error loading user data:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4)

            if (error) throw error
            setArticles(data || [])
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error fetching articles:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6 pt-20 md:p-8" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl border backdrop-blur-xl min-h-[400px]"
                            style={{
                                backgroundColor: 'var(--main-container-bg)',
                                borderColor: 'var(--border-color)',
                                boxShadow: 'var(--container-shadow)'
                            }}
                        >
                            <TodoList />
                        </motion.div>



                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-blue-500" />
                                Latest Articles
                            </h2>

                            {articles.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {articles.map((article, index) => (
                                        <ArticleCard
                                            key={article.id}
                                            title={article.title}
                                            description={article.description}
                                            image={article.image_url}
                                            href={article.content ? `/article/${article.id}` : article.link_url}
                                            delay={0.3 + (index * 0.1)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 rounded-2xl border border-dashed border-gray-700 text-center text-gray-500">
                                    <p>No articles available yet.</p>
                                    <p className="text-sm mt-2">Check back later for updates!</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="space-y-6">

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 rounded-2xl border backdrop-blur-xl"
                            style={{
                                backgroundColor: 'var(--main-container-bg)',
                                borderColor: 'var(--border-color)',
                                boxShadow: 'var(--container-shadow)'
                            }}
                        >
                            <h3 className="text-lg font-bold mb-6">Your Profile Snapshot</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-green-500 mb-2 flex justify-center"><TrendingUp className="w-6 h-6" /></div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">GPA</div>
                                    <div className="text-2xl font-bold">{profile?.current_gpa?.toFixed(2) || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-blue-500 mb-2 flex justify-center"><BookOpen className="w-6 h-6" /></div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">IELTS</div>
                                    <div className="text-2xl font-bold">{profile?.ielts_score?.toFixed(1) || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-purple-500 mb-2 flex justify-center"><Award className="w-6 h-6" /></div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">SAT</div>
                                    <div className="text-2xl font-bold">{profile?.sat_score || '-'}</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-6 rounded-2xl border backdrop-blur-xl"
                            style={{
                                backgroundColor: 'var(--main-container-bg)',
                                borderColor: 'var(--border-color)',
                                boxShadow: 'var(--container-shadow)'
                            }}
                        >
                            <h3 className="text-lg font-bold mb-4">Essential Resources & Tools</h3>
                            <div className="space-y-4">
                                <ResourceLink
                                    href="/ai-tutor"
                                    icon={<Sparkles className="w-5 h-5 text-green-400" />}
                                    title="AI Tutor"
                                    description="Get personalized study guidance"
                                    color="green"
                                />
                                <ResourceLink
                                    href="/universities"
                                    icon={<School className="w-5 h-5 text-blue-400" />}
                                    title="University Search"
                                    description="Find competitions and opportunities"
                                    color="blue"
                                />
                                <ResourceLink
                                    href="/career-test"
                                    icon={<Target className="w-5 h-5 text-purple-400" />}
                                    title="Career Test"
                                    description="Discover your ideal profession"
                                    color="purple"
                                />
                            </div>
                        </motion.div>

                        <div className="space-y-6">
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 rounded-2xl border backdrop-blur-xl"
                                style={{
                                    backgroundColor: 'var(--main-container-bg)',
                                    borderColor: 'var(--border-color)',
                                    boxShadow: 'var(--container-shadow)'
                                }}
                            >
                                <h3 className="text-xl font-bold mb-4">What You Need to Know</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Key Application Deadlines",
                                        "Required Documents Checklist",
                                        "Common Interview Questions",
                                        "Life on Campus Tips",
                                        "Student Health Insurance"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-6 rounded-2xl border backdrop-blur-xl"
                                style={{
                                    backgroundColor: 'var(--main-container-bg)',
                                    borderColor: 'var(--border-color)',
                                    boxShadow: 'var(--container-shadow)'
                                }}
                            >
                                <h3 className="text-xl font-bold mb-4">University Journey Guides</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Interactive guide to university journey",
                                        "Complete guide to standardized tests",
                                        "Drafting the perfect personal statement",
                                        "Comparing university offers",
                                        "Pre-departure orientation guide"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ResourceLink({ href, icon, title, description, color }: { href: string; icon: React.ReactNode; title: string; description: string; color: string }) {
    const bgColors: { [key: string]: string } = {
        green: 'rgba(74, 222, 128, 0.1)',
        blue: 'rgba(96, 165, 250, 0.1)',
        purple: 'rgba(192, 132, 252, 0.1)'
    }

    return (
        <Link href={href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: bgColors[color] || 'rgba(255,255,255,0.1)' }}
            >
                {icon}
            </div>
            <div className="flex-grow">
                <div className="font-semibold text-sm group-hover:text-blue-400 transition-colors">{title}</div>
                <div className="text-xs text-gray-500 line-clamp-1">{description}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
        </Link>
    )
}
