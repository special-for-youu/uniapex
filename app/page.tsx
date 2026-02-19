'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Sparkles, Target, Globe, BookOpen, Zap, Trophy, Bot } from 'lucide-react'
import VideoSlider from '@/components/VideoSlider'
import { createClient } from '@/utils/supabase/client'
import logo from '@/components/assets/logo.png'
import MarketingHeader from '@/app/components/MarketingHeader'
import MarketingFooter from '@/app/components/MarketingFooter'

export default function LandingPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        setIsLoggedIn(!!user)
        setLoading(false)
    }


    return (
        <div className="dark min-h-screen w-full overflow-x-hidden bg-background text-foreground">

            <MarketingHeader />

            <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <VideoSlider />
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl md:text-8xl font-bold leading-[1.1] mb-8 tracking-tight drop-shadow-sm"
                        >
                            Your Path to
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
                                Dream University
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium text-muted-foreground"
                        >
                            Navigate your university journey with AI. From career discovery to admission success.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                        >
                            <Link
                                href="/register"
                                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Start My Path
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t pt-12 border-border"
                        >
                            <div>
                                <div className="text-3xl font-bold mb-1 text-foreground">1000+</div>
                                <div className="text-sm text-muted-foreground">Universities</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1 text-foreground">50+</div>
                                <div className="text-sm text-muted-foreground">Countries</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1 text-foreground">AI & More</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm bg-primary/10 text-primary"
                        >
                            <Zap className="w-4 h-4" />
                            <span>Everything You Need</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-6xl font-bold mb-6 text-foreground"
                        >
                            Your Complete Journey
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xl max-w-2xl mx-auto text-muted-foreground"
                        >
                            From discovering your passion to getting accepted
                        </motion.p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                        <FeatureCard
                            icon={<Target className="w-8 h-8" />}
                            title="Career Discovery"
                            description="AI-powered career matching based on your interests, skills, and personality"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Globe className="w-8 h-8" />}
                            title="University Finder"
                            description="Explore 1000+ universities worldwide with personalized recommendations"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<BookOpen className="w-8 h-8" />}
                            title="Test Prep"
                            description="Prepare for IELTS, SAT, and more with AI tutoring and practice"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<Trophy className="w-8 h-8" />}
                            title="Extracurriculars"
                            description="Build a strong profile with curated activities and leadership opportunities"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Bot className="w-8 h-8" />}
                            title="AI Tutor"
                            description="24/7 personalized academic support and essay feedback"
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            <section className="py-32 relative">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border rounded-3xl p-12 md:p-16 text-center border-border"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-xl mb-10 text-muted-foreground">
                            Join thousands of students achieving their university dreams
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-white hover:bg-primary/90 rounded-2xl font-bold text-lg transition-all shadow-2xl hover:scale-105"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <MarketingFooter />
        </div>
    )
}

function FeatureCard({ icon, title, description, delay }: {
    icon: React.ReactNode
    title: string
    description: string
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="group backdrop-blur-xl border rounded-2xl p-8 hover:scale-105 transition-all duration-300 bg-card border-border w-full md:w-[350px]"
        >
            <div className="mb-4 text-primary">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">{title}</h3>
            <p className="leading-relaxed text-muted-foreground">{description}</p>
        </motion.div>
    )
}
