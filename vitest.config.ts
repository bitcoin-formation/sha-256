import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Environnement de test (jsdom simule le navigateur)
    environment: 'jsdom',
    
    // Fichiers de setup globaux
    setupFiles: ['./tests/setup.ts'],
    
    // Patterns de fichiers de tests
    include: [
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/component/**/*.test.{ts,tsx}',
    ],
    
    // Exclusions
    exclude: [
      'node_modules',
      'dist',
      'tests/e2e/**/*',
    ],
    
    // Configuration de la couverture de code
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
      ],
      // Seuils de couverture (objectif: 70%+)
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
    
    // Options d'affichage
    globals: true,
    reporters: ['verbose'],
  },
  
  // Résolution des chemins (alias)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
});

