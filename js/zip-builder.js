// ZIP Builder - Creates downloadable ZIP file

/**
 * Create ZIP file from generated output
 * @param {object} output - Generated output with html, css, js, and images
 * @param {string} companyName - Company name for folder name
 * @returns {Promise<Blob>} ZIP file blob
 */
export async function createZipDownload(output, companyName) {
    const JSZip = window.JSZip;
    const zip = new JSZip();

    // Sanitize folder name
    const folderName = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'landing-page';

    // Create folder structure
    const root = zip.folder(folderName);
    const cssFolder = root.folder('css');
    const jsFolder = root.folder('js');
    const imagesFolder = root.folder('images');

    // Add code files
    root.file('index.html', output.html);
    cssFolder.file('styles.css', output.css);
    jsFolder.file('main.js', output.js);

    // Add images
    for (const image of output.images) {
        imagesFolder.file(image.filename, image.blob);
    }

    // Add README
    const readme = generateReadme(companyName, output);
    root.file('README.md', readme);

    // Generate zip blob
    const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });

    return zipBlob;
}

/**
 * Trigger download of blob
 * @param {Blob} blob - File blob
 * @param {string} filename - Download filename
 */
export function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate README content
 * @param {string} companyName - Company name
 * @param {object} output - Generated output
 * @returns {string} README content
 */
function generateReadme(companyName, output) {
    const imagesList = output.imageManifest
        .map(img => `- ${img.filename}: ${img.prompt.substring(0, 100)}...`)
        .join('\n');

    return `# ${companyName} Landing Page

Generated with Landing Page Builder

## Files

- \`index.html\` - Main HTML file
- \`css/styles.css\` - Stylesheet
- \`js/main.js\` - JavaScript functionality
- \`images/\` - Generated images

## Usage

1. Open \`index.html\` in a browser
2. Or deploy to any static hosting (Netlify, Vercel, GitHub Pages, etc.)

## Customization

- Edit colors in \`css/styles.css\` (look for \`:root\` CSS variables)
- Replace images in the \`images/\` folder
- Modify text directly in \`index.html\`

## Images Generated

${imagesList}

---
Generated on ${new Date().toISOString()}
`;
}
