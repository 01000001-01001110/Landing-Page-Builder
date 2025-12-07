// Gemini API Client - Handles communication with Google Gemini API for image generation

const GEMINI_API_URL = '/api/gemini';

/**
 * Call Nano Banana (Gemini 2.5 Flash Image) API to generate image
 * @param {string} apiKey - Google AI API key
 * @param {string} imagePrompt - Image generation prompt
 * @returns {Promise<Blob>} Image blob (PNG)
 */
export async function callNanoBanana(apiKey, imagePrompt) {
    console.log('[NanoBanana] Starting image generation...');
    const startTime = Date.now();

    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: apiKey,
            body: {
                contents: [{
                    parts: [{ text: imagePrompt }]
                }],
                generationConfig: {
                    // Include both TEXT and IMAGE modalities as recommended by Google
                    responseModalities: ['TEXT', 'IMAGE']
                }
            }
        })
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[NanoBanana] API response received in ${elapsed}s`);

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new GeminiApiError(response.status, errorBody);
    }

    const data = await response.json();

    // Find the image part (there may be text parts too with TEXT+IMAGE modalities)
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(part => part.inlineData);
    const base64Data = imagePart?.inlineData?.data;

    if (!base64Data) {
        console.error('[NanoBanana] Response structure:', JSON.stringify(data, null, 2).substring(0, 500));
        throw new Error('No image data in response');
    }

    console.log(`[NanoBanana] ✅ Image generated successfully in ${elapsed}s`);

    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/png' });
}

/**
 * Test Gemini API connection
 * @param {string} apiKey - Google AI API key
 * @returns {Promise<object>} Result with success status and optional error
 */
export async function testGeminiConnection(apiKey) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                body: {
                    contents: [{
                        parts: [{ text: 'A simple test image of a blue circle' }]
                    }],
                    generationConfig: {
                        responseModalities: ['TEXT', 'IMAGE']
                    }
                }
            })
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            return {
                success: false,
                status: response.status,
                error: errorBody.error?.message || `HTTP ${response.status}`
            };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'Network error'
        };
    }
}

/**
 * Create a placeholder SVG image
 * @param {string} filename - Filename for the placeholder
 * @returns {Blob} SVG blob
 */
export function createPlaceholderImage(filename) {
    const svg = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <rect fill="#f0f0f0" width="100%" height="100%"/>
            <text x="50%" y="50%" text-anchor="middle" fill="#999" font-size="24" font-family="Arial, sans-serif">
                ${filename}
            </text>
            <text x="50%" y="55%" text-anchor="middle" fill="#999" font-size="14" font-family="Arial, sans-serif" dy="1em">
                Replace with your image
            </text>
        </svg>
    `;
    return new Blob([svg], { type: 'image/svg+xml' });
}

/**
 * Custom error class for Gemini API errors
 */
export class GeminiApiError extends Error {
    constructor(status, errorBody) {
        let message = 'Gemini API error';
        let recovery = 'Please try again';

        if (status === 401 || status === 403) {
            message = 'Invalid Google AI API key';
            recovery = 'Please check your API key in Settings';
        } else if (status === 429) {
            message = 'Google AI rate limit exceeded';
            recovery = 'Please wait a few minutes and try again';
        } else if (errorBody.error?.message) {
            message = errorBody.error.message;
        }

        super(message);
        this.name = 'GeminiApiError';
        this.status = status;
        this.recovery = recovery;
        this.details = errorBody;
    }
}
