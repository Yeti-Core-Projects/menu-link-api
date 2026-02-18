# Documentation API - Menu Link

## 📚 Formats disponibles

La documentation de l'API est disponible en plusieurs formats :

### 1. **Swagger/OpenAPI** (Recommandé pour les devs frontend)
- **YAML** : `swagger.yaml`
- **JSON** : `swagger.json`

### 2. **Markdown**
- **Guide complet** : `API_ENDPOINTS.md`
- **Quick Start** : `QUICK_START.md`

---

## 🚀 Utiliser la documentation Swagger

### Option 1 : Swagger Editor (En ligne)
1. Allez sur https://editor.swagger.io
2. Cliquez sur "File" → "Import URL"
3. Collez l'URL : `https://raw.githubusercontent.com/Yeti-Core-Projects/menu-link-api/main/swagger.yaml`
4. Explorez la documentation interactive

### Option 2 : Swagger UI (Local)
```bash
# Installer swagger-ui-express
npm install swagger-ui-express

# L'API expose automatiquement la doc sur /api-docs
```

### Option 3 : Postman
1. Ouvrez Postman
2. Cliquez sur "Import"
3. Sélectionnez `swagger.json` ou `swagger.yaml`
4. Tous les endpoints seront importés automatiquement

### Option 4 : VS Code
1. Installez l'extension "OpenAPI (Swagger) Editor"
2. Ouvrez `swagger.yaml`
3. Prévisualisez avec `Ctrl+Shift+P` → "OpenAPI: Preview"

---

## 📋 Résumé des Endpoints

### Health Check
```
GET /api/health
```
Vérifie si le serveur est en ligne.

### Sessions (QR Code)
```
POST   /api/sessions              # Créer une session (scan QR)
GET    /api/sessions/:session_id  # Valider une session
DELETE /api/sessions/:session_id  # Terminer une session
```

### Menu
```
GET    /api/menu                  # Obtenir le menu complet
GET    /api/menus/:id             # Obtenir un menu spécifique
POST   /api/menus                 # Créer un menu
PUT    /api/menus/:id             # Mettre à jour un menu
DELETE /api/menus/:id             # Supprimer un menu
```

---

## 🔗 URLs

### Production
```
Base URL: https://menu-link-api.onrender.com/api
Swagger UI: https://menu-link-api.onrender.com/api-docs (à venir)
```

### Development
```
Base URL: http://localhost:3000/api
Swagger UI: http://localhost:3000/api-docs (à venir)
```

---

## 📝 Exemples d'utilisation

### 1. Créer une session (Scan QR)
```bash
curl -X POST https://menu-link-api.onrender.com/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "table_1_1706256600000"}'
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "table_id": "507f1f77bcf86cd799439011",
    "started_at": "2024-01-26T10:30:00.000Z"
  },
  "message": "Session created successfully"
}
```

### 2. Obtenir le menu
```bash
curl https://menu-link-api.onrender.com/api/menu
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "nom": "Entrées",
        "ordre_affichage": 0,
        "dishes": [
          {
            "_id": "507f1f77bcf86cd799439012",
            "nom": "Salade César",
            "description": "Salade fraîche avec croutons",
            "prix": 8.99,
            "disponible": true,
            "image_url": null
          }
        ]
      }
    ],
    "totalDishes": 10
  },
  "message": "Menu retrieved successfully"
}
```

---

## 🎨 Modèles de données

### Session
```typescript
interface Session {
  session_id: string;      // UUID
  table_id: string;        // MongoDB ObjectId
  started_at: string;      // ISO 8601 date
}
```

### Category
```typescript
interface Category {
  _id: string;             // MongoDB ObjectId
  nom: string;
  ordre_affichage: number;
  dishes: Dish[];
}
```

### Dish
```typescript
interface Dish {
  _id: string;             // MongoDB ObjectId
  nom: string;
  description: string;
  prix: number;
  disponible: boolean;
  image_url: string | null;
}
```

### Menu
```typescript
interface Menu {
  _id: string;             // MongoDB ObjectId
  nom: string;
  actif: boolean;
  gestionnaire_id: string; // MongoDB ObjectId
  createdAt: string;       // ISO 8601 date
  updatedAt: string;       // ISO 8601 date
}
```

---

## ⚠️ Codes d'erreur

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `MISSING_QR_CODE` | 400 | QR code manquant dans la requête |
| `MISSING_FIELDS` | 400 | Champs requis manquants |
| `INVALID_SESSION` | 401 | Session invalide ou expirée |
| `NOT_FOUND` | 404 | Ressource non trouvée |
| `INTERNAL_SERVER_ERROR` | 500 | Erreur serveur |

---

## 📦 Format des réponses

### Succès
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### Erreur
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

---

## 🔐 Authentification

Actuellement, l'API ne nécessite pas d'authentification pour les endpoints publics (menu, sessions).

Les endpoints d'administration (création de menu, etc.) nécessiteront une authentification dans les versions futures.

---

## 📞 Support

Pour toute question sur l'API :
- **GitHub** : https://github.com/Yeti-Core-Projects/menu-link-api
- **Issues** : https://github.com/Yeti-Core-Projects/menu-link-api/issues

---

## 📄 Fichiers de documentation

- `swagger.yaml` - Spécification OpenAPI 3.0 (YAML)
- `swagger.json` - Spécification OpenAPI 3.0 (JSON)
- `API_ENDPOINTS.md` - Documentation détaillée en Markdown
- `QUICK_START.md` - Guide de démarrage rapide
- `README.md` - Vue d'ensemble du projet
