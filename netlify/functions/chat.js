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
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            console.error("Error: GEMINI_API_KEY is missing in Netlify Environment Variables.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Server Configuration Error: API Key missing" })
            };
        }

        // 3. Define the Model
        // "gemini-1.5-flash" is the current standard. 
        // We removed "-latest" which was causing the 404 error.
        const MODEL_NAME = "gemini-1.5-flash";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

        // 4. Call Google Gemini API
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

        // 5. Error Handling & Debugging
        if (!response.ok) {
            console.error(`Google API Error (${MODEL_NAME}):`, JSON.stringify(data));
            
            // Helpful error message for the frontend
            let errorMsg = "AI Service Error";
            if (data.error && data.error.message) {
                errorMsg = `Google Error: ${data.error.message}`;
            }
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorMsg })
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