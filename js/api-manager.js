// API Key Manager - Handles storage and retrieval of API keys

export const ApiKeyManager = {
    STORAGE_KEY_ANTHROPIC: 'lpb_anthropic_key',
    STORAGE_KEY_GOOGLE: 'lpb_google_key',

    /**
     * Save API key to localStorage
     * @param {string} provider - 'anthropic' or 'google'
     * @param {string} key - The API key
     */
    save(provider, key) {
        const encoded = btoa(key);
        const storageKey = provider === 'anthropic'
            ? this.STORAGE_KEY_ANTHROPIC
            : this.STORAGE_KEY_GOOGLE;
        localStorage.setItem(storageKey, encoded);
    },

    /**
     * Get API key from localStorage
     * @param {string} provider - 'anthropic' or 'google'
     * @returns {string|null} The API key or null if not found
     */
    get(provider) {
        const storageKey = provider === 'anthropic'
            ? this.STORAGE_KEY_ANTHROPIC
            : this.STORAGE_KEY_GOOGLE;
        const encoded = localStorage.getItem(storageKey);
        return encoded ? atob(encoded) : null;
    },

    /**
     * Clear all API keys from localStorage
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY_ANTHROPIC);
        localStorage.removeItem(this.STORAGE_KEY_GOOGLE);
    },

    /**
     * Check if API keys are configured
     * @returns {object} Object with anthropic and google boolean values
     */
    hasKeys() {
        return {
            anthropic: !!this.get('anthropic'),
            google: !!this.get('google')
        };
    }
};
