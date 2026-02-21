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
        <div className="min-h-screen p-6 pt-20 md:p-8 bg-grid-pattern text-foreground relative">
            {/* Background glow for careers page */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-4 text-white">Career Explorer</h1>
                    <p className="text-gray-400 max-w-2xl">
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
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-black/20 text-white placeholder:text-gray-500"
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
                                className="p-6 rounded-xl border border-white/5 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-primary/50 group glass-card"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    {career.growth_rate && (
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getGrowthColor(career.growth_rate).replace('bg-gray-100', 'bg-gray-800').replace('text-gray-500', 'text-gray-400').replace('bg-red-100', 'bg-red-900/30').replace('text-red-600', 'text-red-400').replace('bg-green-100', 'bg-green-900/30').replace('text-green-600', 'text-green-400').replace('bg-blue-100', 'bg-blue-900/30').replace('text-blue-600', 'text-blue-400')}`}>
                                            {career.growth_rate.split('(')[0].trim()}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white group-hover:text-primary transition-colors">
                                    {career.title}
                                </h3>

                                {career.salary_text && (
                                    <div className="flex items-center gap-1 text-green-400 font-medium mb-3">
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

                                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                                    {career.description}
                                </p>

                                <div className="text-primary text-sm font-medium group-hover:underline flex items-center gap-1">
                                    View Details <ExternalLink className="w-3 h-3" />
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
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-8 glass-card border border-white/10"
                        >
                            <button
                                onClick={() => setSelectedCareer(null)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-3xl font-bold mb-2 text-white">{selectedCareer.title}</h2>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    {selectedCareer.salary_text && (
                                        <div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                            <div className="text-xs text-green-400 font-medium uppercase tracking-wider mb-1">Median Pay</div>
                                            <div className="text-lg font-bold text-green-300">
                                                {selectedCareer.salary_text}
                                            </div>
                                        </div>
                                    )}
                                    {selectedCareer.growth_rate && (
                                        <div className={`px-4 py-2 rounded-lg border ${selectedCareer.growth_rate.includes('Decline')
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : 'bg-blue-500/10 border-blue-500/20'
                                            }`}>
                                            <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${selectedCareer.growth_rate.includes('Decline') ? 'text-red-400' : 'text-blue-400'
                                                }`}>Growth Rate</div>
                                            <div className={`text-lg font-bold ${selectedCareer.growth_rate.includes('Decline') ? 'text-red-300' : 'text-blue-300'
                                                }`}>
                                                {selectedCareer.growth_rate}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="flex items-center gap-2 text-xl font-semibold mb-3 text-white">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    About the Job
                                </h3>
                                <p className="text-foreground leading-relaxed text-lg">
                                    {selectedCareer.description}
                                </p>
                            </div>

                            {selectedCareer.url && (
                                <a
                                    href={selectedCareer.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/25"
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
