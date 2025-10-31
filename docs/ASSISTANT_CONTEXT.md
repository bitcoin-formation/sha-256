# 🤖 Contexte Assistant - SHA-256 Formation Progressive

## 📌 À Quoi Sert Ce Document

Ce document est conçu pour **moi** (l'assistant Claude) lors de **resets de chat**. Il contient l'essentiel pour reprendre le développement efficacement sans perdre le contexte.

**Utilisation:** L'utilisateur peut partager ce document au début d'une nouvelle session pour restaurer le contexte rapidement.

---

## 🎯 Vision du Projet

### Objectif Global
Créer une **plateforme de formation progressive** pour comprendre SHA-256 et la cryptographie de hash, en 6 niveaux :

1. **Niveau 1: Introduction** - Pourquoi hash ? Applications Bitcoin (blocks, txs, mining)
2. **Niveau 2: Simple-hash** - Algorithme basique + démo attaques (simulation cartes 3D)
3. **Niveau 3: Hash-prep** - Ajout expansion (cartes magiques) + preuve attaques réglées
4. **Niveau 4: SHA-256** - Implémentation complète (code actuel migré)
5. **Niveau 5: Multi-Blocs** - Gestion messages > 512 bits + padding
6. **Niveau 6: Conclusion** - Références SHA-256 monde réel + form feedback

### Analogie Centrale : Le Jeu de Cartes 🃏

**Cette analogie guide TOUTE la pédagogie :**

```
SHA-256 = Mélanger un jeu de cartes 64 fois selon des règles précises

1. PRÉPARATION (expansion):
   - Prendre le paquet original (16 cartes = message)
   - Ajouter des "cartes magiques" (constantes K[])
   - Pré-mélanger pour créer 64 cartes "contaminées"
   → Résultat: Impossible de tracer une carte individuelle

2. 64 ROUNDS (compression):
   - 8 piles de cartes (a, b, c, d, e, f, g, h)
   - À chaque round: manipuler les piles + ajouter une carte contaminée
   - Chaque manipulation transforme le résultat du round précédent
   → Résultat: Après 64 rounds, 8 cartes finales = le hash

3. POURQUOI 64 ROUNDS?
   - Assure que TOUS les bits du message affectent TOUS les bits du hash
   - Sans ça: patterns prévisibles, vulnérable aux attaques
   - Avec: effet avalanche complet (1 bit changé = hash complètement différent)
```

**Utiliser cette analogie dans :**
- Interface utilisateur (tooltips, explications)
- Documentation pédagogique
- Niveau 1 (montrer le paquet non-mélangé = vulnérable)
- Niveau 2 (prouver qu'on peut "suivre une carte")

---

## 📁 Architecture Actuelle (État au 30 Oct 2025)

### Structure Répertoires

```
/var/docker/bitcoin-formation/sha-256/
├── src/
│   ├── components/               # Composants UI (Niveau 3 actuel)
│   │   ├── FlowDiagram/          # Diagramme flowchart avec 5 étapes
│   │   ├── CodeDisplay/          # Pseudocode avec highlighting
│   │   ├── StateDisplay/         # Affichage registres (a,b,c,d,e,f,g,h)
│   │   ├── RoundIndicator/       # Progression rounds/steps
│   │   └── Controls/             # Play/Pause/Step/Speed
│   │
│   ├── engines/
│   │   └── sha256/
│   │       ├── sha256Engine.ts   # Moteur SHA-256 (génère steps)
│   │       └── operations.ts     # Fonctions crypto (rotr, ch, maj, etc.)
│   │
│   ├── store/
│   │   └── useAppStore.ts        # Zustand store (state global)
│   │
│   ├── constants/
│   │   └── codeLineMapping.ts    # Mapping steps → lignes pseudocode
│   │
│   └── App.tsx                   # App principale
│
├── public/
│   └── locales/                  # i18n (FR/EN)
│
├── .github/workflows/
│   └── deploy.yml                # Déploiement GitHub Pages
│
└── docs/                         # Documentation technique (pour toi)
    ├── MIGRATION_PLAN.md
    ├── ASSISTANT_CONTEXT.md      # Ce fichier
    └── (autres docs à venir)
```

### État des Modules (30 Oct 2025)

| Module | État | Coverage Tests | Phase | Notes |
|--------|------|----------------|-------|-------|
| **Infrastructure Tests** | ❌ À créer | N/A | Phase 0 | Vitest + RTL + Playwright |
| **MCP Test Dashboard** | ❌ À créer | N/A | Phase 0.5 | Self-feedback automatique |
| **Niveau 4 (SHA-256)** | ✅ Fonctionnel | ❌ 0% | Phase 1 | Code actuel, tests à créer |
| **Refactoring Modulaire** | ❌ À faire | N/A | Phase 2 | Réorganiser sans changer |
| **Niveau 1 (Introduction)** | ❌ À créer | N/A | Phase 3 | Outil interactif + Bitcoin |
| **Niveau 2 (Simple-hash)** | ❌ À créer | N/A | Phase 4 | Cartes 3D + attaques |
| **Niveau 3 (Hash-prep)** | ❌ À créer | N/A | Phase 5 | Expansion + preuve |
| **Niveau 5 (Multi-blocs)** | ❌ À créer | N/A | Phase 7 | Padding + chaînage |
| **Niveau 6 (Conclusion)** | ❌ À créer | N/A | Phase 8 | Références + form |
| **Beta Testing** | ❌ À faire | N/A | Phase 9 | 8-10 testeurs, 2-4 sem |
| **Corrections** | ❌ À faire | N/A | Phase 10-11 | Feedbacks beta |

---

## 🔑 Décisions Architecturales Clés

### 1. Pourquoi 7 Steps par Round ?

Le niveau 3 (SHA-256) crée **7 steps par round** pour pédagogie :

```typescript
// Dans sha256Engine.ts
for (let i = 0; i < 64; i++) {
  // Step 1: Calcul S1
  this.steps.push({ operation: 'sigma1', ... });
  
  // Step 2: Calcul Ch
  this.steps.push({ operation: 'ch', ... });
  
  // Step 3: Calcul temp1
  this.steps.push({ operation: 'temp1', ... });
  
  // Step 4: Calcul S0
  this.steps.push({ operation: 'sigma0', ... });
  
  // Step 5: Calcul Maj
  this.steps.push({ operation: 'maj', ... });
  
  // Step 6: Calcul temp2
  this.steps.push({ operation: 'temp2', ... });
  
  // Step 7: Rotation registres (EN PARALLÈLE)
  this.steps.push({ operation: 'rotate', ... });
}
```

**Raison:** Montrer CHAQUE opération permet de comprendre la logique interne.

### 2. Pourquoi `codeLineMapping.ts` ?

**Problème initial:** Les numéros de lignes du pseudocode étaient hardcodés partout. Changer le pseudocode = casser tous les mappings.

**Solution:** Centraliser dans un fichier de constantes :

```typescript
export const CODE_LINE_MAPPING = {
  STEP_0_MESSAGE_INPUT: 1,
  STEP_1_PREPARE_MESSAGE: 10,
  ROUND_SIGMA1_E: 23,
  ROUND_CH: 24,
  // etc.
} as const;
```

**Utilisation:**
```typescript
codeLineNumber: CODE_LINE_MAPPING.ROUND_SIGMA1_E
```

**Bénéfice:** Une seule source de vérité. Modifier le pseudocode = ajuster les constantes.

### 3. Pourquoi Zustand au lieu de Context API ?

**Choix:** Zustand pour state management global.

**Raisons:**
- ✅ Plus simple que Redux
- ✅ Moins de boilerplate que Context API
- ✅ Performance (pas de re-render inutiles)
- ✅ DevTools intégrés

**Usage actuel:**
```typescript
const { steps, currentStep, animation } = useAppStore();
```

### 4. Pourquoi Framer Motion ?

**Choix:** Framer Motion pour animations.

**Raisons:**
- ✅ Déclaratif (facile à lire)
- ✅ Gère layout animations automatiquement
- ✅ Performance (GPU-accelerated)

**Utilisé dans:** FlowDiagram, StateDisplay pour transitions fluides.

### 5. Pourquoi Vite au lieu de Create React App ?

**Choix:** Vite comme bundler.

**Raisons:**
- ✅ Build ultra-rapide (ESBuild)
- ✅ HMR instantané
- ✅ Tree-shaking optimal
- ✅ Moderne (2024 standard)

### 6. GitHub Pages avec Base Path

**Configuration:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/sha-256/', // Important pour GitHub Pages
});
```

**Raison:** Le repo est déployé sous `bitcoin-formation.github.io/sha-256/`, pas à la racine.

---

## 🧪 Stratégie de Tests (À Implémenter)

### Stack Choisie

| Outil | Usage | Pourquoi |
|-------|-------|----------|
| **Vitest** | Tests unitaires | Compatible Vite, rapide, API Jest-like |
| **React Testing Library** | Tests composants | Best practice React 2024 |
| **Playwright** | Tests E2E | Recommandé 2024, stable, multi-browser |

### Priorités de Tests

**Phase 1: Sécuriser l'existant**

1. **Critique (95% coverage):**
   - `sha256Engine.ts` - Génération des steps
   - `operations.ts` - Fonctions crypto (rotr, ch, maj, sigma0, sigma1)

2. **Haute (80% coverage):**
   - `FlowDiagram.tsx` - Affichage correct des étapes
   - `CodeDisplay.tsx` - Highlighting des lignes
   - `useAppStore.ts` - State management

3. **Moyenne (70% coverage):**
   - Autres composants UI
   - Utils (conversions hex/bin/dec)

### Exemple de Test Unitaire

```typescript
// tests/unit/operations.test.ts
import { describe, test, expect } from 'vitest';
import { rotr, ch, maj, sigma0, sigma1 } from '@/engines/sha256/operations';

describe('SHA-256 Operations', () => {
  test('rotr rotates bits correctly', () => {
    // rotr(0x12345678, 8) devrait donner 0x78123456
    expect(rotr(0x12345678, 8)).toBe(0x78123456);
  });

  test('ch function chooses correctly', () => {
    // ch(x, y, z) = (x AND y) XOR (NOT x AND z)
    // ch(0xFF, 0xAA, 0x55) = (0xFF AND 0xAA) XOR (0x00 AND 0x55) = 0xAA
    expect(ch(0xFF, 0xAA, 0x55)).toBe(0xAA);
  });

  test('maj function finds majority', () => {
    // maj(x, y, z) = (x AND y) XOR (x AND z) XOR (y AND z)
    expect(maj(0xFF, 0xFF, 0x00)).toBe(0xFF); // Majorité de 1
    expect(maj(0x00, 0x00, 0xFF)).toBe(0x00); // Majorité de 0
  });
});
```

---

## 💾 State Management - Structure Zustand

```typescript
// useAppStore.ts (simplifié)
interface AppState {
  // Message input
  message: string;
  setMessage: (msg: string) => void;
  
  // SHA-256 config (toujours 64 rounds, 512 bits)
  config: SHA256Config;
  
  // Steps générés par sha256Engine
  steps: SHA256Step[];
  
  // Animation state
  animation: {
    isPlaying: boolean;
    currentStepIndex: number;
    speed: number; // ms (40 = 25x, 20 = 50x)
  };
  
  // Actions
  generateSteps: () => void;
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setSpeed: (speed: number) => void;
}
```

**Flow:**
1. User tape message → `setMessage()`
2. Auto-trigger → `generateSteps()` → `sha256Engine.hash(message)`
3. Steps stockés dans store
4. Components lisent `steps[currentStepIndex]` pour affichage
5. Animation loop incrémente `currentStepIndex` toutes les `speed` ms

---

## 🎨 Interface Utilisateur - Composants Clés

### FlowDiagram.tsx

**Rôle:** Affiche le flowchart avec 5 étapes principales + 7 sous-étapes dans la boucle.

**Structure SVG:**
```svg
<svg viewBox="0 0 600 1100">
  <!-- Étape 0: Message d'entrée -->
  <g className={activeMainStep === 0 ? 'active' : ''}>
    <rect x="50" y="30" width="500" height="75" rx="10" />
    <text>0. Message d'entrée</text>
    <text>{message}</text> {/* Message affiché */}
  </g>
  
  <!-- Étape 1: Préparation (expansion W[0..63]) -->
  <g className={activeMainStep === 1 ? 'active' : ''}>
    <rect x="50" y="130" width="500" height="75" rx="10" />
    <text>1. Préparer le message</text>
    <text>W[0], W[1], ... W[63]</text> {/* Valeurs W[] affichées */}
  </g>
  
  <!-- Étape 2: Initialisation registres -->
  <!-- Étape 3: Boucle 64 rounds (avec 7 sous-steps) -->
  <!-- Étape 4: Ajout au hash -->
  <!-- Étape 5: Résultat final -->
</svg>
```

**Tooltips:** Affichés au survol, montrent:
- Étape 0: Message en HEX, Binary, Decimal
- Étape 1: Valeurs W[] détaillées (W[0..15] en bleu, W[16..63] en violet)
- Étape 5: Hash final en HEX

**Important:** Les tooltips suivent la souris (`position: fixed` + `mousePos`).

### CodeDisplay.tsx

**Rôle:** Affiche le pseudocode avec highlighting de la ligne active.

**Pseudocode:**
```
ALGORITHME: SHA-256 Fonction de Compression
═══════════════════════════════════════════

FONCTION compression(bloc_message, hash_précédent):
  │
  ├─ ÉTAPE 1: Préparer le message (Message Schedule)
  │    ├─ W[0..15] ← découper bloc en 16 mots de 32 bits
  │    └─ EXPANSION: générer W[16..63] avec σ0 et σ1
  │
  ├─ ÉTAPE 2: Initialiser les variables de travail
  │    a, b, c, d, e, f, g, h ← hash_précédent
  │
  ├─ ÉTAPE 3: Boucle principale (64 rounds)
  │    POUR i DE 1 À 64 FAIRE:
  │      S1 ← Σ1(e)                    [ligne 23]
  │      Ch ← Ch(e, f, g)              [ligne 24]
  │      temp1 ← h + S1 + Ch + K[i] + W[i]  [ligne 25]
  │      S0 ← Σ0(a)                    [ligne 28]
  │      Maj ← Maj(a, b, c)            [ligne 29]
  │      temp2 ← S0 + Maj              [ligne 30]
  │      [a, b, c, d, e, f, g, h] ← [temp1+temp2, a, b, c, d+temp1, e, f, g]  [ligne 34]
  │
  └─ ÉTAPE 4: Ajouter au hash
       RETOURNER [H[0]+a, H[1]+b, ..., H[7]+h]
```

**Highlighting:**
- Lit `currentStep.codeLineNumber`
- Scroll automatique si ligne active hors de vue
- **Important:** Scroll seulement le container, PAS toute la page

### Controls.tsx

**Rôle:** Boutons de contrôle de l'animation.

**Boutons:**
- ▶️ Play / ⏸️ Pause
- ⏮️ Début (index 0)
- ⬅️ Step précédent
- ➡️ Step suivant
- ⏭️ Fin (dernier step)
- ⏩ Round suivant (skip +7 steps)

**Speed Slider:**
- Min: 1x (1000ms)
- Max: 50x (20ms)
- Défaut: 25x (40ms)
- **Logique inversée:** Slider va de gauche (lent) à droite (rapide)

### RoundIndicator.tsx

**Rôle:** Affiche la progression actuelle.

**Format:**
- Avant boucle: "Étape 0: Message d'entrée", "Étape 1: Préparation", etc.
- Dans boucle: "Round 1/64 - Step 3/7"
- Après boucle: "Étape 5: Résultat"

**Barre de progression:**
```
[███████████░░░░░░░░░░░░░░] 45%
```

Calcul: `(currentStepNumber / totalSteps) * 100`

---

## 🐛 Pièges à Éviter (Bugs Historiques)

### 1. Rounds qui commencent à 0 vs 1

**Problème:** En prog, rounds = 0..63. Pour les humains, rounds = 1..64.

**Solution:** Toujours afficher `round + 1` dans l'UI.

```typescript
const displayRound = currentStep.round + 1; // 0 → 1, 63 → 64
```

### 2. Scrolling Automatique de la Page

**Problème:** `scrollIntoView()` scrollait toute la page au lieu du container.

**Solution:** Checker si élément visible DANS LE CONTAINER avant de scroller.

```typescript
const isLineVisible = (lineElement: HTMLElement, container: HTMLElement) => {
  const lineRect = lineElement.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return lineRect.top >= containerRect.top && lineRect.bottom <= containerRect.bottom;
};

if (!isLineVisible(lineElement, codeContainer)) {
  lineElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
```

### 3. Valeurs W[] qui Changent Pendant les Rounds

**Problème:** FlowDiagram lisait `currentStep.intermediateValues['W[0]']`, qui changeait à chaque step.

**Solution:** Fixer les valeurs W[] lors de l'Étape 1 (préparation) :

```typescript
const [fixedWValues, setFixedWValues] = useState(null);

useEffect(() => {
  if (currentStep.description.includes('Étape 1: Préparation')) {
    setFixedWValues(currentStep.intermediateValues);
  }
}, [currentStep]);

// Utiliser fixedWValues au lieu de currentStep.intermediateValues
```

### 4. Mapping Lignes Pseudocode Hardcodé

**Problème:** Changer le pseudocode cassait tous les mappings.

**Solution:** `codeLineMapping.ts` (voir section Décisions Architecturales).

### 5. Tests Unitaires Manquants

**Problème actuel:** 0% de coverage → Régressions fréquentes.

**Solution:** Phase 1 du plan de migration = créer tests avant tout refactoring.

---

## 🔧 Commandes Fréquentes

### Développement Local

```bash
cd /var/docker/bitcoin-formation/sha-256

# Installer dépendances
npm install

# Dev server
npm run dev
# → http://localhost:5173

# Build production
npm run build

# Preview build
npm run preview
```

### Git / Déploiement

```bash
# Commit (messages en français)
git add -A
git commit -m "feat: ajouter tooltip sur Étape 1 avec valeurs W[]"
git push

# Déploiement automatique via GitHub Actions
# → https://bitcoin-formation.github.io/sha-256/
```

### Tests (À implémenter Phase 0)

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E
npm run test:e2e
```

---

## 📊 Métriques Actuelles (30 Oct 2025)

| Métrique | Valeur | Objectif |
|----------|--------|----------|
| **Lines of Code** | ~2500 | N/A |
| **Components** | 8 | +12 (niveaux 1,2,4) |
| **Test Coverage** | 0% | 80%+ |
| **Build Size** | ~180KB | < 500KB |
| **Lighthouse Score** | ~95 | > 90 |
| **GitHub Stars** | 0 | N/A |

---

## 🚧 Prochaines Tâches (Ordre de Priorité)

### Phase 0: Infrastructure Tests (1-2h)
- [ ] Installer Vitest, RTL, Playwright
- [ ] Créer `vitest.config.ts`, `playwright.config.ts`
- [ ] Créer `tests/setup.ts`
- [ ] Ajouter scripts `package.json`
- [ ] Configurer `.github/workflows/test.yml`
- [ ] Créer volume `test-reports`

### Phase 0.5: MCP Test Dashboard (2-3h) 🆕
- [ ] Copier template MCP depuis `bitcoin-common-api`
- [ ] Adapter `server.py` avec 3 tools (status, failed, coverage)
- [ ] Build image Docker
- [ ] Configurer dans Cursor `mcp-settings.json`
- [ ] Tester MCP fonctionnel

### Phase 1: Tests sur Existant (2-3h)
- [ ] Tests unitaires `operations.ts`
- [ ] Tests unitaires `sha256Engine.ts`
- [ ] Tests composants (FlowDiagram, CodeDisplay, Controls)
- [ ] Tests intégration flux complet
- [ ] Atteindre 70%+ coverage

### Phase 2: Refactoring Modulaire (3-4h)
- [ ] Créer `src/shared/`
- [ ] Créer `src/modules/level-4-sha256/`
- [ ] Créer `src/core/` (Router)
- [ ] Migrer code existant
- [ ] Adapter tests
- [ ] Tous tests verts

### Phase 3: Niveau 1 - Introduction (3-4h)
- [ ] `IntroductionPage.tsx` avec explications
- [ ] `InteractiveHashTool.tsx` (hash simple interactif)
- [ ] `BitcoinExamples.tsx` (blocks, txs, mining)
- [ ] Tests unitaires + composants
- [ ] **Post-Mortem:** `docs/POST_MORTEM_LEVEL1.md`

### Phase 4: Niveau 2 - Simple-hash + Attaques (5-6h)
- [ ] `CardDeck3D.tsx` (shared component)
- [ ] `SimpleHashDemo.tsx` (2.1: algo interactif)
- [ ] `AttackVectors.tsx` (2.2: traçabilité + collision)
- [ ] Tests unitaires + E2E
- [ ] **Post-Mortem:** `docs/POST_MORTEM_LEVEL2.md`

### Phase 5: Niveau 3 - Hash-prep (4-5h)
- [ ] `CardExpansion.tsx` (ajout cartes magiques)
- [ ] `HashWithPrepDemo.tsx` (hash avec expansion)
- [ ] `AttackProof.tsx` (preuve attaques réglées)
- [ ] Tests unitaires + intégration
- [ ] **Post-Mortem:** `docs/POST_MORTEM_LEVEL3.md`

### Phase 6: Niveau 4 - SHA-256 (2-3h)
- [ ] Migrer code existant (déjà testé)
- [ ] Ajuster imports/navigation
- [ ] Vérifier tests verts
- [ ] **Post-Mortem:** `docs/POST_MORTEM_LEVEL4.md`

### Phase 7: Niveau 5 - Multi-bloc (3-4h)
- [ ] `MultiBlockEngine.ts` (découpage + padding)
- [ ] `MultiBlockVisualization.tsx` (chaînage H[])
- [ ] Tests unitaires + intégration
- [ ] **Post-Mortem:** `docs/POST_MORTEM_LEVEL5.md`

### Phase 8: Niveau 6 - Conclusion (2-3h)
- [ ] Page références monde réel
- [ ] Intégrer Google Form feedback
- [ ] Tests E2E parcours complet
- [ ] **Post-Mortem:** `docs/POST_MORTEM_LEVEL6.md`

### Phase 9: Beta Testing (2-4 semaines) 🆕
- [ ] Envoyer aux 8-10 testeurs
- [ ] Recueillir feedbacks (Google Form)
- [ ] Observations informelles

### Phase 10: Planification Corrections (2-3h) 🆕
- [ ] Analyser feedbacks
- [ ] Regrouper par thème
- [ ] Prioriser (MoSCoW)
- [ ] Créer plan d'action

### Phase 11: Corrections (Variable) 🆕
- [ ] Implémenter Must Have
- [ ] Implémenter Should Have (si temps)
- [ ] Validation utilisateur
- [ ] Version finale stable

---

## 💡 Tips pour l'Assistant (Moi)

### Lors d'un Reset de Chat

1. **Lire ce document EN ENTIER**
2. **Vérifier l'état actuel:**
   ```bash
   git log --oneline -10  # Derniers commits
   git status             # Fichiers modifiés
   ```
3. **Identifier la phase en cours** (voir Prochaines Tâches)
4. **Demander confirmation utilisateur** avant de continuer

### Workflow Recommandé

1. **Lire l'issue/demande utilisateur**
2. **Écrire les tests AVANT le code** (TDD)
3. **Implémenter le code pour passer les tests**
4. **Refactor si nécessaire**
5. **Vérifier lints:** `npm run lint`
6. **Commit atomique:** `git commit -m "feat: ..."`

### Commit Messages (Convention FR)

```
feat: ajouter X
fix: corriger Y
refactor: simplifier Z
test: ajouter tests pour W
docs: documenter V
chore: mettre à jour dépendances
```

### Qualité du Code

**Toujours:**
- ✅ Types TypeScript stricts
- ✅ Props validation
- ✅ Error handling explicite
- ✅ Comments pour logique complexe
- ✅ Nommer variables clairement

**Éviter:**
- ❌ `any` types
- ❌ Magic numbers (utiliser constantes)
- ❌ Fonctions > 50 lignes
- ❌ Composants > 300 lignes
- ❌ Duplication de code

---

## 📞 Contact / Support

**Utilisateur Principal:** Gilles Auclair  
**Email:** gauclair@sarius.ca  
**Repo:** https://github.com/bitcoin-formation/sha-256  
**Live Demo:** https://bitcoin-formation.github.io/sha-256/

**Langues:**
- Interface: Bilingue FR/EN (FR prioritaire)
- Code/Comments: EN
- Commits/Docs: FR
- README: Bilingue

---

## 🔄 Historique des Versions

| Date | Version | Changements Majeurs |
|------|---------|---------------------|
| 30 Oct 2025 | 1.0 | Document initial créé |

---

**Note pour l'Assistant:** Ce document doit être mis à jour après chaque phase majeure (changement d'architecture, ajout de modules, etc.).


