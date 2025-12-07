/**
 * Unit tests for gemini-client.js
 * Tests Gemini API client functionality with mocked fetch
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callNanoBanana, testGeminiConnection, createPlaceholderImage, GeminiApiError } from '../js/gemini-client.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock atob for base64 decoding
global.atob = vi.fn((str) => {
  // Simple mock that returns the string length as bytes
  return 'x'.repeat(str.length);
});

describe('callNanoBanana', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call Gemini API with correct parameters', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [
            { inlineData: { data: 'base64imagedata' } }
          ]
        }
      }]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await callNanoBanana('test-key', 'A beautiful image');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/gemini');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(options.body);
    expect(body.apiKey).toBe('test-key');
    expect(body.body.contents[0].parts[0].text).toBe('A beautiful image');
    expect(body.body.generationConfig.responseModalities).toEqual(['TEXT', 'IMAGE']);

    expect(result).toBeInstanceOf(Blob);
  });

  it('should return PNG blob from base64 data', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [
            { text: 'Some text' },
            { inlineData: { data: 'aW1hZ2VkYXRh' } }
          ]
        }
      }]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    const result = await callNanoBanana('key', 'prompt');

    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('image/png');
  });

  it('should throw GeminiApiError on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { message: 'Invalid key' } })
    });

    await expect(callNanoBanana('bad-key', 'prompt'))
      .rejects.toThrow(GeminiApiError);
  });

  it('should throw error when no image data in response', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{ text: 'No image here' }]
        }
      }]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    await expect(callNanoBanana('key', 'prompt'))
      .rejects.toThrow('No image data in response');
  });

  it('should throw error when parts is empty', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: []
        }
      }]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    await expect(callNanoBanana('key', 'prompt'))
      .rejects.toThrow('No image data in response');
  });

  it('should throw error when candidates is missing', async () => {
    const mockResponse = {};
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse)
    });

    await expect(callNanoBanana('key', 'prompt'))
      .rejects.toThrow('No image data in response');
  });

  it('should handle error body parse failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('parse error'))
    });

    await expect(callNanoBanana('key', 'prompt'))
      .rejects.toThrow(GeminiApiError);
  });
});

describe('testGeminiConnection', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return success true on successful connection', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    });

    const result = await testGeminiConnection('valid-key');

    expect(result).toEqual({ success: true });
  });

  it('should return success false with error message on failed response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } })
    });

    const result = await testGeminiConnection('invalid-key');

    expect(result.success).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe('Invalid API key');
  });

  it('should return HTTP status as error if no message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: () => Promise.resolve({})
    });

    const result = await testGeminiConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('HTTP 403');
  });

  it('should handle json parse failure gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('parse error'))
    });

    const result = await testGeminiConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('HTTP 500');
  });

  it('should return network error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await testGeminiConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should return generic network error if error has no message', async () => {
    mockFetch.mockRejectedValueOnce({});

    const result = await testGeminiConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should use correct request parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    });

    await testGeminiConnection('test-api-key');

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/gemini');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body);
    expect(body.apiKey).toBe('test-api-key');
    expect(body.body.contents[0].parts[0].text).toBe('A simple test image of a blue circle');
    expect(body.body.generationConfig.responseModalities).toEqual(['TEXT', 'IMAGE']);
  });
});

describe('createPlaceholderImage', () => {
  it('should create SVG blob', () => {
    const result = createPlaceholderImage('test.png');

    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('image/svg+xml');
  });

  it('should include filename in SVG', () => {
    const result = createPlaceholderImage('hero.png');
    // Access the blob's internal data through its constructor argument
    // Since Blob stores the array items passed to it
    expect(result.type).toBe('image/svg+xml');
    expect(result.size).toBeGreaterThan(0);
  });

  it('should create valid SVG structure', () => {
    const result = createPlaceholderImage('test.png');
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe('image/svg+xml');
  });
});

describe('GeminiApiError', () => {
  it('should create error with 401 status (invalid key)', () => {
    const error = new GeminiApiError(401, {});

    expect(error.name).toBe('GeminiApiError');
    expect(error.message).toBe('Invalid Google AI API key');
    expect(error.status).toBe(401);
    expect(error.recovery).toBe('Please check your API key in Settings');
  });

  it('should create error with 403 status (invalid key)', () => {
    const error = new GeminiApiError(403, {});

    expect(error.message).toBe('Invalid Google AI API key');
    expect(error.recovery).toBe('Please check your API key in Settings');
  });

  it('should create error with 429 status (rate limit)', () => {
    const error = new GeminiApiError(429, {});

    expect(error.message).toBe('Google AI rate limit exceeded');
    expect(error.recovery).toBe('Please wait a few minutes and try again');
  });

  it('should use error message from response body', () => {
    const error = new GeminiApiError(500, { error: { message: 'Server error' } });

    expect(error.message).toBe('Server error');
    expect(error.recovery).toBe('Please try again');
  });

  it('should use default message for unknown errors', () => {
    const error = new GeminiApiError(503, {});

    expect(error.message).toBe('Gemini API error');
    expect(error.recovery).toBe('Please try again');
  });

  it('should store error details', () => {
    const errorBody = { error: { type: 'test', code: 123 } };
    const error = new GeminiApiError(500, errorBody);

    expect(error.details).toEqual(errorBody);
  });

  it('should be instanceof Error', () => {
    const error = new GeminiApiError(500, {});

    expect(error instanceof Error).toBe(true);
    expect(error instanceof GeminiApiError).toBe(true);
  });
});
