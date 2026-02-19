'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { WizardState } from './types'
import Step1Geography from './components/Step1Geography'
import Step2Interests from './components/Step2Interests'
import Step3Achievements from './components/Step3Achievements'
import Step4Motivation from './components/Step4Motivation'

const INITIAL_STATE: WizardState = {
    continents: [],
    targetCountries: [],
    interests: [],
    subjectPriority: [],
    exams: {
        ielts: { taken: false, score: null },
        sat: { taken: false, score: null },
        olympiads: { taken: false, level: null },
        volunteering: { taken: false, description: '' }
    },
    motivation: {
        researchInterest: '',
        gapYearActivity: ''
    }
}

export default function TestIntroPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [data, setData] = useState<WizardState>(INITIAL_STATE)
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [recommendations, setRecommendations] = useState<any>(null)
    const [error, setError] = useState('')

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('test-intro-wizard')
        if (saved) {
            try {
                setData(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to load saved state', e)
            }
        }
    }, [])

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem('test-intro-wizard', JSON.stringify(data))
    }, [data])

    const updateData = (newData: Partial<WizardState>) => {
        setData(prev => ({ ...prev, ...newData }))
    }

    const nextStep = () => {
        if (step < 4) setStep(step + 1)
        else submitTest()
    }

    const prevStep = () => {
        if (step > 1) setStep(step - 1)
    }

    const submitTest = async () => {
        setLoading(true)
        setShowResults(true)
        setError('')

        try {
            const response = await fetch('/api/test-intro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('System is busy. Please wait a moment.')
                }
                throw new Error(result.error || 'Failed to fetch recommendations')
            }

            // Redirect to the specific report page if ID is available, otherwise to analyse list
            if (result.id) {
                router.push(`/analyse/report/${result.id}`)
            } else {
                router.push('/analyse')
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Failed to generate recommendations.')
            setLoading(false)
        }
    }

    const canProceed = () => {
        switch (step) {
            case 1: return data.continents.length > 0 && data.targetCountries.length > 0
            case 2: return data.interests.length > 0 && data.subjectPriority.length > 0
            case 3: return true // Optional
            case 4: return data.motivation.researchInterest.length > 10
            default: return false
        }
    }

    if (showResults) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
                <div className="max-w-3xl w-full backdrop-blur-lg rounded-2xl p-8 border bg-card text-card-foreground shadow-xl animate-in fade-in zoom-in duration-500">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        {loading ? 'Consulting AI...' : "Your Personalized Roadmap"}
                    </h2>

                    {loading ? (
                        <div className="py-12 flex flex-col items-center gap-4">
                            <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
                            <p className="text-muted-foreground">Analyzing your profile...</p>
                        </div>
                    ) : error ? (
                        <div className="py-8 text-center text-red-500">
                            <p className="mb-4">{error}</p>
                            <button
                                onClick={submitTest}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Summary */}
                            <div className="p-6 rounded-xl bg-secondary/20 border border-secondary">
                                <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    AI Summary
                                </h3>
                                <p className="text-lg italic leading-relaxed opacity-90">"{recommendations?.summary}"</p>
                            </div>

                            {/* Recommendations & Career Paths */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Top Recommendations</h3>
                                    <ul className="space-y-3">
                                        {recommendations?.recommendations?.map((rec: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background border shadow-sm">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Potential Career Paths</h3>
                                    <div className="flex flex-col gap-2">
                                        {recommendations?.careerPaths?.map((path: string, i: number) => (
                                            <div key={i} className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-900/50">
                                                {path}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/career-test')}
                                className="w-full py-4 mt-8 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                Start Detailed Career Test <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
            <div className="max-w-2xl w-full">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2 font-medium">
                        <span>Step {step} of 4</span>
                        <span>{Math.round((step / 4) * 100)}% Complete</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-card text-card-foreground rounded-2xl p-6 md:p-8 border shadow-xl min-h-[500px] flex flex-col">
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div key="step1" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                    <Step1Geography data={data} updateData={updateData} />
                                </motion.div>
                            )}
                            {step === 2 && (
                                <motion.div key="step2" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                    <Step2Interests data={data} updateData={updateData} />
                                </motion.div>
                            )}
                            {step === 3 && (
                                <motion.div key="step3" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                    <Step3Achievements data={data} updateData={updateData} />
                                </motion.div>
                            )}
                            {step === 4 && (
                                <motion.div key="step4" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                    <Step4Motivation data={data} updateData={updateData} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={prevStep}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${step === 1
                                ? 'invisible'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>

                        <button
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 disabled:shadow-none"
                        >
                            {step === 4 ? 'Finish' : 'Next'} <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}
