# 🎨 Togo Car Rental - Spécifications Frontend (Next.js)

Ce document sert de référence technique pour le développement du frontend.
⚠️ **Target** : **Next.js 14+ (App Router)**.

## 🛠 Stack Technique (Target: Elite Standard)

*   **Framework** : [Next.js 14+](https://nextjs.org/) (App Router).
*   **Langage** : TypeScript (Strict Mode).
*   **Styling** : Tailwind CSS.
*   **Components UI** : [Shadcn/UI](https://ui.shadcn.com/) (Radix UI).
*   **State Management** : Zustand (Global Client State) + TanStack Query (Server State/Caching).
*   **Formulaires** : React Hook Form + Zod.
*   **HTTP Client** : Axios (avec intercepteur pour injecter le JWT).
*   **Icons** : Lucide React.

## 🏗 Architecture du Projet (Next.js App Router)

```text
src/
├── app/                 # Routes Next.js
│   ├── (auth)/          # Groupe de routes Auth (Layout spécifique)
│   │   ├── login/       # page.tsx
│   │   └── register/    # page.tsx
│   ├── (dashboard)/     # Groupe Espace Client/Admin (Sidebar layout)
│   │   ├── dashboard/   # page.tsx
│   │   └── reservations/# page.tsx
│   ├── admin/           # Routes Admin
│   │   ├── vehicles/    # CRUD Véhicules
│   │   └── interactions/# Check-in / Check-out
│   ├── vehicles/        # Public Catalog
│   │   ├── [id]/        # Page détail véhicule
│   │   └── page.tsx     # Liste
│   ├── layout.tsx       # Root Layout (Providers: QueryClient, Auth)
│   └── page.tsx         # Landing Page
├── components/
│   ├── ui/              # Shadcn Components
│   ├── shared/          # Navbar, Footer
│   └── features/        # Business Components (VehicleCard, ReservationForm)
├── lib/
│   ├── api.ts           # Instance Axios (BaseURL + Interceptors)
│   └── utils.ts         # Helpers
├── services/            # Services API (auth, vehicles, reservations)
├── store/               # Stores Zustand (useAuthStore)
└── types/               # Definitions TS
```

## 📱 Fonctionnalités & UX

### 1. Zone Publique
*   **Landing Page (`/`)** : Hero, Presentation.
*   **Catalogue (`/vehicles`)** :
    *   Grille de véhicules.
    *   **SSR** : Les données initiales peuvent être fetchées côté serveur si possible, ou client-side via React Query.
*   **Détail Véhicule (`/vehicles/[id]`)** :
    *   Infos, Photos (Next/Image), Status.
    *   Bouton "Réserver" (Redirige vers login si non connecté).

### 2. Client (Protected Route)
*   **Mes Réservations (`/dashboard/reservations`)** :
    *   Liste historique.
    *   Status badges (`PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).

### 3. Back-Office Admin (Protected Route - Role Guard)
*   **Gestion Véhicules (`/admin/vehicles`)** :
    *   Data Table (shadcn/ui table).
    *   Add/Edit Forms.
    *   **Upload Image** : Drag & Drop -> `POST /vehicles/:id/image`.
*   **Gestion Flotte Check-in/out (`/admin/interactions`)** :
    *   Liste des réservations actives ou à venir.
    *   **Action "Départ"** : Client prend le véhicule -> API `POST /reservations/:id/pickup`.
    *   **Action "Retour"** : Client rend le véhicule -> API `POST /reservations/:id/return`.

---

## 🔌 Guide d'Intégration API

**Base URL** : `http://localhost:3000`

### A. Authentification
*   **Stratégie** : JWT stocké (LocalStorage ou Cookie).
*   **Middleware** : Utiliser un HOC ou un Wrapper de Layout pour protéger les routes `/dashboard` et `/admin` côté client (redirection si pas de token ou mauvais rôle).

| Méthode | Endpoint | Payload |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | `{ email, password }` |
| `GET` | `/auth/profile` | (Bearer Token requis) |

### B. Gestion des Images (Next/Image)
Le backend retourne des URLs absolues MinIO (ex: `http://localhost:9000/...`).
*   Ajouter `localhost` et `minio` dans `next.config.js` > `images.domains`.
*   Utiliser `<Image src={vehicle.imageUrl} ... />` pour l'optimisation.

### C. Réservations & Workflow
| Endpoint | Action | Rôle |
| :--- | :--- | :--- |
| `POST /reservations` | Créer une demande | User |
| `GET /reservations` | Lister tout | Admin |
| `POST /reservations/:id/pickup` | **Démarrer Location** (Status -> IN_PROGRESS) | Admin |
| `POST /reservations/:id/return` | **Terminer Location** (Status -> COMPLETED) | Admin |

## 💡 Notes Dev
*   Utilisez `'use client'` pour les composants interactifs (Formulaires, Boutons).
*   Gérez les erreurs API (409 Conflict, 400 Bad Request) avec des Toasts (Sonner).
