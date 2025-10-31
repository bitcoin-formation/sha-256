import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour les tests E2E
 * Documentation: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Dossier contenant les tests E2E
  testDir: './tests/e2e',
  
  // Durée max par test (30 secondes)
  timeout: 30 * 1000,
  
  // Comportement des tests
  fullyParallel: true, // Tests en parallèle (plus rapide)
  forbidOnly: !!process.env.CI, // Interdit .only() en CI
  retries: process.env.CI ? 2 : 0, // Retry en CI seulement
  workers: process.env.CI ? 1 : undefined, // Workers limités en CI
  
  // Reporter (affichage des résultats)
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['json', { outputFile: 'test-reports/sha256-playwright-results.json' }],
    ['list'],
  ],
  
  // Options partagées par tous les tests
  use: {
    // URL de base de l'application
    baseURL: 'http://localhost:5173',
    
    // Collecter les traces en cas d'échec
    trace: 'on-first-retry',
    
    // Screenshots en cas d'échec
    screenshot: 'only-on-failure',
    
    // Vidéos en cas d'échec
    video: 'retain-on-failure',
  },

  // Configuration des projets (navigateurs)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Tu peux activer d'autres navigateurs plus tard
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Tests mobile (optionnel)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Serveur de développement
  // Playwright va démarrer le serveur automatiquement avant les tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI, // Réutilise le serveur local si déjà lancé
    timeout: 120 * 1000, // 2 minutes pour démarrer
  },
});

