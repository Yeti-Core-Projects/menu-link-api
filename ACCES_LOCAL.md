# 🏠 Accès à la Documentation en Local

## Étapes pour accéder à Swagger UI localement

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Démarrer le serveur
```bash
npm run dev
```

Vous verrez dans le terminal:
```
Server running on port 3000
```

### 3. Ouvrir Swagger UI dans le navigateur
```
http://localhost:3000/api-docs
```

## 🧪 Tester les Endpoints

Une fois Swagger UI ouvert, vous pouvez:

1. **Voir tous les endpoints** - Cliquez sur chaque section (Health, Sessions, Menu)
2. **Tester un endpoint** - Cliquez sur "Try it out"
3. **Exécuter** - Cliquez sur "Execute"
4. **Voir la réponse** - La réponse s'affiche en dessous

### Exemple: Tester le Health Check

1. Ouvrir: http://localhost:3000/api-docs
2. Cliquer sur "Health" → "GET /health"
3. Cliquer sur "Try it out"
4. Cliquer sur "Execute"
5. Voir la réponse:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-26T10:30:00.000Z"
}
```

### Exemple: Récupérer le Menu

1. Cliquer sur "Menu" → "GET /menu"
2. Cliquer sur "Try it out"
3. Cliquer sur "Execute"
4. Voir le menu complet avec catégories et plats

## 🔧 Dépannage

### Erreur: "Cannot GET /api-docs"

Vérifier que:
1. Le serveur est démarré (`npm run dev`)
2. Vous utilisez le bon port (3000 par défaut)
3. yamljs est installé (`npm list yamljs`)

### Erreur: "Module not found: yamljs"

Installer yamljs:
```bash
npm install yamljs
```

### Le serveur ne démarre pas

Vérifier:
1. MongoDB est accessible (vérifier MONGODB_URI dans .env)
2. Le port 3000 n'est pas déjà utilisé
3. Les dépendances sont installées (`npm install`)

## 📝 URLs Utiles

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health
- **Menu**: http://localhost:3000/api/menu
- **API Base**: http://localhost:3000/api
