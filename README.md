# snip/ — URL Shortener

A full-stack URL shortener built with **React (Vite)**, **Node.js/Express**, **PostgreSQL**, and **Redis** — with a custom-designed frontend, Docker support, and a complete GitHub Actions CI/CD pipeline.

- Long URLs are stored in **PostgreSQL** (source of truth, click analytics)
- **Redis** caches short-code lookups so redirects stay fast
- Frontend has a custom "link folding" animation, QR code generation, copy-to-clipboard, and a live history of recently shortened links

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Run Locally (without Docker)](#1-run-locally-without-docker)
4. [Run Locally with Docker Compose (recommended)](#2-run-locally-with-docker-compose-recommended)
5. [API Reference](#api-reference)
6. [Deploying to Production](#deploying-to-production)
7. [Setting Up CI/CD (GitHub Actions)](#setting-up-cicd-github-actions)
8. [Environment Variables Reference](#environment-variables-reference)
9. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── config/         # PostgreSQL + Redis connection setup
│   │   ├── controllers/    # Request handlers / business logic
│   │   ├── models/         # Database queries
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Error handling
│   │   ├── utils/          # Short code generator
│   │   ├── db/init.sql     # Reference schema
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Hero, ShortenForm, ResultCard, LinkHistory, Footer
│   │   ├── api/client.js   # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf          # Serves the built SPA in production
│   ├── .env.example
│   └── package.json
├── .github/workflows/ci-cd.yml   # Full CI/CD pipeline
├── docker-compose.yml            # One-command local environment
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Cache | Redis (short-code lookup cache) |
| Containers | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Suggested hosting | Render (backend + Postgres + Redis) · Vercel (frontend) |

---

## 1. Run Locally (without Docker)

### Prerequisites
- Node.js 20+
- PostgreSQL running locally (or a free cloud instance, e.g. [Neon](https://neon.tech))
- Redis running locally (or a free cloud instance, e.g. [Upstash](https://upstash.com))

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env and fill in DATABASE_URL and REDIS_URL

npm install
npm run dev          # starts on http://localhost:5000
```

The `urls` table is created automatically on first startup — no manual migration needed.

### Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_BASE_URL should point at your backend, e.g. http://localhost:5000

npm install
npm run dev          # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 2. Run Locally with Docker Compose (recommended)

This spins up PostgreSQL, Redis, the backend, and the frontend together — no manual installs needed.

```bash
# From the project root
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Postgres: `localhost:5432` (user: `postgres`, password: `postgres`, db: `urlshortener`)
- Redis: `localhost:6379`

Stop everything:
```bash
docker compose down

# To also wipe the database volume:
docker compose down -v
```

---

## API Reference

Base URL: your backend's address (e.g. `http://localhost:5000`)

### `POST /api/shorten`
Create a short link.

**Body:**
```json
{ "url": "https://example.com/a/very/long/path", "customCode": "optional-custom-code" }
```

**Response `201`:**
```json
{
  "shortCode": "aZ3kLp9",
  "shortUrl": "http://localhost:5000/r/aZ3kLp9",
  "originalUrl": "https://example.com/a/very/long/path",
  "clicks": 0,
  "createdAt": "2026-08-04T10:00:00.000Z"
}
```

### `GET /r/:code`
Redirects (`302`) to the original URL and increments the click counter.

### `GET /api/stats/:code`
Returns the record for one short code, including current click count.

### `GET /api/urls`
Returns the 20 most recently created links.

### `GET /health`
Health check endpoint — used by Docker `HEALTHCHECK` and can be used for uptime monitoring.

---

## Deploying to Production

This project is designed for **Render** (backend + databases) and **Vercel** (frontend), since both have generous free tiers and work well with Docker/GitHub.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### Step 2 — Create a PostgreSQL database

- Render → New → PostgreSQL (or use [Neon](https://neon.tech) / [Supabase](https://supabase.com) free tier)
- Copy the connection string — you'll need it as `DATABASE_URL`

### Step 3 — Create a Redis instance

- Render → New → Redis (or use [Upstash](https://upstash.com) free tier)
- Copy the connection URL — you'll need it as `REDIS_URL`

### Step 4 — Deploy the backend on Render

- Render → New → Web Service → connect your GitHub repo
- Root directory: `backend`
- Environment: **Docker** (Render will detect the `Dockerfile`)
- Add environment variables (see [reference table](#environment-variables-reference) below):
  - `DATABASE_URL`, `DB_SSL=true`, `REDIS_URL`, `BASE_URL` (your Render service URL, e.g. `https://url-shortener-backend.onrender.com`), `CORS_ORIGIN` (your Vercel frontend URL)
- Deploy. Once live, copy the service URL.
- Go to **Settings → Deploy Hook** and copy the hook URL — you'll need it for CI/CD.

### Step 5 — Deploy the frontend on Vercel

- Vercel → Add New Project → import your GitHub repo
- Root directory: `frontend`
- Framework preset: **Vite**
- Environment variable: `VITE_API_BASE_URL` = your Render backend URL
- Deploy. Once live, copy your Vercel URL and set it as `CORS_ORIGIN` on the Render backend (redeploy the backend after).

At this point your app is fully live and manually deployable. The next section makes deployments automatic on every push to `main`.

---

## Setting Up CI/CD (GitHub Actions)

The workflow at `.github/workflows/ci-cd.yml` does the following on every push to `main`:

1. Runs backend and frontend tests/build checks (on every push **and** every PR)
2. Builds Docker images for backend and frontend, pushes them to Docker Hub
3. Triggers a Render deploy (backend) and a Vercel deploy (frontend)

On pull requests, only the test/build-check jobs run — nothing is built, pushed, or deployed, so it's safe to open PRs freely.

### Required GitHub Secrets

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**, and add:

| Secret | Where to get it |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub → Account Settings → Security → New Access Token |
| `RENDER_DEPLOY_HOOK` | Render backend service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | Vercel → Settings → Tokens → Create Token |
| `VITE_API_BASE_URL` | Your Render backend URL (used to build the frontend Docker image, if you use it) |

### Optional: require manual approval before production deploys

Repo → **Settings → Environments → New environment** → name it `production` → enable **Required reviewers**. The `deploy-backend` and `deploy-frontend` jobs are already scoped to the `production` environment, so once this is set, GitHub will pause and wait for approval before deploying.

### Triggering it

Just push to `main`:
```bash
git push origin main
```
Watch it run under your repo's **Actions** tab.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `5000` |
| `NODE_ENV` | Environment name | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `DB_SSL` | Enable SSL for Postgres (needed on most cloud providers) | `true` |
| `REDIS_URL` | Redis connection string | `redis://host:6379` |
| `BASE_URL` | Public URL of this backend, used to build short links | `https://your-backend.onrender.com` |
| `CORS_ORIGIN` | Comma-separated allowed frontend origin(s) | `https://your-app.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | URL of the backend API | `https://your-backend.onrender.com` |

---

## Troubleshooting

**Backend can't connect to PostgreSQL on Render/Neon:** make sure `DB_SSL=true` is set — most managed Postgres providers require SSL.

**CORS errors in the browser:** double-check `CORS_ORIGIN` on the backend matches your frontend's exact URL (no trailing slash).

**Redirects work but click counts don't update immediately:** clicks are written to PostgreSQL on every redirect; if you just changed `DATABASE_URL`, restart the backend.

**Docker Compose fails on `depends_on: condition: service_healthy`:** make sure you're using Docker Compose v2+ (`docker compose`, not the older standalone `docker-compose`).

**GitHub Actions deploy job fails with 401/403:** your secret (`VERCEL_TOKEN`, `RENDER_DEPLOY_HOOK`, or `DOCKERHUB_TOKEN`) is missing, expired, or misnamed — regenerate it and update the repo secret.
