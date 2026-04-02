# Rapport — Admin Dashboard (React) + API Express

## 1) Contexte
Le projet est composé de deux parties:
- Backend: Express/Node.js + Prisma + MySQL/MariaDB
- Frontend: React + TypeScript (Vite) — dashboard admin

Objectif: consommer l’API REST et gérer les modèles:
- Clients, Produits, Vendeurs, Ventes, Categories

## 2) Problème rencontré
Dans le frontend, les appels étaient faits avec des chemins “REST classiques” comme:
- `GET /clients`

Mais le backend expose les routes sous la forme:
- `GET /clients/get`
- `POST /clients/create`
- `PUT /clients/update/:id`
- `DELETE /clients/delete/:id`

Résultat: erreurs 404 côté frontend lors des lectures et opérations CRUD.

## 3) Solution implémentée (côté frontend)
Au lieu de modifier tous les appels un par un dans chaque page, la correction est centralisée dans le service CRUD.

### 3.1 Mapping automatique des endpoints
Le fichier [resources.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/services/resources.ts) transforme:
- `listResource('/clients')` → `GET /clients/get`
- `createResource('/clients', body)` → `POST /clients/create`
- `updateResource('/clients', id, body)` → `PUT /clients/update/:id`
- `deleteResource('/clients', id)` → `DELETE /clients/delete/:id`

Avantage: toutes les pages (ClientsPage, ProduitsPage, …) continuent d’utiliser des appels simples et cohérents, sans duplication de logique.

### 3.2 Dashboard (stats)
Le backend ne fournit pas `GET /stats` (route absente). Le dashboard calcule donc les statistiques en appelant:
- `GET /clients/get`
- `GET /produits/get`
- `GET /ventes/get`
- `GET /categories/get`

Implémentation: [stats.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/services/stats.ts)

## 4) Authentification
- Login: `POST /login`
- Le token JWT est stocké en `localStorage` sous la clé `token`
- Les requêtes Axios ajoutent automatiquement `Authorization: Bearer <token>`

Fichiers:
- [auth.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/services/auth.ts)
- [api.ts](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/services/api.ts)
- [ProtectedRoute.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/routes/ProtectedRoute.tsx)

## 5) Pages CRUD (exemples)
Pages principales:
- Clients: [ClientsPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/ClientsPage.tsx)
- Produits: [ProduitsPage.tsx](file:///c:/Users/Jdigo/OneDrive/Documentos/front%20node/src/pages/ProduitsPage.tsx)
- Vendeurs, Ventes, Categories: pages dédiées

Relations (UI):
- Client: sélection d’un vendeur via dropdown (liste vendeurs)
- Produit: sélection d’une catégorie via dropdown (liste catégories)
- Vente: sélection produit + client via dropdowns

## 6) Vérifications techniques
Frontend:
- `npm run lint` OK
- `npm run build` OK

Test API (exemple):
- `GET http://localhost:5000/clients/get` → 200 (OK)

## 7) Points d’attention (CORS)
Si le frontend appelle directement `http://localhost:5000`, le backend doit autoriser CORS pour `http://localhost:5173`.
En alternative (dev), un proxy Vite peut être utilisé.

## 8) Résultat
Après correction:
- Les chemins frontend correspondent aux routes Express
- La liste des données s’affiche correctement dans les tableaux
- Les opérations Create/Update/Delete sont alignées avec `/create`, `/update/:id`, `/delete/:id`

