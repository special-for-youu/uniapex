'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
// No Header/Footer imports, Sidebar handles navigation

export default function MBTITestPage() {
    const router = useRouter()
    const [questions, setQuestions] = useState<any[]>([])
    const [currentQIndex, setCurrentQIndex] = useState(0)
    const [answers, setAnswers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchQuestions()
    }, [])

    const fetchQuestions = async () => {
        try {
            const res = await fetch('/api/personality/questions')
            if (!res.ok) throw new Error('Failed to load questions')
            const data = await res.json()
            setQuestions(data)
        } catch (err) {
            setError('Failed to load test. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleOptionSelect = async (value: number) => {
        const currentQ = questions[currentQIndex]
        const newAnswer = { id: currentQ.id, value }
        const newAnswers = [...answers, newAnswer]
        setAnswers(newAnswers)

        if (currentQIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQIndex(currentQIndex + 1)
            }, 150)
        } else {
            await submitTest(newAnswers)
        }
    }

    const submitTest = async (finalAnswers: any[]) => {
        setSubmitting(true)
        try {
            const res = await fetch('/api/personality/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: finalAnswers, gender: 'Male' })
            })

            if (!res.ok) throw new Error('Failed to calculate results')
            const data = await res.json()
            setResult(data)
        } catch (err) {
            setError('Failed to generate results.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#020817] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (result) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#020817] text-foreground flex flex-col font-sans transition-colors duration-300">
                <main className="flex-grow pt-12 pb-16 px-6 max-w-4xl mx-auto w-full relative z-10">
                    <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/5 text-center animate-in fade-in zoom-in duration-500">
                        <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium mb-4">
                            Result
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
                            {result.niceName} <span className="text-blue-500">({result.fullCode})</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                            {result.snippet}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                            {result.traits.map((trait: any, i: number) => (
                                <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        {/* Improved Contrast: gray-900 for light, gray-100 for dark */}
                                        <h3 className="font-bold text-lg dark:text-gray-100 text-gray-900">{trait.label}</h3>
                                        <span className="text-sm dark:text-gray-300 text-gray-600 font-medium">{trait.pct}% {trait.trait}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${trait.pct}%`,
                                                backgroundColor: trait.color === 'blue' ? '#3b82f6' :
                                                    trait.color === 'yellow' ? '#eab308' :
                                                        trait.color === 'green' ? '#22c55e' : '#a855f7'
                                            }}
                                        />
                                    </div>
                                    {/* Improved Contrast: gray-500 for light, gray-400 for dark */}
                                    <p className="text-sm dark:text-gray-400 text-gray-500">{trait.description}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all flex items-center gap-2 mx-auto shadow-lg shadow-blue-500/25"
                        >
                            Go to Dashboard <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    // Question UI
    const progress = ((currentQIndex) / questions.length) * 100
    const q = questions[currentQIndex]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#020817] text-foreground flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Subtle background element */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-96 bg-blue-500/5 dark:bg-blue-900/10 blur-3xl opacity-50" />
            </div>

            <main className="flex-grow pt-12 pb-16 px-6 max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center justify-center min-h-[80vh]">

                {/* Progress Bar */}
                <div className="w-full max-w-2xl mb-16">
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-center mt-4 text-sm font-medium text-muted-foreground">
                        {Math.round(progress)}% completed
                    </div>
                </div>

                {submitting ? (
                    <div className="text-center py-20 bg-white dark:bg-[#0f172a] rounded-3xl shadow-lg border border-gray-100 dark:border-white/5 max-w-2xl w-full">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold animate-pulse text-gray-900 dark:text-white">Analyzing result...</h2>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Question Text */}
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-16 leading-tight text-gray-900 dark:text-white">
                            {q?.text}
                        </h2>

                        {/* Options Section */}
                        <div className="flex flex-col items-center select-none">

                            {/* Labels Row */}
                            <div className="flex justify-between w-full px-4 md:px-10 mb-6 font-bold text-xs md:text-sm tracking-widest uppercase opacity-70">
                                <span className="text-emerald-600 dark:text-emerald-400">Agree</span>
                                <span className="text-rose-600 dark:text-rose-400">Disagree</span>
                            </div>

                            {/* Circles Container */}
                            <div className="flex items-center justify-between w-full px-2 md:px-6 relative py-4">
                                {/* Connecting Line */}
                                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 dark:bg-gray-800 -z-10" />

                                {q?.options?.slice().reverse().map((opt: any, idx: number) => {

                                    const val = opt.value;
                                    const absVal = Math.abs(val);

                                    // Dynamic Classes
                                    let sizeClass = 'w-10 h-10 md:w-14 md:h-14'; // Default medium
                                    if (absVal === 3) sizeClass = 'w-14 h-14 md:w-20 md:h-20'; // Large
                                    if (absVal === 1) sizeClass = 'w-8 h-8 md:w-11 md:h-11'; // Small
                                    if (absVal === 0) sizeClass = 'w-6 h-6 md:w-9 md:h-9'; // Tiny Center

                                    // Color Logic
                                    let colorClass = '';
                                    let activeClass = '';

                                    if (val > 0) {
                                        colorClass = 'border-2 border-emerald-500 text-emerald-500';
                                        activeClass = 'hover:bg-emerald-500 hover:text-white';
                                    } else if (val < 0) {
                                        colorClass = 'border-2 border-rose-500 text-rose-500';
                                        activeClass = 'hover:bg-rose-500 hover:text-white';
                                    } else {
                                        colorClass = 'border-2 border-gray-300 dark:border-gray-600 text-gray-400';
                                        activeClass = 'hover:bg-gray-400 dark:hover:bg-gray-500 hover:text-white';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(val)}
                                            className={`
                                                ${sizeClass} ${colorClass} ${activeClass}
                                                rounded-full flex items-center justify-center transition-all duration-200
                                                bg-white dark:bg-[#020817] z-10
                                                focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-90
                                            `}
                                            aria-label={opt.text}
                                            title={opt.text}
                                        >
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="hidden md:flex justify-between w-full px-2 mt-4 text-xs font-medium text-muted-foreground opacity-60">
                                <span className="w-20 text-center">Strongly</span>
                                <span className="w-16 text-center">Mod.</span>
                                <span className="w-12 text-center">Little</span>
                                <span className="w-9 text-center">Neutral</span>
                                <span className="w-12 text-center">Little</span>
                                <span className="w-16 text-center">Mod.</span>
                                <span className="w-20 text-center">Strongly</span>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
