import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { mode, message, history } = body

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is missing')
            return NextResponse.json({ error: 'API key missing' }, { status: 500 })
        }

        // --- INPUT VALIDATION ---
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 })
        }

        if (message.length > 2000) {
            return NextResponse.json({ error: 'Message is too long (max 2000 characters)' }, { status: 400 })
        }

        const validModes = ['essay', 'career_analysis', 'test_prep', 'chat', 'general']
        if (mode && !validModes.includes(mode)) {
            return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
        }
        // ------------------------

        // ------------------------

        // --- AUTH & RATE LIMITING ---
        const cookieStore = cookies()
        const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            try {
                // Check Rate Limit
                const { data: limitData, error: limitError } = await supabase
                    .from('api_rate_limits')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('endpoint', 'ai-tutor')
                    .single()

                const now = new Date()

                if (limitData) {
                    const windowStart = new Date(limitData.window_start)
                    const diffSeconds = (now.getTime() - windowStart.getTime()) / 1000

                    if (diffSeconds < 60) {
                        // In window
                        if (limitData.request_count >= 10) {
                            return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 })
                        }
                        await supabase.from('api_rate_limits')
                            .update({ request_count: limitData.request_count + 1 })
                            .eq('user_id', user.id)
                            .eq('endpoint', 'ai-tutor')
                    } else {
                        // New window
                        await supabase.from('api_rate_limits')
                            .update({ request_count: 1, window_start: now.toISOString() })
                            .eq('user_id', user.id)
                            .eq('endpoint', 'ai-tutor')
                    }
                } else {
                    // First request
                    await supabase.from('api_rate_limits')
                        .insert({ user_id: user.id, endpoint: 'ai-tutor', request_count: 1, window_start: now.toISOString() })
                }
            } catch (rateLimitError) {
                console.error('Rate limit check failed:', rateLimitError)
                // Fail open? Or closed? Let's fail open for now to avoid blocking users on DB errors.
            }
        }
        // ----------------------------

        // --- FETCH USER CONTEXT ---
        let userContext = ''
        try {
            // Already initialized supabase above
            if (user) {
                // 1. Fetch Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                // 2. Fetch Recent Test Results
                const { data: testResults } = await supabase
                    .from('test_results')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (profile) {
                    userContext += `\n\nUSER PROFILE:\nTime now: ${new Date().toISOString()}\n`
                    if (profile.full_name) userContext += `- Name: ${profile.full_name}\n`
                    if (profile.target_country) userContext += `- Target Country: ${profile.target_country}\n`
                    if (profile.current_gpa) userContext += `- GPA: ${profile.current_gpa}\n`
                    if (profile.ielts_score) userContext += `- IELTS Score: ${profile.ielts_score}\n`
                    if (profile.sat_score) userContext += `- SAT Score: ${profile.sat_score}\n`
                    if (profile.interests) userContext += `- Interests: ${Array.isArray(profile.interests) ? profile.interests.join(', ') : profile.interests}\n`
                }

                if (testResults && testResults.length > 0) {
                    userContext += `\n\nRECENT TEST RESULTS:\n`
                    testResults.forEach((test: any) => {
                        const date = new Date(test.created_at).toLocaleDateString()
                        if (test.test_type === 'CAREER') {
                            const topCareer = test.result_data?.topType?.type?.title || 'Unknown'
                            userContext += `- Career Test (${date}): Result was "${topCareer}". Focus: ${test.result_data?.topType?.type?.focus}.\n`
                        } else if (test.test_type === 'MBTI') {
                            const type = test.result_data?.type || 'Unknown'
                            userContext += `- MBTI Personality (${date}): Type ${type}.\n`
                        } else {
                            // Generic handler for other tests (e.g. GENERAL)
                            const summary = test.result_data?.summary || test.result_data?.score || 'See details'
                            userContext += `- ${test.test_type} Test (${date}): ${JSON.stringify(summary)}\n`
                        }
                    })
                }
            }
        } catch (ctxError) {
            console.error('Error fetching user context:', ctxError)
            // Continue without context if fetch fails
        }
        // --------------------------

        let prompt = ''

        // Construct history context
        let historyContext = ''
        if (history && Array.isArray(history)) {
            historyContext = history.map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')
        }

        if (mode === 'essay') {
            prompt = `You are an expert college admissions counselor. Please review the following essay and provide constructive feedback on structure, content, and tone. Highlight strengths and areas for improvement. Essay: "${message}"`
        } else if (mode === 'career_analysis') {
            // ... (keeping existing logic for specific career analysis if prompted with a profile object directly)
            const profileFromRequest = body.profile || {}
            prompt = `You are an expert career counselor. Analyze the following student profile and suggest 3 suitable careers.
            
            Profile:
            - Interests: ${profileFromRequest?.interests?.join(', ') || 'General'}
            - Skills/Qualities: ${profileFromRequest?.qualities?.join(', ') || 'General'}
            - Goals: ${profileFromRequest?.goals?.join(', ') || 'Success'}
            - Grade: ${profileFromRequest?.grade || 'High School'}
            - Country: ${profileFromRequest?.target_country || 'Global'}

            Return the response strictly as a JSON object with a "careers" array. Each career object must have:
            - title (string)
            - matchScore (number, 0-100)
            - salaryKZ (string, e.g., "$1000/mo")
            - salaryUS (string, e.g., "$5000/mo")
            - description (string, 1-2 sentences)
            - education (string, recommended degree)
            - universities (array of strings, 2-3 top universities for this field)
            
            Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.`
        } else if (mode === 'test_prep') {
            prompt = `You are an expert IELTS and SAT tutor. The student is asking for help with exam preparation.
            
            ${userContext}

            Current Request: "${message}"
            
            Previous Conversation:
            ${historyContext}
            
            If the student asks for a practice question, provide one relevant to IELTS or SAT (specify which).
            If they ask for a tip, provide a specific, actionable strategy.
            Keep the tone encouraging and professional.`
        } else {
            prompt = `You are "UNIAPEX AI", a highly intelligent university admissions assistant and career counselor.
            
            ${userContext}
            
            INSTRUCTIONS:
            1. Use the "USER PROFILE" (especially IELTS code, SAT score, GPA) and "RECENT TEST RESULTS" above to personalize your advice.
            2. ALWAYS consider their IELTS and SAT scores when suggesting universities.
            3. If the user asks "What are my strengths?", analyze their test results (MBTI, Career, General) and stats.
            4. If the user has no profile data, politely ask them to fill it out in the Profile section.
            5. Be encouraging, professional, and concise.

            Current Request: "${message}"
            
            Previous Conversation:
            ${historyContext}`
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })

        const text = response.text || ''

        // Parse JSON for career analysis
        if (mode === 'career_analysis' && text) {
            try {
                const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
                const data = JSON.parse(cleanJson)
                return NextResponse.json(data)
            } catch (e) {
                console.error('Error parsing AI response:', e)
                return NextResponse.json({ error: 'Failed to parse career analysis' }, { status: 500 })
            }
        }

        return NextResponse.json({ response: text })
    } catch (error: any) {
        console.error('AI Error:', error)

        // Handle Quota Exceeded (429)
        if (error.message?.includes('429') || error.status === 429 || error.message?.includes('Resource exhausted')) {
            return NextResponse.json(
                { error: 'AI usage limit reached. Please try again in a few minutes.' },
                { status: 429 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to generate response', details: error.message },
            { status: 500 }
        )
    }
}
