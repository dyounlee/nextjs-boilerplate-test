# Next.js Boilerplate Design

**Date:** 2026-05-28
**Status:** Approved

## Overview

A minimal, self-hostable Next.js boilerplate with authentication, database, and Google login. Designed as a clean starting point for new projects.

**Stack:**
- Next.js 15 (App Router)
- Auth.js v5 (`next-auth@beta`)
- Prisma 6 + PostgreSQL 16
- Tailwind CSS v4
- shadcn/ui
- Docker Compose (self-hosted)
- pnpm (패키지 매니저)

---

## Architecture

All requests flow through Next.js Middleware, which checks session state and redirects unauthenticated users to `/login`. Server Components re-confirm session via `auth()`. Database access is exclusively through Prisma (server-side only).

```
Browser
  └─ Next.js Middleware        ← session check on every request
       ├─ unauthenticated → redirect /login
       └─ authenticated → pass through
            └─ Server Component: auth()
                 └─ Server Action → Prisma → PostgreSQL
```

**Deployment:** Two Docker containers via Docker Compose — `app` (Next.js, Node 22 Alpine) and `db` (PostgreSQL 16 Alpine). A single `.env` file configures both.

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Redirects to `/dashboard` |
| `/login` | Public | Google login button |
| `/error` | Public | Auth error display |
| `/dashboard` | Protected | Authenticated landing page |
| `/api/auth/[...nextauth]` | Public | Auth.js handler |

---

## Project Structure

```
nextjs-boilerplate/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── error/page.tsx
│   │   ├── (protected)/
│   │   │   └── dashboard/page.tsx
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── features/
│   │   └── auth/
│   │       ├── auth.ts             ← Auth.js config (providers, callbacks)
│   │       ├── actions.ts          ← signIn/signOut Server Actions
│   │       └── components/
│   │           └── sign-in-button.tsx
│   ├── lib/
│   │   └── db/
│   │       └── prisma.ts           ← Prisma client singleton
│   └── components/
│       └── ui/                     ← shadcn auto-generated components
├── prisma/
│   └── schema.prisma
├── middleware.ts
├── docker-compose.yml
├── Dockerfile
├── .env.example
└── README.md
```

---

## Auth Flow

**Login:**
1. User visits `/login`
2. Clicks "Sign in with Google" (calls Server Action)
3. Redirected to Google OAuth
4. Callback → Auth.js Prisma Adapter saves `User` + `Account` to DB
5. Session cookie issued → redirect to `/dashboard`

**Logout:**
1. User clicks logout (calls Server Action)
2. Session cookie deleted → redirect to `/login`

---

## Database Schema

Auth.js Prisma Adapter required tables only. Additional app tables can be added to `schema.prisma`.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

---

## Route Protection

`middleware.ts` protects all routes under `/dashboard`. Any unauthenticated request is redirected to `/login`.

```ts
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## Docker Setup

**Dockerfile** — multi-stage build (deps → builder → runner), `output: 'standalone'` for minimal image size. pnpm을 패키지 매니저로 사용 (`corepack enable` + `pnpm install --frozen-lockfile`).

**docker-compose.yml:**
- `db`: PostgreSQL 16 Alpine with healthcheck (`pg_isready`)
- `app`: depends on `db` health, binds port 3000

**`.env.example`:**
```bash
DATABASE_URL="postgresql://user:password@db:5432/appdb"
AUTH_SECRET=""           # openssl rand -base64 32
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_URL="http://localhost:3000"
```

**Getting started:**
```bash
cp .env.example .env
# fill in AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
docker compose up -d
docker compose exec app pnpm prisma migrate deploy
```

---

## Out of Scope

- Landing page / marketing sections
- User profile / settings pages
- Dark mode toggle
- Email/password login
- Role-based access control
