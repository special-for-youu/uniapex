'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Search, Filter, BookmarkPlus, BookmarkCheck, MapPin, DollarSign, GraduationCap, Loader2, X, Globe, Phone, Mail, Facebook, Twitter, Instagram, Youtube, BookOpen, Users, Building } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Updated interface to match DB schema
interface University {
  id: string
  name: string
  location: string | null
  description: string | null
  website: string | null
  image_url: string | null
  logo_url: string | null
  admissions: {
    tuition?: number | string
    acceptance_rate?: number | string
    important_dates?: any
    requirements?: {
      min_gpa?: number
      min_ielts?: number
      min_sat?: number
      min_toefl?: number
    }
    requirements_text?: string
  } | null
  admission_requirements?: Array<{
    name: string
    cost?: string | null
  }> | null
  programs: string[] | null
  campus_life: string[] | null
  institution_type: string | null
  contact: {
    phone?: string
    email?: string
    social?: {
      facebook?: string
      twitter?: string
      instagram?: string
      youtube?: string
    }
  } | null
  // Helper properties for UI (computed)
  country?: string
  city?: string
  tuition_fee?: number
}

interface Filters {
  country: string
  minGPA: string
  minIELTS: string
  maxTuition: string
  program: string
  showSaved: boolean
  scholarships: boolean
}

const ITEMS_PER_PAGE = 12;

export default function UniversitiesPage() {
  const router = useRouter()
  const [universities, setUniversities] = useState<University[]>([])
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const observerTarget = useRef(null)
  const consecutiveEmptyLoads = useRef(0)

  const [filters, setFilters] = useState<Filters>({
    country: '',
    minGPA: '',
    minIELTS: '',
    maxTuition: '',
    program: '',
    showSaved: false,
    scholarships: false,
  })

  useEffect(() => {
    loadUniversities(true)
    loadSavedUniversities()
  }, [])

  useEffect(() => {
    // Debounce search and filter changes
    const timer = setTimeout(() => {
      loadUniversities(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, filters])

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadUniversities(false)
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading, loadingMore, universities])

  const loadUniversities = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(0)
      } else {
        setLoadingMore(true)
      }

      const currentPage = reset ? 0 : page
      const from = currentPage * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1

      let query = supabase
        .from('universities')
        .select('*', { count: 'exact' })

      // Apply Filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      }

      if (filters.country) {
        query = query.ilike('location', `%${filters.country}%`)
      }

      if (filters.program) {
        query = query.contains('programs', [filters.program])
      }

      if (filters.showSaved) {
        if (savedIds.size > 0) {
          query = query.in('id', Array.from(savedIds))
        } else {
          // If no saved items, return empty result immediately
          setUniversities([])
          setHasMore(false)
          setLoading(false)
          setLoadingMore(false)
          return
        }
      }

      const { data, error, count } = await query
        .range(from, to + 50) // Fetch extra to account for client-side filtering

      if (error) throw error

      let mappedData: University[] = (data || []).map((uni: any) => ({
        ...uni,
        country: uni.location ? uni.location.split(',').pop()?.trim() : 'Unknown',
        city: uni.location ? uni.location.split(',')[0]?.trim() : null,
        tuition_fee: uni.admissions?.tuition ? parseInt(String(uni.admissions.tuition).replace(/[^0-9]/g, '')) : null,
      }))

      // Client-side filtering
      if (filters.program) {
        const programTerm = filters.program.toLowerCase()
        mappedData = mappedData.filter(u =>
          u.programs?.some(p => p.toLowerCase().includes(programTerm))
        )
      }

      if (filters.minGPA) {
        mappedData = mappedData.filter(u => {
          const gpa = u.admissions?.requirements?.min_gpa
          return gpa ? gpa <= parseFloat(filters.minGPA) : true
        })
      }

      if (filters.minIELTS) {
        mappedData = mappedData.filter(u => {
          const ielts = u.admissions?.requirements?.min_ielts
          return ielts ? ielts <= parseFloat(filters.minIELTS) : true
        })
      }

      if (filters.maxTuition) {
        mappedData = mappedData.filter(u => {
          if (!u.tuition_fee) return true
          return u.tuition_fee <= parseInt(filters.maxTuition)
        })
      }

      if (filters.scholarships) {
        mappedData = mappedData.filter(u => {
          const desc = u.description?.toLowerCase() || ''
          const reqs = u.admissions?.requirements_text?.toLowerCase() || ''
          return desc.includes('scholarship') || desc.includes('financial aid') || reqs.includes('scholarship') || reqs.includes('financial aid')
        })
      }

      // Slice to correct page size after filtering
      const paginatedData = mappedData.slice(0, ITEMS_PER_PAGE)

      if (reset) {
        setUniversities(paginatedData)
        consecutiveEmptyLoads.current = 0
      } else {
        if (paginatedData.length === 0 && data && data.length > 0) {
          consecutiveEmptyLoads.current += 1
        } else {
          consecutiveEmptyLoads.current = 0
        }
        setUniversities(prev => [...prev, ...paginatedData])
      }

      // Stop if we have 3 consecutive empty loads or if supabase returned no data
      if (consecutiveEmptyLoads.current >= 3 || !data || data.length === 0) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

      setPage(currentPage + 1)

    } catch (error) {
      console.error('Error loading universities:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadSavedUniversities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('saved_universities')
        .select('university_id')
        .eq('user_id', user.id)

      if (error) throw error
      setSavedIds(new Set(data?.map(s => s.university_id) || []))
    } catch (error) {
      console.error('Error loading saved universities:', error)
    }
  }

  const toggleSave = async (e: React.MouseEvent, universityId: string) => {
    e.stopPropagation() // Prevent opening modal
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const isSaved = savedIds.has(universityId)

      if (isSaved) {
        const { error } = await supabase
          .from('saved_universities')
          .delete()
          .eq('user_id', user.id)
          .eq('university_id', universityId)

        if (error) throw error

        const newSaved = new Set(savedIds)
        newSaved.delete(universityId)
        setSavedIds(newSaved)
      } else {
        const { error } = await supabase
          .from('saved_universities')
          .insert({
            user_id: user.id,
            university_id: universityId,
            status: 'saved',
          })

        if (error) throw error

        setSavedIds(new Set(savedIds).add(universityId))
      }
    } catch (error) {
      console.error('Error toggling save:', error)
    }
  }

  // Hardcoded popular countries for filter
  const popularCountries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Italy', 'Netherlands',
    'Japan', 'South Korea', 'China', 'France', 'Spain', 'Switzerland', 'Sweden',
    'Singapore', 'New Zealand', 'Ireland', 'Malaysia', 'Turkey', 'Poland'
  ]

  const popularPrograms = [
    'Computer Science', 'Business', 'Engineering', 'Medicine', 'Law',
    'Psychology', 'Economics', 'Architecture', 'Data Science', 'Art & Design',
    'Marketing', 'Finance', 'Biology', 'Physics', 'Mathematics', 'Political Science'
  ]

  // Floating Action Buttons
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-background text-foreground">


      {/* Mobile Header Search */}
      {/* Mobile Header Search */}
      <div className="md:hidden sticky top-0 z-40 bg-card/90 backdrop-blur-md p-4 pl-16 border-b border-border shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search universities..."
            className="w-full pl-10 pr-4 py-2 h-10 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-0 pt-4 md:pt-8">
        <div className="text-center mb-10 hidden md:block">
          <h1 className="text-3xl font-bold mb-6">University Finder</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore top universities from around the world. Filter by country, program, and scholarship opportunities to find your perfect match.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="p-4 md:p-6 rounded-xl mb-6 md:mb-8 shadow-sm bg-card border border-border">
          {/* Search Bar (Desktop) */}
          <div className="mb-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search universities..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
              />
            </div>
          </div>

          {/* Desktop Filters Grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Countries</option>
              {popularCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filters.program}
              onChange={(e) => setFilters({ ...filters, program: e.target.value })}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Programs</option>
              {popularPrograms.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>

            <button
              onClick={() => setFilters({ ...filters, showSaved: !filters.showSaved })}
              className={`px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${filters.showSaved
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-background border-border text-foreground hover:bg-muted'
                }`}
            >
              {filters.showSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
              <span>Saved Only</span>
            </button>

            <button
              onClick={() => setFilters({ ...filters, scholarships: !filters.scholarships })}
              className={`px-4 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${filters.scholarships
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-background border-border text-foreground hover:bg-muted'
                }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Scholarships</span>
            </button>

            <input
              type="number"
              step="0.1"
              placeholder="Min GPA"
              value={filters.minGPA}
              onChange={(e) => setFilters({ ...filters, minGPA: e.target.value })}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Universities Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
              {universities.map(university => (
                <UniversityCard
                  key={university.id}
                  university={university}
                  isSaved={savedIds.has(university.id)}
                  onToggleSave={(e) => toggleSave(e, university.id)}
                  onClick={() => setSelectedUniversity(university)}
                />
              ))}
            </div>

            {universities.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-xl text-gray-400">No universities match your filters</p>
              </div>
            )}

            {/* Infinite Scroll Target */}
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center py-8">
                {loadingMore && <Loader2 className="w-8 h-8 animate-spin text-blue-500" />}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-40 md:hidden">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-blue-600 dark:text-blue-400 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-current" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Filter Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-semibold text-sm"
          onClick={() => setShowMobileFilters(true)}
        >
          <span>Filters</span>
          {Object.values(filters).some(v => v && v !== false) && (
            <span className="bg-white text-blue-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">1</span>
          )}
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 500 }}
              className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-3xl z-50 p-6 md:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 bg-muted rounded-full text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Countries</option>
                    {popularCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Program</label>
                  <select
                    value={filters.program}
                    onChange={(e) => setFilters({ ...filters, program: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Programs</option>
                    {popularPrograms.map(prog => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Minimum GPA</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 3.0"
                    value={filters.minGPA}
                    onChange={(e) => setFilters({ ...filters, minGPA: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setFilters({ ...filters, showSaved: !filters.showSaved })}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${filters.showSaved
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-background border-border text-foreground hover:bg-muted'
                      }`}
                  >
                    {filters.showSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    <span>Saved</span>
                  </button>

                  <button
                    onClick={() => setFilters({ ...filters, scholarships: !filters.scholarships })}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${filters.scholarships
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-background border-border text-foreground hover:bg-muted'
                      }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Scholarships</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-blue-500/20"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* University Details Modal */}
      <AnimatePresence>
        {selectedUniversity && (
          <UniversityModal
            university={selectedUniversity}
            onClose={() => setSelectedUniversity(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function UniversityCard({ university, isSaved, onToggleSave, onClick }: {
  university: University;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="rounded-xl overflow-hidden cursor-pointer group flex md:flex-col h-full transition-all duration-300 bg-card shadow-sm hover:shadow-md border border-border"
    >
      {/* Mobile Layout: Row */}
      <div className="flex md:hidden w-full p-3 gap-4">
        {/* Image (Left) */}
        <div className="w-24 h-24 flex-shrink-0 relative rounded-lg overflow-hidden bg-muted">
          {university.image_url ? (
            <img
              src={university.image_url}
              alt={university.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <GraduationCap className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Content (Right) */}
        <div className="flex flex-col flex-grow justify-between py-1">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-bold text-base leading-tight mb-1 line-clamp-2 text-card-foreground">
                {university.name}
              </h3>
              <div className="text-xs text-muted-foreground mb-2 line-clamp-1">
                {university.location || 'Location not specified'}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(e);
              }}
              className="p-1.5 -mt-1 -mr-1 text-muted-foreground hover:text-primary transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <BookmarkPlus className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="text-sm font-bold text-card-foreground">
              {university.admissions?.tuition ? (
                <span>${parseInt(String(university.admissions.tuition).replace(/[^0-9]/g, '')).toLocaleString()}</span>
              ) : (
                <span className="text-muted-foreground text-xs">Tuition N/A</span>
              )}
            </div>
            {university.admissions?.acceptance_rate && (
              <div className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md font-medium">
                {university.admissions.acceptance_rate}% Acc.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout: Column (Original) */}
      <div className="hidden md:flex flex-col h-full">
        {/* Banner Image */}
        <div className="h-48 w-full relative overflow-hidden bg-muted">
          {university.image_url ? (
            <img
              src={university.image_url}
              alt={university.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
              <GraduationCap className="w-12 h-12 mb-2" />
            </div>
          )}

          {/* Logo Overlay */}
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-card rounded-full p-1 shadow-md flex items-center justify-center overflow-hidden">
            {university.logo_url ? (
              <img src={university.logo_url} alt="logo" className="w-full h-full object-contain rounded-full" />
            ) : (
              <span className="text-lg font-bold text-primary">{university.name.charAt(0)}</span>
            )}
          </div>

          <button
            onClick={onToggleSave}
            className="absolute top-4 right-4 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors shadow-sm"
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <BookmarkPlus className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-card-foreground">
            {university.name}
          </h3>

          <div className="flex items-center gap-2 text-sm mb-4 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{university.location || 'Location not specified'}</span>
          </div>

          {/* Requirements Badges */}
          {university.admissions?.requirements && (
            <div className="flex flex-wrap gap-2 mb-4">
              {university.admissions.requirements.min_gpa && (
                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                  GPA {university.admissions.requirements.min_gpa}+
                </span>
              )}
              {university.admissions.requirements.min_ielts && (
                <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded text-xs font-medium">
                  IELTS {university.admissions.requirements.min_ielts}+
                </span>
              )}
            </div>
          )}

          {/* Programs Preview */}
          {university.programs && university.programs.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {university.programs.slice(0, 3).map((prog, i) => (
                  <span key={i} className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-medium truncate max-w-[150px]">
                    {prog}
                  </span>
                ))}
                {university.programs.length > 3 && (
                  <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-[10px] font-medium">
                    +{university.programs.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-sm">
            {university.admissions?.tuition && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                <DollarSign className="w-4 h-4" />
                <span>{university.admissions.tuition}</span>
              </div>
            )}
            {university.admissions?.acceptance_rate && (
              <div className="text-muted-foreground">
                Acceptance: <span className="font-medium text-card-foreground">{university.admissions.acceptance_rate}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function UniversityModal({ university, onClose }: { university: University; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Helper to strip inline styles that might conflict with dark mode
  const cleanHtml = (html: string) => {
    if (!html) return ''
    // Remove style attributes
    return html.replace(/style="[^"]*"/gi, '')
      .replace(/style='[^']*'/gi, '')
  }

  // Helper to add hyperlinks to keywords
  const processDescription = (html: string) => {
    if (!html) return ''
    let processed = cleanHtml(html)

    const keywords = [
      { term: 'early admission', url: '/articles/early-admission' },
      { term: 'scholarship', url: '/articles/find-fit-university' },
      { term: 'financial aid', url: '/articles/find-fit-university' },
      { term: 'admission', url: '/articles/about-admission' }
    ]

    keywords.forEach(({ term, url }) => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi')
      processed = processed.replace(regex, `<a href="${url}" class="text-blue-500 hover:underline font-medium">$1</a>`)
    })

    return processed
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-card text-card-foreground"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white z-20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Image */}
        <div className="h-64 w-full relative flex-shrink-0 bg-muted">
          {university.image_url ? (
            <img
              src={university.image_url}
              alt={university.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/20">
              <GraduationCap className="w-20 h-20 text-primary" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-6">
            <div className="w-24 h-24 bg-card rounded-full p-2 shadow-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
              {university.logo_url ? (
                <img src={university.logo_url} alt="logo" className="w-full h-full object-contain rounded-full" />
              ) : (
                <span className="text-4xl font-bold text-primary">{university.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-grow text-white">
              <h2 className="text-xl md:text-3xl font-bold mb-2">{university.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{university.location}</span>
                </div>
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-blue-300 hover:text-blue-200 hover:underline">
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/50">
              <div className="text-muted-foreground text-sm mb-1">Tuition</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">{university.admissions?.tuition || 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/50">
              <div className="text-muted-foreground text-sm mb-1">Acceptance</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{university.admissions?.acceptance_rate ? `${university.admissions.acceptance_rate}%` : 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/50">
              <div className="text-muted-foreground text-sm mb-1">Min GPA</div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{university.admissions?.requirements?.min_gpa || 'N/A'}</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/50">
              <div className="text-muted-foreground text-sm mb-1">Min IELTS</div>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{university.admissions?.requirements?.min_ielts || 'N/A'}</div>
            </div>
          </div>

          {/* Description */}
          {university.description && (
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                About
              </h3>
              <div
                className="prose prose-sm md:prose-base max-w-none dark:prose-invert text-card-foreground"
                dangerouslySetInnerHTML={{ __html: processDescription(university.description) }}
              />
            </section>
          )}

          {/* Programs */}
          {university.programs && university.programs.length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Programs
              </h3>
              <div className="flex flex-wrap gap-2">
                {university.programs.map((program, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {program}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Admission Requirements */}
          {university.admission_requirements && university.admission_requirements.length > 0 && (
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-500" />
                Admission Requirements
              </h3>

              {/* CommonApp Info */}
              <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Common Application Accepted</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      This university accepts applications through CommonApp.org
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {university.admission_requirements.map((req, idx) => {
                  const hasCost = req.cost && req.cost.trim() !== ''
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {hasCost ? (
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex flex-col items-center justify-center">
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Min</div>
                            <div className="text-sm font-bold text-purple-700 dark:text-purple-300">{req.cost}</div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="text-sm font-medium text-card-foreground">
                          {req.name}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  )
}
