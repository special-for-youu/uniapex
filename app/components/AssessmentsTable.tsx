'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Assessment {
    id: string
    test_type: string
    created_at: string
    result_data: any
}

export default function AssessmentsTable() {
    const [assessments, setAssessments] = useState<Assessment[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAssessments = async () => {
            try {
                const res = await fetch('/api/assessments')
                if (res.ok) {
                    const data = await res.json()
                    setAssessments(data)
                }
            } catch (error) {
                console.error('Failed to fetch assessments:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAssessments()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (assessments.length === 0) {
        return null // Don't show anything if no tests taken
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto mt-12"
        >
            <h2 className="text-2xl font-bold mb-6">Your assessments</h2>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/50">
                                <th className="p-4 font-semibold text-muted-foreground w-1/3">Title</th>
                                <th className="p-4 font-semibold text-muted-foreground">Date started</th>
                                <th className="p-4 font-semibold text-muted-foreground text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.map((item) => (
                                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-foreground">
                                            {item.test_type === 'CAREER' ? 'Career Test' :
                                                item.test_type === 'MBTI' ? 'MBTI Personality' : item.test_type}
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {new Date(item.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link
                                            className="text-pink-600 dark:text-pink-400 font-semibold text-sm hover:underline"
                                            href={`/analyse/report/${item.id}`}
                                        >
                                            View report
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}
