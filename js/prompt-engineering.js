// Advanced Prompt Engineering Module
// Based on best practices for Claude Sonnet 4.5

/**
 * Enhanced system prompt with extended thinking and quality checks
 */
export const ENHANCED_SYSTEM_PROMPT = `You are an elite frontend developer and design expert specializing in creating exceptional, production-ready landing pages.

# YOUR MISSION
Create a landing page that is not just functional, but remarkable. Every element should be thoughtfully crafted with attention to detail, user experience, and modern web standards.

# CRITICAL OUTPUT REQUIREMENTS

## 1. Response Format
You MUST respond with ONLY a valid JSON object. No markdown formatting, no explanations, no preambles.

Structure:
{
  "html": "...",
  "css": "...",
  "js": "...",
  "imageManifest": [...]
}

## 2. HTML Requirements

### Structure
- Use semantic HTML5 elements (<header>, <nav>, <main>, <section>, <article>, <footer>)
- Each section MUST have a descriptive ID (e.g., id="hero", id="features")
- Maintain clear hierarchy: one <h1>, logical <h2>-<h6> progression

### Accessibility (CRITICAL)
- Every image MUST have descriptive alt text
- Use ARIA labels for interactive elements
- Ensure proper heading hierarchy
- Add role attributes where appropriate
- Include skip-to-content links

### References
- All CSS references: <link rel="stylesheet" href="css/styles.css">
- All JS references: <script src="js/main.js"></script>
- All images: images/[filename].png

### Content Quality
- Headlines must be compelling and action-oriented
- Copy should be benefit-focused, not feature-focused
- Use social proof and specific numbers when appropriate
- CTAs should be clear and urgent without being pushy

## 3. CSS Requirements

### Architecture
- Use CSS custom properties (variables) in :root for all colors, spacing, and typography
- Mobile-first approach: base styles for mobile, @media for desktop
- Breakpoints: 768px (tablet), 1024px (desktop), 1280px (large desktop)

### Layout
- Use CSS Grid for page layout, Flexbox for components
- Ensure responsive behavior on all screen sizes
- Maintain consistent spacing using CSS variables

### Visual Design
- Smooth transitions (0.2s-0.3s) on all interactive elements
- Subtle hover states that provide feedback
- Use box-shadow sparingly for depth
- Ensure high contrast ratios (WCAG AA minimum: 4.5:1)

### Typography
- Use system font stack for performance
- Clear hierarchy: distinct sizes for h1-h6
- Line height: 1.6 for body, 1.2-1.3 for headings
- Responsive font sizes using clamp() or rem units

### Performance
- Avoid expensive properties in animations (use transform, opacity)
- Use will-change sparingly
- Keep selectors simple and efficient

## 4. JavaScript Requirements

### Functionality
- Smooth scroll for anchor links
- Mobile menu toggle (hamburger menu)
- Intersection Observer for scroll animations (optional but recommended)
- Form validation if forms are present

### Code Quality
- Use modern ES6+ syntax
- Add clear comments for complex logic
- No external dependencies (vanilla JS only)
- Ensure all interactive elements have proper event listeners

### Performance
- Use event delegation for multiple similar elements
- Debounce scroll/resize handlers if used
- Remove event listeners when not needed

## 5. Image Manifest Requirements

### Quantity
- Generate 5-7 high-quality images total:
  * 1 hero image (16:9 aspect ratio)
  * 3-6 feature images/icons (1:1 aspect ratio)
  * 1 testimonial/background image (3:2 aspect ratio, optional)

### Prompt Quality (CRITICAL)
Each image prompt must be 75-150 words and include:

1. **Scene Description** (30-40% of prompt)
   - What is in the image
   - Composition and framing
   - Subject matter details

2. **Visual Style** (25-35% of prompt)
   - Art style (match the imageStyle parameter)
   - Color palette (reference primary color)
   - Lighting and mood

3. **Technical Details** (20-25% of prompt)
   - Aspect ratio
   - Perspective/angle
   - Level of detail

4. **Constraints** (10-15% of prompt)
   - "No text in the image"
   - Background requirements
   - Negative space for overlays (if applicable)

### Example Image Prompt
"A photorealistic hero image showing a modern minimalist office space with a diverse team of three professionals collaborating around a large touchscreen display. The scene is captured from a slightly elevated angle, creating depth. Natural sunlight streams through floor-to-ceiling windows on the left, casting soft shadows and creating a warm, welcoming atmosphere. The color palette centers around [PRIMARY_COLOR] with complementary cool grays and warm whites. The team members are engaged and smiling, one pointing at the screen. The composition leaves significant negative space in the upper right quadrant for text overlay. Professional photography style with subtle depth of field, ultra-sharp focus on the central figures. 16:9 aspect ratio. No text in the image."

# DESIGN QUALITY CHECKLIST

Before finalizing your response, verify:

## Visual Design
- [ ] Color palette is cohesive (2-3 main colors max)
- [ ] Consistent spacing throughout (use 4px/8px grid)
- [ ] Clear visual hierarchy (size, weight, color)
- [ ] Sufficient whitespace (not cramped)
- [ ] Professional, polished aesthetic

## User Experience
- [ ] Clear value proposition in hero section
- [ ] Logical content flow (problem → solution → proof → CTA)
- [ ] Multiple CTAs placed strategically
- [ ] Social proof included (testimonials, stats, logos)
- [ ] Mobile experience is excellent, not just "functional"

## Technical Excellence
- [ ] Valid HTML5 (no unclosed tags, proper nesting)
- [ ] CSS has no syntax errors
- [ ] JavaScript has no runtime errors
- [ ] All images have unique, descriptive filenames
- [ ] Responsive on all screen sizes

## Performance
- [ ] Minimal CSS (under 2000 lines)
- [ ] Efficient selectors (no deep nesting)
- [ ] JavaScript is minimal and optimized
- [ ] No render-blocking code

## Accessibility
- [ ] Color contrast meets WCAG AA standards
- [ ] All interactive elements are keyboard accessible
- [ ] Screen reader friendly
- [ ] Semantic HTML throughout

# THINKING PROCESS

Use your extended thinking capabilities to:
1. Analyze the brand requirements deeply
2. Consider multiple design approaches
3. Evaluate trade-offs between different solutions
4. Ensure all requirements are met before responding
5. Validate your output against the checklist

# FINAL REMINDER

Your output will be used by real people building real businesses. Make it exceptional.
Create something you would be proud to have in your portfolio.
Quality over quantity. Attention to detail matters.`;

/**
 * Build enhanced user prompt with context and examples
 */
export function buildEnhancedPrompt(inputs) {
    return `Create a professional, high-converting landing page with the following specifications:

# BRAND IDENTITY

Company Name: ${inputs.companyName}
Tagline: ${inputs.slogan}
Description: ${inputs.description}
Industry: ${inputs.industry}

# DESIGN SPECIFICATIONS

Visual Style: ${inputs.style}
${getDetailedStyleGuide(inputs.style)}

Primary Brand Color: ${inputs.primaryColor}
Image Style: ${inputs.imageStyle}
${getDetailedImageStyleGuide(inputs.imageStyle)}

CTA Button Text: "${inputs.ctaText}"

# REQUIRED SECTIONS

1. **Header**
   - Logo (company name as text)
   - Navigation menu (Home, Features${inputs.includeTestimonials ? ', Testimonials' : ''}, Contact)
   - Mobile hamburger menu

2. **Hero Section**
   - Compelling headline (derived from slogan)
   - Supporting subheadline (2-3 sentences explaining value)
   - Primary CTA button
   - Hero image (high-quality, relevant to ${inputs.industry})

3. **Features Section**
   - ${inputs.featureCount} key features/benefits
   - Each feature should have:
     * Icon or image
     * Feature name
     * 2-3 sentence description
     * Focus on benefits, not just features

${inputs.includeTestimonials ? `4. **Testimonials Section**
   - 3 customer testimonials
   - Each with:
     * Quote (2-3 sentences, specific and credible)
     * Customer name
     * Customer title/company
     * Optional: customer photo placeholder or rating
   - Background image for visual interest` : ''}

5. **Call-to-Action Section**
   - Compelling headline
   - Supporting text emphasizing urgency/benefit
   - Primary CTA button
   - Optional: Trust indicators (security badge, guarantee, etc.)

6. **Footer**
   - Company name and tagline
   - Social media links (placeholder links to #)
   - Copyright notice
   - Optional: Quick links

# CONTEXT & INSPIRATION

Industry Context for ${inputs.industry}:
${getIndustryContext(inputs.industry)}

User Psychology:
- This landing page should establish trust immediately
- Use specific numbers and data points when possible
- Address pain points before presenting solutions
- Create urgency without manipulation

# OUTPUT REQUIREMENTS

Return a JSON object with:
- html: Complete, valid HTML5 document
- css: Production-ready CSS with variables
- js: Vanilla JavaScript for interactions
- imageManifest: Array of ${5 + parseInt(inputs.featureCount) - 3} detailed image prompts

Remember: This is a ${inputs.style} style landing page for ${inputs.industry}.
Every design decision should reflect this.`;
}

/**
 * Get detailed style guide with specific examples
 */
function getDetailedStyleGuide(style) {
    const guides = {
        'modern-minimal': `
**Design Philosophy:** "Less is more" - Clean, spacious, sophisticated

Typography:
- Font: System UI stack (SF Pro, Segoe UI, Roboto)
- Headlines: 48-72px, weight 700, tight letter-spacing
- Body: 16-18px, weight 400, line-height 1.6

Colors:
- Use 1-2 accent colors maximum
- Lots of white space and neutral backgrounds
- High contrast for readability

Layout:
- Generous margins (80px+ on desktop)
- Centered content, max-width 1200px
- Grid-based alignment

Visual Elements:
- Thin borders (1px) in light gray
- Subtle shadows (0 2px 8px rgba(0,0,0,0.1))
- Rounded corners (8-12px) sparingly
- Minimal use of decorative elements`,

        'bold-playful': `
**Design Philosophy:** "Stand out and be memorable" - Fun, energetic, youthful

Typography:
- Font: Rounded sans-serif or geometric typeface
- Headlines: 56-84px, weight 800, wide letter-spacing
- Body: 17-19px, weight 500, line-height 1.7

Colors:
- Vibrant, saturated colors (3-4 colors)
- Gradients encouraged
- High energy color combinations

Layout:
- Asymmetric layouts
- Overlapping elements
- Dynamic spacing

Visual Elements:
- Thick borders (3-5px) in bright colors
- Large rounded corners (16-24px)
- Drop shadows with color tints
- Playful icons and illustrations`,

        'corporate-trust': `
**Design Philosophy:** "Professional and credible" - Established, trustworthy

Typography:
- Font: Serif for headlines (Georgia), Sans-serif for body
- Headlines: 44-64px, weight 600
- Body: 16-18px, weight 400, line-height 1.7

Colors:
- Navy blues, grays, gold accents
- Muted, professional palette
- Subtle color usage

Layout:
- Structured grid system
- Symmetrical design
- Conservative spacing

Visual Elements:
- Subtle textures and patterns
- Traditional photography style
- Minimal shadows
- Classic, timeless elements`,

        'dark-sleek': `
**Design Philosophy:** "Modern and sophisticated" - Tech-forward, premium

Typography:
- Font: Modern sans-serif (Inter, Poppins)
- Headlines: 52-76px, weight 700
- Body: 16-18px, weight 300-400, line-height 1.7

Colors:
- Dark backgrounds (#0a0a0a to #1a1a1a)
- Neon accent colors (cyan, purple, pink)
- High contrast white/light gray text

Layout:
- Full-width sections
- Asymmetric layouts
- Floating elements

Visual Elements:
- Glassmorphism (backdrop-filter: blur)
- Gradient borders
- Glowing effects
- Futuristic UI elements`,

        'warm-friendly': `
**Design Philosophy:** "Approachable and human" - Welcoming, personal

Typography:
- Font: Rounded sans-serif
- Headlines: 46-68px, weight 600
- Body: 17-19px, weight 400, line-height 1.8

Colors:
- Warm earth tones (terracotta, sage, cream)
- Soft pastels
- Natural, organic palette

Layout:
- Organic, flowing layouts
- Soft edges and curves
- Comfortable spacing

Visual Elements:
- Soft, rounded corners (12-20px)
- Gentle shadows
- Organic shapes and illustrations
- Handwritten accent fonts (sparingly)`
    };

    return guides[style] || guides['modern-minimal'];
}

/**
 * Get detailed image style guide
 */
function getDetailedImageStyleGuide(imageStyle) {
    const guides = {
        'photorealistic': `
**Image Style:** Professional photography aesthetic

Characteristics:
- Studio-quality lighting with natural shadows
- Sharp focus with subtle depth of field
- Realistic textures and materials
- Professional color grading (cinematic look)
- Real people and environments
- High dynamic range

Lighting:
- Soft, diffused natural light preferred
- Golden hour warmth for lifestyle shots
- Clean, bright lighting for product/tech
- Avoid harsh shadows

Composition:
- Rule of thirds
- Leading lines and depth
- Balanced negative space`,

        'illustrated': `
**Image Style:** Vector illustration / digital art

Characteristics:
- Clean vector artwork
- Flat or semi-flat design
- Consistent line weights (2-4px)
- Stylized, simplified forms
- Cohesive color palette

Style Details:
- Smooth shapes and curves
- Geometric elements
- Character illustrations with personality
- Isometric or flat perspective

Technical:
- Solid colors or subtle gradients
- No photo textures
- Clean edges`,

        'abstract-geometric': `
**Image Style:** Modern geometric abstraction

Characteristics:
- Mathematical precision
- Bold geometric shapes
- Minimalist composition
- Strong contrast
- Limited color palette (2-4 colors)

Elements:
- Circles, triangles, polygons
- Grid systems
- Layered transparent shapes
- Negative space as design element

Mood:
- Modern and sophisticated
- Clean and precise
- Intellectually engaging`,

        '3d-render': `
**Image Style:** 3D rendered graphics

Characteristics:
- Soft global illumination
- Clay or plastic-like materials
- Pastel or vibrant colors
- Smooth, polished surfaces
- Isometric or perspective views

Lighting:
- Soft studio lighting
- Subtle ambient occlusion
- Gentle rim lighting
- No harsh shadows

Style:
- Stylized realism (not photorealistic)
- Clean, simple shapes
- Playful and approachable`,

        'flat-design': `
**Image Style:** Pure flat design

Characteristics:
- Absolutely no gradients or shadows
- Bold, solid colors only
- Simple geometric shapes
- Minimal detail
- Icon-like simplicity

Technical:
- 100% flat (2D)
- Limited color palette (3-5 colors)
- Clean, crisp edges
- High contrast

Composition:
- Centered and balanced
- Clear focal point
- Maximum simplicity`
    };

    return guides[imageStyle] || guides['photorealistic'];
}

/**
 * Get industry-specific context and best practices
 */
function getIndustryContext(industry) {
    const contexts = {
        'tech': 'Focus on innovation, efficiency, and results. Use clean, modern design. Emphasize data, metrics, and ROI. Target audience values productivity and cutting-edge solutions.',
        'healthcare': 'Emphasize trust, care, and expertise. Use calming colors. Focus on patient outcomes and peace of mind. Regulatory compliance is important.',
        'finance': 'Prioritize trust, security, and stability. Use professional imagery. Emphasize reliability, track record, and protection. Conservative design approach.',
        'creative': 'Showcase creativity and uniqueness. Bold, artistic design encouraged. Highlight portfolio and past work. Visual impact is critical.',
        'food-beverage': 'Use appetizing imagery and warm colors. Focus on sensory experience and quality. Emphasize freshness, taste, and experience.',
        'retail': 'Highlight products with clear pricing and value propositions. Easy navigation is key. Focus on convenience and selection.',
        'education': 'Emphasize transformation and outcomes. Use trustworthy, professional tone. Highlight credentials, success stories, and learning experience.',
        'real-estate': 'Showcase properties with stunning imagery. Emphasize location, lifestyle, and investment value. Professional, aspirational tone.',
        'other': 'Focus on unique value proposition and competitive advantages. Professional yet approachable design.'
    };

    return contexts[industry] || contexts['other'];
}
