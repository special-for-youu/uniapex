import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const data = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'API key missing' }, { status: 500 });
        }

        // Construct the prompt based on WizardState
        let prompt = `You are an expert career counselor and university admissions advisor. A student has completed a detailed profile wizard. 
        Analyze their deep motivation, academic interests, and hard achievements to provide personalized recommendations.

        Student Profile:
        
        1. Geography & Scale:
           - Continents of Interest: ${data.continents.map((c: any) => `${c.name} (Priority ${c.priority})`).join(', ')}
           - Top Target Countries: ${data.targetCountries.join(', ')}

        2. Academic Interests:
           - All Interests: ${data.interests.join(', ')}
           - Priority Order: ${data.subjectPriority.join(' > ')}

        3. Achievements & Hard Facts:
           - IELTS/TOEFL: ${data.exams.ielts.taken ? `Yes, Score: ${data.exams.ielts.score}` : 'No'}
           - SAT: ${data.exams.sat.taken ? `Yes, Score: ${data.exams.sat.score}` : 'No'}
           - Olympiads: ${data.exams.olympiads.taken ? `Yes, Level: ${data.exams.olympiads.level}` : 'No'}
           - Volunteering/Leadership: ${data.exams.volunteering.taken ? `Yes, "${data.exams.volunteering.description}"` : 'No'}

        4. Deep Motivation (Psychographics):
           - Intellectual Curiosity (What they would research for fun): 
             "${data.motivation.researchInterest}"
             
           - Gap Year Scenario (What they would do if not studying): 
             "${data.motivation.gapYearActivity}"

        Based on this rich context, providing a response in the following JSON format (no markdown):
        {
            "recommendations": [
                "Specific Recommendation 1 (e.g., specific university programs or countries to focus on)",
                "Specific Recommendation 2 (e.g., preparation strategy for SAT/IELTS if missing/low)",
                "Specific Recommendation 3 (e.g., extracurriculars to boost profile)",
                "Specific Recommendation 4",
                "Specific Recommendation 5"
            ],
            "careerPaths": [
                "Career Path 1 (matches interests + motivation)",
                "Career Path 2",
                "Career Path 3"
            ],
            "summary": "A deep psychological and academic profile summary (2-3 sentences). Connect their 'Deep Motivation' answers to their 'Academic Interests'."
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const text = response.text || '';
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const result = JSON.parse(cleanJson);

            let savedId = null;

            // SAVE TO SUPABASE
            const supabase = await createClient();

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: savedData, error: saveError } = await supabase.from('test_results').insert({
                        user_id: user.id,
                        test_type: 'TEST_INTRO',
                        // Save both the AI analysis and the raw wizard data
                        result_data: {
                            analysis: result,
                            wizardData: data,
                            createdAt: new Date().toISOString()
                        }
                    }).select().single();

                    if (saveError) throw saveError;
                    if (savedData) savedId = savedData.id;
                }
            } catch (saveError) {
                console.error('Failed to save assessment intro results:', saveError);
                // We don't block the response if save fails, but log it
            }

            return NextResponse.json({ ...result, id: savedId });
        } catch (e) {
            console.error('Failed to parse AI response:', text);
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
        }

    } catch (error: any) {
        if (error.status === 429 || error.code === 429 || error.message?.includes('429')) {
            console.warn('AI Rate Limit Exceeded');
            return NextResponse.json(
                { error: 'System is busy. Please try again later.' },
                { status: 429 }
            );
        }

        console.error('AI Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate recommendations' },
            { status: 500 }
        );
    }
}
