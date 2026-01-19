# 🚗 Togo Car Rental - Frontend

Application Next.js 14+ pour la gestion de location de véhicules au Togo.

## 📋 Stack Technique

- **Framework**: Next.js 14+ (App Router)
- **Langage**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Components UI**: Shadcn/UI (Radix UI)
- **State Management**: Zustand + TanStack Query
- **Formulaires**: React Hook Form + Zod
- **HTTP Client**: Axios (httpOnly cookies)
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚀 Installation

1. **Installer les dépendances** :

```bash
npm install
```

2. **Configurer les variables d'environnement** :

   Créer un fichier `.env.local` à la racine du projet :

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Lancer le serveur de développement** :

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3001](http://localhost:3001)

## 📁 Structure du Projet

```
app/
├── (auth)/              # Pages d'authentification
│   ├── login/
│   └── register/
├── (dashboard)/         # Pages protégées utilisateur
│   ├── dashboard/
│   └── reservations/
├── admin/               # Pages admin
│   ├── vehicles/        # Gestion véhicules
│   └── interactions/    # Check-in/Check-out
├── vehicles/            # Catalogue public
│   └── [id]/           # Détail véhicule
├── layout.tsx          # Root layout
└── page.tsx            # Landing page

components/
├── ui/                 # Composants Shadcn/UI
├── shared/             # Navbar, Footer, AuthGuard
└── features/           # VehicleCard, ReservationDialog, etc.

lib/
├── api.ts              # Client Axios
└── utils.ts            # Utilitaires

services/               # Services API
├── auth.service.ts
├── vehicles.service.ts
└── reservations.service.ts

store/                  # Stores Zustand
└── auth-store.ts

types/                  # Définitions TypeScript
└── index.ts
```

## 🔐 Authentification

L'application utilise des **httpOnly cookies** pour stocker le JWT, offrant une meilleure sécurité contre les attaques XSS.

### Flux d'authentification :

1. Login/Register → Cookie httpOnly automatiquement défini par le backend
2. Axios interceptor envoie automatiquement le cookie avec chaque requête (`withCredentials: true`)
3. AuthGuard vérifie l'authentification en appelant `/auth/profile`
4. Logout efface le cookie côté serveur

## 🎨 Pages & Fonctionnalités

### Zone Publique

- **Landing Page** (`/`) : Hero, présentation des services
- **Catalogue** (`/vehicles`) : Liste des véhicules disponibles
- **Détail véhicule** (`/vehicles/[id]`) : Informations complètes + réservation

### Espace Client (Protégé)

- **Dashboard** (`/dashboard`) : Vue d'ensemble, statistiques
- **Mes Réservations** (`/dashboard/reservations`) : Historique complet

### Back-Office Admin (ADMIN uniquement)

- **Gestion Véhicules** (`/admin/vehicles`) : CRUD complet, upload d'images
- **Gestion Flotte** (`/admin/interactions`) : Check-in/Check-out des réservations

## 🛠 Commandes Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Démarrer en production
npm run start

# Linter
npm run lint
```

## Configuration Backend

L'application frontend nécessite le backend NestJS en cours d'exécution sur `http://localhost:3000`.

Le backend doit supporter les **httpOnly cookies** avec **CORS** configuré pour autoriser les credentials :

```typescript
// backend/src/main.ts
app.enableCors({
  origin: "http://localhost:3001", // URL du frontend
  credentials: true,
});
```

## 📸 Images de Démonstration

Des images de véhicules de démonstration sont disponibles dans le dossier `brain/` pour tester l'application.

## 🔧 Personnalisation

### Thème

Les couleurs et le design sont configurables dans :

- `tailwind.config.ts` : Configuration Tailwind
- `app/globals.css` : Variables CSS pour les thèmes light/dark

### API URL

Changez l'URL de l'API dans `.env.local` :

```
NEXT_PUBLIC_API_URL=https://votre-api.com
```

## 📝 Notes de Développement

- Les composants utilisant l'état ou les événements doivent avoir la directive `'use client'`
- Les erreurs API sont gérées avec des toasts (Sonner)
- TanStack Query gère automatiquement le cache et les refetch
- Les images doivent être optimisées via `next/image`

## 🐛 Dépannage

### Problème de connexion API

Vérifiez que :

1. Le backend est démarré sur `http://localhost:3000`
2. CORS est correctement configuré avec `credentials: true`
3. Les cookies httpOnly sont supportés

### Erreurs de build

```bash
# Nettoyer le cache et réinstaller
rm -rf .next node_modules
npm install
npm run dev
```

## 📄 Licence

Projet privé - Tous droits réservés
