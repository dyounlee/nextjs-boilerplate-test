import { afterEach, describe, expect, it } from "vitest"
import { getAuthSecret } from "@/features/auth/env"

describe("getAuthSecret", () => {
  const originalAuthSecret = process.env.AUTH_SECRET

  afterEach(() => {
    process.env.AUTH_SECRET = originalAuthSecret
  })

  it("returns AUTH_SECRET when set", () => {
    process.env.AUTH_SECRET = "auth-secret"

    expect(getAuthSecret()).toBe("auth-secret")
  })

  it("throws when no secret is configured", () => {
    delete process.env.AUTH_SECRET

    expect(() => getAuthSecret()).toThrow(
      "Missing auth secret. Set AUTH_SECRET in your environment."
    )
  })
})
