# Pickleball Booking — Frontend

Next.js App Router client for the Pickleball Booking API.

## Stack

- **Next.js** (App Router)
- **Tailwind CSS** v4
- **Axios** — HTTP client
- **TanStack Query** — server state
- **Zustand** — client state (auth tokens)

## Structure

```
src/
├── app/                 # Routes (App Router)
├── components/
│   └── layout/          # AppShell, Header, Footer
├── config/              # env, site metadata
├── constants/           # routes, etc.
├── features/            # Feature modules (UI + hooks per domain)
├── hooks/               # Shared hooks
├── lib/
│   ├── api/             # Axios client + API types
│   └── utils/           # cn(), helpers
├── providers/           # React Query, global providers
├── services/            # API service functions per module
├── stores/              # Zustand stores
└── types/               # Shared TypeScript types
```

## Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

Backend API (default): `http://localhost:8080/api`

## Conventions

- Add pages under `src/app/`
- Add API calls in `src/services/{module}/`
- Add feature UI in `src/features/{module}/`
- Use `apiClient` from `@/lib/api/client`
- Use `ROUTES` from `@/constants/routes`
- Auth token: `useAuthStore` / `getAccessToken()` for Axios
