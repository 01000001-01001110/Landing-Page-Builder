/**
 * Unit tests for orchestrator.js
 * Tests orchestration and task execution with mocked dependencies
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies before importing orchestrator
vi.mock('../js/claude-client.js', () => ({
  callClaude: vi.fn()
}));

vi.mock('../js/gemini-client.js', () => ({
  callNanoBanana: vi.fn(),
  createPlaceholderImage: vi.fn()
}));

vi.mock('../js/style-matrix.js', () => ({
  getStyleConfig: vi.fn(),
  generateCSSVariables: vi.fn(),
  getComponentRules: vi.fn()
}));

vi.mock('../js/response-parser.js', () => ({
  parseApiResponse: vi.fn()
}));

import { generateGuid, createExecutionPlan, executePlan } from '../js/orchestrator.js';
import { callClaude } from '../js/claude-client.js';
import { callNanoBanana, createPlaceholderImage } from '../js/gemini-client.js';
import { getStyleConfig, generateCSSVariables, getComponentRules } from '../js/style-matrix.js';
import { parseApiResponse } from '../js/response-parser.js';

describe('generateGuid', () => {
  it('should return a string', () => {
    const guid = generateGuid();

    expect(typeof guid).toBe('string');
  });

  it('should start with gen-', () => {
    const guid = generateGuid();

    expect(guid.startsWith('gen-')).toBe(true);
  });

  it('should include timestamp', () => {
    const before = Date.now();
    const guid = generateGuid();
    const after = Date.now();

    const parts = guid.split('-');
    const timestamp = parseInt(parts[1]);

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });

  it('should generate unique GUIDs', () => {
    const guid1 = generateGuid();
    const guid2 = generateGuid();

    expect(guid1).not.toBe(guid2);
  });
});

describe('createExecutionPlan', () => {
  const baseInputs = {
    companyName: 'Test Company',
    slogan: 'Test Slogan',
    description: 'Test Description',
    industry: 'tech',
    style: 'modern-minimal',
    primaryColor: '#0078D4',
    imageStyle: 'photorealistic',
    ctaText: 'Get Started',
    featureCount: 3,
    includeTestimonials: true
  };

  it('should return plan object with guid', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.guid).toBeDefined();
    expect(plan.guid.startsWith('gen-')).toBe(true);
  });

  it('should include created timestamp', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.created).toBeDefined();
    expect(new Date(plan.created)).toBeInstanceOf(Date);
  });

  it('should have PENDING status', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.status).toBe('PENDING');
  });

  it('should store inputs', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.inputs).toEqual(baseInputs);
  });

  it('should have phase1_designSystem with 2 tasks', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.phase1_designSystem).toHaveLength(2);
    expect(plan.phase1_designSystem[0].type).toBe('colors');
    expect(plan.phase1_designSystem[1].type).toBe('typography');
  });

  it('should have phase2_components with 6 tasks', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.phase2_components).toHaveLength(6);
  });

  it('should mark testimonials as optional when disabled', () => {
    const inputs = { ...baseInputs, includeTestimonials: false };
    const plan = createExecutionPlan(inputs);

    const testimonials = plan.phase2_components.find(t => t.type === 'testimonials');
    expect(testimonials.optional).toBe(true);
  });

  it('should mark testimonials as not optional when enabled', () => {
    const plan = createExecutionPlan(baseInputs);

    const testimonials = plan.phase2_components.find(t => t.type === 'testimonials');
    expect(testimonials.optional).toBe(false);
  });

  it('should have phase3_images with correct count', () => {
    const plan = createExecutionPlan(baseInputs);

    // 1 hero + 3 features = 4 images
    expect(plan.phase3_images).toHaveLength(4);
  });

  it('should scale feature images with featureCount', () => {
    const inputs = { ...baseInputs, featureCount: 6 };
    const plan = createExecutionPlan(inputs);

    // 1 hero + 6 features = 7 images
    expect(plan.phase3_images).toHaveLength(7);
  });

  it('should have phase4_assembly with 3 tasks', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.phase4_assembly).toHaveLength(3);
    expect(plan.phase4_assembly[0].type).toBe('html');
    expect(plan.phase4_assembly[1].type).toBe('css');
    expect(plan.phase4_assembly[2].type).toBe('js');
  });

  it('should have allTasks array', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.allTasks).toBeDefined();
    expect(Array.isArray(plan.allTasks)).toBe(true);
  });

  it('should have correct agent assignments', () => {
    const plan = createExecutionPlan(baseInputs);

    expect(plan.phase1_designSystem[0].agent).toBe('design-system');
    expect(plan.phase2_components[0].agent).toBe('component-builder');
    expect(plan.phase3_images[0].agent).toBe('image-generator');
    expect(plan.phase4_assembly[0].agent).toBe('assembler');
  });

  it('should have dependencies defined', () => {
    const plan = createExecutionPlan(baseInputs);

    // Components depend on design system
    expect(plan.phase2_components[0].dependencies).toContain('task-1.1');
    expect(plan.phase2_components[0].dependencies).toContain('task-1.2');

    // Assembly depends on components
    expect(plan.phase4_assembly[0].dependencies).toContain('task-2.1');
  });

  it('should exclude optional tasks from allTasks', () => {
    const inputs = { ...baseInputs, includeTestimonials: false };
    const plan = createExecutionPlan(inputs);

    const hasTestimonials = plan.allTasks.some(t => t.type === 'testimonials');
    expect(hasTestimonials).toBe(false);
  });
});

describe('executePlan', () => {
  const baseInputs = {
    companyName: 'Test Company',
    slogan: 'Test Slogan',
    description: 'Test Description for a technology company that provides innovative solutions.',
    industry: 'tech',
    style: 'modern-minimal',
    primaryColor: '#0078D4',
    imageStyle: 'photorealistic',
    ctaText: 'Get Started',
    featureCount: 3,
    includeTestimonials: false
  };

  const apiKeys = {
    anthropic: 'test-anthropic-key',
    google: 'test-google-key'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Default mock implementations
    callClaude.mockResolvedValue({ content: [{ text: '{}' }] });
    parseApiResponse.mockImplementation((response, context) => {
      if (context.includes('colors')) {
        return { primary: '#0078D4', secondary: '#60A5FA', neutral: {} };
      }
      if (context.includes('typography')) {
        return { fontFamily: { primary: 'Inter', heading: 'Inter' }, fontSize: {} };
      }
      if (context.includes('component')) {
        return { html: '<div></div>', css: '.class {}' };
      }
      if (context.includes('description')) {
        return { description: 'Enhanced', tagline: 'Tagline', valueProposition: 'Value', keyBenefits: [] };
      }
      return {};
    });

    getStyleConfig.mockReturnValue({
      name: 'Modern Minimal',
      colors: { paletteType: 'analogous', saturation: 'medium', contrast: 'high', rules: {} },
      typography: { headingFont: 'Inter', bodyFont: 'Inter', scale: {} },
      spacing: { gridBase: 8, sectionSpacing: '5rem' },
      shadows: { intensity: 'subtle' },
      borderRadius: { default: 'sm', sm: '0.25rem' },
      animations: { speed: 'medium', transitions: { medium: '300ms' } },
      layout: { gridColumns: 3, heroHeight: '70vh' }
    });

    getComponentRules.mockReturnValue({});
    generateCSSVariables.mockReturnValue(':root { --color-primary: #0078D4; }');

    callNanoBanana.mockResolvedValue(new Blob(['image']));
    createPlaceholderImage.mockReturnValue(new Blob(['placeholder']));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute plan and return results', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    const result = await executePlan(plan, apiKeys, onProgress);

    expect(result).toBeDefined();
    expect(result.guid).toBe(plan.guid);
  });

  it('should call onProgress with phases', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    expect(onProgress).toHaveBeenCalled();

    // Should have phase progress calls
    const phaseCalls = onProgress.mock.calls.filter(call => call[0].phase !== undefined);
    expect(phaseCalls.length).toBeGreaterThan(0);
  });

  it('should enhance description', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    // callClaude should be called for description enhancement
    expect(callClaude).toHaveBeenCalled();
  });

  it('should execute design system tasks', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    // getStyleConfig should be called
    expect(getStyleConfig).toHaveBeenCalled();
  });

  it('should execute image tasks', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    // callNanoBanana should be called for images
    expect(callNanoBanana).toHaveBeenCalled();
  });

  it('should return images array', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    const result = await executePlan(plan, apiKeys, onProgress);

    expect(result.images).toBeDefined();
    expect(Array.isArray(result.images)).toBe(true);
  });

  it('should return design system', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    const result = await executePlan(plan, apiKeys, onProgress);

    expect(result.designSystem).toBeDefined();
    expect(result.designSystem.colors).toBeDefined();
    expect(result.designSystem.typography).toBeDefined();
  });

  it('should return totalTime', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    const result = await executePlan(plan, apiKeys, onProgress);

    expect(result.totalTime).toBeDefined();
    expect(parseFloat(result.totalTime)).toBeGreaterThanOrEqual(0);
  });

  it('should return taskCount', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    const result = await executePlan(plan, apiKeys, onProgress);

    expect(result.taskCount).toBe(plan.allTasks.length);
  });

  it('should handle image generation failure with placeholder', async () => {
    callNanoBanana.mockRejectedValue(new Error('API error'));

    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    const result = await executePlan(plan, apiKeys, onProgress);

    // Should still complete with placeholder images
    expect(result.images).toBeDefined();
    expect(createPlaceholderImage).toHaveBeenCalled();
  });

  it('should report task progress for completion', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    // Should have COMPLETE status calls
    const completeCalls = onProgress.mock.calls.filter(call => call[0].status === 'COMPLETE');
    expect(completeCalls.length).toBeGreaterThan(0);
  });

  it('should report task progress for in-progress', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    // Should have IN_PROGRESS status calls
    const inProgressCalls = onProgress.mock.calls.filter(call => call[0].status === 'IN_PROGRESS');
    expect(inProgressCalls.length).toBeGreaterThan(0);
  });

  it('should throw error on task failure', async () => {
    callClaude.mockRejectedValue(new Error('API failure'));

    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await expect(executePlan(plan, apiKeys, onProgress))
      .rejects.toThrow('API failure');
  });

  it('should handle description enhancement failure gracefully', async () => {
    // First call (description enhancement) fails, others succeed
    callClaude.mockRejectedValueOnce(new Error('Enhancement failed'));
    callClaude.mockResolvedValue({ content: [{ text: '{}' }] });

    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    // Should use fallback and continue
    const result = await executePlan(plan, apiKeys, onProgress);

    expect(result).toBeDefined();
  });

  it('should use haiku for component generation', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    // Find calls with 'haiku' model
    const haikuCalls = callClaude.mock.calls.filter(call => call[3] === 'haiku');
    expect(haikuCalls.length).toBeGreaterThan(0);
  });

  it('should use sonnet for design system', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    // Find calls with 'sonnet' model
    const sonnetCalls = callClaude.mock.calls.filter(call => call[3] === 'sonnet');
    expect(sonnetCalls.length).toBeGreaterThan(0);
  });

  it('should generate CSS variables', async () => {
    const plan = createExecutionPlan(baseInputs);
    const onProgress = vi.fn();

    await executePlan(plan, apiKeys, onProgress);

    expect(generateCSSVariables).toHaveBeenCalled();
  });

  it('should include different feature topics by industry', async () => {
    const techInputs = { ...baseInputs, industry: 'tech' };
    const healthInputs = { ...baseInputs, industry: 'healthcare' };

    const plan1 = createExecutionPlan(techInputs);
    const plan2 = createExecutionPlan(healthInputs);
    const onProgress = vi.fn();

    await executePlan(plan1, apiKeys, onProgress);
    await executePlan(plan2, apiKeys, onProgress);

    // Different industries should have been processed
    expect(callNanoBanana).toHaveBeenCalled();
  });
});

describe('execution plan task structure', () => {
  const baseInputs = {
    companyName: 'Test',
    slogan: 'Slogan',
    description: 'Description',
    industry: 'tech',
    style: 'modern-minimal',
    primaryColor: '#000',
    imageStyle: 'photorealistic',
    ctaText: 'CTA',
    featureCount: 4,
    includeTestimonials: true
  };

  it('should have unique task IDs', () => {
    const plan = createExecutionPlan(baseInputs);
    const ids = plan.allTasks.map(t => t.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have all tasks with PENDING status', () => {
    const plan = createExecutionPlan(baseInputs);

    plan.allTasks.forEach(task => {
      expect(task.status).toBe('PENDING');
    });
  });

  it('should have all tasks with agent', () => {
    const plan = createExecutionPlan(baseInputs);

    plan.allTasks.forEach(task => {
      expect(task.agent).toBeDefined();
      expect(['design-system', 'component-builder', 'image-generator', 'assembler'])
        .toContain(task.agent);
    });
  });

  it('should have all tasks with type', () => {
    const plan = createExecutionPlan(baseInputs);

    plan.allTasks.forEach(task => {
      expect(task.type).toBeDefined();
    });
  });

  it('should have all tasks with name', () => {
    const plan = createExecutionPlan(baseInputs);

    plan.allTasks.forEach(task => {
      expect(task.name).toBeDefined();
      expect(typeof task.name).toBe('string');
    });
  });
});
