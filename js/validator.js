// Code Validation Module
// Validates generated HTML, CSS, and JS against quality standards

/**
 * Validate generated code against quality checklist
 * @param {object} output - Generated output with html, css, js, imageManifest
 * @returns {object} Validation result with isValid flag and warnings/errors
 */
export function validateGeneratedCode(output) {
    const warnings = [];
    const errors = [];
    const passes = [];

    // Validate HTML
    const htmlValidation = validateHTML(output.html);
    warnings.push(...htmlValidation.warnings);
    errors.push(...htmlValidation.errors);
    passes.push(...htmlValidation.passes);

    // Validate CSS
    const cssValidation = validateCSS(output.css);
    warnings.push(...cssValidation.warnings);
    errors.push(...cssValidation.errors);
    passes.push(...cssValidation.passes);

    // Validate JS
    const jsValidation = validateJS(output.js);
    warnings.push(...jsValidation.warnings);
    errors.push(...jsValidation.errors);
    passes.push(...jsValidation.passes);

    // Validate Image Manifest
    const imageValidation = validateImageManifest(output.imageManifest);
    warnings.push(...imageValidation.warnings);
    errors.push(...imageValidation.errors);
    passes.push(...imageValidation.passes);

    return {
        isValid: errors.length === 0,
        score: calculateQualityScore(passes, warnings, errors),
        passes,
        warnings,
        errors
    };
}

/**
 * Validate HTML structure and content
 */
function validateHTML(html) {
    const warnings = [];
    const errors = [];
    const passes = [];

    // Check basic structure
    if (html.includes('<!DOCTYPE html>')) {
        passes.push('✓ Has DOCTYPE declaration');
    } else {
        errors.push('✗ Missing DOCTYPE declaration');
    }

    if (html.includes('<html')) {
        passes.push('✓ Has html tag');
    } else {
        errors.push('✗ Missing html tag');
    }

    // Check semantic elements
    const semanticElements = ['<header', '<nav', '<main', '<section', '<footer'];
    semanticElements.forEach(element => {
        if (html.includes(element)) {
            passes.push(`✓ Uses ${element} semantic element`);
        }
    });

    // Check for headings
    if (html.includes('<h1')) {
        passes.push('✓ Has h1 heading');
    } else {
        warnings.push('⚠ Missing h1 heading');
    }

    // Check for CSS link
    if (html.includes('css/styles.css') || html.includes('<style')) {
        passes.push('✓ Has CSS reference');
    } else {
        warnings.push('⚠ Missing CSS reference');
    }

    // Check for alt attributes on images
    const imgTags = html.match(/<img[^>]*>/g) || [];
    const imgsWithoutAlt = imgTags.filter(img => !img.includes('alt='));
    if (imgsWithoutAlt.length > 0) {
        warnings.push(`⚠ ${imgsWithoutAlt.length} images missing alt text`);
    } else if (imgTags.length > 0) {
        passes.push('✓ All images have alt text');
    }

    // Check for meta viewport
    if (html.includes('viewport')) {
        passes.push('✓ Has viewport meta tag');
    } else {
        warnings.push('⚠ Missing viewport meta tag');
    }

    return { warnings, errors, passes };
}

/**
 * Validate CSS structure and quality
 */
function validateCSS(css) {
    const warnings = [];
    const errors = [];
    const passes = [];

    // Check for CSS variables
    if (css.includes(':root') && css.includes('--')) {
        passes.push('✓ Uses CSS custom properties');
    } else {
        warnings.push('⚠ Not using CSS custom properties');
    }

    // Check for media queries (responsive)
    if (css.includes('@media')) {
        passes.push('✓ Has responsive media queries');
    } else {
        warnings.push('⚠ No media queries (may not be responsive)');
    }

    // Check CSS size
    const cssLines = css.split('\n').length;
    if (cssLines < 2000) {
        passes.push(`✓ CSS is concise (${cssLines} lines)`);
    } else {
        warnings.push(`⚠ CSS is very long (${cssLines} lines)`);
    }

    // Check for common properties
    if (css.includes('transition')) {
        passes.push('✓ Uses transitions for smooth interactions');
    }

    if (css.includes('flex') || css.includes('grid')) {
        passes.push('✓ Uses modern layout (Flexbox/Grid)');
    } else {
        warnings.push('⚠ May not be using modern layout techniques');
    }

    return { warnings, errors, passes };
}

/**
 * Validate JavaScript code
 */
function validateJS(js) {
    const warnings = [];
    const errors = [];
    const passes = [];

    if (!js || js.trim().length === 0) {
        passes.push('✓ No JavaScript (static page)');
        return { warnings, errors, passes };
    }

    // Basic syntax checks
    try {
        // Check for obvious syntax errors (not comprehensive)
        if (js.includes('function') || js.includes('=>')) {
            passes.push('✓ Contains function definitions');
        }

        // Check for event listeners
        if (js.includes('addEventListener')) {
            passes.push('✓ Uses event listeners');
        }

        // Check for modern JS
        if (js.includes('const') || js.includes('let')) {
            passes.push('✓ Uses modern JS (const/let)');
        } else if (js.includes('var')) {
            warnings.push('⚠ Uses var instead of const/let');
        }

        // Check for console.log (should be removed in production)
        if (js.includes('console.log')) {
            warnings.push('⚠ Contains console.log statements');
        }

    } catch (error) {
        errors.push(`✗ JavaScript syntax error: ${error.message}`);
    }

    return { warnings, errors, passes };
}

/**
 * Validate image manifest
 */
function validateImageManifest(imageManifest) {
    const warnings = [];
    const errors = [];
    const passes = [];

    if (!Array.isArray(imageManifest)) {
        errors.push('✗ Image manifest is not an array');
        return { warnings, errors, passes };
    }

    if (imageManifest.length >= 5 && imageManifest.length <= 7) {
        passes.push(`✓ Has ${imageManifest.length} images (optimal range)`);
    } else if (imageManifest.length < 5) {
        warnings.push(`⚠ Only ${imageManifest.length} images (recommended: 5-7)`);
    } else {
        warnings.push(`⚠ ${imageManifest.length} images (may be too many)`);
    }

    // Check each image
    imageManifest.forEach((img, index) => {
        if (!img.filename) {
            errors.push(`✗ Image ${index + 1} missing filename`);
        }
        if (!img.prompt) {
            errors.push(`✗ Image ${index + 1} missing prompt`);
        } else {
            const words = img.prompt.split(/\s+/).length;
            if (words >= 75 && words <= 150) {
                passes.push(`✓ Image ${index + 1} has detailed prompt (${words} words)`);
            } else if (words < 75) {
                warnings.push(`⚠ Image ${index + 1} prompt too short (${words} words, recommended: 75-150)`);
            } else {
                warnings.push(`⚠ Image ${index + 1} prompt too long (${words} words, recommended: 75-150)`);
            }
        }
    });

    return { warnings, errors, passes };
}

/**
 * Calculate overall quality score (0-100)
 */
function calculateQualityScore(passes, warnings, errors) {
    const passPoints = passes.length * 5;
    const warningPenalty = warnings.length * 2;
    const errorPenalty = errors.length * 10;

    const rawScore = passPoints - warningPenalty - errorPenalty;
    const score = Math.max(0, Math.min(100, rawScore));

    return Math.round(score);
}
