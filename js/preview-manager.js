// Preview Manager - Handles iframe preview rendering

// Track blob URLs for cleanup (prevent memory leaks)
let currentBlobUrls = [];

/**
 * Render preview in iframe
 * @param {object} output - Generated output with html, css, js, and images
 * @returns {string} Preview blob URL
 */
export function renderPreview(output) {
    // Revoke previous blob URLs to prevent memory leaks
    if (currentBlobUrls.length > 0) {
        console.log(`[PreviewManager] Revoking ${currentBlobUrls.length} previous blob URLs`);
        currentBlobUrls.forEach(url => {
            try {
                URL.revokeObjectURL(url);
            } catch (e) {
                console.warn('[PreviewManager] Failed to revoke URL:', url, e);
            }
        });
        currentBlobUrls = [];
    }

    // Create blob URLs for each image
    const imageUrlMap = {};
    for (const image of output.images) {
        const blobUrl = URL.createObjectURL(image.blob);
        currentBlobUrls.push(blobUrl); // Track for later cleanup
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

    // Inject CSS inline - try multiple patterns
    const cssStyleTag = `<style>${previewCss}</style>`;

    // Pattern 1: Replace existing link tag
    if (previewHtml.match(/<link[^>]*href=["']css\/styles\.css["'][^>]*>/gi)) {
        previewHtml = previewHtml.replace(
            /<link[^>]*href=["']css\/styles\.css["'][^>]*>/gi,
            cssStyleTag
        );
    }
    // Pattern 2: Inject before </head> if no link tag found
    else if (previewHtml.match(/<\/head>/i)) {
        previewHtml = previewHtml.replace(
            /<\/head>/i,
            `${cssStyleTag}\n</head>`
        );
    }
    // Pattern 3: Inject after <head> if </head> not found
    else if (previewHtml.match(/<head[^>]*>/i)) {
        previewHtml = previewHtml.replace(
            /<head[^>]*>/i,
            (match) => `${match}\n${cssStyleTag}`
        );
    }

    // Inject JS inline - try multiple patterns
    const jsScriptTag = output.js ? `<script>${output.js}</script>` : '';

    // Pattern 1: Replace existing script tag
    if (previewHtml.match(/<script[^>]*src=["']js\/main\.js["'][^>]*><\/script>/gi)) {
        previewHtml = previewHtml.replace(
            /<script[^>]*src=["']js\/main\.js["'][^>]*><\/script>/gi,
            jsScriptTag
        );
    }
    // Pattern 2: Inject before </body> if no script tag found
    else if (jsScriptTag && previewHtml.match(/<\/body>/i)) {
        previewHtml = previewHtml.replace(
            /<\/body>/i,
            `${jsScriptTag}\n</body>`
        );
    }

    // Create blob URL for the complete HTML
    const htmlBlob = new Blob([previewHtml], { type: 'text/html' });
    const previewUrl = URL.createObjectURL(htmlBlob);
    currentBlobUrls.push(previewUrl); // Track for later cleanup

    console.log(`[PreviewManager] Created ${currentBlobUrls.length} new blob URLs (${output.images.length} images + 1 HTML)`);

    // Load into sandboxed iframe
    const iframe = document.getElementById('previewFrame');
    const placeholder = document.getElementById('previewPlaceholder');

    iframe.src = previewUrl;
    iframe.classList.add('visible');
    placeholder.classList.add('hidden');

    return previewUrl;
}

/**
 * Clear preview and revoke all blob URLs
 */
export function clearPreview() {
    const iframe = document.getElementById('previewFrame');
    const placeholder = document.getElementById('previewPlaceholder');

    iframe.src = '';
    iframe.classList.remove('visible');
    placeholder.classList.remove('hidden');

    // Revoke all blob URLs to free memory
    if (currentBlobUrls.length > 0) {
        console.log(`[PreviewManager] Clearing preview and revoking ${currentBlobUrls.length} blob URLs`);
        currentBlobUrls.forEach(url => {
            try {
                URL.revokeObjectURL(url);
            } catch (e) {
                console.warn('[PreviewManager] Failed to revoke URL:', url, e);
            }
        });
        currentBlobUrls = [];
    }
}
