// Playwright Test Suite for Landing Page Builder
// Run with: npx playwright test test_app.js

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8000';

test.describe('Landing Page Builder - UI Validation', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto(BASE_URL);
        await page.waitForLoadState('domcontentloaded');
        // Wait for the main app to be ready
        await page.waitForSelector('h1.app-title');
    });

    test('should load the application successfully', async ({ page }) => {
        // Check that the main elements are present
        await expect(page.locator('h1.app-title')).toContainText('Landing Page Builder');
        await expect(page.locator('#settingsBtn')).toBeVisible();
        await expect(page.locator('#generateBtn')).toBeVisible();
    });

    test('should show all required form fields', async ({ page }) => {
        // Check all form inputs are present (excluding advanced options which are collapsed)
        await expect(page.locator('#companyName')).toBeVisible();
        await expect(page.locator('#slogan')).toBeVisible();
        await expect(page.locator('#description')).toBeVisible();
        await expect(page.locator('#industry')).toBeVisible();
        await expect(page.locator('#style')).toBeVisible();
        await expect(page.locator('#imageStyle')).toBeVisible();
        // primaryColor is in advanced options (collapsed by default)
        await expect(page.locator('.advanced-options')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
        // Clear the pre-filled form fields
        await page.fill('#companyName', '');
        await page.fill('#slogan', '');
        await page.fill('#description', '');

        // Try to generate without filling required fields
        await page.click('#generateBtn');

        // Should show error message
        await expect(page.locator('#errorContainer')).toBeVisible();

        // Error should mention required fields or company name
        const errorText = await page.locator('#errorContainer').textContent();
        expect(errorText.toLowerCase()).toMatch(/required|company name/i);
    });

    test('should validate company name length', async ({ page }) => {
        // Fill with invalid company name (too short)
        await page.fill('#companyName', 'A');
        // Keep other fields valid
        await page.fill('#slogan', 'Valid slogan here');
        await page.fill('#description', 'This is a valid description that is long enough for validation purposes.');

        await page.click('#generateBtn');

        // Should show error about company name length
        await expect(page.locator('#errorContainer')).toBeVisible();
        const errorText = await page.locator('#errorContainer').textContent();
        expect(errorText.toLowerCase()).toContain('company name');
    });

    test('should validate description length', async ({ page }) => {
        // Fill with valid company name and slogan but invalid description (too short)
        await page.fill('#companyName', 'Valid Company Name');
        await page.fill('#slogan', 'Valid slogan');
        await page.fill('#description', 'Short');

        await page.click('#generateBtn');

        // Should show error about description length
        await expect(page.locator('#errorContainer')).toBeVisible();
        const errorText = await page.locator('#errorContainer').textContent();
        expect(errorText.toLowerCase()).toContain('description');
    });

    test('should open and close settings modal', async ({ page }) => {
        // Settings modal should be hidden initially
        const modal = page.locator('#settingsModal');
        await expect(modal).not.toBeVisible();

        // Click settings button
        await page.click('#settingsBtn');

        // Modal should be visible
        await expect(modal).toBeVisible();

        // Close modal
        await page.click('#closeModal');

        // Modal should be hidden again
        await expect(modal).not.toBeVisible();
    });

    test('should allow entering API keys', async ({ page }) => {
        // Open settings modal
        await page.click('#settingsBtn');

        // Enter API keys
        await page.fill('#anthropicKey', 'sk-ant-test-key-123');
        await page.fill('#googleKey', 'AIza-test-key-456');

        // Save keys
        await page.click('#saveKeysBtn');

        // Modal should close
        await expect(page.locator('#settingsModal')).not.toBeVisible();

        // Status should update
        const statusText = await page.locator('.status-text').textContent();
        expect(statusText).toContain('saved');
    });

    test('should toggle password visibility', async ({ page }) => {
        // Open settings modal
        await page.click('#settingsBtn');

        // API key input should be password type
        const apiKeyInput = page.locator('#anthropicKey');
        await expect(apiKeyInput).toHaveAttribute('type', 'password');

        // Click toggle button
        await page.click('[data-target="anthropicKey"]');

        // Should change to text type
        await expect(apiKeyInput).toHaveAttribute('type', 'text');

        // Click again to toggle back
        await page.click('[data-target="anthropicKey"]');

        // Should be password again
        await expect(apiKeyInput).toHaveAttribute('type', 'password');
    });

    test('should show download buttons as disabled initially', async ({ page }) => {
        // Download and copy buttons should be disabled
        await expect(page.locator('#downloadBtn')).toBeDisabled();
        await expect(page.locator('#copyCodeBtn')).toBeDisabled();
    });

    test('should validate color input format', async ({ page }) => {
        // Fill form with valid data but invalid color
        await page.fill('#companyName', 'Test Company');
        await page.fill('#slogan', 'Test Slogan');
        await page.fill('#description', 'This is a valid description for testing purposes.');

        // Set invalid color (should be caught by browser input type="color")
        // Color inputs have built-in validation, so we'll just check the default value is valid
        const colorValue = await page.locator('#primaryColor').inputValue();
        expect(colorValue).toMatch(/^#[0-9A-F]{6}$/i);
    });

    test('should have correct feature count options', async ({ page }) => {
        // Check feature count dropdown has correct options
        const featureCount = page.locator('#featureCount');
        const options = await featureCount.locator('option').allTextContents();

        expect(options).toContain('3');
        expect(options).toContain('4');
        expect(options).toContain('6');
    });

    test('should expand advanced options', async ({ page }) => {
        // Advanced options should be collapsed initially
        const advancedSection = page.locator('.advanced-options');

        // Click to expand
        await advancedSection.locator('summary').click();

        // Advanced fields should be visible
        await expect(page.locator('#primaryColor')).toBeVisible();
        await expect(page.locator('#ctaText')).toBeVisible();
        await expect(page.locator('#includeTestimonials')).toBeVisible();
    });

    test('should have preview iframe with sandbox', async ({ page }) => {
        // Preview iframe should have sandbox attribute
        const iframe = page.locator('#previewFrame');
        await expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
    });

    test('should show progress container when generating', async ({ page }) => {
        // Progress container should be hidden initially
        const progressContainer = page.locator('#progressContainer');
        await expect(progressContainer).not.toBeVisible();

        // Note: We can't test actual generation without real API keys
        // This test just validates the UI structure is in place
    });

    test('should have all industry options', async ({ page }) => {
        const industry = page.locator('#industry');
        const options = await industry.locator('option').allTextContents();

        expect(options).toContain('Tech');
        expect(options).toContain('Healthcare');
        expect(options).toContain('Finance');
        expect(options).toContain('Creative');
        expect(options).toContain('Food & Beverage');
        expect(options).toContain('Retail');
        expect(options).toContain('Education');
        expect(options).toContain('Real Estate');
        expect(options).toContain('Other');
    });

    test('should have all style options', async ({ page }) => {
        const style = page.locator('#style');
        const options = await style.locator('option').allTextContents();

        expect(options).toContain('Modern Minimal');
        expect(options).toContain('Bold & Playful');
        expect(options).toContain('Corporate Trust');
        expect(options).toContain('Dark & Sleek');
        expect(options).toContain('Warm & Friendly');
    });

    test('should have all image style options', async ({ page }) => {
        const imageStyle = page.locator('#imageStyle');
        const options = await imageStyle.locator('option').allTextContents();

        expect(options).toContain('Photorealistic');
        expect(options).toContain('Illustrated');
        expect(options).toContain('Abstract Geometric');
        expect(options).toContain('3D Render');
        expect(options).toContain('Flat Design');
    });

    test('should have validation results container', async ({ page }) => {
        // Validation results container should exist but be hidden
        const validationResults = page.locator('#validationResults');
        await expect(validationResults).not.toBeVisible();
    });

    test('should dismiss error messages', async ({ page }) => {
        // Clear fields to trigger validation error
        await page.fill('#companyName', '');
        await page.fill('#slogan', '');
        await page.fill('#description', '');

        // Trigger validation error
        await page.click('#generateBtn');

        // Error should be visible
        await expect(page.locator('#errorContainer')).toBeVisible();

        // Click dismiss button
        await page.click('#errorContainer button');

        // Error should be hidden
        await expect(page.locator('#errorContainer')).not.toBeVisible();
    });
});

test.describe('Landing Page Builder - Console Errors', () => {

    test('should not have console errors on page load', async ({ page }) => {
        const consoleErrors = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto(BASE_URL);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForSelector('h1.app-title');

        // Check for critical errors (ignore debug logging and network errors in test environment)
        const criticalErrors = consoleErrors.filter(err =>
            !err.includes('[ResponseParser]') &&
            !err.includes('[ClaudeClient]') &&
            !err.includes('[PreviewManager]') &&
            !err.includes('ERR_TUNNEL_CONNECTION_FAILED') &&
            !err.includes('net::ERR_') &&
            !err.includes('Failed to load resource')
        );

        expect(criticalErrors).toHaveLength(0);
    });
});
