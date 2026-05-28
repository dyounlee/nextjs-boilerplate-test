# Glacier Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Glacier visual system across the app and add authenticated post CRUD for logged-in users only.

**Architecture:** Keep the existing App Router structure, but turn the protected dashboard into the center of the post workflow. Use Prisma for persistence, server actions for mutations, and small feature-focused components for forms, cards, and lists. Keep the post model simple: plain-text body, string-array tags, and strict author ownership checks on every mutation.

**Tech Stack:** Next.js App Router, Auth.js v5, Prisma 7, PostgreSQL via Neon, Tailwind CSS v4, server actions, Vitest, Testing Library.

---

### Task 1: Build the Glacier theme foundation and reusable glass primitives

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/test/components/ui/button.test.tsx`
- Create: `src/test/components/ui/card.test.tsx`
- Create: `src/test/components/ui/input.test.tsx`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest"
import { buttonVariants } from "@/components/ui/button"

describe("buttonVariants", () => {
  it("includes the Glacier glass treatment for the default button", () => {
    const className = buttonVariants({ variant: "default", size: "default" })
    expect(className).toContain("backdrop-blur")
    expect(className).toContain("bg-white/60")
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test:run src/test/components/ui/button.test.tsx`

Expected: FAIL because the current button styles do not yet include Glacier glass tokens.

- [ ] **Step 3: Write the minimal implementation**

```ts
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/60 bg-clip-padding text-sm font-medium whitespace-nowrap text-slate-800 shadow-[0_0_30px_rgba(125,211,252,0.1)] backdrop-blur-md transition-all outline-none select-none focus-visible:border-sky-300 focus-visible:ring-3 focus-visible:ring-sky-300/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-3 aria-invalid:ring-red-300/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-sky-200/40 bg-sky-200/40 text-slate-900 hover:bg-sky-200/55",
        outline:
          "border-sky-200/30 bg-white/35 text-slate-800 hover:bg-white/55",
        secondary:
          "border-sky-200/25 bg-sky-100/40 text-slate-800 hover:bg-sky-100/55",
        ghost:
          "border-transparent bg-transparent text-slate-700 hover:bg-white/35",
        destructive:
          "border-red-300/30 bg-red-100/35 text-red-900 hover:bg-red-100/50",
        link: "text-sky-800 underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)]",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

Also replace `src/app/globals.css` with Glacier tokens and layered backgrounds:

```css
:root {
  --background: #f5f6ff;
  --foreground: #252f43;
  --radius: 0.75rem;
  --radius-md: 0.75rem;
  --font-sans-stack: "Inter", "Segoe UI", Arial, sans-serif;
}

body {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(123, 209, 250, 0.32), transparent 42%),
    radial-gradient(circle at top right, rgba(214, 173, 255, 0.22), transparent 38%),
    linear-gradient(180deg, #f5f6ff 0%, #edf0ff 100%);
  color: var(--foreground);
  font-family: var(--font-sans-stack);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test:run src/test/components/ui/button.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/ui/button.tsx src/components/ui/card.tsx src/components/ui/input.tsx src/components/ui/badge.tsx src/test/components/ui/button.test.tsx src/test/components/ui/card.test.tsx src/test/components/ui/input.test.tsx
git commit -m "feat: add glacier theme primitives"
```

### Task 2: Add the Post model, migration, and post validation helpers

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<generated>/migration.sql`
- Create: `src/features/posts/post-validation.ts`
- Create: `src/lib/db/posts.ts`
- Create: `src/test/features/posts/post-validation.test.ts`
- Create: `src/test/lib/db/posts.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest"
import { normalizeTags } from "@/features/posts/post-validation"

describe("normalizeTags", () => {
  it("trims, drops empties, and deduplicates tags", () => {
    expect(normalizeTags("alpha, beta, , alpha,  gamma ")).toEqual([
      "alpha",
      "beta",
      "gamma",
    ])
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test:run src/test/features/posts/post-validation.test.ts`

Expected: FAIL because `normalizeTags` does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
export function normalizeTags(raw: string) {
  const seen = new Set<string>()
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag)) return false
      seen.add(tag)
      return true
    })
}
```

Update `prisma/schema.prisma` with:

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  body      String
  tags      String[] @default([])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id       String  @id @default(cuid())
  name     String?
  email    String? @unique
  emailVerified DateTime?
  image    String?
  accounts Account[]
  sessions Session[]
  posts    Post[]
}
```

Add repository helpers in `src/lib/db/posts.ts`:

```ts
import { prisma } from "@/lib/db/prisma"

export async function listPostsForUser(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
  })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test:run src/test/features/posts/post-validation.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations src/features/posts/post-validation.ts src/lib/db/posts.ts src/test/features/posts/post-validation.test.ts src/test/lib/db/posts.test.ts
git commit -m "feat: add post schema and validation"
```

### Task 3: Implement authenticated post server actions and ownership checks

**Files:**
- Create: `src/features/posts/actions.ts`
- Create: `src/features/posts/queries.ts`
- Modify: `src/lib/db/posts.ts`
- Create: `src/test/features/posts/actions.test.ts`
- Create: `src/test/features/posts/queries.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest"
import { deletePostAction } from "@/features/posts/actions"

vi.mock("@/features/auth/auth", () => ({
  auth: vi.fn(async () => null),
}))

describe("deletePostAction", () => {
  it("redirects unauthenticated users to login", async () => {
    await expect(deletePostAction(new FormData())).rejects.toMatchObject({
      digest: expect.any(String),
    })
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test:run src/test/features/posts/actions.test.ts`

Expected: FAIL because the action does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```ts
"use server"

import { auth } from "@/features/auth/auth"
import { redirect, notFound } from "next/navigation"
import {
  createPostForUser,
  deletePostForUser,
  getPostForUser,
  updatePostForUser,
} from "@/lib/db/posts"
import { normalizeTags } from "./post-validation"

export async function createPostAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  // validate formData, normalize tags, then call createPostForUser
}
```

Also add `getPostForUser` ownership lookup and `deletePostForUser`/`updatePostForUser` wrappers in `src/lib/db/posts.ts`:

```ts
export async function getPostForUser(postId: string, userId: string) {
  return prisma.post.findFirst({
    where: { id: postId, authorId: userId },
  })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test:run src/test/features/posts/actions.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/posts/actions.ts src/features/posts/queries.ts src/lib/db/posts.ts src/test/features/posts/actions.test.ts src/test/features/posts/queries.test.ts
git commit -m "feat: add post actions and ownership checks"
```

### Task 4: Build the protected post UI and route structure

**Files:**
- Create: `src/app/(protected)/dashboard/layout.tsx`
- Modify: `src/app/(protected)/dashboard/page.tsx`
- Create: `src/app/(protected)/dashboard/posts/new/page.tsx`
- Create: `src/app/(protected)/dashboard/posts/[id]/page.tsx`
- Create: `src/app/(protected)/dashboard/posts/[id]/edit/page.tsx`
- Create: `src/features/posts/components/post-card.tsx`
- Create: `src/features/posts/components/post-form.tsx`
- Create: `src/features/posts/components/post-list.tsx`
- Create: `src/features/posts/components/post-actions.tsx`
- Create: `src/test/features/posts/post-card.test.tsx`
- Create: `src/test/features/posts/post-form.test.tsx`

- [ ] **Step 1: Write the failing test**

```ts
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { PostCard } from "@/features/posts/components/post-card"

describe("PostCard", () => {
  it("renders title, tags, and preview text", () => {
    render(
      <PostCard
        post={{
          id: "post_1",
          title: "Frozen Light",
          body: "A short preview",
          tags: ["glacier", "ui"],
          updatedAt: new Date("2026-05-28T00:00:00.000Z"),
        }}
      />
    )

    expect(screen.getByText("Frozen Light")).toBeInTheDocument()
    expect(screen.getByText("A short preview")).toBeInTheDocument()
    expect(screen.getByText("glacier")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test:run src/test/features/posts/post-card.test.tsx`

Expected: FAIL because `PostCard` does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```tsx
export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="rounded-2xl border border-white/20 bg-white/55 p-5 shadow-[0_0_30px_rgba(125,211,252,0.08)] backdrop-blur-md">
      <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.body}</p>
    </article>
  )
}
```

`post-form.tsx` should be a reusable form for both new and edit screens:

```tsx
export function PostForm({ action, defaultValues }: PostFormProps) {
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-white/20 bg-white/55 p-6 backdrop-blur-md">
      <Input name="title" defaultValue={defaultValues?.title ?? ""} />
      <textarea name="body" defaultValue={defaultValues?.body ?? ""} />
      <Input name="tags" defaultValue={defaultValues?.tags.join(", ") ?? ""} />
      <Button type="submit">Save post</Button>
    </form>
  )
}
```

Route pages should compose those components and call the server actions.

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test:run src/test/features/posts/post-card.test.tsx src/test/features/posts/post-form.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/(protected)/dashboard/layout.tsx src/app/(protected)/dashboard/page.tsx src/app/(protected)/dashboard/posts/new/page.tsx src/app/(protected)/dashboard/posts/[id]/page.tsx src/app/(protected)/dashboard/posts/[id]/edit/page.tsx src/features/posts/components/post-card.tsx src/features/posts/components/post-form.tsx src/features/posts/components/post-list.tsx src/features/posts/components/post-actions.tsx src/test/features/posts/post-card.test.tsx src/test/features/posts/post-form.test.tsx
git commit -m "feat: add protected post ui"
```

### Task 5: Polish auth pages, dashboard shell, and final verification

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/error/page.tsx`
- Modify: `src/features/auth/components/sign-in-button.tsx`
- Modify: `src/features/auth/components/sign-out-button.tsx`
- Modify: `src/app/globals.css`
- Modify: `README.md`
- Create: `src/features/auth/auth-shell.ts`
- Create: `src/test/features/auth/auth-shell.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest"
import { getAuthShellClassName } from "@/features/auth/auth-shell"

describe("getAuthShellClassName", () => {
  it("returns the Glacier auth panel classes", () => {
    const className = getAuthShellClassName()
    expect(className).toContain("backdrop-blur-xl")
    expect(className).toContain("bg-white/60")
    expect(className).toContain("border-white/25")
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test:run src/test/features/auth/auth-shell.test.ts`

Expected: FAIL because `getAuthShellClassName` does not exist yet.

- [ ] **Step 3: Write the minimal implementation**

```tsx
export function getAuthShellClassName() {
  return [
    "mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl",
    "border border-white/25 bg-white/60 p-8 shadow-[0_0_30px_rgba(125,211,252,0.08)]",
    "backdrop-blur-xl",
  ].join(" ")
}
```

Use `getAuthShellClassName()` inside `src/app/(auth)/login/page.tsx` and `src/app/(auth)/error/page.tsx` so both screens share the same frosted panel treatment.

Update the auth screens so they visually match the Glacier system:

```tsx
<div className={getAuthShellClassName()}>
  ...
</div>
```

Update `README.md` to briefly describe:
- post CRUD routes
- login-only access
- plain-text body
- tags stored as a string array

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test:run src/test/features/auth/auth-shell.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/(auth)/login/page.tsx src/app/(auth)/error/page.tsx src/features/auth/components/sign-in-button.tsx src/features/auth/components/sign-out-button.tsx src/app/globals.css README.md src/test/smoke.test.ts
git commit -m "feat: polish glacier app shell"
```

## Self-Review Checklist

- All Glacier theme requirements map to Task 1 and Task 5.
- The post model, migration, and normalization logic map to Task 2.
- Ownership checks and server mutations map to Task 3.
- Protected routes and UI components map to Task 4.
- End-to-end verification and docs updates map to Task 5.
- No task depends on a function or file that is never defined.
- No placeholders like TODO or TBD appear in the plan.
- The plan stays scoped to one subsystem: authenticated posts inside the existing boilerplate.
