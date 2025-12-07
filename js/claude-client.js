// Claude API Client - Handles communication with Anthropic API

const CLAUDE_API_URL = '/api/claude';

// Model selection - Sonnet for orchestration/validation, Haiku for component generation
const CLAUDE_SONNET = 'claude-sonnet-4-5';  // Sonnet 4.5 - Best for strategic thinking, planning, validation
const CLAUDE_HAIKU = 'claude-haiku-4-5-20251001';  // Haiku 4.5 - Fast, matches Sonnet 4 on coding, 4-5x faster than Sonnet 4.5

// Debug configuration - set to true to enable detailed logging
const DEBUG_API = true;

/**
 * Debug logger for API calls
 */
function debugLog(message, data) {
    if (!DEBUG_API) return;

    console.log(`[ClaudeClient] ${message}`, data !== undefined ? data : '');
}

/**
 * Call Claude API to generate landing page code
 * @param {string} apiKey - Anthropic API key
 * @param {string} systemPrompt - System prompt
 * @param {string} userPrompt - User prompt with specifications
 * @param {string} [model='sonnet'] - Model to use: 'sonnet' or 'haiku'
 * @returns {Promise<object>} Claude API response
 */
export async function callClaude(apiKey, systemPrompt, userPrompt, model = 'sonnet') {
    const selectedModel = model === 'haiku' ? CLAUDE_HAIKU : CLAUDE_SONNET;

    debugLog('=== CALLING CLAUDE API ===');
    debugLog('Model:', selectedModel);
    debugLog('Model type:', model);
    debugLog('System prompt length:', systemPrompt.length);
    debugLog('User prompt length:', userPrompt.length);

    const requestBody = {
        apiKey: apiKey,
        body: {
            model: selectedModel,
            max_tokens: 8192,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: userPrompt
                }
            ]
        }
    };

    debugLog('Request body structure:', JSON.stringify({
        ...requestBody,
        apiKey: '***REDACTED***'
    }, null, 2).substring(0, 500));

    const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    debugLog('Response status:', response.status);
    debugLog('Response ok:', response.ok);
    debugLog('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
        debugLog('ERROR: Response not ok');
        const errorBody = await response.json().catch(() => ({}));
        debugLog('Error body:', errorBody);
        throw new ClaudeApiError(response.status, errorBody);
    }

    const responseData = await response.json();

    debugLog('=== RAW API RESPONSE ===');
    debugLog('Response type:', typeof responseData);
    debugLog('Response is object:', responseData !== null && typeof responseData === 'object');
    debugLog('Response keys:', responseData ? Object.keys(responseData) : 'null');

    // Log the full structure without the actual content (which might be huge)
    const structurePreview = JSON.stringify(responseData, (key, value) => {
        if (key === 'text' && typeof value === 'string' && value.length > 200) {
            return `[TEXT CONTENT - ${value.length} chars] ${value.substring(0, 100)}...`;
        }
        return value;
    }, 2);

    debugLog('Response structure preview:', structurePreview.substring(0, 1000));

    // Log specific content details if available
    if (responseData.content && Array.isArray(responseData.content)) {
        debugLog('Content array length:', responseData.content.length);
        responseData.content.forEach((item, index) => {
            debugLog(`Content[${index}] type:`, item.type);
            if (item.text) {
                debugLog(`Content[${index}] text length:`, item.text.length);
                debugLog(`Content[${index}] text preview (first 200 chars):`, item.text.substring(0, 200));
                debugLog(`Content[${index}] text preview (last 200 chars):`, item.text.substring(Math.max(0, item.text.length - 200)));
            }
        });
    }

    debugLog('=== API CALL COMPLETE ===');

    return responseData;
}

/**
 * Test Claude API connection
 * @param {string} apiKey - Anthropic API key
 * @returns {Promise<object>} Result with success status and optional error
 */
export async function testClaudeConnection(apiKey) {
    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                body: {
                    model: CLAUDE_SONNET,
                    max_tokens: 10,
                    messages: [
                        {
                            role: 'user',
                            content: 'Hello'
                        }
                    ]
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
 * Custom error class for Claude API errors
 */
export class ClaudeApiError extends Error {
    constructor(status, errorBody) {
        let message = 'Claude API error';
        let recovery = 'Please try again';

        if (status === 401) {
            message = 'Invalid Anthropic API key';
            recovery = 'Please check your API key in Settings';
        } else if (status === 429) {
            message = 'Anthropic rate limit exceeded';
            recovery = 'Please wait a few minutes and try again';
        } else if (status === 400 && errorBody.error?.type === 'invalid_request_error') {
            message = 'Content policy violation';
            recovery = 'Your input may have triggered content filters. Please modify your description.';
        } else if (errorBody.error?.message) {
            message = errorBody.error.message;
        }

        super(message);
        this.name = 'ClaudeApiError';
        this.status = status;
        this.recovery = recovery;
        this.details = errorBody;
    }
}
