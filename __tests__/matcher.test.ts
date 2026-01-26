import { calculateMatch } from '../lib/matcher'
import { Profile, University } from '../lib/supabase'

// Mock data
const mockProfile: Profile = {
    id: '1',
    email: 'test@example.com',
    full_name: 'Test User',
    target_country: 'USA',
    current_gpa: 3.8,
    ielts_score: 7.5,
    sat_score: 1450,
    coins: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}

const safetyUni: University = {
    id: '1',
    name: 'Safety U',
    country: 'USA',
    city: 'City',
    ranking: 100,
    tuition_fee: 20000,
    acceptance_rate: 70,
    requirements: {
        min_gpa: 3.0,
        min_ielts: 6.0,
        min_sat: 1200
    },
    website_url: 'http://example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}

const reachUni: University = {
    id: '2',
    name: 'Reach U',
    country: 'USA',
    city: 'City',
    ranking: 10,
    tuition_fee: 50000,
    acceptance_rate: 10,
    requirements: {
        min_gpa: 4.0,
        min_ielts: 8.0,
        min_sat: 1550
    },
    website_url: 'http://example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}

describe('calculateMatch', () => {
    it('should categorize university as safety when requirements are comfortably met', () => {
        const result = calculateMatch(mockProfile, safetyUni)
        expect(result.matchCategory).toBe('safety')
        expect(result.matchScore).toBeGreaterThanOrEqual(90)
    })

    it('should categorize university as reach or out-of-reach when requirements are not met', () => {
        const result = calculateMatch(mockProfile, reachUni)
        expect(['reach', 'out-of-reach']).toContain(result.matchCategory)
        expect(result.matchScore).toBeLessThan(90)
    })

    it('should identify gaps correctly', () => {
        const result = calculateMatch(mockProfile, reachUni)
        expect(result.gaps.gpa).toBeGreaterThan(0)
        expect(result.gaps.ielts).toBeGreaterThan(0)
        expect(result.gaps.sat).toBeGreaterThan(0)
    })
})
