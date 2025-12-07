# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Landing Page Builder** - An advanced web application that generates exceptional, production-ready landing pages using AI with quality validation and **parallel generation** for 2x faster performance.

- **Code Generation**: Claude Sonnet 4.5 (Anthropic API)
- **Image Generation**: Gemini 2.5 Flash Image (Google AI API)
- **Parallel Processing**: Code and images generate simultaneously ⚡
- **Quality System**: Automated validation with scoring (0-100)
- **Prompt Engineering**: Advanced multi-layer prompting with best practices
- **Generation Time**: 30-60 seconds (down from 60-130s)

## Tech Stack

- **UI**: Vanilla HTML/CSS/JS with ES6 modules
- **Code Generation API**: Claude Sonnet 4.5 (`claude-sonnet-4-5`)
- **Image Generation API**: Gemini 2.5 Flash Image
- **ZIP Creation**: JSZip (client-side)
- **Preview**: Sandboxed iframe with blob URLs
- **Server**: Python HTTP server with API proxy (bypasses CORS)
- **Validation**: Custom quality checking system

## Planned Architecture

```
/landing-page-builder/
├── index.html              # Main application shell
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── app.js                      # Main application controller (parallel orchestration)
│   ├── api-manager.js              # API key storage (localStorage)
│   ├── claude-client.js            # Anthropic API integration
│   ├── gemini-client.js            # Google AI integration
│   ├── prompt-engineering.js       # Advanced prompt system ⭐
│   ├── image-prompt-predictor.js   # Predictive image generation ⚡ NEW
│   ├── validator.js                # Code quality validation ⭐
│   ├── response-parser.js          # Robust JSON parsing (3 strategies)
│   ├── preview-manager.js          # Iframe preview with fallbacks
│   └── zip-builder.js              # ZIP file creation
├── server.py                   # Local server with API proxy
└── setup-keys.html             # API key setup helper
```

## Advanced Prompt Engineering System

### System Architecture

The application uses a **3-layer prompt engineering approach**:

1. **Enhanced System Prompt** (`ENHANCED_SYSTEM_PROMPT`)
   - 400+ lines of detailed instructions
   - Quality checklist built-in
   - Extended thinking guidance
   - Accessibility requirements
   - Performance specifications

2. **Context-Rich User Prompt** (`buildEnhancedPrompt()`)
   - Brand identity context
   - Detailed style guides (typography, colors, layout)
   - Industry-specific guidance
   - User psychology principles
   - 150+ word image prompts

3. **Validation Layer** (`validateGeneratedCode()`)
   - HTML validation (semantic, accessibility)
   - CSS validation (responsive, performance)
   - JS validation (syntax, modern patterns)
   - Image manifest validation
   - Quality scoring (0-100)

### Key Features

- **Claude Sonnet 4.5**: Latest Claude model, exceptional for coding and complex tasks
- **Industry Context**: Tailored approach for each industry
- **Style Guides**: Detailed specifications for each visual style
- **Quality Metrics**: Automated validation with actionable feedback

## Key API Specifications

### Claude Sonnet 4.5

**Model**: `claude-sonnet-4-5`
**Endpoint**: `/api/claude` (local proxy) → `https://api.anthropic.com/v1/messages`
**Pricing**: $3 per million input tokens, $15 per million output tokens

**Headers**:
- `Content-Type`: `application/json`
- `x-api-key`: User's Anthropic API key
- `anthropic-version`: `2023-06-01`
- `anthropic-beta`: `structured-outputs-2025-11-13` (optional, for guaranteed JSON)

**Request body**:
```javascript
{
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 8192,
  temperature: 0.7,
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: USER_PROMPT }]
}
```

**Expected Response Format** (JSON from Claude):
```javascript
{
  "html": "<!DOCTYPE html>...",
  "css": ":root { --primary: ... } ...",
  "js": "// JavaScript code...",
  "imageManifest": [
    {
      "filename": "hero.png",
      "prompt": "Detailed image generation prompt...",
      "aspectRatio": "16:9"
    }
  ]
}
```

### Nano Banana (Gemini 2.5 Flash Image)

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`

**Headers**:
- `Content-Type`: `application/json`
- `x-goog-api-key`: User's Google AI API key

**Request body**:
```javascript
{
  contents: [{
    parts: [{ text: IMAGE_PROMPT }]
  }],
  generationConfig: {
    responseModalities: ['IMAGE']
  }
}
```

**Response**: Returns base64 PNG in `candidates[0].content.parts[0].inlineData.data`

**Supported Aspect Ratios**: 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9

## Application Flow (Parallel Architecture)

1. **Input Collection**: User provides company name, slogan, description, style preferences

2. **Parallel Generation** (⚡ Key Innovation):
   - **Predict** image manifest based on form inputs
   - **Launch simultaneously**:
     * Task 1: Claude Sonnet 4.5 generates code (30-60s)
     * Task 2: ALL images generate in parallel (5-10s max)
   - Both complete independently using `Promise.all()`
   - **Time savings**: 2x faster (50% reduction)

3. **Merge & Validate**:
   - Parse Claude's JSON response
   - Validate code quality (HTML, CSS, JS)
   - Merge code + images

4. **Preview**:
   - Create blob URLs for images
   - Inject CSS/JS inline into HTML
   - Render in sandboxed iframe
   - Show validation score

5. **Download**:
   - Use JSZip to create folder structure
   - Add all files with proper paths
   - Generate zip blob and trigger download

## State Management

Application state should track:
- API keys (from localStorage)
- User inputs (form data)
- Generation status (idle | generating | complete | error)
- Current step and progress (for UI feedback)
- Output (html, css, js, images array)
- Preview blob URL

## Security Considerations

- **API Keys**: Stored in localStorage (client-side only for MVP)
- **Preview Iframe**: Must use `sandbox="allow-scripts allow-same-origin"` attribute
- **XSS Prevention**: Sanitize user inputs before including in prompts
- **Content Policy**: Handle API errors for content policy violations gracefully
- **Future**: Backend proxy recommended for production to protect API keys

## Prompt Engineering Guidelines

### Claude 4 Best Practices
- Be explicit and direct (use "Generate..." not "Can you generate...")
- Provide context and motivation
- Use structured outputs (JSON schema)
- Specify exact output format in system prompt

### Nano Banana Best Practices
- Describe scenes narratively, not as keyword lists
- Specify style explicitly (photorealistic, illustrated, etc.)
- Include lighting and mood details
- For text-free images, explicitly state "No text in the image"
- Specify background requirements (white, transparent, etc.)

## Error Handling Strategy

Implement graceful degradation:
- If images fail, use placeholder SVGs or allow partial download
- Display clear error messages with recovery instructions
- Handle rate limits (429 responses) with appropriate user messaging
- Validate API keys before generation
- Provide detailed technical error info in collapsible sections

## Generated Output Structure

Landing pages should include:
- **Header**: Logo (text-based) and navigation
- **Hero**: Headline, subheadline, CTA button, hero image
- **Features**: 3-6 features with icons/images, titles, descriptions
- **Testimonials**: Optional, 3 customer quotes with background image
- **CTA**: Call-to-action section
- **Footer**: Copyright and social links

All generated code must be:
- Semantic HTML5
- Mobile-first responsive CSS (breakpoint at 768px)
- CSS custom properties for theming
- Smooth scroll behavior
- Accessibility-compliant (ARIA labels)

## Important Implementation Details

### Server Proxy System

The Python server (`server.py`) includes API proxies to bypass CORS restrictions:

- `/api/claude` → Anthropic API
- `/api/gemini` → Google AI API

JavaScript sends requests to local endpoints which forward to external APIs with proper headers.

### Preview System

The preview manager has **3 fallback patterns** for CSS/JS injection:

1. Replace existing `<link>` or `<script>` tags
2. Inject before `</head>` or `</body>`
3. Inject after `<head>` tag

This ensures CSS/JS always loads regardless of Claude's output format.

### Validation Criteria

Code quality is scored on:
- **Passes** (+5 points each): Semantic HTML, CSS variables, responsive design, etc.
- **Warnings** (-2 points each): Missing viewport tag, verbose CSS, etc.
- **Errors** (-10 points each): Missing DOCTYPE, syntax errors, etc.

**Score Ranges**:
- 85-100: Excellent
- 70-84: Good
- 50-69: Fair
- 0-49: Needs Work

## Cost Estimates

- **Claude Sonnet 4.5**: ~$0.15-0.30 per generation (longer, higher quality output)
- **Gemini Images**: $0.039 per image (5-7 images)
- **Total per landing page**: ~$0.40-0.60

## Development Workflow

### Running the Application

```bash
# Start the server (required for ES6 modules and API proxy)
python server.py
# Opens browser at http://localhost:8000

# Load API keys
# Navigate to http://localhost:8000/setup-keys.html
# Click "Load Keys from .env"

# Generate a landing page
# Fill form and click "Generate Landing Page"
# Wait 30-60 seconds for Claude Sonnet 4.5 to generate
```

### Making Changes

1. Edit files directly (no build step)
2. Refresh browser to see changes
3. Server must be running for modules to load

### Debugging

- Check browser console for errors
- Validation results show code quality issues
- Progress indicator shows current step
- Server logs show API proxy requests

## Future Enhancements

### Immediate (Phase 1)
- Template gallery (pre-made styles)
- Regenerate individual images
- Export individual files
- Save/load projects

### Medium-term (Phase 2)
- Agentic loop with user feedback
- Multi-iteration refinement
- A/B variant generation
- Custom component library

### Long-term (Phase 3)
- Backend with user accounts
- One-click deployment
- CMS integration
- Brand kit management
- Multi-page site generation

## Reference Documentation

The complete design specification is in `Instructions.md` - refer to it for:
- Detailed UI/UX specifications
- Complete prompt templates
- Comprehensive error handling codes
- Sample API responses
- Security architecture diagrams
