# Guide d'intégration Frontend - Menu Link API

Ce guide est destiné aux développeurs frontend pour intégrer l'API Menu Link dans leur application mobile.

---

## 🚀 Quick Start

### Base URL
```
Production: https://menu-link-api.onrender.com/api
```

### Documentation Swagger
- **YAML** : [swagger.yaml](./swagger.yaml)
- **JSON** : [swagger.json](./swagger.json)
- **Importer dans Postman** : Utilisez `swagger.json`

---

## 📱 Flux utilisateur

```
1. Client ouvre l'app
   ↓
2. Client scanne le QR code de la table
   ↓
3. App envoie le QR code à POST /api/sessions
   ↓
4. API retourne session_id
   ↓
5. App récupère le menu avec GET /api/menu
   ↓
6. Client consulte le menu et commande
```

---

## 🔌 Endpoints principaux

### 1. Créer une session (Scan QR)

**Endpoint :**
```
POST /api/sessions
```

**Request Body :**
```json
{
  "qr_code": "table_1_1706256600000"
}
```

**Response (201) :**
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

**Erreurs possibles :**
- `400` - QR code manquant
- `404` - QR code invalide ou table inactive

---

### 2. Obtenir le menu complet

**Endpoint :**
```
GET /api/menu
```

**Response (200) :**
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

**Note :** Si le menu est vide, `categories` sera un tableau vide `[]`.

---

### 3. Valider une session

**Endpoint :**
```
GET /api/sessions/:session_id
```

**Response (200) :**
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

**Erreurs possibles :**
- `401` - Session invalide ou expirée

---

## 💻 Exemples de code

### React Native / Expo

```typescript
// services/api.ts
const API_BASE_URL = 'https://menu-link-api.onrender.com/api';

export const createSession = async (qrCode: string) => {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ qr_code: qrCode }),
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};

export const getMenu = async () => {
  const response = await fetch(`${API_BASE_URL}/menu`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};

export const validateSession = async (sessionId: string) => {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error.message);
  }
  
  return data.data;
};
```

### Utilisation dans un composant

```typescript
// screens/QRScanScreen.tsx
import { useState } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createSession } from '../services/api';

export default function QRScanScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    
    try {
      const session = await createSession(data);
      
      // Sauvegarder la session
      await AsyncStorage.setItem('session_id', session.session_id);
      
      // Naviguer vers le menu
      navigation.navigate('Menu');
    } catch (error) {
      alert('QR code invalide');
      setScanned(false);
    }
  };

  return (
    <BarCodeScanner
      onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      style={{ flex: 1 }}
    />
  );
}
```

```typescript
// screens/MenuScreen.tsx
import { useEffect, useState } from 'react';
import { getMenu } from '../services/api';

export default function MenuScreen() {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await getMenu();
      setMenu(data);
    } catch (error) {
      alert('Erreur lors du chargement du menu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (menu.categories.length === 0) {
    return <Text>Aucun menu disponible</Text>;
  }

  return (
    <FlatList
      data={menu.categories}
      renderItem={({ item }) => (
        <CategoryCard category={item} />
      )}
    />
  );
}
```

---

## 🎨 Types TypeScript

```typescript
// types/api.ts

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface Session {
  session_id: string;
  table_id: string;
  started_at: string;
}

export interface SessionDetails extends Session {
  table_number: number;
}

export interface Dish {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  disponible: boolean;
  image_url: string | null;
}

export interface Category {
  _id: string;
  nom: string;
  ordre_affichage: number;
  dishes: Dish[];
}

export interface Menu {
  categories: Category[];
  totalDishes: number;
}
```

---

## 🔄 Gestion des erreurs

```typescript
// utils/errorHandler.ts

export const handleApiError = (error: any) => {
  if (error.response) {
    // Erreur HTTP
    const { code, message } = error.response.data.error;
    
    switch (code) {
      case 'MISSING_QR_CODE':
        return 'Veuillez scanner un QR code valide';
      case 'INVALID_SESSION':
        return 'Votre session a expiré';
      case 'NOT_FOUND':
        return 'Ressource non trouvée';
      default:
        return message || 'Une erreur est survenue';
    }
  } else if (error.request) {
    // Pas de réponse du serveur
    return 'Impossible de contacter le serveur';
  } else {
    // Autre erreur
    return error.message || 'Une erreur est survenue';
  }
};
```

---

## 📦 Librairies recommandées

### React Native / Expo
```bash
# Scanner QR code
expo install expo-barcode-scanner

# HTTP client
npm install axios

# State management
npm install @tanstack/react-query

# Storage
expo install @react-native-async-storage/async-storage
```

### Configuration Axios

```typescript
// services/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://menu-link-api.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.data?.error) {
      throw error.response.data.error;
    }
    throw error;
  }
);

export default api;
```

---

## 🧪 Tests

### Tester avec curl

```bash
# Health check
curl https://menu-link-api.onrender.com/api/health

# Créer une session
curl -X POST https://menu-link-api.onrender.com/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "table_1_1706256600000"}'

# Obtenir le menu
curl https://menu-link-api.onrender.com/api/menu
```

### Tester avec Postman

1. Importez `swagger.json` dans Postman
2. Tous les endpoints seront disponibles
3. Testez chaque endpoint

---

## ⚡ Performance

### Temps de réponse moyens
- Health check: ~50ms
- Créer session: ~200ms
- Obtenir menu: ~300ms

### Optimisations recommandées
- **Cache** : Mettre en cache le menu (TTL: 5 minutes)
- **Retry** : Réessayer automatiquement en cas d'échec réseau
- **Offline** : Sauvegarder le dernier menu en local

---

## 🔐 Sécurité

### CORS
L'API accepte actuellement toutes les origines (`*`). En production, cela sera restreint aux domaines autorisés.

### HTTPS
Toutes les requêtes doivent utiliser HTTPS en production.

### Session
Les sessions expirent après 24 heures d'inactivité.

---

## 📞 Support

### Questions ?
- **GitHub Issues** : https://github.com/Yeti-Core-Projects/menu-link-api/issues
- **Documentation complète** : Voir `API_ENDPOINTS.md`

### Bugs ?
Ouvrez une issue sur GitHub avec :
- Endpoint concerné
- Request/Response
- Message d'erreur
- Environnement (iOS/Android, version)

---

## 🚀 Prochaines fonctionnalités

- [ ] Gestion des commandes
- [ ] Notifications temps réel (WebSocket)
- [ ] Paiement en ligne
- [ ] Historique des commandes
- [ ] Authentification utilisateur

---

**Bonne intégration ! 🎉**
