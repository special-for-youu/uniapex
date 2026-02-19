'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, MapPin, Check, X } from 'lucide-react'
import { WizardState } from '../types'

const CONTINENTS = [
    { code: 'NA', name: 'North America' },
    { code: 'SA', name: 'South America' },
    { code: 'EU', name: 'Europe' },
    { code: 'AS', name: 'Asia' },
    { code: 'AF', name: 'Africa' },
    { code: 'OC', name: 'Oceania' },
    { code: 'ME', name: 'Middle East' },
]

const POPULAR_COUNTRIES = [
    'USA', 'Canada', 'UK', 'Germany', 'Netherlands', 'France', 'Switzerland',
    'South Korea', 'China', 'Japan', 'Singapore', 'Hong Kong', 'Australia', 'New Zealand',
    'Ireland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Italy', 'Spain',
    'Belgium', 'Austria', 'UAE', 'Qatar', 'Saudi Arabia', 'Malaysia',
    'Brazil', 'Argentina', 'South Africa', 'India', 'Turkey'
]

interface Step1Props {
    data: WizardState
    updateData: (data: Partial<WizardState>) => void
}

export default function Step1Geography({ data, updateData }: Step1Props) {
    const [countryInput, setCountryInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const toggleContinent = (code: string, name: string) => {
        const existing = data.continents.find(c => c.code === code)
        let newContinents

        if (existing) {
            newContinents = data.continents.filter(c => c.code !== code)
        } else {
            // Add with next priority
            const priority = data.continents.length + 1
            newContinents = [...data.continents, { code, name, priority }]
        }

        // Re-normalize priorities
        newContinents = newContinents.map((c, i) => ({ ...c, priority: i + 1 }))
        updateData({ continents: newContinents })
    }

    const addCountry = (country: string) => {
        if (data.targetCountries.length >= 3) return
        if (data.targetCountries.includes(country)) return

        updateData({ targetCountries: [...data.targetCountries, country] })
        setCountryInput('')
        setShowSuggestions(false)
    }

    const removeCountry = (country: string) => {
        updateData({ targetCountries: data.targetCountries.filter(c => c !== country) })
    }

    const filteredCountries = POPULAR_COUNTRIES.filter(c =>
        c.toLowerCase().includes(countryInput.toLowerCase()) &&
        !data.targetCountries.includes(c)
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Continents */}
            <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Where do you want to study? <span className="text-sm font-normal text-muted-foreground">(Select strictly in order of priority)</span>
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CONTINENTS.map(continent => {
                        const isSelected = data.continents.find(c => c.code === continent.code)
                        return (
                            <button
                                key={continent.code}
                                onClick={() => toggleContinent(continent.code, continent.name)}
                                className={`relative p-6 rounded-xl border-2 transition-all text-left group hover:scale-[1.02] ${isSelected
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10'
                                    : 'border-slate-200 dark:border-slate-700 bg-card dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="font-bold text-lg">{continent.name}</span>
                                {isSelected && (
                                    <span className="absolute top-4 right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg animate-in zoom-in">
                                        {isSelected.priority}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Countries */}
            <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-destructive" />
                    Top 3 Target Countries
                </h3>

                <div className="relative mb-4">
                    <input
                        type="text"
                        value={countryInput}
                        onChange={(e) => {
                            setCountryInput(e.target.value)
                            setShowSuggestions(true)
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Type country name..."
                        disabled={data.targetCountries.length >= 3}
                        className="w-full p-4 rounded-xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ borderColor: 'var(--border-color)' }}
                    />

                    {showSuggestions && countryInput && filteredCountries.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                            {filteredCountries.map(country => (
                                <button
                                    key={country}
                                    onClick={() => addCountry(country)}
                                    className="w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors"
                                >
                                    {country}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {data.targetCountries.map(country => (
                        <span
                            key={country}
                            className="px-4 py-2 bg-secondary/50 rounded-lg flex items-center gap-2 font-medium"
                        >
                            {country}
                            <button
                                onClick={() => removeCountry(country)}
                                className="hover:text-destructive transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </span>
                    ))}
                    {data.targetCountries.length === 0 && (
                        <span className="text-muted-foreground text-sm italic">No countries selected yet.</span>
                    )}
                </div>
                {data.targetCountries.length >= 3 && (
                    <p className="text-xs text-amber-500 mt-2">Maximum 3 countries selected.</p>
                )}
            </div>
        </div>
    )
}
