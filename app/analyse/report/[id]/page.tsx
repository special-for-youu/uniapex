'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, ArrowLeft, BarChart2, Briefcase, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ReportPage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState<any>(null)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const { data, error } = await supabase
                    .from('test_results')
                    .select('*')
                    .eq('id', params.id)
                    .single()

                if (error) throw error
                setResult(data)
            } catch (error) {
                console.error('Error fetching result:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchResult()
        }
    }, [params.id, supabase])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!result) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Report not found</h1>
                <Link href="/analyse" className="text-primary hover:underline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Analysis
                </Link>
            </div>
        )
    }

    const { test_type, result_data, created_at } = result

    // Render Career Test Report
    if (test_type === 'CAREER') {
        const { analysis, scores, topType } = result_data

        return (
            <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto space-y-8">
                <Link href="/analyse" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Analysis
                </Link>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Career Assessment</span>
                            <h1 className="text-3xl font-bold mt-1">Result: {topType?.type?.title}</h1>
                            <p className="text-muted-foreground mt-2">Completed on {new Date(created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
                            Focus: {topType?.type?.focus}
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none mb-10">
                        <p className="text-lg leading-relaxed">{topType?.type?.description}</p>
                    </div>

                    {/* AI Analysis Section */}
                    {analysis && (
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900 rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-blue-500" />
                                AI Personalized Analysis
                            </h3>
                            <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                                {analysis.analysis}
                            </p>
                        </div>
                    )}

                    {/* Recommended Careers */}
                    {analysis?.careers && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <Briefcase className="w-6 h-6" />
                                Recommended Career Paths
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {analysis.careers.map((career: any, i: number) => (
                                    <div key={i} className="p-5 rounded-xl border border-border bg-background hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-lg mb-2 text-primary">{career.title}</h4>
                                        <p className="text-sm text-muted-foreground mb-3">{career.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {career.skills?.map((skill: string, j: number) => (
                                                <span key={j} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex justify-between border-t pt-3 border-border">
                                            <span>{career.salary}</span>
                                            <span>{career.education}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Render MBTI Report
    if (test_type === 'MBTI') {
        const { personality } = result_data

        return (
            <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto space-y-8">
                <Link href="/analyse" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Analysis
                </Link>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Personality Type</span>
                    <h1 className="text-5xl font-bold text-primary mb-4">{personality?.fullCode}</h1>
                    <h2 className="text-2xl font-semibold mb-6">{personality?.niceName}</h2>

                    <div className="max-w-3xl mx-auto bg-secondary/20 p-6 rounded-xl mb-10">
                        <p className="text-lg italic text-foreground/80">"{personality?.snippet}"</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                        {personality?.traits?.map((trait: any, i: number) => (
                            <div key={i} className="bg-background border border-border p-5 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg">{trait.label}</span>
                                    <span className="text-sm font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground">{trait.trait} ({Math.max(trait.pct, 100 - trait.pct)}%)</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                                    <div
                                        className={`h-full rounded-full ${trait.color === 'blue' ? 'bg-blue-500' : trait.color === 'green' ? 'bg-green-500' : trait.color === 'yellow' ? 'bg-yellow-500' : 'bg-purple-500'}`}
                                        style={{ width: `${Math.max(trait.pct, 100 - trait.pct)}%` }}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">{trait.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Fallback for unknown types
    return (
        <div className="min-h-screen p-10 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Result Report</h1>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-w-full">
                {JSON.stringify(result_data, null, 2)}
            </pre>
        </div>
    )
}
