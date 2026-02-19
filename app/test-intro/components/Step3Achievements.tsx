'use client'

import { motion } from 'framer-motion'
import { Award, Check, Book } from 'lucide-react'
import { WizardState } from '../types'

interface Step3Props {
    data: WizardState
    updateData: (data: Partial<WizardState>) => void
}

export default function Step3Achievements({ data, updateData }: Step3Props) {

    const updateExams = (field: keyof WizardState['exams'], value: any) => {
        updateData({
            exams: {
                ...data.exams,
                [field]: { ...data.exams[field], ...value }
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements & Experience
            </h3>

            {/* IELTS/TOEFL */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-card shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Have you taken English proficiency tests (IELTS/TOEFL)?</span>
                    <button
                        onClick={() => updateExams('ielts', { taken: !data.exams.ielts.taken })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.exams.ielts.taken ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                    >
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform ${data.exams.ielts.taken ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>
                {data.exams.ielts.taken && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                        <label className="block text-sm font-medium mb-1">Your Score</label>
                        <input
                            type="number"
                            step="0.5"
                            placeholder="e.g. 7.0"
                            value={data.exams.ielts.score || ''}
                            onChange={(e) => updateExams('ielts', { score: parseFloat(e.target.value) })}
                            className="w-full p-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-primary"
                            style={{ borderColor: 'var(--border-color)' }}
                        />
                    </motion.div>
                )}
            </div>

            {/* SAT */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-card shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Have you taken the SAT?</span>
                    <button
                        onClick={() => updateExams('sat', { taken: !data.exams.sat.taken })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.exams.sat.taken ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                    >
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform ${data.exams.sat.taken ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>
                {data.exams.sat.taken && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                        <label className="block text-sm font-medium mb-1">Your Score</label>
                        <input
                            type="number"
                            step="10"
                            placeholder="e.g. 1450"
                            value={data.exams.sat.score || ''}
                            onChange={(e) => updateExams('sat', { score: parseInt(e.target.value) })}
                            className="w-full p-3 rounded-lg border bg-transparent focus:ring-2 focus:ring-primary"
                            style={{ borderColor: 'var(--border-color)' }}
                        />
                    </motion.div>
                )}
            </div>

            {/* Olympiads */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-card shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Do you have Olympiad experience?</span>
                    <button
                        onClick={() => updateExams('olympiads', { taken: !data.exams.olympiads.taken })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.exams.olympiads.taken ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                    >
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform ${data.exams.olympiads.taken ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>
                {data.exams.olympiads.taken && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                        <label className="block text-sm font-medium mb-1">Highest Level</label>
                        <select
                            value={data.exams.olympiads.level || ''}
                            onChange={(e) => updateExams('olympiads', { level: e.target.value })}
                            className="w-full p-3 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            <option value="" className="bg-background text-foreground">Select Level</option>
                            <option value="School" className="bg-background text-foreground">School Level</option>
                            <option value="City" className="bg-background text-foreground">City Level</option>
                            <option value="Regional" className="bg-background text-foreground">Regional/State</option>
                            <option value="International" className="bg-background text-foreground">International</option>
                        </select>
                    </motion.div>
                )}
            </div>

            {/* Volunteering/Leadership */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-card shadow-sm">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Volunteering or Leadership experience?</span>
                    <button
                        onClick={() => updateExams('volunteering', { taken: !data.exams.volunteering.taken })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${data.exams.volunteering.taken ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                    >
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-background transition-transform ${data.exams.volunteering.taken ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                    </button>
                </div>
                {data.exams.volunteering.taken && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                        <label className="block text-sm font-medium mb-1">Brief Description (1-2 sentences)</label>
                        <textarea
                            rows={2}
                            placeholder="e.g. School President, Organized charity event..."
                            value={data.exams.volunteering.description}
                            onChange={(e) => updateExams('volunteering', { description: e.target.value })}
                            className="w-full p-3 rounded-lg border bg-transparent resize-none focus:ring-2 focus:ring-primary"
                            style={{ borderColor: 'var(--border-color)' }}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    )
}
