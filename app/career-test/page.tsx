'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, BarChart2 } from 'lucide-react'
import questions from '@/app/data/questions.json'
import types from '@/app/data/types.json'
import { motion } from 'framer-motion'

interface Question {
    id: number
    section: string
    question: string
    options: { text: string; domain: string }[]
}

interface Type {
    id: string
    title: string
    focus: string
    description: string
}

interface Result {
    type: Type
    score: number
    percentage: number
}

export default function CareerTestPage() {
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [showResults, setShowResults] = useState(false)
    const [aiResults, setAiResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<Result[]>([])

    const typedQuestions = questions as Question[]
    const typedTypes = types as Type[]

    const handleAnswer = (domain: string) => {
        const newAnswers = [...answers, domain]
        setAnswers(newAnswers)

        if (currentQuestion < typedQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            calculateResults(newAnswers)
        }
    }

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
            setAnswers(answers.slice(0, -1))
        }
    }

    const calculateResults = async (finalAnswers: string[]) => {
        setLoading(true)
        setShowResults(true)

        // Count scores
        const counts: { [key: string]: number } = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }
        finalAnswers.forEach(ans => {
            if (counts[ans] !== undefined) counts[ans]++
        })

        const totalQuestions = typedQuestions.length
        const calculatedResults: Result[] = typedTypes.map(type => ({
            type,
            score: counts[type.id] || 0,
            percentage: Math.round(((counts[type.id] || 0) / totalQuestions) * 100)
        })).sort((a, b) => b.score - a.score)

        setResults(calculatedResults)

        // AI Analysis
        try {
            const response = await fetch('/api/career-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    results: calculatedResults,
                    topType: calculatedResults[0]
                })
            })

            if (!response.ok) throw new Error('Failed to fetch analysis')

            const data = await response.json()
            setAiResults(data)
        } catch (error) {
            console.error('Error fetching AI results:', error)
        } finally {
            setLoading(false)
        }
    }

    const restart = () => {
        setCurrentQuestion(0)
        setAnswers([])
        setShowResults(false)
        setResults([])
        setAiResults(null)
    }

    const progress = ((currentQuestion + 1) / typedQuestions.length) * 100

    if (showResults) {
        return (
            <div className="min-h-screen pt-20 pb-10 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">Your Personality Profile</h1>
                        <p className="text-muted-foreground">Based on Holland Codes (RIASEC)</p>
                    </div>

                    {/* Top Result Card */}
                    {results.length > 0 && (
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center">
                            <h2 className="text-4xl font-bold text-primary mb-2">{results[0].type.title}</h2>
                            <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                                Focus: {results[0].type.focus}
                            </div>
                            <p className="text-xl text-foreground max-w-2xl mx-auto">
                                {results[0].type.description}
                            </p>
                        </div>
                    )}

                    {/* Bar Chart */}
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart2 className="w-5 h-5" />
                            Profile Breakdown
                        </h3>
                        <div className="space-y-4">
                            {results.map((result) => (
                                <div key={result.type.id} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{result.type.title}</span>
                                        <span className="text-muted-foreground">{result.percentage}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary/30 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-primary rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Insight */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-2xl">
                            <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse mb-4" />
                            <p className="text-lg font-medium">AI is analyzing your profile...</p>
                        </div>
                    ) : aiResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-100 dark:border-blue-900 rounded-2xl p-8"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-6 h-6 text-blue-500" />
                                <h3 className="text-2xl font-bold">AI Recommendation</h3>
                            </div>
                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                    {aiResults.analysis}
                                </p>
                            </div>

                            {/* Top 5 Careers */}
                            {aiResults.careers && (
                                <div className="space-y-6 pt-6 border-t border-border">
                                    <h3 className="text-2xl font-bold text-center">Top 5 Recommended Professions</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {aiResults.careers.map((career: any, index: number) => (
                                            <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="text-xl font-bold text-primary">{career.title}</h3>
                                                </div>

                                                <p className="text-muted-foreground mb-4 text-sm">
                                                    {career.description}
                                                </p>

                                                <div className="space-y-3 text-sm">
                                                    <div>
                                                        <span className="font-semibold block mb-1">Key Skills:</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {career.skills?.map((skill: string, i: number) => (
                                                                <span key={i} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-border">
                                                        <span className="text-muted-foreground">Salary</span>
                                                        <span className="font-medium">{career.salary}</span>
                                                    </div>
                                                    <div className="flex justify-between py-2 border-b border-border">
                                                        <span className="text-muted-foreground">Education</span>
                                                        <span className="font-medium text-right max-w-[60%]">{career.education}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <div className="flex justify-center pt-8">
                        <button
                            onClick={restart}
                            className="px-8 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-medium transition-all"
                        >
                            Retake Test
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="max-w-xl w-full">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>Question {currentQuestion + 1} of {typedQuestions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="backdrop-blur-lg rounded-2xl p-8 border text-center relative overflow-hidden min-h-[400px] flex flex-col justify-center" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mb-4">
                            {typedQuestions[currentQuestion].section}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed" style={{ color: 'var(--text-color)' }}>
                            {typedQuestions[currentQuestion].question}
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {typedQuestions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option.domain)}
                                className="p-4 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between group"
                                style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)' }}
                            >
                                <span className="font-medium opacity-90 group-hover:opacity-100">{option.text}</span>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                            </button>
                        ))}
                    </div>

                    {currentQuestion > 0 && (
                        <button
                            onClick={handlePrevious}
                            className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 opacity-50 hover:opacity-100" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
