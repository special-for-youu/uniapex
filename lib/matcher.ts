import { supabase } from './supabase'
import { Profile, University } from './supabase'

export interface MatchResult {
  safety: UniversityMatch[]
  target: UniversityMatch[]
  reach: UniversityMatch[]
  outOfReach: UniversityMatch[]
}

export interface UniversityMatch extends University {
  matchScore: number
  matchCategory: 'safety' | 'target' | 'reach' | 'out-of-reach'
  gaps: {
    ielts?: number
    gpa?: number
    sat?: number
  }
}

/**
 * Match universities based on user profile
 * Categorizes universities as Safety, Target, Reach, or Out of Reach
 */
export async function matchUniversities(profile: Profile): Promise<MatchResult> {
  try {
    // Fetch all universities
    const { data: universities, error } = await supabase
      .from('universities')
      .select('*')
      .order('ranking', { ascending: true, nullsFirst: false })

    if (error) throw error
    if (!universities) return { safety: [], target: [], reach: [], outOfReach: [] }

    const matches: UniversityMatch[] = universities.map(uni => {
      const match = calculateMatch(profile, uni)
      return {
        ...uni,
        ...match,
      }
    })

    // Categorize
    const safety = matches.filter(m => m.matchCategory === 'safety')
    const target = matches.filter(m => m.matchCategory === 'target')
    const reach = matches.filter(m => m.matchCategory === 'reach')
    const outOfReach = matches.filter(m => m.matchCategory === 'out-of-reach')

    return { safety, target, reach, outOfReach }
  } catch (error) {
    console.error('Error matching universities:', error)
    throw error
  }
}

/**
 * Calculate match score and category for a single university
 */
export function calculateMatch(profile: Profile, university: University): {
  matchScore: number
  matchCategory: 'safety' | 'target' | 'reach' | 'out-of-reach'
  gaps: { ielts?: number; gpa?: number; sat?: number }
} {
  const requirements = university.requirements || {}
  const gaps: { ielts?: number; gpa?: number; sat?: number } = {}

  let totalScore = 0
  let criteriaCount = 0

  // Check IELTS
  if (requirements.min_ielts) {
    criteriaCount++
    const userIELTS = profile.ielts_score || 0
    const required = requirements.min_ielts

    if (userIELTS >= required * 1.1) {
      totalScore += 100 // Exceeds by 10%+
    } else if (userIELTS >= required) {
      totalScore += 80 // Meets requirement
    } else if (userIELTS >= required * 0.85) {
      totalScore += 50 // Close (within 15%)
    } else {
      totalScore += 20 // Below requirement
      gaps.ielts = required - userIELTS
    }
  }

  // Check GPA
  if (requirements.min_gpa) {
    criteriaCount++
    const userGPA = profile.current_gpa || 0
    const required = requirements.min_gpa

    if (userGPA >= required * 1.1) {
      totalScore += 100
    } else if (userGPA >= required) {
      totalScore += 80
    } else if (userGPA >= required * 0.85) {
      totalScore += 50
    } else {
      totalScore += 20
      gaps.gpa = required - userGPA
    }
  }

  // Check SAT
  if (requirements.min_sat) {
    criteriaCount++
    const userSAT = profile.sat_score || 0
    const required = requirements.min_sat

    if (userSAT >= required * 1.1) {
      totalScore += 100
    } else if (userSAT >= required) {
      totalScore += 80
    } else if (userSAT >= required * 0.85) {
      totalScore += 50
    } else {
      totalScore += 20
      gaps.sat = required - userSAT
    }
  }

  // Calculate average score
  const avgScore = criteriaCount > 0 ? totalScore / criteriaCount : 50

  // Determine category
  let category: 'safety' | 'target' | 'reach' | 'out-of-reach'

  if (avgScore >= 90) {
    category = 'safety'
  } else if (avgScore >= 70) {
    category = 'target'
  } else if (avgScore >= 40) {
    category = 'reach'
  } else {
    category = 'out-of-reach'
  }

  return {
    matchScore: Math.round(avgScore),
    matchCategory: category,
    gaps,
  }
}

/**
 * Get personalized suggestions for improving chances
 */
export function getImprovementSuggestions(profile: Profile, matches: MatchResult): string[] {
  const suggestions: string[] = []

  // Check IELTS
  if (!profile.ielts_score || profile.ielts_score < 7.0) {
    const targetIELTS = 7.0
    const gap = targetIELTS - (profile.ielts_score || 0)
    if (gap > 0) {
      suggestions.push(`Increase IELTS score by ${gap.toFixed(1)} to unlock ${countUniversitiesWithRequirement(matches.reach, 'ielts', targetIELTS)} more universities`)
    }
  }

  // Check GPA
  if (!profile.current_gpa || profile.current_gpa < 3.5) {
    const targetGPA = 3.5
    const gap = targetGPA - (profile.current_gpa || 0)
    if (gap > 0) {
      suggestions.push(`Improve GPA by ${gap.toFixed(2)} to qualify for ${countUniversitiesWithRequirement(matches.reach, 'gpa', targetGPA)} additional universities`)
    }
  }

  // Check SAT
  if (!profile.sat_score || profile.sat_score < 1400) {
    const targetSAT = 1400
    const gap = targetSAT - (profile.sat_score || 0)
    if (gap > 0) {
      suggestions.push(`Boost SAT score by ${gap} points to access ${countUniversitiesWithRequirement(matches.reach, 'sat', targetSAT)} more opportunities`)
    }
  }

  return suggestions
}

function countUniversitiesWithRequirement(universities: UniversityMatch[], type: 'ielts' | 'gpa' | 'sat', threshold: number): number {
  return universities.filter(uni => {
    const req = uni.requirements
    if (!req) return false

    if (type === 'ielts' && req.min_ielts && req.min_ielts <= threshold) return true
    if (type === 'gpa' && req.min_gpa && req.min_gpa <= threshold) return true
    if (type === 'sat' && req.min_sat && req.min_sat <= threshold) return true

    return false
  }).length
}
