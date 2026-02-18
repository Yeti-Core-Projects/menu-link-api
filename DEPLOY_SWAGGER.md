# 🚀 Déploiement de la Documentation Swagger

## ✅ Ce qui a été fait

1. **Configuration Swagger mise à jour**
   - `src/config/swagger.js` charge maintenant le fichier `swagger.yaml`
   - Route `/api-docs` déjà configurée dans `src/index.js`

2. **Documentation complète créée**
   - `swagger.yaml` - Spécification OpenAPI 3.0.3
   - `swagger.json` - Version JSON
   - Guides pour développeurs frontend

3. **Dépendance ajoutée**
   - `yamljs` ajouté dans `package.json`

## 📋 Commandes à Exécuter

### 1. Installer la nouvelle dépendance
```bash
cd backend
npm install
```

### 2. Tester localement (optionnel)
```bash
npm run dev
```
Puis ouvrir dans le navigateur: http://localhost:3000/api-docs

### 3. Commit et Push vers GitHub
```bash
git add .
git commit -m "feat: Add Swagger UI documentation at /api-docs endpoint"
git push origin main
```

### 4. Vérifier le déploiement sur Render
Render va automatiquement:
- Détecter les changements
- Installer les dépendances (`npm install`)
- Redémarrer l'application

### 5. Accéder à la documentation en ligne
Une fois déployé (environ 2-3 minutes):
```
https://menu-link-api.onrender.com/api-docs
```

## 🎯 Partager avec l'Équipe Frontend

Envoyer ce lien aux développeurs frontend:
```
📚 Documentation API: https://menu-link-api.onrender.com/api-docs
```

Ils pourront:
- ✅ Voir tous les endpoints disponibles
- ✅ Tester les endpoints directement depuis le navigateur
- ✅ Voir les schémas de données (Menu, Dish, Category, etc.)
- ✅ Copier les exemples de requêtes/réponses
- ✅ Télécharger la spécification OpenAPI

## 📖 Fichiers de Documentation Disponibles

Pour référence locale:
- `QUICK_START.md` - Guide de démarrage rapide
- `API_DOCUMENTATION.md` - Documentation détaillée
- `FRONTEND_INTEGRATION.md` - Guide d'intégration
- `POUR_LE_DEV_FRONTEND.md` - Guide en français pour frontend
- `postman_collection.json` - Collection Postman importable

## 🔧 Dépannage

### Si Swagger UI ne s'affiche pas:

1. **Vérifier les logs Render**
   - Aller sur le dashboard Render
   - Cliquer sur "Logs"
   - Chercher des erreurs liées à `yamljs` ou `swagger`

2. **Vérifier que yamljs est installé**
   ```bash
   npm list yamljs
   ```

3. **Vérifier que swagger.yaml existe**
   Le fichier doit être à la racine du dossier `backend/`

4. **Tester l'endpoint health**
   ```bash
   curl https://menu-link-api.onrender.com/api/health
   ```

### Si l'installation échoue:

Installer manuellement:
```bash
npm install yamljs@0.3.0 --save
```

## 📝 Notes Importantes

- La documentation Swagger UI est accessible publiquement (pas d'authentification requise)
- Les endpoints peuvent être testés directement depuis Swagger UI
- La spécification OpenAPI peut être téléchargée pour générer des clients
- Mettre à jour `swagger.yaml` quand de nouveaux endpoints sont ajoutés
