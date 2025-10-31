# 📚 Documentation Technique - SHA-256 Formation

## 🎯 À Propos

Ce dossier contient la documentation technique du projet SHA-256 Formation Progressive.

**Audience principale:** L'assistant Claude (pour les resets de chat) et les développeurs futurs.

---

## 📄 Documents Disponibles

### 🆕 **UPDATE_30OCT2025.md** 👈 **LIRE EN PREMIER DEMAIN**

**Pour:** Vous (l'utilisateur)  
**Contenu:** Récapitulatif de TOUS les changements d'aujourd'hui (30 oct)
- 6 niveaux détaillés
- 11 phases
- MCP Test Dashboard
- Beta testing
- Cartes 3D (Option C)
- Post-mortems

**Quand lire:** Demain matin (5 min), pour se remettre dans le contexte

---

### 1. **MIGRATION_PLAN.md** 

**Pour:** L'assistant (+ vous si vous voulez les détails)  
**Contenu:** 
- Plan de migration complet en 11 phases
- Architecture cible détaillée
- Stratégie de tests
- Exemples de code pour chaque phase
- Timeline : 30-40h dev + 2-4 sem beta

**Quand lire:** 
- **Vous:** Si vous voulez voir le plan détaillé phase par phase
- **Assistant:** Lors des resets de chat

---

### 2. **ASSISTANT_CONTEXT.md**

**Pour:** L'assistant (contexte complet)  
**Contenu:**
- Vision du projet (6 niveaux)
- Analogie centrale (jeu de cartes)
- État actuel de l'architecture
- Décisions architecturales et pourquoi
- Pièges à éviter (bugs historiques)
- Commandes fréquentes
- Prochaines tâches (phases 0-11)

**Quand lire:** Au début de CHAQUE reset de chat

---

### 3. **IMPLEMENTATION_SUMMARY.md**

**Pour:** Vous (résumé exécutif)  
**Contenu:** Vue d'ensemble rapide du plan  
**Quand lire:** Si vous voulez un résumé sans trop de détails (5 min)

---

## 🔄 Workflow Reset de Chat

### Situation: Les tokens deviennent trop chers, besoin de reset

**Étapes:**

1. **Créer nouveau chat**
2. **Partager `ASSISTANT_CONTEXT.md`** avec le prompt:
   ```
   Voici le contexte complet du projet SHA-256 Formation. 
   Lis ce document avant de continuer. 
   On en est à [Phase X / Tâche Y].
   ```
3. **L'assistant lit le document** (comprend tout en 30 secondes)
4. **Continuer le développement** exactement où vous étiez

**Gain:** Pas besoin de ré-expliquer l'architecture, les décisions, l'historique, etc.

---

## 📊 État du Projet (Mise à Jour: 30 Oct 2025 - 19h)

### Phase Actuelle
🟡 **Phase 0: Préparation** (Prêt à démarrer demain)

### Modules Complétés
- ✅ **Niveau 4 (SHA-256)** - Code fonctionnel déployé
- ❌ **Niveau 1 (Introduction)** - À créer (Phase 3)
- ❌ **Niveau 2 (Simple-hash)** - À créer (Phase 4)
- ❌ **Niveau 3 (Hash-prep)** - À créer (Phase 5)
- ❌ **Niveau 5 (Multi-Blocs)** - À créer (Phase 7)
- ❌ **Niveau 6 (Conclusion)** - À créer (Phase 8)
- ❌ **Infrastructure Tests** - À implémenter (Phase 0)
- ❌ **MCP Test Dashboard** - À créer (Phase 0.5)

### Coverage Tests
- **Actuel:** 0%
- **Objectif Phase 1:** 70%+ (niveau 4)
- **Objectif Final:** 80%+ (tous niveaux)

### Déploiement
- **Production:** https://bitcoin-formation.github.io/sha-256/
- **CI/CD:** GitHub Actions (déploiement automatique)

### Timeline
- **Développement:** 30-40h (11 phases)
- **Beta testing:** 2-4 semaines (8-10 testeurs)
- **Total:** ~32-45h + beta

---

## 🧪 Tests (À Implémenter)

### Stack Choisie
- **Vitest** - Tests unitaires
- **React Testing Library** - Tests composants
- **Playwright** - Tests E2E

### Structure Tests
```
tests/
├── setup.ts              # Configuration globale
├── unit/                 # Tests unitaires (fonctions pures)
├── components/           # Tests composants React
├── integration/          # Tests de flux complets
└── e2e/                  # Tests end-to-end (Playwright)
```

---

## 🛠️ Serveurs MCP Recommandés

### 1. MCP Testing Dashboard (🔴 Priorité Haute)

**Fonction:** Interroger les résultats de tests en temps réel

**Avantage:** L'assistant peut détecter et corriger les régressions automatiquement

**Référence:** `/var/docker/testing/` (infrastructure existante)

### 2. MCP Git/GitHub (🟡 Priorité Moyenne)

**Fonction:** Automatiser commits, branches, PRs

**Avantage:** Workflow Git plus fluide

### 3. MCP Documentation (🟢 Priorité Basse)

**Fonction:** Générer/mettre à jour docs automatiquement

---

## 📝 Conventions

### Commit Messages
```
feat: ajouter X
fix: corriger Y
refactor: simplifier Z
test: ajouter tests pour W
docs: documenter V
chore: mettre à jour dépendances
```

### Langues
- **Code/Comments:** Anglais
- **Commits/Docs Techniques:** Français
- **Interface Utilisateur:** Bilingue FR/EN (FR prioritaire)
- **README Projet:** Bilingue

### Structure Code
- **Max 50 lignes** par fonction
- **Max 300 lignes** par composant
- **Types TypeScript stricts** (pas de `any`)
- **Props validation** pour tous les composants

---

## 🎓 Analogie Pédagogique Centrale

### 🃏 Le Jeu de Cartes

**Cette analogie guide TOUTE la pédagogie du projet.**

```
SHA-256 = Mélanger un jeu de cartes 64 fois

1. PRÉPARATION (expansion):
   - Paquet original (16 cartes = message)
   - + Cartes magiques (constantes K[])
   - → 64 cartes "contaminées"

2. 64 ROUNDS (compression):
   - 8 piles de cartes (a, b, c, d, e, f, g, h)
   - Chaque round: manipuler + ajouter une carte
   - → 8 cartes finales = le hash

3. POURQUOI C'EST SÛR:
   - Impossible de "tracer" une carte
   - 1 carte changée = tout le paquet différent
```

**Niveaux:**
- **Niveau 1:** Mélange sans cartes magiques → Vulnérable
- **Niveau 2:** Prouver qu'on peut tracer les cartes
- **Niveau 3:** Mélange avec cartes magiques → Sûr
- **Niveau 4:** Plusieurs paquets enchaînés

---

## 🔗 Liens Utiles

- **Repo GitHub:** https://github.com/bitcoin-formation/sha-256
- **Live Demo:** https://bitcoin-formation.github.io/sha-256/
- **Testing Infrastructure:** `/var/docker/testing/`
- **MCP Architecture:** `/var/docker/_infrastructure/docs/MCP_ARCHITECTURE.md`

---

## 📞 Contact

**Mainteneur:** Gilles Auclair  
**Email:** gauclair@sarius.ca  
**Organisation:** Bitcoin Formation

---

## 🔄 Mises à Jour

| Date | Auteur | Changements |
|------|--------|-------------|
| 30 Oct 2025 | Claude (Assistant) | Documentation initiale créée |

---

**Note:** Ces documents doivent être mis à jour après chaque phase majeure ou décision architecturale importante.


