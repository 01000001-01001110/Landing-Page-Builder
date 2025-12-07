/**
 * Unit tests for html-validator.js
 * Tests HTML validation and auto-fix functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationResult, validateOutput, autoFixValidation } from '../js/html-validator.js';

// Mock callClaude for autoFixValidation tests
vi.mock('../js/claude-client.js', () => ({
  callClaude: vi.fn()
}));

import { callClaude } from '../js/claude-client.js';

describe('ValidationResult', () => {
  describe('constructor', () => {
    it('should initialize with empty arrays and score 100', () => {
      const result = new ValidationResult();
      expect(result.passes).toEqual([]);
      expect(result.warnings).toEqual([]);
      expect(result.errors).toEqual([]);
      expect(result.score).toBe(100);
    });
  });

  describe('addPass', () => {
    it('should add pass message to passes array', () => {
      const result = new ValidationResult();
      result.addPass('Test passed');
      expect(result.passes).toContain('Test passed');
      expect(result.score).toBe(100);
    });
  });

  describe('addWarning', () => {
    it('should add warning and decrease score by 5', () => {
      const result = new ValidationResult();
      result.addWarning('Test warning');
      expect(result.warnings).toContain('Test warning');
      expect(result.score).toBe(95);
    });

    it('should accumulate multiple warnings', () => {
      const result = new ValidationResult();
      result.addWarning('Warning 1');
      result.addWarning('Warning 2');
      expect(result.warnings).toHaveLength(2);
      expect(result.score).toBe(90);
    });
  });

  describe('addError', () => {
    it('should add error and decrease score by 15', () => {
      const result = new ValidationResult();
      result.addError('Test error');
      expect(result.errors).toContain('Test error');
      expect(result.score).toBe(85);
    });

    it('should accumulate multiple errors', () => {
      const result = new ValidationResult();
      result.addError('Error 1');
      result.addError('Error 2');
      expect(result.errors).toHaveLength(2);
      expect(result.score).toBe(70);
    });
  });

  describe('isValid', () => {
    it('should return true when no errors', () => {
      const result = new ValidationResult();
      result.addWarning('Warning');
      expect(result.isValid).toBe(true);
    });

    it('should return false when has errors', () => {
      const result = new ValidationResult();
      result.addError('Error');
      expect(result.isValid).toBe(false);
    });
  });

  describe('needsFixes', () => {
    it('should return false when no errors or warnings', () => {
      const result = new ValidationResult();
      result.addPass('Passed');
      expect(result.needsFixes).toBe(false);
    });

    it('should return true when has warnings', () => {
      const result = new ValidationResult();
      result.addWarning('Warning');
      expect(result.needsFixes).toBe(true);
    });

    it('should return true when has errors', () => {
      const result = new ValidationResult();
      result.addError('Error');
      expect(result.needsFixes).toBe(true);
    });
  });
});

describe('validateOutput', () => {
  const validHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      <header id="header">
        <nav>
          <a href="#hero">Hero</a>
          <a href="#features">Features</a>
          <a href="#cta">CTA</a>
        </nav>
      </header>
      <main>
        <section id="hero"><h1>Main Heading</h1></section>
        <section id="features"><h2>Features</h2></section>
        <section id="cta"><h2>CTA</h2></section>
      </main>
      <footer id="footer"></footer>
      <img src="images/hero.png" alt="Hero image">
    </body>
    </html>
  `;

  const validCSS = `
    :root {
      --primary: #007bff;
      --secondary: #6c757d;
    }
    body {
      color: var(--primary);
      background: var(--secondary);
    }
  `;

  describe('required elements check', () => {
    it('should pass when all required elements present', () => {
      const result = validateOutput({
        html: validHTML,
        css: validCSS,
        images: [{ filename: 'hero.png' }]
      });
      expect(result.passes.some(p => p.includes('required page elements'))).toBe(true);
    });

    it('should error when missing header', () => {
      const html = '<html><body><main><h1>Test</h1></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('Header'))).toBe(true);
    });

    it('should error when missing main', () => {
      const html = '<html><body><header></header><h1>Test</h1><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('Main content'))).toBe(true);
    });

    it('should error when missing footer', () => {
      const html = '<html><body><header></header><main><h1>Test</h1></main></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('Footer'))).toBe(true);
    });

    it('should error when missing h1', () => {
      const html = '<html><body><header></header><main><h2>Test</h2></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('H1'))).toBe(true);
    });

    it('should error when missing nav', () => {
      const html = '<html><body><header></header><main><h1>Test</h1></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('Navigation'))).toBe(true);
    });
  });

  describe('section IDs check', () => {
    it('should pass when all required section IDs present', () => {
      const result = validateOutput({
        html: validHTML,
        css: validCSS,
        images: [{ filename: 'hero.png' }]
      });
      expect(result.passes.some(p => p.includes('required section IDs'))).toBe(true);
    });

    it('should error when missing required section ID', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Test</h1><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('hero'))).toBe(true);
    });

    it('should warn when missing optional section IDs', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('footer') || w.includes('header'))).toBe(true);
    });
  });

  describe('navigation links check', () => {
    it('should pass when navigation links are valid', () => {
      const result = validateOutput({
        html: validHTML,
        css: validCSS,
        images: [{ filename: 'hero.png' }]
      });
      expect(result.passes.some(p => p.includes('navigation links correctly linked'))).toBe(true);
    });

    it('should error when navigation links are broken', () => {
      const html = `
        <html><body>
        <header><nav><a href="#nonexistent">Link</a></nav></header>
        <main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main>
        <footer></footer>
        </body></html>
      `;
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('Broken navigation'))).toBe(true);
    });
  });

  describe('image alt text check', () => {
    it('should pass when all images have alt text', () => {
      const result = validateOutput({
        html: validHTML,
        css: validCSS,
        images: [{ filename: 'hero.png' }]
      });
      expect(result.passes.some(p => p.includes('images have alt text'))).toBe(true);
    });

    it('should error when image missing alt attribute', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer><img src="test.png"></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.errors.some(e => e.includes('missing alt'))).toBe(true);
    });

    it('should warn when image has empty alt text', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer><img src="test.png" alt=""></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('empty alt'))).toBe(true);
    });
  });

  describe('image references check', () => {
    it('should pass when all referenced images are generated', () => {
      const result = validateOutput({
        html: validHTML,
        css: validCSS,
        images: [{ filename: 'hero.png' }]
      });
      expect(result.passes.some(p => p.includes('image references valid'))).toBe(true);
    });

    it('should error when referenced image not generated', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer><img src="images/missing.png" alt="Missing"></body></html>';
      const result = validateOutput({ html, css: '', images: [{ filename: 'other.png' }] });
      expect(result.errors.some(e => e.includes('missing.png'))).toBe(true);
    });

    it('should detect background-image references', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Test</h1><section id="hero" style="background-image: url(images/bg.png)"></section><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [{ filename: 'other.png' }] });
      expect(result.errors.some(e => e.includes('bg.png'))).toBe(true);
    });
  });

  describe('heading hierarchy check', () => {
    it('should pass when heading hierarchy is correct', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Main</h1><h2>Sub</h2><h3>Sub-sub</h3><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.passes.some(p => p.includes('Heading hierarchy is correct'))).toBe(true);
    });

    it('should warn when heading hierarchy skips levels', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Main</h1><h3>Skipped h2</h3><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('skips levels'))).toBe(true);
    });

    it('should warn when multiple h1 headings', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>First</h1><h1>Second</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('Multiple H1'))).toBe(true);
    });
  });

  describe('accessibility checks', () => {
    it('should warn when missing lang attribute', () => {
      const html = '<html><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('lang attribute'))).toBe(true);
    });

    it('should warn when missing viewport meta', () => {
      const html = '<html lang="en"><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('viewport'))).toBe(true);
    });

    it('should warn when empty buttons or links', () => {
      const html = '<html lang="en"><head><meta name="viewport" content="width=device-width"></head><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section><button></button></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('no text content'))).toBe(true);
    });

    it('should warn when form inputs missing labels', () => {
      const html = '<html lang="en"><head><meta name="viewport" content="width=device-width"></head><body><header><nav></nav></header><main><h1>Test</h1><section id="hero"></section><section id="features"></section><section id="cta"></section><input type="text"></main><footer></footer></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.warnings.some(w => w.includes('missing labels'))).toBe(true);
    });

    it('should pass accessibility when all checks pass', () => {
      const result = validateOutput({
        html: validHTML,
        css: validCSS,
        images: [{ filename: 'hero.png' }]
      });
      expect(result.passes.some(p => p.includes('accessibility checks passed'))).toBe(true);
    });
  });

  describe('CSS variables check', () => {
    it('should pass when all CSS variables are defined', () => {
      const result = validateOutput({
        html: validHTML,
        css: validCSS,
        images: [{ filename: 'hero.png' }]
      });
      expect(result.passes.some(p => p.includes('CSS variables defined'))).toBe(true);
    });

    it('should warn when CSS variables are undefined', () => {
      const css = 'body { color: var(--undefined-var); }';
      const result = validateOutput({ html: validHTML, css, images: [{ filename: 'hero.png' }] });
      expect(result.warnings.some(w => w.includes('Undefined CSS variables'))).toBe(true);
    });
  });

  describe('score calculation', () => {
    it('should not go below 0', () => {
      const html = '<html><body></body></html>';
      const result = validateOutput({ html, css: '', images: [] });
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('autoFixValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return output unchanged if no fixes needed', async () => {
    const output = { html: '<html></html>', css: 'body {}' };
    const validation = new ValidationResult();

    const result = await autoFixValidation(output, validation, 'test-key');

    expect(result).toEqual(output);
    expect(callClaude).not.toHaveBeenCalled();
  });

  it('should call Claude for auto-fix when fixes needed', async () => {
    const output = { html: '<html></html>', css: 'body {}' };
    const validation = new ValidationResult();
    validation.addError('Missing header');

    callClaude.mockResolvedValue(JSON.stringify({
      html: '<html><header></header></html>',
      css: 'body {}',
      fixesSummary: ['Added header']
    }));

    const result = await autoFixValidation(output, validation, 'test-key');

    expect(callClaude).toHaveBeenCalled();
    expect(result.html).toBe('<html><header></header></html>');
    expect(result.autoFixed).toBe(true);
  });

  it('should handle markdown wrapped response', async () => {
    const output = { html: '<html></html>', css: 'body {}' };
    const validation = new ValidationResult();
    validation.addWarning('Warning');

    callClaude.mockResolvedValue('```json\n{"html": "<fixed>", "css": "fixed {}", "fixesSummary": ["fixed"]}\n```');

    const result = await autoFixValidation(output, validation, 'test-key');

    expect(result.html).toBe('<fixed>');
    expect(result.css).toBe('fixed {}');
  });

  it('should return original output on error', async () => {
    const output = { html: '<html></html>', css: 'body {}' };
    const validation = new ValidationResult();
    validation.addError('Error');

    callClaude.mockRejectedValue(new Error('API Error'));

    const result = await autoFixValidation(output, validation, 'test-key');

    expect(result).toEqual(output);
  });
});
