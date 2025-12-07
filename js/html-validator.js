// HTML Validator - Real validation checks for generated landing pages

import { callClaude } from './claude-client.js';

/**
 * Validation result structure
 */
export class ValidationResult {
    constructor() {
        this.passes = [];
        this.warnings = [];
        this.errors = [];
        this.score = 100;
    }

    addPass(message) {
        this.passes.push(message);
    }

    addWarning(message) {
        this.warnings.push(message);
        this.score -= 5;
    }

    addError(message) {
        this.errors.push(message);
        this.score -= 15;
    }

    get isValid() {
        return this.errors.length === 0;
    }

    get needsFixes() {
        return this.errors.length > 0 || this.warnings.length > 0;
    }
}

/**
 * Run all validation checks on generated output
 * @param {object} output - Generated output with html, css, images
 * @returns {ValidationResult} Validation results
 */
export function validateOutput(output) {
    const result = new ValidationResult();
    const { html, css, images } = output;

    // Parse HTML for validation
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Run all checks
    checkRequiredElements(doc, result);
    checkSectionIds(doc, result);
    checkNavigationLinks(doc, result);
    checkImageAltText(doc, result);
    checkImageReferences(doc, images, result);
    checkHeadingHierarchy(doc, result);
    checkAccessibility(doc, result);
    checkCSSVariables(css, result);

    // Ensure score doesn't go below 0
    result.score = Math.max(0, result.score);

    return result;
}

/**
 * Check for required page elements
 */
function checkRequiredElements(doc, result) {
    const requiredElements = [
        { selector: 'header, [id="header"]', name: 'Header' },
        { selector: 'main', name: 'Main content area' },
        { selector: 'footer, [id="footer"]', name: 'Footer' },
        { selector: 'h1', name: 'H1 heading' },
        { selector: 'nav, [role="navigation"]', name: 'Navigation' }
    ];

    let allPresent = true;
    for (const { selector, name } of requiredElements) {
        if (!doc.querySelector(selector)) {
            result.addError(`Missing required element: ${name}`);
            allPresent = false;
        }
    }

    if (allPresent) {
        result.addPass('All required page elements present');
    }
}

/**
 * Check that all section IDs exist per the contract
 */
function checkSectionIds(doc, result) {
    const requiredIds = ['hero', 'features', 'cta'];
    const optionalIds = ['testimonials', 'footer', 'header'];

    let missingRequired = [];
    for (const id of requiredIds) {
        if (!doc.getElementById(id)) {
            missingRequired.push(id);
        }
    }

    if (missingRequired.length > 0) {
        result.addError(`Missing required section IDs: ${missingRequired.join(', ')}`);
    } else {
        result.addPass('All required section IDs present (hero, features, cta)');
    }

    // Check optional IDs and warn if missing
    for (const id of optionalIds) {
        if (!doc.getElementById(id)) {
            result.addWarning(`Optional section ID missing: #${id}`);
        }
    }
}

/**
 * Check that navigation links point to existing sections
 */
function checkNavigationLinks(doc, result) {
    const navLinks = doc.querySelectorAll('nav a[href^="#"], header a[href^="#"]');
    let brokenLinks = [];
    let validLinks = 0;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1);
            if (!doc.getElementById(targetId)) {
                brokenLinks.push({ text: link.textContent.trim(), href });
            } else {
                validLinks++;
            }
        }
    });

    if (brokenLinks.length > 0) {
        const linkList = brokenLinks.map(l => `"${l.text}" -> ${l.href}`).join(', ');
        result.addError(`Broken navigation links: ${linkList}`);
    }

    if (validLinks > 0) {
        result.addPass(`${validLinks} navigation links correctly linked`);
    }
}

/**
 * Check all images have alt text
 */
function checkImageAltText(doc, result) {
    const images = doc.querySelectorAll('img');
    let missingAlt = 0;
    let emptyAlt = 0;

    images.forEach(img => {
        if (!img.hasAttribute('alt')) {
            missingAlt++;
        } else if (img.alt.trim() === '') {
            emptyAlt++;
        }
    });

    if (missingAlt > 0) {
        result.addError(`${missingAlt} image(s) missing alt attribute`);
    }
    if (emptyAlt > 0) {
        result.addWarning(`${emptyAlt} image(s) have empty alt text`);
    }
    if (missingAlt === 0 && emptyAlt === 0 && images.length > 0) {
        result.addPass(`All ${images.length} images have alt text`);
    }
}

/**
 * Check image references match generated images
 */
function checkImageReferences(doc, images, result) {
    const generatedFilenames = new Set(images.map(img => img.filename));
    const referencedImages = new Set();

    // Check img src attributes
    doc.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        const match = src.match(/images\/([^"'\s]+)/);
        if (match) {
            referencedImages.add(match[1]);
        }
    });

    // Check CSS background-image in style attributes
    doc.querySelectorAll('[style*="background"]').forEach(el => {
        const style = el.getAttribute('style') || '';
        const matches = style.matchAll(/images\/([^"'\s\)]+)/g);
        for (const match of matches) {
            referencedImages.add(match[1]);
        }
    });

    // Find missing images
    const missingImages = [];
    referencedImages.forEach(filename => {
        if (!generatedFilenames.has(filename)) {
            missingImages.push(filename);
        }
    });

    if (missingImages.length > 0) {
        result.addError(`Referenced images not generated: ${missingImages.join(', ')}`);
    } else if (referencedImages.size > 0) {
        result.addPass(`All ${referencedImages.size} image references valid`);
    }
}

/**
 * Check heading hierarchy (h1 -> h2 -> h3, no skipping)
 */
function checkHeadingHierarchy(doc, result) {
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    let skipped = false;

    headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1 && lastLevel > 0) {
            skipped = true;
        }
        lastLevel = level;
    });

    if (skipped) {
        result.addWarning('Heading hierarchy skips levels (e.g., h1 to h3)');
    } else if (headings.length > 0) {
        result.addPass('Heading hierarchy is correct');
    }

    // Check for multiple h1s
    const h1Count = doc.querySelectorAll('h1').length;
    if (h1Count > 1) {
        result.addWarning(`Multiple H1 headings found (${h1Count}). Best practice is one H1 per page.`);
    }
}

/**
 * Basic accessibility checks
 */
function checkAccessibility(doc, result) {
    let issues = 0;

    // Check for lang attribute on html
    const htmlEl = doc.querySelector('html');
    if (!htmlEl || !htmlEl.hasAttribute('lang')) {
        result.addWarning('Missing lang attribute on <html> element');
        issues++;
    }

    // Check for viewport meta
    const viewport = doc.querySelector('meta[name="viewport"]');
    if (!viewport) {
        result.addWarning('Missing viewport meta tag for responsive design');
        issues++;
    }

    // Check buttons/links have accessible text
    const emptyButtons = doc.querySelectorAll('button:empty, a:empty');
    if (emptyButtons.length > 0) {
        result.addWarning(`${emptyButtons.length} button(s) or link(s) have no text content`);
        issues++;
    }

    // Check form inputs have labels
    const inputs = doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])');
    let unlabeled = 0;
    inputs.forEach(input => {
        const id = input.id;
        if (!id || !doc.querySelector(`label[for="${id}"]`)) {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                unlabeled++;
            }
        }
    });
    if (unlabeled > 0) {
        result.addWarning(`${unlabeled} form input(s) missing labels`);
        issues++;
    }

    if (issues === 0) {
        result.addPass('Basic accessibility checks passed');
    }
}

/**
 * Check for undefined CSS variables
 */
function checkCSSVariables(css, result) {
    // Find all var() usages
    const varUsages = css.matchAll(/var\(--([^,\)]+)/g);
    const usedVars = new Set();
    for (const match of varUsages) {
        usedVars.add(match[1]);
    }

    // Find all defined variables
    const varDefs = css.matchAll(/--([^:]+):\s*[^;]+;/g);
    const definedVars = new Set();
    for (const match of varDefs) {
        definedVars.add(match[1].trim());
    }

    // Find undefined variables
    const undefinedVars = [];
    usedVars.forEach(v => {
        if (!definedVars.has(v)) {
            undefinedVars.push(v);
        }
    });

    if (undefinedVars.length > 0) {
        result.addWarning(`Undefined CSS variables: ${undefinedVars.slice(0, 5).join(', ')}${undefinedVars.length > 5 ? '...' : ''}`);
    } else if (usedVars.size > 0) {
        result.addPass(`All ${usedVars.size} CSS variables defined`);
    }
}

/**
 * Use Sonnet to fix validation errors
 * @param {object} output - Generated output
 * @param {ValidationResult} validation - Validation results
 * @param {string} apiKey - Anthropic API key
 * @returns {Promise<object>} Fixed output
 */
export async function autoFixValidation(output, validation, apiKey) {
    if (!validation.needsFixes) {
        return output;
    }

    console.log('[Validator] Sending to Sonnet for auto-fix...');

    const issuesList = [
        ...validation.errors.map(e => `ERROR: ${e}`),
        ...validation.warnings.map(w => `WARNING: ${w}`)
    ].join('\n');

    const systemPrompt = `You are an expert HTML/CSS debugger. Fix the validation issues in the provided HTML and CSS.

IMPORTANT RULES:
1. Only fix the specific issues listed - don't make other changes
2. Return the COMPLETE fixed HTML and CSS
3. Preserve all existing functionality and styling
4. For missing section IDs, add them to the appropriate elements
5. For broken navigation links, fix the href attributes
6. For missing alt text, add descriptive alt attributes
7. For accessibility issues, add the required attributes

Return ONLY valid JSON:
{
    "html": "<complete fixed HTML>",
    "css": "<complete fixed CSS>",
    "fixesSummary": ["<what was fixed>", ...]
}`;

    const userPrompt = `Fix these validation issues:

${issuesList}

CURRENT HTML:
${output.html}

CURRENT CSS:
${output.css}`;

    try {
        const response = await callClaude(apiKey, systemPrompt, userPrompt, 'sonnet');

        // Parse response - handle markdown wrapping
        let parsed;
        if (typeof response === 'string') {
            let jsonStr = response;
            // Remove markdown code blocks if present
            if (jsonStr.includes('```json')) {
                jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
            } else if (jsonStr.includes('```')) {
                jsonStr = jsonStr.replace(/```\s*/g, '');
            }
            parsed = JSON.parse(jsonStr.trim());
        } else {
            parsed = response;
        }

        console.log('[Validator] Fixes applied:', parsed.fixesSummary);

        return {
            ...output,
            html: parsed.html || output.html,
            css: parsed.css || output.css,
            autoFixed: true,
            fixesSummary: parsed.fixesSummary || []
        };
    } catch (error) {
        console.error('[Validator] Auto-fix failed:', error);
        return output;
    }
}
