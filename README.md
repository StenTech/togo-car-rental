# 🚗 Togo Car Rental

Application web moderne de gestion de location de véhicules, développée avec une architecture monorepo full-stack.

## 📋 Vue d'ensemble

**Togo Car Rental** est une plateforme complète permettant la gestion des véhicules, des réservations et des utilisateurs. Le projet implémente une architecture Clean avec séparation stricte des responsabilités, suivant les principes SOLID et les meilleures pratiques de développement.

## ⚡ Quick Start - Démarrage Rapide (5 minutes)

### Option A : Avec Docker (Recommandé - Tout automatique)

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/togo-car-rental.git
cd togo-car-rental

# 2. Démarrer TOUS les services (PostgreSQL, MinIO, Backend, Frontend)
docker-compose up -d

# 3. Initialiser la base de données
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# 4. Créer le bucket MinIO pour les images
cd ..
docker-compose exec createbuckets sh -c "mc alias set myminio http://minio:9000 minioadmin minioadmin && mc mb myminio/vehicle-images --ignore-existing"

# 5. L'application est prête ! 🎉
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# Swagger: http://localhost:3001/api
```

### Option B : Sans Docker (Manuel)

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/togo-car-rental.git
cd togo-car-rental

# 2. Configuration Backend
cd backend
npm install

# Créer le fichier backend/.env avec:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/togo_car_rental"
# JWT_SECRET="votre_secret_changez_moi"
# MINIO_ENDPOINT="localhost"
# MINIO_PORT=9000
# MINIO_ACCESS_KEY="minioadmin"
# MINIO_SECRET_KEY="minioadmin"
# MINIO_BUCKET="vehicle-images"
# PORT=3001

npx prisma generate
npx prisma migrate dev
npm run start:dev  # ✅ Backend démarre sur http://localhost:3001

# 3. Configuration Frontend (NOUVEAU TERMINAL)
cd ../frontend
npm install

# Créer le fichier frontend/.env.local avec:
# NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev  # ✅ Frontend démarre sur http://localhost:3000

# 4. Accéder à l'application
# 🌐 Frontend: http://localhost:3000
# 🔌 Backend: http://localhost:3001
# 📚 Documentation API: http://localhost:3001/api
```

### 🎯 Premiers pas après l'installation

1. **Créer un compte admin** : Accédez à http://localhost:3000/register
2. **Ajouter des véhicules** : Interface admin à http://localhost:3000/admin/vehicles
3. **Créer une réservation** : Tableau de bord à http://localhost:3000/dashboard

### 🎯 Fonctionnalités principales

#### Pour les utilisateurs
- 🔐 **Authentification sécurisée** : Inscription/Connexion avec JWT + HttpOnly Cookies
- 📅 **Réservation de véhicules** : Système de réservation avec détection de conflits
- 🔍 **Catalogue de véhicules** : Consultation des véhicules disponibles avec images
- 👤 **Profil utilisateur** : Gestion des informations personnelles

#### Pour les administrateurs
- 🚙 **Gestion des véhicules** : CRUD complet (Création, Lecture, Mise à jour, Suppression)
- 📸 **Upload d'images** : Stockage MinIO avec génération automatique d'URLs signées
- 📊 **Tableau de bord** : Vue d'ensemble des statistiques
- 👥 **Gestion des utilisateurs** : Administration des comptes
- 📋 **Gestion des réservations** : Validation et suivi des réservations

## 🛠 Stack Technique

### Backend (NestJS)

#### Framework & Runtime
- **NestJS** 10.x - Framework progressif TypeScript/Node.js
- **Node.js** 20.x - Runtime JavaScript
- **TypeScript** 5.x (Strict Mode activé)

#### Base de données & ORM
- **PostgreSQL** 15+ - Base de données relationnelle
- **Prisma** 6.x - ORM moderne avec migration automatique
- **PgAdmin** - Interface d'administration PostgreSQL (Dev)

#### Authentification & Sécurité
- **Passport** + **Passport-JWT** - Stratégie d'authentification
- **@nestjs/jwt** - Génération et validation de tokens JWT
- **bcrypt** - Hachage sécurisé des mots de passe
- **Helmet** - Sécurisation des headers HTTP
- **class-validator** + **class-transformer** - Validation des DTOs

#### Stockage & Upload
- **MinIO** - Stockage objet S3-compatible pour les images
- **Multer** - Gestion des uploads multipart/form-data

#### Configuration & Validation
- **@nestjs/config** - Gestion centralisée de la configuration
- **Joi** - Validation des variables d'environnement

#### Documentation & Logging
- **Swagger/OpenAPI** - Documentation interactive de l'API
- **Winston** + **nest-winston** - Logging structuré

#### Testing
- **Jest** - Framework de tests unitaires et d'intégration
- **Supertest** - Tests E2E des endpoints HTTP

### Frontend (Next.js)

#### Framework & Runtime
- **Next.js** 14.x (App Router) - Framework React avec SSR/SSG
- **React** 18.x - Bibliothèque UI
- **TypeScript** 5.x (Strict Mode)

#### Gestion d'état & Requêtes
- **Zustand** - State management minimaliste pour l'authentification
- **TanStack Query** (React Query) v5 - Gestion du cache et des requêtes asynchrones
- **Axios** - Client HTTP avec intercepteurs

#### UI & Styling
- **Tailwind CSS** 3.x - Framework CSS utility-first
- **shadcn/ui** - Composants React accessibles et personnalisables
- **Radix UI** - Primitives UI accessibles (Dialog, Dropdown, Select, Toast)
- **Lucide React** - Icônes modernes
- **Sonner** - Notifications toast élégantes

#### Formulaires & Validation
- **React Hook Form** 7.x - Gestion performante des formulaires
- **Zod** - Validation de schémas TypeScript-first
- **@hookform/resolvers** - Intégration Zod + React Hook Form

#### Utilities
- **date-fns** - Manipulation de dates
- **clsx** + **tailwind-merge** - Gestion conditionnelle des classes CSS
- **class-variance-authority** - Variantes de composants type-safe

### Infrastructure & DevOps

#### Conteneurisation
- **Docker** + **Docker Compose** - Orchestration des services
- Services containerisés :
  - Backend NestJS (port 3001)
  - Frontend Next.js (port 3000)
  - PostgreSQL (port 5432)
  - MinIO (ports 9000/9001)
  - PgAdmin (port 5050)

#### Version Control
- **Git** - Contrôle de version
- **GitHub** - Hébergement du code source

## 📁 Architecture du Projet

```
togo-car-rental/
├── backend/                      # API NestJS
│   ├── prisma/
│   │   ├── schema.prisma         # Schéma Prisma (Source of Truth)
│   │   ├── migrations/           # Migrations de base de données
│   │   └── seed.ts               # Données de test
│   ├── src/
│   │   ├── common/               # Code partagé (Guards, Interceptors, Decorators)
│   │   ├── config/               # Configuration validée (Joi)
│   │   ├── modules/
│   │   │   ├── auth/             # Authentification JWT
│   │   │   ├── users/            # Gestion des utilisateurs
│   │   │   ├── vehicles/         # CRUD véhicules + Upload
│   │   │   └── reservations/     # Gestion des réservations
│   │   └── main.ts               # Point d'entrée de l'application
│   ├── test/                     # Tests E2E
│   ├── uploads/                  # Stockage temporaire (dev)
│   ├── .env                      # Variables d'environnement
│   ├── docker-compose.yml        # Services Docker
│   └── package.json              # Dépendances backend
│
├── frontend/                     # Application Next.js
│   ├── app/                      # App Router (Next.js 14)
│   │   ├── (auth)/               # Routes publiques (login, register)
│   │   ├── (dashboard)/          # Routes utilisateur authentifié
│   │   └── admin/                # Routes administrateur
│   ├── components/
│   │   ├── features/             # Composants métier
│   │   ├── shared/               # Composants partagés
│   │   └── ui/                   # Composants shadcn/ui
│   ├── hooks/                    # Custom hooks React
│   ├── lib/                      # Utilities (api.ts, utils.ts)
│   ├── services/                 # Services API (axios)
│   ├── stores/                   # Stores Zustand
│   ├── types/                    # Types TypeScript (alignés avec Prisma)
│   ├── .env.local                # Variables d'environnement frontend
│   └── package.json              # Dépendances frontend
│
├── docker-compose.yml            # Orchestration complète (Dev)
├── .gitignore                    # Fichiers ignorés par Git
└── README.md                     # Documentation (ce fichier)
```

## 🚀 Installation et Démarrage

### Prérequis

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Docker** + **Docker Compose** (optionnel mais recommandé)
- **PostgreSQL** 15+ (si sans Docker)
- **MinIO** (si sans Docker)

### Installation (Développement Local)

#### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/togo-car-rental.git
cd togo-car-rental
```

#### 2. Configuration Backend

```bash
cd backend
npm install
```

Créer le fichier `.env` :

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/togo_car_rental?schema=public"

# JWT
JWT_SECRET="votre_secret_jwt_ultra_securise_changez_moi_en_production"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="vehicle-images"
MINIO_USE_SSL=false

# Server
PORT=3001
```

#### 3. Configuration Frontend

```bash
cd ../frontend
npm install
```

Créer le fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 4. Démarrage avec Docker (Recommandé)

Depuis la racine du projet :

```bash
# Démarrer tous les services
docker-compose up -d

# Créer le bucket MinIO
docker-compose exec createbuckets sh -c "mc alias set myminio http://minio:9000 minioadmin minioadmin && mc mb myminio/vehicle-images --ignore-existing"
```

Services disponibles :
- **Backend API** : http://localhost:3001
- **Swagger UI** : http://localhost:3001/api
- **Frontend** : http://localhost:3000
- **MinIO Console** : http://localhost:9001 (minioadmin / minioadmin)
- **PgAdmin** : http://localhost:5050 (admin@admin.com / admin)

#### 5. Migrations et Seed

```bash
cd backend

# Générer les fichiers Prisma Client
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# (Optionnel) Insérer des données de test
npx prisma db seed
```

#### 6. Démarrage manuel (sans Docker)

**Terminal 1 - Backend :**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## 📘 Utilisation

### Authentification

#### Inscription

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER" // ou "ADMIN"
}
```

#### Connexion

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}

Réponse : Cookie HttpOnly + { access_token, user }
```

### Gestion des Véhicules (Admin)

#### Créer un véhicule (avec image)

```
POST /api/vehicles
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2024,
  "plate": "TG-123-AB",
  "pricePerDay": 25000,
  "status": "AVAILABLE",
  "image": <fichier>
}
```

#### Lister les véhicules

```
GET /api/vehicles
Authorization: Bearer <token>
```

#### Mettre à jour un véhicule

```
PATCH /api/vehicles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "pricePerDay": 30000,
  "status": "MAINTENANCE"
}
```

#### Supprimer un véhicule

```
DELETE /api/vehicles/:id
Authorization: Bearer <token>
```

### Réservations

#### Créer une réservation

```
POST /api/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicleId": "uuid-du-vehicule",
  "startDate": "2026-01-20T00:00:00.000Z",
  "endDate": "2026-01-25T00:00:00.000Z",
  "reason": "Voyage d'affaires"
}
```

#### Mes réservations

```
GET /api/reservations/my-reservations
Authorization: Bearer <token>
```

## 🎨 Principes de Développement

### Architecture Backend

#### Clean Architecture
- **Controllers** : Gestion des requêtes HTTP, validation des DTOs
- **Services** : Logique métier isolée
- **Repositories** : Accès aux données (Prisma)
- **DTOs** : Validation stricte avec `class-validator`

#### Principes SOLID Appliqués

**S - Single Responsibility** : Chaque service a une responsabilité unique
```typescript
// ✅ Bon
class VehiclesService {
  async findAll() { /* ... */ }
  async create() { /* ... */ }
}

class ImageService {
  async uploadImage() { /* ... */ }
}
```

**O - Open/Closed** : Extension via Dependency Injection
```typescript
// Module extensible
@Module({
  providers: [VehiclesService, ImageService, PrismaService],
  // Ajout de nouveaux providers sans modifier l'existant
})
```

**D - Dependency Inversion** : Injection de dépendances systématique
```typescript
@Injectable()
class VehiclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imageService: ImageService,
  ) {}
}
```

#### Sécurité

- ✅ Pas de secrets en clair (variables d'environnement)
- ✅ Validation de toutes les entrées (DTOs)
- ✅ Hachage Bcrypt (mots de passe)
- ✅ JWT + HttpOnly Cookies (protection CSRF)
- ✅ Guards NestJS (autorisation par rôle)
- ✅ Helmet (sécurisation headers)

### Architecture Frontend

#### Structure des Composants

- **Server Components** par défaut (Next.js 14)
- **Client Components** (`'use client'`) uniquement si interactivité nécessaire
- **Hooks personnalisés** pour la réutilisation de logique
- **Composition** plutôt qu'héritage

#### Gestion d'État

- **Zustand** : État global minimal (auth)
- **TanStack Query** : Cache serveur, invalidation automatique
- **React Hook Form** : État local des formulaires

#### Type Safety

```typescript
// Alignement strict Backend ↔ Frontend
// backend/prisma/schema.prisma
model Vehicle {
  id           String   @id @default(uuid())
  plate        String   @unique
  // ...
}

// frontend/types/index.ts
export interface Vehicle {
  id: string;
  plate: string;
  // Exactement les mêmes propriétés
}
```

## 🧪 Tests

### Backend (Jest)

```bash
cd backend

# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend

```bash
cd frontend

# Tests (si configurés)
npm run test
```

## 📊 Schéma de Base de Données

### Tables Principales

#### Users
```prisma
model User {
  id            String        @id @default(uuid())
  email         String        @unique
  password      String
  firstName     String
  lastName      String
  role          Role          @default(USER)
  reservations  Reservation[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}
```

#### Vehicles
```prisma
model Vehicle {
  id           String        @id @default(uuid())
  brand        String
  model        String
  year         Int
  plate        String        @unique
  pricePerDay  Float
  imageUrl     String?
  status       VehicleStatus @default(AVAILABLE)
  reservations Reservation[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

#### Reservations
```prisma
model Reservation {
  id              String            @id @default(uuid())
  userId          String
  vehicleId       String
  startDate       DateTime
  endDate         DateTime
  status          ReservationStatus @default(PENDING)
  totalPrice      Float
  reason          String?
  user            User              @relation(...)
  vehicle         Vehicle           @relation(...)
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}
```

### Relations

```
User (1) ──────< (N) Reservation (N) >────── (1) Vehicle
```

## 🔧 Configuration Avancée

### Variables d'environnement Backend

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL PostgreSQL | - |
| `JWT_SECRET` | Secret pour JWT | - |
| `MINIO_ENDPOINT` | Endpoint MinIO | `localhost` |
| `MINIO_PORT` | Port MinIO | `9000` |
| `MINIO_ACCESS_KEY` | Access key MinIO | `minioadmin` |
| `MINIO_SECRET_KEY` | Secret key MinIO | `minioadmin` |
| `MINIO_BUCKET` | Nom du bucket | `vehicle-images` |
| `PORT` | Port serveur | `3001` |

### Variables d'environnement Frontend

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_API_URL` | URL de l'API | `http://localhost:3001` |

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier PostgreSQL
docker ps | grep postgres

# Vérifier les logs
docker logs backend

# Réinitialiser la base de données
cd backend
npx prisma migrate reset
```

### Erreur "MinIO bucket not found"

```bash
# Recréer le bucket
docker-compose exec minio mc mb /data/vehicle-images
```

### Erreur 401 lors des requêtes

- Vérifier que le token JWT est valide
- Utiliser `http://127.0.0.1:3000` au lieu de `localhost` (Windows)
- Vider les cookies du navigateur

### Images ne s'affichent pas

- Vérifier que MinIO est démarré : `docker ps | grep minio`
- Accéder à la console MinIO : http://localhost:9001
- Vérifier les logs : `docker logs minio`

## 📚 Ressources

### Documentation des Technologies

- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs)
- [Next.js](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Standards de Code

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🤝 Contribution

### Workflow Git

```bash
# Créer une branche
git checkout -b feature/ma-fonctionnalite

# Commiter avec des messages descriptifs
git commit -m "feat: Ajout de la fonctionnalité X"

# Pusher la branche
git push origin feature/ma-fonctionnalite

# Créer une Pull Request sur GitHub
```

### Conventions de Commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, point-virgules manquants, etc.
- `refactor:` Refactoring de code
- `test:` Ajout de tests
- `chore:` Maintenance (dépendances, config)

## 📝 Licence

Ce projet est un projet éducatif développé dans le cadre d'un apprentissage des technologies NestJS et Next.js.

## 👤 Auteur

**Développé avec ❤️ et ☕ par l'équipe Togo Car Rental**

---

## 🎓 Notes Pédagogiques

Ce projet implémente des concepts avancés pour servir de référence :

### Concepts Backend
- ✅ Clean Architecture avec séparation des couches
- ✅ SOLID Principles appliqués rigoureusement
- ✅ Dependency Injection (DI) native de NestJS
- ✅ Repository Pattern avec Prisma
- ✅ DTO Pattern avec validation stricte
- ✅ Guards et Interceptors pour la sécurité
- ✅ Exception Filters pour la gestion d'erreurs
- ✅ Documentation OpenAPI/Swagger automatique
- ✅ Type Safety strict (noImplicitAny)

### Concepts Frontend
- ✅ Server Components vs Client Components (React Server Components)
- ✅ App Router Next.js 14 (file-based routing)
- ✅ React Query pour le cache et la synchronisation serveur
- ✅ Zustand pour l'état global minimal
- ✅ Compound Components (Dialog, Dropdown, etc.)
- ✅ Controlled vs Uncontrolled Components (React Hook Form)
- ✅ Type-safe forms avec Zod
- ✅ Optimistic Updates avec React Query

### Patterns de Sécurité
- ✅ JWT + HttpOnly Cookies (meilleure sécurité que localStorage)
- ✅ CORS configuré correctement
- ✅ Helmet pour sécuriser les headers
- ✅ Validation côté serveur (jamais uniquement côté client)
- ✅ Rate limiting (à implémenter en production)

---

**Note importante** : Ce README documente l'état actuel du projet. Pour toute question ou amélioration, n'hésitez pas à ouvrir une issue sur GitHub.
