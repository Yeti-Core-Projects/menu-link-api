# 📡 API Endpoints - Menu Link

## 🌐 Base URLs

- **Production**: `https://menu-link-api.onrender.com/api`
- **Local**: `http://localhost:3000/api`

## 📚 Documentation Interactive

**Swagger UI**: https://menu-link-api.onrender.com/api-docs

---

## Endpoints Disponibles

### 🏥 Health Check

#### GET /health
Vérifie si le serveur est en ligne.

**Réponse 200:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-26T10:30:00.000Z"
}
```

---

### 🎫 Sessions (QR Code)

#### POST /sessions
Crée une session client après le scan d'un QR code.

**Body:**
```json
{
  "qr_code": "table_1_1706256600000"
}
```

**Réponse 201:**
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

**Erreurs:**
- `400` - QR code manquant
- `404` - QR code invalide ou table inactive

---

#### GET /sessions/:session_id
Valide une session existante.

**Réponse 200:**
```json
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "table_id": "507f1f77bcf86cd799439011",
    "table_number": 1,
    "started_at": "2024-01-26T10:30:00.000Z"
  },
  "message": "Session is valid"
}
```

**Erreurs:**
- `401` - Session invalide ou expirée

---

#### DELETE /sessions/:session_id
Termine une session client.

**Réponse 200:**
```json
{
  "success": true,
  "message": "Session ended successfully"
}
```

**Erreurs:**
- `404` - Session non trouvée

---

### 🍽️ Menu

#### GET /menu
Récupère le menu complet avec toutes les catégories et plats.

**Réponse 200 (avec données):**
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

**Réponse 200 (vide):**
```json
{
  "success": true,
  "data": {
    "categories": [],
    "totalDishes": 0
  },
  "message": "Menu retrieved successfully"
}
```

---

#### POST /menus
Crée un nouveau menu.

**Body:**
```json
{
  "nom": "Menu du Jour",
  "gestionnaire_id": "507f1f77bcf86cd799439010"
}
```

**Réponse 201:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Menu du Jour",
    "actif": true,
    "gestionnaire_id": "507f1f77bcf86cd799439010",
    "createdAt": "2024-01-26T10:30:00.000Z",
    "updatedAt": "2024-01-26T10:30:00.000Z"
  },
  "message": "Menu created successfully"
}
```

**Erreurs:**
- `400` - Champs requis manquants

---

#### GET /menus/:id
Récupère un menu spécifique.

**Réponse 200:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Menu Principal",
    "actif": true,
    "gestionnaire_id": "507f1f77bcf86cd799439010",
    "createdAt": "2024-01-26T10:30:00.000Z",
    "updatedAt": "2024-01-26T10:30:00.000Z"
  }
}
```

**Erreurs:**
- `404` - Menu non trouvé

---

#### PUT /menus/:id
Met à jour un menu existant.

**Body:**
```json
{
  "nom": "Menu Spécial",
  "actif": false
}
```

**Réponse 200:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nom": "Menu Spécial",
    "actif": false,
    "gestionnaire_id": "507f1f77bcf86cd799439010",
    "createdAt": "2024-01-26T10:30:00.000Z",
    "updatedAt": "2024-01-26T10:35:00.000Z"
  },
  "message": "Menu updated successfully"
}
```

---

#### DELETE /menus/:id
Supprime un menu.

**Réponse 200:**
```json
{
  "success": true,
  "message": "Menu deleted successfully"
}
```

---

## 🔧 Format des Erreurs

Toutes les erreurs suivent ce format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur",
    "details": {}
  }
}
```

### Codes d'Erreur Communs

| Code | Description |
|------|-------------|
| `MISSING_QR_CODE` | QR code manquant dans la requête |
| `INVALID_SESSION` | Session invalide ou expirée |
| `NOT_FOUND` | Ressource non trouvée |
| `VALIDATION_ERROR` | Erreur de validation des données |
| `DATABASE_ERROR` | Erreur de base de données |

---

## 🧪 Tester l'API

### Avec cURL

```bash
# Health check
curl https://menu-link-api.onrender.com/api/health

# Récupérer le menu
curl https://menu-link-api.onrender.com/api/menu

# Créer une session
curl -X POST https://menu-link-api.onrender.com/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "table_1_1706256600000"}'
```

### Avec Postman

Importer la collection: `postman_collection.json`

### Avec Swagger UI

Accéder à: https://menu-link-api.onrender.com/api-docs

---

## 📝 Notes

- Tous les endpoints retournent du JSON
- Les timestamps sont au format ISO 8601
- Les IDs MongoDB sont des ObjectId (24 caractères hexadécimaux)
- Les UUIDs de session sont au format UUID v4

---

## 🔗 Liens Utiles

- **Swagger UI**: https://menu-link-api.onrender.com/api-docs
- **GitHub**: https://github.com/Yeti-Core-Projects/menu-link-api
- **Guide Frontend**: `FRONTEND_INTEGRATION.md`
- **Guide Français**: `POUR_LE_DEV_FRONTEND.md`
