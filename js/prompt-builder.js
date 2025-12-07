// Prompt Builder - Constructs prompts for Claude API

/**
 * System prompt for Claude code generation
 */
export const CODE_GENERATION_SYSTEM_PROMPT = `You are an expert frontend developer specializing in creating modern, responsive landing pages.

CRITICAL REQUIREMENTS:
1. Generate production-ready HTML, CSS, and JavaScript
2. Use semantic HTML5 elements
3. CSS must be mobile-first and responsive
4. Use CSS custom properties (variables) for colors and spacing
5. Include smooth scroll behavior and subtle animations
6. All images must be referenced as: images/[filename].png

OUTPUT FORMAT:
You MUST respond with ONLY a valid JSON object (no markdown, no explanation):
{
  "html": "<!DOCTYPE html>...",
  "css": ":root { --primary: ... } ...",
  "js": "// JavaScript code...",
  "imageManifest": [
    {
      "filename": "hero.png",
      "prompt": "Detailed image generation prompt...",
      "aspectRatio": "16:9"
    }
  ]
}

IMAGE MANIFEST RULES:
- Generate 5-7 images total
- Include: hero image, 3 feature icons/images, testimonial background, optional pattern/texture
- Each prompt must be detailed (50-100 words) describing:
  - Scene composition
  - Lighting and mood
  - Color palette (match the landing page style)
  - Style (photorealistic, illustrated, etc.)
- Use appropriate aspect ratios: 16:9 for hero, 1:1 for features, 3:2 for testimonials
- Always end image prompts with "No text in the image."

CSS REQUIREMENTS:
- Use CSS Grid and Flexbox for layout
- Include :root with --primary, --secondary, --text, --background variables
- Mobile breakpoint at 768px
- Smooth transitions on interactive elements

HTML REQUIREMENTS:
- Sections: header, hero, features, testimonials (if included), cta, footer
- Each section must have descriptive id attributes
- Include proper ARIA labels for accessibility`;

/**
 * Build user prompt from inputs
 * @param {object} inputs - User input data
 * @returns {string} Formatted user prompt
 */
export function buildCodePrompt(inputs) {
    return `Create a complete landing page with the following specifications:

BRAND INFORMATION:
- Company Name: ${inputs.companyName}
- Slogan: ${inputs.slogan}
- Description: ${inputs.description}
- Industry: ${inputs.industry}

DESIGN SPECIFICATIONS:
- Visual Style: ${inputs.style}
- Primary Color: ${inputs.primaryColor}
- Image Style: ${inputs.imageStyle}
- CTA Button Text: "${inputs.ctaText}"

REQUIRED SECTIONS:
1. Header with logo (text-based) and navigation
2. Hero section with headline, subheadline, CTA button, and hero image
3. Features section with ${inputs.featureCount} features (icon + title + description each)
${inputs.includeTestimonials ? '4. Testimonials section with 3 customer quotes' : ''}
5. Call-to-action section with compelling copy and button
6. Footer with copyright and social links

STYLE GUIDE FOR "${inputs.style}":
${getStyleGuide(inputs.style)}

IMAGE STYLE GUIDE FOR "${inputs.imageStyle}":
${getImageStyleGuide(inputs.imageStyle)}

Remember: Output ONLY valid JSON with html, css, js, and imageManifest keys.`;
}

/**
 * Get style guide for a specific style
 * @param {string} style - Style name
 * @returns {string} Style guide
 */
function getStyleGuide(style) {
    const guides = {
        'modern-minimal': `
- Clean sans-serif typography (system fonts)
- Generous whitespace
- Subtle shadows and rounded corners
- Muted color palette with one accent color
- Thin borders and dividers`,

        'bold-playful': `
- Bold, chunky typography
- Vibrant, saturated colors
- Rounded shapes and elements
- Playful micro-interactions
- Gradient backgrounds`,

        'corporate-trust': `
- Professional serif headings, sans-serif body
- Navy, gray, and gold color palette
- Strong grid structure
- Subtle textures
- Clear visual hierarchy`,

        'dark-sleek': `
- Dark backgrounds (#0a0a0a to #1a1a1a)
- High contrast text
- Neon accent colors
- Glassmorphism effects
- Tech-forward aesthetic`,

        'warm-friendly': `
- Rounded, friendly typography
- Warm earth tones and pastels
- Soft gradients
- Hand-drawn or organic elements
- Approachable, human feel`
    };
    return guides[style] || guides['modern-minimal'];
}

/**
 * Get image style guide for a specific image style
 * @param {string} imageStyle - Image style name
 * @returns {string} Image style guide
 */
function getImageStyleGuide(imageStyle) {
    const guides = {
        'photorealistic': `
- Studio-quality photography aesthetic
- Natural lighting, soft shadows
- Real people and environments
- High detail and texture
- Professional color grading`,

        'illustrated': `
- Vector-style illustrations
- Flat or semi-flat design
- Consistent line weights
- Stylized characters and objects
- Cohesive color palette`,

        'abstract-geometric': `
- Geometric shapes and patterns
- Bold color blocks
- Minimalist composition
- Modern art influence
- Clean, mathematical precision`,

        '3d-render': `
- 3D rendered objects and scenes
- Soft global illumination
- Plastic or clay-like materials
- Isometric or perspective views
- Stylized realism`,

        'flat-design': `
- Simple, flat shapes
- No gradients or shadows
- Bold, solid colors
- Minimal detail
- Icon-like simplicity`
    };
    return guides[imageStyle] || guides['photorealistic'];
}
