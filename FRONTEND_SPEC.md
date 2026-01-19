# 🎨 Togo Car Rental - Spécifications Frontend React (Pure)

Ce document sert de référence technique pour le développement du frontend initial.
⚠️ **Important** : Le développement se fait en **React "Pur" (Vite)**. Une migration vers Next.js est prévue dans une phase ultérieure. L'architecture doit donc rester propre et standard pour faciliter cette transition.

## 🛠 Stack Technique

*   **Build Tool** : [Vite](https://vitejs.dev/) (React Template).
*   **Langage** : TypeScript (Strict Mode).
*   **Routing** : [React Router v6+](https://reactrouter.com/).
*   **Styling** : Tailwind CSS.
*   **Components UI** : [Shadcn/UI](https://ui.shadcn.com/) (Compatible Vite via CLI).
*   **State Management** : Zustand (Global) + TanStack Query (Server State/Caching).
*   **Formulaires** : React Hook Form + Zod (Validation).
*   **HTTP Client** : Axios (avec intercepteur pour injecter le JWT).

## 🏗 Architecture du Projet (Vite Standard)

```text
src/
├── assets/              # Images statiques, fonts, styles globaux
├── components/
│   ├── ui/              # Composants Shadcn (Button, Input, Card...)
│   ├── layout/          # Layouts (Navbar, Footer, SidebarAdmin)
│   └── features/        # Composants métier (VehicleList, BookingForm)
├── hooks/               # Custom Hooks (useAuth, useDebounce)
├── lib/
│   ├── axios.ts         # Instance Axios configurée (BaseUrl + Interceptors)
│   └── utils.ts         # Helpers (cn, formatting)
├── pages/               # Pages (Vues pour React Router)
│   ├── public/          # Home, Login, Register, VehicleCatalog
│   ├── dashboard/       # UserDashboard, UserReservations 
│   └── admin/           # AdminDashboard, ManageVehicles
├── services/            # Appels API (authService.ts, vehicleService.ts)
├── store/               # Stores Zustand (authStore.ts)
├── types/               # Interfaces TypeScript (User, Vehicle, etc.)
├── App.tsx              # Configuration des Routes (RouterProvider)
└── main.tsx             # Point d'entrée (Providers: QueryClient, Auth)
```

## 📱 Fonctionnalités & Routing (React Router)

### 1. Zone Publique
*   `/` : Landing Page (Hero, Features).
*   `/login` : Formulaire de connexion.
*   `/register` : Formulaire d'inscription.
*   `/vehicles` : Catalogue (Grille avec filtres).
*   `/vehicles/:id` : Page détail (Infos, Photo, Action Réserver).

### 2. Espace Client (Private Route - User)
*   `/dashboard/reservations` : Historique et status des réservations.

### 3. Back-Office (Private Route - Admin)
*   `/admin/vehicles` : CRUD Véhicules (Table).
*   `/admin/vehicles/new` : Création.
*   `/admin/vehicles/:id/edit` : Édition & Upload Image.
*   `/admin/reservations` : Gestion des réservations (Validation).

---

## 🔌 Guide d'Intégration API

**Base URL** : `http://localhost:3000` (Proxy Vite à configurer si besoin pour éviter CORS en dev).

### A. Authentification (AuthModule)
Stockage du Token : `LocalStorage` (Simple pour React Pur) ou Cookie httpOnly.
Header requis : `Authorization: Bearer <token>`

| Méthode | Endpoint          | Payload (Body) | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | `{ email, password, firstName, lastName }` | Création de compte |
| `POST` | `/auth/login` | `{ email, password }` | Retourne `{ access_token }` |
| `GET` | `/auth/profile` | - | Vérification de session au chargement de l'app |

### B. Véhicules (VehiclesModule)

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/vehicles` | Liste publique |
| `GET` | `/vehicles/:id` | Détail |
| `POST` | `/vehicles/:id/image` | **Upload Image** (Admin). Body: FormData(`file`) |

### C. Réservations (ReservationsModule)

| Méthode | Endpoint | Payload |
| :--- | :--- | :--- |
| `POST` | `/reservations` | `{ vehicleId, startDate, endDate }` |
| `GET` | `/reservations/my` | Liste User |

## 💡 Notes Importantes pour le Développeur

1.  **MinIO & Images** :
    Les URLs d'images arrivent sous forme absolue (ex: `http://127.0.0.1:9000/bucket/...`).
    *   Utilisez une balise `<img>` standard.
    *   Si l'image ne charge pas (problème Docker vs Localhost), vérifiez que l'URL est accessible depuis le navigateur.
2.  **Dates** :
    L'API utilise UTC. Pensez à convertir en locale pour l'affichage utilisateur.
3.  **Migration Future** :
    Gardez la logique métier dans `services/` et `hooks/` pour faciliter le passage futur à Next.js (Server Actions / Server Components).
