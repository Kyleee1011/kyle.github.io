/* SERVER-SIDE CODE (Runs on Netlify)
   This is where we securely use the API Key.
*/

export const handler = async (event) => {
    // 1. Security: Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // 2. Parse the User's Input
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "No data received" }) };
        }
        
        const { message, context } = JSON.parse(event.body);

        // 3. Get the Secret API Key from Netlify Settings
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            console.error("Error: GEMINI_API_KEY is missing in Netlify Environment Variables.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Server Configuration Error: API Key missing" })
            };
        }

        // 4. Call Google Gemini API
        // FIX: Using 'gemini-1.5-flash-latest' which is often more stable for REST API calls
        // than the generic alias.
        const MODEL_NAME = "gemini-1.5-flash-latest";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: context + "\nUser: " + message + "\nAnswer:" }]
                }]
            })
        });

        const data = await response.json();

        // 5. Error Handling
        if (!response.ok) {
            console.error("Google API Error Details:", JSON.stringify(data));
            return {
                statusCode: response.status,
                body: JSON.stringify({ 
                    error: data.error?.message || "Google API request failed. Check logs." 
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Backend Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to connect to the AI server." })
        };
    }
};