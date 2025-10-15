# TMS Frontend (React + Vite + TypeScript)

Frontend for the TMS backend (Spring Boot). Implements authentication via **Keycloak**, data fetching with **React Query**, UI with **MUI**, and a dev proxy to the backend.

## Prerequisites
- Node.js 20+
- Docker Desktop (for Keycloak/Postgres, if you run the whole stack locally)
- A running backend at `http://localhost:8081` (or change `VITE_API_BASE`)
- Keycloak realm `tms` with a public client `tms-web` (as in the backend compose)

## Getting started

```bash
cp .env.example .env
# update values if needed
npm install
npm run dev
```

Open **http://localhost:5173**. You will be redirected to Keycloak to log in. After login you can:
- Create a **broker**
- Create a **party**
- Create a **load**, then add **stops**, then update **status**

## Environment variables

- `VITE_API_BASE` — backend base URL (default `http://localhost:8081`)
- `VITE_KEYCLOAK_URL` — Keycloak URL (default `http://localhost:8080`)
- `VITE_KEYCLOAK_REALM` — Keycloak realm (default `tms`)
- `VITE_KEYCLOAK_CLIENT_ID` — Keycloak public client (default `tms-web`)

## Dev proxy
Vite proxies calls from `/api` to `VITE_API_BASE` so the browser avoids CORS during development.

## Production build
```bash
npm run build
npm run preview   # local preview
```

To serve behind Nginx:

```Dockerfile
# Dockerfile (production)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Notes
- The sample only covers a few flows (brokers/parties/loads). Extend similarly for assets, invoices, settlements, etc.
- The app auto-refreshes the Keycloak token ~every 20s.
