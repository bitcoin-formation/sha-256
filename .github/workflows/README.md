# 🔄 GitHub Actions Workflows

## 📋 Vue d'ensemble

Ce projet utilise **2 workflows GitHub Actions** pour assurer la qualité du code et le déploiement automatique.

---

## 🧪 Workflow: Tests (`test.yml`)

### Déclencheurs
- ✅ Tous les `push` sur **toutes les branches**
- ✅ Toutes les **Pull Requests**

### Ce qu'il fait
1. **Install** des dépendances npm
2. **Run** les tests unitaires (Vitest)
3. **Génère** le rapport de couverture de code
4. **Upload** les artifacts (coverage report)
5. **Commente** la couverture sur les PR (si applicable)

### Objectifs
- 🎯 **70%+ de couverture** sur lines, functions, branches, statements
- ✅ **Tests passent** avant tout merge
- 📊 **Visibilité** des tests sur chaque PR

### Artifacts disponibles
- `coverage-report/` : Rapport HTML de couverture (30 jours)
- (Futur) `playwright-report/` : Rapport E2E (30 jours)

---

## 🚀 Workflow: Deploy (`deploy.yml`)

### Déclencheurs
- ✅ Push sur la branche `main`
- ✅ Déclenchement manuel (`workflow_dispatch`)

### Ce qu'il fait
1. **Job 1: Test** 🧪
   - Exécute les tests unitaires
   - Génère la couverture de code
   - ❌ Si les tests échouent → **Déploiement annulé**

2. **Job 2: Build** 🔨 (seulement si tests passent)
   - Install des dépendances
   - Build de production (`npm run build`)
   - Ajout du fichier `.nojekyll` (pour GitHub Pages)
   - Upload de l'artifact de build

3. **Job 3: Deploy** 🌐 (seulement si build réussit)
   - Déploie sur GitHub Pages
   - URL: https://bitcoin-formation.github.io/sha-256/

### Dépendances
```
test → build → deploy
  ❌      ⏸️      ⏸️
  ✅   →  🔨  →  🌐
```

---

## 📊 Visualisation dans GitHub

### Sur un Push (toutes les branches)
```
Commits → Actions Tab → test.yml (✅ ou ❌)
```

### Sur une Pull Request
```
PR → Checks Tab → test.yml (✅ ou ❌)
                → Commentaire avec couverture
```

### Sur Main (après merge)
```
Main → Actions Tab → deploy.yml
                   ├─ test (✅)
                   ├─ build (🔨)
                   └─ deploy (🌐)
                   
GitHub Pages → Mise à jour automatique
```

---

## 🔧 Configuration Locale

### Exécuter les tests localement
```bash
# Tests unitaires (mode watch)
npm test

# Tests unitaires (run once)
npm run test:run

# Tests avec UI interactive
npm run test:ui

# Tests avec couverture
npm run test:coverage

# Tests E2E (quand disponibles)
npm run test:e2e
```

### Voir la couverture
```bash
npm run test:coverage
# Ouvre coverage/index.html dans un navigateur
```

---

## 📝 Bonnes Pratiques

### Avant de Commit
```bash
# 1. Exécuter les tests localement
npm run test:run

# 2. Vérifier la couverture
npm run test:coverage

# 3. Build local
npm run build
```

### Avant de Merger une PR
- ✅ Vérifier que le workflow `test.yml` est vert
- ✅ Vérifier que la couverture est acceptable (70%+)
- ✅ Review le code
- ✅ Tester manuellement si nécessaire

### Sur Main
- ⚠️ Ne jamais push directement sur main sans tests
- ✅ Toujours passer par une PR
- ✅ Attendre que le déploiement se termine avant de tester

---

## 🐛 Debugging des Workflows

### Si les tests échouent en CI mais passent localement
1. Vérifier les versions de Node.js (20.x)
2. Vérifier que `package-lock.json` est à jour
3. Regarder les logs détaillés dans Actions Tab

### Si le build échoue
1. Vérifier les erreurs TypeScript: `npm run build`
2. Vérifier les erreurs de linting: `npm run lint`

### Si le déploiement échoue
1. Vérifier les permissions dans Settings → Pages
2. Vérifier que le workflow `deploy.yml` a les permissions `pages: write`
3. Vérifier le fichier `.nojekyll` dans `dist/`

---

## 🔮 Futur

### Tests E2E (Playwright)
Actuellement commentés dans `test.yml`, à activer quand prêt :
```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e
```

### Badges de Status
Ajouter dans le README principal :
```markdown
![Tests](https://github.com/bitcoin-formation/sha-256/actions/workflows/test.yml/badge.svg)
![Deploy](https://github.com/bitcoin-formation/sha-256/actions/workflows/deploy.yml/badge.svg)
```

---

## 📞 Questions ?

Si tu as des questions sur les workflows GitHub Actions, consulte :
- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

**Créé le :** 31 octobre 2025  
**Dernière mise à jour :** 31 octobre 2025

