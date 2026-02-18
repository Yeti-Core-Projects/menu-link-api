# Quick Start Guide

## Accès à la Documentation API (Swagger)

La documentation interactive de l'API est accessible via Swagger UI:

### En Production
🌐 **URL**: https://menu-link-api.onrender.com/api-docs

### En Local
🏠 **URL**: http://localhost:3000/api-docs

## Installation et Démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
Créer un fichier `.env` avec:
```
MONGODB_URI=mongodb+srv://arnauld:arnauld@cluster0.3m0gptw.mongodb.net/menu-link
PORT=3000
NODE_ENV=development
```

### 3. Démarrer le serveur
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

### 4. Tester l'API
```bash
# Health check
curl http://localhost:3000/api/health

# Accéder au menu
curl http://localhost:3000/api/menu
```

## Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Vérifier le statut du serveur |
| POST | `/api/sessions` | Créer une session (scan QR) |
| GET | `/api/sessions/:id` | Valider une session |
| GET | `/api/menu` | Récupérer le menu complet |

## Seed Data

Pour peupler la base de données avec des données de test:
```bash
npm run seed
```

Cela créera:
- 5 tables avec QR codes
- 1 menu actif
- 4 catégories (Entrées, Plats, Desserts, Boissons)
- 10 plats

## Documentation Complète

Pour plus de détails, consultez:
- `API_DOCUMENTATION.md` - Documentation détaillée de l'API
- `FRONTEND_INTEGRATION.md` - Guide d'intégration frontend
- `POUR_LE_DEV_FRONTEND.md` - Guide pour les développeurs frontend
- Swagger UI en ligne: https://menu-link-api.onrender.com/api-docs
