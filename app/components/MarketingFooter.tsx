'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function MarketingFooter() {
    return (
        <footer className="border-t border-border bg-background/50 backdrop-blur-lg pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                            UNIAPEX
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Empowering students to find their dream university and career path through AI-driven guidance.
                        </p>
                    </div>


                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/universities" className="hover:text-primary transition-colors">Universities</Link></li>
                            <li><Link href="/extracurriculars" className="hover:text-primary transition-colors">Extracurriculars</Link></li>
                            <li><Link href="/career-test" className="hover:text-primary transition-colors">Career Test</Link></li>
                            <li><Link href="/ai-tutor" className="hover:text-primary transition-colors">AI Tutor</Link></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/for-universities" className="hover:text-primary transition-colors">For Universities</Link></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        © 2025 UNIAPEX Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Made with ❤️ by students for students</span>
                    </div>
                    <div className="flex gap-4">
                        <Link href="https://t.me/Log_devs" target="_blank" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                            <span className="text-sm font-medium">Telegram</span>
                        </Link>
                        <Link href="https://github.com/AdilZhalgasbay" target="_blank" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                            <Github className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
