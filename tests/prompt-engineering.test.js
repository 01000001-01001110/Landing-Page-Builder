/**
 * Unit tests for prompt-engineering.js
 * Tests advanced prompt engineering functionality
 */

import { describe, it, expect } from 'vitest';
import { ENHANCED_SYSTEM_PROMPT, buildEnhancedPrompt } from '../js/prompt-engineering.js';

describe('ENHANCED_SYSTEM_PROMPT', () => {
  it('should be a non-empty string', () => {
    expect(typeof ENHANCED_SYSTEM_PROMPT).toBe('string');
    expect(ENHANCED_SYSTEM_PROMPT.length).toBeGreaterThan(500);
  });

  it('should include mission statement', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('YOUR MISSION');
  });

  it('should include response format requirements', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Response Format');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('JSON');
  });

  it('should include HTML requirements', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('HTML Requirements');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('semantic HTML5');
  });

  it('should include accessibility requirements', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Accessibility');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('alt text');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('ARIA');
  });

  it('should include CSS requirements', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('CSS Requirements');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('CSS custom properties');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Mobile-first');
  });

  it('should include JavaScript requirements', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('JavaScript Requirements');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Smooth scroll');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Mobile menu');
  });

  it('should include image manifest requirements', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Image Manifest Requirements');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('5-7 high-quality images');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('75-150 words');
  });

  it('should include design quality checklist', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('DESIGN QUALITY CHECKLIST');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Visual Design');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('User Experience');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Technical Excellence');
  });

  it('should include performance requirements', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Performance');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Minimal CSS');
  });

  it('should include example image prompt', () => {
    expect(ENHANCED_SYSTEM_PROMPT).toContain('Example Image Prompt');
    expect(ENHANCED_SYSTEM_PROMPT).toContain('photorealistic');
  });
});

describe('buildEnhancedPrompt', () => {
  const baseInputs = {
    companyName: 'Acme Corp',
    slogan: 'Innovation at Scale',
    description: 'Leading technology solutions provider',
    industry: 'tech',
    style: 'modern-minimal',
    primaryColor: '#0078D4',
    imageStyle: 'photorealistic',
    ctaText: 'Start Free Trial',
    featureCount: 4,
    includeTestimonials: true
  };

  it('should include brand identity section', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('BRAND IDENTITY');
    expect(prompt).toContain('Acme Corp');
    expect(prompt).toContain('Innovation at Scale');
    expect(prompt).toContain('Leading technology solutions provider');
  });

  it('should include design specifications', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('DESIGN SPECIFICATIONS');
    expect(prompt).toContain('modern-minimal');
    expect(prompt).toContain('#0078D4');
    expect(prompt).toContain('photorealistic');
  });

  it('should include CTA text', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('Start Free Trial');
  });

  it('should include detailed style guide for modern-minimal', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('Less is more');
    expect(prompt).toContain('Typography');
    expect(prompt).toContain('Colors');
    expect(prompt).toContain('Layout');
    expect(prompt).toContain('Visual Elements');
  });

  it('should include detailed style guide for bold-playful', () => {
    const inputs = { ...baseInputs, style: 'bold-playful' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('Stand out');
    expect(prompt).toContain('Vibrant');
    expect(prompt).toContain('Asymmetric');
  });

  it('should include detailed style guide for corporate-trust', () => {
    const inputs = { ...baseInputs, style: 'corporate-trust' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('Professional and credible');
    expect(prompt).toContain('Serif');
    expect(prompt).toContain('Navy');
  });

  it('should include detailed style guide for dark-sleek', () => {
    const inputs = { ...baseInputs, style: 'dark-sleek' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('Modern and sophisticated');
    expect(prompt).toContain('Dark backgrounds');
    expect(prompt).toContain('Glassmorphism');
  });

  it('should include detailed style guide for warm-friendly', () => {
    const inputs = { ...baseInputs, style: 'warm-friendly' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('Approachable and human');
    expect(prompt).toContain('Warm earth tones');
    expect(prompt).toContain('Organic');
  });

  it('should fallback to modern-minimal for unknown style', () => {
    const inputs = { ...baseInputs, style: 'nonexistent' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('Less is more');
  });

  it('should include detailed image style guide for photorealistic', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('Professional photography');
    expect(prompt).toContain('Studio-quality lighting');
    expect(prompt).toContain('Composition');
  });

  it('should include detailed image style guide for illustrated', () => {
    const inputs = { ...baseInputs, imageStyle: 'illustrated' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('Vector illustration');
    expect(prompt).toContain('Clean vector');
    expect(prompt).toContain('Flat or semi-flat');
  });

  it('should include detailed image style guide for abstract-geometric', () => {
    const inputs = { ...baseInputs, imageStyle: 'abstract-geometric' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('geometric abstraction');
    expect(prompt).toContain('Mathematical precision');
    expect(prompt).toContain('Bold geometric');
  });

  it('should include detailed image style guide for 3d-render', () => {
    const inputs = { ...baseInputs, imageStyle: '3d-render' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('3D rendered');
    expect(prompt).toContain('global illumination');
    expect(prompt).toContain('Clay or plastic');
  });

  it('should include detailed image style guide for flat-design', () => {
    const inputs = { ...baseInputs, imageStyle: 'flat-design' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('Pure flat design');
    expect(prompt).toContain('no gradients');
    expect(prompt).toContain('Bold, solid colors');
  });

  it('should include industry context for tech', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('innovation');
    expect(prompt).toContain('efficiency');
  });

  it('should include industry context for healthcare', () => {
    const inputs = { ...baseInputs, industry: 'healthcare' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('trust');
    expect(prompt).toContain('care');
  });

  it('should include industry context for finance', () => {
    const inputs = { ...baseInputs, industry: 'finance' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('trust');
    expect(prompt).toContain('security');
  });

  it('should include industry context for creative', () => {
    const inputs = { ...baseInputs, industry: 'creative' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('creativity');
    expect(prompt).toContain('artistic');
  });

  it('should include industry context for food-beverage', () => {
    const inputs = { ...baseInputs, industry: 'food-beverage' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('appetizing');
    expect(prompt).toContain('quality');
  });

  it('should include industry context for retail', () => {
    const inputs = { ...baseInputs, industry: 'retail' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('products');
    expect(prompt).toContain('convenience');
  });

  it('should include industry context for education', () => {
    const inputs = { ...baseInputs, industry: 'education' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('transformation');
    expect(prompt).toContain('learning');
  });

  it('should include industry context for real-estate', () => {
    const inputs = { ...baseInputs, industry: 'real-estate' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('properties');
    expect(prompt).toContain('lifestyle');
  });

  it('should include industry context for other', () => {
    const inputs = { ...baseInputs, industry: 'other' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('unique value proposition');
  });

  it('should fallback to other for unknown industry', () => {
    const inputs = { ...baseInputs, industry: 'unknown-industry' };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).toContain('unique value proposition');
  });

  it('should include testimonials section when enabled', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('Testimonials Section');
    expect(prompt).toContain('3 customer testimonials');
  });

  it('should exclude testimonials section when disabled', () => {
    const inputs = { ...baseInputs, includeTestimonials: false };
    const prompt = buildEnhancedPrompt(inputs);
    expect(prompt).not.toContain('Testimonials Section');
  });

  it('should include required sections', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('Header');
    expect(prompt).toContain('Hero Section');
    expect(prompt).toContain('Features Section');
    expect(prompt).toContain('Call-to-Action Section');
    expect(prompt).toContain('Footer');
  });

  it('should include feature count', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('4 key features');
  });

  it('should include user psychology section', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('User Psychology');
    expect(prompt).toContain('trust');
  });

  it('should include output requirements', () => {
    const prompt = buildEnhancedPrompt(baseInputs);
    expect(prompt).toContain('OUTPUT REQUIREMENTS');
    expect(prompt).toContain('JSON object');
  });
});
