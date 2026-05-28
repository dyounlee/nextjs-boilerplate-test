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
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: create OAuth 2.0 credentials in [Google Cloud Console](https://console.cloud.google.com/) (`GOOGLE_ID` and `GOOGLE_SECRET` are also accepted)
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

## Deploy with Vercel

The repository includes a [`vercel.json`](./vercel.json) build override that runs `pnpm db:migrate:deploy` on production builds before `pnpm build`.

Make sure the Vercel project has these environment variables in the correct scope:
- `DATABASE_URL`
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
