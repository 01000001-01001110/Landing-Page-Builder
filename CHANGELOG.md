# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with 608 total tests
  - 563 JavaScript unit tests using Vitest
  - 25 Python server tests using pytest
  - 20 E2E tests using Playwright
- GitHub Actions CI/CD workflow (`.github/workflows/test.yml`)
  - Runs unit tests, E2E tests, Python tests, and code quality checks
  - Automated testing on push and pull request
- Code coverage reporting with @vitest/coverage-v8 (95.79% statement coverage)
- `.secrets.baseline` for detect-secrets pre-commit hook

### Changed
- Migrated to ES modules (`"type": "module"` in package.json)
- Converted Playwright config and tests to ES module syntax
- Updated test expectations to match current UI dropdown options

### Fixed
- Template literal bug in `prompt-engineering.js` where `${primaryColor}` caused import-time errors
- E2E tests now properly mock API keys with correct localStorage keys and base64 encoding
- Removed unused imports flagged by code review

## [1.0.0] - 2025-12-07

### Added
- Initial release of AI Landing Page Builder
- Code generation using Claude Sonnet 4 and Haiku
- Image generation using Gemini 2.5 Flash
- 4-phase parallel orchestration system
- 12 design style configurations in style matrix
- Real-time progress UI with progressive rendering
- ZIP file download with complete landing page assets
- API key management with secure localStorage storage
- Preview rendering with sandboxed iframe
- Validation system with auto-fix capability
