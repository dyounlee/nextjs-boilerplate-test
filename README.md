# Next.js Boilerplate

Next.js 16 · Auth.js v5 · Prisma + PostgreSQL · Tailwind CSS v4 · shadcn/ui

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Auth.js v5 + Google OAuth |
| Database | PostgreSQL 16 + Prisma 7 |
| UI | Tailwind CSS v4 + shadcn/ui |
| Package manager | pnpm |
| Deploy | Docker Compose |

## Getting Started

### 1. Configure environment

```bash
cp .env.example .env
```

Fill in:
- `AUTH_SECRET`: `openssl rand -base64 32`
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/), add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI

### 2. Start services

```bash
docker compose up -d
```

### 3. Run database migrations

```bash
docker compose exec app prisma migrate deploy
```

> The runner image includes the Prisma CLI binary so migrations can be run inside the running container.

### 4. Open the app

Visit [http://localhost:3000](http://localhost:3000)

## Development

```bash
pnpm install
pnpm dev
```

Requires a running PostgreSQL instance. Update `DATABASE_URL` in `.env` to point to your local DB, then run:

```bash
pnpm db:migrate
```

## Testing

```bash
pnpm test:run
```
