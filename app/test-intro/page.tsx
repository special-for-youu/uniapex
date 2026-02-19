'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, X } from 'lucide-react'

const questions = [
    "Do you know what profession you want to choose?",
    "Have you already taken IELTS or TOEFL?",
    "Do you enjoy solving mathematical problems?",
    "Are you interested in creative arts?",
    "Do you prefer working in a team?",
    "Have you participated in any olympiads?",
    "Do you want to study in the USA?",
    "Do you want to study in Europe?",
    "Are you interested in Computer Science?",
    "Do you like public speaking?",
    "Have you done any volunteering?",
    "Do you want to start your own business?",
    "Are you interested in medicine?",
    "Do you like learning new languages?",
    "Have you taken the SAT?",
    "Do you prefer hands-on work over theory?",
    "Are you interested in engineering?",
    "Do you want to study in Asia?",
    "Do you have any leadership experience?",
    "Are you ready to study abroad?"
]

export default function TestIntroPage() {
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<boolean[]>([])
    const [showResults, setShowResults] = useState(false)

    const [recommendations, setRecommendations] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchRecommendations = async (finalAnswers: boolean[]) => {
        setLoading(true)
        setShowResults(true)
        setError('')

        try {
            const response = await fetch('/api/test-intro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questions,
                    answers: finalAnswers
                })
            })

            const data = await response.json()

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('System is busy. Please wait a moment and try again.')
                }
                throw new Error(data.error || 'Failed to fetch recommendations')
            }

            setRecommendations(data)
        } catch (err: any) {
            if (process.env.NODE_ENV === 'development') console.error(err)
            setError(err.message || 'Failed to generate recommendations. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = async (answer: boolean) => {
        const newAnswers = [...answers, answer]
        setAnswers(newAnswers)

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            // Test finished
            await fetchRecommendations(newAnswers)
        }
    }

    if (showResults) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
                <div className="max-w-2xl w-full backdrop-blur-lg rounded-2xl p-8 border text-center animate-in fade-in zoom-in duration-500" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                    <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                        {loading ? 'Analyzing your profile...' : "You're at the start of your journey!"}
                    </h2>

                    {loading ? (
                        <div className="py-12 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground">Consulting with AI...</p>
                        </div>
                    ) : error ? (
                        <div className="py-8 text-red-500">
                            <p className="mb-4">{error}</p>
                            <button
                                onClick={() => fetchRecommendations(answers)}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 text-left mb-8">
                            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)' }}>
                                <h3 className="text-xl font-semibold text-blue-500 mb-2">AI Summary:</h3>
                                <p className="text-foreground/80 mb-6 italic">"{recommendations?.summary}"</p>

                                <h3 className="text-xl font-semibold text-blue-500 mb-4">We Recommend:</h3>
                                <ul className="space-y-3 text-foreground/80">
                                    {recommendations?.recommendations?.map((rec: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>

                                {recommendations?.careerPaths && (
                                    <>
                                        <h3 className="text-xl font-semibold text-blue-500 mt-6 mb-4">Potential Career Paths:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {recommendations.careerPaths.map((path: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
                                                    {path}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {!loading && (
                        <button
                            onClick={() => router.push('/career-test')}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            Go to Career Orientation <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
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
                        <span>Question {currentQuestion + 1} of {questions.length}</span>
                        <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="backdrop-blur-lg rounded-2xl p-8 border text-center relative overflow-hidden min-h-[300px] flex flex-col justify-center" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                    <h2 className="text-2xl md:text-3xl font-bold mb-12 leading-relaxed" style={{ color: 'var(--text-color)' }}>
                        {questions[currentQuestion]}
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleAnswer(false)}
                            className="py-4 px-6 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 border border-red-200 dark:border-red-500/50 rounded-xl text-red-700 dark:text-red-200 font-semibold transition-all flex items-center justify-center gap-2 group"
                        >
                            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            No
                        </button>
                        <button
                            onClick={() => handleAnswer(true)}
                            className="py-4 px-6 bg-green-100 dark:bg-green-500/20 hover:bg-green-200 dark:hover:bg-green-500/30 border border-green-200 dark:border-green-500/50 rounded-xl text-green-700 dark:text-green-200 font-semibold transition-all flex items-center justify-center gap-2 group"
                        >
                            <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
