// Image Prompt Predictor
// Generates predictable image prompts BEFORE Claude responds
// This allows parallel image generation while code is being generated

/**
 * Generate predictable image manifest based on user inputs
 * This runs independently of Claude, allowing parallel processing
 * @param {object} inputs - User form inputs
 * @returns {array} Predicted image manifest
 */
export function predictImageManifest(inputs) {
    const manifest = [];
    const { companyName, industry, style, imageStyle, primaryColor, featureCount, includeTestimonials } = inputs;

    // Helper to get style descriptions
    const getStyleDesc = () => {
        const styles = {
            'photorealistic': 'photorealistic photography with natural lighting',
            'illustrated': 'vector illustration style with clean lines',
            'abstract-geometric': 'abstract geometric shapes and patterns',
            '3d-render': '3D rendered with soft lighting',
            'flat-design': 'flat design with solid colors'
        };
        return styles[imageStyle] || styles['photorealistic'];
    };

    const styleDesc = getStyleDesc();
    const colorHex = primaryColor;

    // 1. HERO IMAGE (always included)
    manifest.push({
        filename: 'hero.png',
        aspectRatio: '16:9',
        prompt: `A ${styleDesc} hero image for a ${industry} company called ${companyName}. The scene shows a modern, professional environment that represents ${industry}. The composition uses a color palette centered around ${colorHex} with complementary tones. Natural lighting creates a welcoming, innovative atmosphere. The image has negative space in the left or right third for text overlay. Shot in wide 16:9 format with high attention to detail. The mood is ${style === 'bold-playful' ? 'energetic and dynamic' : style === 'corporate-trust' ? 'professional and trustworthy' : style === 'dark-sleek' ? 'modern and sophisticated' : style === 'warm-friendly' ? 'welcoming and approachable' : 'clean and minimal'}. No text in the image.`
    });

    // 2. FEATURE IMAGES (based on featureCount)
    const featureTopics = getFeatureTopics(industry, parseInt(featureCount));

    featureTopics.forEach((topic, index) => {
        manifest.push({
            filename: `feature-${index + 1}.png`,
            aspectRatio: '1:1',
            prompt: `A ${styleDesc} icon or image representing "${topic}" for a ${industry} company. The design is centered and simple, using ${colorHex} as the primary color with neutral accents. The composition is clean and modern, suitable for a feature showcase. Square 1:1 aspect ratio, with a ${style === 'modern-minimal' ? 'minimalist white' : style === 'dark-sleek' ? 'dark' : 'clean neutral'} background. The icon clearly conveys the concept of ${topic} through visual metaphor. Professional quality with attention to detail. No text in the image.`
        });
    });

    // 3. TESTIMONIAL BACKGROUND (if included)
    if (includeTestimonials) {
        manifest.push({
            filename: 'testimonial-bg.png',
            aspectRatio: '3:2',
            prompt: `A subtle ${styleDesc} background texture for a testimonials section of a ${industry} landing page. The design features soft, abstract patterns or gradients in muted tones that complement ${colorHex}. The mood is professional and trustworthy, creating visual interest without overwhelming text content. The composition is seamless and works well as a background. 3:2 aspect ratio. Very subtle and understated, allowing text to remain highly readable. No text in the image.`
        });
    }

    // 4. OPTIONAL: Pattern or accent image
    if (style === 'bold-playful' || style === 'warm-friendly') {
        manifest.push({
            filename: 'accent-pattern.png',
            aspectRatio: '1:1',
            prompt: `A decorative ${styleDesc} pattern or accent graphic for a ${industry} landing page. Playful, organic shapes using ${colorHex} and complementary colors. The design can be used as a background element or visual accent. Square 1:1 format, tileable or adaptable. Abstract and modern with a ${style === 'bold-playful' ? 'fun, energetic' : 'warm, friendly'} feel. No text in the image.`
        });
    }

    return manifest;
}

/**
 * Get feature topics based on industry
 * @param {string} industry - Industry type
 * @param {number} count - Number of features
 * @returns {array} Feature topics
 */
function getFeatureTopics(industry, count) {
    const topics = {
        'tech': ['Innovation', 'Automation', 'Analytics', 'Collaboration', 'Security', 'Scalability'],
        'healthcare': ['Patient Care', 'Medical Technology', 'Health Records', 'Telemedicine', 'Research', 'Wellness'],
        'finance': ['Security', 'Investment', 'Analytics', 'Compliance', 'Banking', 'Wealth Management'],
        'creative': ['Design', 'Creativity', 'Portfolio', 'Collaboration', 'Innovation', 'Inspiration'],
        'food-beverage': ['Quality', 'Freshness', 'Menu', 'Atmosphere', 'Service', 'Sustainability'],
        'retail': ['Products', 'Shopping', 'Delivery', 'Customer Service', 'Quality', 'Value'],
        'education': ['Learning', 'Curriculum', 'Students', 'Technology', 'Achievement', 'Community'],
        'real-estate': ['Properties', 'Location', 'Investment', 'Service', 'Market Expertise', 'Virtual Tours'],
        'other': ['Quality', 'Service', 'Innovation', 'Trust', 'Value', 'Excellence']
    };

    const industryTopics = topics[industry] || topics['other'];
    return industryTopics.slice(0, count);
}
