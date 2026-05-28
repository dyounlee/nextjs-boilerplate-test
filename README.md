# Next.js Boilerplate

Next.js 16 · Auth.js v5 · Prisma + Neon · Tailwind CSS v4 · shadcn/ui

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Auth.js v5 + Google OAuth |
| Database | Neon serverless PostgreSQL + Prisma 7 |
| UI | Tailwind CSS v4 + shadcn/ui |
| Package manager | pnpm |
| Deploy | Docker Compose |

## Getting Started

### 1. Create a Neon database

1. Sign up at [neon.tech](https://neon.tech) and create a new project
2. Copy the connection string from the project dashboard

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL`: Neon connection string (from step 1)
- `AUTH_SECRET`: `openssl rand -base64 32`
- `NEXTAUTH_SECRET`: optional fallback if your deployment already uses the legacy NextAuth variable name
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/), add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI

### 3. Run database migrations

```bash
pnpm db:migrate
```

### 4. Start the app

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Deploy with Docker

```bash
docker compose up -d
```

Run migrations inside the container:

```bash
docker compose exec app prisma migrate deploy
```

## Testing

```bash
pnpm test:run
```
