# 🗄️ Peupler la Base de Données en Production

## Méthode 1: Via Render Shell (Recommandé)

### Étapes:

1. **Aller sur le Dashboard Render**
   - Ouvrir: https://dashboard.render.com
   - Cliquer sur votre service "menu-link-api"

2. **Ouvrir le Shell**
   - Cliquer sur l'onglet "Shell" en haut
   - Un terminal s'ouvrira dans votre conteneur de production

3. **Exécuter le script de seed**
   ```bash
   node src/seeds/seedData.js
   ```

4. **Vérifier les logs**
   Vous verrez:
   ```
   Connected to MongoDB
   Cleared existing data
   Created gestionnaire user
   Created 5 tables
   Created menu
   Created 4 categories
   Created 10 dishes
   Database seeded successfully!
   ```

5. **Tester l'API**
   ```bash
   curl https://menu-link-api.onrender.com/api/menu
   ```

---

## Méthode 2: Via MongoDB Compass (Interface Graphique)

### Étapes:

1. **Ouvrir MongoDB Compass**

2. **Se connecter à MongoDB Atlas**
   ```
   mongodb+srv://arnauld:arnauld@cluster0.3m0gptw.mongodb.net/menu-link
   ```

3. **Créer les collections manuellement**
   - Cliquer sur "Create Database"
   - Nom: `menu-link`
   - Collections: `tables`, `menus`, `categories`, `dishes`, `users`

4. **Importer les données**
   - Pour chaque collection, cliquer sur "Add Data" → "Insert Document"
   - Copier les données depuis les exemples ci-dessous

---

## Méthode 3: Script Local vers Production

### Étapes:

1. **Créer un fichier `.env.production` localement**
   ```bash
   MONGODB_URI=mongodb+srv://arnauld:arnauld@cluster0.3m0gptw.mongodb.net/menu-link
   NODE_ENV=production
   ```

2. **Exécuter le seed en local vers la BD de production**
   ```bash
   # Windows
   set NODE_ENV=production
   node src/seeds/seedData.js

   # Linux/Mac
   NODE_ENV=production node src/seeds/seedData.js
   ```

⚠️ **Attention**: Cette méthode se connecte à la BD de production depuis votre machine locale.

---

## Méthode 4: Via API REST (Pour mise à jour partielle)

Si vous voulez juste ajouter des données sans tout effacer:

### 1. Créer un menu
```bash
curl -X POST https://menu-link-api.onrender.com/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Menu Principal",
    "gestionnaire_id": "507f1f77bcf86cd799439010"
  }'
```

### 2. Créer des catégories
```bash
curl -X POST https://menu-link-api.onrender.com/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "menu_id": "MENU_ID_FROM_STEP_1",
    "nom": "Entrées",
    "ordre_affichage": 0
  }'
```

### 3. Créer des plats
```bash
curl -X POST https://menu-link-api.onrender.com/api/dishes \
  -H "Content-Type: application/json" \
  -d '{
    "categorie_id": "CATEGORY_ID_FROM_STEP_2",
    "nom": "Salade César",
    "description": "Salade fraîche avec croutons",
    "prix": 8.99,
    "disponible": true
  }'
```

---

## 📊 Données Créées par le Script de Seed

Le script `src/seeds/seedData.js` crée:

### Tables (5)
- Table 1 avec QR code
- Table 2 avec QR code
- Table 3 avec QR code
- Table 4 avec QR code
- Table 5 avec QR code

### Menu (1)
- Menu Principal (actif)

### Catégories (4)
1. Entrées
2. Plats Principaux
3. Desserts
4. Boissons

### Plats (10)
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

### Utilisateur (1)
- Admin Gestionnaire (role: GESTIONNAIRE)

---

## 🔍 Vérifier que les Données sont Bien Créées

### Via l'API
```bash
# Récupérer le menu complet
curl https://menu-link-api.onrender.com/api/menu

# Vérifier le health check
curl https://menu-link-api.onrender.com/api/health
```

### Via MongoDB Compass
1. Se connecter à la BD
2. Vérifier que les collections contiennent des documents
3. Compter les documents dans chaque collection

### Via Swagger UI
1. Ouvrir: https://menu-link-api.onrender.com/api-docs
2. Tester: GET /menu
3. Voir les catégories et plats

---

## 🔄 Réinitialiser les Données

Pour effacer et recréer toutes les données:

```bash
# Via Render Shell
node src/seeds/seedData.js
```

⚠️ **Attention**: Cela supprime TOUTES les données existantes!

---

## 📝 Personnaliser les Données

Pour modifier les données de seed:

1. Éditer `src/seeds/seedData.js`
2. Modifier les tableaux `categoryNames` et `dishesData`
3. Commit et push vers GitHub
4. Render redéploiera automatiquement
5. Exécuter le seed via Render Shell

---

## 🆘 Dépannage

### Erreur: "Cannot connect to MongoDB"
- Vérifier que MONGODB_URI est correct dans les variables d'environnement Render
- Vérifier que l'IP de Render est autorisée dans MongoDB Atlas (ou autoriser toutes les IPs: 0.0.0.0/0)

### Erreur: "Collection not found"
- Les collections sont créées automatiquement par Mongoose
- Exécuter le seed une première fois pour créer les collections

### Les données n'apparaissent pas
- Vérifier les logs Render pour voir si le seed s'est bien exécuté
- Vérifier la connexion MongoDB dans MongoDB Compass
- Tester l'endpoint GET /menu pour voir si les données sont retournées
