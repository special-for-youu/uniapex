import { useState, useEffect, useRef } from 'react'
import { MapPin, X, ChevronDown, Check } from 'lucide-react'
import { POPULAR_COUNTRIES } from '@/app/constants/countries'

interface CountrySelectProps {
    value: string
    onChange: (value: string) => void
    label: string
    placeholder?: string
    error?: string
    required?: boolean
    className?: string
}

export default function CountrySelect({ value, onChange, label, placeholder = "Select a country", error, required, className }: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredCountries = POPULAR_COUNTRIES.filter(country =>
        country.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelect = (country: string) => {
        onChange(country)
        setIsOpen(false)
        setSearch('')
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-foreground flex items-center justify-between cursor-pointer transition-all ${isOpen ? 'ring-2 ring-primary border-primary/50' : 'hover:border-white/20'
                    } ${error ? 'border-red-500' : ''}`}
            >
                <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-white/10 bg-black/20">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Type to search..."
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/5 text-foreground focus:outline-none focus:border-primary/50 text-sm"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map(country => (
                                <button
                                    key={country}
                                    onClick={() => handleSelect(country)}
                                    className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center justify-between ${value === country ? 'bg-primary/20 text-primary font-medium' : 'text-foreground'
                                        }`}
                                >
                                    {country}
                                    {value === country && <Check className="w-4 h-4" />}
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

