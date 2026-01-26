import { GoogleGenAI } from '@google/genai'
import { NextResponse } from 'next/server'



const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { questions, answers } = body

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'API key missing' }, { status: 500 })
        }

        // Construct the prompt
        let prompt = `You are an expert career counselor and university admissions advisor. A student has just completed an introductory questionnaire. Based on their answers, provide personalized recommendations.

Questionnaire:
`
        questions.forEach((q: string, i: number) => {
            prompt += `${i + 1}. ${q}: ${answers[i] ? 'Yes' : 'No'}\n`
        })

        prompt += `
Please provide a response in the following JSON format (do not use markdown):
{
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3",
        "Recommendation 4",
        "Recommendation 5"
    ],
    "careerPaths": [
        "Career Path 1",
        "Career Path 2",
        "Career Path 3"
    ],
    "summary": "A brief 2-3 sentence summary of their profile."
}

Focus on:
- Specific exams (IELTS, SAT, etc.) if they haven't taken them.
- Career directions based on their interests (e.g., CS, Medicine, Business).
- University regions (USA, Europe, Asia) if indicated.
- Extracurriculars (volunteering, olympiads).
`

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })

        const text = response.text || ''
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()

        try {
            const data = JSON.parse(cleanJson)
            return NextResponse.json(data)
        } catch (e) {
            console.error('Failed to parse AI response:', text)
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
        }

    } catch (error: any) {
        // Check for rate limit error to avoid verbose logging
        if (error.status === 429 || error.code === 429 || error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
            console.warn('AI Rate Limit Exceeded (429) - Free Tier')
            return NextResponse.json(
                { error: 'System is busy (Rate Limit). Please try again in to moment.' },
                { status: 429 }
            )
        }

        console.error('AI Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate recommendations' },
            { status: 500 }
        )
    }
}
