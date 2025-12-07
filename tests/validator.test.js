/**
 * Unit tests for validator.js
 * Tests code quality validation functionality
 */

import { describe, it, expect } from 'vitest';
import { validateGeneratedCode } from '../js/validator.js';

describe('validateGeneratedCode', () => {
  describe('HTML validation', () => {
    it('should pass when HTML has DOCTYPE declaration', () => {
      const output = {
        html: '<!DOCTYPE html><html><head></head><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('DOCTYPE'))).toBe(true);
    });

    it('should error when HTML missing DOCTYPE', () => {
      const output = {
        html: '<html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.errors.some(e => e.includes('DOCTYPE'))).toBe(true);
    });

    it('should pass when HTML has html tag', () => {
      const output = {
        html: '<!DOCTYPE html><html lang="en"><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('html tag'))).toBe(true);
    });

    it('should pass when HTML has semantic elements', () => {
      const output = {
        html: '<!DOCTYPE html><html><header></header><nav></nav><main></main><section></section><footer></footer><h1>Test</h1></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('<header'))).toBe(true);
      expect(result.passes.some(p => p.includes('<nav'))).toBe(true);
      expect(result.passes.some(p => p.includes('<main'))).toBe(true);
    });

    it('should pass when HTML has h1 heading', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Main Heading</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('h1'))).toBe(true);
    });

    it('should warn when HTML missing h1 heading', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h2>Secondary Heading</h2></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('h1'))).toBe(true);
    });

    it('should pass when HTML has CSS reference', () => {
      const output = {
        html: '<!DOCTYPE html><html><head><link rel="stylesheet" href="css/styles.css"></head><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('CSS reference'))).toBe(true);
    });

    it('should pass when images have alt text', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1><img src="hero.png" alt="Hero image"></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('alt text'))).toBe(true);
    });

    it('should warn when images missing alt text', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1><img src="hero.png"></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('alt text'))).toBe(true);
    });

    it('should pass when HTML has viewport meta tag', () => {
      const output = {
        html: '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width"></head><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('viewport'))).toBe(true);
    });
  });

  describe('CSS validation', () => {
    it('should pass when CSS uses custom properties', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --primary-color: blue; --secondary: green; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('custom properties'))).toBe(true);
    });

    it('should warn when CSS not using custom properties', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: 'body { color: blue; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('custom properties'))).toBe(true);
    });

    it('should pass when CSS has media queries', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) { .test { display: block; } }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('media queries'))).toBe(true);
    });

    it('should warn when CSS has no media queries', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } body { color: black; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('media queries'))).toBe(true);
    });

    it('should pass when CSS uses transitions', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .btn { transition: all 0.3s ease; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('transition'))).toBe(true);
    });

    it('should pass when CSS uses Flexbox', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .container { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('Flexbox') || p.includes('Grid'))).toBe(true);
    });

    it('should pass when CSS uses Grid', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .container { display: grid; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('Grid'))).toBe(true);
    });
  });

  describe('JavaScript validation', () => {
    it('should pass for empty JS (static page)', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('static page'))).toBe(true);
    });

    it('should pass when JS has function definitions', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: 'function handleClick() { return true; }',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('function'))).toBe(true);
    });

    it('should pass when JS uses arrow functions', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: 'const handleClick = () => { return true; };',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('function'))).toBe(true);
    });

    it('should pass when JS uses addEventListener', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: 'document.addEventListener("click", () => {});',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('event listeners'))).toBe(true);
    });

    it('should pass when JS uses const/let', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: 'const x = 1; let y = 2;',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('const/let'))).toBe(true);
    });

    it('should warn when JS uses var', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: 'var x = 1;',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('var'))).toBe(true);
    });

    it('should warn when JS contains console.log', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: 'console.log("debug");',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('console.log'))).toBe(true);
    });
  });

  describe('Image manifest validation', () => {
    it('should error when imageManifest is not an array', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: 'not-an-array'
      };

      const result = validateGeneratedCode(output);
      expect(result.errors.some(e => e.includes('array'))).toBe(true);
    });

    it('should pass for optimal image count (5-7)', () => {
      const images = Array.from({ length: 6 }, (_, i) => ({
        filename: `image-${i}.png`,
        prompt: 'A '.repeat(80) // ~80 words
      }));

      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: images
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('optimal'))).toBe(true);
    });

    it('should warn for too few images', () => {
      const images = [
        { filename: 'hero.png', prompt: 'A '.repeat(80) }
      ];

      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: images
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('Only 1 image'))).toBe(true);
    });

    it('should error when image missing filename', () => {
      const images = [
        { prompt: 'A '.repeat(80) }
      ];

      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: images
      };

      const result = validateGeneratedCode(output);
      expect(result.errors.some(e => e.includes('filename'))).toBe(true);
    });

    it('should error when image missing prompt', () => {
      const images = [
        { filename: 'hero.png' }
      ];

      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: images
      };

      const result = validateGeneratedCode(output);
      expect(result.errors.some(e => e.includes('prompt'))).toBe(true);
    });

    it('should warn when prompt is too short', () => {
      const images = [
        { filename: 'hero.png', prompt: 'A short prompt' } // ~3 words
      ];

      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: images
      };

      const result = validateGeneratedCode(output);
      expect(result.warnings.some(w => w.includes('too short'))).toBe(true);
    });

    it('should pass for prompt with optimal length (75-150 words)', () => {
      const images = [
        { filename: 'hero.png', prompt: 'word '.repeat(100) } // 100 words
      ];

      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: images
      };

      const result = validateGeneratedCode(output);
      expect(result.passes.some(p => p.includes('detailed prompt'))).toBe(true);
    });
  });

  describe('Quality score calculation', () => {
    it('should return score between 0 and 100', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should return isValid true when no errors', () => {
      const output = {
        html: '<!DOCTYPE html><html><body><h1>Test</h1></body></html>',
        css: ':root { --color: blue; } @media (max-width: 768px) {} .test { display: flex; }',
        js: '',
        imageManifest: []
      };

      const result = validateGeneratedCode(output);
      expect(result.isValid).toBe(true);
    });

    it('should return isValid false when there are errors', () => {
      const output = {
        html: '<body><h1>Test</h1></body>', // Missing DOCTYPE and html tag
        css: '',
        js: '',
        imageManifest: 'not-an-array'
      };

      const result = validateGeneratedCode(output);
      expect(result.isValid).toBe(false);
    });
  });
});
