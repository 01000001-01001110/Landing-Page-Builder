/**
 * Unit tests for style-matrix.js
 * Tests design system configurations
 */

import { describe, it, expect } from 'vitest';
import {
  STYLE_MATRIX,
  getStyleConfig,
  generateCSSVariables,
  getComponentRules
} from '../js/style-matrix.js';

describe('STYLE_MATRIX', () => {
  const expectedStyles = [
    'modern-minimal',
    'bold-playful',
    'corporate-trust',
    'dark-sleek',
    'warm-friendly',
    'enterprise-pro',
    'artistic-craft',
    'retro-vintage',
    'gradient-glass',
    'neo-brutalist',
    'nature-organic',
    'soft-pastel'
  ];

  describe('style definitions', () => {
    it('should have all 12 expected styles', () => {
      expect(Object.keys(STYLE_MATRIX)).toHaveLength(12);
    });

    expectedStyles.forEach(styleName => {
      it(`should include ${styleName} style`, () => {
        expect(STYLE_MATRIX[styleName]).toBeDefined();
      });
    });
  });

  describe('style structure', () => {
    expectedStyles.forEach(styleName => {
      describe(`${styleName}`, () => {
        const style = STYLE_MATRIX[styleName];

        it('should have name property', () => {
          expect(style.name).toBeDefined();
          expect(typeof style.name).toBe('string');
        });

        it('should have description property', () => {
          expect(style.description).toBeDefined();
          expect(typeof style.description).toBe('string');
        });

        it('should have typography configuration', () => {
          expect(style.typography).toBeDefined();
          expect(style.typography.headingFont).toBeDefined();
          expect(style.typography.bodyFont).toBeDefined();
          expect(style.typography.headingWeight).toBeDefined();
          expect(style.typography.scale).toBeDefined();
        });

        it('should have colors configuration', () => {
          expect(style.colors).toBeDefined();
          expect(style.colors.paletteType).toBeDefined();
          expect(style.colors.saturation).toBeDefined();
          expect(style.colors.contrast).toBeDefined();
          expect(style.colors.rules).toBeDefined();
        });

        it('should have spacing configuration', () => {
          expect(style.spacing).toBeDefined();
          expect(style.spacing.gridBase).toBeDefined();
          expect(style.spacing.scale).toBeDefined();
          expect(style.spacing.density).toBeDefined();
          expect(style.spacing.sectionSpacing).toBeDefined();
        });

        it('should have borderRadius configuration', () => {
          expect(style.borderRadius).toBeDefined();
          expect(style.borderRadius.sm).toBeDefined();
          expect(style.borderRadius.md).toBeDefined();
          expect(style.borderRadius.lg).toBeDefined();
          expect(style.borderRadius.default).toBeDefined();
        });

        it('should have shadows configuration', () => {
          expect(style.shadows).toBeDefined();
          expect(style.shadows.intensity).toBeDefined();
          expect(style.shadows.sm).toBeDefined();
          expect(style.shadows.md).toBeDefined();
          expect(style.shadows.lg).toBeDefined();
        });

        it('should have animations configuration', () => {
          expect(style.animations).toBeDefined();
          expect(style.animations.speed).toBeDefined();
          expect(style.animations.easing).toBeDefined();
          expect(style.animations.transitions).toBeDefined();
        });

        it('should have layout configuration', () => {
          expect(style.layout).toBeDefined();
          expect(style.layout.maxWidth).toBeDefined();
          expect(style.layout.gridColumns).toBeDefined();
          expect(style.layout.heroHeight).toBeDefined();
        });

        it('should have components configuration', () => {
          expect(style.components).toBeDefined();
          expect(style.components.buttons).toBeDefined();
          expect(style.components.cards).toBeDefined();
          expect(style.components.navigation).toBeDefined();
        });
      });
    });
  });

  describe('typography scales', () => {
    it('should have consistent scale sizes across styles', () => {
      const requiredSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

      expectedStyles.forEach(styleName => {
        const scale = STYLE_MATRIX[styleName].typography.scale;
        requiredSizes.forEach(size => {
          expect(scale[size]).toBeDefined();
        });
      });
    });
  });
});

describe('getStyleConfig', () => {
  it('should return correct config for valid style name', () => {
    const config = getStyleConfig('modern-minimal');

    expect(config).toBe(STYLE_MATRIX['modern-minimal']);
    expect(config.name).toBe('Modern Minimal');
  });

  it('should return modern-minimal as fallback for invalid style', () => {
    const config = getStyleConfig('non-existent-style');

    expect(config).toBe(STYLE_MATRIX['modern-minimal']);
  });

  it('should return modern-minimal for undefined input', () => {
    const config = getStyleConfig(undefined);

    expect(config).toBe(STYLE_MATRIX['modern-minimal']);
  });

  it('should return modern-minimal for null input', () => {
    const config = getStyleConfig(null);

    expect(config).toBe(STYLE_MATRIX['modern-minimal']);
  });
});

describe('generateCSSVariables', () => {
  const mockColors = {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    neutral: {
      '50': '#F9FAFB',
      '100': '#F3F4F6',
      '200': '#E5E7EB',
      '300': '#D1D5DB',
      '400': '#9CA3AF',
      '500': '#6B7280',
      '600': '#4B5563',
      '700': '#374151',
      '800': '#1F2937',
      '900': '#111827'
    }
  };

  const mockTypography = {
    fontFamily: {
      primary: 'Inter, sans-serif',
      heading: 'Montserrat, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  };

  it('should generate valid CSS with :root selector', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain(':root {');
    expect(css).toContain('}');
  });

  it('should include color variables', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--color-primary: #3B82F6');
    expect(css).toContain('--color-secondary: #60A5FA');
    expect(css).toContain('--color-accent: #F59E0B');
    expect(css).toContain('--color-background: #FFFFFF');
    expect(css).toContain('--color-text: #111827');
  });

  it('should include neutral color shades', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--color-neutral-50: #F9FAFB');
    expect(css).toContain('--color-neutral-500: #6B7280');
    expect(css).toContain('--color-neutral-900: #111827');
  });

  it('should include typography variables', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--font-primary: Inter, sans-serif');
    expect(css).toContain('--font-heading: Montserrat, sans-serif');
  });

  it('should include font size variables', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--font-size-sm: 0.875rem');
    expect(css).toContain('--font-size-base: 1rem');
    expect(css).toContain('--font-size-lg: 1.125rem');
  });

  it('should include spacing variables', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--spacing-base:');
    expect(css).toContain('--section-spacing:');
    expect(css).toContain('--max-width:');
  });

  it('should include border radius variables', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--radius-sm:');
    expect(css).toContain('--radius-md:');
    expect(css).toContain('--radius-lg:');
    expect(css).toContain('--radius-full:');
  });

  it('should include shadow variables', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--shadow-sm:');
    expect(css).toContain('--shadow-md:');
    expect(css).toContain('--shadow-lg:');
  });

  it('should include transition variables', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, mockTypography);

    expect(css).toContain('--transition-fast:');
    expect(css).toContain('--transition-medium:');
    expect(css).toContain('--transition-slow:');
  });

  it('should handle missing styleConfig gracefully', () => {
    const css = generateCSSVariables(undefined, mockColors, mockTypography);

    expect(css).toContain(':root');
  });

  it('should handle missing colors gracefully', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, undefined, mockTypography);

    expect(css).toContain(':root');
  });

  it('should handle missing typography gracefully', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const css = generateCSSVariables(styleConfig, mockColors, undefined);

    expect(css).toContain(':root');
  });
});

describe('getComponentRules', () => {
  it('should return button rules for buttons component', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const rules = getComponentRules('buttons', styleConfig);

    expect(rules).toBeDefined();
    expect(rules.style).toBeDefined();
    expect(rules.padding).toBeDefined();
    expect(rules.fontSize).toBeDefined();
  });

  it('should return card rules for cards component', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const rules = getComponentRules('cards', styleConfig);

    expect(rules).toBeDefined();
    expect(rules.elevation).toBeDefined();
    expect(rules.padding).toBeDefined();
    expect(rules.background).toBeDefined();
  });

  it('should return navigation rules for navigation component', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const rules = getComponentRules('navigation', styleConfig);

    expect(rules).toBeDefined();
    expect(rules.style).toBeDefined();
    expect(rules.sticky).toBeDefined();
    expect(rules.spacing).toBeDefined();
  });

  it('should return empty object for unknown component', () => {
    const styleConfig = getStyleConfig('modern-minimal');
    const rules = getComponentRules('unknown-component', styleConfig);

    // getComponentRules returns empty object for fallback when component doesn't exist
    expect(rules).toEqual({});
  });
});

describe('style-specific characteristics', () => {
  it('modern-minimal should have subtle shadows', () => {
    const config = getStyleConfig('modern-minimal');
    expect(config.shadows.intensity).toBe('subtle');
  });

  it('bold-playful should have high saturation', () => {
    const config = getStyleConfig('bold-playful');
    expect(config.colors.saturation).toBe('high');
  });

  it('dark-sleek should use neon color palette', () => {
    const config = getStyleConfig('dark-sleek');
    expect(config.colors.paletteType).toBe('neon-dark');
  });

  it('neo-brutalist should have no border radius', () => {
    const config = getStyleConfig('neo-brutalist');
    expect(config.borderRadius.default).toBe('none');
  });

  it('corporate-trust should use serif heading font', () => {
    const config = getStyleConfig('corporate-trust');
    expect(config.typography.headingFont).toContain('Merriweather');
  });

  it('gradient-glass should have glassmorphism cards', () => {
    const config = getStyleConfig('gradient-glass');
    expect(config.components.cards.backdropFilter).toBe('blur(20px)');
  });

  it('retro-vintage should have dramatic shadows', () => {
    const config = getStyleConfig('retro-vintage');
    expect(config.shadows.intensity).toBe('dramatic');
  });

  it('warm-friendly should have comfortable spacing density', () => {
    const config = getStyleConfig('warm-friendly');
    expect(config.spacing.density).toBe('comfortable');
  });

  it('nature-organic should have natural shadow colors', () => {
    const config = getStyleConfig('nature-organic');
    expect(config.shadows.intensity).toBe('natural');
  });

  it('soft-pastel should have very low saturation', () => {
    const config = getStyleConfig('soft-pastel');
    expect(config.colors.saturation).toBe('very-low');
  });
});
