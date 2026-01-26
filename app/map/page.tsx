'use client'

import { useState } from 'react'
import { MapPin, Search, Navigation } from 'lucide-react'

export default function MapPage() {
    const [selectedUni, setSelectedUni] = useState<any>(null)

    // Mock Universities with coordinates
    const universities = [
        { id: 1, name: 'Nazarbayev University', lat: 51.0908, lng: 71.3980, city: 'Astana' },
        { id: 2, name: 'KBTU', lat: 43.2551, lng: 76.9437, city: 'Almaty' },
        { id: 3, name: 'SDU', lat: 43.2077, lng: 76.6698, city: 'Kaskelen' },
        { id: 4, name: 'Astana IT University', lat: 51.0947, lng: 71.4156, city: 'Astana' },
        { id: 5, name: 'KIMEP', lat: 43.2372, lng: 76.9560, city: 'Almaty' },
    ]

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <div className="relative h-screen">
                {/* Map Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--main-container-bg)' }}>
                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/71.43,51.16,4,0/1280x800?access_token=placeholder')] bg-cover opacity-50" />

                    {/* Simulated Pins */}
                    {universities.map(uni => (
                        <div
                            key={uni.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{
                                left: `${(uni.lng - 65) * 5}%`, // Fake positioning logic for demo
                                top: `${(60 - uni.lat) * 5}%`
                            }}
                            onClick={() => setSelectedUni(uni)}
                        >
                            <div className="relative">
                                <MapPin className="w-8 h-8 text-blue-500 drop-shadow-lg group-hover:scale-125 transition-transform" />
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                {uni.name}
                            </div>
                        </div>
                    ))}

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 backdrop-blur-md px-6 py-3 rounded-full border flex items-center gap-3" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                        <Navigation className="w-5 h-5 text-blue-500" />
                        <span className="text-sm" style={{ color: 'var(--text-color)' }}>Interactive Map Integration (Mapbox/Google) Coming Soon</span>
                    </div>
                </div>

                {/* Sidebar / Overlay */}
                <div className="absolute top-4 left-4 w-80 backdrop-blur-xl border rounded-2xl p-4 shadow-2xl" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search university..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 border"
                            style={{ backgroundColor: 'var(--main-bg)', borderColor: 'var(--item-hover)', color: 'var(--text-color)' }}
                        />
                    </div>

                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {universities.map(uni => (
                            <div
                                key={uni.id}
                                onClick={() => setSelectedUni(uni)}
                                className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedUni?.id === uni.id ? 'bg-blue-500/20 border-blue-500/50' : 'hover:bg-white/5 border-transparent'
                                    }`}
                                style={selectedUni?.id !== uni.id ? { borderColor: 'transparent' } : {}}
                            >
                                <h3 className="font-medium text-sm" style={{ color: 'var(--text-color)' }}>{uni.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{uni.city}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected University Card */}
                {selectedUni && (
                    <div className="absolute bottom-8 right-8 w-80 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl animate-in slide-in-from-right duration-300" style={{ backgroundColor: 'var(--main-container-bg)', borderColor: 'var(--item-hover)' }}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>{selectedUni.name}</h2>
                            <button
                                onClick={() => setSelectedUni(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-sm mb-4" style={{ color: 'var(--text-color)' }}>
                            Located in {selectedUni.city}. A top destination for students pursuing excellence in technology and engineering.
                        </p>
                        <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium text-sm transition-colors text-white">
                            View Details
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
