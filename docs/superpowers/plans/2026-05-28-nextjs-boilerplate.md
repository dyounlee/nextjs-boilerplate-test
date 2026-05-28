# Next.js Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a minimal, self-hostable Next.js 15 boilerplate with Tailwind CSS v4, shadcn/ui, Auth.js v5 Google OAuth, Prisma + PostgreSQL, and Docker Compose.

**Architecture:** App Router with feature-based structure. Auth.js v5 uses a split config — edge-compatible `auth.config.ts` for middleware, full `auth.ts` with Prisma adapter for session management. Route protection via Next.js Middleware using JWT session strategy (Prisma adapter is not used at the edge; only for storing OAuth accounts and users).

**Tech Stack:** Next.js 15, next-auth@beta, @auth/prisma-adapter, Prisma 6, PostgreSQL 16, Tailwind CSS v4, shadcn/ui, pnpm, Vitest, Docker Compose

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/features/auth/auth.config.ts` | Edge-compatible Auth.js config (providers, pages, authorized callback) |
| `src/features/auth/auth.ts` | Full Auth.js config with Prisma adapter + JWT strategy |
| `src/features/auth/actions.ts` | `signInWithGoogle` and `signOutAction` Server Actions |
| `src/features/auth/components/sign-in-button.tsx` | Client component — Google sign-in form |
| `src/features/auth/components/sign-out-button.tsx` | Client component — sign-out form |
| `src/lib/db/prisma.ts` | Prisma client singleton (dev hot-reload safe) |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js GET/POST handler |
| `middleware.ts` | Route protection — unauthenticated /dashboard → /login |
| `src/app/layout.tsx` | Root layout (lang="ko", metadata) |
| `src/app/page.tsx` | Root page — redirects to /dashboard |
| `src/app/(auth)/login/page.tsx` | Login page with SignInButton |
| `src/app/(auth)/error/page.tsx` | Auth error display |
| `src/app/(protected)/dashboard/page.tsx` | Protected dashboard with SignOutButton |
| `prisma/schema.prisma` | Auth.js adapter tables (User, Account, Session, VerificationToken) |
| `vitest.config.ts` | Vitest config with React plugin and @/ alias |
| `src/test/setup.ts` | @testing-library/jest-dom global setup |
| `Dockerfile` | Multi-stage pnpm build, Next.js standalone output |
| `docker-compose.yml` | `app` + `db` services with healthcheck |
| `.env.example` | Environment variable template |
| `README.md` | Setup and development instructions |

---

### Task 1: Scaffold Next.js 15 project

**Files:**
- Create: entire project scaffold in `.`

- [ ] **Step 1: Run create-next-app**

```bash
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --no-git
```

When prompted interactively, choose: TypeScript ✓, Tailwind ✓, App Router ✓, src/ dir ✓, import alias `@/*`.

- [ ] **Step 2: Verify scaffold**

```bash
ls src/app
```

Expected: `favicon.ico  globals.css  layout.tsx  page.tsx`

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 with pnpm"
```

---

### Task 2: Configure standalone output

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace next.config.ts**

```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
}

export default nextConfig
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "chore: enable standalone output for Docker"
```

---

### Task 3: Install all dependencies

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Install production dependencies**

```bash
pnpm add next-auth@beta @auth/prisma-adapter @prisma/client
```

- [ ] **Step 2: Install Prisma CLI**

```bash
pnpm add -D prisma
```

- [ ] **Step 3: Install test dependencies**

```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install auth, db, and test dependencies"
```

---

### Task 4: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

- [ ] **Step 2: Create src/test/setup.ts**

```ts
import "@testing-library/jest-dom"
```

- [ ] **Step 3: Add test scripts to package.json**

In the `"scripts"` object in `package.json`, add:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 4: Write smoke test**

Create `src/test/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest"

describe("test setup", () => {
  it("vitest is configured correctly", () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 5: Run test to verify setup**

```bash
pnpm test:run
```

Expected: `1 passed`

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/test/ package.json
git commit -m "chore: configure Vitest with jsdom and React Testing Library"
```

---

### Task 5: Initialize shadcn/ui

**Files:**
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/button.tsx`

- [ ] **Step 1: Initialize shadcn with defaults**

```bash
pnpm dlx shadcn@latest init -d
```

- [ ] **Step 2: Add Button component**

```bash
pnpm dlx shadcn@latest add button
```

- [ ] **Step 3: Verify**

```bash
ls src/components/ui
```

Expected: `button.tsx`

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: initialize shadcn/ui with Button component"
```

---

### Task 6: Create Prisma schema

**Files:**
- Create: `prisma/schema.prisma`
- Modify: `package.json`

- [ ] **Step 1: Initialize Prisma**

```bash
pnpm dlx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and `.env` with a `DATABASE_URL` placeholder.

- [ ] **Step 2: Replace prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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

- [ ] **Step 3: Add db scripts to package.json**

In the `"scripts"` object, add:
```json
"db:generate": "prisma generate",
"db:migrate": "prisma migrate dev",
"db:migrate:deploy": "prisma migrate deploy",
"db:studio": "prisma studio"
```

- [ ] **Step 4: Generate Prisma client**

```bash
pnpm db:generate
```

Expected: `Generated Prisma Client` with no errors.

- [ ] **Step 5: Commit**

```bash
git add prisma/ package.json .env
git commit -m "feat: add Prisma schema with Auth.js adapter tables"
```

---

### Task 7: TDD — Create Prisma client singleton

**Files:**
- Create: `src/lib/db/prisma.ts`
- Create: `src/test/lib/prisma.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/test/lib/prisma.test.ts`:
```ts
import { vi, describe, it, expect, beforeEach } from "vitest"

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({ _mock: true })),
}))

describe("prisma singleton", () => {
  beforeEach(() => {
    vi.resetModules()
    delete (globalThis as Record<string, unknown>).prisma
  })

  it("creates a PrismaClient instance", async () => {
    const { prisma } = await import("@/lib/db/prisma")
    expect(prisma).toBeDefined()
  })

  it("returns the same instance on repeated import", async () => {
    const { prisma: a } = await import("@/lib/db/prisma")
    const { prisma: b } = await import("@/lib/db/prisma")
    expect(a).toBe(b)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test:run src/test/lib/prisma.test.ts
```

Expected: `FAIL` — `Cannot find module '@/lib/db/prisma'`

- [ ] **Step 3: Create src/lib/db/prisma.ts**

```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pnpm test:run src/test/lib/prisma.test.ts
```

Expected: `2 passed`

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/prisma.ts src/test/lib/prisma.test.ts
git commit -m "feat: add Prisma client singleton"
```

---

### Task 8: Create Auth.js edge-compatible config

**Files:**
- Create: `src/features/auth/auth.config.ts`

- [ ] **Step 1: Create src/features/auth/auth.config.ts**

```ts
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) return isLoggedIn
      return true
    },
  },
} satisfies NextAuthConfig
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/auth.config.ts
git commit -m "feat: add edge-compatible Auth.js config"
```

---

### Task 9: Create Auth.js full config with Prisma adapter

**Files:**
- Create: `src/features/auth/auth.ts`

- [ ] **Step 1: Create src/features/auth/auth.ts**

```ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { authConfig } from "./auth.config"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/auth.ts
git commit -m "feat: add Auth.js config with Prisma adapter"
```

---

### Task 10: Create Auth.js route handler

**Files:**
- Create: `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create route handler**

```ts
import { handlers } from "@/features/auth/auth"

export const { GET, POST } = handlers
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/
git commit -m "feat: add Auth.js API route handler"
```

---

### Task 11: Create middleware

**Files:**
- Create: `middleware.ts` (project root, next to `package.json`)

- [ ] **Step 1: Create middleware.ts**

```ts
import NextAuth from "next-auth"
import { authConfig } from "@/features/auth/auth.config"

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: ["/dashboard/:path*"],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add middleware for route protection"
```

---

### Task 12: TDD — Create Server Actions

**Files:**
- Create: `src/features/auth/actions.ts`
- Create: `src/test/features/auth/actions.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/test/features/auth/actions.test.ts`:
```ts
import { vi, describe, it, expect, beforeEach } from "vitest"

const mockSignIn = vi.fn()
const mockSignOut = vi.fn()

vi.mock("@/features/auth/auth", () => ({
  signIn: mockSignIn,
  signOut: mockSignOut,
}))

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it("signInWithGoogle calls signIn with google and /dashboard redirect", async () => {
    const { signInWithGoogle } = await import("@/features/auth/actions")
    await signInWithGoogle()
    expect(mockSignIn).toHaveBeenCalledWith("google", { redirectTo: "/dashboard" })
  })

  it("signOutAction calls signOut with /login redirect", async () => {
    const { signOutAction } = await import("@/features/auth/actions")
    await signOutAction()
    expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: "/login" })
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test:run src/test/features/auth/actions.test.ts
```

Expected: `FAIL` — `Cannot find module '@/features/auth/actions'`

- [ ] **Step 3: Create src/features/auth/actions.ts**

```ts
"use server"

import { signIn, signOut } from "@/features/auth/auth"

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" })
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pnpm test:run src/test/features/auth/actions.test.ts
```

Expected: `2 passed`

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/actions.ts src/test/features/auth/actions.test.ts
git commit -m "feat: add signIn/signOut server actions"
```

---

### Task 13: TDD — Create SignInButton component

**Files:**
- Create: `src/features/auth/components/sign-in-button.tsx`
- Create: `src/test/features/auth/sign-in-button.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/test/features/auth/sign-in-button.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/features/auth/actions", () => ({
  signInWithGoogle: vi.fn(),
}))

describe("SignInButton", () => {
  it("renders a button with Google sign-in text", async () => {
    const { SignInButton } = await import(
      "@/features/auth/components/sign-in-button"
    )
    render(<SignInButton />)
    expect(
      screen.getByRole("button", { name: /google로 로그인/i })
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test:run src/test/features/auth/sign-in-button.test.tsx
```

Expected: `FAIL` — `Cannot find module '@/features/auth/components/sign-in-button'`

- [ ] **Step 3: Create sign-in-button.tsx**

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/features/auth/actions"

export function SignInButton() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit">Google로 로그인</Button>
    </form>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
pnpm test:run src/test/features/auth/sign-in-button.test.tsx
```

Expected: `1 passed`

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/components/sign-in-button.tsx src/test/features/auth/sign-in-button.test.tsx
git commit -m "feat: add SignInButton component"
```

---

### Task 14: Create SignOutButton component

**Files:**
- Create: `src/features/auth/components/sign-out-button.tsx`

- [ ] **Step 1: Create sign-out-button.tsx**

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { signOutAction } from "@/features/auth/actions"

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline">
        로그아웃
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/features/auth/components/sign-out-button.tsx
git commit -m "feat: add SignOutButton component"
```

---

### Task 15: Update root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace src/app/layout.tsx**

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "App",
  description: "Next.js Boilerplate",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "chore: update root layout lang and metadata"
```

---

### Task 16: Create root redirect and login page

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Replace src/app/page.tsx**

```tsx
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
```

- [ ] **Step 2: Create src/app/(auth)/login/page.tsx**

```tsx
import { auth } from "@/features/auth/auth"
import { redirect } from "next/navigation"
import { SignInButton } from "@/features/auth/components/sign-in-button"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold tracking-tight">로그인</h1>
        <SignInButton />
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx "src/app/(auth)/"
git commit -m "feat: add root redirect and login page"
```

---

### Task 17: Create error page and dashboard page

**Files:**
- Create: `src/app/(auth)/error/page.tsx`
- Create: `src/app/(protected)/dashboard/page.tsx`

- [ ] **Step 1: Create src/app/(auth)/error/page.tsx**

```tsx
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">인증 오류</h1>
        <p className="text-muted-foreground">
          로그인 중 문제가 발생했습니다.
        </p>
        <Link href="/login" className="underline underline-offset-4">
          로그인으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create src/app/(protected)/dashboard/page.tsx**

```tsx
import { auth } from "@/features/auth/auth"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/features/auth/components/sign-out-button"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <SignOutButton />
      </div>
      <p className="mt-4 text-muted-foreground">
        안녕하세요, {session.user?.name ?? "사용자"}님
      </p>
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(auth)/error/" "src/app/(protected)/"
git commit -m "feat: add error page and dashboard page"
```

---

### Task 18: Create .env.example

**Files:**
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Create .env.example**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/appdb"

# Auth.js
AUTH_SECRET=""           # Run: openssl rand -base64 32
AUTH_GOOGLE_ID=""        # From Google Cloud Console
AUTH_GOOGLE_SECRET=""    # From Google Cloud Console
AUTH_URL="http://localhost:3000"

# PostgreSQL (docker-compose)
POSTGRES_DB="appdb"
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
```

- [ ] **Step 2: Ensure .gitignore includes .env**

Add to `.gitignore` if not already present:
```
.env
.env.local
```

- [ ] **Step 3: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: add .env.example"
```

---

### Task 19: Create Dockerfile

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm dlx prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

- [ ] **Step 2: Create .dockerignore**

```
.git
.gitignore
.env
.env.local
node_modules
.next
README.md
docs/
```

- [ ] **Step 3: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "chore: add multi-stage Dockerfile with pnpm"
```

---

### Task 20: Create docker-compose.yml

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: Create docker-compose.yml**

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-appdb}
      POSTGRES_USER: ${POSTGRES_USER:-user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-user}"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: ${DATABASE_URL}
      AUTH_SECRET: ${AUTH_SECRET}
      AUTH_GOOGLE_ID: ${AUTH_GOOGLE_ID}
      AUTH_GOOGLE_SECRET: ${AUTH_GOOGLE_SECRET}
      AUTH_URL: ${AUTH_URL:-http://localhost:3000}

volumes:
  postgres_data:
```

- [ ] **Step 2: Commit**

```bash
git add docker-compose.yml
git commit -m "chore: add docker-compose with app and db services"
```

---

### Task 21: Create README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README.md**

````markdown
# Next.js Boilerplate

Next.js 15 · Auth.js v5 · Prisma + PostgreSQL · Tailwind CSS v4 · shadcn/ui

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Auth.js v5 + Google OAuth |
| Database | PostgreSQL 16 + Prisma 6 |
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
docker compose exec app pnpm db:migrate:deploy
```

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
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with setup instructions"
```

---

### Task 22: Run full test suite

- [ ] **Step 1: Run all tests**

```bash
pnpm test:run
```

Expected output:
```
✓ src/test/smoke.test.ts (1 test)
✓ src/test/lib/prisma.test.ts (2 tests)
✓ src/test/features/auth/actions.test.ts (2 tests)
✓ src/test/features/auth/sign-in-button.test.tsx (1 test)

Test Files  4 passed (4)
Tests       6 passed (6)
```

- [ ] **Step 2: Fix any failures**

If any test fails, check the error message, fix the relevant file, re-run, and commit the fix before continuing.
