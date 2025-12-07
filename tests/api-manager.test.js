/**
 * Unit tests for api-manager.js
 * Tests API key storage and retrieval functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiKeyManager } from '../js/api-manager.js';

describe('ApiKeyManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('save()', () => {
    it('should save Anthropic API key to localStorage', () => {
      const testKey = 'sk-ant-test-key-12345';
      ApiKeyManager.save('anthropic', testKey);

      const stored = localStorage.getItem('lpb_anthropic_key');
      expect(stored).toBeTruthy();
      // Key should be base64 encoded
      expect(atob(stored)).toBe(testKey);
    });

    it('should save Google API key to localStorage', () => {
      const testKey = 'AIza-test-google-key';
      ApiKeyManager.save('google', testKey);

      const stored = localStorage.getItem('lpb_google_key');
      expect(stored).toBeTruthy();
      expect(atob(stored)).toBe(testKey);
    });

    it('should overwrite existing key when saving new one', () => {
      ApiKeyManager.save('anthropic', 'old-key');
      ApiKeyManager.save('anthropic', 'new-key');

      const retrieved = ApiKeyManager.get('anthropic');
      expect(retrieved).toBe('new-key');
    });
  });

  describe('get()', () => {
    it('should retrieve saved Anthropic API key', () => {
      const testKey = 'sk-ant-retrieve-test';
      ApiKeyManager.save('anthropic', testKey);

      const retrieved = ApiKeyManager.get('anthropic');
      expect(retrieved).toBe(testKey);
    });

    it('should retrieve saved Google API key', () => {
      const testKey = 'AIza-retrieve-test';
      ApiKeyManager.save('google', testKey);

      const retrieved = ApiKeyManager.get('google');
      expect(retrieved).toBe(testKey);
    });

    it('should return null for non-existent Anthropic key', () => {
      const retrieved = ApiKeyManager.get('anthropic');
      expect(retrieved).toBeNull();
    });

    it('should return null for non-existent Google key', () => {
      const retrieved = ApiKeyManager.get('google');
      expect(retrieved).toBeNull();
    });
  });

  describe('clear()', () => {
    it('should remove all stored API keys', () => {
      ApiKeyManager.save('anthropic', 'test-anthropic-key');
      ApiKeyManager.save('google', 'test-google-key');

      ApiKeyManager.clear();

      expect(ApiKeyManager.get('anthropic')).toBeNull();
      expect(ApiKeyManager.get('google')).toBeNull();
    });

    it('should not affect other localStorage items', () => {
      localStorage.setItem('other-item', 'value');
      ApiKeyManager.save('anthropic', 'test-key');

      ApiKeyManager.clear();

      expect(localStorage.getItem('other-item')).toBe('value');
    });
  });

  describe('hasKeys()', () => {
    it('should return false for both when no keys saved', () => {
      const result = ApiKeyManager.hasKeys();
      expect(result.anthropic).toBe(false);
      expect(result.google).toBe(false);
    });

    it('should return true for anthropic when only anthropic key saved', () => {
      ApiKeyManager.save('anthropic', 'test-key');

      const result = ApiKeyManager.hasKeys();
      expect(result.anthropic).toBe(true);
      expect(result.google).toBe(false);
    });

    it('should return true for google when only google key saved', () => {
      ApiKeyManager.save('google', 'test-key');

      const result = ApiKeyManager.hasKeys();
      expect(result.anthropic).toBe(false);
      expect(result.google).toBe(true);
    });

    it('should return true for both when both keys saved', () => {
      ApiKeyManager.save('anthropic', 'test-anthropic');
      ApiKeyManager.save('google', 'test-google');

      const result = ApiKeyManager.hasKeys();
      expect(result.anthropic).toBe(true);
      expect(result.google).toBe(true);
    });
  });

  describe('storage keys', () => {
    it('should use correct storage key for Anthropic', () => {
      expect(ApiKeyManager.STORAGE_KEY_ANTHROPIC).toBe('lpb_anthropic_key');
    });

    it('should use correct storage key for Google', () => {
      expect(ApiKeyManager.STORAGE_KEY_GOOGLE).toBe('lpb_google_key');
    });
  });
});
