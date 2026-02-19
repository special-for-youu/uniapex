'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Search, Filter, ExternalLink, Calendar, MapPin, X, Loader2, ChevronDown, Heart, Globe } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface Activity {
    id: string
    title: string
    description: string
    category: string // In DB this is joined tags
    website_url: string | null
    // UI helper fields
    tags: string[]
    organization?: string
    location?: string
    application_deadline?: string
}

const FILTER_CATEGORIES = {
    'Science & Math': ['Astronomy', 'Biology', 'Chemistry', 'Environmental Science', 'Mathematics', 'Physics'],
    'Engineering & Tech': ['Aerospace Engineering', 'Architecture', 'Computer Science', 'Cybersecurity', 'Electrical Engineering', 'Mechanical Engineering'],
    'Social Sciences': ['Business', 'Economics', 'Entrepreneurship', 'Geography', 'Government/Politics', 'Global Affairs', 'Law', 'Psychology'],
    'Arts & Humanities': ['Art/Design', 'Debate', 'Film', 'Foreign Language', 'History', 'Performing Arts', 'Photography', 'Music', 'Writing'],
    'Grade Level': ['Freshman', 'Sophomore', 'Junior', 'Senior'],
    'Activity Type': ['Community Service', 'Competition', 'General', 'In-Person', 'Internship', 'Leadership', 'Research', 'Robotics', 'STEM', 'Summer Program', 'Virtual']
}

const ITEMS_PER_PAGE = 10;

export default function ExtracurricularsPage() {
    const [allActivities, setAllActivities] = useState<Activity[]>([])
    const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
    const [visibleActivities, setVisibleActivities] = useState<Activity[]>([])

    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [rewardFilter, setRewardFilter] = useState<'all' | 'cash'>('all')
    const [costFilter, setCostFilter] = useState<'all' | 'free' | 'paid'>('all')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const observerTarget = useRef(null)

    const supabase = createClient()

    useEffect(() => {
        loadAllActivities()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [searchTerm, selectedTags, rewardFilter, costFilter, allActivities])

    useEffect(() => {
        updateVisibleActivities()
    }, [filteredActivities, page])

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    loadMore()
                }
            },
            { threshold: 1.0 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current)
            }
        }
    }, [hasMore, loading, loadingMore, visibleActivities])

    const loadAllActivities = async () => {
        try {
            setLoading(true)
            // Fetch all activities to allow for proper client-side filtering
            const { data, error } = await supabase
                .from('extracurricular_activities')
                .select('*')
                .limit(2000)

            if (error) throw error

            const mappedActivities = (data || []).map((item: any) => {
                const tags = item.category ? item.category.split(',').map((t: string) => t.trim()) : []

                return {
                    ...item,
                    tags: tags,
                    organization: 'Unknown Organization',
                    location: 'Online/Remote',
                    application_deadline: null
                }
            })

            setAllActivities(mappedActivities)
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error loading activities:', error)
        } finally {
            setLoading(false)
        }
    }

    const applyFilters = () => {
        let result = allActivities

        // Search Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase()
            result = result.filter(a =>
                a.title.toLowerCase().includes(lowerTerm) ||
                a.description.toLowerCase().includes(lowerTerm)
            )
        }

        // Tag Filter (OR logic - match any selected tag)
        if (selectedTags.length > 0) {
            result = result.filter(a =>
                a.tags.some(tag => selectedTags.includes(tag)) ||
                // Also check if the category string itself contains the tag (fuzzy match)
                selectedTags.some(selected => a.category.includes(selected))
            )
        }

        // Reward Filter
        if (rewardFilter === 'cash') {
            result = result.filter(a => {
                const text = (a.title + a.description).toLowerCase()
                return text.includes('cash') || text.includes('prize') || text.includes('money') || text.includes('award') || text.includes('$')
            })
        }

        // Cost Filter
        if (costFilter !== 'all') {
            result = result.filter(a => {
                const text = (a.title + a.description).toLowerCase()
                const isFree = text.includes('free') || text.includes('no cost') || text.includes('fully funded')
                const isPaid = text.includes('fee') || text.includes('tuition') || text.includes('cost') || text.includes('paid')

                if (costFilter === 'free') return isFree && !isPaid
                if (costFilter === 'paid') return isPaid && !isFree
                return true
            })
        }

        setFilteredActivities(result)
        setPage(1) // Reset to first page on filter change
        setHasMore(result.length > ITEMS_PER_PAGE)
    }

    const updateVisibleActivities = () => {
        const end = page * ITEMS_PER_PAGE
        const sliced = filteredActivities.slice(0, end)
        setVisibleActivities(sliced)
        setHasMore(sliced.length < filteredActivities.length)
        setLoadingMore(false)
    }

    const loadMore = () => {
        if (!hasMore) return
        setLoadingMore(true)
        // Simulate network delay for smoother UX
        setTimeout(() => {
            setPage(prev => prev + 1)
        }, 500)
    }

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    return (
        <div className="min-h-screen p-8 bg-background text-foreground">
            <div className="max-w-7xl mx-auto relative">
                <header className="mb-12 text-center pt-8">
                    <h1 className="text-3xl font-bold mb-6">Extracurricular Activities</h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto">
                        Discover internships, research opportunities, and competitions to boost your profile.
                    </p>
                </header>

                {/* Search & Filters */}
                <div className="max-w-7xl mx-auto mb-12 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, subject, or keyword..."
                                className="w-full pl-12 pr-6 h-12 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-blue-500 outline-none text-base transition-all shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 h-12 rounded-xl border transition-all flex items-center justify-center gap-2 text-base font-medium shadow-sm ${showFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-card border-border text-foreground hover:bg-muted'}`}
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                            {(selectedTags.length > 0 || rewardFilter !== 'all' || costFilter !== 'all') && (
                                <span className="bg-white text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                    {selectedTags.length + (rewardFilter !== 'all' ? 1 : 0) + (costFilter !== 'all' ? 1 : 0)}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 border border-border bg-card">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-2xl">Filter Options</h3>
                                {(selectedTags.length > 0 || rewardFilter !== 'all' || costFilter !== 'all') && (
                                    <button
                                        onClick={() => { setSelectedTags([]); setRewardFilter('all'); setCostFilter('all'); }}
                                        className="text-base text-muted-foreground hover:text-blue-500 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 mb-8">
                                {/* Reward Filter */}
                                <div>
                                    <h4 className="text-blue-500 font-semibold mb-4 text-base uppercase tracking-wider border-b border-blue-500/20 pb-2">Reward Type</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setRewardFilter('all')}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${rewardFilter === 'all' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-background border-border text-foreground hover:bg-muted'}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setRewardFilter('cash')}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${rewardFilter === 'cash' ? 'bg-green-600 border-green-500 text-white' : 'bg-background border-border text-foreground hover:bg-muted'}`}
                                        >
                                            Cash Prize
                                        </button>
                                    </div>
                                </div>

                                {/* Cost Filter */}
                                <div>
                                    <h4 className="text-blue-500 font-semibold mb-4 text-base uppercase tracking-wider border-b border-blue-500/20 pb-2">Entry Cost</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCostFilter('all')}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${costFilter === 'all' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-background border-border text-foreground hover:bg-muted'}`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setCostFilter('free')}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${costFilter === 'free' ? 'bg-green-600 border-green-500 text-white' : 'bg-background border-border text-foreground hover:bg-muted'}`}
                                        >
                                            Free
                                        </button>
                                        <button
                                            onClick={() => setCostFilter('paid')}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${costFilter === 'paid' ? 'bg-purple-600 border-purple-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
                                            style={costFilter !== 'paid' ? { backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' } : {}}
                                        >
                                            Paid
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                                {Object.entries(FILTER_CATEGORIES).map(([category, tags]) => (
                                    <div key={category}>
                                        <h4 className="text-blue-500 font-semibold mb-4 text-base uppercase tracking-wider border-b border-blue-500/20 pb-2">{category}</h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {tags.map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => toggleTag(tag)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${selectedTags.includes(tag)
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-105'
                                                        : 'hover:bg-gray-100 dark:hover:bg-white/10'
                                                        }`}
                                                    style={!selectedTags.includes(tag) ? { backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' } : {}}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Activities Grid */}
                {loading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto">
                            {visibleActivities.map(activity => (
                                <motion.div
                                    key={activity.id}
                                    layoutId={`card-${activity.id}`}
                                    onClick={() => setSelectedActivity(activity)}
                                    className="group relative bg-card rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full cursor-pointer overflow-hidden"
                                >
                                    <div className="mb-4 pr-12 relative z-10">
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-card-foreground">
                                            {activity.title}
                                        </h3>
                                        <div className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                            {activity.description}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-4 relative z-10">
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {activity.tags.slice(0, 3).map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {activity.tags.length > 3 && (
                                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                                                    +{activity.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {visibleActivities.length === 0 && (
                            <div className="text-center py-20 opacity-80">
                                <p className="text-2xl">No activities found matching your criteria.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedTags([]); }}
                                    className="mt-4 text-blue-500 hover:underline text-lg"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Infinite Scroll Target */}
                        {hasMore && (
                            <div ref={observerTarget} className="flex justify-center py-8">
                                {loadingMore && <Loader2 className="w-8 h-8 animate-spin text-blue-500" />}
                            </div>
                        )}

                        <div className="text-center text-gray-500 pb-8 text-sm">
                            Showing {visibleActivities.length} of {filteredActivities.length} activities
                        </div>
                    </>
                )}
            </div>

            {/* Activity Modal */}
            <AnimatePresence>
                {selectedActivity && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedActivity(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`card-${selectedActivity.id}`}
                            className="relative w-full max-w-lg bg-card rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className="absolute top-4 right-4 p-2 bg-muted rounded-full text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                                <span className="font-medium text-blue-500">Made By:</span>
                                <span>Project: Empower</span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-card-foreground leading-tight">
                                {selectedActivity.title}
                            </h2>

                            <div className="flex items-center gap-3 mb-6">
                                <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-pink-500 hover:border-pink-500 transition-colors">
                                    <Heart className="w-6 h-6" />
                                </button>
                                {selectedActivity.website_url && (
                                    <a
                                        href={selectedActivity.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Visit Website
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>

                            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                                <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                                    {selectedActivity.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedActivity.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
