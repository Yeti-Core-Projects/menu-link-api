# ⚡ Guide Rapide - Menu Link API

## 🚀 Démarrage Rapide

### En Local

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
npm run dev

# 3. Accéder à la documentation
http://localhost:3000/api-docs
```

### En Production

**Documentation API**: https://menu-link-api.onrender.com/api-docs

---

## 📚 Documentation

### Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `ACCES_LOCAL.md` | Comment accéder à Swagger UI en local |
| `PEUPLER_BD_PRODUCTION.md` | Comment peupler la BD en production |
| `API_ENDPOINTS.md` | Liste de tous les endpoints |
| `DEPLOY_SWAGGER.md` | Instructions de déploiement |
| `QUICK_START.md` | Guide de démarrage complet |

### Swagger UI

- **Local**: http://localhost:3000/api-docs
- **Production**: https://menu-link-api.onrender.com/api-docs

---

## 🗄️ Peupler la Base de Données

### Méthode Simple (Recommandée)

1. Aller sur: https://dashboard.render.com
2. Ouvrir votre service "menu-link-api"
3. Cliquer sur "Shell"
4. Exécuter:
   ```bash
   node src/seeds/seedData.js
   ```

### Données Créées
- ✅ 5 tables avec QR codes
- ✅ 1 menu actif
- ✅ 4 catégories (Entrées, Plats, Desserts, Boissons)
- ✅ 10 plats
- ✅ 1 utilisateur gestionnaire

Voir `PEUPLER_BD_PRODUCTION.md` pour plus de détails.

---

## 🧪 Tester l'API

### Via Swagger UI (Recommandé)
1. Ouvrir: https://menu-link-api.onrender.com/api-docs
2. Cliquer sur un endpoint
3. Cliquer sur "Try it out"
4. Cliquer sur "Execute"

### Via cURL
```bash
# Health check
curl https://menu-link-api.onrender.com/api/health

# Récupérer le menu
curl https://menu-link-api.onrender.com/api/menu
```

### Via Postman
Importer: `postman_collection.json`

---

## 📡 Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Vérifier le statut |
| POST | `/api/sessions` | Créer session (scan QR) |
| GET | `/api/sessions/:id` | Valider session |
| GET | `/api/menu` | Récupérer menu complet |

Voir `API_ENDPOINTS.md` pour la liste complète.

---

## 🔧 Scripts NPM

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement (nodemon)
npm run seed       # Peupler la BD avec données de test
npm test           # Exécuter les tests
npm run test:watch # Tests en mode watch
```

---

## 🌐 URLs Importantes

- **API Production**: https://menu-link-api.onrender.com/api
- **Swagger UI**: https://menu-link-api.onrender.com/api-docs
- **GitHub**: https://github.com/Yeti-Core-Projects/menu-link-api
- **Render Dashboard**: https://dashboard.render.com

---

## 📝 Fichiers à NE PAS Ignorer

Les fichiers `.md` (markdown) sont des fichiers de **documentation** et doivent être versionnés dans Git. Ils aident les développeurs à comprendre l'API.

### Fichiers Ignorés (dans .gitignore)
- ✅ `node_modules/` - Dépendances
- ✅ `.env*` - Variables d'environnement
- ✅ `logs/` - Fichiers de logs
- ✅ `qr_codes/` - QR codes générés
- ✅ `uploads/` - Fichiers uploadés

### Fichiers NON Ignorés (versionnés)
- ✅ `*.md` - Documentation
- ✅ `swagger.yaml` - Spécification API
- ✅ `package.json` - Configuration
- ✅ `src/` - Code source

---

## 🆘 Problèmes Courants

### "Cannot GET /api-docs" en local
```bash
# Installer yamljs
npm install

# Redémarrer le serveur
npm run dev
```

### La BD est vide en production
```bash
# Via Render Shell
node src/seeds/seedData.js
```

### Le serveur ne démarre pas
- Vérifier MONGODB_URI dans les variables d'environnement
- Vérifier que MongoDB Atlas autorise les connexions
- Vérifier les logs Render

---

## 📞 Support

Pour plus d'informations, consulter:
- `README.md` - Vue d'ensemble du projet
- `API_DOCUMENTATION.md` - Documentation détaillée
- `FRONTEND_INTEGRATION.md` - Guide d'intégration
- `POUR_LE_DEV_FRONTEND.md` - Guide en français

---

## ✅ Checklist de Déploiement

- [ ] Code pushé sur GitHub
- [ ] Render a déployé automatiquement
- [ ] Variables d'environnement configurées (MONGODB_URI)
- [ ] BD peuplée avec données de test
- [ ] Swagger UI accessible en ligne
- [ ] Endpoints testés via Swagger UI
- [ ] Documentation partagée avec l'équipe frontend
