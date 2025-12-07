/**
 * Unit tests for progressive-renderer.js
 * Tests progressive rendering functionality with mocked DOM
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('progressive-renderer', () => {
  let mockIframe;
  let mockPlaceholder;
  let mockCreateObjectURL;
  let mockRevokeObjectURL;
  let progressiveRenderer;

  beforeEach(async () => {
    // Clear module cache to get fresh imports
    vi.resetModules();

    // Setup URL mock
    mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
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
      },
      onload: null,
      contentDocument: null,
      contentWindow: null
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
    progressiveRenderer = await import('../js/progressive-renderer.js');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('showIdleProgressView', () => {
    it('should set iframe src to blob URL', () => {
      progressiveRenderer.showIdleProgressView(mockIframe);

      expect(mockIframe.src).toBe('blob:test-url');
    });

    it('should hide placeholder', () => {
      progressiveRenderer.showIdleProgressView(mockIframe);

      expect(mockPlaceholder.classList.add).toHaveBeenCalledWith('hidden');
    });

    it('should show iframe', () => {
      progressiveRenderer.showIdleProgressView(mockIframe);

      expect(mockIframe.classList.add).toHaveBeenCalledWith('visible');
    });
  });

  describe('initProgressiveRenderer', () => {
    it('should set iframe src to blob URL', () => {
      progressiveRenderer.initProgressiveRenderer(mockIframe);

      expect(mockIframe.src).toBe('blob:test-url');
    });

    it('should return a promise', () => {
      const result = progressiveRenderer.initProgressiveRenderer(mockIframe);

      expect(result).toBeInstanceOf(Promise);
    });

    it('should hide placeholder', () => {
      progressiveRenderer.initProgressiveRenderer(mockIframe);

      expect(mockPlaceholder.classList.add).toHaveBeenCalledWith('hidden');
    });

    it('should show iframe', () => {
      progressiveRenderer.initProgressiveRenderer(mockIframe);

      expect(mockIframe.classList.add).toHaveBeenCalledWith('visible');
    });

    it('should set onload handler', () => {
      progressiveRenderer.initProgressiveRenderer(mockIframe);

      expect(mockIframe.onload).toBeInstanceOf(Function);
    });

    it('should resolve when iframe loads', async () => {
      const mockContentDoc = {
        getElementById: vi.fn().mockReturnValue(null),
        querySelector: vi.fn(),
        querySelectorAll: vi.fn().mockReturnValue([])
      };

      mockIframe.contentDocument = mockContentDoc;
      mockIframe.contentWindow = { document: mockContentDoc };

      const promise = progressiveRenderer.initProgressiveRenderer(mockIframe);

      // Trigger onload
      mockIframe.onload();

      await expect(promise).resolves.toBeUndefined();
    });
  });

  describe('updateGlobalStatus', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.updateGlobalStatus('test', 50)).not.toThrow();
    });
  });

  describe('setActivePhase', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.setActivePhase('planning')).not.toThrow();
    });
  });

  describe('handleTaskProgress', () => {
    beforeEach(() => {
      progressiveRenderer.cleanup();
    });

    it('should not throw when document not ready', () => {
      expect(() => progressiveRenderer.handleTaskProgress({
        taskType: 'colors',
        status: 'IN_PROGRESS',
        phase: 1
      })).not.toThrow();
    });

    it('should handle image generator tasks', () => {
      expect(() => progressiveRenderer.handleTaskProgress({
        taskType: 'hero',
        status: 'IN_PROGRESS',
        agent: 'image-generator'
      })).not.toThrow();
    });

    it('should handle feature image tasks', () => {
      expect(() => progressiveRenderer.handleTaskProgress({
        taskType: 'feature-1',
        status: 'COMPLETE',
        agent: 'image-generator'
      })).not.toThrow();
    });

    it('should handle assembler tasks', () => {
      expect(() => progressiveRenderer.handleTaskProgress({
        taskType: 'html',
        status: 'IN_PROGRESS',
        agent: 'assembler'
      })).not.toThrow();
    });

    it('should handle unmapped task types', () => {
      expect(() => progressiveRenderer.handleTaskProgress({
        taskType: 'unknown-task',
        status: 'IN_PROGRESS'
      })).not.toThrow();
    });

    it('should handle phase updates', () => {
      expect(() => progressiveRenderer.handleTaskProgress({
        phase: 1,
        status: 'IN_PROGRESS'
      })).not.toThrow();

      expect(() => progressiveRenderer.handleTaskProgress({
        phase: 2,
        status: 'IN_PROGRESS'
      })).not.toThrow();

      expect(() => progressiveRenderer.handleTaskProgress({
        phase: 4,
        status: 'IN_PROGRESS'
      })).not.toThrow();
    });
  });

  describe('setFeatureImageCount', () => {
    it('should not throw', () => {
      expect(() => progressiveRenderer.setFeatureImageCount(4)).not.toThrow();
    });

    it('should accept different counts', () => {
      expect(() => progressiveRenderer.setFeatureImageCount(3)).not.toThrow();
      expect(() => progressiveRenderer.setFeatureImageCount(6)).not.toThrow();
    });
  });

  describe('markPlanningComplete', () => {
    beforeEach(() => {
      progressiveRenderer.cleanup();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should not throw when document not ready', () => {
      expect(() => progressiveRenderer.markPlanningComplete()).not.toThrow();
    });
  });

  describe('markExecutionComplete', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markExecutionComplete()).not.toThrow();
    });
  });

  describe('markAssemblyComplete', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markAssemblyComplete()).not.toThrow();
    });
  });

  describe('markValidationStart', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markValidationStart()).not.toThrow();
    });
  });

  describe('markValidationComplete', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markValidationComplete()).not.toThrow();
    });

    it('should accept duration parameter', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markValidationComplete('2.5')).not.toThrow();
    });
  });

  describe('markRenderingStart', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markRenderingStart()).not.toThrow();
    });
  });

  describe('markRenderingComplete', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markRenderingComplete()).not.toThrow();
    });
  });

  describe('markAllComplete', () => {
    it('should not throw when document not ready', () => {
      progressiveRenderer.cleanup();
      expect(() => progressiveRenderer.markAllComplete()).not.toThrow();
    });
  });

  describe('cleanup', () => {
    it('should remove hidden class from placeholder', () => {
      progressiveRenderer.cleanup();

      expect(mockPlaceholder.classList.remove).toHaveBeenCalledWith('hidden');
    });

    it('should not throw on repeated calls', () => {
      expect(() => {
        progressiveRenderer.cleanup();
        progressiveRenderer.cleanup();
        progressiveRenderer.cleanup();
      }).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    beforeEach(() => {
      progressiveRenderer.cleanup();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should handle full generation flow', () => {
      // Initialize
      progressiveRenderer.initProgressiveRenderer(mockIframe);

      // Planning phase
      progressiveRenderer.markPlanningComplete();
      vi.advanceTimersByTime(300);

      // Execution phase tasks
      progressiveRenderer.handleTaskProgress({ taskType: 'colors', status: 'IN_PROGRESS', phase: 1 });
      progressiveRenderer.handleTaskProgress({ taskType: 'colors', status: 'COMPLETE', duration: '1.5' });
      progressiveRenderer.handleTaskProgress({ taskType: 'typography', status: 'IN_PROGRESS' });
      progressiveRenderer.handleTaskProgress({ taskType: 'typography', status: 'COMPLETE', duration: '1.2' });

      // Image tasks
      progressiveRenderer.setFeatureImageCount(3);
      progressiveRenderer.handleTaskProgress({ taskType: 'hero', status: 'IN_PROGRESS', agent: 'image-generator' });
      progressiveRenderer.handleTaskProgress({ taskType: 'hero', status: 'COMPLETE', agent: 'image-generator', duration: '5.0' });
      progressiveRenderer.handleTaskProgress({ taskType: 'feature-1', status: 'IN_PROGRESS', agent: 'image-generator' });
      progressiveRenderer.handleTaskProgress({ taskType: 'feature-1', status: 'COMPLETE', agent: 'image-generator' });
      progressiveRenderer.handleTaskProgress({ taskType: 'feature-2', status: 'COMPLETE', agent: 'image-generator' });
      progressiveRenderer.handleTaskProgress({ taskType: 'feature-3', status: 'COMPLETE', agent: 'image-generator' });

      // Component tasks
      progressiveRenderer.handleTaskProgress({ taskType: 'header', status: 'IN_PROGRESS' });
      progressiveRenderer.handleTaskProgress({ taskType: 'header', status: 'COMPLETE' });
      progressiveRenderer.handleTaskProgress({ taskType: 'hero', status: 'IN_PROGRESS' });
      progressiveRenderer.handleTaskProgress({ taskType: 'hero', status: 'COMPLETE' });

      progressiveRenderer.markExecutionComplete();

      // Assembly phase
      progressiveRenderer.handleTaskProgress({ taskType: 'html', status: 'IN_PROGRESS', agent: 'assembler', phase: 4 });
      progressiveRenderer.handleTaskProgress({ taskType: 'html', status: 'COMPLETE', agent: 'assembler' });
      progressiveRenderer.handleTaskProgress({ taskType: 'css', status: 'IN_PROGRESS', agent: 'assembler' });
      progressiveRenderer.handleTaskProgress({ taskType: 'css', status: 'COMPLETE', agent: 'assembler' });
      progressiveRenderer.handleTaskProgress({ taskType: 'js', status: 'IN_PROGRESS', agent: 'assembler' });
      progressiveRenderer.handleTaskProgress({ taskType: 'js', status: 'COMPLETE', agent: 'assembler' });

      progressiveRenderer.markAssemblyComplete();

      // Validation and rendering
      progressiveRenderer.markValidationStart();
      progressiveRenderer.markValidationComplete('1.0');
      progressiveRenderer.markRenderingStart();
      progressiveRenderer.markRenderingComplete();
      progressiveRenderer.markAllComplete();

      // Cleanup
      progressiveRenderer.cleanup();

      // Should complete without errors
      expect(true).toBe(true);
    });

    it('should handle task completion with calculated duration', () => {
      progressiveRenderer.handleTaskProgress({ taskType: 'colors', status: 'IN_PROGRESS' });

      // Advance time
      vi.advanceTimersByTime(2000);

      progressiveRenderer.handleTaskProgress({ taskType: 'colors', status: 'COMPLETE' });

      // Should complete without errors
      expect(true).toBe(true);
    });
  });
});
