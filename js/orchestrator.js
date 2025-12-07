// Orchestrator - Manages distributed landing page generation
// Breaks work into atomic tasks and executes them in parallel
//
// Multi-Model Architecture:
// - Sonnet 4.5: Planning, orchestration, design system, assembly, validation
// - Haiku 4.5: Component generation (matches Sonnet 4 on coding, 4-5x faster)
//
// Progressive Rendering:
// - Components populate in preview as they complete
// - User sees page build in real-time

import { callClaude } from './claude-client.js';
import { callNanoBanana, createPlaceholderImage } from './gemini-client.js';
import { getStyleConfig, generateCSSVariables, getComponentRules } from './style-matrix.js';
import { parseApiResponse } from './response-parser.js';

/**
 * Generate unique GUID for this generation
 * @returns {string} GUID
 */
export function generateGuid() {
    return 'gen-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Create execution plan from user inputs
 * @param {object} inputs - User form inputs
 * @returns {object} Execution plan with task breakdown
 */
export function createExecutionPlan(inputs) {
    const guid = generateGuid();

    const plan = {
        guid,
        created: new Date().toISOString(),
        status: 'PENDING',
        inputs,

        // Phase 1: Design System (Critical path - everything depends on this)
        phase1_designSystem: [
            {
                id: 'task-1.1',
                name: 'Color Palette',
                agent: 'design-system',
                type: 'colors',
                dependencies: [],
                status: 'PENDING'
            },
            {
                id: 'task-1.2',
                name: 'Typography',
                agent: 'design-system',
                type: 'typography',
                dependencies: [],
                status: 'PENDING'
            }
        ],

        // Phase 2: Components (Parallel after Phase 1)
        phase2_components: [
            {
                id: 'task-2.1',
                name: 'Header Component',
                agent: 'component-builder',
                type: 'header',
                dependencies: ['task-1.1', 'task-1.2'],
                status: 'PENDING'
            },
            {
                id: 'task-2.2',
                name: 'Hero Section',
                agent: 'component-builder',
                type: 'hero',
                dependencies: ['task-1.1', 'task-1.2', 'task-3.1'], // Needs hero image
                status: 'PENDING'
            },
            {
                id: 'task-2.3',
                name: 'Features Section',
                agent: 'component-builder',
                type: 'features',
                dependencies: ['task-1.1', 'task-1.2', 'task-3.2', 'task-3.3', 'task-3.4'], // Needs feature images
                status: 'PENDING'
            },
            {
                id: 'task-2.4',
                name: 'Testimonials Section',
                agent: 'component-builder',
                type: 'testimonials',
                dependencies: ['task-1.1', 'task-1.2'],
                status: 'PENDING',
                optional: !inputs.includeTestimonials
            },
            {
                id: 'task-2.5',
                name: 'CTA Section',
                agent: 'component-builder',
                type: 'cta',
                dependencies: ['task-1.1', 'task-1.2'],
                status: 'PENDING'
            },
            {
                id: 'task-2.6',
                name: 'Footer',
                agent: 'component-builder',
                type: 'footer',
                dependencies: ['task-1.1', 'task-1.2'],
                status: 'PENDING'
            }
        ],

        // Phase 3: Images (Parallel with Phase 2, only needs Phase 1)
        phase3_images: [
            {
                id: 'task-3.1',
                name: 'Hero Image',
                agent: 'image-generator',
                type: 'hero',
                dependencies: ['task-1.1'], // Needs color palette
                status: 'PENDING'
            },
            ...Array.from({ length: inputs.featureCount }, (_, i) => ({
                id: `task-3.${i + 2}`,
                name: `Feature Icon ${i + 1}`,
                agent: 'image-generator',
                type: `feature-${i + 1}`,
                dependencies: ['task-1.1'],
                status: 'PENDING'
            }))
        ],

        // Phase 4: Assembly (After all phases 2 & 3)
        phase4_assembly: [
            {
                id: 'task-4.1',
                name: 'Assemble HTML',
                agent: 'assembler',
                type: 'html',
                dependencies: ['task-2.1', 'task-2.2', 'task-2.3', 'task-2.4', 'task-2.5', 'task-2.6'],
                status: 'PENDING'
            },
            {
                id: 'task-4.2',
                name: 'Merge CSS',
                agent: 'assembler',
                type: 'css',
                dependencies: ['task-4.1'],
                status: 'PENDING'
            },
            {
                id: 'task-4.3',
                name: 'Bundle JavaScript',
                agent: 'assembler',
                type: 'js',
                dependencies: ['task-4.2'],
                status: 'PENDING'
            }
        ]
    };

    // Flatten all tasks for easy access
    plan.allTasks = [
        ...plan.phase1_designSystem,
        ...plan.phase2_components.filter(t => !t.optional),
        ...plan.phase3_images,
        ...plan.phase4_assembly
    ];

    return plan;
}

/**
 * Execute plan with parallel task execution
 * @param {object} plan - Execution plan
 * @param {object} apiKeys - API keys
 * @param {function} onProgress - Progress callback
 * @returns {Promise<object>} Generated landing page
 */
export async function executePlan(plan, apiKeys, onProgress) {
    const results = {}; // Store task results by ID
    const startTime = Date.now();

    try {
        // Phase 0: Enhance Description (preprocessing)
        onProgress({ phase: 0, message: 'Enhancing content...' });
        onProgress({
            task: 'task-0.1',
            status: 'IN_PROGRESS',
            message: 'Enhancing Content',
            taskType: 'content-enhancement',
            agent: 'content-writer',
            name: 'Content Enhancement'
        });
        const enhanceStart = Date.now();
        const enhancedDescription = await enhanceDescription(plan.inputs, apiKeys);
        plan.inputs.enhancedDescription = enhancedDescription;
        const enhanceDuration = ((Date.now() - enhanceStart) / 1000).toFixed(1);
        onProgress({
            task: 'task-0.1',
            status: 'COMPLETE',
            duration: enhanceDuration,
            taskType: 'content-enhancement',
            agent: 'content-writer',
            name: 'Content Enhancement'
        });
        console.log('[Orchestrator] ✅ Description enhanced in ' + enhanceDuration + 's');

        // Phase 1: Design System (all tasks in parallel)
        onProgress({ phase: 1, message: 'Generating design system...' });
        const phase1Results = await Promise.all(
            plan.phase1_designSystem.map(task =>
                executeTask(task, results, apiKeys, plan.inputs, onProgress)
            )
        );
        phase1Results.forEach((result, i) => {
            results[plan.phase1_designSystem[i].id] = result;
        });

        // Phase 2 & 3: Components and Images (all tasks in parallel)
        onProgress({ phase: 2, message: 'Generating components and images in parallel...' });
        const phase2And3Tasks = [
            ...plan.phase2_components.filter(t => !t.optional),
            ...plan.phase3_images
        ];
        const phase2And3Results = await Promise.all(
            phase2And3Tasks.map(task =>
                executeTask(task, results, apiKeys, plan.inputs, onProgress)
            )
        );
        phase2And3Results.forEach((result, i) => {
            results[phase2And3Tasks[i].id] = result;
        });

        // Phase 4: Assembly (sequential within phase)
        onProgress({ phase: 4, message: 'Assembling final page...' });
        for (const task of plan.phase4_assembly) {
            const result = await executeTask(task, results, apiKeys, plan.inputs, onProgress);
            results[task.id] = result;
        }

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[Orchestrator] ✅ Plan completed in ${totalTime}s`);

        return {
            guid: plan.guid,
            html: results['task-4.1'],
            css: results['task-4.2'],
            js: results['task-4.3'],
            images: plan.phase3_images.map(task => results[task.id]),
            designSystem: {
                colors: results['task-1.1'],
                typography: results['task-1.2']
            },
            totalTime,
            taskCount: plan.allTasks.length
        };

    } catch (error) {
        console.error('[Orchestrator] ❌ Execution failed:', error);
        throw error;
    }
}

/**
 * Execute a single task
 * @param {object} task - Task to execute
 * @param {object} results - Results from completed tasks
 * @param {object} apiKeys - API keys
 * @param {object} inputs - User inputs
 * @param {function} onProgress - Progress callback
 * @returns {Promise<any>} Task result
 */
async function executeTask(task, results, apiKeys, inputs, onProgress) {
    console.log(`[Orchestrator] Starting ${task.id}: ${task.name}`);
    onProgress({
        task: task.id,
        status: 'IN_PROGRESS',
        message: task.name,
        taskType: task.type,
        agent: task.agent,
        name: task.name
    });

    const taskStart = Date.now();

    try {
        let result;

        // Route to appropriate agent with model selection
        switch (task.agent) {
            case 'design-system':
                result = await executeDesignSystemTask(task, inputs, apiKeys);
                break;
            case 'component-builder':
                result = await executeComponentTask(task, results, inputs, apiKeys);
                break;
            case 'image-generator':
                result = await executeImageTask(task, results, inputs, apiKeys);
                break;
            case 'assembler':
                result = await executeAssemblyTask(task, results, inputs, apiKeys);
                break;
            default:
                throw new Error(`Unknown agent type: ${task.agent}`);
        }

        const duration = ((Date.now() - taskStart) / 1000).toFixed(1);
        console.log(`[Orchestrator] ✅ Completed ${task.id} in ${duration}s`);

        // PROGRESSIVE RENDERING: Send result back to UI for immediate display
        onProgress({
            task: task.id,
            status: 'COMPLETE',
            duration,
            taskType: task.type,
            agent: task.agent,
            result: result,  // Include actual result for progressive rendering
            name: task.name
        });

        return result;

    } catch (error) {
        console.error(`[Orchestrator] ❌ Failed ${task.id}:`, error);
        onProgress({ task: task.id, status: 'FAILED', error: error.message });
        throw error;
    }
}

/**
 * Execute design system task (colors, typography)
 * Uses Sonnet 4.5 for strategic design decisions + style matrix rules
 */
async function executeDesignSystemTask(task, inputs, apiKeys) {
    const { type } = task;

    // Get style configuration from style matrix
    const styleConfig = getStyleConfig(inputs.style);

    if (type === 'colors') {
        // Use style matrix color rules
        const colorRules = styleConfig?.colors || {};

        const prompt = `Generate a color palette for a ${styleConfig?.name || inputs.style} ${inputs.industry} landing page.

STYLE REQUIREMENTS:
- Palette Type: ${colorRules.paletteType || 'analogous'}
- Saturation: ${colorRules.saturation || 'medium'}
- Contrast: ${colorRules.contrast || 'high'}
- Primary Color (user-selected): ${inputs.primaryColor}

COLOR GENERATION RULES:
${colorRules.rules ? Object.entries(colorRules.rules).map(([key, rule]) => `- ${key}: ${rule}`).join('\n') : '- Generate harmonious color palette'}

Generate a complete, accessible color palette following these rules.

Return ONLY valid JSON:
{
  "primary": "${inputs.primaryColor}",
  "secondary": "<based on rules above>",
  "accent": "<based on rules above>",
  "neutral": {
    "50": "<lightest neutral>",
    "100": "<very light>",
    "200": "<light>",
    "300": "<light-medium>",
    "400": "<medium>",
    "500": "<medium-dark>",
    "600": "<dark>",
    "700": "<darker>",
    "800": "<very dark>",
    "900": "<darkest>"
  },
  "success": "<green for positive actions>",
  "warning": "<yellow/orange for warnings>",
  "error": "<red for errors>"
}`;

        const response = await callClaude(
            apiKeys.anthropic,
            'You are a color theory expert. Generate beautiful, accessible color palettes that follow design system rules.',
            prompt,
            'sonnet'  // Use Sonnet for strategic color decisions
        );

        // Parse with robust parser
        return parseApiResponse(response, 'colors generation');
    }

    if (type === 'typography') {
        // Use style matrix typography
        const typo = styleConfig?.typography || {};

        const prompt = `Generate typography system for ${styleConfig?.name || inputs.style} ${inputs.industry} landing page.

STYLE REQUIREMENTS:
- Heading Font: ${typo.headingFont || 'system-ui, sans-serif'}
- Body Font: ${typo.bodyFont || 'system-ui, sans-serif'}
- Heading Weight: ${typo.headingWeight || '700'}
- Body Weight: ${typo.bodyWeight || '400'}
- Heading Line Height: ${typo.headingLineHeight || '1.2'}
- Body Line Height: ${typo.bodyLineHeight || '1.6'}

Use the specified fonts and create a complete type scale.

Return ONLY valid JSON:
{
  "fontFamily": {
    "primary": "${typo.bodyFont || 'system-ui, sans-serif'}",
    "heading": "${typo.headingFont || 'system-ui, sans-serif'}"
  },
  "fontSize": {
    "xs": "${typo.scale?.xs || '0.75rem'}",
    "sm": "${typo.scale?.sm || '0.875rem'}",
    "base": "${typo.scale?.base || '1rem'}",
    "lg": "${typo.scale?.lg || '1.125rem'}",
    "xl": "${typo.scale?.xl || '1.25rem'}",
    "2xl": "${typo.scale?.['2xl'] || '1.5rem'}",
    "3xl": "${typo.scale?.['3xl'] || '1.875rem'}",
    "4xl": "${typo.scale?.['4xl'] || '2.25rem'}",
    "5xl": "${typo.scale?.['5xl'] || '3rem'}",
    "6xl": "${typo.scale?.['6xl'] || '3.75rem'}"
  },
  "fontWeight": {
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  },
  "lineHeight": {
    "tight": 1.25,
    "normal": 1.5,
    "relaxed": 1.75
  }
}`;

        const response = await callClaude(
            apiKeys.anthropic,
            'You are a typography expert. Create beautiful, readable type systems.',
            prompt,
            'sonnet'  // Use Sonnet for strategic typography decisions
        );

        return parseApiResponse(response, 'typography generation');
    }
}

/**
 * Execute component building task
 * Uses Haiku 4.5 for fast, efficient component generation (matches Sonnet 4 quality)
 */
async function executeComponentTask(task, results, inputs, apiKeys) {
    const colors = results['task-1.1'] || {};
    const typography = results['task-1.2'] || {};
    const { type } = task;

    // Get style configuration and component-specific rules
    const styleConfig = getStyleConfig(inputs.style) || {};
    const componentRules = getComponentRules(type, styleConfig);

    // Get default border radius value
    const defaultRadius = styleConfig.borderRadius?.default || 'sm';
    const radiusValue = styleConfig.borderRadius?.[defaultRadius] || '0.25rem';

    const systemPrompt = `You are an expert frontend developer. Generate clean, semantic HTML and modern CSS for landing page components.

DESIGN SYSTEM:
- Primary Color: ${colors.primary || '#3B82F6'}
- Secondary Color: ${colors.secondary || '#60A5FA'}
- Accent Color: ${colors.accent || '#F59E0B'}
- Neutral Colors: ${colors.neutral?.['50'] || '#F9FAFB'} (lightest) to ${colors.neutral?.['900'] || '#111827'} (darkest)
- Font Primary: ${typography.fontFamily?.primary || 'system-ui, sans-serif'}
- Font Heading: ${typography.fontFamily?.heading || 'system-ui, sans-serif'}
- Font Sizes: xs=${typography.fontSize?.xs || '0.75rem'}, base=${typography.fontSize?.base || '1rem'}, 2xl=${typography.fontSize?.['2xl'] || '1.5rem'}, 4xl=${typography.fontSize?.['4xl'] || '2.25rem'}

STYLE RULES (${styleConfig.name || inputs.style}):
- Border Radius: ${defaultRadius} (${radiusValue})
- Shadow Intensity: ${styleConfig.shadows?.intensity || 'subtle'}
- Spacing Grid: ${styleConfig.spacing?.gridBase || 8}px base
- Section Spacing: ${styleConfig.spacing?.sectionSpacing || '5rem'}
- Animation Speed: ${styleConfig.animations?.speed || 'medium'} (${styleConfig.animations?.transitions?.medium || '300ms'})

**CRITICAL - SECTION ID CONTRACT (all components MUST use these exact IDs):**
- Header: <header id="header">
- Hero Section: <section id="hero">
- Features Section: <section id="features">
- Testimonials Section: <section id="testimonials">
- CTA Section: <section id="cta">
- Footer: <footer id="footer">
- Navigation links MUST use: href="#hero", href="#features", href="#testimonials", href="#cta", href="#footer"
- CTA buttons should link to: href="#cta" or href="#features"

COMPONENT-SPECIFIC RULES:
${componentRules && Object.keys(componentRules).length > 0 ? Object.entries(componentRules).map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`).join('\n') : 'Use standard component patterns'}

Return ONLY valid JSON:
{
  "html": "<semantic HTML code>",
  "css": "<modern CSS code using design system variables>"
}`;

    let userPrompt = '';

    switch (type) {
        case 'header':
            userPrompt = `Create a header component for ${inputs.companyName}.
REQUIREMENTS:
- Logo placeholder on the left (text or image placeholder)
- Navigation menu with these EXACT links:
  * "Home" → href="#hero"
  * "Features" → href="#features"
  * "Testimonials" → href="#testimonials" ${inputs.includeTestimonials ? '' : '(SKIP THIS LINK - no testimonials section)'}
  * "Contact" → href="#cta"
- Make it sticky on scroll with subtle shadow when scrolled
- Mobile hamburger menu for small screens
- Use <header id="header"> as the root element
Style: ${styleConfig.name || inputs.style}.`;
            break;
        case 'hero':
            const heroDesc = inputs.enhancedDescription?.description || inputs.description;
            const heroTagline = inputs.enhancedDescription?.tagline || inputs.slogan;
            userPrompt = `Create a hero section for ${inputs.companyName}.
MUST use: <section id="hero">
Headline: "${heroTagline}".
Description: "${heroDesc.substring(0, 300)}".
Value Proposition: "${inputs.enhancedDescription?.valueProposition || inputs.slogan}".
CTA button: "${inputs.ctaText}" with href="#features" to scroll to features.
Background image: images/hero.png.
Hero height: ${styleConfig.layout?.heroHeight || '70vh'}.
Style: ${styleConfig.name || inputs.style}.`;
            break;
        case 'features':
            const featureBenefits = inputs.enhancedDescription?.keyBenefits || [];
            const featureHint = featureBenefits.length > 0
                ? `Base features on these key benefits: ${featureBenefits.join(', ')}.`
                : `Create compelling features for a ${inputs.industry} company.`;
            userPrompt = `Create a features section with ${inputs.featureCount} features.
MUST use: <section id="features">
${featureHint}
Each feature should have an icon (images/feature-X.png where X is 1, 2, 3...), a compelling title, and 2-sentence description.
Use a ${styleConfig.layout?.gridColumns || 3}-column grid on desktop. Card padding: ${componentRules?.padding || '2rem'}. Style: ${styleConfig.name || inputs.style}.`;
            break;
        case 'testimonials':
            userPrompt = `Create a testimonials section with 3 testimonial cards.
MUST use: <section id="testimonials">
Each card should have a quote, author name, job title, and company.
Card style: ${componentRules?.style || 'elevated cards'}. Style: ${styleConfig.name || inputs.style}.`;
            break;
        case 'cta':
            userPrompt = `Create a compelling CTA section.
MUST use: <section id="cta">
Headline: "Ready to get started?" or similar compelling call-to-action.
Button: "${inputs.ctaText}" - this should be a prominent button or form.
Make it visually striking with background color. Button style: ${componentRules?.style || 'filled'}. Style: ${styleConfig.name || inputs.style}.`;
            break;
        case 'footer':
            const footerDesc = inputs.enhancedDescription?.description || inputs.description;
            const footerBenefits = inputs.enhancedDescription?.keyBenefits || [];
            userPrompt = `Create a footer for ${inputs.companyName}.
MUST use: <footer id="footer">

FOOTER REQUIREMENTS:
- Three columns layout
- Column 1 "About Us": Brief description based on: "${footerDesc.substring(0, 200)}..."
- Column 2 "Quick Links": Navigation links using EXACT hrefs:
  * "Home" → href="#hero"
  * "Features" → href="#features"
  * "Contact" → href="#cta"
- Column 3 "Contact Us": Contact info placeholders (email, phone, address)
- Below columns: Copyright notice "© 2025 ${inputs.companyName}. All rights reserved."
- Social media icons (LinkedIn, Twitter, Facebook) in column 3

DO NOT use Lorem Ipsum or placeholder text. Write actual relevant content based on the company description.

Style: ${styleConfig.name || inputs.style}.`;
            break;
    }

    const response = await callClaude(
        apiKeys.anthropic,
        systemPrompt,
        userPrompt,
        'haiku'  // Use Haiku for component generation (fast, efficient)
    );

    return parseApiResponse(response, `${type} component generation`);
}

/**
 * Execute image generation task
 */
async function executeImageTask(task, results, inputs, apiKeys) {
    const colors = results['task-1.1'] || {};
    const { type } = task;

    let prompt = '';
    let filename = '';

    if (type === 'hero') {
        filename = 'hero.png';
        prompt = `${inputs.imageStyle} hero image for ${inputs.industry} company. Modern, professional environment. Color palette centered around ${colors.primary || '#3B82F6'}. 16:9 aspect ratio. No text in image.`;
    } else if (type.startsWith('feature-')) {
        const featureNum = parseInt(type.split('-')[1]);
        filename = `feature-${featureNum}.png`;
        const featureTopics = {
            // Technology
            'tech': ['Innovation', 'Automation', 'Analytics', 'Collaboration', 'Security', 'Scalability'],
            'ai-ml': ['Neural Networks', 'Machine Learning', 'Data Science', 'Automation', 'Predictions', 'Intelligence'],
            'cybersecurity': ['Shield Protection', 'Encryption', 'Threat Detection', 'Compliance', 'Privacy', 'Access Control'],
            'cloud-services': ['Cloud Infrastructure', 'Scalability', 'Data Storage', 'Global Access', 'Reliability', 'Integration'],
            // Professional Services
            'finance': ['Security', 'Investment', 'Analytics', 'Compliance', 'Banking', 'Wealth Management'],
            'legal': ['Justice', 'Contracts', 'Compliance', 'Protection', 'Advisory', 'Documentation'],
            'consulting': ['Strategy', 'Growth', 'Expertise', 'Solutions', 'Transformation', 'Partnership'],
            'real-estate': ['Properties', 'Investment', 'Location', 'Architecture', 'Growth', 'Trust'],
            'accounting': ['Financial Reports', 'Tax Planning', 'Audit', 'Compliance', 'Accuracy', 'Insights'],
            // Healthcare & Wellness
            'healthcare': ['Patient Care', 'Medical Technology', 'Health Records', 'Telemedicine', 'Research', 'Wellness'],
            'pharma': ['Research', 'Innovation', 'Safety', 'Clinical Trials', 'Medicine', 'Discovery'],
            'wellness': ['Balance', 'Fitness', 'Mindfulness', 'Nutrition', 'Recovery', 'Vitality'],
            'dental': ['Smile', 'Care', 'Prevention', 'Treatment', 'Comfort', 'Health'],
            // Consumer & Retail
            'ecommerce': ['Shopping', 'Delivery', 'Selection', 'Convenience', 'Savings', 'Quality'],
            'retail': ['Products', 'Service', 'Experience', 'Value', 'Variety', 'Trust'],
            'food-beverage': ['Fresh Ingredients', 'Quality', 'Flavor', 'Sustainability', 'Craftsmanship', 'Experience'],
            'fashion': ['Style', 'Quality', 'Trends', 'Sustainability', 'Craftsmanship', 'Expression'],
            'beauty': ['Radiance', 'Natural', 'Care', 'Innovation', 'Confidence', 'Wellness'],
            // Creative & Media
            'creative': ['Creativity', 'Design', 'Innovation', 'Collaboration', 'Vision', 'Impact'],
            'media': ['Content', 'Engagement', 'Stories', 'Reach', 'Production', 'Distribution'],
            'photography': ['Visual Stories', 'Creativity', 'Quality', 'Memories', 'Artistry', 'Precision'],
            'gaming': ['Play', 'Adventure', 'Community', 'Competition', 'Entertainment', 'Innovation'],
            // Education & Non-Profit
            'education': ['Learning', 'Growth', 'Knowledge', 'Community', 'Success', 'Innovation'],
            'nonprofit': ['Impact', 'Community', 'Change', 'Support', 'Mission', 'Together'],
            // Industrial & Services
            'manufacturing': ['Precision', 'Quality', 'Efficiency', 'Innovation', 'Reliability', 'Scale'],
            'logistics': ['Delivery', 'Tracking', 'Global', 'Speed', 'Reliability', 'Network'],
            'automotive': ['Performance', 'Innovation', 'Safety', 'Design', 'Efficiency', 'Technology'],
            'travel': ['Adventure', 'Discovery', 'Comfort', 'Experience', 'Memories', 'Destinations'],
            'energy': ['Sustainability', 'Power', 'Innovation', 'Efficiency', 'Future', 'Clean'],
            // Other
            'startup': ['Innovation', 'Growth', 'Vision', 'Agility', 'Disruption', 'Impact'],
            'other': ['Quality', 'Innovation', 'Trust', 'Excellence', 'Service', 'Results']
        };
        const topic = (featureTopics[inputs.industry] || featureTopics.other)[featureNum - 1] || 'Excellence';
        prompt = `${inputs.imageStyle} icon representing "${topic}" for ${inputs.industry} company. Centered, simple. Primary color ${colors.primary || '#3B82F6'}. Square 1:1 aspect ratio. No text.`;
    }

    let blob;
    let isPlaceholder = false;

    try {
        console.log(`[Orchestrator] Generating image: ${filename} with Gemini 2.5 Flash`);
        blob = await callNanoBanana(apiKeys.google, prompt);
        console.log(`[Orchestrator] ✅ Generated ${filename}`);
    } catch (error) {
        console.error(`[Orchestrator] ❌ Failed to generate ${filename}:`, error.message);
        console.log(`[Orchestrator] Using placeholder for ${filename}`);
        blob = createPlaceholderImage(filename);
        isPlaceholder = true;
    }

    return {
        filename,
        blob,
        prompt,
        isPlaceholder
    };
}

/**
 * Execute assembly task
 */
async function executeAssemblyTask(task, results, inputs, apiKeys) {
    const { type } = task;

    if (type === 'html') {
        // Get all components
        const header = results['task-2.1'] || { html: '' };
        const hero = results['task-2.2'] || { html: '' };
        const features = results['task-2.3'] || { html: '' };
        const testimonials = results['task-2.4'] || null;
        const cta = results['task-2.5'] || { html: '' };
        const footer = results['task-2.6'] || { html: '' };

        // Get list of generated images
        const generatedImages = [];
        for (const key of Object.keys(results)) {
            if (key.startsWith('task-3.')) {
                const imageResult = results[key];
                if (imageResult && imageResult.filename) {
                    generatedImages.push({
                        filename: imageResult.filename,
                        path: `images/${imageResult.filename}`,
                        isPlaceholder: imageResult.isPlaceholder || false
                    });
                }
            }
        }

        console.log('[Orchestrator] Generated images:', generatedImages.map(i => i.path));

        // Assemble raw HTML first
        let assembledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${inputs.companyName} - ${inputs.slogan}</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    ${header.html}
    <main>
        ${hero.html}
        ${features.html}
        ${testimonials ? testimonials.html : ''}
        ${cta.html}
    </main>
    ${footer.html}
    <script src="js/main.js"></script>
</body>
</html>`;

        // Validate and fix image references using Sonnet
        const imageList = generatedImages.map(i => i.path).join(', ');
        const validationPrompt = `Review this HTML and ensure all image src attributes use the correct paths from this list of available images: [${imageList}]

AVAILABLE IMAGES:
${generatedImages.map(i => `- ${i.path}`).join('\n')}

RULES:
1. Hero background should use: images/hero.png
2. Feature icons should use: images/feature-1.png, images/feature-2.png, etc.
3. Fix any broken image paths to use the correct available images
4. Ensure all img tags have alt attributes

If the HTML is correct, return it unchanged. If fixes are needed, return the corrected HTML.

Return ONLY the complete HTML document, no explanations.

HTML TO VALIDATE:
${assembledHtml}`;

        try {
            const validatedHtml = await callClaude(
                apiKeys.anthropic,
                'You are an HTML validator. Fix image paths to match available images. Return only valid HTML.',
                validationPrompt,
                'haiku'  // Use Haiku for speed - this is a validation task
            );

            // If Claude returns valid HTML, use it; otherwise use original
            if (validatedHtml && validatedHtml.includes('<!DOCTYPE html>')) {
                console.log('[Orchestrator] ✅ HTML validated and images verified');
                return validatedHtml;
            }
        } catch (error) {
            console.warn('[Orchestrator] Image validation failed, using assembled HTML:', error.message);
        }

        return assembledHtml;
    }

    if (type === 'css') {
        // Merge all CSS using style matrix variables
        const colors = results['task-1.1'] || {};
        const typography = results['task-1.2'] || {};
        const styleConfig = getStyleConfig(inputs.style) || {};
        const components = [
            results['task-2.1'],
            results['task-2.2'],
            results['task-2.3'],
            results['task-2.4'],
            results['task-2.5'],
            results['task-2.6']
        ].filter(Boolean);

        // Generate comprehensive CSS variables from style matrix
        let css = generateCSSVariables(styleConfig, colors, typography);
        css += '\n\n';

        // Reset styles
        css += `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-primary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    color: var(--color-neutral-900);
    background-color: var(--color-neutral-50);
}\n\n`;

        // Component styles
        css += components.map(c => c.css).join('\n\n');

        return css;
    }

    if (type === 'js') {
        // Basic JS for smooth scroll and mobile menu
        return `
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}
`.trim();
    }
}

/**
 * Enhance user's description into professional marketing copy
 * @param {object} inputs - User inputs including raw description
 * @param {object} apiKeys - API keys
 * @returns {Promise<object>} Enhanced content
 */
async function enhanceDescription(inputs, apiKeys) {
    const systemPrompt = `You are an expert marketing copywriter. Your job is to take rough business descriptions and transform them into compelling, professional marketing copy suitable for a landing page.

Guidelines:
- Keep the core message and facts intact
- Make the language more engaging and action-oriented
- Add power words and emotional appeal where appropriate
- Ensure grammar and punctuation are perfect
- Keep it concise but impactful
- Match the tone to the industry (${inputs.industry})`;

    const userPrompt = `Transform this business description into professional landing page copy:

COMPANY: ${inputs.companyName}
SLOGAN: ${inputs.slogan}
INDUSTRY: ${inputs.industry}

RAW DESCRIPTION:
${inputs.description}

Return ONLY valid JSON with the enhanced content:
{
    "description": "<Enhanced main description (2-3 compelling paragraphs)>",
    "tagline": "<Short punchy tagline, max 10 words>",
    "valueProposition": "<Clear value proposition, 1 sentence>",
    "keyBenefits": ["<Benefit 1>", "<Benefit 2>", "<Benefit 3>"]
}`;

    try {
        const response = await callClaude(
            apiKeys.anthropic,
            systemPrompt,
            userPrompt,
            'haiku'  // Use Haiku for speed - this is a quick task
        );

        return parseApiResponse(response, 'description enhancement');
    } catch (error) {
        console.warn('[Orchestrator] Description enhancement failed, using original:', error.message);
        // Fallback to original description if enhancement fails
        return {
            description: inputs.description,
            tagline: inputs.slogan,
            valueProposition: inputs.slogan,
            keyBenefits: []
        };
    }
}
