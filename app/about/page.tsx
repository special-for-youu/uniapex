import MarketingHeader from '@/app/components/MarketingHeader'
import MarketingFooter from '@/app/components/MarketingFooter'

export default function AboutPage() {
    return (
        <div className="dark min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <MarketingHeader />
            <main className="flex-grow pt-32 pb-16 px-6 max-w-4xl mx-auto w-full relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                    The Story Behind UNIAPEX
                </h1>

                <div className="prose dark:prose-invert prose-lg mx-auto space-y-8">
                    <p className="text-2xl font-medium leading-relaxed text-foreground">
                        "I am a 10th-grade student. Searching for universities manually is painful: dozens of tabs, different requirements, and deadlines everywhere. The choice right now is simple: either google for weeks or pay agencies."
                    </p>

                    <p className="text-muted-foreground">
                        I realized this process was broken and decided to fix it. That's how <strong>UNIAPEX</strong> was born — a platform that unites all stages of admission in one place, for free and powered by AI.
                    </p>

                    <h2 className="text-2xl font-bold pt-8 text-foreground">What I Built</h2>

                    <div className="grid md:grid-cols-2 gap-6 not-prose">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors">
                            <h3 className="text-xl font-bold text-emerald-400 mb-2">🚀 AI-Powered University Finder</h3>
                            <p className="text-sm text-muted-foreground">A database of <strong>1000+ universities</strong>. The algorithm doesn't just list them; it recommends where you have the highest chances required for scholarships.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors">
                            <h3 className="text-xl font-bold text-blue-400 mb-2">🧠 Personalized AI Tutor</h3>
                            <p className="text-sm text-muted-foreground">Instead of expensive tutors, I built an AI that helps prepare for <strong>IELTS and SAT</strong>, checks essays, and gives instant feedback 24/7.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                            <h3 className="text-xl font-bold text-purple-400 mb-2">🎯 Career Analysis</h3>
                            <p className="text-sm text-muted-foreground">Tests that analyze your skills and interests to suggest the ideal career path and corresponding study programs.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-colors">
                            <h3 className="text-xl font-bold text-yellow-400 mb-2">🏆 Extracurriculars Database</h3>
                            <p className="text-sm text-muted-foreground">A massive catalog of activities and volunteering opportunities to boost your portfolio for Ivy League and top universities.</p>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors md:col-span-2">
                            <h3 className="text-xl font-bold text-pink-400 mb-2">📄 CV Maker</h3>
                            <p className="text-sm text-muted-foreground">A built-in tool that helps compile a professional academic resume according to international standards in just a few minutes.</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 mt-12">
                        <p className="text-xl font-medium text-center italic text-foreground/80">
                            "My goal is to democratize admission. I believe access to the best education should depend on talent and perseverance, not on having money for consultants."
                        </p>
                    </div>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
