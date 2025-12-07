# AI Landing Page Builder

Build Production Ready Landing Pages with Claude Sonnet and Gemini 2.5 Flash in seconds

<!-- Badges -->
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-Sonnet%204-blueviolet?logo=anthropic&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)

<img width="2555" height="1268" alt="Image" src="https://github.com/user-attachments/assets/d7beacfa-efd7-4655-93c1-c1b5e732365c" />

## Features

<details>
<summary><strong>🤖 AI-Powered Code Generation</strong></summary>

Claude Sonnet 4 generates production-ready code with:
- **Semantic HTML5** - Accessible, SEO-friendly markup with proper heading hierarchy
- **Modern CSS** - CSS variables, flexbox, grid, responsive breakpoints
- **Vanilla JavaScript** - No dependencies, smooth scroll, mobile menu handling
- **Multi-model architecture** - Sonnet for planning/validation, Haiku for fast component generation

</details>

<details>
<summary><strong>🎨 AI Image Generation</strong></summary>

Gemini 2.5 Flash creates custom visuals:
- **Hero Images** - 16:9 aspect ratio, style-matched to your design
- **Feature Icons** - Square 1:1 icons for each feature section
- **16 Image Styles** - From photorealistic to illustrated, 3D to pixel art
- **Color-aware** - Images incorporate your chosen color palette
- **Fallback System** - Placeholder images if generation fails

</details>

<details>
<summary><strong>⚡ Real-time Progress Tracking</strong></summary>

Watch your landing page come together:
- **Live Task List** - See each task status (pending, in-progress, complete)
- **Timing Information** - Duration displayed for each completed task
- **Phase Indicators** - Track progress through Planning → Execution → Assembly → Complete
- **Error Handling** - Clear error messages if any task fails

</details>

<details>
<summary><strong>👁️ Live Preview</strong></summary>

Toggle between views during generation:
- **Progress View** - Default view showing task completion
- **Live Preview** - Watch components appear as they're generated
- **Sandboxed iframe** - Safe preview environment
- **Instant Toggle** - Switch views without losing progress

</details>

<details>
<summary><strong>✅ Auto-Validation & Fix</strong></summary>

Built-in quality assurance:
- **HTML Validation** - Checks for proper structure, missing tags, accessibility
- **CSS Validation** - Verifies syntax, unused selectors, browser compatibility
- **Image Path Verification** - Ensures all image references are correct
- **AI-Powered Auto-Fix** - Sonnet automatically repairs validation issues

</details>

<details>
<summary><strong>🏢 28 Industries</strong></summary>

Tailored content generation for:
- **Technology** - Tech/Software, AI & ML, Cybersecurity, Cloud Services
- **Professional** - Finance, Legal, Consulting, Real Estate, Accounting
- **Healthcare** - Healthcare, Pharma, Wellness, Dental
- **Consumer** - E-commerce, Retail, Food & Beverage, Fashion, Beauty
- **Creative** - Creative Agency, Media, Photography, Gaming
- **Education** - Education, Non-Profit
- **Industrial** - Manufacturing, Logistics, Automotive, Travel, Energy
- **Other** - Startup, General

</details>

<details>
<summary><strong>🎭 12 Design Styles</strong></summary>

Complete design systems with:
- **Professional** - Modern Minimal, Corporate Trust, Enterprise Pro
- **Creative** - Bold & Playful, Artistic Craft, Retro Vintage
- **Modern** - Dark & Sleek, Gradient Glass, Neo Brutalist
- **Approachable** - Warm & Friendly, Nature Organic, Soft Pastel

Each style includes: color rules, typography, spacing, shadows, animations, and component-specific guidelines.

</details>

<details>
<summary><strong>🖼️ 16 Image Styles</strong></summary>

Diverse visual aesthetics:
- **Realistic** - Photorealistic, Editorial Photography, Product Studio
- **Illustrated** - Hand Illustrated, Line Art, Watercolor, Isometric
- **Digital Art** - 3D Render, Abstract Geometric, Flat Design, Gradient Mesh, Neon Glow
- **Stylized** - Pixel Art, Paper Cutout, Claymation

</details>

<details>
<summary><strong>📦 Downloadable ZIP</strong></summary>

Production-ready file structure:
```
/your-company/
├── index.html      # Complete landing page
├── README.md       # Usage instructions
├── css/
│   └── styles.css  # CSS variables, responsive design
├── js/
│   └── main.js     # Smooth scroll, mobile menu
└── images/
    ├── hero.png    # Hero image (16:9)
    └── feature-*.png # Feature icons (1:1)
```
Deploy directly to Netlify, Vercel, GitHub Pages, or any static host.

</details>

<details>
<summary><strong>🌐 No Backend Required</strong></summary>

Runs entirely in the browser:
- **Local Python Server** - Simple CORS proxy for API calls
- **Browser Storage** - API keys stored in localStorage
- **No Database** - No user accounts or data persistence needed
- **Single Command Start** - `python server.py` or `start.bat`

</details>

## Prerequisites

### Required

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Python** | 3.8+ | Uses standard library only (no pip install needed) |
| **Web Browser** | Modern | Chrome (recommended), Firefox, Safari, or Edge |
| **Anthropic API Key** | - | For Claude Sonnet code generation |
| **Google AI API Key** | - | For Gemini 2.5 Flash image generation |

### Optional (for testing)

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18+ | Only needed to run Playwright tests |
| npm | 8+ | Comes with Node.js |

### System Requirements

- **OS**: Windows, macOS, or Linux
- **RAM**: 4GB minimum (8GB recommended for smooth browser experience)
- **Network**: Internet connection required for API calls
- **Ports**: Port 8000 must be available (configurable in `server.py`)

### Verify Python Installation

```bash
# Check Python version (must be 3.8 or higher)
python --version
# or
python3 --version
```

If Python is not installed, download from [python.org](https://www.python.org/downloads/)

## Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/01000001-01001110/Landing-Page-Builder.git
cd Landing-Page-Builder

# Copy environment template
cp .env.example .env

# Add your API keys to .env
```

### 2. Get API Keys

- **Anthropic API Key**: [console.anthropic.com](https://console.anthropic.com)
- **Google AI API Key**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 3. Start the Server

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
python3 server.py
```

This starts a local server at `http://localhost:8000` and opens your browser.

### 4. Enter API Keys

1. Click "API Settings" button in the app header
2. Enter your Anthropic and Google AI API keys
3. Click "Save Keys" (keys are stored in browser localStorage)

### 5. Generate!

1. Fill in company details
2. Select industry, style, and image style
3. Click "Generate Landing Page"
4. Watch real-time progress
5. Download your ZIP

## Project Structure

```
/landing-page-builder/
├── index.html                  # Main application
├── server.py                   # Python server with API proxy
├── start.bat                   # Windows start script
│
├── css/
│   └── styles.css              # Application styles (Fluent Design)
│
├── js/
│   ├── app.js                  # Main controller & orchestration
│   ├── api-manager.js          # API key management
│   ├── claude-client.js        # Anthropic API client
│   ├── gemini-client.js        # Google AI client (NanoBanana)
│   ├── orchestrator.js         # Parallel task execution
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
│
├── .github/
│   └── workflows/
│       └── pre-commit.yml      # CI checks for line endings
│
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── .gitattributes              # Line ending configuration
├── .editorconfig               # Editor settings
├── .pre-commit-config.yaml     # Pre-commit hooks
├── CODEOWNERS                  # Code ownership
├── LICENSE                     # MIT License
└── README.md                   # This file
```

## Architecture

### How Your Selections Shape the Output

Your dropdown selections directly influence AI generation at every phase:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INPUTS                                   │
├─────────────────┬─────────────────┬─────────────────────────────────┤
│    Industry     │   Design Style  │         Image Style             │
│   (28 options)  │  (12 options)   │        (16 options)             │
└────────┬────────┴────────┬────────┴────────────────┬────────────────┘
         │                 │                         │
         ▼                 ▼                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│ • Content tone      • Color palette      • Visual aesthetic         │
│ • Feature topics    • Typography         • Hero image style         │
│ • Testimonials      • Spacing/shadows    • Feature icon style       │
│ • CTA messaging     • Component rules    • Color integration        │
└─────────────────────────────────────────────────────────────────────┘
```

### Orchestrated Generation

The app uses a sophisticated 4-phase task orchestration system with parallel execution:

<details>
<summary><strong>Phase 1: Planning</strong> (Sequential)</summary>

| Task | Model | Description | Dropdown Influence |
|------|-------|-------------|-------------------|
| **Create Execution Plan** | - | Builds task dependency graph based on inputs | Feature count determines number of image tasks |
| **Enhance Content** | Haiku | Transforms raw description into marketing copy | **Industry** sets tone (formal for Finance, creative for Gaming) |

**What happens:**
1. Your company description is enhanced into professional marketing copy
2. Key benefits are extracted for feature section content
3. A compelling tagline is generated matching industry expectations

</details>

<details>
<summary><strong>Phase 2: Execution</strong> (Parallel - Design System)</summary>

| Task | Model | Description | Dropdown Influence |
|------|-------|-------------|-------------------|
| **Color Palette** | Sonnet | Generates harmonious color scheme | **Style** defines palette type (monochromatic, analogous, complementary) |
| **Typography System** | Sonnet | Selects fonts and type scale | **Style** specifies font families and weights |

**Style Matrix Integration:**

Each **Design Style** has predefined rules in `style-matrix.js`:
- `modern-minimal`: High contrast, system fonts, generous whitespace
- `dark-sleek`: Dark backgrounds, accent colors, sharp typography
- `gradient-glass`: Glassmorphism, gradient backgrounds, soft shadows
- `neo-brutalist`: Bold colors, harsh shadows, chunky borders

</details>

<details>
<summary><strong>Phase 2: Execution</strong> (Parallel - Images)</summary>

| Task | Model | Description | Dropdown Influence |
|------|-------|-------------|-------------------|
| **Hero Image** | Gemini 2.5 Flash | 16:9 hero background | **Image Style** + **Industry** + color palette |
| **Feature Icons** (3-6) | Gemini 2.5 Flash | 1:1 square icons | **Image Style** + **Industry**-specific topics |

**Image Prompt Construction:**

```
[Image Style] + [Industry context] + [Color palette] + [Aspect ratio]

Example: "Photorealistic hero image for cybersecurity company.
Modern, professional environment. Color palette centered
around #3B82F6. 16:9 aspect ratio. No text in image."
```

**Industry → Feature Topics Mapping:**

| Industry | Auto-generated Feature Topics |
|----------|------------------------------|
| Tech | Innovation, Automation, Analytics, Security |
| Healthcare | Patient Care, Medical Technology, Telemedicine |
| Finance | Security, Investment, Analytics, Compliance |
| Creative | Creativity, Design, Innovation, Collaboration |

</details>

<details>
<summary><strong>Phase 2: Execution</strong> (Parallel - Components)</summary>

| Task | Model | Description | Dropdown Influence |
|------|-------|-------------|-------------------|
| **Header** | Haiku | Navigation + logo placeholder | **Style** defines sticky behavior, shadow, spacing |
| **Hero Section** | Haiku | Headline, CTA, background image | **Style** sets height, text alignment, overlay |
| **Features Section** | Haiku | Feature cards with icons | **Style** defines card style, grid columns, padding |
| **Testimonials** | Haiku | Customer quotes (optional) | **Style** sets card elevation, quote styling |
| **CTA Section** | Haiku | Call-to-action with button | **Style** defines button style, background treatment |
| **Footer** | Haiku | Links, contact, social icons | **Style** sets column layout, link styling |

**Component-Specific Style Rules:**

Each component receives rules from the Style Matrix:
```javascript
// Example: Features component for "gradient-glass" style
{
  cardStyle: "glass",           // Glassmorphism effect
  padding: "2rem",              // Internal spacing
  iconSize: "3rem",             // Feature icon size
  gridColumns: 3,               // Desktop column count
  gap: "2rem",                  // Grid gap
  hoverEffect: "lift"           // Hover animation
}
```

</details>

<details>
<summary><strong>Phase 3: Assembly</strong> (Sequential)</summary>

| Task | Model | Description |
|------|-------|-------------|
| **HTML Assembly** | Haiku | Combines all components into single HTML document |
| **CSS Compilation** | - | Merges CSS variables + component styles |
| **JavaScript Bundling** | - | Adds smooth scroll + mobile menu functionality |

**HTML Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <header id="header">...</header>
    <main>
        <section id="hero">...</section>
        <section id="features">...</section>
        <section id="testimonials">...</section>
        <section id="cta">...</section>
    </main>
    <footer id="footer">...</footer>
    <script src="js/main.js"></script>
</body>
</html>
```

</details>

<details>
<summary><strong>Phase 4: Complete</strong> (Sequential)</summary>

| Task | Model | Description |
|------|-------|-------------|
| **Validation** | Sonnet | Checks HTML structure, CSS syntax, image paths |
| **Auto-Fix** | Sonnet | Repairs any validation issues automatically |
| **Final Render** | - | Displays in preview iframe, enables download |

**Validation Checks:**
- ✅ All image `src` attributes point to existing files
- ✅ CSS variables are properly defined
- ✅ Navigation links use correct section IDs
- ✅ Accessibility attributes present (alt text, ARIA labels)
- ✅ Mobile responsiveness rules included

</details>

### Multi-Model Strategy

| Model | Role | Why |
|-------|------|-----|
| **Claude Sonnet 4** | Planning, Design System, Validation | Strategic decisions requiring deep understanding |
| **Claude Haiku** | Components, Content Enhancement | Fast execution, matches Sonnet 4 coding quality |
| **Gemini 2.5 Flash** | Image Generation | Cost-effective, high-quality image synthesis |

### Industries (28)

| Category | Industries |
|----------|-----------|
| Technology | Tech/Software, AI & ML, Cybersecurity, Cloud Services |
| Professional | Finance, Legal, Consulting, Real Estate, Accounting |
| Healthcare | Healthcare, Pharma, Wellness, Dental |
| Consumer | E-commerce, Retail, Food & Beverage, Fashion, Beauty |
| Creative | Creative Agency, Media, Photography, Gaming |
| Education | Education, Non-Profit |
| Industrial | Manufacturing, Logistics, Automotive, Travel, Energy |
| Other | Startup, Other |

### Design Styles (12)

| Category | Styles |
|----------|--------|
| Professional | Modern Minimal, Corporate Trust, Enterprise Pro |
| Creative | Bold & Playful, Artistic Craft, Retro Vintage |
| Modern | Dark & Sleek, Gradient Glass, Neo Brutalist |
| Approachable | Warm & Friendly, Nature Organic, Soft Pastel |

### Image Styles (16)

| Category | Styles |
|----------|--------|
| Realistic | Photorealistic, Editorial Photography, Product Studio |
| Illustrated | Hand Illustrated, Line Art, Watercolor, Isometric |
| Digital Art | 3D Render, Abstract Geometric, Flat Design, Gradient Mesh, Neon Glow |
| Stylized | Pixel Art, Paper Cutout, Claymation |

## API Costs

| Service | Cost per Generation |
|---------|---------------------|
| Claude Sonnet | ~$0.15-0.30 |
| Gemini 2.5 Flash | ~$0.20-0.30 (5-7 images) |
| **Total** | **~$0.35-0.60** |

## Development

No build step required. Edit files and refresh browser.

```bash
# Start server
python server.py

# Run tests (optional)
npm install
npm test
```

## Security Notes

- API keys are stored in browser localStorage
- Keys are visible in DevTools
- For production, implement a backend proxy to protect keys
- The included Python server proxies requests to bypass CORS

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires: JavaScript enabled, localStorage enabled

## Troubleshooting

**"API keys required" error**
- Click "API Settings" in the header and enter your API keys

**Generation fails**
- Check API keys are valid
- Ensure sufficient API credits
- Check browser console for errors

**Images don't generate**
- Verify Google AI API key
- Placeholder images used if generation fails
- Replace manually in downloaded ZIP if needed

## License

MIT License - See LICENSE file for details.

## Acknowledgments

- [Anthropic](https://anthropic.com) - Claude API
- [Google AI](https://ai.google.dev) - Gemini API
- [JSZip](https://stuk.github.io/jszip/) - ZIP file generation
