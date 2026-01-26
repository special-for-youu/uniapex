import MarketingHeader from '@/app/components/MarketingHeader'
import MarketingFooter from '@/app/components/MarketingFooter'

export default function ForUniversitiesPage() {
    return (
        <div className="dark min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <MarketingHeader />
            <main className="flex-grow pt-32 pb-16 px-6 max-w-3xl mx-auto w-full relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                    Partner with UNIAPEX
                </h1>

                <div className="prose dark:prose-invert prose-lg mx-auto mb-12">
                    <p className="text-xl text-muted-foreground text-center mb-12">
                        Connect with the next generation of global talent. UNIAPEX helps forward-thinking universities reach motivated, high-achieving high school students from around the world.
                    </p>

                    <h2 className="text-2xl font-bold mb-6 text-center">Why Partner with Us?</h2>

                    <div className="grid gap-6 mb-12">
                        <div className="flex gap-4 items-start p-6 rounded-2xl bg-card border border-border">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Targeted Reach</h3>
                                <p className="text-muted-foreground">Connect with students who actively match your program requirements.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-6 rounded-2xl bg-card border border-border">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Global Talent</h3>
                                <p className="text-muted-foreground">Access a diverse pool of applicants from Kazakhstan and beyond.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-6 rounded-2xl bg-card border border-border">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Data-Driven</h3>
                                <p className="text-muted-foreground">Our AI ensures that your university is shown to students with the right academic profile.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-border">
                        <h2 className="text-2xl font-bold mb-4">Claim Your University Profile</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Are you a representative of a university? Contact us to manage your institution's profile, update admission data, and showcase your campus to thousands of students.
                        </p>
                        <a
                            href="mailto:uniapex.team@gmail.com"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
                        >
                            Contact Partnership Team
                        </a>
                    </div>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
