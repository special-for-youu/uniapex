'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { supabase, getProfile, createProfile } from '@/lib/supabase'
import { Profile } from '@/lib/supabase'
import { matchUniversities, getImprovementSuggestions, UniversityMatch } from '@/lib/matcher'
import { Target, TrendingUp, AlertTriangle, XCircle, ExternalLink, Lightbulb } from 'lucide-react'

export default function ChancesPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<{
    safety: UniversityMatch[]
    target: UniversityMatch[]
    reach: UniversityMatch[]
    outOfReach: UniversityMatch[]
  } | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      let userProfile = await getProfile(user.id)

      if (!userProfile) {
        userProfile = await createProfile(user.id, user.email!)
      }

      setProfile(userProfile)

      // Only calculate matches if profile is available
      if (userProfile) {
        // Calculate matches
        const matchResults = await matchUniversities(userProfile)
        setMatches(matchResults)

        // Get suggestions
        const improvementSuggestions = getImprovementSuggestions(userProfile, matchResults)
        setSuggestions(improvementSuggestions)
      }

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const isProfileComplete = profile && profile.current_gpa && profile.ielts_score

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-white text-xl">Calculating your chances...</div>
        </div>
      </div>
    )
  }

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center">
            <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Complete Your Profile First</h2>
            <p className="text-gray-300 mb-6">
              To calculate your admission chances, we need your GPA, IELTS, and SAT scores.
            </p>
            <Link
              href="/profile"
              className="inline-block bg-yellow-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">Your Admission Chances</h1>
        <p className="text-gray-300 mb-8">Based on your current stats: GPA {profile.current_gpa?.toFixed(2)}, IELTS {profile.ielts_score?.toFixed(1)}, SAT {profile.sat_score || 'N/A'}</p>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Improvement Suggestions</h3>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Match Categories */}
        <div className="space-y-8">
          {/* Safety Schools */}
          <MatchCategory
            title="Safety Schools"
            description="You exceed the requirements — high chance of acceptance"
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            universities={matches?.safety || []}
          />

          {/* Target Schools */}
          <MatchCategory
            title="Target Schools"
            description="You meet the requirements — good chance of acceptance"
            icon={<Target className="w-6 h-6" />}
            color="blue"
            universities={matches?.target || []}
          />

          {/* Reach Schools */}
          <MatchCategory
            title="Reach Schools"
            description="You're close but may need improvement — worth applying"
            icon={<AlertTriangle className="w-6 h-6" />}
            color="yellow"
            universities={matches?.reach || []}
          />

          {/* Out of Reach (optional, can be hidden) */}
          {matches && matches.outOfReach.length > 0 && (
            <MatchCategory
              title="Out of Reach"
              description="Significant gap — focus on improving your stats first"
              icon={<XCircle className="w-6 h-6" />}
              color="red"
              universities={matches.outOfReach}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function MatchCategory({ title, description, icon, color, universities }: {
  title: string
  description: string
  icon: React.ReactNode
  color: 'green' | 'blue' | 'yellow' | 'red'
  universities: UniversityMatch[]
}) {
  const colorClasses = {
    green: {
      bg: 'from-green-500/20 to-green-700/20',
      border: 'border-green-500/30',
      icon: 'text-green-400',
      badge: 'bg-green-500/20 text-green-300',
    },
    blue: {
      bg: 'from-blue-500/20 to-blue-700/20',
      border: 'border-blue-500/30',
      icon: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300',
    },
    yellow: {
      bg: 'from-yellow-500/20 to-yellow-700/20',
      border: 'border-yellow-500/30',
      icon: 'text-yellow-400',
      badge: 'bg-yellow-500/20 text-yellow-300',
    },
    red: {
      bg: 'from-red-500/20 to-red-700/20',
      border: 'border-red-500/30',
      icon: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300',
    },
  }[color]

  return (
    <div className={`bg-gradient-to-br ${colorClasses.bg} backdrop-blur-lg rounded-xl border ${colorClasses.border} overflow-hidden`}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className={colorClasses.icon}>{icon}</div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClasses.badge}`}>
            {universities.length}
          </span>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>

      {universities.length > 0 ? (
        <div className="p-6 space-y-4">
          {universities.slice(0, 10).map(uni => (
            <div key={uni.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{uni.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{uni.city ? `${uni.city}, ` : ''}{uni.country}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded ${colorClasses.badge}`}>
                      Match: {uni.matchScore}%
                    </span>
                    {Object.keys(uni.gaps).length > 0 && (
                      <span className="text-gray-400">
                        Gap: {Object.entries(uni.gaps).map(([key, val]) => `${key.toUpperCase()} ${(val as number).toFixed(1)}`).join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {uni.website_url && (
                  <a
                    href={uni.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          ))}

          {universities.length > 10 && (
            <div className="text-center pt-2">
              <Link
                href="/universities"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all {universities.length} universities →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400">
          No universities in this category
        </div>
      )}
    </div>
  )
}
