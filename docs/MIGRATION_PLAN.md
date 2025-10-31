# 📋 Plan de Migration - SHA-256 Formation Progressive (v2)

## 🎯 Objectif

Transformer l'application SHA-256 actuelle en plateforme de formation progressive (6 niveaux) avec infrastructure de tests robuste, architecture modulaire, et CI/CD complet.

### Les 6 Niveaux de Formation

| Niveau | Nom | Concept | Approche |
|--------|-----|---------|----------|
| **1** | Introduction | Pourquoi hash ? Bitcoin | Outil interactif + explications |
| **2** | Simple-hash | Algo basique + attaques | Simulation cartes 3D interactive |
| **3** | Hash-prep | Expansion (cartes magiques) | Cartes 3D + preuve attaques réglées |
| **4** | SHA-256 | Implémentation complète | Code actuel migré |
| **5** | Multi-bloc | Messages > 512 bits | Extension niveau 4 |
| **6** | Conclusion | Références réelles | Usages SHA-256 monde réel |

---

## 📐 Architecture Cible

### Structure Modulaire

```
/var/docker/bitcoin-formation/sha-256/
├── docs/                          # Documentation (pour assistant)
│   ├── MIGRATION_PLAN_V2.md      # Ce document
│   ├── ASSISTANT_CONTEXT.md      # Contexte complet
│   ├── POST_MORTEM_LEVELX.md     # Post-mortems après chaque niveau
│   └── ...
│
├── src/
│   ├── shared/                   # Code partagé
│   │   ├── components/
│   │   │   ├── CardDeck3D/       # Simulation 3D cartes (réutilisable)
│   │   │   ├── InteractiveHash/  # Outil hash interactif
│   │   │   └── ...
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   │
│   ├── modules/                  # 6 niveaux
│   │   ├── level-1-introduction/
│   │   ├── level-2-simple-hash/
│   │   ├── level-3-hash-prep/
│   │   ├── level-4-sha256/       # Code actuel
│   │   ├── level-5-multiblock/
│   │   └── level-6-conclusion/
│   │
│   └── core/                     # Router, navigation
│
├── tests/                        # Tests globaux
├── mcp-server/                   # Serveur MCP testing 🆕
└── public/
```

---

## 🔄 Plan de Migration - 11 Phases

### Vue d'Ensemble

| Phase | Durée | Objectif | Post-Mortem |
|-------|-------|----------|-------------|
| **0** | 1-2h | Infrastructure tests | - |
| **0.5** | 2-3h | MCP Test Dashboard | - |
| **1** | 2-3h | Tests code existant | - |
| **2** | 3-4h | Refactoring modulaire | - |
| **3** | 3-4h | Niveau 1 (Introduction) | ✅ |
| **4** | 5-6h | Niveau 2 (Simple-hash + attaques) | ✅ |
| **5** | 4-5h | Niveau 3 (Hash-prep) | ✅ |
| **6** | 2-3h | Niveau 4 (SHA-256 - migration) | ✅ |
| **7** | 3-4h | Niveau 5 (Multi-bloc) | ✅ |
| **8** | 2-3h | Niveau 6 (Conclusion) | ✅ |
| **9** | 2-4 semaines | Beta testing (8-10 personnes) | - |
| **10** | 2-3h | Planification corrections | - |
| **11** | Variable | Mise en service corrections | - |
| **TOTAL** | **~30-40h dev + 2-4 sem beta** | Plateforme complète | - |

---

## 📋 Phases Détaillées

### Phase 0: Infrastructure Tests (1-2h)

**Objectif:** Mettre en place Vitest + RTL + Playwright + CI/CD

**Actions:**

1. **Installer dépendances**
   ```bash
   npm install -D vitest @vitest/ui @vitest/coverage-v8 \
     @testing-library/react @testing-library/jest-dom @testing-library/user-event \
     @playwright/test jsdom happy-dom
   ```

2. **Créer `vitest.config.ts`**
3. **Créer `playwright.config.ts`**
4. **Créer `tests/setup.ts`**
5. **Ajouter scripts `package.json`**
6. **Configurer `.github/workflows/test.yml`**
7. **Créer volume Docker `test-reports`**

**Livrables:**
- ✅ Vitest fonctionnel
- ✅ CI/CD GitHub Actions
- ✅ Volume partagé pour reports

---

### Phase 0.5: MCP Test Dashboard (2-3h) 🆕

**Objectif:** Self-feedback automatique pour l'assistant

**Pourquoi maintenant?**
- Accélère développement (détection bugs automatique)
- Réduit allers-retours utilisateur ↔ assistant
- L'assistant peut interroger tests en temps réel

**Actions:**

1. **Créer serveur MCP** (copier template `bitcoin-common-api`)
2. **Implémenter 3 tools:**
   - `get_test_status()` → Résumé tests (passed/failed/total)
   - `get_failed_tests()` → Détails erreurs
   - `get_coverage_report()` → Métriques coverage par module

3. **Build + configurer dans Cursor**

**Livrables:**
- ✅ MCP fonctionnel
- ✅ Assistant a self-feedback automatique
- ✅ Cycle de développement accéléré

---

### Phase 1: Tests sur Code Existant (2-3h)

**Objectif:** Sécuriser le code actuel (futur niveau 4) avant tout refactoring

**Cible:** 70%+ coverage

**Tests prioritaires:**
1. **Unitaires** - `sha256Engine.ts`, `operations.ts`
2. **Composants** - `FlowDiagram`, `CodeDisplay`, `Controls`
3. **Intégration** - Flux complet Message → Hash

**Livrables:**
- ✅ Suite de tests robuste
- ✅ CI green
- ✅ Baseline qualité

---

### Phase 2: Refactoring Modulaire (3-4h)

**Objectif:** Réorganiser sans changer fonctionnalité

**Actions:**
1. Créer `src/shared/`
2. Migrer code actuel vers `src/modules/level-4-sha256/`
3. Créer `src/core/` (Router)
4. Tous les tests restent verts

**Livrables:**
- ✅ Architecture modulaire
- ✅ Aucune régression
- ✅ Prêt pour niveaux 1-3

---

### Phase 3: Niveau 1 - Introduction (3-4h)

**Objectif:** Page d'intro + outil interactif hash + contexte Bitcoin

**Contenu pédagogique:**
- Qu'est-ce qu'un hash ?
- Propriétés : déterministe, avalanche, irréversible
- Bitcoin : hash des blocs, transactions, mining (0s au début)

**Composants:**

1. **`IntroductionPage.tsx`**
   - Texte explicatif
   - Exemples concrets

2. **`InteractiveHashTool.tsx`**
   - Input : message
   - Output : hash (simple, pas encore SHA-256)
   - Montrer : même entrée = même résultat
   - Montrer : 1 caractère changé = hash complètement différent

3. **`BitcoinExamples.tsx`**
   - Exemples visuels :
     - Hash de bloc Bitcoin
     - Hash de transaction
     - Mining : chercher hash avec X zéros au début

**Tests:**
```typescript
describe('InteractiveHashTool', () => {
  test('hashes message and displays result', () => {
    render(<InteractiveHashTool />);
    const input = screen.getByPlaceholderText(/entrez un message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(screen.getByText(/hash:/i)).toBeInTheDocument();
  });

  test('same message produces same hash', () => {
    // ...
  });

  test('different message produces different hash', () => {
    // ...
  });
});
```

**Post-Mortem:** `docs/POST_MORTEM_LEVEL1.md` (format libre, écrit par assistant après feedback utilisateur)

**Livrables:**
- ✅ Niveau 1 fonctionnel
- ✅ Tests coverage > 80%
- ✅ Post-mortem documenté

---

### Phase 4: Niveau 2 - Simple-hash + Attaques (5-6h)

**Objectif:** Simulation cartes 3D + démo attaques

**Structure:**
- **2.1:** Algorithme simple-hash fonctionnel (user contrôle)
- **2.2:** Démonstration vecteurs d'attaque

#### 2.1: Simple-hash Interactif

**Composants:**

1. **`CardDeck3D.tsx`** (shared component)
   - Simulation 3D légère (CSS 3D transforms ou Three.js si nécessaire)
   - Animations fluides
   - 52 cartes visuelles

2. **`SimpleHashDemo.tsx`**
   - **User choisit les cartes d'entrée** (ex: 8 cartes)
   - Bouton "Hash" → Lance N rounds de manipulations
   - **Manipulations visibles** : inversions, rotations, décalages
   - Résultat : 8 cartes de sortie (le "hash")
   - **Montrer déterminisme** : mêmes cartes = même résultat

**Algorithme Simple:**
```typescript
interface SimpleHashConfig {
  rounds: number; // Ex: 16
}

class SimpleHashEngine {
  hash(deck: Card[], config: SimpleHashConfig): Card[] {
    let state = [...deck];
    
    for (let i = 0; i < config.rounds; i++) {
      // Manipulation 1: Inverser moitié
      state = this.reverseHalf(state);
      
      // Manipulation 2: Rotation circulaire
      state = this.rotate(state, 7);
      
      // Manipulation 3: Alterner paires
      state = this.alternatePairs(state);
    }
    
    return state.slice(0, 8); // 8 cartes = le hash
  }
}
```

#### 2.2: Vecteurs d'Attaque

**Composants:**

1. **`AttackVectors.tsx`**

**Attaque 1: Traçabilité**
   - Outil "Suivre une carte"
   - User sélectionne "As de Cœur"
   - Animation : montrer où cette carte finit après N rounds
   - **Résultat** : Position prévisible (ex: toujours position 3)
   - **Message** : "On peut prédire où finit chaque carte sans tout calculer !"

**Attaque 2: Collision**
   - Outil "Trouver collision"
   - Algorithme cherche 2 decks différents avec même hash
   - **Compteur de tentatives** (< 1000)
   - **Afficher les 2 decks** : différents mais même hash !
   - **Message** : "On peut trouver des collisions facilement !"

**Transition:**
> "Ces attaques sont possibles parce qu'on ne mélange pas assez les cartes avant de commencer. Voyons comment SHA-256 règle ça avec des 'cartes magiques'..."

**Tests:**
```typescript
describe('AttackVectors - Traçabilité', () => {
  test('can trace card position through rounds', () => {
    const analyzer = new PatternAnalyzer();
    const mapping = analyzer.analyzePositions(16);
    
    expect(mapping.get(0)).toBe(2); // Position 0 → 2 toujours
  });
});

describe('AttackVectors - Collision', () => {
  test('finds collision in < 1000 attempts', () => {
    const attacker = new CollisionFinder();
    const result = attacker.findCollision();
    
    expect(result.attempts).toBeLessThan(1000);
    expect(result.deck1).not.toEqual(result.deck2);
    expect(simpleHash(result.deck1)).toEqual(simpleHash(result.deck2));
  });
});
```

**Post-Mortem:** `docs/POST_MORTEM_LEVEL2.md`

**Livrables:**
- ✅ Niveau 2.1 (simple-hash) fonctionnel
- ✅ Niveau 2.2 (attaques) convaincant
- ✅ Cartes 3D performantes
- ✅ Post-mortem documenté

---

### Phase 5: Niveau 3 - Hash-prep (4-5h)

**Objectif:** Montrer l'expansion (cartes magiques) et prouver que ça règle les attaques

**Composants:**

1. **`CardExpansion.tsx`**
   - **Départ** : Deck de 16 cartes (message)
   - **Action** : Ajouter deck de "cartes magiques" (constantes K[])
   - **Processus** : Pré-mélange mathématique
     - Cartes 17-64 = mix(carte 14, carte 9, carte 1, carte 0) + carte magique
     - Animation visuelle du mélange
   - **Résultat** : 64 cartes "contaminées"

2. **`HashWithPrepDemo.tsx`**
   - Utiliser les 64 cartes contaminées
   - Même algorithme de rounds que niveau 2
   - Résultat : 8 cartes finales

3. **`AttackProof.tsx`**
   - **Refaire l'attaque de traçabilité** du niveau 2.2
   - Montrer : **Impossible** de tracer une carte maintenant
   - **Refaire l'attaque de collision**
   - Montrer : **Impossible** de trouver collision (compteur à 1M+ tentatives, abandon)
   - **Message** : "Les cartes magiques rendent le hash sûr !"

**Transition:**
> "Ce principe d'expansion + rounds, c'est exactement SHA-256. Voyons l'implémentation complète..."

**Tests:**
```typescript
describe('CardExpansion', () => {
  test('expands 16 cards to 64 cards', () => {
    const expanded = expandDeck(originalDeck);
    expect(expanded).toHaveLength(64);
  });

  test('expanded cards depend on multiple original cards', () => {
    const expanded = expandDeck(originalDeck);
    // Vérifier que carte 16 dépend de cartes 0,1,9,14
    // ...
  });
});

describe('AttackProof', () => {
  test('tracing attack fails with expansion', () => {
    const analyzer = new PatternAnalyzer();
    const result = analyzer.tryTracingWithExpansion();
    expect(result.success).toBe(false);
  });

  test('collision attack fails with expansion', () => {
    const attacker = new CollisionFinder();
    const result = attacker.tryCollisionWithExpansion({ maxAttempts: 10000 });
    expect(result.found).toBe(false);
  });
});
```

**Post-Mortem:** `docs/POST_MORTEM_LEVEL3.md`

**Livrables:**
- ✅ Niveau 3 fonctionnel
- ✅ Preuve visuelle que attaques réglées
- ✅ Post-mortem documenté

---

### Phase 6: Niveau 4 - SHA-256 (2-3h)

**Objectif:** Migrer le code actuel (déjà testé en Phase 1)

**Actions:**
1. Code déjà dans `src/modules/level-4-sha256/`
2. Ajuster imports/exports
3. Intégrer avec navigation
4. Vérifier tous tests verts

**Post-Mortem:** `docs/POST_MORTEM_LEVEL4.md` (probablement court, code déjà mature)

**Livrables:**
- ✅ Niveau 4 intégré
- ✅ Navigation fonctionnelle
- ✅ Post-mortem documenté

---

### Phase 7: Niveau 5 - Multi-bloc (3-4h)

**Objectif:** Gestion messages > 512 bits + padding

**Composants:**

1. **`MultiBlockEngine.ts`**
   - Découpage en blocs de 512 bits
   - Padding correct
   - Chaînage avec H intermédiaires

2. **`MultiBlockVisualization.tsx`**
   - Diagramme : Bloc 1 → H1 → Bloc 2 → H2 → ...
   - Animation du chaînage
   - Affichage H intermédiaires

**Tests:**
```typescript
describe('MultiBlockEngine', () => {
  test('handles message exactly 512 bits', () => {
    const blocks = engine.splitIntoBlocks('A'.repeat(64));
    expect(blocks).toHaveLength(1);
  });

  test('handles message > 512 bits', () => {
    const blocks = engine.splitIntoBlocks('A'.repeat(100));
    expect(blocks.length).toBeGreaterThan(1);
  });

  test('chains blocks correctly', () => {
    const hash = engine.hashMultiBlock('A'.repeat(100));
    expect(hash.intermediateH).toBeDefined();
  });
});
```

**Post-Mortem:** `docs/POST_MORTEM_LEVEL5.md`

**Livrables:**
- ✅ Niveau 5 fonctionnel
- ✅ Multi-blocs géré correctement
- ✅ Post-mortem documenté

---

### Phase 8: Niveau 6 - Conclusion (2-3h)

**Objectif:** Montrer usages réels SHA-256 + ressources

**Contenu:**

1. **Références Monde Réel**
   - Bitcoin (détails techniques)
   - Certificats SSL/TLS
   - Git (commit hashes)
   - Password hashing (avec salt)
   - Blockchain en général
   - Signatures numériques

2. **Ressources Additionnelles**
   - Liens vers specs officielles
   - Outils en ligne
   - Lectures recommandées

3. **Google Form Feedback** 🆕
   - Intégré dans la page
   - Questions :
     - Clarté de chaque niveau (1-5)
     - Temps passé
     - Niveau préféré / moins aimé
     - Suggestions
     - Connaissances Bitcoin (avant/après)

**Post-Mortem:** `docs/POST_MORTEM_LEVEL6.md`

**Livrables:**
- ✅ Niveau 6 complet
- ✅ Form feedback intégré
- ✅ Formation complète (6 niveaux)
- ✅ Post-mortem documenté

---

### Phase 9: Beta Testing (2-4 semaines) 🆕

**Objectif:** Recueillir feedbacks de 8-10 testeurs

**Profil Testeurs:**
- **5-7 personnes** : Connaissent Bitcoin (technique à non-technique)
- **2-3 personnes** : Ne connaissent PAS Bitcoin

**Feedback:**
- **Google Form** en fin de cours (intégré Phase 8)
- **Observations informelles** (si possible)

**Métriques à tracker (optionnel):**
- Temps moyen par niveau
- Taux d'abandon (niveau où les gens arrêtent)
- Satisfaction par niveau

**Livrables:**
- ✅ 8-10 feedbacks recueillis
- ✅ Patterns identifiés (points forts/faibles)

---

### Phase 10: Planification Corrections (2-3h) 🆕

**Objectif:** Analyser feedbacks et prioriser ajustements

**Actions:**

1. **Regrouper feedbacks par thème**
   - Bugs techniques
   - Clarté pédagogique
   - UX/UI
   - Performance

2. **Prioriser (MoSCoW)**
   - **Must have** : Bugs critiques, incompréhensions majeures
   - **Should have** : Améliorations UX importantes
   - **Could have** : Nice to have
   - **Won't have** : Out of scope

3. **Créer plan d'action**
   - Liste de tâches priorisées
   - Estimation temps
   - Ordre d'implémentation

**Livrables:**
- ✅ Feedbacks analysés
- ✅ Plan d'action clair
- ✅ Priorisation validée

---

### Phase 11: Mise en Service Corrections (Variable) 🆕

**Objectif:** Implémenter les ajustements prioritaires

**Approche:**
- TDD (tests d'abord si applicable)
- Post-mortem MCP pour self-feedback
- Validation utilisateur après chaque correction majeure

**Livrables:**
- ✅ Corrections Must Have implémentées
- ✅ Corrections Should Have implémentées (selon temps)
- ✅ Version finale stable

---

## 🧪 Infrastructure Tests - Détails

### Stack

| Outil | Usage |
|-------|-------|
| **Vitest** | Tests unitaires (fonctions, hooks) |
| **React Testing Library** | Tests composants React |
| **Playwright** | Tests E2E (parcours complet) |

### Intégration Dashboard Centralisé

```
Dashboard (9000) ← lit ← test-reports volume ← écrit ← sha-256-formation
```

- Vitest génère JSON dans volume partagé
- Dashboard affiche en temps réel
- MCP permet à l'assistant de lire les résultats

---

## 🛠️ Serveurs MCP

### MCP Test Dashboard (Phase 0.5)

**Tools:**
- `get_test_status()` → Résumé
- `get_failed_tests()` → Détails erreurs
- `get_coverage_report()` → Métriques

**Avantage:** Self-feedback automatique pour l'assistant

---

## 📝 Post-Mortems

**Format:** Libre (écrit par assistant après feedback utilisateur)

**Contenu suggéré:**
- ✅ Ce qui a bien fonctionné
- ⚠️ Difficultés rencontrées (bugs, confusions UX)
- 🔄 Ce qu'on changerait
- 🛠️ Décisions techniques et pourquoi
- 💬 Feedback utilisateur (si tests informels)

**Usage:** Référence pour développer les niveaux suivants (approche Agile)

---

## 📊 Timeline Globale

| Milestone | Durée Cumulée |
|-----------|----------------|
| Infrastructure prête (Phase 0-2) | 6-9h |
| Niveau 1 terminé (Phase 3) | 9-13h |
| Niveau 2 terminé (Phase 4) | 14-19h |
| Niveau 3 terminé (Phase 5) | 18-24h |
| Niveau 4 terminé (Phase 6) | 20-27h |
| Niveau 5 terminé (Phase 7) | 23-31h |
| Niveau 6 terminé (Phase 8) | 25-34h |
| **Beta testing** | +2-4 semaines |
| Corrections (Phase 10-11) | +2-5h |
| **TOTAL** | **30-40h dev + 2-4 sem beta** |

---

## ✅ Critères de Succès

### Technique
- ✅ 6 niveaux fonctionnels
- ✅ Tests coverage > 80%
- ✅ CI/CD complet
- ✅ MCP self-feedback
- ✅ Performance < 3s animations 3D

### Pédagogique
- ✅ Progression logique 1→6
- ✅ Analogie cartes claire et visuelle
- ✅ Démos interactives convaincantes
- ✅ Feedbacks beta positifs

### Maintenabilité
- ✅ Architecture modulaire
- ✅ Tests documentent comportement
- ✅ Post-mortems pour référence
- ✅ Ajout de niveaux simple

---

## 🎯 Prochaine Action

**Commencer Phase 0** → Infrastructure Tests (1-2h)

**Commande:**
```bash
cd /var/docker/bitcoin-formation/sha-256
# L'assistant installera Vitest + configs
```

---

**Créé le:** 30 octobre 2025  
**Version:** 2.0 (6 niveaux + beta testing)  
**Pour:** Assistant Claude (resets de chat)

