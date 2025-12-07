/**
 * Unit tests for prompt-builder.js
 * Tests prompt construction functionality
 */

import { describe, it, expect } from 'vitest';
import { CODE_GENERATION_SYSTEM_PROMPT, buildCodePrompt } from '../js/prompt-builder.js';

describe('CODE_GENERATION_SYSTEM_PROMPT', () => {
  it('should be a non-empty string', () => {
    expect(typeof CODE_GENERATION_SYSTEM_PROMPT).toBe('string');
    expect(CODE_GENERATION_SYSTEM_PROMPT.length).toBeGreaterThan(100);
  });

  it('should include critical requirements', () => {
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('CRITICAL REQUIREMENTS');
  });

  it('should specify JSON output format', () => {
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('JSON');
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('html');
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('css');
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('imageManifest');
  });

  it('should include image manifest rules', () => {
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('IMAGE MANIFEST RULES');
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('5-7 images');
  });

  it('should include CSS requirements', () => {
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('CSS REQUIREMENTS');
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('CSS Grid');
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('Flexbox');
  });

  it('should include HTML requirements', () => {
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('HTML REQUIREMENTS');
    expect(CODE_GENERATION_SYSTEM_PROMPT).toContain('semantic');
  });
});

describe('buildCodePrompt', () => {
  const baseInputs = {
    companyName: 'Test Company',
    slogan: 'Test Slogan',
    description: 'Test Description',
    industry: 'tech',
    style: 'modern-minimal',
    primaryColor: '#007bff',
    imageStyle: 'photorealistic',
    ctaText: 'Get Started',
    featureCount: 3,
    includeTestimonials: true
  };

  it('should include company name', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Test Company');
  });

  it('should include slogan', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Test Slogan');
  });

  it('should include description', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Test Description');
  });

  it('should include industry', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('tech');
  });

  it('should include style', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('modern-minimal');
  });

  it('should include primary color', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('#007bff');
  });

  it('should include image style', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('photorealistic');
  });

  it('should include CTA text', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Get Started');
  });

  it('should include feature count', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('3 features');
  });

  it('should include testimonials section when enabled', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Testimonials');
  });

  it('should exclude testimonials section when disabled', () => {
    const inputs = { ...baseInputs, includeTestimonials: false };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).not.toContain('Testimonials section');
  });

  it('should include style guide for modern-minimal', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Clean sans-serif');
    expect(prompt).toContain('whitespace');
  });

  it('should include style guide for bold-playful', () => {
    const inputs = { ...baseInputs, style: 'bold-playful' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Bold');
    expect(prompt).toContain('Vibrant');
  });

  it('should include style guide for corporate-trust', () => {
    const inputs = { ...baseInputs, style: 'corporate-trust' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Professional');
    expect(prompt).toContain('Navy');
  });

  it('should include style guide for dark-sleek', () => {
    const inputs = { ...baseInputs, style: 'dark-sleek' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Dark backgrounds');
    expect(prompt).toContain('Neon');
  });

  it('should include style guide for warm-friendly', () => {
    const inputs = { ...baseInputs, style: 'warm-friendly' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Warm');
    expect(prompt).toContain('friendly');
  });

  it('should fallback to modern-minimal for unknown style', () => {
    const inputs = { ...baseInputs, style: 'unknown-style' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Clean sans-serif');
  });

  it('should include image style guide for photorealistic', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Studio-quality');
    expect(prompt).toContain('photography');
  });

  it('should include image style guide for illustrated', () => {
    const inputs = { ...baseInputs, imageStyle: 'illustrated' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Vector');
    expect(prompt).toContain('illustration');
  });

  it('should include image style guide for abstract-geometric', () => {
    const inputs = { ...baseInputs, imageStyle: 'abstract-geometric' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Geometric');
    expect(prompt).toContain('shapes');
  });

  it('should include image style guide for 3d-render', () => {
    const inputs = { ...baseInputs, imageStyle: '3d-render' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('3D');
    expect(prompt).toContain('render');
  });

  it('should include image style guide for flat-design', () => {
    const inputs = { ...baseInputs, imageStyle: 'flat-design' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('flat');
    expect(prompt).toContain('solid colors');
  });

  it('should fallback to photorealistic for unknown image style', () => {
    const inputs = { ...baseInputs, imageStyle: 'unknown' };
    const prompt = buildCodePrompt(inputs);
    expect(prompt).toContain('Studio-quality');
  });

  it('should include required sections', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('Header');
    expect(prompt).toContain('Hero section');
    expect(prompt).toContain('Features section');
    expect(prompt).toContain('Call-to-action');
    expect(prompt).toContain('Footer');
  });

  it('should remind about JSON output', () => {
    const prompt = buildCodePrompt(baseInputs);
    expect(prompt).toContain('JSON');
  });
});
