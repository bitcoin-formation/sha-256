# 📊 Test Reports - Volume Partagé

## 🎯 Objectif

Ce dossier est monté sur un **volume Docker partagé** (`test-reports`) qui permet de :

1. **Centraliser** tous les rapports de tests de différents projets
2. **Accéder** aux résultats depuis un dashboard centralisé
3. **Persister** les rapports entre les redémarrages de containers
4. **Partager** les résultats avec des outils externes (MCP, CI/CD, etc.)

---

## 📁 Structure

```
test-reports/
├── sha256-test-results.json          # Résultats tests unitaires Vitest
├── sha256-playwright-results.json    # Résultats tests E2E Playwright
└── sha256-coverage-summary.json      # Résumé couverture de code (copié)
```

---

## 🔧 Configuration

### Docker Compose

```yaml
volumes:
  - test-reports:/app/test-reports

volumes:
  test-reports:
    external: true
```

### Vitest (vitest.config.ts)

```typescript
outputFile: {
  json: './test-reports/sha256-test-results.json',
}
```

### Playwright (playwright.config.ts)

```typescript
reporter: [
  ['json', { outputFile: 'test-reports/sha256-playwright-results.json' }],
]
```

---

## 🚀 Usage

### Voir le Volume

```bash
docker volume ls | grep test-reports
docker volume inspect test-reports
```

### Accéder aux Rapports

```bash
# Depuis l'hôte Docker
docker run --rm -v test-reports:/data alpine ls -la /data

# Depuis le container
docker compose exec sha256 ls -la /app/test-reports
docker compose exec sha256 cat /app/test-reports/sha256-test-results.json
```

### Copier les Rapports Localement

```bash
# Copier un fichier
docker cp sha-256-sha256-1:/app/test-reports/sha256-test-results.json ./local-reports/

# Ou monter le volume sur un container temporaire
docker run --rm -v test-reports:/data -v $(pwd):/backup alpine cp -r /data/* /backup/
```

---

## 📈 MCP Test Dashboard (Phase 0.5)

Ce volume sera utilisé par le **MCP Test Dashboard Server** pour :

- Lire les résultats en temps réel
- Générer des statistiques globales
- Afficher les tendances de couverture
- Notifier les échecs de tests

**Configuration MCP :**
```python
TEST_REPORTS_PATH = "/test-reports"
```

---

## 🗑️ Nettoyage

```bash
# Supprimer tous les rapports
docker run --rm -v test-reports:/data alpine rm -rf /data/*

# Supprimer le volume (⚠️ perte de toutes les données)
docker volume rm test-reports
```

---

## 📝 Notes

- **Persistance :** Les données survivent aux redémarrages de containers
- **Partage :** Accessible par tous les containers qui le montent
- **Performance :** Volume natif Docker (performant)
- **Backup :** Pas de backup automatique (à configurer si nécessaire)

---

**Créé le :** 31 octobre 2025  
**Projet :** SHA-256 Visualizer - Bitcoin Formation  
**Phase :** 0 - Infrastructure Tests

