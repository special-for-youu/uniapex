'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
// No Header/Footer imports, Sidebar handles navigation

export default function MBTITestPage() {
    const router = useRouter()
    const [questions, setQuestions] = useState<any[]>([])

    // Load state from localStorage on initial render
    const [currentQIndex, setCurrentQIndex] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mbti-current-index')
            return saved ? parseInt(saved, 10) : 0
        }
        return 0
    })

    const [answers, setAnswers] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mbti-answers')
            return saved ? JSON.parse(saved) : []
        }
        return []
    })

    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('mbti-current-index', currentQIndex.toString())
            localStorage.setItem('mbti-answers', JSON.stringify(answers))
        }
    }, [currentQIndex, answers])

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

    const handleOptionSelect = (value: number) => {
        const currentQ = questions[currentQIndex]
        const newAnswer = { id: currentQ.id, value }

        setAnswers(prevAnswers => {
            const updated = [...prevAnswers]
            updated[currentQIndex] = newAnswer
            return updated
        })

        // Auto-advance if not on the last question
        if (currentQIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentQIndex(currentQIndex + 1)
            }, 300)
        }
    }

    const handleNext = async () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1)
        } else {
            // Reached the end, submit if all questions answered properly
            await submitTest(answers)
        }
    }

    const handleBack = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex(currentQIndex - 1)
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
            <div className="min-h-screen bg-grid-pattern flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
            </div>
        )
    }

    if (result) {
        return (
            <div className="min-h-screen bg-grid-pattern text-foreground flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
                {/* Ambient Background Glows */}
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />
                <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />

                <main className="flex-grow pt-12 pb-16 px-6 max-w-4xl mx-auto w-full relative z-10">
                    <div className="glass-card bg-black/20 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 text-center animate-in fade-in zoom-in duration-500">
                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-sm font-medium mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                            Result
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground drop-shadow-md">
                            {result.niceName} <span className="text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">({result.fullCode})</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                            {result.snippet}
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 text-left mb-12">
                            {result.traits.map((trait: any, i: number) => (
                                <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/5 shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-lg text-foreground">{trait.label}</h3>
                                        <span className="text-sm text-muted-foreground font-medium">{trait.pct}% {trait.trait}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden mb-3">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]"
                                            style={{
                                                width: `${trait.pct}%`,
                                                backgroundColor: trait.color === 'blue' ? '#3b82f6' :
                                                    trait.color === 'yellow' ? '#eab308' :
                                                        trait.color === 'green' ? '#22c55e' : '#a855f7'
                                            }}
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{trait.description}</p>
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
        <div className="min-h-screen bg-grid-pattern text-foreground flex flex-col relative overflow-hidden transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
            </div>

            {/* Top Navigation */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
                <button
                    onClick={handleBack}
                    disabled={currentQIndex === 0 || submitting}
                    className="p-3 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <main className="flex-grow pt-12 pb-16 px-6 max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center justify-center min-h-[80vh]">

                {/* Progress Bar */}
                <div className="w-full max-w-2xl mb-16">
                    <div className="h-1.5 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-center mt-4 text-sm font-medium text-muted-foreground">
                        {Math.round(progress)}% completed
                    </div>
                </div>

                {submitting ? (
                    <div className="text-center py-20 glass-card bg-black/20 rounded-3xl shadow-lg border border-white/10 max-w-2xl w-full">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold animate-pulse text-foreground">Analyzing result...</h2>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Question Text */}
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-16 leading-tight text-foreground drop-shadow-md">
                            {q?.text}
                        </h2>

                        {/* Options Section */}
                        <div className="flex flex-col items-center select-none">

                            {/* Labels Row */}
                            <div className="flex justify-between w-full px-4 md:px-10 mb-6 font-bold text-xs md:text-sm tracking-widest uppercase opacity-80">
                                <span className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Agree</span>
                                <span className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">Disagree</span>
                            </div>

                            {/* Circles Container */}
                            <div className="flex items-center justify-between w-full px-2 md:px-6 relative py-4">
                                {/* Connecting Line */}
                                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 -z-10" />

                                {q?.options?.slice().reverse().map((opt: any, idx: number) => {

                                    const val = opt.value;
                                    const absVal = Math.abs(val);

                                    // Dynamic Classes
                                    let sizeClass = 'w-10 h-10 md:w-14 md:h-14'; // Default medium
                                    if (absVal === 3) sizeClass = 'w-14 h-14 md:w-20 md:h-20'; // Large
                                    if (absVal === 1) sizeClass = 'w-8 h-8 md:w-11 md:h-11'; // Small
                                    if (absVal === 0) sizeClass = 'w-6 h-6 md:w-9 md:h-9'; // Tiny Center

                                    const isSelected = answers[currentQIndex]?.value === val;

                                    // Color Logic
                                    let colorClass = '';
                                    let activeClass = '';

                                    if (val > 0) {
                                        colorClass = isSelected ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.8)] border-2 border-emerald-500' : 'border-2 border-emerald-500 text-emerald-500';
                                        activeClass = 'hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]';
                                    } else if (val < 0) {
                                        colorClass = isSelected ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.8)] border-2 border-rose-500' : 'border-2 border-rose-500 text-rose-500';
                                        activeClass = 'hover:bg-rose-500 hover:text-white hover:shadow-[0_0_15px_rgba(244,63,94,0.5)]';
                                    } else {
                                        colorClass = isSelected ? 'bg-gray-400 text-white shadow-[0_0_20px_rgba(156,163,175,0.8)] border-2 border-gray-400' : 'border-2 border-white/20 text-gray-400';
                                        activeClass = 'hover:bg-white/20 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(val)}
                                            className={`
                                                ${sizeClass} ${colorClass} ${!isSelected && activeClass}
                                                rounded-full flex items-center justify-center transition-all duration-200
                                                ${!isSelected && 'bg-black/40 backdrop-blur-sm'} z-10
                                                focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-90
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

                {/* Bottom Navigation */}
                {answers[currentQIndex] !== undefined && !submitting && (
                    <div className="mt-12 w-full max-w-3xl flex justify-center animate-in fade-in duration-300">
                        <button
                            onClick={handleNext}
                            className="group flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {currentQIndex < questions.length - 1 ? 'Next Question' : 'Submit Test'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
