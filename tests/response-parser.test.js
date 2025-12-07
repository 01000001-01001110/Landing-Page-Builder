/**
 * Unit tests for response-parser.js
 * Tests Claude API response parsing functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parseClaudeResponse, parseApiResponse } from '../js/response-parser.js';

// Suppress console output during tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('parseClaudeResponse', () => {
  describe('valid JSON responses', () => {
    it('should parse direct JSON response', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<!DOCTYPE html><html></html>',
            css: 'body { color: black; }',
            js: 'console.log("test");',
            imageManifest: [
              { filename: 'hero.png', prompt: 'A hero image' }
            ]
          })
        }]
      };

      const result = parseClaudeResponse(response);

      expect(result.html).toBe('<!DOCTYPE html><html></html>');
      expect(result.css).toBe('body { color: black; }');
      expect(result.js).toBe('console.log("test");');
      expect(result.imageManifest).toHaveLength(1);
    });

    it('should parse JSON wrapped in markdown code blocks', () => {
      const jsonContent = JSON.stringify({
        html: '<html></html>',
        css: '.test {}',
        js: '',
        imageManifest: [{ filename: 'test.png', prompt: 'test' }]
      });

      const response = {
        content: [{
          text: '```json\n' + jsonContent + '\n```'
        }]
      };

      const result = parseClaudeResponse(response);

      expect(result.html).toBe('<html></html>');
      expect(result.css).toBe('.test {}');
    });

    it('should parse JSON with preamble text', () => {
      const jsonContent = JSON.stringify({
        html: '<html></html>',
        css: '.test {}',
        js: '',
        imageManifest: [{ filename: 'test.png', prompt: 'test' }]
      });

      const response = {
        content: [{
          text: 'Here is the generated code:\n' + jsonContent
        }]
      };

      const result = parseClaudeResponse(response);

      expect(result.html).toBe('<html></html>');
    });

    it('should handle empty JS field gracefully', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<html></html>',
            css: '.test {}',
            imageManifest: [{ filename: 'test.png', prompt: 'test' }]
          })
        }]
      };

      const result = parseClaudeResponse(response);

      expect(result.js).toBe('');
    });
  });

  describe('required fields validation', () => {
    it('should throw error when HTML is missing', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            css: '.test {}',
            js: '',
            imageManifest: []
          })
        }]
      };

      expect(() => parseClaudeResponse(response)).toThrow('Missing HTML');
    });

    it('should throw error when CSS is missing', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<html></html>',
            js: '',
            imageManifest: []
          })
        }]
      };

      expect(() => parseClaudeResponse(response)).toThrow('Missing CSS');
    });

    it('should throw error when imageManifest is missing', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<html></html>',
            css: '.test {}',
            js: ''
          })
        }]
      };

      expect(() => parseClaudeResponse(response)).toThrow('imageManifest');
    });

    it('should throw error when imageManifest is not an array', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<html></html>',
            css: '.test {}',
            js: '',
            imageManifest: 'not-an-array'
          })
        }]
      };

      expect(() => parseClaudeResponse(response)).toThrow('imageManifest');
    });
  });

  describe('image manifest validation', () => {
    it('should throw error when image is missing filename', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<html></html>',
            css: '.test {}',
            js: '',
            imageManifest: [{ prompt: 'A test image' }]
          })
        }]
      };

      expect(() => parseClaudeResponse(response)).toThrow('filename');
    });

    it('should throw error when image is missing prompt', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<html></html>',
            css: '.test {}',
            js: '',
            imageManifest: [{ filename: 'test.png' }]
          })
        }]
      };

      expect(() => parseClaudeResponse(response)).toThrow('prompt');
    });

    it('should accept valid image manifest', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            html: '<html></html>',
            css: '.test {}',
            js: '',
            imageManifest: [
              { filename: 'hero.png', prompt: 'A hero image' },
              { filename: 'feature-1.png', prompt: 'Feature one image' }
            ]
          })
        }]
      };

      const result = parseClaudeResponse(response);

      expect(result.imageManifest).toHaveLength(2);
      expect(result.imageManifest[0].filename).toBe('hero.png');
      expect(result.imageManifest[1].filename).toBe('feature-1.png');
    });
  });

  describe('error handling', () => {
    it('should throw error when no text content', () => {
      const response = {
        content: [{}]
      };

      expect(() => parseClaudeResponse(response)).toThrow('No text content');
    });

    it('should throw error when content is empty', () => {
      const response = {
        content: []
      };

      expect(() => parseClaudeResponse(response)).toThrow('No text content');
    });

    it('should throw error for invalid JSON', () => {
      const response = {
        content: [{
          text: 'This is not JSON at all, just plain text.'
        }]
      };

      expect(() => parseClaudeResponse(response)).toThrow();
    });
  });

  describe('parsing strategies', () => {
    it('should handle JSON with trailing text', () => {
      const jsonContent = JSON.stringify({
        html: '<html></html>',
        css: '.test {}',
        js: '',
        imageManifest: [{ filename: 'test.png', prompt: 'test' }]
      });

      const response = {
        content: [{
          text: jsonContent + '\n\nI hope this helps!'
        }]
      };

      const result = parseClaudeResponse(response);

      expect(result.html).toBe('<html></html>');
    });

    it('should handle JSON with whitespace', () => {
      const response = {
        content: [{
          text: '   \n\n' + JSON.stringify({
            html: '<html></html>',
            css: '.test {}',
            js: '',
            imageManifest: [{ filename: 'test.png', prompt: 'test' }]
          }) + '   \n\n'
        }]
      };

      const result = parseClaudeResponse(response);

      expect(result.html).toBe('<html></html>');
    });
  });
});

describe('parseApiResponse', () => {
  describe('valid responses', () => {
    it('should parse simple JSON response', () => {
      const response = {
        content: [{
          text: JSON.stringify({ key: 'value', nested: { a: 1 } })
        }]
      };

      const result = parseApiResponse(response, 'test-task');

      expect(result.key).toBe('value');
      expect(result.nested.a).toBe(1);
    });

    it('should parse JSON in markdown code blocks', () => {
      const response = {
        content: [{
          text: '```json\n{"color": "#FF0000"}\n```'
        }]
      };

      const result = parseApiResponse(response, 'colors');

      expect(result.color).toBe('#FF0000');
    });

    it('should extract JSON from text with preamble', () => {
      const response = {
        content: [{
          text: 'Here are the colors:\n{"primary": "blue", "secondary": "green"}'
        }]
      };

      const result = parseApiResponse(response, 'colors');

      expect(result.primary).toBe('blue');
      expect(result.secondary).toBe('green');
    });
  });

  describe('error handling', () => {
    it('should throw error when no text content', () => {
      const response = {
        content: [{}]
      };

      expect(() => parseApiResponse(response, 'test')).toThrow('No text content');
    });

    it('should throw error for completely invalid content', () => {
      const response = {
        content: [{
          text: 'This is just plain text with no JSON structure at all.'
        }]
      };

      expect(() => parseApiResponse(response, 'test')).toThrow();
    });

    it('should include task name in error message', () => {
      const response = {
        content: [{
          text: 'invalid'
        }]
      };

      expect(() => parseApiResponse(response, 'my-custom-task')).toThrow('my-custom-task');
    });
  });

  describe('complex JSON structures', () => {
    it('should handle nested objects', () => {
      const complexData = {
        typography: {
          fontFamily: { primary: 'Inter', heading: 'Montserrat' },
          fontSize: { sm: '0.875rem', base: '1rem', lg: '1.125rem' }
        },
        colors: {
          primary: '#3B82F6',
          neutral: { 50: '#F9FAFB', 900: '#111827' }
        }
      };

      const response = {
        content: [{
          text: JSON.stringify(complexData)
        }]
      };

      const result = parseApiResponse(response, 'design-system');

      expect(result.typography.fontFamily.primary).toBe('Inter');
      expect(result.colors.neutral['50']).toBe('#F9FAFB');
    });

    it('should handle arrays in response', () => {
      const response = {
        content: [{
          text: JSON.stringify({
            features: ['Fast', 'Reliable', 'Secure'],
            stats: [{ value: 99, label: 'Uptime' }]
          })
        }]
      };

      const result = parseApiResponse(response, 'content');

      expect(result.features).toHaveLength(3);
      expect(result.stats[0].value).toBe(99);
    });
  });
});
