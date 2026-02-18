# 🌱 Peupler la BD sans Accès Shell (Plan Gratuit Render)

## ✅ Solution: Endpoint API de Seed

J'ai créé un endpoint `/api/seed` que vous pouvez appeler depuis votre navigateur ou Postman.

---

## 🚀 Méthode 1: Via le Navigateur (Le Plus Simple!)

### Étape 1: Vérifier l'état de la BD
Ouvrir dans le navigateur:
```
https://menu-link-api.onrender.com/api/seed/status
```

Vous verrez:
```json
{
  "success": true,
  "data": {
    "isEmpty": true,
    "counts": {
      "tables": 0,
      "menus": 0,
      "categories": 0,
      "dishes": 0,
      "users": 0
    },
    "message": "Database is empty. Run POST /api/seed to populate."
  }
}
```

### Étape 2: Peupler la BD
Vous ne pouvez pas faire de POST depuis le navigateur directement, donc utilisez **Swagger UI**:

1. Ouvrir: https://menu-link-api.onrender.com/api-docs
2. Chercher la section **"Seed"**
3. Cliquer sur **"POST /api/seed"**
4. Cliquer sur **"Try it out"**
5. Cliquer sur **"Execute"**

Vous verrez:
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "data": {
    "tables": 5,
    "menus": 1,
    "categories": 4,
    "dishes": 10,
    "users": 1,
    "qr_codes": [
      { "table": 1, "qr_code": "table_1_1706256600000" },
      { "table": 2, "qr_code": "table_2_1706256600000" },
      ...
    ]
  }
}
```

### Étape 3: Vérifier que ça a marché
Ouvrir:
```
https://menu-link-api.onrender.com/api/menu
```

Vous devriez voir le menu complet avec catégories et plats!

---

## 🧪 Méthode 2: Via cURL (Terminal)

```bash
# Vérifier l'état
curl https://menu-link-api.onrender.com/api/seed/status

# Peupler la BD
curl -X POST https://menu-link-api.onrender.com/api/seed

# Vérifier le menu
curl https://menu-link-api.onrender.com/api/menu
```

---

## 📮 Méthode 3: Via Postman

### Étape 1: Importer la collection
Importer le fichier `postman_collection.json`

### Étape 2: Ajouter une requête Seed
1. Créer une nouvelle requête
2. Méthode: **POST**
3. URL: `https://menu-link-api.onrender.com/api/seed`
4. Cliquer sur **Send**

### Étape 3: Vérifier
1. Créer une requête GET
2. URL: `https://menu-link-api.onrender.com/api/menu`
3. Cliquer sur **Send**

---

## 🔄 Méthode 4: Script Local vers Production

Si vous préférez utiliser le script existant depuis votre machine:

```bash
# Windows
cd backend
set MONGODB_URI=mongodb+srv://arnauld:arnauld@cluster0.3m0gptw.mongodb.net/menu-link
node src/seeds/seedData.js

# Linux/Mac
cd backend
MONGODB_URI=mongodb+srv://arnauld:arnauld@cluster0.3m0gptw.mongodb.net/menu-link node src/seeds/seedData.js
```

⚠️ **Attention**: Cela se connecte à la BD de production depuis votre machine locale.

---

## 📊 Données Créées

L'endpoint `/api/seed` crée:

### ✅ 5 Tables
- Table 1, 2, 3, 4, 5 avec QR codes uniques

### ✅ 1 Menu
- Menu Principal (actif)

### ✅ 4 Catégories
1. Entrées
2. Plats Principaux
3. Desserts
4. Boissons

### ✅ 10 Plats
**Entrées:**
- Salade César (8.99€)
- Soupe à l'oignon (7.99€)

**Plats Principaux:**
- Steak Frites (18.99€)
- Poulet Rôti (15.99€)
- Pâtes Carbonara (12.99€)

**Desserts:**
- Tiramisu (6.99€)
- Crème Brûlée (7.99€)

**Boissons:**
- Coca Cola (2.99€)
- Jus d'Orange (3.99€)
- Vin Rouge (5.99€)

### ✅ 1 Utilisateur
- Admin Gestionnaire (role: GESTIONNAIRE)

---

## ⚠️ Important: Sécurité

L'endpoint `/api/seed` est **PUBLIC** pour faciliter le setup initial.

### Pour sécuriser en production:

**Option 1: Ajouter un token secret**
```javascript
// Dans src/routes/seed.js
router.post('/', async (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  // ... reste du code
});
```

**Option 2: Désactiver après le premier seed**
```javascript
// Dans src/routes/seed.js
router.post('/', async (req, res) => {
  if (process.env.SEED_DISABLED === 'true') {
    return res.status(403).json({ error: 'Seed endpoint is disabled' });
  }
  // ... reste du code
});
```

**Option 3: Supprimer la route après usage**
Commenter la ligne dans `src/index.js`:
```javascript
// app.use('/api/seed', seedRoutes);
```

---

## 🔍 Vérifier que Tout Fonctionne

### 1. Vérifier l'état de la BD
```
GET https://menu-link-api.onrender.com/api/seed/status
```

### 2. Peupler la BD
```
POST https://menu-link-api.onrender.com/api/seed
```

### 3. Récupérer le menu
```
GET https://menu-link-api.onrender.com/api/menu
```

### 4. Tester via Swagger UI
```
https://menu-link-api.onrender.com/api-docs
```

---

## 🆘 Dépannage

### Erreur 500: "Failed to seed database"
- Vérifier que MONGODB_URI est correct dans Render
- Vérifier que MongoDB Atlas autorise les connexions (IP: 0.0.0.0/0)
- Vérifier les logs Render

### La BD reste vide
- Vérifier la réponse de POST /api/seed
- Vérifier GET /api/seed/status
- Tester GET /api/menu

### Erreur de connexion MongoDB
- Vérifier que le mot de passe MongoDB est correct
- Vérifier que l'IP de Render est autorisée dans MongoDB Atlas
- Aller dans MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

## 📝 Résumé

**Le plus simple:**
1. Ouvrir: https://menu-link-api.onrender.com/api-docs
2. Chercher "POST /api/seed"
3. Cliquer "Try it out" → "Execute"
4. Vérifier: https://menu-link-api.onrender.com/api/menu

✅ Pas besoin d'accès Shell!
✅ Fonctionne avec le plan gratuit Render!
✅ Peut être fait depuis n'importe où!
