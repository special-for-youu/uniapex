import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'



const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { mode, message, profile, history } = body

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is missing')
            return NextResponse.json({ error: 'API key missing' }, { status: 500 })
        }

        let prompt = ''

        // Construct history context
        let historyContext = ''
        if (history && Array.isArray(history)) {
            historyContext = history.map((msg: any) => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')
        }

        if (mode === 'essay') {
            prompt = `You are an expert college admissions counselor. Please review the following essay and provide constructive feedback on structure, content, and tone. Highlight strengths and areas for improvement. Essay: "${message}"`
        } else if (mode === 'career_analysis') {
            prompt = `You are an expert career counselor. Analyze the following student profile and suggest 3 suitable careers.
            
            Profile:
            - Interests: ${profile?.interests?.join(', ') || 'General'}
            - Skills/Qualities: ${profile?.qualities?.join(', ') || 'General'}
            - Goals: ${profile?.goals?.join(', ') || 'Success'}
            - Grade: ${profile?.grade || 'High School'}
            - Country: ${profile?.target_country || 'Global'}

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
            
            Current Request: "${message}"
            
            Previous Conversation:
            ${historyContext}
            
            If the student asks for a practice question, provide one relevant to IELTS or SAT (specify which).
            If they ask for a tip, provide a specific, actionable strategy.
            Keep the tone encouraging and professional.`
        } else {
            prompt = `You are a helpful university admissions assistant called "UNIAPEX AI".
            
            Current Request: "${message}"
            
            Previous Conversation:
            ${historyContext}
            
            Answer questions about university applications, tests (IELTS/SAT), scholarships, or general advice.
            Keep answers concise and helpful.`
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
