# Admin Dashboard (React + TypeScript)

Dashboard d’administration (frontend) pour gérer une API Express/Node.js (backend) avec Prisma/MySQL.

Darija (tl;dr): had l-front kaytssal m3a l-back b routes b7al `/clients/get` / `/clients/create` / `/clients/update/:id` / `/clients/delete/:id` … w kaydir login b JWT.

## Stack
- React + TypeScript + Vite
- React Router
- Axios (JWT dans `Authorization: Bearer <token>`)

## Lancer le projet
```bash
npm install
npm run dev
```

Frontend:
- http://localhost:5173

Backend attendu:
- http://localhost:5000

## Auth (JWT)
- Login: `POST /login` (backend)
- Token stocké dans `localStorage` sous la clé `token`
- Routes protégées: tout ce qui est sous `/dashboard`, `/clients`, `/produits`, `/vendeurs`, `/ventes`, `/categories`

Implémentation:
- [auth.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/services/auth.ts)
- [ProtectedRoute.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/routes/ProtectedRoute.tsx)

## Routes API utilisées (alignées avec le backend)
Le backend expose des routes de la forme:
- `GET /{resource}/get`
- `POST /{resource}/create`
- `PUT /{resource}/update/:id`
- `DELETE /{resource}/delete/:id`

Le frontend appelle simplement `listResource('/clients')`, `createResource('/clients', ...)`, etc.
La transformation vers `/clients/get`, `/clients/create`, ... est faite dans:
- [resources.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/services/resources.ts)

Ressources gérées:
- Clients, Produits, Vendeurs, Ventes, Categories

## Pages
- Login: [LoginPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/LoginPage.tsx)
- Register (création Vendeur): [RegisterPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/RegisterPage.tsx)
- Dashboard: [DashboardPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/DashboardPage.tsx)
- CRUD:
  - [ClientsPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/ClientsPage.tsx)
  - [ProduitsPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/ProduitsPage.tsx)
  - [VendeursPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/VendeursPage.tsx)
  - [VentesPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/VentesPage.tsx)
  - [CategoriesPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/CategoriesPage.tsx)

## CORS (important)
Si `api.ts` pointe vers `http://localhost:5000`, le backend doit autoriser CORS pour `http://localhost:5173`.

Alternative (recommandée en dev): utiliser un proxy Vite et un `baseURL` en `/api`.
- Proxy: [vite.config.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/vite.config.ts)
- Adapter le `baseURL` côté frontend si besoin: [api.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/services/api.ts)

## Scripts
- `npm run dev` : développement
- `npm run build` : build production
- `npm run lint` : lint
