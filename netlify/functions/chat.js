/* SERVER-SIDE CODE (chat.js) */

export const handler = async (event) => {
    // 1. Security Check
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "No data received" }) };
        }
        
        const { message, context } = JSON.parse(event.body);
        
        // 2. Get API Key & Clean it
        let API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) { 
            return { statusCode: 500, body: JSON.stringify({ error: "API Key Missing" }) };
        }
        API_KEY = API_KEY.trim();

        // 3. UPDATED MODEL: gemini-1.5-flash is retired (Sept 2025). 
        // We now use the stable gemini-2.5-flash
        const MODEL = "gemini-2.5-flash";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

        console.log("Attempting to connect to Google...");

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

        // 4. Detailed Error Handling
        if (!response.ok) {
            console.log("Full Google Error:", JSON.stringify(data)); // Check Netlify Logs for this!
            return {
                statusCode: response.status,
                body: JSON.stringify({ 
                    error: data.error?.message || `Google API Error (${response.status})`
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Server Crash:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};