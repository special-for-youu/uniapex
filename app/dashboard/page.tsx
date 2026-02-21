
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
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-xl font-medium tracking-wide animate-pulse">Initializing Command Center...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-6 pt-24 md:p-8 bg-grid-pattern">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Greeting Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400"
                        >
                            Welcome back, {profile?.full_name?.split(' ')[0] || 'Commander'}
                        </motion.h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Tasks & Articles */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Tasks Widget */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card p-6 rounded-2xl min-h-[400px]"
                        >
                            <TodoList />
                        </motion.div>

                        {/* Articles Section */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <span>Intelligence Feed</span>
                                </h2>
                                <Link href="/articles" className="text-sm text-primary hover:text-primary/80 transition-colors">
                                    Articles
                                </Link>
                            </div>

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
                                <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center text-gray-500 bg-white/5">
                                    <p>No intelligence reports available.</p>
                                    <p className="text-sm mt-2">Awaiting data uplink...</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Stats & Resources */}
                    <div className="space-y-6">

                        {/* Profile Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <h3 className="text-lg font-bold mb-6 text-foreground uppercase tracking-wider text-sm">Performance Metrics</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-green-500/30 transition-colors">
                                    <div className="text-green-400 mb-2 flex justify-center group-hover:scale-110 transition-transform"><TrendingUp className="w-5 h-5" /></div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">GPA</div>
                                    <div className="text-xl font-bold text-foreground">{profile?.current_gpa?.toFixed(2) || '-'}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
                                    <div className="text-blue-400 mb-2 flex justify-center group-hover:scale-110 transition-transform"><BookOpen className="w-5 h-5" /></div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">IELTS</div>
                                    <div className="text-xl font-bold text-foreground">{profile?.ielts_score?.toFixed(1) || '-'}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-purple-500/30 transition-colors">
                                    <div className="text-purple-400 mb-2 flex justify-center group-hover:scale-110 transition-transform"><Award className="w-5 h-5" /></div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">SAT</div>
                                    <div className="text-xl font-bold text-foreground">{profile?.sat_score || '-'}</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Essential Tools */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <h3 className="text-lg font-bold mb-4 text-foreground uppercase tracking-wider text-sm">Command Modules</h3>
                            <div className="space-y-3">
                                <ResourceLink
                                    href="/ai-tutor"
                                    icon={<Sparkles className="w-5 h-5 text-green-400" />}
                                    title="AI Tutor Protocol"
                                    description="Initialize personalized study guidance"
                                    color="green"
                                />
                                <ResourceLink
                                    href="/universities"
                                    icon={<School className="w-5 h-5 text-blue-400" />}
                                    title="University Scanner"
                                    description="Locate target institutions"
                                    color="blue"
                                />
                                <ResourceLink
                                    href="/career-test"
                                    icon={<Target className="w-5 h-5 text-purple-400" />}
                                    title="Career Trajectory"
                                    description="Calculate optimal profession"
                                    color="purple"
                                />
                            </div>
                        </motion.div>

                        {/* Info Sections */}
                        <div className="space-y-6">
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="glass-card p-6 rounded-2xl"
                            >
                                <h3 className="text-lg font-bold mb-4 text-foreground uppercase tracking-wider text-sm">Briefing Materials</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Key Application Deadlines",
                                        "Required Documents Checklist",
                                        "Common Interview Questions",
                                        "Life on Campus Tips",
                                        "Student Health Insurance"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-muted-foreground hover:text-blue-400 transition-colors cursor-pointer group font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:shadow-[0_0_8px_#3b82f6] transition-shadow" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="glass-card p-6 rounded-2xl"
                            >
                                <h3 className="text-lg font-bold mb-4 text-foreground uppercase tracking-wider text-sm">Journey Protocols</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Interactive guide to university journey",
                                        "Complete guide to standardized tests",
                                        "Drafting the perfect personal statement",
                                        "Comparing university offers",
                                        "Pre-departure orientation guide"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-muted-foreground hover:text-purple-400 transition-colors cursor-pointer group font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:shadow-[0_0_8px_#a855f7] transition-shadow" />
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
    const borderColors: { [key: string]: string } = {
        green: 'hover:border-green-500/50',
        blue: 'hover:border-blue-500/50',
        purple: 'hover:border-purple-500/50'
    }

    return (
        <Link href={href} className={`flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10 group ${borderColors[color]}`}>
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/20 border border-white/5 group-hover:scale-105 transition-transform"
            >
                {icon}
            </div>
            <div className="flex-grow">
                <div className="font-semibold text-sm text-foreground transition-colors">{title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{description}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        </Link>
    )
}
