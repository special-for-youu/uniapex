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
            <div className="min-h-screen pt-20 pb-10 px-4 bg-grid-pattern relative overflow-hidden text-foreground">
                {/* Ambient Background Glows */}
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">Your Personality Profile</h1>
                        <p className="text-muted-foreground">Based on Holland Codes (RIASEC)</p>
                    </div>

                    {/* Top Result Card */}
                    {results.length > 0 && (
                        <div className="bg-black/20 border border-white/10 glass-card rounded-2xl p-8 shadow-2xl text-center">
                            <h2 className="text-4xl font-bold text-primary mb-2">{results[0].type.title}</h2>
                            <div className="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6 border border-primary/20">
                                Focus: {results[0].type.focus}
                            </div>
                            <p className="text-xl text-foreground max-w-2xl mx-auto">
                                {results[0].type.description}
                            </p>
                        </div>
                    )}

                    {/* Bar Chart */}
                    <div className="bg-black/20 border border-white/10 glass-card rounded-2xl p-8 shadow-xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-primary" />
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
                        <div className="flex flex-col items-center justify-center py-12 bg-black/20 border border-white/10 glass-card rounded-2xl">
                            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,1)]" />
                            <p className="text-lg font-medium text-foreground">AI is analyzing your profile...</p>
                        </div>
                    ) : aiResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-black/20 border border-white/10 glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] -z-10 rounded-full" />
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <Sparkles className="w-6 h-6 text-primary" />
                                <h3 className="text-2xl font-bold text-foreground">AI Recommendation</h3>
                            </div>
                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                    {aiResults.analysis}
                                </p>
                            </div>

                            {/* Top 5 Careers */}
                            {aiResults.careers && (
                                <div className="space-y-6 pt-6 border-t border-white/10 relative z-10">
                                    <h3 className="text-2xl font-bold text-center text-foreground">Top 5 Recommended Professions</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {aiResults.careers.map((career: any, index: number) => (
                                            <div key={index} className="bg-black/40 border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all hover:bg-black/60 shadow-lg relative overflow-hidden group">
                                                {/* Hover glow */}
                                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
                                                <div className="flex justify-between items-start mb-4 relative z-10">
                                                    <h3 className="text-xl font-bold text-primary group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all">{career.title}</h3>
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-grid-pattern relative overflow-hidden text-foreground">
            {/* Ambient Background Glows */}
            <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

            <div className="max-w-xl w-full relative z-10">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Question {currentQuestion + 1} of {typedQuestions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-card bg-black/20 border-white/10 rounded-2xl p-8 text-center relative overflow-hidden min-h-[400px] flex flex-col justify-center shadow-2xl">
                    <div className="mb-8 relative z-10">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] mb-4">
                            {typedQuestions[currentQuestion].section}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground drop-shadow-md">
                            {typedQuestions[currentQuestion].question}
                        </h2>
                    </div>

                    <div className="grid gap-3 relative z-10">
                        {typedQuestions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option.domain)}
                                className="p-4 rounded-xl border border-white/5 bg-white/5 text-left transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98] flex items-center justify-between group"
                            >
                                <span className="font-medium opacity-90 group-hover:opacity-100 text-foreground">{option.text}</span>
                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                            </button>
                        ))}
                    </div>

                    {currentQuestion > 0 && (
                        <button
                            onClick={handlePrevious}
                            className="absolute top-8 left-8 p-2 rounded-full hover:bg-white/10 transition-colors z-20 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-6 h-6 opacity-80 hover:opacity-100" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
