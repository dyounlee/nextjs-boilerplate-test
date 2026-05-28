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
