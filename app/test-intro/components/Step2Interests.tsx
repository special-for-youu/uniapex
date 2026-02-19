'use client'

import { motion } from 'framer-motion'
import { BookOpen, ArrowUp, ArrowDown, X } from 'lucide-react'
import { WizardState } from '../types'

const SUBJECTS = [
    'Computer Science', 'Medicine', 'Engineering', 'Business & Management',
    'Economics', 'Law', 'Psychology', 'Arts & Design',
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Political Science', 'Literature', 'Languages'
]

interface Step2Props {
    data: WizardState
    updateData: (data: Partial<WizardState>) => void
}

export default function Step2Interests({ data, updateData }: Step2Props) {

    const toggleSubject = (subject: string) => {
        const isSelected = data.interests.includes(subject)
        let newInterests
        let newPriority = [...data.subjectPriority]

        if (isSelected) {
            newInterests = data.interests.filter(s => s !== subject)
            newPriority = newPriority.filter(s => s !== subject)
        } else {
            newInterests = [...data.interests, subject]
            newPriority = [...newPriority, subject]
        }

        updateData({ interests: newInterests, subjectPriority: newPriority })
    }

    const moveSubject = (index: number, direction: 'up' | 'down') => {
        const newPriority = [...data.subjectPriority]
        if (direction === 'up' && index > 0) {
            [newPriority[index], newPriority[index - 1]] = [newPriority[index - 1], newPriority[index]]
        } else if (direction === 'down' && index < newPriority.length - 1) {
            [newPriority[index], newPriority[index + 1]] = [newPriority[index + 1], newPriority[index]]
        }
        updateData({ subjectPriority: newPriority })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tag Cloud */}
            <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    What do you want to study?
                </h3>
                <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map(subject => {
                        const isSelected = data.interests.includes(subject)
                        return (
                            <button
                                key={subject}
                                onClick={() => toggleSubject(subject)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border shadow-sm ${isSelected
                                    ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-purple-500/30'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {subject}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Priority Sorting */}
            {data.subjectPriority.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Rank your priorities</h3>
                    <div className="space-y-2">
                        {data.subjectPriority.map((subject, index) => (
                            <motion.div
                                layout
                                key={subject}
                                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-card shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                                        {index + 1}
                                    </span>
                                    <span className="font-medium">{subject}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => moveSubject(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => moveSubject(index, 'down')}
                                        disabled={index === data.subjectPriority.length - 1}
                                        className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
