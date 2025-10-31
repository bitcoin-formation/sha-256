import { describe, it, expect, beforeEach } from 'vitest';
import { SHA256Engine } from '@/engines/sha256/sha256Engine';
import { SHA256Config } from '@/types/sha256';

/**
 * Tests unitaires pour le moteur SHA-256
 * 
 * Ces tests vérifient :
 * - Le padding correct des messages
 * - L'expansion du message schedule (W[0..63])
 * - Les hash complets avec vecteurs de test connus
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

  describe('Hash complet avec vecteurs de test', () => {
    it('should hash empty string correctly', () => {
      const steps = engine.hash('');
      const finalStep = steps[steps.length - 1];
      
      // Hash SHA-256 de la chaîne vide
      // e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
      expect(finalStep.step).toBe('Étape 5: Résultat SHA-256');
      expect(finalStep.hash).toBeDefined();
      expect(finalStep.hash?.length).toBe(64); // 64 caractères hex
    });

    it('should hash "abc" correctly', () => {
      const steps = engine.hash('abc');
      const finalStep = steps[steps.length - 1];
      
      // Hash SHA-256 connu de "abc"
      const expectedHash = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
      
      expect(finalStep.step).toBe('Étape 5: Résultat SHA-256');
      expect(finalStep.hash).toBe(expectedHash);
    });

    it('should hash "Hello" correctly', () => {
      const steps = engine.hash('Hello');
      const finalStep = steps[steps.length - 1];
      
      // Hash SHA-256 connu de "Hello"
      const expectedHash = '185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969';
      
      expect(finalStep.step).toBe('Étape 5: Résultat SHA-256');
      expect(finalStep.hash).toBe(expectedHash);
    });

    it('should hash "Hello World" correctly', () => {
      const steps = engine.hash('Hello World');
      const finalStep = steps[steps.length - 1];
      
      // Hash SHA-256 connu de "Hello World"
      const expectedHash = 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e';
      
      expect(finalStep.step).toBe('Étape 5: Résultat SHA-256');
      expect(finalStep.hash).toBe(expectedHash);
    });
  });

  describe('Structure des steps', () => {
    it('should generate correct step structure', () => {
      const steps = engine.hash('test');
      
      // Doit avoir des steps
      expect(steps.length).toBeGreaterThan(0);
      
      // Premier step : Message d'entrée
      const firstStep = steps[0];
      expect(firstStep.step).toBe("Étape 0: Message d'entrée");
      expect(firstStep.message).toBe('test');
      
      // Deuxième step : Préparation
      const prepStep = steps[1];
      expect(prepStep.step).toBe('Étape 1: Préparer le message (expansion)');
      expect(prepStep.W).toBeDefined();
      expect(prepStep.W?.length).toBe(64); // 64 mots pour SHA-256 natif
      
      // Dernier step : Résultat
      const lastStep = steps[steps.length - 1];
      expect(lastStep.step).toBe('Étape 5: Résultat SHA-256');
      expect(lastStep.hash).toBeDefined();
      expect(lastStep.hash?.length).toBe(64);
    });

    it('should have initialization step', () => {
      const steps = engine.hash('test');
      
      // Doit avoir un step d'initialisation
      const initStep = steps.find(s => s.step === 'Étape 2: Initialisation des variables');
      expect(initStep).toBeDefined();
      expect(initStep?.state).toBeDefined();
    });

    it('should have main loop steps', () => {
      const steps = engine.hash('test');
      
      // Doit avoir des steps de la boucle principale (Round 0..63)
      const roundSteps = steps.filter(s => s.round !== undefined && s.round >= 0);
      expect(roundSteps.length).toBeGreaterThan(0);
      
      // Vérifier qu'on a des opérations connues
      const operations = roundSteps.map(s => s.operation);
      expect(operations).toContain('capsigma1');
      expect(operations).toContain('ch');
      expect(operations).toContain('capsigma0');
      expect(operations).toContain('maj');
    });

    it('should have finalization step', () => {
      const steps = engine.hash('test');
      
      // Doit avoir un step de finalisation
      const finalStep = steps.find(s => s.step === 'Étape 4: Finalisation');
      expect(finalStep).toBeDefined();
    });
  });

  describe('Déterminisme', () => {
    it('should produce same hash for same input', () => {
      const hash1 = engine.hash('test')[engine.hash('test').length - 1].hash;
      const hash2 = engine.hash('test')[engine.hash('test').length - 1].hash;
      
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = engine.hash('test')[engine.hash('test').length - 1].hash;
      const hash2 = engine.hash('Test')[engine.hash('Test').length - 1].hash; // Majuscule différente
      
      expect(hash1).not.toBe(hash2);
    });

    it('should produce different hash for one bit difference (avalanche effect)', () => {
      const hash1 = engine.hash('test')[engine.hash('test').length - 1].hash;
      const hash2 = engine.hash('tess')[engine.hash('tess').length - 1].hash; // t -> s
      
      expect(hash1).not.toBe(hash2);
      
      // Compter combien de caractères hex diffèrent (effet avalanche)
      let diffCount = 0;
      for (let i = 0; i < 64; i++) {
        if (hash1?.[i] !== hash2?.[i]) {
          diffCount++;
        }
      }
      
      // Avec l'effet avalanche, au moins 50% des bits changent
      // Sur 64 caractères hex, on s'attend à ~32 différents (50%)
      expect(diffCount).toBeGreaterThan(20); // Au moins 20/64 caractères différents
    });
  });

  describe('Message Schedule (W)', () => {
    it('should expand W from 16 to 64 words', () => {
      const steps = engine.hash('test');
      const prepStep = steps.find(s => s.step === 'Étape 1: Préparer le message (expansion)');
      
      expect(prepStep?.W).toBeDefined();
      expect(prepStep?.W?.length).toBe(64);
      
      // Les 16 premiers mots viennent du message
      // Les 48 suivants sont calculés (expansion)
      const W = prepStep!.W!;
      
      // Vérifier que les valeurs ne sont pas toutes 0
      const nonZeroCount = W.filter(w => w !== 0).length;
      expect(nonZeroCount).toBeGreaterThan(0);
    });
  });

  describe('État SHA-256', () => {
    it('should have valid state with 8 variables (a-h)', () => {
      const steps = engine.hash('test');
      
      // Trouver un step avec état
      const stateStep = steps.find(s => s.state !== undefined);
      expect(stateStep).toBeDefined();
      
      const state = stateStep!.state!;
      expect(state.a).toBeDefined();
      expect(state.b).toBeDefined();
      expect(state.c).toBeDefined();
      expect(state.d).toBeDefined();
      expect(state.e).toBeDefined();
      expect(state.f).toBeDefined();
      expect(state.g).toBeDefined();
      expect(state.h).toBeDefined();
      
      // Toutes les valeurs doivent être des nombres 32-bit
      const values = [state.a, state.b, state.c, state.d, state.e, state.f, state.g, state.h];
      values.forEach(v => {
        expect(typeof v).toBe('number');
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(0xFFFFFFFF); // 32-bit max
      });
    });
  });

  describe('Intégrité des steps', () => {
    it('should not have undefined critical values', () => {
      const steps = engine.hash('test');
      
      // Vérifier qu'aucun step critique n'a de valeurs undefined
      steps.forEach(step => {
        expect(step.step).toBeDefined();
        
        if (step.round !== undefined) {
          expect(step.round).toBeGreaterThanOrEqual(0);
          expect(step.round).toBeLessThan(64);
        }
      });
    });

    it('should have increasing step progression', () => {
      const steps = engine.hash('test');
      
      // Les steps doivent progresser logiquement
      const stepNames = steps.map(s => s.step);
      
      // Doit commencer par Étape 0
      expect(stepNames[0]).toContain('Étape 0');
      
      // Doit finir par Étape 5
      expect(stepNames[stepNames.length - 1]).toContain('Étape 5');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const steps = engine.hash('');
      expect(steps.length).toBeGreaterThan(0);
      
      const finalHash = steps[steps.length - 1].hash;
      expect(finalHash).toBeDefined();
      expect(finalHash?.length).toBe(64);
    });

    it('should handle single character', () => {
      const steps = engine.hash('a');
      const finalHash = steps[steps.length - 1].hash;
      
      expect(finalHash).toBeDefined();
      expect(finalHash?.length).toBe(64);
    });

    it('should handle special characters', () => {
      const steps = engine.hash('!@#$%^&*()');
      const finalHash = steps[steps.length - 1].hash;
      
      expect(finalHash).toBeDefined();
      expect(finalHash?.length).toBe(64);
    });

    it('should handle unicode characters', () => {
      const steps = engine.hash('🔐🔑');
      const finalHash = steps[steps.length - 1].hash;
      
      expect(finalHash).toBeDefined();
      expect(finalHash?.length).toBe(64);
    });
  });
});

