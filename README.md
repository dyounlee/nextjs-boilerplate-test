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
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/)
- `AUTH_URL`: the public base URL of the app, for example `http://localhost:3000` locally or `https://your-domain.com` in production

Google OAuth redirect URI:
- Local development: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.com/api/auth/callback/google`

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

## Deploy with GitHub Actions + Vercel

This repository includes a workflow that:

1. Runs `pnpm db:migrate:deploy` against the production database
2. Links the repo to your Vercel project
3. Pulls the Vercel project settings and environment variables
4. Builds locally with `vercel build`
5. Deploys the prebuilt output to Vercel production

Required GitHub secrets:
- `DATABASE_URL`
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`

Required Vercel project environment variables:
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_URL` or `NEXTAUTH_URL`

## Testing

```bash
pnpm test:run
```

## Troubleshooting

### `400 redirect_uri_mismatch`

Google rejected the login because the callback URL does not exactly match what is registered in the OAuth client.

Check the following:
- The redirect URI in Google Cloud Console matches the app URL exactly, including `http` vs `https`, `www`, port, and path.
- `AUTH_URL` or `NEXTAUTH_URL` is set to the same public base URL that users are visiting.
- You are not using `http://localhost:3000` in production.
- The authorized redirect URI includes `/api/auth/callback/google` at the end.

Examples:
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.com/api/auth/callback/google`
