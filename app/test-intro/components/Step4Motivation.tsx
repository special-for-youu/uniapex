'use client'

import { Sparkles } from 'lucide-react'
import { WizardState } from '../types'

interface Step4Props {
    data: WizardState
    updateData: (data: Partial<WizardState>) => void
}

export default function Step4Motivation({ data, updateData }: Step4Props) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Deep Motivation
            </h3>

            <div>
                <label className="block text-lg font-medium mb-2">
                    What would you study or research with pleasure, even if there were no grades?
                </label>
                <textarea
                    rows={4}
                    placeholder="e.g. I would build robots, study black holes, edit videos, or read about Roman history..."
                    value={data.motivation.researchInterest}
                    onChange={(e) => updateData({
                        motivation: { ...data.motivation, researchInterest: e.target.value }
                    })}
                    className="w-full p-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary transition-all"
                    style={{ borderColor: 'var(--border-color)' }}
                />
            </div>

            <div>
                <label className="block text-lg font-medium mb-2">
                    If you didn't need to go to university, what would you do in the coming year?
                </label>
                <textarea
                    rows={4}
                    placeholder="Be honest. Would you work as a barista, start your own startup, travel, or just play games?"
                    value={data.motivation.gapYearActivity}
                    onChange={(e) => updateData({
                        motivation: { ...data.motivation, gapYearActivity: e.target.value }
                    })}
                    className="w-full p-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-primary transition-all"
                    style={{ borderColor: 'var(--border-color)' }}
                />
            </div>
        </div>
    )
}
