/**
 * Unit tests for claude-client.js
 * Tests Claude API client functionality with mocked fetch
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callClaude, testClaudeConnection, ClaudeApiError } from '../js/claude-client.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('callClaude', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call Claude API with correct parameters for sonnet model', async () => {
    const mockResponse = {
      content: [{ type: 'text', text: '{"result": "success"}' }]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map(),
      json: () => Promise.resolve(mockResponse)
    });

    const result = await callClaude('test-key', 'system prompt', 'user prompt', 'sonnet');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/claude');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(options.body);
    expect(body.apiKey).toBe('test-key');
    expect(body.body.model).toBe('claude-sonnet-4-5');
    expect(body.body.max_tokens).toBe(8192);
    expect(body.body.temperature).toBe(0.7);
    expect(body.body.system).toBe('system prompt');
    expect(body.body.messages[0].role).toBe('user');
    expect(body.body.messages[0].content).toBe('user prompt');

    expect(result).toEqual(mockResponse);
  });

  it('should call Claude API with haiku model when specified', async () => {
    const mockResponse = { content: [{ type: 'text', text: 'response' }] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map(),
      json: () => Promise.resolve(mockResponse)
    });

    await callClaude('test-key', 'system', 'user', 'haiku');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.body.model).toBe('claude-haiku-4-5-20251001');
  });

  it('should default to sonnet model when no model specified', async () => {
    const mockResponse = { content: [{ type: 'text', text: 'response' }] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map(),
      json: () => Promise.resolve(mockResponse)
    });

    await callClaude('test-key', 'system', 'user');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.body.model).toBe('claude-sonnet-4-5');
  });

  it('should throw ClaudeApiError on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Map(),
      json: () => Promise.resolve({ error: { message: 'Invalid key' } })
    });

    await expect(callClaude('bad-key', 'system', 'user'))
      .rejects.toThrow(ClaudeApiError);
  });

  it('should handle response with no error body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: new Map(),
      json: () => Promise.reject(new Error('parse error'))
    });

    await expect(callClaude('key', 'system', 'user'))
      .rejects.toThrow(ClaudeApiError);
  });

  it('should log response structure with content array', async () => {
    const mockResponse = {
      content: [
        { type: 'text', text: 'a'.repeat(300) }
      ]
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map(),
      json: () => Promise.resolve(mockResponse)
    });

    const result = await callClaude('key', 'system', 'user');

    expect(result.content).toHaveLength(1);
    expect(result.content[0].text.length).toBe(300);
  });

  it('should handle response without content array', async () => {
    const mockResponse = { result: 'some data' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Map(),
      json: () => Promise.resolve(mockResponse)
    });

    const result = await callClaude('key', 'system', 'user');

    expect(result).toEqual({ result: 'some data' });
  });
});

describe('testClaudeConnection', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('should return success true on successful connection', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ content: [] })
    });

    const result = await testClaudeConnection('valid-key');

    expect(result).toEqual({ success: true });
  });

  it('should return success false with error message on failed response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } })
    });

    const result = await testClaudeConnection('invalid-key');

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

    const result = await testClaudeConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('HTTP 403');
  });

  it('should handle json parse failure gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('parse error'))
    });

    const result = await testClaudeConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('HTTP 500');
  });

  it('should return network error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await testClaudeConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should return generic network error if error has no message', async () => {
    mockFetch.mockRejectedValueOnce({});

    const result = await testClaudeConnection('key');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('should use correct request parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    });

    await testClaudeConnection('test-api-key');

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/claude');
    expect(options.method).toBe('POST');

    const body = JSON.parse(options.body);
    expect(body.apiKey).toBe('test-api-key');
    expect(body.body.max_tokens).toBe(10);
    expect(body.body.messages[0].content).toBe('Hello');
  });
});

describe('ClaudeApiError', () => {
  it('should create error with 401 status (invalid key)', () => {
    const error = new ClaudeApiError(401, {});

    expect(error.name).toBe('ClaudeApiError');
    expect(error.message).toBe('Invalid Anthropic API key');
    expect(error.status).toBe(401);
    expect(error.recovery).toBe('Please check your API key in Settings');
  });

  it('should create error with 429 status (rate limit)', () => {
    const error = new ClaudeApiError(429, {});

    expect(error.message).toBe('Anthropic rate limit exceeded');
    expect(error.recovery).toBe('Please wait a few minutes and try again');
  });

  it('should create error with 400 invalid_request_error (content policy)', () => {
    const error = new ClaudeApiError(400, { error: { type: 'invalid_request_error' } });

    expect(error.message).toBe('Content policy violation');
    expect(error.recovery).toContain('content filters');
  });

  it('should use error message from response body', () => {
    const error = new ClaudeApiError(500, { error: { message: 'Server error' } });

    expect(error.message).toBe('Server error');
    expect(error.recovery).toBe('Please try again');
  });

  it('should use default message for unknown errors', () => {
    const error = new ClaudeApiError(503, {});

    expect(error.message).toBe('Claude API error');
    expect(error.recovery).toBe('Please try again');
  });

  it('should store error details', () => {
    const errorBody = { error: { type: 'test', code: 123 } };
    const error = new ClaudeApiError(500, errorBody);

    expect(error.details).toEqual(errorBody);
  });

  it('should be instanceof Error', () => {
    const error = new ClaudeApiError(500, {});

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ClaudeApiError).toBe(true);
  });
});
