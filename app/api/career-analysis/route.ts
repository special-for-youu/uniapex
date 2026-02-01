import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
    try {
        const { profile, results, topType } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                analysis: "API Key missing. Please check configuration."
            });
        }

        let prompt = `You are an expert career counselor. Analyze this student's Holland Code (RIASEC) profile to recommend suitable career paths.

Student Profile:
- Name: ${profile?.full_name || 'Student'}
- Top Personality Type: ${topType?.type?.title} (${topType?.type?.focus})
- Description: ${topType?.type?.description}

Full Profile Breakdown:
${results.map((r: any) => `- ${r.type.title}: ${r.percentage}%`).join('\n')}

Based on this profile, provide a detailed analysis and recommend EXACTLY 5 specific professions.

1.  **Analysis**: A detailed summary of their work personality and strengths.
2.  **Careers**: A list of 5 professions that fit them best. For each, provide:
    *   **Title**: Job title.
    *   **Description**: Brief explanation of the role.
    *   **Skills**: Key skills required (comma-separated).
    *   **Salary**: Estimated salary range (in KZT and USD).
    *   **Education**: Typical education path.

Return your response in this EXACT JSON format (no markdown, just pure JSON):
{
  "analysis": "Your detailed analysis here...",
  "careers": [
    {
      "title": "Profession Name",
      "description": "Brief description...",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "salary": "300k-500k KZT / $1k-$2k",
      "education": "Bachelor's in..."
    }
  ]
}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        const text = response.text || '';

        try {
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const parsed = JSON.parse(cleanText);

            // SAVE TO SUPABASE
            const cookieStore = cookies();
            const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('test_results').insert({
                        user_id: user.id,
                        test_type: 'CAREER',
                        // Save both the AI analysis and the raw scores
                        result_data: {
                            analysis: parsed,
                            scores: results,
                            topType: topType
                        }
                    });
                }
            } catch (saveError) {
                console.error('Failed to save assessment results:', saveError);
                // We don't block the response if save fails, but log it
            }

            return NextResponse.json(parsed);
        } catch (e) {
            console.error('Failed to parse AI response:', e);
            return NextResponse.json({
                analysis: "We couldn't generate a personalized analysis at this time."
            });
        }

    } catch (error) {
        console.error('Career analysis error:', error);
        return NextResponse.json({
            analysis: "An error occurred while analyzing your profile."
        });
    }
}
