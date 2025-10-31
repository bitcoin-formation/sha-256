import { describe, it, expect, beforeEach } from 'vitest';
import { SHA256Engine } from '@/engines/sha256/sha256Engine';
import { SHA256Config } from '@/types/sha256';

/**
 * Tests unitaires simplifiés pour le moteur SHA-256
 * 
 * Ces tests vérifient les aspects essentiels :
 * - Hash complets avec vecteurs de test connus
 * - Déterminisme (même input = même output)
 * - Effet avalanche (petit changement = hash totalement différent)
 * - Structure de base des steps
 */

describe('SHA256Engine', () => {
  let engine: SHA256Engine;
  const nativeConfig: SHA256Config = {
    rounds: 64,
    messageSize: 512,
    useNativeParams: true,
  };

  beforeEach(() => {
    engine = new SHA256Engine(nativeConfig);
  });

  describe('Hash complet avec vecteurs de test connus', () => {
    it('should hash "abc" correctly', () => {
      const steps = engine.hash('abc');
      
      // Le dernier step devrait avoir le hash dans intermediateValues
      const finalStep = steps[steps.length - 1];
      const hash = finalStep.intermediateValues['Hash complet'] as string;
      
      // Hash SHA-256 connu de "abc"
      const expectedHash = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
      
      expect(hash).toBe(expectedHash);
    });

    it('should hash "Hello" correctly', () => {
      const steps = engine.hash('Hello');
      const finalStep = steps[steps.length - 1];
      const hash = finalStep.intermediateValues['Hash complet'] as string;
      
      // Hash SHA-256 connu de "Hello"
      const expectedHash = '185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969';
      
      expect(hash).toBe(expectedHash);
    });

    it('should hash "Hello World" correctly', () => {
      const steps = engine.hash('Hello World');
      const finalStep = steps[steps.length - 1];
      const hash = finalStep.intermediateValues['Hash complet'] as string;
      
      // Hash SHA-256 connu de "Hello World"
      const expectedHash = 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e';
      
      expect(hash).toBe(expectedHash);
    });
  });

  describe('Structure des steps', () => {
    it('should generate multiple steps', () => {
      const steps = engine.hash('test');
      
      // Doit avoir plusieurs steps (init + rounds + finalize)
      expect(steps.length).toBeGreaterThan(10);
    });

    it('should have valid SHA256Step structure', () => {
      const steps = engine.hash('test');
      
      // Chaque step doit avoir les propriétés requises
      steps.forEach(step => {
        expect(step).toHaveProperty('round');
        expect(step).toHaveProperty('operation');
        expect(step).toHaveProperty('stateBefore');
        expect(step).toHaveProperty('stateAfter');
        expect(step).toHaveProperty('gates');
        expect(step).toHaveProperty('description');
        expect(step).toHaveProperty('codeLineNumber');
        expect(step).toHaveProperty('intermediateValues');
        expect(step).toHaveProperty('changedBits');
      });
    });

    it('should have round numbers in valid range', () => {
      const steps = engine.hash('test');
      
      steps.forEach(step => {
        // Round doit être un nombre
        expect(typeof step.round).toBe('number');
        
        // Round doit être entre -2 (init) et 63 (dernière round)
        expect(step.round).toBeGreaterThanOrEqual(-2);
        expect(step.round).toBeLessThan(64);
      });
    });
  });

  describe('Déterminisme', () => {
    it('should produce same hash for same input', () => {
      const hash1Steps = engine.hash('test');
      const hash2Steps = engine.hash('test');
      
      const hash1 = hash1Steps[hash1Steps.length - 1].intermediateValues['Hash complet'];
      const hash2 = hash2Steps[hash2Steps.length - 1].intermediateValues['Hash complet'];
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1Steps = engine.hash('test');
      const hash2Steps = engine.hash('Test'); // Majuscule
      
      const hash1 = hash1Steps[hash1Steps.length - 1].intermediateValues['Hash complet'];
      const hash2 = hash2Steps[hash2Steps.length - 1].intermediateValues['Hash complet'];
      
      expect(hash1).not.toBe(hash2);
    });

    it('should demonstrate avalanche effect', () => {
      const hash1Steps = engine.hash('test');
      const hash2Steps = engine.hash('tess'); // Un seul caractère change
      
      const hash1 = hash1Steps[hash1Steps.length - 1].intermediateValues['Hash complet'] as string;
      const hash2 = hash2Steps[hash2Steps.length - 1].intermediateValues['Hash complet'] as string;
      
      // Les hash doivent être différents
      expect(hash1).not.toBe(hash2);
      
      // Compter combien de caractères hex diffèrent (effet avalanche)
      let diffCount = 0;
      for (let i = 0; i < Math.min(hash1.length, hash2.length); i++) {
        if (hash1[i] !== hash2[i]) {
          diffCount++;
        }
      }
      
      // Avec l'effet avalanche, au moins 30% des caractères changent
      // Sur 64 caractères hex, on s'attend à ~32 différents (50%)
      expect(diffCount).toBeGreaterThan(19); // Au moins 30% de différence
    });
  });

  describe('États SHA-256', () => {
    it('should have valid state before and after', () => {
      const steps = engine.hash('test');
      
      // Vérifier un step avec des états valides
      const step = steps[10]; // Step arbitraire au milieu
      
      // stateBefore et stateAfter doivent avoir 8 variables (a-h)
      expect(step.stateBefore).toHaveProperty('a');
      expect(step.stateBefore).toHaveProperty('b');
      expect(step.stateBefore).toHaveProperty('c');
      expect(step.stateBefore).toHaveProperty('d');
      expect(step.stateBefore).toHaveProperty('e');
      expect(step.stateBefore).toHaveProperty('f');
      expect(step.stateBefore).toHaveProperty('g');
      expect(step.stateBefore).toHaveProperty('h');
      
      expect(step.stateAfter).toHaveProperty('a');
      expect(step.stateAfter).toHaveProperty('h');
      
      // Les valeurs doivent être des nombres 32-bit
      const values = [
        step.stateBefore.a, step.stateBefore.b, step.stateBefore.c, step.stateBefore.d,
        step.stateBefore.e, step.stateBefore.f, step.stateBefore.g, step.stateBefore.h
      ];
      
      values.forEach(v => {
        expect(typeof v).toBe('number');
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(0xFFFFFFFF);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const steps = engine.hash('');
      expect(steps.length).toBeGreaterThan(0);
      
      const finalHash = steps[steps.length - 1].intermediateValues['Hash complet'] as string;
      expect(finalHash).toBeDefined();
      expect(finalHash.length).toBe(64); // 64 caractères hex
    });

    it('should handle single character', () => {
      const steps = engine.hash('a');
      const finalHash = steps[steps.length - 1].intermediateValues['Hash complet'] as string;
      
      expect(finalHash).toBeDefined();
      expect(finalHash.length).toBe(64);
    });

    it('should handle special characters', () => {
      const steps = engine.hash('!@#$%^&*()');
      const finalHash = steps[steps.length - 1].intermediateValues['Hash complet'] as string;
      
      expect(finalHash).toBeDefined();
      expect(finalHash.length).toBe(64);
    });

    it('should handle unicode characters', () => {
      const steps = engine.hash('🔐🔑');
      const finalHash = steps[steps.length - 1].intermediateValues['Hash complet'] as string;
      
      expect(finalHash).toBeDefined();
      expect(finalHash.length).toBe(64);
    });
  });

  describe('Operations', () => {
    it('should contain expected operations', () => {
      const steps = engine.hash('test');
      const operations = steps.map(s => s.operation);
      
      // Doit contenir les opérations cryptographiques principales
      expect(operations).toContain('capsigma1');
      expect(operations).toContain('ch');
      expect(operations).toContain('capsigma0');
      expect(operations).toContain('maj');
    });
  });
});
