import { describe, expect, it } from "vitest"
import { existsSync } from "node:fs"

describe("prisma migrations", () => {
  it("includes the initial auth schema migration", () => {
    expect(
      existsSync("prisma/migrations/20260528170000_initial/migration.sql")
    ).toBe(true)
  })
})
