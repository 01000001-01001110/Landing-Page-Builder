// Style Matrix - Design System Rules
// Maps user-selected styles to concrete design decisions

/**
 * Comprehensive style matrix defining design rules for each style
 * Each style includes typography, colors, spacing, borders, shadows, animations
 */
export const STYLE_MATRIX = {
    'modern-minimal': {
        name: 'Modern Minimal',
        description: 'Clean, spacious, typography-focused design with subtle accents',

        // Typography
        typography: {
            headingFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            bodyFont: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            monoFont: '"SF Mono", Monaco, "Cascadia Code", monospace',
            headingWeight: '700',
            bodyWeight: '400',
            headingLineHeight: '1.2',
            bodyLineHeight: '1.6',
            scale: {
                xs: '0.75rem',   // 12px
                sm: '0.875rem',  // 14px
                base: '1rem',    // 16px
                lg: '1.125rem',  // 18px
                xl: '1.25rem',   // 20px
                '2xl': '1.5rem', // 24px
                '3xl': '2rem',   // 32px
                '4xl': '2.5rem', // 40px
                '5xl': '3rem'    // 48px
            }
        },

        // Color theory
        colors: {
            paletteType: 'monochromatic-with-accent',
            saturation: 'low',  // Muted colors
            contrast: 'high',   // Strong text contrast
            accentStrategy: 'complementary',  // Accent color is complementary to primary
            neutralShades: 9,   // Generate 9 neutral shades
            rules: {
                primary: 'user-selected',
                secondary: 'primary-lighter-15%',
                accent: 'complementary-to-primary',
                background: 'neutral-50',
                surface: 'white',
                text: 'neutral-900'
            }
        },

        // Spacing (8-point grid)
        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.5rem',   // 8px
                sm: '1rem',     // 16px
                md: '1.5rem',   // 24px
                lg: '2rem',     // 32px
                xl: '3rem',     // 48px
                '2xl': '4rem',  // 64px
                '3xl': '6rem'   // 96px
            },
            density: 'airy',    // Lots of white space
            sectionSpacing: '6rem',  // 96px between sections
            containerPadding: '2rem'
        },

        // Border radius
        borderRadius: {
            none: '0',
            sm: '0.25rem',   // 4px - subtle rounded
            md: '0.5rem',    // 8px - moderate rounded
            lg: '0.75rem',   // 12px - rounded
            xl: '1rem',      // 16px - very rounded
            full: '9999px',  // Pills
            default: 'sm'    // Minimal uses subtle rounding
        },

        // Shadows
        shadows: {
            intensity: 'subtle',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            default: 'sm'
        },

        // Animations
        animations: {
            speed: 'medium',
            easing: 'ease-out',
            transitions: {
                fast: '150ms',
                medium: '300ms',
                slow: '500ms',
                default: 'medium'
            },
            effects: ['fade', 'slide-up'],  // No bounce, no scale
            hoverEffects: 'subtle'
        },

        // Layout
        layout: {
            maxWidth: '1200px',
            gridColumns: 12,
            gutterSize: '2rem',
            stackedOnMobile: true,
            heroHeight: '70vh',
            sectionMinHeight: '500px'
        },

        // Components
        components: {
            buttons: {
                style: 'filled-with-ghost-secondary',
                padding: '0.75rem 2rem',
                fontSize: 'base',
                transform: 'uppercase',
                letterSpacing: '0.05em'
            },
            cards: {
                elevation: 'sm',
                padding: '2rem',
                border: 'none',
                background: 'white'
            },
            navigation: {
                style: 'horizontal-clean',
                sticky: true,
                transparent: false,
                spacing: '2rem'
            }
        }
    },

    'bold-playful': {
        name: 'Bold & Playful',
        description: 'Vibrant colors, fun shapes, energetic animations',

        typography: {
            headingFont: '"Poppins", "Quicksand", sans-serif',
            bodyFont: '"Open Sans", sans-serif',
            monoFont: '"Fira Code", monospace',
            headingWeight: '800',
            bodyWeight: '400',
            headingLineHeight: '1.1',
            bodyLineHeight: '1.7',
            scale: {
                xs: '0.875rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.25rem',
                xl: '1.5rem',
                '2xl': '2rem',
                '3xl': '3rem',
                '4xl': '4rem',
                '5xl': '5rem'
            }
        },

        colors: {
            paletteType: 'triadic',  // Three vibrant colors
            saturation: 'high',      // Vibrant, saturated colors
            contrast: 'medium',      // Softer contrast for fun feel
            accentStrategy: 'triadic',
            neutralShades: 5,
            rules: {
                primary: 'user-selected',
                secondary: 'triadic-to-primary',
                accent: 'triadic-to-primary-opposite',
                background: 'primary-tint-95%',
                surface: 'white',
                text: 'neutral-800'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.75rem',
                sm: '1.25rem',
                md: '2rem',
                lg: '3rem',
                xl: '4rem',
                '2xl': '5rem',
                '3xl': '7rem'
            },
            density: 'balanced',
            sectionSpacing: '5rem',
            containerPadding: '2.5rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            full: '9999px',
            default: 'lg'  // Bold uses more rounding
        },

        shadows: {
            intensity: 'dramatic',
            sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            md: '0 8px 16px -2px rgba(0, 0, 0, 0.15)',
            lg: '0 16px 32px -4px rgba(0, 0, 0, 0.2)',
            xl: '0 24px 48px -6px rgba(0, 0, 0, 0.25)',
            default: 'md'
        },

        animations: {
            speed: 'fast',
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',  // Bounce
            transitions: {
                fast: '100ms',
                medium: '200ms',
                slow: '400ms',
                default: 'fast'
            },
            effects: ['bounce', 'scale', 'rotate', 'wiggle'],
            hoverEffects: 'dramatic'
        },

        layout: {
            maxWidth: '1400px',
            gridColumns: 12,
            gutterSize: '2.5rem',
            stackedOnMobile: true,
            heroHeight: '80vh',
            sectionMinHeight: '600px'
        },

        components: {
            buttons: {
                style: 'filled-rounded-shadow',
                padding: '1rem 2.5rem',
                fontSize: 'lg',
                transform: 'none',
                letterSpacing: '0',
                hoverScale: '1.05'
            },
            cards: {
                elevation: 'md',
                padding: '2.5rem',
                border: '3px solid currentColor',
                background: 'gradient'
            },
            navigation: {
                style: 'horizontal-bold',
                sticky: true,
                transparent: false,
                spacing: '2.5rem'
            }
        }
    },

    'corporate-trust': {
        name: 'Corporate Trust',
        description: 'Professional, authoritative, traditional business aesthetic',

        typography: {
            headingFont: '"Merriweather", Georgia, serif',
            bodyFont: '"Source Sans Pro", Arial, sans-serif',
            monoFont: '"Roboto Mono", monospace',
            headingWeight: '700',
            bodyWeight: '400',
            headingLineHeight: '1.3',
            bodyLineHeight: '1.8',
            scale: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.375rem',
                '2xl': '1.75rem',
                '3xl': '2.25rem',
                '4xl': '3rem',
                '5xl': '3.5rem'
            }
        },

        colors: {
            paletteType: 'analogous',
            saturation: 'medium',
            contrast: 'high',
            accentStrategy: 'analogous',
            neutralShades: 11,  // More shades for subtle variations
            rules: {
                primary: 'user-selected',
                secondary: 'analogous-to-primary',
                accent: 'gold-or-amber',  // Traditional corporate accent
                background: 'neutral-100',
                surface: 'white',
                text: 'neutral-900'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2.5rem',
                xl: '4rem',
                '2xl': '5rem',
                '3xl': '6rem'
            },
            density: 'moderate',
            sectionSpacing: '5rem',
            containerPadding: '2rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.125rem',  // Minimal rounding
            md: '0.25rem',
            lg: '0.375rem',
            xl: '0.5rem',
            full: '9999px',
            default: 'sm'  // Corporate uses minimal rounding
        },

        shadows: {
            intensity: 'moderate',
            sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            md: '0 4px 8px -1px rgba(0, 0, 0, 0.12)',
            lg: '0 12px 20px -2px rgba(0, 0, 0, 0.15)',
            xl: '0 20px 30px -4px rgba(0, 0, 0, 0.18)',
            default: 'sm'
        },

        animations: {
            speed: 'slow',
            easing: 'ease-in-out',
            transitions: {
                fast: '200ms',
                medium: '400ms',
                slow: '600ms',
                default: 'slow'
            },
            effects: ['fade'],  // Minimal animation
            hoverEffects: 'minimal'
        },

        layout: {
            maxWidth: '1140px',
            gridColumns: 12,
            gutterSize: '1.5rem',
            stackedOnMobile: true,
            heroHeight: '60vh',
            sectionMinHeight: '450px'
        },

        components: {
            buttons: {
                style: 'filled-rectangular',
                padding: '0.875rem 2.5rem',
                fontSize: 'base',
                transform: 'none',
                letterSpacing: '0.025em'
            },
            cards: {
                elevation: 'sm',
                padding: '2rem',
                border: '1px solid neutral-200',
                background: 'white'
            },
            navigation: {
                style: 'horizontal-traditional',
                sticky: false,
                transparent: false,
                spacing: '2rem'
            }
        }
    },

    'dark-sleek': {
        name: 'Dark & Sleek',
        description: 'Modern dark mode with neon accents and futuristic feel',

        typography: {
            headingFont: '"Montserrat", sans-serif',
            bodyFont: '"Raleway", sans-serif',
            monoFont: '"JetBrains Mono", monospace',
            headingWeight: '700',
            bodyWeight: '300',
            headingLineHeight: '1.2',
            bodyLineHeight: '1.6',
            scale: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.75rem',
                '3xl': '2.5rem',
                '4xl': '3.5rem',
                '5xl': '4.5rem'
            }
        },

        colors: {
            paletteType: 'neon-dark',
            saturation: 'high',  // Vibrant neon accents
            contrast: 'high',    // Light text on dark backgrounds
            accentStrategy: 'neon-complementary',
            neutralShades: 9,
            rules: {
                primary: 'user-selected',
                secondary: 'primary-lighter-20%',
                accent: 'neon-complementary',
                background: 'neutral-950',  // Very dark
                surface: 'neutral-900',
                text: 'neutral-50'  // Light text
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
                xl: '3rem',
                '2xl': '4rem',
                '3xl': '5rem'
            },
            density: 'airy',
            sectionSpacing: '6rem',
            containerPadding: '2rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.375rem',
            md: '0.625rem',
            lg: '1rem',
            xl: '1.5rem',
            full: '9999px',
            default: 'md'
        },

        shadows: {
            intensity: 'glow',  // Neon glow instead of drop shadows
            sm: '0 0 10px rgba(var(--primary-rgb), 0.3)',
            md: '0 0 20px rgba(var(--primary-rgb), 0.5)',
            lg: '0 0 30px rgba(var(--primary-rgb), 0.7)',
            xl: '0 0 40px rgba(var(--primary-rgb), 0.9)',
            default: 'md'
        },

        animations: {
            speed: 'medium',
            easing: 'ease-out',
            transitions: {
                fast: '150ms',
                medium: '300ms',
                slow: '500ms',
                default: 'medium'
            },
            effects: ['fade', 'glow', 'slide'],
            hoverEffects: 'glow'
        },

        layout: {
            maxWidth: '1300px',
            gridColumns: 12,
            gutterSize: '2rem',
            stackedOnMobile: true,
            heroHeight: '75vh',
            sectionMinHeight: '550px'
        },

        components: {
            buttons: {
                style: 'outlined-glow',
                padding: '0.875rem 2rem',
                fontSize: 'base',
                transform: 'uppercase',
                letterSpacing: '0.1em'
            },
            cards: {
                elevation: 'glow',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.5)'
            },
            navigation: {
                style: 'horizontal-transparent',
                sticky: true,
                transparent: true,
                spacing: '2rem'
            }
        }
    },

    'warm-friendly': {
        name: 'Warm & Friendly',
        description: 'Approachable, organic, welcoming with soft colors',

        typography: {
            headingFont: '"Nunito", "Comfortaa", sans-serif',
            bodyFont: '"Lato", sans-serif',
            monoFont: '"Source Code Pro", monospace',
            headingWeight: '700',
            bodyWeight: '400',
            headingLineHeight: '1.3',
            bodyLineHeight: '1.7',
            scale: {
                xs: '0.875rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.25rem',
                xl: '1.5rem',
                '2xl': '2rem',
                '3xl': '2.75rem',
                '4xl': '3.5rem',
                '5xl': '4rem'
            }
        },

        colors: {
            paletteType: 'warm-analogous',
            saturation: 'medium',
            contrast: 'medium-low',
            accentStrategy: 'warm-complementary',
            neutralShades: 7,
            rules: {
                primary: 'user-selected',
                secondary: 'warm-analogous',
                accent: 'warm-complementary',
                background: 'warm-neutral-50',
                surface: 'cream-white',
                text: 'warm-neutral-800'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.75rem',
                sm: '1.25rem',
                md: '2rem',
                lg: '3rem',
                xl: '4rem',
                '2xl': '5rem',
                '3xl': '6rem'
            },
            density: 'comfortable',
            sectionSpacing: '5rem',
            containerPadding: '2.5rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.75rem',
            md: '1.25rem',
            lg: '2rem',
            xl: '3rem',
            full: '9999px',
            default: 'lg'  // Warm uses generous rounding
        },

        shadows: {
            intensity: 'soft',
            sm: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
            md: '0 6px 16px -2px rgba(0, 0, 0, 0.12)',
            lg: '0 12px 24px -4px rgba(0, 0, 0, 0.15)',
            xl: '0 20px 32px -6px rgba(0, 0, 0, 0.18)',
            default: 'sm'
        },

        animations: {
            speed: 'medium',
            easing: 'ease-in-out',
            transitions: {
                fast: '150ms',
                medium: '300ms',
                slow: '450ms',
                default: 'medium'
            },
            effects: ['fade', 'slide-up', 'gentle-scale'],
            hoverEffects: 'gentle'
        },

        layout: {
            maxWidth: '1200px',
            gridColumns: 12,
            gutterSize: '2rem',
            stackedOnMobile: true,
            heroHeight: '65vh',
            sectionMinHeight: '500px'
        },

        components: {
            buttons: {
                style: 'filled-rounded',
                padding: '1rem 2.5rem',
                fontSize: 'lg',
                transform: 'none',
                letterSpacing: '0'
            },
            cards: {
                elevation: 'sm',
                padding: '2.5rem',
                border: 'none',
                background: 'white'
            },
            navigation: {
                style: 'horizontal-friendly',
                sticky: true,
                transparent: false,
                spacing: '2rem'
            }
        }
    },

    'enterprise-pro': {
        name: 'Enterprise Pro',
        description: 'Polished enterprise aesthetic with data-driven feel',

        typography: {
            headingFont: '"IBM Plex Sans", "SF Pro Display", -apple-system, sans-serif',
            bodyFont: '"IBM Plex Sans", "SF Pro Text", -apple-system, sans-serif',
            monoFont: '"IBM Plex Mono", "SF Mono", monospace',
            headingWeight: '600',
            bodyWeight: '400',
            headingLineHeight: '1.25',
            bodyLineHeight: '1.65',
            scale: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem',
                '5xl': '3rem'
            }
        },

        colors: {
            paletteType: 'professional-blue',
            saturation: 'medium',
            contrast: 'high',
            accentStrategy: 'complementary',
            neutralShades: 10,
            rules: {
                primary: 'user-selected',
                secondary: 'primary-desaturated-20%',
                accent: 'complementary-muted',
                background: 'neutral-50',
                surface: 'white',
                text: 'neutral-900'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
                xl: '3rem',
                '2xl': '4rem',
                '3xl': '5rem'
            },
            density: 'moderate',
            sectionSpacing: '5rem',
            containerPadding: '2rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            full: '9999px',
            default: 'sm'
        },

        shadows: {
            intensity: 'subtle',
            sm: '0 1px 2px rgba(0, 0, 0, 0.06)',
            md: '0 4px 8px rgba(0, 0, 0, 0.08)',
            lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
            xl: '0 16px 24px rgba(0, 0, 0, 0.12)',
            default: 'sm'
        },

        animations: {
            speed: 'medium',
            easing: 'ease-out',
            transitions: {
                fast: '150ms',
                medium: '250ms',
                slow: '400ms',
                default: 'medium'
            },
            effects: ['fade', 'slide'],
            hoverEffects: 'subtle'
        },

        layout: {
            maxWidth: '1280px',
            gridColumns: 12,
            gutterSize: '1.5rem',
            stackedOnMobile: true,
            heroHeight: '65vh',
            sectionMinHeight: '500px'
        },

        components: {
            buttons: {
                style: 'filled-professional',
                padding: '0.75rem 2rem',
                fontSize: 'base',
                transform: 'none',
                letterSpacing: '0.01em'
            },
            cards: {
                elevation: 'sm',
                padding: '1.5rem',
                border: '1px solid neutral-200',
                background: 'white'
            },
            navigation: {
                style: 'horizontal-enterprise',
                sticky: true,
                transparent: false,
                spacing: '1.5rem'
            }
        }
    },

    'artistic-craft': {
        name: 'Artistic Craft',
        description: 'Handcrafted feel, organic shapes, artisan aesthetic',

        typography: {
            headingFont: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
            bodyFont: '"Crimson Text", "Libre Baskerville", Georgia, serif',
            monoFont: '"Courier Prime", "Courier New", monospace',
            headingWeight: '500',
            bodyWeight: '400',
            headingLineHeight: '1.2',
            bodyLineHeight: '1.8',
            scale: {
                xs: '0.875rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.25rem',
                xl: '1.5rem',
                '2xl': '2rem',
                '3xl': '2.75rem',
                '4xl': '3.5rem',
                '5xl': '4.5rem'
            }
        },

        colors: {
            paletteType: 'earthy-warm',
            saturation: 'low-medium',
            contrast: 'medium',
            accentStrategy: 'analogous-warm',
            neutralShades: 7,
            rules: {
                primary: 'user-selected',
                secondary: 'earthy-complement',
                accent: 'warm-gold',
                background: 'cream-white',
                surface: 'warm-white',
                text: 'warm-brown'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.75rem',
                sm: '1.25rem',
                md: '2rem',
                lg: '3rem',
                xl: '4.5rem',
                '2xl': '6rem',
                '3xl': '8rem'
            },
            density: 'generous',
            sectionSpacing: '6rem',
            containerPadding: '3rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            full: '9999px',
            default: 'md'
        },

        shadows: {
            intensity: 'soft',
            sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
            md: '0 6px 20px rgba(0, 0, 0, 0.08)',
            lg: '0 12px 32px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 40px rgba(0, 0, 0, 0.12)',
            default: 'md'
        },

        animations: {
            speed: 'slow',
            easing: 'ease-in-out',
            transitions: {
                fast: '200ms',
                medium: '400ms',
                slow: '600ms',
                default: 'slow'
            },
            effects: ['fade', 'gentle-slide'],
            hoverEffects: 'elegant'
        },

        layout: {
            maxWidth: '1100px',
            gridColumns: 12,
            gutterSize: '2.5rem',
            stackedOnMobile: true,
            heroHeight: '75vh',
            sectionMinHeight: '550px'
        },

        components: {
            buttons: {
                style: 'outlined-elegant',
                padding: '1rem 2.5rem',
                fontSize: 'base',
                transform: 'none',
                letterSpacing: '0.05em'
            },
            cards: {
                elevation: 'soft',
                padding: '2.5rem',
                border: 'none',
                background: 'warm-white'
            },
            navigation: {
                style: 'horizontal-elegant',
                sticky: false,
                transparent: false,
                spacing: '2.5rem'
            }
        }
    },

    'retro-vintage': {
        name: 'Retro Vintage',
        description: 'Nostalgic design with classic typography and retro colors',

        typography: {
            headingFont: '"Bebas Neue", "Oswald", Impact, sans-serif',
            bodyFont: '"Roboto Slab", "Rockwell", Georgia, serif',
            monoFont: '"Special Elite", "Courier New", monospace',
            headingWeight: '400',
            bodyWeight: '400',
            headingLineHeight: '1.1',
            bodyLineHeight: '1.7',
            scale: {
                xs: '0.875rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.375rem',
                xl: '1.75rem',
                '2xl': '2.5rem',
                '3xl': '3.5rem',
                '4xl': '5rem',
                '5xl': '7rem'
            }
        },

        colors: {
            paletteType: 'retro-warm',
            saturation: 'muted',
            contrast: 'medium-high',
            accentStrategy: 'retro-pop',
            neutralShades: 6,
            rules: {
                primary: 'user-selected',
                secondary: 'retro-complement',
                accent: 'retro-pop',
                background: 'cream-vintage',
                surface: 'paper-white',
                text: 'dark-sepia'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2.5rem',
                xl: '4rem',
                '2xl': '5rem',
                '3xl': '6rem'
            },
            density: 'moderate',
            sectionSpacing: '5rem',
            containerPadding: '2rem'
        },

        borderRadius: {
            none: '0',
            sm: '0',
            md: '0.125rem',
            lg: '0.25rem',
            xl: '0.375rem',
            full: '9999px',
            default: 'none'
        },

        shadows: {
            intensity: 'dramatic',
            sm: '3px 3px 0 rgba(0, 0, 0, 0.15)',
            md: '5px 5px 0 rgba(0, 0, 0, 0.2)',
            lg: '8px 8px 0 rgba(0, 0, 0, 0.25)',
            xl: '12px 12px 0 rgba(0, 0, 0, 0.3)',
            default: 'md'
        },

        animations: {
            speed: 'medium',
            easing: 'ease-in-out',
            transitions: {
                fast: '150ms',
                medium: '300ms',
                slow: '450ms',
                default: 'medium'
            },
            effects: ['fade'],
            hoverEffects: 'subtle'
        },

        layout: {
            maxWidth: '1100px',
            gridColumns: 12,
            gutterSize: '2rem',
            stackedOnMobile: true,
            heroHeight: '70vh',
            sectionMinHeight: '500px'
        },

        components: {
            buttons: {
                style: 'retro-filled',
                padding: '0.875rem 2rem',
                fontSize: 'lg',
                transform: 'uppercase',
                letterSpacing: '0.1em'
            },
            cards: {
                elevation: 'dramatic',
                padding: '2rem',
                border: '3px solid currentColor',
                background: 'paper-white'
            },
            navigation: {
                style: 'horizontal-retro',
                sticky: false,
                transparent: false,
                spacing: '2rem'
            }
        }
    },

    'gradient-glass': {
        name: 'Gradient Glass',
        description: 'Glassmorphism with colorful gradients, modern app aesthetic',

        typography: {
            headingFont: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            bodyFont: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
            monoFont: '"SF Mono", Monaco, monospace',
            headingWeight: '600',
            bodyWeight: '400',
            headingLineHeight: '1.2',
            bodyLineHeight: '1.6',
            scale: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.75rem',
                '5xl': '3.5rem'
            }
        },

        colors: {
            paletteType: 'gradient-vibrant',
            saturation: 'high',
            contrast: 'medium',
            accentStrategy: 'gradient-complement',
            neutralShades: 8,
            rules: {
                primary: 'user-selected',
                secondary: 'gradient-shift-30deg',
                accent: 'gradient-shift-60deg',
                background: 'gradient-mesh',
                surface: 'glass-frosted',
                text: 'neutral-900'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2rem',
                xl: '3rem',
                '2xl': '4rem',
                '3xl': '5rem'
            },
            density: 'balanced',
            sectionSpacing: '5rem',
            containerPadding: '2rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.75rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2rem',
            full: '9999px',
            default: 'lg'
        },

        shadows: {
            intensity: 'soft-glow',
            sm: '0 4px 16px rgba(var(--primary-rgb), 0.15)',
            md: '0 8px 32px rgba(var(--primary-rgb), 0.2)',
            lg: '0 16px 48px rgba(var(--primary-rgb), 0.25)',
            xl: '0 24px 64px rgba(var(--primary-rgb), 0.3)',
            default: 'md'
        },

        animations: {
            speed: 'fast',
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitions: {
                fast: '100ms',
                medium: '200ms',
                slow: '350ms',
                default: 'fast'
            },
            effects: ['fade', 'scale', 'blur'],
            hoverEffects: 'lift-glow'
        },

        layout: {
            maxWidth: '1300px',
            gridColumns: 12,
            gutterSize: '2rem',
            stackedOnMobile: true,
            heroHeight: '80vh',
            sectionMinHeight: '550px'
        },

        components: {
            buttons: {
                style: 'glass-filled',
                padding: '0.875rem 2rem',
                fontSize: 'base',
                transform: 'none',
                letterSpacing: '0'
            },
            cards: {
                elevation: 'glass',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)'
            },
            navigation: {
                style: 'horizontal-glass',
                sticky: true,
                transparent: true,
                spacing: '2rem'
            }
        }
    },

    'neo-brutalist': {
        name: 'Neo Brutalist',
        description: 'Bold borders, raw aesthetic, high contrast with chunky elements',

        typography: {
            headingFont: '"Space Grotesk", "Work Sans", sans-serif',
            bodyFont: '"Inter", "Work Sans", sans-serif',
            monoFont: '"Space Mono", "Roboto Mono", monospace',
            headingWeight: '700',
            bodyWeight: '500',
            headingLineHeight: '1.1',
            bodyLineHeight: '1.6',
            scale: {
                xs: '0.875rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.375rem',
                xl: '1.75rem',
                '2xl': '2.5rem',
                '3xl': '3.5rem',
                '4xl': '5rem',
                '5xl': '7rem'
            }
        },

        colors: {
            paletteType: 'high-contrast',
            saturation: 'full',
            contrast: 'maximum',
            accentStrategy: 'complementary-pop',
            neutralShades: 4,
            rules: {
                primary: 'user-selected',
                secondary: 'black-or-white',
                accent: 'pop-color',
                background: 'cream-or-black',
                surface: 'white',
                text: 'black'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.5rem',
                sm: '1rem',
                md: '1.5rem',
                lg: '2.5rem',
                xl: '4rem',
                '2xl': '6rem',
                '3xl': '8rem'
            },
            density: 'chunky',
            sectionSpacing: '6rem',
            containerPadding: '2rem'
        },

        borderRadius: {
            none: '0',
            sm: '0',
            md: '0',
            lg: '0',
            xl: '0',
            full: '9999px',
            default: 'none'
        },

        shadows: {
            intensity: 'brutal',
            sm: '4px 4px 0 #000',
            md: '6px 6px 0 #000',
            lg: '8px 8px 0 #000',
            xl: '12px 12px 0 #000',
            default: 'md'
        },

        animations: {
            speed: 'instant',
            easing: 'linear',
            transitions: {
                fast: '0ms',
                medium: '100ms',
                slow: '200ms',
                default: 'fast'
            },
            effects: ['none'],
            hoverEffects: 'shift'
        },

        layout: {
            maxWidth: '1400px',
            gridColumns: 12,
            gutterSize: '2rem',
            stackedOnMobile: true,
            heroHeight: '85vh',
            sectionMinHeight: '600px'
        },

        components: {
            buttons: {
                style: 'brutal-filled',
                padding: '1rem 2.5rem',
                fontSize: 'lg',
                transform: 'uppercase',
                letterSpacing: '0.05em',
                border: '3px solid #000'
            },
            cards: {
                elevation: 'brutal',
                padding: '2rem',
                border: '3px solid #000',
                background: 'white'
            },
            navigation: {
                style: 'horizontal-brutal',
                sticky: false,
                transparent: false,
                spacing: '2rem'
            }
        }
    },

    'nature-organic': {
        name: 'Nature Organic',
        description: 'Earth tones, natural imagery, eco-friendly and sustainable vibe',

        typography: {
            headingFont: '"DM Serif Display", "Libre Baskerville", Georgia, serif',
            bodyFont: '"Source Sans Pro", "Open Sans", sans-serif',
            monoFont: '"Source Code Pro", monospace',
            headingWeight: '400',
            bodyWeight: '400',
            headingLineHeight: '1.3',
            bodyLineHeight: '1.75',
            scale: {
                xs: '0.875rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.25rem',
                xl: '1.5rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
                '4xl': '3.25rem',
                '5xl': '4rem'
            }
        },

        colors: {
            paletteType: 'earth-tones',
            saturation: 'natural',
            contrast: 'soft',
            accentStrategy: 'forest-complement',
            neutralShades: 8,
            rules: {
                primary: 'user-selected',
                secondary: 'earth-complement',
                accent: 'leaf-green',
                background: 'off-white-warm',
                surface: 'natural-white',
                text: 'earth-brown'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.75rem',
                sm: '1.25rem',
                md: '2rem',
                lg: '3rem',
                xl: '4.5rem',
                '2xl': '6rem',
                '3xl': '8rem'
            },
            density: 'relaxed',
            sectionSpacing: '6rem',
            containerPadding: '2.5rem'
        },

        borderRadius: {
            none: '0',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '2.5rem',
            full: '9999px',
            default: 'lg'
        },

        shadows: {
            intensity: 'natural',
            sm: '0 2px 8px rgba(34, 51, 34, 0.08)',
            md: '0 6px 16px rgba(34, 51, 34, 0.12)',
            lg: '0 12px 28px rgba(34, 51, 34, 0.15)',
            xl: '0 20px 40px rgba(34, 51, 34, 0.18)',
            default: 'sm'
        },

        animations: {
            speed: 'slow',
            easing: 'ease-in-out',
            transitions: {
                fast: '200ms',
                medium: '400ms',
                slow: '600ms',
                default: 'medium'
            },
            effects: ['fade', 'grow'],
            hoverEffects: 'gentle'
        },

        layout: {
            maxWidth: '1200px',
            gridColumns: 12,
            gutterSize: '2.5rem',
            stackedOnMobile: true,
            heroHeight: '70vh',
            sectionMinHeight: '550px'
        },

        components: {
            buttons: {
                style: 'organic-filled',
                padding: '1rem 2.5rem',
                fontSize: 'base',
                transform: 'none',
                letterSpacing: '0.02em'
            },
            cards: {
                elevation: 'soft',
                padding: '2.5rem',
                border: 'none',
                background: 'natural-white'
            },
            navigation: {
                style: 'horizontal-organic',
                sticky: true,
                transparent: false,
                spacing: '2rem'
            }
        }
    },

    'soft-pastel': {
        name: 'Soft Pastel',
        description: 'Light pastel palette, gentle gradients, dreamy aesthetic',

        typography: {
            headingFont: '"Quicksand", "Poppins", sans-serif',
            bodyFont: '"Nunito", "Lato", sans-serif',
            monoFont: '"Fira Code", monospace',
            headingWeight: '600',
            bodyWeight: '400',
            headingLineHeight: '1.3',
            bodyLineHeight: '1.7',
            scale: {
                xs: '0.875rem',
                sm: '1rem',
                base: '1.125rem',
                lg: '1.25rem',
                xl: '1.5rem',
                '2xl': '2rem',
                '3xl': '2.5rem',
                '4xl': '3.25rem',
                '5xl': '4rem'
            }
        },

        colors: {
            paletteType: 'pastel-soft',
            saturation: 'very-low',
            contrast: 'low',
            accentStrategy: 'pastel-complement',
            neutralShades: 6,
            rules: {
                primary: 'user-selected',
                secondary: 'pastel-tint',
                accent: 'pastel-pop',
                background: 'pastel-lightest',
                surface: 'white',
                text: 'neutral-700'
            }
        },

        spacing: {
            gridBase: 8,
            scale: {
                none: '0',
                xs: '0.75rem',
                sm: '1.25rem',
                md: '2rem',
                lg: '3rem',
                xl: '4rem',
                '2xl': '5rem',
                '3xl': '6rem'
            },
            density: 'airy',
            sectionSpacing: '5rem',
            containerPadding: '2.5rem'
        },

        borderRadius: {
            none: '0',
            sm: '1rem',
            md: '1.5rem',
            lg: '2rem',
            xl: '3rem',
            full: '9999px',
            default: 'lg'
        },

        shadows: {
            intensity: 'dreamy',
            sm: '0 4px 12px rgba(0, 0, 0, 0.04)',
            md: '0 8px 24px rgba(0, 0, 0, 0.06)',
            lg: '0 16px 40px rgba(0, 0, 0, 0.08)',
            xl: '0 24px 56px rgba(0, 0, 0, 0.1)',
            default: 'md'
        },

        animations: {
            speed: 'medium',
            easing: 'ease-in-out',
            transitions: {
                fast: '150ms',
                medium: '300ms',
                slow: '450ms',
                default: 'medium'
            },
            effects: ['fade', 'float'],
            hoverEffects: 'gentle-lift'
        },

        layout: {
            maxWidth: '1200px',
            gridColumns: 12,
            gutterSize: '2rem',
            stackedOnMobile: true,
            heroHeight: '70vh',
            sectionMinHeight: '500px'
        },

        components: {
            buttons: {
                style: 'pastel-filled',
                padding: '1rem 2.5rem',
                fontSize: 'base',
                transform: 'none',
                letterSpacing: '0'
            },
            cards: {
                elevation: 'dreamy',
                padding: '2.5rem',
                border: 'none',
                background: 'white'
            },
            navigation: {
                style: 'horizontal-soft',
                sticky: true,
                transparent: false,
                spacing: '2rem'
            }
        }
    }
};

/**
 * Get style configuration by name
 * @param {string} styleName - Style name from dropdown
 * @returns {object} Style configuration
 */
export function getStyleConfig(styleName) {
    return STYLE_MATRIX[styleName] || STYLE_MATRIX['modern-minimal'];
}

/**
 * Generate CSS variables from style config
 * @param {object} styleConfig - Style configuration
 * @param {object} colors - Color palette from design system
 * @returns {string} CSS :root variables
 */
export function generateCSSVariables(styleConfig, colors, typography) {
    // Handle cases where parameters might be undefined
    if (!styleConfig) {
        console.error('[StyleMatrix] styleConfig is undefined');
        return ':root {}';
    }
    if (!colors) {
        console.error('[StyleMatrix] colors is undefined');
        return ':root {}';
    }
    if (!typography) {
        console.error('[StyleMatrix] typography is undefined');
        return ':root {}';
    }

    const spacing = styleConfig.spacing || {};
    const borderRadius = styleConfig.borderRadius || {};
    const shadows = styleConfig.shadows || {};
    const animations = styleConfig.animations || {};

    return `:root {
    /* Colors */
    --color-primary: ${colors.primary || '#3B82F6'};
    --color-secondary: ${colors.secondary || '#60A5FA'};
    --color-accent: ${colors.accent || '#F59E0B'};
    --color-background: ${colors.background || '#ffffff'};
    --color-surface: ${colors.surface || '#ffffff'};
    --color-text: ${colors.text || '#1a1a1a'};

    /* Neutral colors from colors.neutral */
    --color-neutral-50: ${colors.neutral?.['50'] || '#F9FAFB'};
    --color-neutral-100: ${colors.neutral?.['100'] || '#F3F4F6'};
    --color-neutral-200: ${colors.neutral?.['200'] || '#E5E7EB'};
    --color-neutral-300: ${colors.neutral?.['300'] || '#D1D5DB'};
    --color-neutral-400: ${colors.neutral?.['400'] || '#9CA3AF'};
    --color-neutral-500: ${colors.neutral?.['500'] || '#6B7280'};
    --color-neutral-600: ${colors.neutral?.['600'] || '#4B5563'};
    --color-neutral-700: ${colors.neutral?.['700'] || '#374151'};
    --color-neutral-800: ${colors.neutral?.['800'] || '#1F2937'};
    --color-neutral-900: ${colors.neutral?.['900'] || '#111827'};

    /* Typography - from API response */
    --font-primary: ${typography.fontFamily?.primary || 'system-ui, sans-serif'};
    --font-heading: ${typography.fontFamily?.heading || typography.fontFamily?.primary || 'system-ui, sans-serif'};
    --font-body: ${typography.fontFamily?.primary || 'system-ui, sans-serif'};

    /* Font sizes - from API response */
    --font-size-xs: ${typography.fontSize?.xs || '0.75rem'};
    --font-size-sm: ${typography.fontSize?.sm || '0.875rem'};
    --font-size-base: ${typography.fontSize?.base || '1rem'};
    --font-size-lg: ${typography.fontSize?.lg || '1.125rem'};
    --font-size-xl: ${typography.fontSize?.xl || '1.25rem'};
    --font-size-2xl: ${typography.fontSize?.['2xl'] || '1.5rem'};
    --font-size-3xl: ${typography.fontSize?.['3xl'] || '1.875rem'};
    --font-size-4xl: ${typography.fontSize?.['4xl'] || '2.25rem'};
    --font-size-5xl: ${typography.fontSize?.['5xl'] || '3rem'};
    --font-size-6xl: ${typography.fontSize?.['6xl'] || '3.75rem'};

    /* Font weights - from API response */
    --font-weight-light: ${typography.fontWeight?.light || 300};
    --font-weight-normal: ${typography.fontWeight?.normal || 400};
    --font-weight-medium: ${typography.fontWeight?.medium || 500};
    --font-weight-semibold: ${typography.fontWeight?.semibold || 600};
    --font-weight-bold: ${typography.fontWeight?.bold || 700};

    /* Line heights - from API response */
    --line-height-tight: ${typography.lineHeight?.tight || 1.25};
    --line-height-normal: ${typography.lineHeight?.normal || 1.5};
    --line-height-relaxed: ${typography.lineHeight?.relaxed || 1.75};

    /* Spacing - from style matrix */
    --spacing-base: ${spacing.gridBase || 8}px;
    --spacing-xs: ${spacing.gridBase ? spacing.gridBase * 0.5 + 'px' : '4px'};
    --spacing-sm: ${spacing.gridBase ? spacing.gridBase * 1 + 'px' : '8px'};
    --spacing-md: ${spacing.gridBase ? spacing.gridBase * 2 + 'px' : '16px'};
    --spacing-lg: ${spacing.gridBase ? spacing.gridBase * 3 + 'px' : '24px'};
    --spacing-xl: ${spacing.gridBase ? spacing.gridBase * 4 + 'px' : '32px'};
    --spacing-2xl: ${spacing.gridBase ? spacing.gridBase * 6 + 'px' : '48px'};
    --spacing-3xl: ${spacing.gridBase ? spacing.gridBase * 8 + 'px' : '64px'};
    --spacing-4: ${spacing.gridBase ? spacing.gridBase * 2 + 'px' : '16px'};
    --spacing-6: ${spacing.gridBase ? spacing.gridBase * 3 + 'px' : '24px'};
    --section-spacing: ${spacing.sectionSpacing || '5rem'};
    --container-padding: ${spacing.containerPadding || '1rem'};
    --max-width: ${styleConfig.layout?.maxWidth || '1200px'};

    /* Border radius */
    --radius-sm: ${borderRadius.sm || '0.25rem'};
    --radius-md: ${borderRadius.md || '0.5rem'};
    --radius-lg: ${borderRadius.lg || '0.75rem'};
    --radius-xl: ${borderRadius.xl || '1rem'};
    --radius-full: ${borderRadius.full || '9999px'};

    /* Shadows */
    --shadow-sm: ${shadows.sm || '0 1px 2px rgba(0,0,0,0.05)'};
    --shadow-md: ${shadows.md || '0 4px 6px rgba(0,0,0,0.1)'};
    --shadow-lg: ${shadows.lg || '0 10px 15px rgba(0,0,0,0.1)'};
    --shadow-xl: ${shadows.xl || '0 20px 25px rgba(0,0,0,0.1)'};

    /* Animations */
    --transition-fast: ${animations.transitions?.fast || '150ms'};
    --transition-medium: ${animations.transitions?.medium || '300ms'};
    --transition-slow: ${animations.transitions?.slow || '500ms'};
    --ease-out: ${animations.easing || 'cubic-bezier(0.16, 1, 0.3, 1)'};
}`;
}

/**
 * Get component-specific styling rules
 * @param {string} componentType - Type of component (button, card, etc.)
 * @param {object} styleConfig - Style configuration
 * @returns {object} Component styling rules
 */
export function getComponentRules(componentType, styleConfig) {
    return styleConfig.components[componentType] || {};
}
