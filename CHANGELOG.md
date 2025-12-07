# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with 608 total tests
  - 563 JavaScript unit tests using Vitest (14 test files)
  - 25 Python server tests using pytest
  - 20 E2E tests using Playwright
- GitHub Actions CI/CD workflow (`.github/workflows/test.yml`)
  - Runs unit tests, E2E tests, Python tests, and code quality checks
  - Automated testing on push and pull request to main/master
- Code coverage reporting with @vitest/coverage-v8 (95.79% statement coverage)
- `.secrets.baseline` for detect-secrets pre-commit hook
- `CHANGELOG.md` following Keep a Changelog format

### Changed
- Migrated to ES modules (`"type": "module"` in package.json)
- Converted Playwright config and tests to ES module syntax
- Updated test expectations to match current UI dropdown options

### Fixed
- Template literal bug in `prompt-engineering.js` where `${primaryColor}` caused import-time errors
- E2E tests now properly mock API keys with correct localStorage keys and base64 encoding
- Removed unused imports flagged by code review

## [1.0.1] - 2025-12-07

### Added
- `CLAUDE.md` with project guidance for Claude Code
  - Project overview and tech stack documentation
  - 4-phase orchestration system documentation
  - Multi-model strategy (Sonnet, Haiku, Gemini)
  - API specifications and endpoints
  - Style matrix and industry mappings
  - Development tasks and debugging guide
- Pre-commit hooks with detect-secrets and line ending enforcement
- README enhancements
  - Technology badges (Python, HTML5, CSS3, JavaScript)
  - Expandable feature sections with detailed descriptions
  - Comprehensive Prerequisites section
  - Visual architecture flow diagram
  - Industries table (28 industries in 8 categories)

### Security
- Removed `setup-keys.html` which contained hardcoded API keys

## [1.0.0] - 2025-12-07

### Added
- Initial release of AI Landing Page Builder
- Code generation using Claude Sonnet 4 and Haiku
- Image generation using Gemini 2.5 Flash
- 4-phase parallel orchestration system
  - Phase 1: Planning (execution plan, content enhancement)
  - Phase 2: Execution (design system, images, components in parallel)
  - Phase 3: Assembly (HTML, CSS, JS compilation)
  - Phase 4: Complete (validation, auto-fix, rendering)
- 12 design style configurations in style matrix
  - Professional: modern-minimal, corporate-trust, enterprise-pro
  - Creative: bold-playful, artistic-craft, retro-vintage
  - Modern: dark-sleek, gradient-glass, neo-brutalist
  - Approachable: warm-friendly, nature-organic, soft-pastel
- Real-time progress UI with progressive rendering
- ZIP file download with complete landing page assets
- API key management with secure localStorage storage (base64 encoded)
- Preview rendering with sandboxed iframe
- Validation system with Sonnet-powered auto-fix capability
- Python HTTP server with API proxy (bypasses CORS)
- 28 industry categories with feature topic mappings
