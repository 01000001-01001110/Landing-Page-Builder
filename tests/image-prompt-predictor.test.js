/**
 * Unit tests for image-prompt-predictor.js
 * Tests image manifest prediction functionality
 */

import { describe, it, expect } from 'vitest';
import { predictImageManifest } from '../js/image-prompt-predictor.js';

describe('predictImageManifest', () => {
  const baseInputs = {
    companyName: 'Test Corp',
    industry: 'tech',
    style: 'modern-minimal',
    imageStyle: 'photorealistic',
    primaryColor: '#0078D4',
    featureCount: 3,
    includeTestimonials: false
  };

  describe('hero image', () => {
    it('should always include a hero image', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero).toBeDefined();
    });

    it('should have 16:9 aspect ratio for hero', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.aspectRatio).toBe('16:9');
    });

    it('should include company name in hero prompt', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('Test Corp');
    });

    it('should include industry in hero prompt', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('tech');
    });

    it('should include primary color in hero prompt', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('#0078D4');
    });

    it('should include image style in hero prompt', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('photorealistic');
    });

    it('should end with no text instruction', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('No text in the image');
    });
  });

  describe('feature images', () => {
    it('should generate correct number of feature images', () => {
      const manifest = predictImageManifest(baseInputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      expect(features).toHaveLength(3);
    });

    it('should generate 4 feature images when featureCount is 4', () => {
      const inputs = { ...baseInputs, featureCount: 4 };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      expect(features).toHaveLength(4);
    });

    it('should generate 6 feature images when featureCount is 6', () => {
      const inputs = { ...baseInputs, featureCount: 6 };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      expect(features).toHaveLength(6);
    });

    it('should have 1:1 aspect ratio for features', () => {
      const manifest = predictImageManifest(baseInputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      features.forEach(feature => {
        expect(feature.aspectRatio).toBe('1:1');
      });
    });

    it('should have numbered filenames', () => {
      const manifest = predictImageManifest(baseInputs);
      expect(manifest.some(img => img.filename === 'feature-1.png')).toBe(true);
      expect(manifest.some(img => img.filename === 'feature-2.png')).toBe(true);
      expect(manifest.some(img => img.filename === 'feature-3.png')).toBe(true);
    });

    it('should include primary color in feature prompts', () => {
      const manifest = predictImageManifest(baseInputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      features.forEach(feature => {
        expect(feature.prompt).toContain('#0078D4');
      });
    });
  });

  describe('industry-specific feature topics', () => {
    it('should use tech topics for tech industry', () => {
      const manifest = predictImageManifest(baseInputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Innovation|Automation|Analytics/);
    });

    it('should use healthcare topics for healthcare industry', () => {
      const inputs = { ...baseInputs, industry: 'healthcare' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Patient Care|Medical Technology|Health Records/);
    });

    it('should use finance topics for finance industry', () => {
      const inputs = { ...baseInputs, industry: 'finance' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Security|Investment|Analytics/);
    });

    it('should use creative topics for creative industry', () => {
      const inputs = { ...baseInputs, industry: 'creative' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Design|Creativity|Portfolio/);
    });

    it('should use food topics for food-beverage industry', () => {
      const inputs = { ...baseInputs, industry: 'food-beverage' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Quality|Freshness|Menu/);
    });

    it('should use retail topics for retail industry', () => {
      const inputs = { ...baseInputs, industry: 'retail' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Products|Shopping|Delivery/);
    });

    it('should use education topics for education industry', () => {
      const inputs = { ...baseInputs, industry: 'education' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Learning|Curriculum|Students/);
    });

    it('should use real-estate topics for real-estate industry', () => {
      const inputs = { ...baseInputs, industry: 'real-estate' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Properties|Location|Investment/);
    });

    it('should use other topics for unknown industry', () => {
      const inputs = { ...baseInputs, industry: 'unknown' };
      const manifest = predictImageManifest(inputs);
      const features = manifest.filter(img => img.filename.startsWith('feature-'));
      const prompts = features.map(f => f.prompt).join(' ');
      expect(prompts).toMatch(/Quality|Service|Innovation/);
    });
  });

  describe('testimonial background', () => {
    it('should include testimonial bg when testimonials enabled', () => {
      const inputs = { ...baseInputs, includeTestimonials: true };
      const manifest = predictImageManifest(inputs);
      const testimonialBg = manifest.find(img => img.filename === 'testimonial-bg.png');
      expect(testimonialBg).toBeDefined();
    });

    it('should not include testimonial bg when testimonials disabled', () => {
      const manifest = predictImageManifest(baseInputs);
      const testimonialBg = manifest.find(img => img.filename === 'testimonial-bg.png');
      expect(testimonialBg).toBeUndefined();
    });

    it('should have 3:2 aspect ratio for testimonial bg', () => {
      const inputs = { ...baseInputs, includeTestimonials: true };
      const manifest = predictImageManifest(inputs);
      const testimonialBg = manifest.find(img => img.filename === 'testimonial-bg.png');
      expect(testimonialBg.aspectRatio).toBe('3:2');
    });

    it('should include industry in testimonial prompt', () => {
      const inputs = { ...baseInputs, includeTestimonials: true };
      const manifest = predictImageManifest(inputs);
      const testimonialBg = manifest.find(img => img.filename === 'testimonial-bg.png');
      expect(testimonialBg.prompt).toContain('tech');
    });
  });

  describe('accent pattern', () => {
    it('should include accent pattern for bold-playful style', () => {
      const inputs = { ...baseInputs, style: 'bold-playful' };
      const manifest = predictImageManifest(inputs);
      const accent = manifest.find(img => img.filename === 'accent-pattern.png');
      expect(accent).toBeDefined();
    });

    it('should include accent pattern for warm-friendly style', () => {
      const inputs = { ...baseInputs, style: 'warm-friendly' };
      const manifest = predictImageManifest(inputs);
      const accent = manifest.find(img => img.filename === 'accent-pattern.png');
      expect(accent).toBeDefined();
    });

    it('should not include accent pattern for modern-minimal style', () => {
      const manifest = predictImageManifest(baseInputs);
      const accent = manifest.find(img => img.filename === 'accent-pattern.png');
      expect(accent).toBeUndefined();
    });

    it('should not include accent pattern for corporate-trust style', () => {
      const inputs = { ...baseInputs, style: 'corporate-trust' };
      const manifest = predictImageManifest(inputs);
      const accent = manifest.find(img => img.filename === 'accent-pattern.png');
      expect(accent).toBeUndefined();
    });

    it('should have 1:1 aspect ratio for accent pattern', () => {
      const inputs = { ...baseInputs, style: 'bold-playful' };
      const manifest = predictImageManifest(inputs);
      const accent = manifest.find(img => img.filename === 'accent-pattern.png');
      expect(accent.aspectRatio).toBe('1:1');
    });

    it('should include energetic mood for bold-playful', () => {
      const inputs = { ...baseInputs, style: 'bold-playful' };
      const manifest = predictImageManifest(inputs);
      const accent = manifest.find(img => img.filename === 'accent-pattern.png');
      expect(accent.prompt).toContain('energetic');
    });

    it('should include friendly mood for warm-friendly', () => {
      const inputs = { ...baseInputs, style: 'warm-friendly' };
      const manifest = predictImageManifest(inputs);
      const accent = manifest.find(img => img.filename === 'accent-pattern.png');
      expect(accent.prompt).toContain('friendly');
    });
  });

  describe('image style descriptions', () => {
    it('should use photorealistic description', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('photorealistic photography');
    });

    it('should use illustrated description', () => {
      const inputs = { ...baseInputs, imageStyle: 'illustrated' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('vector illustration');
    });

    it('should use abstract-geometric description', () => {
      const inputs = { ...baseInputs, imageStyle: 'abstract-geometric' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('abstract geometric');
    });

    it('should use 3d-render description', () => {
      const inputs = { ...baseInputs, imageStyle: '3d-render' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('3D rendered');
    });

    it('should use flat-design description', () => {
      const inputs = { ...baseInputs, imageStyle: 'flat-design' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('flat design');
    });

    it('should fallback to photorealistic for unknown style', () => {
      const inputs = { ...baseInputs, imageStyle: 'unknown' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('photorealistic');
    });
  });

  describe('style-specific mood in hero', () => {
    it('should include energetic mood for bold-playful', () => {
      const inputs = { ...baseInputs, style: 'bold-playful' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('energetic');
    });

    it('should include professional mood for corporate-trust', () => {
      const inputs = { ...baseInputs, style: 'corporate-trust' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('professional');
    });

    it('should include sophisticated mood for dark-sleek', () => {
      const inputs = { ...baseInputs, style: 'dark-sleek' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('sophisticated');
    });

    it('should include welcoming mood for warm-friendly', () => {
      const inputs = { ...baseInputs, style: 'warm-friendly' };
      const manifest = predictImageManifest(inputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('welcoming');
    });

    it('should include minimal mood for modern-minimal', () => {
      const manifest = predictImageManifest(baseInputs);
      const hero = manifest.find(img => img.filename === 'hero.png');
      expect(hero.prompt).toContain('minimal');
    });
  });

  describe('total manifest count', () => {
    it('should have correct count with 3 features, no testimonials, minimal style', () => {
      const manifest = predictImageManifest(baseInputs);
      // 1 hero + 3 features = 4
      expect(manifest).toHaveLength(4);
    });

    it('should have correct count with testimonials', () => {
      const inputs = { ...baseInputs, includeTestimonials: true };
      const manifest = predictImageManifest(inputs);
      // 1 hero + 3 features + 1 testimonial bg = 5
      expect(manifest).toHaveLength(5);
    });

    it('should have correct count with accent pattern', () => {
      const inputs = { ...baseInputs, style: 'bold-playful' };
      const manifest = predictImageManifest(inputs);
      // 1 hero + 3 features + 1 accent = 5
      expect(manifest).toHaveLength(5);
    });

    it('should have correct count with all optional images', () => {
      const inputs = { ...baseInputs, style: 'bold-playful', includeTestimonials: true, featureCount: 6 };
      const manifest = predictImageManifest(inputs);
      // 1 hero + 6 features + 1 testimonial bg + 1 accent = 9
      expect(manifest).toHaveLength(9);
    });
  });
});
