import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Using generic questions map for scoring reference if needed, 
// but for now we assume client sends answers with IDs that map to dimensions.
// Since we don't have a DB of questions, we'll re-declare the map or infer from ID.
// Convention: ID ends with _1, _2 etc and starts with Dimension.
// Or we just fetch the questions again. 
// For simplicity, let's just parse the ID e.g. "E_I_1" -> EI dimension.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { answers, gender } = body;

        let scores = {
            E: 0, I: 0,
            S: 0, N: 0,
            T: 0, F: 0,
            J: 0, P: 0
        };

        // Calculate scores based on hardcoded logic matching our questions ID format
        // Value is -3 to +3. 
        // If ID is E_I: + means E, - means I (or vice versa? Let's assume + is first letter)
        answers.forEach((ans: any) => {
            const parts = ans.id.split('_');
            if (parts.length >= 2) {
                const dim = parts[0] + parts[1]; // e.g. EI, SN, TF, JP
                const val = ans.value;

                // Simple logic: 
                // EI: + -> Extravert, - -> Introvert
                // SN: + -> Sensing, - -> Intuitive
                // TF: + -> Thinking, - -> Feeling
                // JP: + -> Judging, - -> Prospecting

                // Note: Real tests are more complex, but this is a rough approximation.
                if (dim === "EI") {
                    if (val > 0) scores.E += val; else scores.I += Math.abs(val);
                } else if (dim === "SN") {
                    if (val > 0) scores.S += val; else scores.N += Math.abs(val);
                } else if (dim === "TF") {
                    if (val > 0) scores.T += val; else scores.F += Math.abs(val);
                } else if (dim === "JP") {
                    if (val > 0) scores.J += val; else scores.P += Math.abs(val);
                }
            }
        });

        const type = [
            scores.E >= scores.I ? 'E' : 'I',
            scores.S >= scores.N ? 'S' : 'N',
            scores.T >= scores.F ? 'T' : 'F',
            scores.J >= scores.P ? 'J' : 'P'
        ].join('');

        // Calculate percentages
        const totalEI = scores.E + scores.I || 1;
        const pctE = Math.round((scores.E / totalEI) * 100);
        const pctI = 100 - pctE;

        const totalSN = scores.S + scores.N || 1;
        const pctS = Math.round((scores.S / totalSN) * 100);
        const pctN = 100 - pctS;

        const totalTF = scores.T + scores.F || 1;
        const pctT = Math.round((scores.T / totalTF) * 100);
        const pctF = 100 - pctT;

        const totalJP = scores.J + scores.P || 1;
        const pctJ = Math.round((scores.J / totalJP) * 100);
        const pctP = 100 - pctJ;


        // AI Generation for rich description
        const prompt = `
        You are an expert MBTI personality analyst.
        Analyze the personality type: ${type}.
        Gender: ${gender || 'Neutral'}.

        Provide a response in strict JSON format matching this structure:
        {
            "niceName": "The Archetype Name (e.g. Virtuoso, Architect)",
            "snippet": "1-sentence summary of this type.",
            "description": "A 2-3 sentence engaging description of what this personality means."
        }
        Do not use markdown blocks.
        `;

        let aiData = {
            niceName: type,
            snippet: "Your personality type.",
            description: "Analysing..."
        };

        if (process.env.GEMINI_API_KEY) {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-lite',
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                });
                const text = response.text || '';
                const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                aiData = JSON.parse(cleanJson);
            } catch (e) {
                console.error("AI Gen error", e);
            }
        }

        // Construct response matching the user's requested format
        const responseData = {
            niceName: aiData.niceName,
            fullCode: type + "-A", // Adding -A (Assertive) as placeholder, sophisticated test would calculate A/T
            avatarSrc: `https://www.16personalities.com/static/images/personality-types/avatars/${type.toLowerCase()}-${aiData.niceName.toLowerCase().replace(' ', '-')}-male.svg`, // Fallback/Placeholder
            avatarAlt: `${type} avatar`,
            snippet: aiData.snippet,
            scales: ["Energy", "Mind", "Nature", "Tactics"],
            traits: [
                {
                    key: "introverted",
                    label: "Energy",
                    score: scores.I,
                    pct: pctI,
                    trait: pctI > 50 ? "Introverted" : "Extraverted",
                    link: "#",
                    color: "blue",
                    reverse: false,
                    description: `This reflects how you interact with the world. You are ${pctI}% Introverted and ${pctE}% Extraverted.`
                },
                {
                    key: "observant", // S
                    label: "Mind",
                    score: scores.S,
                    pct: pctS,
                    trait: pctS > 50 ? "Observant" : "Intuitive",
                    link: "#",
                    color: "yellow",
                    reverse: false,
                    description: `This reflects how you process information. You are ${pctS}% Observant and ${pctN}% Intuitive.`
                },
                {
                    key: "thinking", // T
                    label: "Nature",
                    score: scores.T,
                    pct: pctT,
                    trait: pctT > 50 ? "Thinking" : "Feeling",
                    link: "#",
                    color: "green",
                    reverse: true,
                    description: `This reflects how you make decisions. You are ${pctT}% Thinking and ${pctF}% Feeling.`
                },
                {
                    key: "judging", // J
                    label: "Tactics",
                    score: scores.J,
                    pct: pctJ,
                    trait: pctJ > 50 ? "Judging" : "Prospecting",
                    link: "#",
                    color: "purple",
                    reverse: false,
                    description: `This reflects your work style. You are ${pctJ}% Judging and ${pctP}% Prospecting.`
                }
            ]
        };

        return NextResponse.json(responseData);

    } catch (error: any) {
        console.error('MBTI Submit Error:', error);
        return NextResponse.json({ error: 'Failed to process results' }, { status: 500 });
    }
}
