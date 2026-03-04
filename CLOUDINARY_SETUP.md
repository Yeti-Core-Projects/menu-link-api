# Configuration Cloudinary pour Upload d'Images

## 1. Créer un compte Cloudinary

1. Aller sur [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. S'inscrire gratuitement (25GB de stockage gratuit)
3. Confirmer l'email

## 2. Récupérer les credentials

1. Se connecter au dashboard Cloudinary
2. Aller dans **Settings** → **Access Keys**
3. Noter les informations suivantes:
   - **Cloud Name**: `dxxxxxx`
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz`

## 3. Configurer les variables d'environnement

### En local (.env)
```env
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### Sur Render
1. Aller dans le dashboard Render
2. Sélectionner ton service `menu-link-api`
3. Aller dans **Environment** → **Environment Variables**
4. Ajouter les 3 variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
5. Sauvegarder (Render va redéployer automatiquement)

### Sur cPanel
1. Aller dans **Node.js App**
2. Cliquer sur **Edit** pour ton application
3. Ajouter les variables d'environnement dans la section **Environment variables**
4. Redémarrer l'application

## 4. Installer les dépendances

```bash
cd backend
npm install
```

## 5. Tester l'upload d'image

### Avec Postman

1. **Créer une requête POST**
   - URL: `https://menu-link-api.onrender.com/api/dishes/:id/image`
   - Remplacer `:id` par l'ID d'un plat existant

2. **Configurer le body**
   - Type: `form-data`
   - Key: `image` (type: File)
   - Value: Sélectionner une image (JPG, PNG, etc.)

3. **Envoyer la requête**

4. **Réponse attendue:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "nom": "Ndolé",
    "image_url": "https://res.cloudinary.com/dxxxxxx/image/upload/v1234567890/menu-link/dishes/abc123.jpg"
  }
}
```

## 6. Fonctionnalités

### Upload d'image
- **Endpoint**: `POST /api/dishes/:id/image`
- **Format**: multipart/form-data
- **Taille max**: 5MB
- **Formats acceptés**: JPG, PNG, GIF, WEBP
- **Optimisations automatiques**:
  - Redimensionnement: max 800x600px
  - Compression: qualité automatique
  - Format: conversion automatique vers le meilleur format

### Stockage
- **Dossier Cloudinary**: `menu-link/dishes/`
- **URL publique**: Accessible directement depuis l'app mobile
- **CDN**: Images servies rapidement partout dans le monde

## 7. Utilisation dans l'app mobile

Une fois l'image uploadée, l'URL est stockée dans MongoDB:

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "nom": "Ndolé",
  "description": "Feuilles de ndolé aux arachides",
  "prix": 3000,
  "image_url": "https://res.cloudinary.com/dxxxxxx/image/upload/v1234567890/menu-link/dishes/abc123.jpg",
  "disponible": true
}
```

L'app mobile peut afficher l'image directement avec cette URL.

## 8. Limites du plan gratuit

- **Stockage**: 25GB
- **Bande passante**: 25GB/mois
- **Transformations**: 25 crédits/mois
- **Images**: Illimité

Pour un restaurant avec ~100 plats et des images de 200KB chacune:
- Stockage utilisé: ~20MB (0.08% du quota)
- Largement suffisant pour démarrer!

## 9. Troubleshooting

### Erreur: "Invalid credentials"
- Vérifier que les variables d'environnement sont bien configurées
- Vérifier qu'il n'y a pas d'espaces dans les valeurs

### Erreur: "File too large"
- La taille max est 5MB
- Compresser l'image avant upload

### Erreur: "Only image files are allowed"
- Vérifier que le fichier est bien une image (JPG, PNG, etc.)
- Vérifier le Content-Type dans Postman

## 10. Prochaines étapes

Une fois Cloudinary configuré, tu pourras:
1. Uploader des images pour tous les plats
2. Les afficher dans l'app mobile
3. Gérer les images depuis le dashboard Cloudinary
