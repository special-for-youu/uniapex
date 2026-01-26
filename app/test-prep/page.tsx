'use client'

import { motion } from 'framer-motion'
import { BookOpen, CheckCircle2, ArrowRight, GraduationCap, Globe, PenTool } from 'lucide-react'
import Link from 'next/link'

export default function TestPrepPage() {
    return (
        <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold mb-4">Test Preparation</h1>
                    <p className="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
                        Master the exams you need for your dream university. Comprehensive guides and resources for IELTS, SAT, and NUET.
                    </p>
                </header>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* IELTS Section */}
                    <TestCard
                        title="IELTS"
                        description="International English Language Testing System"
                        icon={<Globe className="w-8 h-8 text-blue-500" />}
                        color="blue"
                        features={[
                            "Reading & Listening Practice",
                            "Speaking Mock Tests",
                            "Writing Task 1 & 2 Templates",
                            "Vocabulary Builder"
                        ]}
                    />

                    {/* SAT Section */}
                    <TestCard
                        title="SAT"
                        description="Scholastic Assessment Test"
                        icon={<BookOpen className="w-8 h-8 text-purple-500" />}
                        color="purple"
                        features={[
                            "Math (No Calculator & Calculator)",
                            "Evidence-Based Reading",
                            "Writing & Language",
                            "Practice Tests"
                        ]}
                    />

                    {/* NUET Section */}
                    <TestCard
                        title="NUET"
                        description="Nazarbayev University Entrance Test"
                        icon={<GraduationCap className="w-8 h-8 text-green-500" />}
                        color="green"
                        features={[
                            "Critical Thinking",
                            "Problem Solving",
                            "Subject Tests (Math, Physics)",
                            "Past Papers Analysis"
                        ]}
                    />
                </div>

                {/* Study Plan Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 p-8 rounded-2xl border backdrop-blur-xl"
                    style={{
                        backgroundColor: 'var(--main-container-bg)',
                        borderColor: 'var(--border-color)',
                        boxShadow: 'var(--container-shadow)'
                    }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Need a Personalized Study Plan?</h2>
                            <p className="text-gray-500 dark:text-gray-300 mb-6">
                                Our AI Tutor can create a custom schedule based on your target score and available time.
                            </p>
                            <Link
                                href="/ai-tutor"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                            >
                                <PenTool className="w-5 h-5" />
                                Create Study Plan
                            </Link>
                        </div>
                        <div className="w-full md:w-1/3 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                            <span className="text-6xl">📅</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function TestCard({ title, description, icon, color, features }: { title: string; description: string; icon: React.ReactNode; color: string; features: string[] }) {
    const bgColors: { [key: string]: string } = {
        blue: 'rgba(59, 130, 246, 0.1)',
        purple: 'rgba(168, 85, 247, 0.1)',
        green: 'rgba(34, 197, 94, 0.1)'
    }

    const borderColors: { [key: string]: string } = {
        blue: 'rgba(59, 130, 246, 0.3)',
        purple: 'rgba(168, 85, 247, 0.3)',
        green: 'rgba(34, 197, 94, 0.3)'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border transition-all hover:scale-[1.02]"
            style={{
                backgroundColor: 'var(--main-container-bg)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--container-shadow)'
            }}
        >
            <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ backgroundColor: bgColors[color] }}
            >
                {icon}
            </div>

            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 h-12">{description}</p>

            <div className="space-y-3 mb-8">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <button
                className="w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                style={{
                    backgroundColor: bgColors[color],
                    color: 'var(--text-color)',
                    border: `1px solid ${borderColors[color]}`
                }}
            >
                Start Preparing <ArrowRight className="w-4 h-4" />
            </button>
        </motion.div>
    )
}
