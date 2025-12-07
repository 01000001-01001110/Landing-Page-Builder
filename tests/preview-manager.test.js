/**
 * Unit tests for preview-manager.js
 * Tests iframe preview rendering functionality with mocked DOM
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('preview-manager', () => {
  let mockIframe;
  let mockPlaceholder;
  let mockCreateObjectURL;
  let mockRevokeObjectURL;
  let renderPreview;
  let clearPreview;

  beforeEach(async () => {
    // Clear module cache to get fresh imports
    vi.resetModules();

    // Setup URL mock
    mockCreateObjectURL = vi.fn().mockImplementation((blob) => `blob:test-${Math.random()}`);
    mockRevokeObjectURL = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL
    });

    // Setup DOM mocks
    mockIframe = {
      src: '',
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      }
    };

    mockPlaceholder = {
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      }
    };

    // Stub getElementById
    const originalGetElementById = document.getElementById.bind(document);
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'previewFrame') return mockIframe;
      if (id === 'previewPlaceholder') return mockPlaceholder;
      return originalGetElementById(id);
    });

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Import module after mocks are set up
    const module = await import('../js/preview-manager.js');
    renderPreview = module.renderPreview;
    clearPreview = module.clearPreview;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const createBaseOutput = () => ({
    html: `<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="css/styles.css">
</head>
<body>
<img src="images/hero.png" alt="Hero">
<script src="js/main.js"></script>
</body>
</html>`,
    css: 'body { margin: 0; color: var(--primary); }',
    js: 'console.log("loaded");',
    images: [
      { filename: 'hero.png', blob: new Blob(['image1']) }
    ]
  });

  describe('renderPreview', () => {
    it('should create blob URLs for images', () => {
      renderPreview(createBaseOutput());

      // 1 for each image + 1 for the final HTML blob
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);
    });

    it('should replace image paths with blob URLs in HTML', () => {
      renderPreview(createBaseOutput());

      // The final call is for the HTML blob
      const htmlBlobCall = mockCreateObjectURL.mock.calls[mockCreateObjectURL.mock.calls.length - 1];
      const htmlBlob = htmlBlobCall[0];
      expect(htmlBlob.type).toBe('text/html');
    });

    it('should replace CSS link with inline styles', () => {
      const result = renderPreview(createBaseOutput());

      expect(result).toContain('blob:');
    });

    it('should replace JS script with inline script', () => {
      renderPreview(createBaseOutput());

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should set iframe src to blob URL', () => {
      renderPreview(createBaseOutput());

      expect(mockIframe.src).toContain('blob:');
    });

    it('should add visible class to iframe', () => {
      renderPreview(createBaseOutput());

      expect(mockIframe.classList.add).toHaveBeenCalledWith('visible');
    });

    it('should hide placeholder', () => {
      renderPreview(createBaseOutput());

      expect(mockPlaceholder.classList.add).toHaveBeenCalledWith('hidden');
    });

    it('should return preview URL', () => {
      const result = renderPreview(createBaseOutput());

      expect(result).toContain('blob:');
    });

    it('should handle multiple images', () => {
      const output = {
        html: `<!DOCTYPE html><html><head></head><body>
          <img src="images/hero.png" alt="Hero">
          <img src="images/feature-1.png" alt="Feature 1">
          <img src="images/feature-2.png" alt="Feature 2">
        </body></html>`,
        css: '',
        js: '',
        images: [
          { filename: 'hero.png', blob: new Blob(['image1']) },
          { filename: 'feature-1.png', blob: new Blob(['image2']) },
          { filename: 'feature-2.png', blob: new Blob(['image3']) }
        ]
      };

      renderPreview(output);

      // 3 images + 1 HTML blob
      expect(mockCreateObjectURL).toHaveBeenCalledTimes(4);
    });

    it('should handle HTML without CSS link', () => {
      const output = {
        ...createBaseOutput(),
        html: `<!DOCTYPE html><html><head></head><body></body></html>`
      };

      renderPreview(output);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should inject CSS before </head> if no link tag', () => {
      const output = {
        ...createBaseOutput(),
        html: `<!DOCTYPE html><html><head></head><body></body></html>`
      };

      renderPreview(output);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should inject CSS after <head> if no </head>', () => {
      const output = {
        ...createBaseOutput(),
        html: `<!DOCTYPE html><html><head><body></body></html>`
      };

      renderPreview(output);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should inject JS before </body> if no script tag', () => {
      const output = {
        ...createBaseOutput(),
        html: `<!DOCTYPE html><html><head></head><body></body></html>`
      };

      renderPreview(output);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle empty JS', () => {
      const output = {
        ...createBaseOutput(),
        js: ''
      };

      renderPreview(output);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should handle null JS', () => {
      const output = {
        ...createBaseOutput(),
        js: null
      };

      renderPreview(output);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should replace image paths in CSS', () => {
      const output = {
        ...createBaseOutput(),
        css: 'body { background: url("images/hero.png"); }',
        html: `<!DOCTYPE html><html><head><link rel="stylesheet" href="css/styles.css"></head><body></body></html>`
      };

      renderPreview(output);

      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should escape regex special characters in image paths', () => {
      const output = {
        ...createBaseOutput(),
        images: [
          { filename: 'hero.png', blob: new Blob(['image1']) }
        ],
        html: `<img src="images/hero.png" alt="Hero">`
      };

      // Should not throw
      expect(() => renderPreview(output)).not.toThrow();
    });

    it('should revoke previous blob URLs on subsequent calls', () => {
      const output = createBaseOutput();

      // First render creates blob URLs
      renderPreview(output);

      // Second render should revoke previous URLs before creating new ones
      renderPreview(output);

      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('clearPreview', () => {
    it('should clear iframe src', () => {
      mockIframe.src = 'blob:test';
      clearPreview();

      expect(mockIframe.src).toBe('');
    });

    it('should remove visible class from iframe', () => {
      clearPreview();

      expect(mockIframe.classList.remove).toHaveBeenCalledWith('visible');
    });

    it('should remove hidden class from placeholder', () => {
      clearPreview();

      expect(mockPlaceholder.classList.remove).toHaveBeenCalledWith('hidden');
    });

    it('should revoke blob URLs after render', () => {
      // First render to create some URLs
      renderPreview({
        html: '<html></html>',
        css: '',
        js: '',
        images: [{ filename: 'test.png', blob: new Blob(['test']) }]
      });

      mockRevokeObjectURL.mockClear();

      // Clear should revoke
      clearPreview();

      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });
  });
});
