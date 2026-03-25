// AHSAS — Netlify Function: AI Synthesis
// Calls Gemini API to merge, polish, and rank student submissions

export async function handler(event) {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { submissions } = JSON.parse(event.body);

        if (!submissions || !submissions.length) {
            return { statusCode: 400, body: JSON.stringify({ error: 'No submissions provided' }) };
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        if (!GEMINI_API_KEY) {
            return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
        }

        // Compile all dos and don'ts
        const allDos = submissions.flatMap(s => (s.dos || []).map(d => d.trim())).filter(Boolean);
        const allDonts = submissions.flatMap(s => (s.donts || []).map(d => d.trim())).filter(Boolean);

        const prompt = `You are helping a classroom teacher synthesize student-submitted guidelines for a Socratic Seminar discussion.

Below are the raw student submissions. Your job is to:
1. Group similar or overlapping ideas together
2. Merge them into clear, concise guideline statements
3. Fix any grammar, spelling, or awkward phrasing
4. Rank guidelines by how frequently the idea appeared (most mentioned first)
5. Keep the student voice — don't make it sound too formal or corporate
6. If students wrote in Chinese or a mix of languages, produce the guideline in English but preserve the spirit of the idea

RAW DO'S (${allDos.length} submissions from ${submissions.length} students):
${allDos.map((d, i) => `${i + 1}. ${d}`).join('\n')}

RAW DON'TS (${allDonts.length} submissions from ${submissions.length} students):
${allDonts.map((d, i) => `${i + 1}. ${d}`).join('\n')}

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "dos": [
    {"text": "Guideline text here", "count": 5},
    {"text": "Another guideline", "count": 3}
  ],
  "donts": [
    {"text": "Guideline text here", "count": 4},
    {"text": "Another guideline", "count": 2}
  ]
}

The "count" should reflect how many students mentioned this idea (or a very similar one). Order by count descending. Aim for 5-10 guidelines per category — merge aggressively but don't lose distinct ideas.`;

        // Call Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 2048,
                        responseMimeType: 'application/json'
                    }
                })
            }
        );

        if (!geminiResponse.ok) {
            const errText = await geminiResponse.text();
            console.error('Gemini API error:', errText);
            return { statusCode: 502, body: JSON.stringify({ error: 'AI service error', details: errText }) };
        }

        const geminiData = await geminiResponse.json();
        const responseText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            return { statusCode: 502, body: JSON.stringify({ error: 'Empty AI response' }) };
        }

        // Parse the JSON response
        let result;
        try {
            // Strip any markdown code fences if present
            const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            result = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('Failed to parse Gemini response:', responseText);
            return { statusCode: 502, body: JSON.stringify({ error: 'Failed to parse AI response' }) };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        };

    } catch (err) {
        console.error('Synthesis function error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error', message: err.message })
        };
    }
}
