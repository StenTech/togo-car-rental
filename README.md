# 🚗 Togo Car Rental - Full Stack Monorepo

Plateforme moderne de location de voitures, conçue avec une architecture "Elite" (Robustesse, Sécurité, Scalabilité).

## 🌍 Vue d'Ensemble du Projet

Ce repository (Monorepo) contient l'ensemble du code source du projet :

*   **`backend/`** : API RESTful (NestJS, Prisma, Postgres).
*   **`frontend/`** : Application Client (Next.js / React - *À venir*).
*   **`docker-compose.yml`** : Orchestration de l'infrastructure locale (DB, Object Storage).

## 🏗 Architecture & Philosophie

Nous visons l'excellence technique à travers des standards stricts.

### Backend (NestJS)
*   **Clean Architecture** : Séparation stricte des couches (Controllers, Services, Modules).
*   **Security-First** : Validation DTO stricte, Auth Guard JWT, pas de secrets en clair.
*   **Storage Abstrait** : Gestion des fichiers via MinIO (S3 Compatible), découplé du métier.
*   **Tests** : Couverture unitaire et End-to-End (E2E) obligatoire.

### Infrastructure (Docker)
L'infrastructure locale est entièrement conteneurisée :
*   **PostgreSQL 15** : Base de données relationnelle.
*   **MinIO** : Object Storage compatible S3 (pour les images des véhicules).

---

## 🚀 Guide de Démarrage Rapide

### Prérequis global
*   Docker & Docker Compose
*   Node.js 18+ (LTS)
*   Git

### 1. Configuration de l'Infrastructure (Racine)
Créez un fichier `.env` à la racine du projet (`togo-car-rental/.env`) pour Docker Compose.
```dotenv
POSTGRES_USER=sten
POSTGRES_PASSWORD=sten@tech.ru
POSTGRES_DB=togo_car_db
POSTGRES_PORT=5435

MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=password@minio123
```

### 2. Lancer l'Infrastructure
À la racine du projet, lancez les services :
```bash
docker-compose up -d --build
```
**Accès aux services :**
*   **MinIO Console** : [http://localhost:9001](http://localhost:9001) (User: `admin` / Password: `password@minio123`)
*   **Postgres** : Port `5435`

> ⚠️ **Important MinIO** : Lors du premier lancement, connectez-vous à la console MinIO et **créez un Bucket nommé `togo-car-rentals`**.

---

## 💻 Backend Setup

Naviguez dans le dossier backend :
```bash
cd backend
```

### 1. Configuration du Backend (API)
Créez un fichier `.env` dans `backend/` (`backend/.env`) :

```dotenv
# Database
POSTGRES_USER=sten
POSTGRES_PASSWORD=sten@tech.ru
POSTGRES_DB=togo_car_db
POSTGRES_PORT=5435
# Attention à l'encodage de '@' en '%40' dans l'URL Prisma
DATABASE_URL="postgresql://sten:sten%40tech.ru@localhost:5435/togo_car_db?schema=public"

# Auth
JWT_SECRET="votre_secret_super_securise"
JWT_EXPIRES_IN=1d

# MinIO (S3 Storage)
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=password@minio123
MINIO_BUCKET_NAME=togo-car-rentals
MINIO_ENDPOINT=http://127.0.0.1:9000
MINIO_ENDPOINT_PUBLIC=http://localhost:9000
```

### 2. Installation & Migrations
```bash
npm install
npx prisma migrate dev  # Applique le schéma à la DB
```

### 3. Lancer l'API
```bash
npm run start:dev
```
*   **API URL** : `http://localhost:3000`
*   **Swagger Docs** : `http://localhost:3000/api`

### 4. Tests & Qualité
```bash
npm run test      # Tests unitaires
npm run test:e2e  # Tests d'intégration complets
npm run lint      # Vérification du code style
```

---

## 🎨 Frontend (Coming Soon)
Le développement du frontend React/Next.js débutera dans la phase suivante.

---

## 🛡 Gestion des Uploads (Feature Backend)

Le backend gère l'upload d'images (ex: photos de véhicules) via le protocole S3.
*   **Module** : `StorageModule` (Global)
*   **Logique** : Les fichiers sont validés (MimeType, Taille), renommés (UUID) et envoyés au bucket MinIO.
*   **Abstaction** : Le code métier (VehiclesService) ne manipule que des URLs, sans savoir que c'est du S3/MinIO derrière.

---

**Auteur** : Sten Tech (Ghost Mode) 👻
**Année** : 2026
