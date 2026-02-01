'use client'

import { motion } from 'framer-motion'
import { PieChart, Briefcase, Brain, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import AssessmentsTable from '../components/AssessmentsTable'

export default function AnalysePage() {
    interface TestItem {
        title: string
        description: string
        icon: any
        href: string
        color: string
        bgColor: string
        borderColor: string
        delay: number
        comingSoon?: boolean
    }

    const tests: TestItem[] = [
        {
            title: 'General Test',
            description: 'Get personalized AI recommendations for universities and majors based on your profile.',
            icon: Sparkles,
            href: '/test-intro',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-200 dark:border-blue-900',
            delay: 0.1
        },
        {
            title: 'Career Test',
            description: 'Discover careers that match your skills and interests with our AI-powered analysis.',
            icon: Briefcase,
            href: '/career-test',
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-200 dark:border-purple-900',
            delay: 0.2
        },
        {
            title: 'MBTI Personality',
            description: 'Understand your personality type and how it influences your academic journey.',
            icon: Brain,
            href: '/mbti-test',
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
            borderColor: 'border-pink-200 dark:border-pink-900',
            delay: 0.3
        }
    ]

    return (
        <div className="min-h-screen p-6 md:p-10 space-y-8">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <PieChart className="w-8 h-8 text-primary" />
                        Analyse Your Potential
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Take our AI-powered tests to discover your strengths, ideal careers, and best-fit universities.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test, index) => (
                        <motion.div
                            key={test.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: test.delay }}
                            className={`relative group rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 bg-card ${test.borderColor}`}
                        >
                            <div className={`w-12 h-12 rounded-xl ${test.bgColor} ${test.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <test.icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                            <p className="text-muted-foreground mb-6 min-h-[3rem]">
                                {test.description}
                            </p>

                            {test.comingSoon ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                    Coming Soon
                                </span>
                            ) : (
                                <Link
                                    href={test.href}
                                    className="inline-flex items-center text-sm font-semibold text-primary hover:gap-2 transition-all"
                                >
                                    Start Test <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            )}
                        </motion.div>
                    ))}
                </div>

                <AssessmentsTable />
            </div>
        </div>
    )
}
