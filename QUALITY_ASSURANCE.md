# Assurance Qualité - SHA-256 Visualizer

## Problème Identifié

Lors des modifications du code, plusieurs bugs ont été introduits :
- Steps parasites dans l'expansion W[]
- Valeurs W[] qui changeaient pendant les rounds
- Synchronisation incorrecte entre le pseudo-code et le schéma
- Numéros de ligne hardcodés causant des désynchronisations

## Solutions Implémentées

### 1. **Mapping Centralisé** (`src/constants/codeLineMapping.ts`)

**Problème résolu** : Numéros de ligne hardcodés partout dans le code

**Solution** :
- Une seule source de vérité pour les numéros de ligne
- Fonction de validation intégrée
- Si le pseudo-code change, on modifie UNE SEULE fois

```typescript
// ❌ AVANT : Hardcodé partout
codeLineNumber: 22,  // Risque de désynchronisation

// ✅ APRÈS : Mapping centralisé
codeLineNumber: CODE_LINE_MAPPING.ROUND_TEMP1,
```

## Solutions Recommandées pour le Futur

### 2. **Tests Unitaires**

Créer des tests pour valider la logique métier :

```typescript
// test/sha256Engine.test.ts
describe('SHA256Engine', () => {
  it('devrait générer exactement 5 + (64 * 7) + 2 steps', () => {
    const engine = new SHA256Engine(DEFAULT_CONFIG);
    const steps = engine.hash('Hello');
    
    // 1 message + 2 prep/init + (64 rounds * 7 steps) + 2 final = 453 steps
    expect(steps.length).toBe(453);
  });
  
  it('devrait avoir des valeurs W[] constantes après préparation', () => {
    const engine = new SHA256Engine(DEFAULT_CONFIG);
    const steps = engine.hash('Hello');
    
    const prepareStep = steps.find(s => s.description.includes('Étape 1'));
    const w0 = prepareStep.intermediateValues['W[0]'];
    
    // Vérifier que W[0] n'apparaît jamais avec une valeur différente
    steps.forEach(step => {
      if (step.intermediateValues['W[0]'] !== undefined) {
        expect(step.intermediateValues['W[0]']).toBe(w0);
      }
    });
  });
  
  it('devrait avoir des codeLineNumber valides', () => {
    const engine = new SHA256Engine(DEFAULT_CONFIG);
    const steps = engine.hash('Hello');
    
    steps.forEach(step => {
      expect(step.codeLineNumber).toBeGreaterThan(0);
      expect(step.codeLineNumber).toBeLessThan(60); // Max line in pseudocode
    });
  });
});
```

### 3. **Tests d'Intégration**

Valider que les composants fonctionnent ensemble :

```typescript
// test/integration/flowDiagram.test.tsx
describe('FlowDiagram Integration', () => {
  it('devrait afficher la bonne étape active', () => {
    const { container } = render(<App />);
    
    // Avancer de 3 steps
    fireEvent.click(screen.getByLabelText('Step Forward'));
    fireEvent.click(screen.getByLabelText('Step Forward'));
    fireEvent.click(screen.getByLabelText('Step Forward'));
    
    // Vérifier que l'étape 1 est active
    expect(screen.getByText(/Étape 1: Préparation/)).toBeInTheDocument();
  });
});
```

### 4. **Validation à l'Exécution**

Ajouter des assertions dans le code :

```typescript
// Dans sha256Engine.ts
public hash(message: string): SHA256Step[] {
  this.steps = [];
  
  // ... code ...
  
  // ✅ VALIDATION : S'assurer qu'on a le bon nombre de steps
  const expectedSteps = 5 + (rounds * 7);
  if (this.steps.length !== expectedSteps) {
    console.error(`Expected ${expectedSteps} steps, got ${this.steps.length}`);
    throw new Error('Invalid number of steps generated');
  }
  
  // ✅ VALIDATION : Vérifier que le mapping est correct
  const { valid, errors } = validateCodeLineMapping();
  if (!valid) {
    console.error('Code line mapping validation failed:', errors);
  }
  
  return this.steps;
}
```

### 5. **Documentation des Contrats**

Documenter les attentes de chaque fonction :

```typescript
/**
 * Génère tous les steps de l'algorithme SHA-256
 * 
 * @param message - Message à hasher (max 512 caractères)
 * @returns Array de steps avec structure :
 *   - 1 step : Message d'entrée
 *   - 1 step : Préparation W[]
 *   - 1 step : Initialisation
 *   - N * 7 steps : Boucle principale (N = rounds, typiquement 64)
 *   - 1 step : Addition au hash
 *   - 1 step : Résultat final
 * 
 * @throws Error si le message dépasse 512 caractères
 * @throws Error si le nombre de steps généré est incorrect
 * 
 * @example
 * const engine = new SHA256Engine(config);
 * const steps = engine.hash('Hello'); // 5 + (64 * 7) = 453 steps
 */
public hash(message: string): SHA256Step[] {
  // ...
}
```

### 6. **Git Hooks avec Husky**

Automatiser les vérifications avant commit :

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run validate",
      "pre-push": "npm test"
    }
  },
  "scripts": {
    "validate": "npm run lint && npm run type-check && npm run test:unit",
    "lint": "eslint src/**/*.{ts,tsx}",
    "type-check": "tsc --noEmit",
    "test:unit": "vitest run",
    "test:watch": "vitest"
  }
}
```

### 7. **TypeScript Strict Mode**

Activer les vérifications strictes :

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 8. **Code Review Checklist**

Avant chaque commit, vérifier :

- [ ] Les tests unitaires passent
- [ ] Aucun `codeLineNumber` hardcodé
- [ ] La validation `validateCodeLineMapping()` passe
- [ ] Aucune régression visuelle (tester manuellement)
- [ ] Le nombre de steps est correct
- [ ] Les valeurs W[] restent constantes
- [ ] Le pseudo-code est synchronisé avec le schéma

### 9. **Constantes Centralisées**

Créer des fichiers de constantes pour éviter les magic numbers :

```typescript
// src/constants/sha256Constants.ts
export const SHA256_CONFIG = {
  ROUNDS: 64,
  MESSAGE_BLOCK_SIZE: 512,
  HASH_SIZE: 256,
  W_ARRAY_SIZE: 64,
  STEPS_PER_ROUND: 7,
} as const;

// Calculer le nombre total d'étapes
export const TOTAL_STEPS = 
  1 + // Message d'entrée
  1 + // Préparation
  1 + // Initialisation
  (SHA256_CONFIG.ROUNDS * SHA256_CONFIG.STEPS_PER_ROUND) + // Boucle principale
  1 + // Addition
  1;  // Résultat
```

### 10. **Monitoring et Logs**

Ajouter des logs pour détecter les anomalies :

```typescript
// Dans sha256Engine.ts
if (process.env.NODE_ENV === 'development') {
  console.group('SHA256 Engine Debug');
  console.log('Total steps generated:', this.steps.length);
  console.log('Expected steps:', expectedSteps);
  console.log('W[0] value:', W[0]);
  console.log('First step:', this.steps[0]);
  console.log('Last step:', this.steps[this.steps.length - 1]);
  console.groupEnd();
}
```

## Processus de Développement Recommandé

1. **Avant toute modification** :
   - Lire la documentation
   - Comprendre l'impact des changements
   - Vérifier les constantes centralisées

2. **Pendant la modification** :
   - Utiliser les constantes, jamais de hardcode
   - Écrire des tests en même temps
   - Ajouter des commentaires explicatifs

3. **Après la modification** :
   - Exécuter tous les tests
   - Valider manuellement l'interface
   - Vérifier les logs en mode dev
   - Code review si possible

4. **Avant le commit** :
   - Run `npm run validate`
   - Vérifier la checklist
   - Écrire un commit message descriptif

## Outils à Installer

```bash
# Tests
npm install -D vitest @testing-library/react @testing-library/user-event

# Linting
npm install -D eslint @typescript-eslint/eslint-plugin

# Hooks
npm install -D husky lint-staged

# Type checking
# (TypeScript est déjà installé)
```

## Conclusion

En appliquant ces pratiques :
- ✅ Les bugs sont détectés **avant** d'atteindre l'interface
- ✅ Les modifications sont **sûres** et **prévisibles**
- ✅ La maintenance est **simplifiée** (une seule source de vérité)
- ✅ La qualité du code est **mesurable** et **reproductible**

