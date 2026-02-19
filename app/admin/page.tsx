'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })
            const data = await res.json()

            if (data.success) {
                router.push('/admin/dashboard')
            } else {
                setError(data.error || 'Invalid password')
            }
        } catch (err) {
            setError('Login failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--main-bg)', color: 'var(--text-color)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 rounded-2xl border backdrop-blur-xl"
                style={{
                    backgroundColor: 'var(--main-container-bg)',
                    borderColor: 'var(--border-color)',
                    boxShadow: 'var(--container-shadow)'
                }}
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
                <p className="text-center text-gray-500 mb-8">Enter the council password to continue</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter password..."
                            className="w-full px-4 py-3 rounded-xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            style={{ borderColor: error ? 'red' : 'var(--border-color)' }}
                        />
                        {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        Access Dashboard
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
