import MarketingHeader from '@/app/components/MarketingHeader'
import MarketingFooter from '@/app/components/MarketingFooter'

export default function ContactPage() {
    return (
        <div className="dark min-h-screen flex flex-col bg-background text-foreground relative overflow-x-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-emerald-600/20 pointer-events-none" />

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <MarketingHeader />
            <main className="flex-grow pt-32 pb-16 px-6 max-w-3xl mx-auto w-full relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Get in Touch
                </h1>

                <div className="prose dark:prose-invert prose-lg mx-auto text-center mb-12">
                    <p className="text-xl text-muted-foreground">
                        Have a question, suggestion, or just want to say hi? We'd love to hear from you! Whether you found a bug or need help with your profile, our team is ready to assist.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <div className="p-8 rounded-3xl bg-card border border-border text-center hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-semibold mb-4">Email Us</h3>
                        <a href="mailto:uniapex.team@gmail.com" className="text-primary hover:underline text-lg">
                            uniapex.team@gmail.com
                        </a>
                    </div>

                    <div className="p-8 rounded-3xl bg-card border border-border text-center hover:border-primary/50 transition-colors">
                        <h3 className="text-xl font-semibold mb-4">Telegram</h3>
                        <a href="https://t.me/Log_devs" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-lg">
                            @Log_devs
                        </a>
                    </div>
                </div>
            </main>
            <MarketingFooter />
        </div>
    )
}
