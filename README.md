# AI Landing Page Builder

Generate production-ready landing pages in seconds using AI. Built with Claude Sonnet and Gemini 2.5 Flash for code and image generation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Claude](https://img.shields.io/badge/Claude-Sonnet%204-blueviolet)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-orange)

<img width="2555" height="1268" alt="Image" src="https://github.com/user-attachments/assets/d7beacfa-efd7-4655-93c1-c1b5e732365c" />

## Features

- **AI-Powered Generation** - Claude Sonnet generates semantic HTML, modern CSS, and JavaScript
- **AI Image Generation** - Gemini 2.5 Flash creates hero images and feature icons
- **Real-time Progress** - Watch generation progress with live task tracking
- **Live Preview** - Toggle between progress view and live preview during generation
- **Auto-Validation** - Real HTML/CSS validation with Sonnet-powered auto-fix
- **28 Industries** - Tailored content for tech, healthcare, finance, creative, and more
- **12 Design Styles** - From Modern Minimal to Neo Brutalist
- **16 Image Styles** - Photorealistic, illustrated, 3D render, and more
- **Downloadable ZIP** - Complete file structure ready to deploy
- **No Backend Required** - Runs entirely in the browser (with local Python proxy for CORS)



## Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/01000001-01001110/landing-page-builder.git
cd landing-page-builder

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

### 4. Load API Keys

1. Navigate to `http://localhost:8000/setup-keys.html`
2. Click "Load Keys from .env"
3. Keys are stored in browser localStorage

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
├── setup-keys.html             # API key setup helper
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

### Orchestrated Generation

The app uses a sophisticated 4-phase task orchestration system:

**1. Planning Phase**
- Creating execution plan
- Enhancing content with AI

**2. Execution Phase** (parallel tasks)
- Color palette generation
- Typography system
- Image prompt generation
- Hero image (Gemini 2.5 Flash)
- Feature icons (Gemini 2.5 Flash)
- Header component
- Hero section
- Features section
- Testimonials section
- Call-to-action section
- Footer component

**3. Assembly Phase**
- HTML assembly
- CSS compilation
- JavaScript bundling

**4. Complete Phase**
- Validation & auto-fix (Sonnet)
- Final rendering

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

## Generated Output

Downloaded ZIP contains:

```
/your-company-name/
├── index.html          # Complete landing page
├── README.md           # Usage instructions
├── css/
│   └── styles.css      # All styles with CSS variables
├── js/
│   └── main.js         # Smooth scroll & interactivity
└── images/
    ├── hero.png        # Hero section image (16:9)
    └── feature-*.png   # Feature icons (1:1)
```

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
- Open Settings and enter your API keys
- Or use setup-keys.html to load from .env

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
