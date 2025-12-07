// Progressive Renderer - Hierarchical Phase & Task Tracker
// Shows phases with collapsible task lists

/**
 * State
 */
let previewFrame = null;
let previewDocument = null;
let iframeReadyPromise = null;
let completedTasks = new Set();
let taskStartTimes = new Map();
let isExpanded = false;

/**
 * Phase and task definitions
 */
const PHASES = [
    {
        id: 'planning',
        label: 'Planning',
        tasks: [
            { id: 'plan', label: 'Creating Execution Plan' },
            { id: 'content-enhancement', label: 'Enhancing Content' }
        ]
    },
    {
        id: 'execution',
        label: 'Execution',
        tasks: [
            { id: 'colors', label: 'Color Palette Generation' },
            { id: 'typography', label: 'Typography System' },
            { id: 'image-prompts', label: 'Image Prompt Generation' },
            { id: 'hero-image', label: 'Hero Image' },
            { id: 'feature-images', label: 'Feature Icons' },
            { id: 'header', label: 'Header Component' },
            { id: 'hero', label: 'Hero Section' },
            { id: 'features', label: 'Features Section' },
            { id: 'testimonials', label: 'Testimonials Section' },
            { id: 'cta', label: 'Call-to-Action Section' },
            { id: 'footer', label: 'Footer Component' }
        ]
    },
    {
        id: 'assembly',
        label: 'Assembly',
        tasks: [
            { id: 'html', label: 'HTML Assembly' },
            { id: 'css', label: 'CSS Compilation' },
            { id: 'js', label: 'JavaScript Bundling' }
        ]
    },
    {
        id: 'complete',
        label: 'Complete',
        tasks: [
            { id: 'validation', label: 'Validation & Auto-fix' },
            { id: 'render', label: 'Final Rendering' }
        ]
    }
];

/**
 * Show idle progress view (before generation starts)
 * This provides a preview of what the progress tracker looks like
 */
export function showIdleProgressView(iframe) {
    const html = generateIdleHTML();
    const blob = new Blob([html], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);

    // Hide placeholder, show iframe
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.classList.add('hidden');
    iframe.classList.add('visible');
}

/**
 * Initialize progressive renderer
 */
export function initProgressiveRenderer(iframe) {
    previewFrame = iframe;
    previewDocument = null;
    completedTasks.clear();
    taskStartTimes.clear();

    // Create promise for iframe ready
    iframeReadyPromise = new Promise((resolve) => {
        iframe.onload = () => {
            previewDocument = iframe.contentDocument || iframe.contentWindow.document;
            console.log('[ProgressiveRenderer] ✓ Iframe ready');

            // Setup expand button handler
            const expandBtn = previewDocument.getElementById('expandBtn');
            if (expandBtn) {
                expandBtn.addEventListener('click', toggleCompletedTasks);
            }

            resolve();
        };
    });

    // Generate and load skeleton HTML
    const html = generateSkeletonHTML();
    const blob = new Blob([html], { type: 'text/html' });
    iframe.src = URL.createObjectURL(blob);

    // Hide placeholder, show iframe
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.classList.add('hidden');
    iframe.classList.add('visible');

    return iframeReadyPromise;
}

/**
 * Generate skeleton HTML with phases and tasks
 */
function generateSkeletonHTML() {
    const phasesHTML = PHASES.map(phase => {
        const tasksHTML = phase.tasks.map(task => `
            <div class="task-item waiting" data-task="${task.id}" data-phase="${phase.id}">
                <div class="task-indicator">
                    <div class="task-spinner"></div>
                    <div class="task-check">✓</div>
                </div>
                <div class="task-label">${task.label}</div>
                <div class="task-duration"></div>
            </div>
        `).join('');

        return `
            <div class="phase-group" data-phase="${phase.id}">
                <div class="phase-header">
                    <div class="phase-indicator">
                        <div class="phase-spinner"></div>
                        <div class="phase-check">✓</div>
                    </div>
                    <div class="phase-label">${phase.label}</div>
                </div>
                <div class="task-list">
                    ${tasksHTML}
                </div>
            </div>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Building...</title>
    <style>
        :root {
            /* Modern Metro Theme Matches */
            --primary: #0078D4;
            --success: #107C10;
            --success-muted: rgba(16, 124, 16, 0.15);
            --bg: #202020;
            --surface: #2B2B2B;
            --surface-hover: #353535;
            --text: #FFFFFF;
            --text-dim: #999999;
            --border: #444444;
            --border-active: #767676;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            scrollbar-width: thin;
            scrollbar-color: var(--border) var(--bg);
        }

        /* Metro Scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border);
            border: 2px solid var(--bg);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--border-active);
        }

        body {
            font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            padding: 2rem;
            font-size: 16px;
        }

        /* Header */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }

        .header h1 {
            font-family: 'Segoe UI Light', 'Segoe UI', 'Helvetica Neue', sans-serif;
            font-size: 1.5rem;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text);
        }

        .current-status {
            color: var(--primary);
            font-size: 0.95rem;
            margin-top: 0.25rem;
            font-family: 'Segoe UI', sans-serif;
        }

        /* Expand button */
        #expandBtn {
            width: 36px;
            height: 36px;
            border-radius: 0px; /* Metro square */
            background: transparent;
            border: 2px solid var(--border);
            color: var(--text);
            font-size: 1.25rem;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        #expandBtn:hover {
            background: var(--surface-hover);
            border-color: var(--text);
        }

        #expandBtn.visible {
            display: flex;
        }

        /* Progress bar */
        .progress-track {
            height: 4px;
            background: var(--surface); /* Darker track */
            border-radius: 0px;
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background: var(--primary);
            width: 0%;
            transition: width 0.5s ease;
        }

        /* Phase groups */
        .phases-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .phase-group {
            background: var(--surface);
            border-radius: 0px; /* Metro square */
            overflow: hidden;
            opacity: 0.5;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .phase-group.active {
            opacity: 1;
        }

        .phase-group.complete {
            opacity: 1;
            background: var(--surface); /* Keep surface background */
        }

        .phase-group.fading {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        .phase-group.hidden {
            display: none;
        }

        /* Phase header */
        .phase-header {
            display: flex;
            align-items: center;
            padding: 1rem 1.25rem;
            border-left: 4px solid var(--border);
            background: var(--surface);
            transition: all 0.3s ease;
        }

        .phase-group.active .phase-header {
            border-left-color: var(--primary);
            background: rgba(0, 120, 212, 0.1);
        }

        .phase-group.complete .phase-header {
            border-left-color: var(--success);
        }

        .phase-indicator {
            width: 24px;
            height: 24px;
            margin-right: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .phase-spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid var(--border);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .phase-check {
            display: none;
            color: var(--success);
            font-size: 1.25rem;
        }

        .phase-group.active .phase-spinner { display: block; }
        .phase-group.active .phase-check { display: none; }
        .phase-group.complete .phase-spinner { display: none; }
        .phase-group.complete .phase-check { display: block; }

        .phase-label {
            font-size: 1.1rem;
            font-weight: 300;
            font-family: 'Segoe UI Light', 'Segoe UI', sans-serif;
        }

        /* Task list */
        .task-list {
            padding: 0 1.25rem 1rem 3rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        /* Task items */
        .task-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.75rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 0px;
            border-left: 3px solid transparent;
            transition: all 0.3s ease;
            opacity: 0.5;
        }

        .task-item.active {
            opacity: 1;
            border-left-color: var(--primary);
            background: rgba(0, 120, 212, 0.1);
        }

        .task-item.complete {
            opacity: 1;
            border-left-color: var(--success);
            background: rgba(16, 124, 16, 0.1);
        }

        .task-item.fading {
            opacity: 0;
            transform: translateX(-10px);
            max-height: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        .task-item.hidden {
            display: none;
        }

        .task-indicator {
            width: 18px;
            height: 18px;
            margin-right: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .task-spinner {
            display: none;
            width: 14px;
            height: 14px;
            border: 2px solid var(--border);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        .task-check {
            display: none;
            color: var(--success);
            font-size: 1rem;
        }

        .task-item.active .task-spinner { display: block; }
        .task-item.active .task-check { display: none; }
        .task-item.complete .task-spinner { display: none; }
        .task-item.complete .task-check { display: block; }

        .task-label {
            flex: 1;
            font-size: 0.9rem;
        }

        .task-duration {
            font-size: 0.8rem;
            color: var(--text-dim);
            margin-left: 0.5rem;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Building your page</h1>
            <div class="current-status" id="currentStatus">Initializing...</div>
        </div>
        <button id="expandBtn" title="Show completed tasks">+</button>
    </div>

    <div class="progress-track">
        <div class="progress-fill" id="progressBar"></div>
    </div>

    <div class="phases-container" id="phasesContainer">
        ${phasesHTML}
    </div>
</body>
</html>`;
}

/**
 * Generate idle HTML - shows progress structure before generation starts
 */
function generateIdleHTML() {
    const phasesHTML = PHASES.map(phase => {
        const tasksHTML = phase.tasks.map(task => `
            <div class="task-item idle" data-task="${task.id}" data-phase="${phase.id}">
                <div class="task-indicator">
                    <div class="task-dot"></div>
                </div>
                <div class="task-label">${task.label}</div>
            </div>
        `).join('');

        return `
            <div class="phase-group idle" data-phase="${phase.id}">
                <div class="phase-header">
                    <div class="phase-indicator">
                        <div class="phase-dot"></div>
                    </div>
                    <div class="phase-label">${phase.label}</div>
                </div>
                <div class="task-list">
                    ${tasksHTML}
                </div>
            </div>
        `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ready</title>
    <style>
        :root {
            --primary: #0078D4;
            --bg: #202020;
            --surface: #2B2B2B;
            --text: #FFFFFF;
            --text-dim: #666666;
            --border: #444444;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            padding: 2rem;
            font-size: 16px;
        }

        .header {
            margin-bottom: 1.5rem;
        }

        .header h1 {
            font-family: 'Segoe UI Light', 'Segoe UI', 'Helvetica Neue', sans-serif;
            font-size: 1.5rem;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text);
        }

        .current-status {
            color: var(--text-dim);
            font-size: 0.95rem;
            margin-top: 0.25rem;
        }

        .progress-track {
            height: 4px;
            background: var(--surface);
            margin-bottom: 2rem;
            overflow: hidden;
        }

        .phases-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .phase-group {
            background: var(--surface);
            overflow: hidden;
            opacity: 0.4;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .phase-header {
            display: flex;
            align-items: center;
            padding: 1rem 1.25rem;
            border-left: 4px solid var(--border);
            background: var(--surface);
        }

        .phase-indicator {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
        }

        .phase-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--border);
        }

        .phase-label {
            font-weight: 600;
            font-size: 1rem;
            color: var(--text-dim);
        }

        .task-list {
            padding: 0 1.25rem 1rem 1.25rem;
        }

        .task-item {
            display: flex;
            align-items: center;
            padding: 0.6rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .task-item:last-child {
            border-bottom: none;
        }

        .task-indicator {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.75rem;
        }

        .task-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--border);
        }

        .task-label {
            font-size: 0.9rem;
            color: var(--text-dim);
        }

        .ready-message {
            text-align: center;
            padding: 2rem;
            color: var(--text-dim);
            font-size: 0.9rem;
            border-top: 1px solid var(--border);
            margin-top: 1rem;
        }

        .ready-message svg {
            width: 48px;
            height: 48px;
            margin-bottom: 1rem;
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Generation Progress</h1>
        <div class="current-status">Ready to generate</div>
    </div>

    <div class="progress-track">
        <div class="progress-fill"></div>
    </div>

    <div class="phases-container" id="phasesContainer">
        ${phasesHTML}
    </div>

    <div class="ready-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <p>Click "Generate Landing Page" to start</p>
    </div>
</body>
</html>`;
}

/**
 * Toggle visibility of completed tasks
 */
function toggleCompletedTasks() {
    if (!previewDocument) return;

    const btn = previewDocument.getElementById('expandBtn');
    const wasExpanded = isExpanded;
    isExpanded = !wasExpanded;

    if (isExpanded) {
        btn.textContent = '−';
        // Show all hidden completed items
        previewDocument.querySelectorAll('.task-item.hidden, .phase-group.hidden').forEach(el => {
            el.classList.remove('hidden', 'fading');
            if (completedTasks.has(el.dataset.task) || el.dataset.phase) {
                el.classList.add('complete');
            }
        });
    } else {
        btn.textContent = '+';
        // Hide completed items again
        completedTasks.forEach(taskId => {
            const task = previewDocument.querySelector(`[data-task="${taskId}"]`);
            if (task) {
                task.classList.add('hidden');
            }
        });
        // Check if phases should be hidden
        checkAndHideCompletedPhases();
    }
}

/**
 * Check if all tasks in a phase are complete, and hide the phase if so
 */
function checkAndHideCompletedPhases() {
    if (!previewDocument) return;
    // Don't hide phases if expanded
    if (isExpanded) return;

    PHASES.forEach(phase => {
        const phaseGroup = previewDocument.querySelector(`.phase-group[data-phase="${phase.id}"]`);
        if (!phaseGroup) return;

        const allTasksComplete = phase.tasks.every(task => completedTasks.has(task.id));

        if (allTasksComplete && !phaseGroup.classList.contains('hidden')) {
            // All tasks complete - fade out phase
            phaseGroup.classList.add('complete');

            setTimeout(() => {
                // Check again in case user expanded
                if (isExpanded) return;

                phaseGroup.classList.add('fading');
                setTimeout(() => {
                    if (isExpanded) {
                        phaseGroup.classList.remove('fading');
                        return;
                    }
                    phaseGroup.classList.add('hidden');
                    showExpandButton();
                }, 500);
            }, 1000);
        }
    });
}

/**
 * Show the expand button
 */
function showExpandButton() {
    if (!previewDocument) return;
    const btn = previewDocument.getElementById('expandBtn');
    if (btn) btn.classList.add('visible');
}

/**
 * Update global status text and progress bar
 */
export function updateGlobalStatus(text, percent) {
    if (!previewDocument) return;

    const statusEl = previewDocument.getElementById('currentStatus');
    const barEl = previewDocument.getElementById('progressBar');

    if (statusEl && text) statusEl.textContent = text;
    if (barEl && percent !== null && percent !== undefined) barEl.style.width = `${percent}%`;
}

/**
 * Set a phase as active
 */
export function setActivePhase(phaseId) {
    if (!previewDocument) return;

    previewDocument.querySelectorAll('.phase-group').forEach(group => {
        if (group.dataset.phase === phaseId) {
            group.classList.add('active');
            group.classList.remove('complete', 'waiting');
        } else if (!group.classList.contains('complete') && !group.classList.contains('hidden')) {
            group.classList.remove('active');
        }
    });

    console.log(`[ProgressiveRenderer] ✓ Active phase: ${phaseId}`);
}

/**
 * Mark a task as in progress
 */
function markTaskInProgress(taskId) {
    if (!previewDocument) return;

    const task = previewDocument.querySelector(`[data-task="${taskId}"]`);
    if (!task) {
        console.warn(`[ProgressiveRenderer] Task not found: ${taskId}`);
        return;
    }

    task.classList.remove('waiting', 'complete');
    task.classList.add('active');

    // Track start time
    taskStartTimes.set(taskId, Date.now());

    // Update status
    const label = task.querySelector('.task-label');
    updateGlobalStatus(label ? `${label.textContent}...` : 'Processing...', null);

    console.log(`[ProgressiveRenderer] ✓ Task in progress: ${taskId}`);
}

/**
 * Mark a task as complete
 */
function markTaskComplete(taskId, duration) {
    if (!previewDocument) return;

    const task = previewDocument.querySelector(`[data-task="${taskId}"]`);
    if (!task) {
        console.warn(`[ProgressiveRenderer] Task not found: ${taskId}`);
        return;
    }

    task.classList.remove('waiting', 'active');
    task.classList.add('complete');
    completedTasks.add(taskId);

    // Calculate and show duration
    let durationText = duration;
    if (!durationText && taskStartTimes.has(taskId)) {
        const elapsed = (Date.now() - taskStartTimes.get(taskId)) / 1000;
        durationText = elapsed.toFixed(1);
    }

    const durationEl = task.querySelector('.task-duration');
    if (durationEl && durationText) {
        durationEl.textContent = `${durationText}s`;
    }

    console.log(`[ProgressiveRenderer] ✓ Task complete: ${taskId} (${durationText}s)`);

    // Fade out after 3 seconds (only if not expanded)
    setTimeout(() => {
        // Don't fade if user has expanded the view
        if (isExpanded) return;

        task.classList.add('fading');
        setTimeout(() => {
            // Double-check we're still not expanded
            if (isExpanded) {
                task.classList.remove('fading');
                return;
            }
            task.classList.add('hidden');
            showExpandButton();
            checkAndHideCompletedPhases();
        }, 500);
    }, 3000);
}

/**
 * Map orchestrator task types to our task IDs
 */
const TASK_TYPE_MAP = {
    // Planning phase
    'content-enhancement': 'content-enhancement',
    // Design system (direct match)
    'colors': 'colors',
    'typography': 'typography',
    // Components (direct match)
    'header': 'header',
    'hero': 'hero',  // Component hero, not image
    'features': 'features',
    'testimonials': 'testimonials',
    'cta': 'cta',
    'footer': 'footer',
    // Assembly tasks
    'html': 'html',
    'css': 'css',
    'js': 'js'
};

// Track image completion
let heroImageComplete = false;
let completedFeatureImages = new Set(); // Track which feature images completed
let totalFeatureImages = 3; // Default, will be updated

/**
 * Handle task progress from orchestrator
 */
export function handleTaskProgress(progress) {
    if (!previewDocument) {
        console.warn('[ProgressiveRenderer] Document not ready');
        return;
    }

    const { taskType, status, phase, agent, duration } = progress;

    // Update phase based on orchestrator phase number
    if (phase !== undefined) {
        if (phase === 1) {
            setActivePhase('execution');
        } else if (phase === 2) {
            setActivePhase('execution');
            // Mark image prompts as starting when Phase 2 begins
            if (!completedTasks.has('image-prompts')) {
                markTaskInProgress('image-prompts');
                setTimeout(() => markTaskComplete('image-prompts', '0.2'), 300);
            }
        } else if (phase === 4) {
            setActivePhase('assembly');
        }
    }

    // Handle image tasks specially (from image-generator agent)
    if (agent === 'image-generator' && taskType) {
        console.log(`[ProgressiveRenderer] Image task: ${taskType}, status: ${status}`);

        if (taskType === 'hero') {
            // Hero image
            if (status === 'IN_PROGRESS') {
                markTaskInProgress('hero-image');
            } else if (status === 'COMPLETE') {
                markTaskComplete('hero-image', duration);
                heroImageComplete = true;
            }
        } else if (taskType.startsWith('feature-')) {
            // Feature images - track as a group using Set
            if (status === 'IN_PROGRESS' && completedFeatureImages.size === 0) {
                markTaskInProgress('feature-images');
            } else if (status === 'COMPLETE') {
                completedFeatureImages.add(taskType);
                console.log(`[ProgressiveRenderer] Feature images: ${completedFeatureImages.size}/${totalFeatureImages}`);

                // Complete after all feature images done
                if (completedFeatureImages.size >= totalFeatureImages) {
                    markTaskComplete('feature-images', duration);
                }
            }
        }
        return;
    }

    // Handle assembly tasks (from assembler agent)
    if (agent === 'assembler' && taskType) {
        console.log(`[ProgressiveRenderer] Assembly task: ${taskType}, status: ${status}`);
        const assemblyTaskId = taskType; // html, css, js
        if (status === 'IN_PROGRESS') {
            markTaskInProgress(assemblyTaskId);
        } else if (status === 'COMPLETE') {
            markTaskComplete(assemblyTaskId, duration);
        }
        return;
    }

    // Handle component and design system tasks
    const taskId = TASK_TYPE_MAP[taskType];
    if (!taskId) {
        console.log(`[ProgressiveRenderer] No mapping for taskType: ${taskType}`);
        return;
    }

    if (status === 'IN_PROGRESS') {
        markTaskInProgress(taskId);
    } else if (status === 'COMPLETE') {
        markTaskComplete(taskId, duration);
    }
}

/**
 * Set the expected number of feature images
 */
export function setFeatureImageCount(count) {
    totalFeatureImages = count;
}

/**
 * Mark planning complete
 */
export function markPlanningComplete() {
    setActivePhase('planning');
    markTaskInProgress('plan');
    setTimeout(() => {
        markTaskComplete('plan', '0.1');
        setActivePhase('execution');
    }, 200);
}

/**
 * Mark execution phase complete
 */
export function markExecutionComplete() {
    // Mark any remaining execution tasks as complete
    ['colors', 'typography', 'image-prompts', 'hero-image', 'feature-images',
        'header', 'hero', 'features', 'testimonials', 'cta', 'footer'].forEach(taskId => {
            if (!completedTasks.has(taskId)) {
                const task = previewDocument?.querySelector(`[data-task="${taskId}"]`);
                if (task && !task.classList.contains('hidden')) {
                    markTaskComplete(taskId);
                }
            }
        });
    setActivePhase('assembly');
}

/**
 * Mark assembly phase complete
 */
export function markAssemblyComplete() {
    ['html', 'css', 'js'].forEach(taskId => {
        if (!completedTasks.has(taskId)) {
            markTaskComplete(taskId);
        }
    });
    setActivePhase('complete');
}

/**
 * Mark rendering start
 */
export function markValidationStart() {
    setActivePhase('complete');
    markTaskInProgress('validation');
}

/**
 * Mark validation complete
 */
export function markValidationComplete(duration) {
    markTaskComplete('validation', duration || '1.0');
}

/**
 * Mark rendering started
 */
export function markRenderingStart() {
    markTaskInProgress('render');
}

/**
 * Mark rendering complete
 */
export function markRenderingComplete() {
    markTaskComplete('render', '0.5');
    updateGlobalStatus('Your page is ready!', 100);
}

/**
 * Mark all complete
 */
export function markAllComplete() {
    updateGlobalStatus('Your page is ready!', 100);
}

/**
 * Cleanup
 */
export function cleanup() {
    const placeholder = document.getElementById('previewPlaceholder');
    if (placeholder) placeholder.classList.remove('hidden');
    if (previewFrame) previewFrame.classList.remove('visible');

    previewFrame = null;
    previewDocument = null;
    iframeReadyPromise = null;
    completedTasks.clear();
    taskStartTimes.clear();
    isExpanded = false;
    heroImageComplete = false;
    completedFeatureImages.clear();
}
