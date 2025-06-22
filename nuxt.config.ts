/**
 * Nuxt 3 Configuration
 * https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  // Ensure compatibility with modern Nuxt features
  compatibilityDate: '2025-05-15',

  // Enable devtools for development
  devtools: { enabled: true },

  // Register required modules
  modules: ['@nuxt/ui', '@pinia/nuxt'],

  // Global CSS imports
  css: ['~/assets/css/main.css'],

  // Runtime configuration
  runtimeConfig: {
    // Private keys (only available on server-side)
    openaiApiKey: process.env.OPENAI_API_KEY,
    // Public keys (exposed to client-side)
    public: {}
  }
})
