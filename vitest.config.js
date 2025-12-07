import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.js'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['js/**/*.js'],
      exclude: ['js/app.js'] // Main app has DOM dependencies
    }
  }
});
