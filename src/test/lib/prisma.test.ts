import { vi, describe, it, expect, beforeEach } from "vitest"

vi.mock("@/generated/prisma", () => {
  class MockPrismaClient {
    _mock = true
  }
  return {
    PrismaClient: MockPrismaClient,
  }
})

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
