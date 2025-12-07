// Main Application Controller

import { ApiKeyManager } from './api-manager.js';
import { callClaude, testClaudeConnection } from './claude-client.js';
import { callNanoBanana, testGeminiConnection, createPlaceholderImage } from './gemini-client.js';
import { ENHANCED_SYSTEM_PROMPT, buildEnhancedPrompt } from './prompt-engineering.js';
import { parseClaudeResponse } from './response-parser.js';
import { renderPreview, clearPreview } from './preview-manager.js';
import { createZipDownload, triggerDownload } from './zip-builder.js';
import { validateGeneratedCode } from './validator.js';
import { validateOutput, autoFixValidation } from './html-validator.js';
import { predictImageManifest } from './image-prompt-predictor.js';
import { createExecutionPlan, executePlan } from './orchestrator.js';
import {
    initProgressiveRenderer,
    showIdleProgressView,
    handleTaskProgress,
    cleanup as cleanupProgressiveRenderer,
    updateGlobalStatus,
    setActivePhase,
    markPlanningComplete,
    markExecutionComplete,
    markAssemblyComplete,
    markValidationStart,
    markValidationComplete,
    markRenderingStart,
    markRenderingComplete,
    markAllComplete,
    setFeatureImageCount
} from './progressive-renderer.js';

// Application State
const state = {
    keys: {
        anthropic: null,
        google: null
    },
    output: {
        html: null,
        css: null,
        js: null,
        images: [],
        imageManifest: []
    },
    isGenerating: false
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize application
 */
function initializeApp() {
    // Load API keys from localStorage
    state.keys.anthropic = ApiKeyManager.get('anthropic');
    state.keys.google = ApiKeyManager.get('google');

    // Setup event listeners
    setupEventListeners();

    // Show idle progress view in preview area
    const previewFrame = document.getElementById('previewFrame');
    if (previewFrame) {
        showIdleProgressView(previewFrame);
    }

    // Show settings modal if keys are missing
    const hasKeys = ApiKeyManager.hasKeys();
    if (!hasKeys.anthropic || !hasKeys.google) {
        showSettingsModal();
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', showSettingsModal);

    // Modal close
    document.getElementById('closeModal').addEventListener('click', hideSettingsModal);

    // Save keys
    document.getElementById('saveKeysBtn').addEventListener('click', saveApiKeys);

    // Test connection
    document.getElementById('testConnectionBtn').addEventListener('click', testConnections);

    // Password toggle buttons
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');
            const input = document.getElementById(targetId);
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // Generate button click
    document.getElementById('generateBtn').addEventListener('click', handleGenerate);

    // Download button
    document.getElementById('downloadBtn').addEventListener('click', handleDownload);

    // Copy code button
    document.getElementById('copyCodeBtn').addEventListener('click', handleCopyCode);

    // Color picker preview updater
    const colorPicker = document.getElementById('primaryColor');
    const colorPreview = document.getElementById('colorPreview');
    if (colorPicker && colorPreview) {
        colorPicker.addEventListener('input', (e) => {
            colorPreview.textContent = e.target.value.toUpperCase();
        });
    }

    // View toggle buttons
    document.getElementById('progressViewBtn').addEventListener('click', () => switchView('progress'));
    document.getElementById('previewViewBtn').addEventListener('click', () => switchView('preview'));

    // Setup option description tooltips for dropdowns
    setupOptionTooltips();
}

/**
 * Setup tooltips that show descriptions for selected dropdown options
 */
function setupOptionTooltips() {
    const dropdowns = [
        { selectId: 'industry', tooltipId: 'industryTooltip' },
        { selectId: 'style', tooltipId: 'styleTooltip' },
        { selectId: 'imageStyle', tooltipId: 'imageStyleTooltip' }
    ];

    dropdowns.forEach(({ selectId, tooltipId }) => {
        const select = document.getElementById(selectId);
        const tooltip = document.getElementById(tooltipId);

        if (!select || !tooltip) return;

        // Show tooltip on change
        select.addEventListener('change', () => {
            updateOptionTooltip(select, tooltip);
        });

        // Show tooltip on focus (for keyboard users)
        select.addEventListener('focus', () => {
            updateOptionTooltip(select, tooltip);
        });

        // Hide tooltip when leaving
        select.addEventListener('blur', () => {
            tooltip.classList.remove('visible');
        });

        // Do NOT show tooltip on page load - only show on user interaction
    });

    // Add help text to tooltip triggers
    const tooltipHelp = {
        'industry': 'Select your business sector to tailor the page content and imagery',
        'style': 'Choose a visual design style that matches your brand personality',
        'imageStyle': 'Select how images will be generated for your page'
    };

    document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
        const tooltipType = trigger.dataset.tooltip;
        if (tooltipHelp[tooltipType]) {
            trigger.dataset.help = tooltipHelp[tooltipType];
        }
    });
}

/**
 * Update the option tooltip with the selected option's description
 */
function updateOptionTooltip(select, tooltip) {
    const selectedOption = select.options[select.selectedIndex];
    const description = selectedOption?.dataset?.desc;

    if (description) {
        // Parse description to extract "Best for:" part if present
        const bestForMatch = description.match(/Best for:\s*(.+)$/i);
        if (bestForMatch) {
            const mainDesc = description.replace(/\.\s*Best for:.+$/, '');
            tooltip.innerHTML = `${mainDesc}<span class="best-for">Best for: ${bestForMatch[1]}</span>`;
        } else {
            tooltip.textContent = description;
        }
        tooltip.classList.add('visible');
    } else {
        tooltip.classList.remove('visible');
    }
}

/**
 * Switch between progress and preview views
 * @param {string} view - 'progress' or 'preview'
 */
function switchView(view) {
    const progressFrame = document.getElementById('previewFrame');
    const livePreviewFrame = document.getElementById('livePreviewFrame');
    const placeholder = document.getElementById('previewPlaceholder');
    const progressBtn = document.getElementById('progressViewBtn');
    const previewBtn = document.getElementById('previewViewBtn');

    // Always hide placeholder when switching views during generation
    if (placeholder) {
        placeholder.classList.add('hidden');
    }

    if (view === 'progress') {
        progressFrame.classList.add('visible');
        livePreviewFrame.classList.remove('visible');
        progressBtn.classList.add('active');
        previewBtn.classList.remove('active');
    } else {
        progressFrame.classList.remove('visible');
        livePreviewFrame.classList.add('visible');
        progressBtn.classList.remove('active');
        previewBtn.classList.add('active');
    }
}

/**
 * Show settings modal
 */
function showSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'flex';

    // Populate current keys
    const anthropicKey = ApiKeyManager.get('anthropic');
    const googleKey = ApiKeyManager.get('google');

    if (anthropicKey) {
        document.getElementById('anthropicKey').value = anthropicKey;
    }
    if (googleKey) {
        document.getElementById('googleKey').value = googleKey;
    }
}

/**
 * Hide settings modal
 */
function hideSettingsModal() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = 'none';
}

/**
 * Save API keys
 */
function saveApiKeys() {
    const anthropicKey = document.getElementById('anthropicKey').value.trim();
    const googleKey = document.getElementById('googleKey').value.trim();

    if (anthropicKey) {
        ApiKeyManager.save('anthropic', anthropicKey);
        state.keys.anthropic = anthropicKey;
    }

    if (googleKey) {
        ApiKeyManager.save('google', googleKey);
        state.keys.google = googleKey;
    }

    hideSettingsModal();
    updateStatus('API keys saved');
}

/**
 * Test API connections
 */
async function testConnections() {
    const anthropicKey = document.getElementById('anthropicKey').value.trim();
    const googleKey = document.getElementById('googleKey').value.trim();

    updateStatus('Testing connections...');

    try {
        const results = [];

        if (anthropicKey) {
            const claudeResult = await testClaudeConnection(anthropicKey);
            if (claudeResult.success) {
                results.push('Anthropic: ✓ Connected');
            } else {
                results.push(`Anthropic: ✗ Failed - ${claudeResult.error || 'Unknown error'}`);
            }
        }

        if (googleKey) {
            const geminiResult = await testGeminiConnection(googleKey);
            if (geminiResult.success) {
                results.push('Google AI: ✓ Connected');
            } else {
                results.push(`Google AI: ✗ Failed - ${geminiResult.error || 'Unknown error'}`);
            }
        }

        alert(results.join('\n\n'));
        updateStatus('Ready');
    } catch (error) {
        alert('Connection test failed: ' + error.message);
        updateStatus('Ready');
    }
}

/**
 * Handle generate button click
 */
async function handleGenerate() {
    if (state.isGenerating) return;

    // Validate API keys
    if (!state.keys.anthropic || !state.keys.google) {
        showError({
            message: 'API keys required',
            recovery: 'Please configure your API keys in Settings'
        });
        return;
    }

    // Collect inputs
    const inputs = {
        companyName: document.getElementById('companyName').value,
        slogan: document.getElementById('slogan').value,
        description: document.getElementById('description').value,
        industry: document.getElementById('industry').value,
        style: document.getElementById('style').value,
        imageStyle: document.getElementById('imageStyle').value,
        primaryColor: document.getElementById('primaryColor').value,
        ctaText: document.getElementById('ctaText').value,
        includeTestimonials: document.getElementById('includeTestimonials').checked,
        featureCount: parseInt(document.getElementById('featureCount').value)
    };

    // Validate inputs before proceeding
    const validation = validateInputs(inputs);
    if (!validation.valid) {
        showError({
            message: 'Invalid Input',
            recovery: '• ' + validation.errors.join('<br>• ')
        });
        return;
    }

    state.isGenerating = true;
    showProgress();

    // Show view toggle and initialize both views
    document.getElementById('viewToggle').style.display = 'flex';
    switchView('progress');

    try {
        // Initialize progressive renderer for real-time task display
        updateProgress(1, 2, '🎨 Initializing preview...');
        const previewFrame = document.getElementById('previewFrame');
        await initProgressiveRenderer(previewFrame);
        console.log('[App] Progressive renderer ready!');

        // Initialize live preview with skeleton
        initLivePreview(inputs);

        // NEW ORCHESTRATED APPROACH: Break work into atomic tasks
        updateProgress(1, 5, '🎯 Creating execution plan...');

        const plan = createExecutionPlan(inputs);
        console.log('[App] Created execution plan with', plan.allTasks.length, 'tasks');
        console.log('[App] Plan GUID:', plan.guid);

        // Mark planning complete
        markPlanningComplete();

        // Set expected number of feature images for progress tracking
        setFeatureImageCount(inputs.featureCount);

        // Progress callback - simplified for 4 phases
        const onTaskProgress = (update) => {
            console.log('[App] Task update:', update);

            // Calculate progress percentage
            let percent = 0;
            if (update.phase) {
                percent = Math.min(90, update.phase * 22);
            }

            // Update status text
            const message = update.message || update.name || 'Processing...';
            updateGlobalStatus(message, percent);

            // Let the renderer handle phase detection
            handleTaskProgress(update);

            // Update live preview when components complete
            if (update.status === 'COMPLETE' && update.result && update.agent) {
                updateLivePreview(update);
            }
        };

        // Execute the plan with full parallelization and progressive rendering
        updateProgress(2, 10, '⚡ Starting orchestrated parallel generation...');
        const result = await executePlan(plan, state.keys, onTaskProgress);

        console.log('[App] Orchestration complete!', result);

        // Store results
        state.output.html = result.html;
        state.output.css = result.css;
        state.output.js = result.js;
        state.output.images = result.images;
        state.output.imageManifest = result.images.map(img => ({
            filename: img.filename,
            prompt: img.prompt
        }));
        state.output.designSystem = result.designSystem;
        state.output.guid = result.guid;

        // Step 3: Validate and auto-fix
        const validationStart = Date.now();
        markValidationStart();
        updateGlobalStatus('Validating generated code...', 85);

        // Run real validation
        let validation = validateOutput(state.output);
        console.log('[App] Initial validation:', validation);

        // Auto-fix if there are errors or warnings
        if (validation.needsFixes) {
            updateGlobalStatus('Auto-fixing validation issues...', 88);

            const fixedOutput = await autoFixValidation(state.output, validation, state.keys.anthropic);

            if (fixedOutput.autoFixed) {
                // Update output with fixes
                state.output.html = fixedOutput.html;
                state.output.css = fixedOutput.css;
                state.output.fixesSummary = fixedOutput.fixesSummary;

                // Re-validate
                validation = validateOutput(state.output);
                validation.passes.unshift(`Auto-fixed ${fixedOutput.fixesSummary.length} issue(s)`);
                console.log('[App] Post-fix validation:', validation);
            }
        }

        const validationDuration = ((Date.now() - validationStart) / 1000).toFixed(1);
        markValidationComplete(validationDuration);

        // Add generation stats to passes
        validation.passes.push(`Generated ${result.taskCount} components in ${result.totalTime}s`);
        state.output.validation = validation;

        // Step 4: Final render - use live preview iframe now
        updateGlobalStatus('Finalizing page...', 92);
        markRenderingStart();

        // Final render goes into the live preview frame
        renderFinalPreview(state.output);
        switchView('preview');
        markRenderingComplete();

        // Show validation results
        showValidationResults(state.output.validation);

        // Enable download buttons
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('copyCodeBtn').disabled = false;

        updateProgress(4, 100, '🎉 Complete! Orchestrated generation finished!');
        setTimeout(() => {
            hideProgress();
            updateStatus(`✨ Generated ${result.taskCount} components in ${result.totalTime}s using multi-model architecture!`);
        }, 1000);

    } catch (error) {
        console.error('Generation error:', error);
        hideProgress();
        showError(error);
        updateStatus('Error');
        // Clean up progressive renderer on error
        cleanupProgressiveRenderer();
    } finally {
        state.isGenerating = false;
    }
}

/**
 * Handle download button click
 */
async function handleDownload() {
    try {
        updateStatus('Creating ZIP file...');

        const companyName = document.getElementById('companyName').value;
        const zipBlob = await createZipDownload(state.output, companyName);

        const folderName = companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '') || 'landing-page';

        triggerDownload(zipBlob, `${folderName}.zip`);
        updateStatus('Download started!');
    } catch (error) {
        console.error('Download error:', error);
        showError({
            message: 'Download failed',
            recovery: error.message
        });
    }
}

/**
 * Handle copy code button click
 */
function handleCopyCode() {
    try {
        navigator.clipboard.writeText(state.output.html);
        updateStatus('HTML copied to clipboard!');
    } catch (error) {
        console.error('Copy error:', error);
        showError({
            message: 'Copy failed',
            recovery: 'Please try again'
        });
    }
}
/**
 * Show validation results
 */
function showValidationResults(validation) {
    const container = document.getElementById('validationResults');

    if (!validation) {
        container.style.display = 'none';
        return;
    }

    const scoreClass =
        validation.score >= 85 ? 'excellent' :
            validation.score >= 70 ? 'good' :
                validation.score >= 50 ? 'fair' : 'poor';

    const scoreLabel =
        validation.score >= 85 ? 'Excellent' :
            validation.score >= 70 ? 'Good' :
                validation.score >= 50 ? 'Fair' : 'Needs Work';

    container.innerHTML = `
        <div class="validation-score">
            <div class="score-badge ${scoreClass}">${validation.score}</div>
            <div>
                <h3 style="margin: 0; color: var(--text);">Code Quality: ${scoreLabel}</h3>
                <p style="margin: 0.25rem 0 0 0; color: var(--text-light); font-size: 0.9rem;">
                    ${validation.passes.length} checks passed, ${validation.warnings.length} warnings, ${validation.errors.length} errors
                </p>
            </div>
        </div>
        <div class="validation-details">
            ${validation.passes.length > 0 ? `
                <details class="validation-section">
                    <summary style="color: var(--success);">✓ Passed Checks (${validation.passes.length})</summary>
                    <ul class="validation-list validation-pass">
                        ${validation.passes.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </details>
            ` : ''}
            ${validation.warnings.length > 0 ? `
                <details class="validation-section" open>
                    <summary style="color: var(--warning);">⚠ Warnings (${validation.warnings.length})</summary>
                    <ul class="validation-list validation-warning">
                        ${validation.warnings.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </details>
            ` : ''}
            ${validation.errors.length > 0 ? `
                <details class="validation-section" open>
                    <summary style="color: var(--error);">✗ Errors (${validation.errors.length})</summary>
                    <ul class="validation-list validation-error">
                        ${validation.errors.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </details>
            ` : ''}
        </div>
    `;

    container.style.display = 'block';
}

/**
 * Validate user inputs before sending to API
 * @param {object} inputs - User form inputs
 * @returns {object} Validation result with valid flag and errors array
 */
function validateInputs(inputs) {
    const errors = [];

    // Required field: Company Name
    if (!inputs.companyName || inputs.companyName.trim().length === 0) {
        errors.push('Company name is required');
    } else if (inputs.companyName.trim().length < 2) {
        errors.push('Company name must be at least 2 characters');
    } else if (inputs.companyName.length > 100) {
        errors.push('Company name is too long (max 100 characters)');
    }

    // Required field: Slogan
    if (!inputs.slogan || inputs.slogan.trim().length === 0) {
        errors.push('Slogan is required');
    } else if (inputs.slogan.trim().length < 3) {
        errors.push('Slogan must be at least 3 characters');
    } else if (inputs.slogan.length > 200) {
        errors.push('Slogan is too long (max 200 characters)');
    }

    // Required field: Description
    if (!inputs.description || inputs.description.trim().length === 0) {
        errors.push('Description is required');
    } else if (inputs.description.trim().length < 10) {
        errors.push('Description must be at least 10 characters');
    } else if (inputs.description.length > 2000) {
        errors.push('Description is too long (max 2000 characters)');
    }

    // Validate hex color format
    if (inputs.primaryColor && !/^#[0-9A-F]{6}$/i.test(inputs.primaryColor)) {
        errors.push('Primary color must be in hex format (e.g., #3B82F6)');
    }

    // Validate CTA text
    if (inputs.ctaText && inputs.ctaText.length > 30) {
        errors.push('CTA button text is too long (max 30 characters)');
    }

    // Validate feature count
    if (isNaN(inputs.featureCount) || inputs.featureCount < 1 || inputs.featureCount > 10) {
        errors.push('Number of features must be between 1 and 10');
    }

    // Validate industry (must be one of the valid options)
    const validIndustries = [
        // Technology
        'tech', 'ai-ml', 'cybersecurity', 'cloud-services',
        // Professional Services
        'finance', 'legal', 'consulting', 'real-estate', 'accounting',
        // Healthcare & Wellness
        'healthcare', 'pharma', 'wellness', 'dental',
        // Consumer & Retail
        'ecommerce', 'retail', 'food-beverage', 'fashion', 'beauty',
        // Creative & Media
        'creative', 'media', 'photography', 'gaming',
        // Education & Non-Profit
        'education', 'nonprofit',
        // Industrial & Services
        'manufacturing', 'logistics', 'automotive', 'travel', 'energy',
        // Other
        'startup', 'other'
    ];
    if (!validIndustries.includes(inputs.industry)) {
        errors.push('Invalid industry selected');
    }

    // Validate style (must be one of the valid options)
    const validStyles = [
        // Professional
        'modern-minimal', 'corporate-trust', 'enterprise-pro',
        // Creative
        'bold-playful', 'artistic-craft', 'retro-vintage',
        // Modern
        'dark-sleek', 'gradient-glass', 'neo-brutalist',
        // Approachable
        'warm-friendly', 'nature-organic', 'soft-pastel'
    ];
    if (!validStyles.includes(inputs.style)) {
        errors.push('Invalid style selected');
    }

    // Validate image style (must be one of the valid options)
    const validImageStyles = [
        // Realistic
        'photorealistic', 'editorial-photo', 'product-studio',
        // Illustrated
        'illustrated', 'line-art', 'watercolor', 'isometric',
        // Digital Art
        '3d-render', 'abstract-geometric', 'flat-design', 'gradient-mesh', 'neon-glow',
        // Stylized
        'pixel-art', 'paper-cutout', 'claymation'
    ];
    if (!validImageStyles.includes(inputs.imageStyle)) {
        errors.push('Invalid image style selected');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Show error
 */
function showError(error) {
    const errorContainer = document.getElementById('errorContainer');

    // Enhanced error information for JSON parsing issues
    let debugInfo = '';
    if (error.message && error.message.includes('JSON')) {
        debugInfo = `
            <div class="debug-info">
                <h4>🔍 Debug Information</h4>
                <p>A JSON parsing error occurred. Check the browser console for detailed logs.</p>
                <p><strong>What to look for:</strong></p>
                <ul>
                    <li>Check console logs tagged with <code>[ClaudeClient]</code> for the raw API response</li>
                    <li>Check console logs tagged with <code>[ResponseParser]</code> for parsing details</li>
                    <li>Look for the actual text content that Claude returned</li>
                    <li>Check if Claude returned explanatory text instead of pure JSON</li>
                </ul>
                <p><strong>Common causes:</strong></p>
                <ul>
                    <li>Claude may have included explanatory text before or after the JSON</li>
                    <li>The JSON might be malformed or incomplete</li>
                    <li>Special characters in your input may have confused the model</li>
                </ul>
                <p><strong>Quick fixes to try:</strong></p>
                <ul>
                    <li>Simplify your company description and remove special characters</li>
                    <li>Try again - Claude's response can vary</li>
                    <li>Check the console logs to see what Claude actually returned</li>
                </ul>
            </div>
        `;
    }

    errorContainer.innerHTML = `
        <div class="error-card">
            <h3>❌ Error</h3>
            <p><strong>${error.message || 'An error occurred'}</strong></p>
            <p class="recovery">${error.recovery || 'Please try again'}</p>
            ${debugInfo}
            ${error.details ? `<details><summary>Technical Details</summary><pre>${JSON.stringify(error.details, null, 2)}</pre></details>` : ''}
            <button class="btn-primary" onclick="this.parentElement.parentElement.style.display='none'">Dismiss</button>
        </div>
    `;
    errorContainer.style.display = 'block';

    // Scroll to error
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Show progress indicator
 */
function showProgress() {
    // Metro Theme: Use preview container state if needed, but mainly we use the iframe now.
    // However, we might disable the generate button.
    document.getElementById('generateBtn').disabled = true;

    // We can also ensure the preview panel is visible or scrolled to
    document.querySelector('.preview-panel').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide progress indicator
 */
function hideProgress() {
    document.getElementById('generateBtn').disabled = false;
}

/**
 * Update progress (Legacy/Fallback)
 */
function updateProgress(step, percent, text) {
    // This function is kept for compatibility with existing calls.
    // In the new Metro theme, most progress updates go to the iframe via updateGlobalStatus.
    // But we still need this function defined to prevent ReferenceErrors.
    // We can update the status text in the main app if a specific element exists,
    // or just rely on the iframe.
    console.log(`[Progress] ${step}% - ${text}`);
}

/**
 * Update status text
 */
function updateStatus(text) {
    // Update a status element if it exists, or just log
    console.log(`[Status] ${text}`);

    // Optional: Update a toast or snackbar if we had one.
    // For now, we mainly use the progressive renderer.
}

/**
 * Live Preview State
 */
let livePreviewDocument = null;
let livePreviewReady = false;
let pendingUpdates = [];  // Queue for updates before iframe is ready
let livePreviewComponents = {
    designSystem: { colors: null, typography: null },
    components: {},
    images: {}
};

/**
 * Initialize live preview with skeleton HTML
 * @param {object} inputs - User inputs for page metadata
 */
function initLivePreview(inputs) {
    const livePreviewFrame = document.getElementById('livePreviewFrame');

    const skeletonHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${inputs.companyName} - ${inputs.slogan}</title>
    <style id="design-system-css">
        /* Design system styles will be injected here */
        :root {
            --primary: #3B82F6;
            --secondary: #60A5FA;
            --text: #111827;
            --text-muted: #6B7280;
            --bg: #FFFFFF;
            --bg-surface: #F9FAFB;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); }
    </style>
    <style id="component-css">
        /* Component styles will be injected here */
        .skeleton { background: #e5e7eb; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .component-placeholder {
            padding: 4rem 2rem;
            text-align: center;
            background: var(--bg-surface);
            border-bottom: 1px solid #e5e7eb;
        }
        .component-placeholder h3 { color: var(--text-muted); font-weight: 400; }
    </style>
</head>
<body>
    <div id="component-header">
        <div class="component-placeholder"><h3>Header loading...</h3></div>
    </div>
    <main>
        <div id="component-hero">
            <div class="component-placeholder" style="min-height: 60vh;">
                <h3>Hero section loading...</h3>
            </div>
        </div>
        <div id="component-features">
            <div class="component-placeholder"><h3>Features section loading...</h3></div>
        </div>
        <div id="component-testimonials">
            <div class="component-placeholder"><h3>Testimonials section loading...</h3></div>
        </div>
        <div id="component-cta">
            <div class="component-placeholder"><h3>Call-to-action loading...</h3></div>
        </div>
    </main>
    <div id="component-footer">
        <div class="component-placeholder"><h3>Footer loading...</h3></div>
    </div>
</body>
</html>`;

    const blob = new Blob([skeletonHTML], { type: 'text/html' });
    livePreviewFrame.src = URL.createObjectURL(blob);

    // Make the iframe ready to be shown (but not visible until user switches to Preview)
    livePreviewFrame.style.display = '';  // Remove inline display:none

    livePreviewFrame.onload = () => {
        livePreviewDocument = livePreviewFrame.contentDocument || livePreviewFrame.contentWindow.document;
        livePreviewReady = true;
        console.log('[LivePreview] Skeleton loaded and ready');

        // Process any queued updates
        if (pendingUpdates.length > 0) {
            console.log(`[LivePreview] Processing ${pendingUpdates.length} queued updates`);
            pendingUpdates.forEach(update => applyLivePreviewUpdate(update));
            pendingUpdates = [];
        }
    };

    // Reset state
    livePreviewReady = false;
    pendingUpdates = [];
    livePreviewComponents = {
        designSystem: { colors: null, typography: null },
        components: {},
        images: {}
    };
}

/**
 * Update live preview when a component completes
 * @param {object} update - Task update with result
 */
function updateLivePreview(update) {
    // Always store in cache first
    const { taskType, agent, result } = update;

    if (agent === 'design-system') {
        livePreviewComponents.designSystem[taskType] = result;
    } else if (agent === 'component-builder' && result) {
        livePreviewComponents.components[taskType] = result;
    } else if (agent === 'image-generator' && result) {
        livePreviewComponents.images[result.filename] = result;
    }

    // If iframe not ready, queue the update
    if (!livePreviewReady || !livePreviewDocument) {
        console.log(`[LivePreview] Queuing update: ${agent}/${taskType}`);
        pendingUpdates.push(update);
        return;
    }

    // Apply immediately if ready
    applyLivePreviewUpdate(update);
}

/**
 * Apply a single update to the live preview DOM
 * @param {object} update - Task update with result
 */
function applyLivePreviewUpdate(update) {
    const { taskType, agent, result } = update;

    if (agent === 'design-system') {
        // Update CSS variables when we have colors
        if (taskType === 'colors' && result) {
            const styleEl = livePreviewDocument.getElementById('design-system-css');
            if (styleEl) {
                styleEl.textContent = `
                    :root {
                        --primary: ${result.primary || '#3B82F6'};
                        --secondary: ${result.secondary || '#60A5FA'};
                        --accent: ${result.accent || '#F59E0B'};
                        --text: ${result.neutral?.['900'] || '#111827'};
                        --text-muted: ${result.neutral?.['500'] || '#6B7280'};
                        --bg: ${result.neutral?.['50'] || '#FFFFFF'};
                        --bg-surface: ${result.neutral?.['100'] || '#F9FAFB'};
                    }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); }
                `;
                console.log('[LivePreview] Applied color palette');
            }
        }
    } else if (agent === 'component-builder' && result) {
        // Replace placeholder with actual component
        const containerId = `component-${taskType}`;
        const container = livePreviewDocument.getElementById(containerId);

        if (container && result.html) {
            container.innerHTML = result.html;

            // Add component CSS
            if (result.css) {
                const componentStyle = livePreviewDocument.getElementById('component-css');
                if (componentStyle) {
                    componentStyle.textContent += '\n\n/* ' + taskType + ' */\n' + result.css;
                }
            }
            console.log(`[LivePreview] Rendered ${taskType} component`);
        }
    } else if (agent === 'image-generator' && result) {
        // Update any img tags that reference this image
        const blobUrl = URL.createObjectURL(result.blob);
        const imagePath = `images/${result.filename}`;

        // Replace in img src attributes
        const imgs = livePreviewDocument.querySelectorAll('img');
        imgs.forEach(img => {
            if (img.src.includes(result.filename) || img.src.includes(imagePath)) {
                img.src = blobUrl;
            }
        });

        // Replace in inline style attributes (background-image)
        const allElements = livePreviewDocument.querySelectorAll('*');
        allElements.forEach(el => {
            const style = el.getAttribute('style');
            if (style && (style.includes(result.filename) || style.includes(imagePath))) {
                el.style.backgroundImage = `url(${blobUrl})`;
            }
        });

        // Replace in CSS stylesheets
        const styleSheets = livePreviewDocument.querySelectorAll('style');
        styleSheets.forEach(styleEl => {
            if (styleEl.textContent.includes(result.filename) || styleEl.textContent.includes(imagePath)) {
                styleEl.textContent = styleEl.textContent
                    .split(result.filename).join(blobUrl)
                    .split(imagePath).join(blobUrl);
            }
        });

        console.log(`[LivePreview] Applied image ${result.filename} to HTML, styles, and CSS`);
    }
}

/**
 * Render final preview with all components and images
 * @param {object} output - Complete generated output
 */
function renderFinalPreview(output) {
    const livePreviewFrame = document.getElementById('livePreviewFrame');

    // Track blob URLs for cleanup
    const blobUrls = [];

    // Create blob URLs for each image
    const imageUrlMap = {};
    for (const image of output.images) {
        const blobUrl = URL.createObjectURL(image.blob);
        blobUrls.push(blobUrl);
        imageUrlMap[`images/${image.filename}`] = blobUrl;
    }

    // Helper to escape regex special characters
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Replace image paths with blob URLs in HTML
    let previewHtml = output.html;
    for (const [path, blobUrl] of Object.entries(imageUrlMap)) {
        const escapedPath = escapeRegex(path);
        previewHtml = previewHtml.replace(new RegExp(escapedPath, 'g'), blobUrl);
    }

    // Replace image paths in CSS too (for background-image etc.)
    let previewCss = output.css;
    for (const [path, blobUrl] of Object.entries(imageUrlMap)) {
        const escapedPath = escapeRegex(path);
        previewCss = previewCss.replace(new RegExp(escapedPath, 'g'), blobUrl);
    }

    // Inject CSS inline (with image paths replaced)
    const cssStyleTag = '<style>' + previewCss + '</style>';
    if (previewHtml.match(/<link[^>]*href=["']css\/styles\.css["'][^>]*>/gi)) {
        previewHtml = previewHtml.replace(
            /<link[^>]*href=["']css\/styles\.css["'][^>]*>/gi,
            cssStyleTag
        );
    } else if (previewHtml.match(/<\/head>/i)) {
        previewHtml = previewHtml.replace(/<\/head>/i, cssStyleTag + '\n</head>');
    }

    // Inject JS inline
    const jsScriptTag = output.js ? '<script>' + output.js + '<\/script>' : '';
    if (previewHtml.match(/<script[^>]*src=["']js\/main\.js["'][^>]*><\/script>/gi)) {
        previewHtml = previewHtml.replace(
            /<script[^>]*src=["']js\/main\.js["'][^>]*><\/script>/gi,
            jsScriptTag
        );
    } else if (jsScriptTag && previewHtml.match(/<\/body>/i)) {
        previewHtml = previewHtml.replace(/<\/body>/i, jsScriptTag + '\n</body>');
    }

    // Create blob URL for the complete HTML
    const htmlBlob = new Blob([previewHtml], { type: 'text/html' });
    const previewUrl = URL.createObjectURL(htmlBlob);
    blobUrls.push(previewUrl);

    // Load into iframe
    livePreviewFrame.src = previewUrl;
    livePreviewFrame.classList.add('visible');

    console.log(`[LivePreview] Final render complete with ${output.images.length} images`);
}
