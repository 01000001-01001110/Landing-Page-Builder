// Response Parser - Parses Claude API responses

// Debug configuration - set to true to enable detailed logging
const DEBUG_PARSING = true;

/**
 * Debug logger for response parsing
 */
function debugLog(message, data) {
    if (!DEBUG_PARSING) return;

    console.log(`[ResponseParser] ${message}`, data !== undefined ? data : '');
}

/**
 * Get character codes for debugging invisible characters
 */
function getCharCodes(str, count = 10) {
    if (!str) return '';
    const chars = str.substring(0, count);
    return chars.split('').map((c, i) => `[${i}]='${c}'(${c.charCodeAt(0)})`).join(' ');
}

/**
 * Parse Claude API response to extract code and image manifest
 * @param {object} claudeResponse - Raw response from Claude API
 * @returns {object} Parsed output with html, css, js, and imageManifest
 */
export function parseClaudeResponse(claudeResponse) {
    debugLog('=== PARSING CLAUDE RESPONSE ===');
    debugLog('Response type:', typeof claudeResponse);
    debugLog('Response is object:', claudeResponse !== null && typeof claudeResponse === 'object');
    debugLog('Response keys:', claudeResponse ? Object.keys(claudeResponse) : 'null');

    // Log the full structure of the response
    debugLog('Full response structure:', JSON.stringify(claudeResponse, null, 2).substring(0, 500));

    // Extract text content from response
    const textContent = claudeResponse.content?.[0]?.text;

    if (!textContent) {
        debugLog('ERROR: No text content found');
        debugLog('claudeResponse.content:', claudeResponse.content);
        debugLog('claudeResponse.content?.[0]:', claudeResponse.content?.[0]);
        throw new Error('No text content in Claude response');
    }

    debugLog('Text content extracted successfully');
    debugLog('Text content type:', typeof textContent);
    debugLog('Text content length:', textContent.length);
    debugLog('Text content first 500 chars:', textContent.substring(0, 500));
    debugLog('Text content last 200 chars:', textContent.substring(Math.max(0, textContent.length - 200)));
    debugLog('First 10 char codes:', getCharCodes(textContent, 10));
    debugLog('Last 10 char codes:', getCharCodes(textContent.substring(textContent.length - 10), 10));

    // Try to parse as JSON with multiple strategies
    let parsedData;

    // Strategy 1: Direct parse
    debugLog('--- Strategy 1: Direct JSON parse ---');
    try {
        parsedData = JSON.parse(textContent);
        debugLog('SUCCESS: Direct parse worked!');
    } catch (error1) {
        debugLog('FAILED: Direct parse error:', error1.message);
        debugLog('Error at position:', error1.message.match(/position (\d+)/)?.[1] || 'unknown');

        // Strategy 2: Extract content from markdown code blocks (IMPROVED)
        debugLog('--- Strategy 2: Extract from markdown fences ---');
        try {
            let cleanedText = textContent;

            // Try to extract content between markdown fences using capture group
            // This handles: ```json\n{...}\n```, ```\n{...}\n```, with any whitespace variations
            const fencePattern = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/i;
            const fenceMatch = cleanedText.match(fencePattern);

            if (fenceMatch && fenceMatch[1]) {
                // Found markdown fence, extract content between fences
                cleanedText = fenceMatch[1].trim();
                debugLog('Extracted from markdown fence, length:', cleanedText.length);
            } else {
                debugLog('No markdown fence found, trying aggressive cleanup');

                // No markdown fence found, try aggressive cleanup
                // Remove any text before first { (handles preamble text)
                const beforeClean = cleanedText;
                cleanedText = cleanedText.replace(/^[^{]*/, '');
                debugLog('Removed prefix, chars removed:', beforeClean.length - cleanedText.length);

                // Remove any text after last } (handles trailing text)
                const afterFirstClean = cleanedText;
                cleanedText = cleanedText.replace(/[^}]*$/, '');
                debugLog('Removed suffix, chars removed:', afterFirstClean.length - cleanedText.length);
            }

            // Final cleanup
            cleanedText = cleanedText.trim();

            debugLog('After cleaning:');
            debugLog('  - Length:', cleanedText.length);
            debugLog('  - First 100 chars:', cleanedText.substring(0, 100));
            debugLog('  - Last 100 chars:', cleanedText.substring(Math.max(0, cleanedText.length - 100)));
            debugLog('  - First char code:', getCharCodes(cleanedText, 1));
            debugLog('  - Last char code:', getCharCodes(cleanedText.substring(cleanedText.length - 1), 1));

            parsedData = JSON.parse(cleanedText);
            debugLog('SUCCESS: Markdown extraction parse worked!');
        } catch (error2) {
            debugLog('FAILED: Markdown removal parse error:', error2.message);
            debugLog('Error at position:', error2.message.match(/position (\d+)/)?.[1] || 'unknown');

            // Strategy 3: Extract JSON object (find outermost { })
            debugLog('--- Strategy 3: Extract JSON object by braces ---');
            try {
                const firstBrace = textContent.indexOf('{');
                const lastBrace = textContent.lastIndexOf('}');

                debugLog('First brace position:', firstBrace);
                debugLog('Last brace position:', lastBrace);

                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    const jsonString = textContent.substring(firstBrace, lastBrace + 1);
                    debugLog('Extracted JSON length:', jsonString.length);
                    debugLog('Extracted JSON first 100 chars:', jsonString.substring(0, 100));
                    debugLog('Extracted JSON last 100 chars:', jsonString.substring(Math.max(0, jsonString.length - 100)));

                    parsedData = JSON.parse(jsonString);
                    debugLog('SUCCESS: Brace extraction parse worked!');
                } else {
                    debugLog('FAILED: No valid braces found in text');
                    throw new Error('No JSON object found in response');
                }
            } catch (error3) {
                debugLog('FAILED: Brace extraction parse error:', error3.message);

                // All strategies failed - log comprehensive error
                console.error('\n========================================');
                console.error('PARSING FAILED - ALL STRATEGIES EXHAUSTED');
                console.error('========================================');
                console.error('Raw response (first 1000 chars):', textContent.substring(0, 1000));
                console.error('Raw response (last 500 chars):', textContent.substring(Math.max(0, textContent.length - 500)));
                console.error('\nError Details:');
                console.error('  Strategy 1 (direct):', error1.message);
                console.error('  Strategy 2 (markdown removal):', error2.message);
                console.error('  Strategy 3 (extraction):', error3.message);
                console.error('\nText Analysis:');
                console.error('  Total length:', textContent.length);
                console.error('  Starts with {:', textContent.trim().startsWith('{'));
                console.error('  Ends with }:', textContent.trim().endsWith('}'));
                console.error('  Contains "html":', textContent.includes('"html"'));
                console.error('  Contains "css":', textContent.includes('"css"'));
                console.error('  Contains markdown fence:', textContent.includes('```'));
                console.error('========================================\n');

                throw new Error('Claude generated invalid JSON. The response may contain explanatory text instead of pure JSON. Please try again.');
            }
        }
    }

    debugLog('--- Validating parsed data ---');
    debugLog('Parsed data keys:', Object.keys(parsedData));

    // Validate required fields
    if (!parsedData.html) {
        debugLog('ERROR: Missing HTML field');
        debugLog('Available fields:', Object.keys(parsedData));
        throw new Error('Missing HTML in Claude response');
    }
    debugLog('HTML field present, length:', parsedData.html.length);

    if (!parsedData.css) {
        debugLog('ERROR: Missing CSS field');
        debugLog('Available fields:', Object.keys(parsedData));
        throw new Error('Missing CSS in Claude response');
    }
    debugLog('CSS field present, length:', parsedData.css.length);

    if (!parsedData.js) {
        debugLog('JS field missing, setting to empty string');
        parsedData.js = ''; // JS is optional
    } else {
        debugLog('JS field present, length:', parsedData.js.length);
    }

    if (!parsedData.imageManifest || !Array.isArray(parsedData.imageManifest)) {
        debugLog('ERROR: Invalid imageManifest');
        debugLog('imageManifest type:', typeof parsedData.imageManifest);
        debugLog('imageManifest is array:', Array.isArray(parsedData.imageManifest));
        throw new Error('Missing or invalid imageManifest in Claude response');
    }
    debugLog('imageManifest present, count:', parsedData.imageManifest.length);

    // Validate image manifest entries
    parsedData.imageManifest.forEach((img, index) => {
        if (!img.filename) {
            debugLog(`ERROR: Image ${index} missing filename`);
            throw new Error(`Image ${index} missing filename`);
        }
        if (!img.prompt) {
            debugLog(`ERROR: Image ${index} missing prompt`);
            throw new Error(`Image ${index} missing prompt`);
        }
        debugLog(`Image ${index} valid:`, { filename: img.filename, promptLength: img.prompt.length });
    });

    debugLog('=== PARSING COMPLETE - SUCCESS ===');
    debugLog('Returning validated data');

    return {
        html: parsedData.html,
        css: parsedData.css,
        js: parsedData.js,
        imageManifest: parsedData.imageManifest
    };
}

/**
 * Parse API response for orchestrator tasks (simpler version)
 * Used for colors, typography, components, etc. - just extracts JSON
 * @param {object} response - Claude API response
 * @param {string} taskName - Name of task for logging
 * @returns {object} Parsed JSON object
 */
export function parseApiResponse(response, taskName = 'unknown') {
    debugLog(`=== PARSING API RESPONSE: ${taskName} ===`);

    // Extract text content from response
    const textContent = response.content?.[0]?.text;

    if (!textContent) {
        console.error(`[ResponseParser] No text content in ${taskName} response`);
        throw new Error(`No text content in ${taskName} response`);
    }

    debugLog(`Text content length: ${textContent.length}`);

    let parsedData;

    // Strategy 1: Direct parse
    try {
        parsedData = JSON.parse(textContent);
        debugLog(`✅ Direct parse succeeded for ${taskName}`);
        return parsedData;
    } catch (error1) {
        debugLog(`Strategy 1 failed: ${error1.message}`);
    }

    // Strategy 2: Extract from markdown code blocks
    try {
        let cleanedText = textContent;

        const fencePattern = /```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/i;
        const fenceMatch = cleanedText.match(fencePattern);

        if (fenceMatch && fenceMatch[1]) {
            cleanedText = fenceMatch[1].trim();
        } else {
            // Remove text before first { and after last }
            cleanedText = cleanedText.replace(/^[^{]*/, '');
            cleanedText = cleanedText.replace(/[^}]*$/, '');
        }

        parsedData = JSON.parse(cleanedText.trim());
        debugLog(`✅ Markdown extraction succeeded for ${taskName}`);
        return parsedData;
    } catch (error2) {
        debugLog(`Strategy 2 failed: ${error2.message}`);
    }

    // Strategy 3: Extract JSON object by braces
    try {
        const firstBrace = textContent.indexOf('{');
        const lastBrace = textContent.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonString = textContent.substring(firstBrace, lastBrace + 1);
            parsedData = JSON.parse(jsonString);
            debugLog(`✅ Brace extraction succeeded for ${taskName}`);
            return parsedData;
        }
    } catch (error3) {
        debugLog(`Strategy 3 failed: ${error3.message}`);
    }

    // All strategies failed
    console.error(`\n❌ PARSING FAILED FOR ${taskName}`);
    console.error('Response preview:', textContent.substring(0, 500));
    throw new Error(`Failed to parse JSON from ${taskName} response. Claude may have returned invalid JSON.`);
}
