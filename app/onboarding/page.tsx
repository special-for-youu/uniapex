'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Map, User, Briefcase, DollarSign, Trophy, Sparkles, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'

const steps = [
    {
        id: 1,
        title: "Your Goal — Dream University",
        description: "You can get anywhere if you have a plan. Explore universities worldwide.",
        icon: Map,
        color: "text-blue-400",
        bg: "bg-blue-500/20"
    },
    {
        id: 2,
        title: "Know Yourself",
        description: "We analyze your interests and skills to find the perfect fit.",
        icon: User,
        color: "text-purple-400",
        bg: "bg-purple-500/20"
    },
    {
        id: 3,
        title: "Define Your Profession",
        description: "AI-powered career matching based on your profile.",
        icon: Briefcase,
        color: "text-green-400",
        bg: "bg-green-500/20"
    },
    {
        id: 4,
        title: "Compare Salaries",
        description: "Real-time salary data from Joo.kz and global sources.",
        icon: DollarSign,
        color: "text-yellow-400",
        bg: "bg-yellow-500/20"
    },
    {
        id: 5,
        title: "Explore Extracurriculars",
        description: "Find internships, olympiads, and volunteering to boost your profile.",
        icon: Trophy,
        color: "text-orange-400",
        bg: "bg-orange-500/20"
    },
    {
        id: 6,
        title: "AI Assistant Always With You",
        description: "Gemini & DeepSeek help you plan, write essays, and answer questions.",
        icon: Sparkles,
        color: "text-pink-400",
        bg: "bg-pink-500/20"
    }
]

export default function OnboardingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            router.push('/test-intro')
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const CurrentIcon = steps[currentStep].icon

    return (
        <div className="min-h-screen bg-zapta-primaryBg flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${steps[currentStep].bg} rounded-full blur-3xl transition-all duration-500 opacity-20`} />
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${steps[currentStep].bg} rounded-full blur-3xl transition-all duration-500 opacity-20 delay-100`} />
            </div>

            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10">
                {/* Left Side - Illustration/Icon */}
                <div className="bg-white border border-gray-100 rounded-3xl aspect-square flex items-center justify-center p-12 shadow-xl animate-in fade-in slide-in-from-left duration-500">
                    <div className={`p-8 rounded-full ${steps[currentStep].bg} mb-6 transform transition-all duration-500 scale-110`}>
                        <CurrentIcon className={`w-32 h-32 ${steps[currentStep].color}`} />
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="space-y-8 text-center md:text-left animate-in fade-in slide-in-from-right duration-500">
                    <div className="space-y-4 min-h-[180px]">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
                            Step {currentStep + 1} of {steps.length}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            {steps[currentStep].title}
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            {steps[currentStep].description}
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-4 pt-4 justify-center md:justify-start">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className={`p-4 rounded-full border border-gray-200 transition-all ${currentStep === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex gap-2">
                            {steps.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-blue-600' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextStep}
                            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-lg hover:shadow-blue-500/25 group"
                        >
                            {currentStep === steps.length - 1 ? (
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            ) : (
                                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
