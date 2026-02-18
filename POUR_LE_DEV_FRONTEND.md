# 📱 Pour le Développeur Frontend

Bienvenue ! Ce document contient tout ce dont vous avez besoin pour intégrer l'API Menu Link dans votre application mobile.

---

## 🎯 Ce que vous devez savoir

### URL de l'API
```
https://menu-link-api.onrender.com/api
```

### Documentation disponible
1. **swagger.yaml** ou **swagger.json** - À importer dans Postman/Swagger Editor
2. **postman_collection.json** - Collection Postman prête à l'emploi
3. **FRONTEND_INTEGRATION.md** - Guide d'intégration avec exemples de code
4. **API_ENDPOINTS.md** - Documentation détaillée de tous les endpoints

---

## 🚀 Démarrage rapide (5 minutes)

### 1. Tester l'API avec Postman

```bash
# Téléchargez postman_collection.json
# Importez-le dans Postman
# Testez les endpoints
```

### 2. Tester l'API avec curl

```bash
# Health check
curl https://menu-link-api.onrender.com/api/health

# Obtenir le menu
curl https://menu-link-api.onrender.com/api/menu
```

### 3. Intégrer dans votre app

Voir **FRONTEND_INTEGRATION.md** pour des exemples de code React Native/Expo.

---

## 📋 Les 3 endpoints essentiels

### 1️⃣ Créer une session (Scan QR)

```typescript
POST /api/sessions
Body: { "qr_code": "table_1_1706256600000" }

Response:
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "table_id": "507f1f77bcf86cd799439011",
    "started_at": "2024-01-26T10:30:00.000Z"
  }
}
```

### 2️⃣ Obtenir le menu

```typescript
GET /api/menu

Response:
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "...",
        "nom": "Entrées",
        "ordre_affichage": 0,
        "dishes": [
          {
            "_id": "...",
            "nom": "Salade César",
            "description": "Salade fraîche",
            "prix": 8.99,
            "disponible": true,
            "image_url": null
          }
        ]
      }
    ],
    "totalDishes": 10
  }
}
```

### 3️⃣ Valider une session

```typescript
GET /api/sessions/:session_id

Response:
{
  "success": true,
  "data": {
    "session_id": "...",
    "table_id": "...",
    "table_number": 1,
    "started_at": "..."
  }
}
```

---

## 💡 Exemple d'intégration React Native

```typescript
// 1. Scanner le QR code
const handleQRScan = async (qrCode: string) => {
  const response = await fetch('https://menu-link-api.onrender.com/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qr_code: qrCode })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Sauvegarder la session
    await AsyncStorage.setItem('session_id', data.data.session_id);
    
    // Naviguer vers le menu
    navigation.navigate('Menu');
  }
};

// 2. Charger le menu
const loadMenu = async () => {
  const response = await fetch('https://menu-link-api.onrender.com/api/menu');
  const data = await response.json();
  
  if (data.success) {
    setMenu(data.data);
  }
};
```

---

## 🎨 Types TypeScript

```typescript
interface Session {
  session_id: string;
  table_id: string;
  started_at: string;
}

interface Dish {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  disponible: boolean;
  image_url: string | null;
}

interface Category {
  _id: string;
  nom: string;
  ordre_affichage: number;
  dishes: Dish[];
}

interface Menu {
  categories: Category[];
  totalDishes: number;
}
```

---

## ⚠️ Points importants

### 1. Format des réponses
Toutes les réponses suivent ce format :
```json
{
  "success": true/false,
  "data": {},
  "message": "...",
  "error": { "code": "...", "message": "..." }
}
```

### 2. Gestion des erreurs
Vérifiez toujours `success` avant d'utiliser `data` :
```typescript
if (data.success) {
  // Utiliser data.data
} else {
  // Afficher data.error.message
}
```

### 3. Menu vide
Si le menu est vide, `categories` sera un tableau vide `[]`, pas `null`.

### 4. Sessions
Les sessions expirent après 24 heures.

---

## 📦 Fichiers à télécharger

1. **swagger.yaml** - Spécification OpenAPI
2. **swagger.json** - Spécification OpenAPI (JSON)
3. **postman_collection.json** - Collection Postman
4. **FRONTEND_INTEGRATION.md** - Guide complet avec exemples

---

## 🧪 Tester l'API

### Option 1 : Postman
1. Importez `postman_collection.json`
2. Testez tous les endpoints

### Option 2 : Swagger Editor
1. Allez sur https://editor.swagger.io
2. Importez `swagger.yaml`
3. Explorez la documentation interactive

### Option 3 : curl
```bash
curl https://menu-link-api.onrender.com/api/health
curl https://menu-link-api.onrender.com/api/menu
```

---

## 📞 Besoin d'aide ?

### Questions sur l'API ?
- Lisez **API_ENDPOINTS.md** pour la documentation complète
- Lisez **FRONTEND_INTEGRATION.md** pour les exemples de code

### Bugs ou problèmes ?
- Ouvrez une issue sur GitHub
- Contactez l'équipe backend

### Nouvelles fonctionnalités ?
- Consultez la roadmap dans le README

---

## ✅ Checklist d'intégration

- [ ] Télécharger `postman_collection.json`
- [ ] Tester les endpoints dans Postman
- [ ] Lire `FRONTEND_INTEGRATION.md`
- [ ] Implémenter le scan QR
- [ ] Implémenter l'affichage du menu
- [ ] Gérer les erreurs
- [ ] Tester avec un menu vide
- [ ] Tester avec un QR code invalide

---

## 🚀 Prochaines étapes

Une fois le menu fonctionnel, nous ajouterons :
- Gestion des commandes
- Notifications temps réel (WebSocket)
- Paiement en ligne
- Historique des commandes

---

**Bonne intégration ! 🎉**

Si vous avez des questions, n'hésitez pas !
