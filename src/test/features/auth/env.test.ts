import { afterEach, describe, expect, it } from "vitest"
import { getAuthSecret } from "@/features/auth/env"

describe("getAuthSecret", () => {
  const originalAuthSecret = process.env.AUTH_SECRET
  const originalNextAuthSecret = process.env.NEXTAUTH_SECRET

  afterEach(() => {
    process.env.AUTH_SECRET = originalAuthSecret
    process.env.NEXTAUTH_SECRET = originalNextAuthSecret
  })

  it("returns AUTH_SECRET when set", () => {
    process.env.AUTH_SECRET = "auth-secret"
    delete process.env.NEXTAUTH_SECRET

    expect(getAuthSecret()).toBe("auth-secret")
  })

  it("returns NEXTAUTH_SECRET when AUTH_SECRET is not set", () => {
    delete process.env.AUTH_SECRET
    process.env.NEXTAUTH_SECRET = "nextauth-secret"

    expect(getAuthSecret()).toBe("nextauth-secret")
  })

  it("throws when no secret is configured", () => {
    delete process.env.AUTH_SECRET
    delete process.env.NEXTAUTH_SECRET

    expect(() => getAuthSecret()).toThrow(
      "Missing auth secret. Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET in your environment."
    )
  })
})
