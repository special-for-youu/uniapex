import MarketingHeader from '@/app/components/MarketingHeader'
import MarketingFooter from '@/app/components/MarketingFooter'

export default function TermsPage() {
    return (
        <div className="dark min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <MarketingHeader />
            <main className="flex-grow pt-32 pb-16 px-6 max-w-4xl mx-auto w-full relative z-10">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: December 2025</p>
                <div className="prose dark:prose-invert mt-8">
                    <p>This is a placeholder for the Terms of Service.</p>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
