'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Search, TrendingUp, DollarSign, Briefcase, ExternalLink, Loader2, BookOpen, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Career {
    id: string
    title: string
    description: string | null
    salary_text: string | null
    growth_rate: string | null
    url: string | null
}

export default function CareersPage() {
    const [careers, setCareers] = useState<Career[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchCareers()
    }, [])

    const fetchCareers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('careers')
                .select('*')
                .order('title')

            if (error) throw error
            setCareers(data || [])
        } catch (error) {
            console.error('Error fetching careers:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCareers = careers.filter(career =>
        career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Helper to determine growth color
    const getGrowthColor = (rate: string | null) => {
        if (!rate) return 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
        if (rate.includes('Decline') || rate.includes('-')) return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
        if (rate.includes('Much faster') || rate.includes('Faster')) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
    }

    return (
        <div className="min-h-screen p-6 pt-20 md:p-8" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Career Explorer</h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                        Explore hundreds of careers with data from the Bureau of Labor Statistics.
                        Find out about salaries, growth rates, and what it takes to succeed.
                    </p>
                </header>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search careers (e.g. Software Developer, Nurse)..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCareers.map(career => (
                            <motion.div
                                key={career.id}
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedCareer(career)}
                                className="p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg group"
                                style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    {career.growth_rate && (
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getGrowthColor(career.growth_rate)}`}>
                                            {career.growth_rate.split('(')[0].trim()}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2 line-clamp-2" style={{ color: 'var(--text-color)' }}>
                                    {career.title}
                                </h3>

                                {career.salary_text && (
                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium mb-3">
                                        <DollarSign className="w-4 h-4" />
                                        <span>
                                            {(() => {
                                                const text = career.salary_text;
                                                // If both per year and per hour exist, prioritize per year
                                                if (text.includes('per year')) {
                                                    const yearSalary = text.split('per year')[0].trim();
                                                    return `${yearSalary} / yr`;
                                                } else if (text.includes('per hour')) {
                                                    const hourSalary = text.split('per hour')[0].trim();
                                                    return `${hourSalary} / hr`;
                                                }
                                                return text; // fallback
                                            })()}
                                        </span>
                                    </div>
                                )}

                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                                    {career.description}
                                </p>

                                <div className="text-blue-500 text-sm font-medium group-hover:underline">
                                    View Details
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!loading && filteredCareers.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No careers found</h3>
                        <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedCareer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCareer(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 md:p-8"
                            style={{ backgroundColor: 'var(--main-container-bg)', color: 'var(--text-color)' }}
                        >
                            <button
                                onClick={() => setSelectedCareer(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-3xl font-bold mb-2">{selectedCareer.title}</h2>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {selectedCareer.salary_text && (
                                        <div className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wider mb-1">Median Pay</div>
                                            <div className="text-lg font-bold text-green-700 dark:text-green-300">
                                                {selectedCareer.salary_text}
                                            </div>
                                        </div>
                                    )}
                                    {selectedCareer.growth_rate && (
                                        <div className={`px-4 py-2 rounded-lg border ${selectedCareer.growth_rate.includes('Decline')
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30'
                                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30'
                                            }`}>
                                            <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${selectedCareer.growth_rate.includes('Decline') ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                                                }`}>Growth Rate</div>
                                            <div className={`text-lg font-bold ${selectedCareer.growth_rate.includes('Decline') ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'
                                                }`}>
                                                {selectedCareer.growth_rate}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                    About the Job
                                </h3>
                                <p className="text-gray-700 dark:text-white leading-relaxed text-lg">
                                    {selectedCareer.description}
                                </p>
                            </div>

                            {selectedCareer.url && (
                                <a
                                    href={selectedCareer.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    View Full Report on BLS.gov
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
