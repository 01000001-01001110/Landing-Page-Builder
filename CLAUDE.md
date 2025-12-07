# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Landing Page Builder** - Generate production-ready landing pages in seconds using AI. Built with Claude Sonnet and Gemini 2.5 Flash for code and image generation.

- **Code Generation**: Claude Sonnet 4 + Haiku (Anthropic API)
- **Image Generation**: Gemini 2.5 Flash (Google AI API)
- **Parallel Processing**: Design system, components, and images generate simultaneously
- **Quality System**: Automated validation with Sonnet-powered auto-fix
- **Generation Time**: ~30-60 seconds

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS with ES6 modules (no build step)
- **Code Generation**: Claude Sonnet 4 (planning/validation) + Haiku (components)
- **Image Generation**: Gemini 2.5 Flash Image
- **ZIP Creation**: JSZip (client-side)
- **Preview**: Sandboxed iframe with blob URLs
- **Server**: Python HTTP server with API proxy (bypasses CORS)

## Project Structure

```
/landing-page-builder/
├── index.html                  # Main application
├── server.py                   # Python server with API proxy
├── start.bat                   # Windows start script
├── css/
│   └── styles.css              # Application styles (Fluent Design)
├── js/
│   ├── app.js                  # Main controller & orchestration
│   ├── api-manager.js          # API key management (localStorage)
│   ├── claude-client.js        # Anthropic API client
│   ├── gemini-client.js        # Google AI client
│   ├── orchestrator.js         # 4-phase parallel task execution
│   ├── progressive-renderer.js # Real-time progress UI
│   ├── html-validator.js       # Validation & auto-fix
│   ├── style-matrix.js         # 12 design system configurations
│   ├── prompt-engineering.js   # Advanced prompt system
│   ├── prompt-builder.js       # Prompt construction utilities
│   ├── image-prompt-predictor.js # Predictive image generation
│   ├── preview-manager.js      # Preview rendering
│   ├── response-parser.js      # Robust JSON parsing
│   ├── validator.js            # Code quality validation
│   └── zip-builder.js          # ZIP file creation
├── .env.example                # Environment template (copy to .env)
├── .gitignore                  # Git ignore rules
└── README.md                   # Documentation
```

## 4-Phase Orchestration System

### Phase 1: Planning (Sequential)
- Create execution plan based on inputs
- Enhance user description into marketing copy (Haiku)

### Phase 2: Execution (Parallel)
- **Design System** (Sonnet): Color palette, typography
- **Images** (Gemini): Hero image + feature icons (3-6)
- **Components** (Haiku): Header, hero, features, testimonials, CTA, footer

### Phase 3: Assembly (Sequential)
- HTML assembly with image path validation (Haiku)
- CSS compilation with variables
- JavaScript bundling

### Phase 4: Complete (Sequential)
- Validation & auto-fix (Sonnet)
- Final rendering in preview iframe

## Multi-Model Strategy

| Model | Role | Why |
|-------|------|-----|
| Claude Sonnet 4 | Planning, design system, validation | Strategic decisions |
| Claude Haiku | Components, content enhancement | Fast, matches Sonnet quality |
| Gemini 2.5 Flash | Image generation | Cost-effective, high-quality |

## Key API Specifications

### Claude API (via proxy)

**Endpoint**: `/api/claude` → `https://api.anthropic.com/v1/messages`

```javascript
{
  model: 'claude-sonnet-4-20250514',  // or claude-haiku-4-5-20251001
  max_tokens: 8192,
  temperature: 0.7,
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: USER_PROMPT }]
}
```

### Gemini API (via proxy)

**Endpoint**: `/api/gemini` → `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`

```javascript
{
  contents: [{ parts: [{ text: IMAGE_PROMPT }] }],
  generationConfig: { responseModalities: ['IMAGE'] }
}
```

## Style Matrix System

The `style-matrix.js` contains 12 complete design systems:

| Category | Styles |
|----------|--------|
| Professional | modern-minimal, corporate-trust, enterprise-pro |
| Creative | bold-playful, artistic-craft, retro-vintage |
| Modern | dark-sleek, gradient-glass, neo-brutalist |
| Approachable | warm-friendly, nature-organic, soft-pastel |

Each style defines:
- Color rules (palette type, saturation, contrast)
- Typography (fonts, weights, scale)
- Spacing (grid base, section spacing)
- Shadows (intensity, values)
- Border radius
- Animations (speed, transitions)
- Component-specific rules

## Industry Feature Topics

The orchestrator maps 28 industries to relevant feature topics:

```javascript
'tech': ['Innovation', 'Automation', 'Analytics', 'Security'],
'healthcare': ['Patient Care', 'Medical Technology', 'Telemedicine'],
'finance': ['Security', 'Investment', 'Analytics', 'Compliance'],
// ... etc
```

## Running the Application

```bash
# Start server (Python 3.8+)
python server.py
# or on Windows:
start.bat

# Opens browser at http://localhost:8000
```

### API Keys Setup

1. Click "API Settings" in the app header
2. Enter Anthropic and Google AI API keys
3. Click "Save Keys" (stored in localStorage)

## Common Development Tasks

### Adding a New Design Style

1. Add configuration to `js/style-matrix.js`
2. Add option to `index.html` style dropdown with `data-desc` attribute
3. Add to `validStyles` array in `js/app.js`

### Adding a New Industry

1. Add option to `index.html` industry dropdown with `data-desc`
2. Add feature topics to `featureTopics` in `js/orchestrator.js`
3. Add to `validIndustries` array in `js/app.js`

### Modifying Component Generation

Edit prompts in `js/orchestrator.js`:
- `executeComponentTask()` - Component-specific prompts
- `executeDesignSystemTask()` - Color/typography prompts
- `executeImageTask()` - Image prompt construction

## Security Notes

- API keys stored in browser localStorage (client-side only)
- `.env` file is gitignored (never commit real keys)
- Python server proxies API requests (bypasses CORS)
- For production: implement backend proxy to protect keys

## Cost Estimates

| Service | Cost per Generation |
|---------|---------------------|
| Claude Sonnet/Haiku | ~$0.15-0.30 |
| Gemini 2.5 Flash | ~$0.20-0.30 (5-7 images) |
| **Total** | **~$0.35-0.60** |

## Debugging

- Browser console: JS errors, API responses
- Server terminal: API proxy logs with request/response details
- Progress UI: Shows task status and timing
- Validation panel: Code quality issues

## Generated Output Structure

```
/company-name/
├── index.html      # Complete landing page
├── README.md       # Usage instructions
├── css/
│   └── styles.css  # CSS with variables
├── js/
│   └── main.js     # Smooth scroll, mobile menu
└── images/
    ├── hero.png    # 16:9 hero image
    └── feature-*.png # 1:1 feature icons
```
