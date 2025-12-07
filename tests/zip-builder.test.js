/**
 * Unit tests for zip-builder.js
 * Tests ZIP file creation functionality with mocked JSZip
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createZipDownload, triggerDownload } from '../js/zip-builder.js';

// Mock JSZip
const mockFile = vi.fn().mockReturnThis();
const mockFolder = vi.fn().mockImplementation(() => ({
  file: mockFile,
  folder: mockFolder
}));
const mockGenerateAsync = vi.fn().mockResolvedValue(new Blob(['zip content']));

const mockJSZip = vi.fn().mockImplementation(() => ({
  folder: mockFolder,
  file: mockFile,
  generateAsync: mockGenerateAsync
}));

// Set up window.JSZip
global.window = {
  JSZip: mockJSZip
};

describe('createZipDownload', () => {
  beforeEach(() => {
    mockFile.mockClear();
    mockFolder.mockClear();
    mockGenerateAsync.mockClear();
    mockJSZip.mockClear();
  });

  const baseOutput = {
    html: '<!DOCTYPE html><html></html>',
    css: 'body { margin: 0; }',
    js: 'console.log("hello");',
    images: [
      { filename: 'hero.png', blob: new Blob(['image1']) },
      { filename: 'feature-1.png', blob: new Blob(['image2']) }
    ],
    imageManifest: [
      { filename: 'hero.png', prompt: 'Hero image prompt that is quite long and detailed' },
      { filename: 'feature-1.png', prompt: 'Feature icon prompt that describes the image' }
    ]
  };

  it('should create JSZip instance', async () => {
    await createZipDownload(baseOutput, 'Test Company');

    expect(mockJSZip).toHaveBeenCalled();
  });

  it('should sanitize company name for folder', async () => {
    await createZipDownload(baseOutput, 'Test Company!@#$%');

    expect(mockFolder).toHaveBeenCalledWith('test-company');
  });

  it('should use fallback folder name for empty company name', async () => {
    await createZipDownload(baseOutput, '!!!');

    expect(mockFolder).toHaveBeenCalledWith('landing-page');
  });

  it('should create proper folder structure', async () => {
    await createZipDownload(baseOutput, 'MyCompany');

    expect(mockFolder).toHaveBeenCalledWith('mycompany');
    expect(mockFolder).toHaveBeenCalledWith('css');
    expect(mockFolder).toHaveBeenCalledWith('js');
    expect(mockFolder).toHaveBeenCalledWith('images');
  });

  it('should add HTML file', async () => {
    await createZipDownload(baseOutput, 'Test');

    expect(mockFile).toHaveBeenCalledWith('index.html', baseOutput.html);
  });

  it('should add CSS file', async () => {
    await createZipDownload(baseOutput, 'Test');

    expect(mockFile).toHaveBeenCalledWith('styles.css', baseOutput.css);
  });

  it('should add JS file', async () => {
    await createZipDownload(baseOutput, 'Test');

    expect(mockFile).toHaveBeenCalledWith('main.js', baseOutput.js);
  });

  it('should add all images', async () => {
    await createZipDownload(baseOutput, 'Test');

    expect(mockFile).toHaveBeenCalledWith('hero.png', baseOutput.images[0].blob);
    expect(mockFile).toHaveBeenCalledWith('feature-1.png', baseOutput.images[1].blob);
  });

  it('should add README.md', async () => {
    await createZipDownload(baseOutput, 'Test Company');

    const readmeCall = mockFile.mock.calls.find(call => call[0] === 'README.md');
    expect(readmeCall).toBeDefined();
    expect(readmeCall[1]).toContain('# Test Company Landing Page');
  });

  it('should include image manifest in README', async () => {
    await createZipDownload(baseOutput, 'Test');

    const readmeCall = mockFile.mock.calls.find(call => call[0] === 'README.md');
    expect(readmeCall[1]).toContain('hero.png');
    expect(readmeCall[1]).toContain('feature-1.png');
    expect(readmeCall[1]).toContain('Images Generated');
  });

  it('should generate ZIP with DEFLATE compression', async () => {
    await createZipDownload(baseOutput, 'Test');

    expect(mockGenerateAsync).toHaveBeenCalledWith({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });
  });

  it('should return ZIP blob', async () => {
    const result = await createZipDownload(baseOutput, 'Test');

    expect(result).toBeInstanceOf(Blob);
  });

  it('should handle lowercase conversion', async () => {
    await createZipDownload(baseOutput, 'UPPER CASE Company');

    expect(mockFolder).toHaveBeenCalledWith('upper-case-company');
  });

  it('should remove leading/trailing hyphens', async () => {
    await createZipDownload(baseOutput, '---Company Name---');

    expect(mockFolder).toHaveBeenCalledWith('company-name');
  });
});

describe('triggerDownload', () => {
  let mockLink;
  let mockCreateObjectURL;
  let mockRevokeObjectURL;

  beforeEach(() => {
    mockLink = {
      href: '',
      download: '',
      click: vi.fn()
    };

    document.createElement = vi.fn().mockReturnValue(mockLink);
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();

    mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    mockRevokeObjectURL = vi.fn();

    global.URL = {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create object URL from blob', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'test.zip');

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
  });

  it('should create anchor element', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'test.zip');

    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  it('should set href to blob URL', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'test.zip');

    expect(mockLink.href).toBe('blob:test-url');
  });

  it('should set download filename', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'my-download.zip');

    expect(mockLink.download).toBe('my-download.zip');
  });

  it('should append link to body', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'test.zip');

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
  });

  it('should click the link', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'test.zip');

    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should remove link from body', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'test.zip');

    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });

  it('should revoke object URL', () => {
    const blob = new Blob(['content']);
    triggerDownload(blob, 'test.zip');

    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });
});
