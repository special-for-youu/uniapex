'use client'

import { useState } from 'react'
import { Search, DollarSign, TrendingUp, Globe, Briefcase } from 'lucide-react'

// Mock Data (Simulating joo.kz and global sources)
const salaryData = [
    {
        id: 1,
        title: 'Software Engineer',
        category: 'IT',
        salaryKZ: 800000,
        salaryUS: 8500,
        salaryCanada: 6500,
        demand: 'High',
        growth: '+22%'
    },
    {
        id: 2,
        title: 'Data Scientist',
        category: 'IT',
        salaryKZ: 950000,
        salaryUS: 10000,
        salaryCanada: 7200,
        demand: 'Very High',
        growth: '+28%'
    },
    {
        id: 3,
        title: 'Petroleum Engineer',
        category: 'Engineering',
        salaryKZ: 1200000,
        salaryUS: 9000,
        salaryCanada: 8000,
        demand: 'Stable',
        growth: '+5%'
    },
    {
        id: 4,
        title: 'Marketing Manager',
        category: 'Business',
        salaryKZ: 450000,
        salaryUS: 6000,
        salaryCanada: 4500,
        demand: 'Medium',
        growth: '+10%'
    },
    {
        id: 5,
        title: 'Architect',
        category: 'Engineering',
        salaryKZ: 350000,
        salaryUS: 7000,
        salaryCanada: 5500,
        demand: 'Medium',
        growth: '+8%'
    },
    {
        id: 6,
        title: 'Financial Analyst',
        category: 'Business',
        salaryKZ: 500000,
        salaryUS: 7500,
        salaryCanada: 6000,
        demand: 'High',
        growth: '+15%'
    }
]

export default function SalariesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedJob, setSelectedJob] = useState<any>(null)

    const filteredJobs = salaryData.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Salary Comparison</h1>
                    <p className="text-gray-500 dark:text-gray-300">Compare salaries across Kazakhstan, USA, and Canada. Data source: joo.kz & Glassdoor.</p>
                </header>

                {/* Search */}
                <div className="max-w-2xl mx-auto mb-12 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search profession (e.g. Software Engineer)..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg border"
                        style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Job List */}
                    <div className="lg:col-span-1 space-y-4">
                        {filteredJobs.map(job => (
                            <div
                                key={job.id}
                                onClick={() => setSelectedJob(job)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedJob?.id === job.id
                                    ? 'bg-blue-500/20 border-blue-500'
                                    : 'hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                                style={selectedJob?.id !== job.id ? { backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' } : {}}
                            >
                                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-color)' }}>{job.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{job.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comparison View */}
                    <div className="lg:col-span-2">
                        {selectedJob ? (
                            <div className="backdrop-blur-xl border rounded-2xl p-8 animate-in fade-in zoom-in duration-300 shadow-sm" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)', boxShadow: 'var(--container-shadow)' }}>
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>{selectedJob.title}</h2>
                                        <div className="flex gap-4">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 rounded-full text-sm flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" /> Demand: {selectedJob.demand}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 rounded-full text-sm">
                                                Growth: {selectedJob.growth}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Salary Bars */}
                                <div className="space-y-8">
                                    {/* Kazakhstan */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">🇰🇿</span>
                                                <span className="font-medium" style={{ color: 'var(--text-color)' }}>Kazakhstan</span>
                                            </div>
                                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                ₸{selectedJob.salaryKZ.toLocaleString()} <span className="text-sm text-gray-500 dark:text-gray-400">/ mo</span>
                                            </span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(selectedJob.salaryKZ / 2000000) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* USA */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">🇺🇸</span>
                                                <span className="font-medium" style={{ color: 'var(--text-color)' }}>USA</span>
                                            </div>
                                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                ${selectedJob.salaryUS.toLocaleString()} <span className="text-sm text-gray-500 dark:text-gray-400">/ mo</span>
                                            </span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${(selectedJob.salaryUS / 15000) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">~ ₸{(selectedJob.salaryUS * 450).toLocaleString()}</p>
                                    </div>

                                    {/* Canada */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">🇨🇦</span>
                                                <span className="font-medium" style={{ color: 'var(--text-color)' }}>Canada</span>
                                            </div>
                                            <span className="text-xl font-bold text-red-600 dark:text-red-400">
                                                ${selectedJob.salaryCanada.toLocaleString()} <span className="text-sm text-gray-500 dark:text-gray-400">/ mo</span>
                                            </span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-500 rounded-full"
                                                style={{ width: `${(selectedJob.salaryCanada / 15000) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">~ ₸{(selectedJob.salaryCanada * 330).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Insight
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        In the USA, a {selectedJob.title} earns approximately {(selectedJob.salaryUS * 450 / selectedJob.salaryKZ).toFixed(1)}x more than in Kazakhstan, but the cost of living is also significantly higher.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 rounded-2xl border p-12" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                                <div className="text-center">
                                    <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Select a profession to see salary comparison</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
