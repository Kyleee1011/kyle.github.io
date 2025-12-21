/* SERVER-SIDE CODE (Runs on Netlify)
   This is where we securely use the API Key.
*/

export const handler = async (event) => {
    // 1. Security: Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "No data received" }) };
        }
        
        const { message, context } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            console.error("Error: GEMINI_API_KEY is missing.");
            return { statusCode: 500, body: JSON.stringify({ error: "API Key missing" }) };
        }

        // 2. The "Solid" Model List (Tries these in order)
        // 1st: Standard 1.5 Flash (Fastest)
        // 2nd: Specific 1.5 Version (Often fixes "not found" errors)
        // 3rd: Gemini Pro 1.0 (The most compatible/reliable backup)
        const MODELS_TO_TRY = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-pro"
        ];

        let lastError = null;
        let successfulResponse = null;

        // 3. Loop through models until one works
        for (const model of MODELS_TO_TRY) {
            try {
                console.log(`Attempting to use model: ${model}`);
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: context + "\nUser: " + message + "\nAnswer:" }]
                        }]
                    })
                });

                const data = await response.json();

                // Check if Google returned an error
                if (!response.ok || data.error) {
                    throw new Error(data.error?.message || "Unknown API Error");
                }

                // If we get here, it worked!
                successfulResponse = data;
                console.log(`Success with model: ${model}`);
                break; // Stop looping

            } catch (err) {
                console.warn(`Failed with ${model}:`, err.message);
                lastError = err.message;
                // Continue to the next model in the list...
            }
        }

        // 4. Final Result Handling
        if (successfulResponse) {
            return {
                statusCode: 200,
                body: JSON.stringify(successfulResponse)
            };
        } else {
            console.error("All models failed. Last error:", lastError);
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: `System Busy: Unable to process request. (Details: ${lastError})` 
                })
            };
        }

    } catch (error) {
        console.error("Critical Backend Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};