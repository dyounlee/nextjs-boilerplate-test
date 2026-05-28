import { afterEach, describe, expect, it } from "vitest"
import {
  getAuthSecret,
  getGoogleClientId,
  getGoogleClientSecret,
} from "@/features/auth/env"

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

describe("google oauth env", () => {
  const originalAuthGoogleId = process.env.AUTH_GOOGLE_ID
  const originalGoogleId = process.env.GOOGLE_ID
  const originalAuthGoogleSecret = process.env.AUTH_GOOGLE_SECRET
  const originalGoogleSecret = process.env.GOOGLE_SECRET

  afterEach(() => {
    process.env.AUTH_GOOGLE_ID = originalAuthGoogleId
    process.env.GOOGLE_ID = originalGoogleId
    process.env.AUTH_GOOGLE_SECRET = originalAuthGoogleSecret
    process.env.GOOGLE_SECRET = originalGoogleSecret
  })

  it("returns AUTH_GOOGLE_ID when set", () => {
    process.env.AUTH_GOOGLE_ID = "auth-google-id"
    delete process.env.GOOGLE_ID

    expect(getGoogleClientId()).toBe("auth-google-id")
  })

  it("returns GOOGLE_ID when AUTH_GOOGLE_ID is not set", () => {
    delete process.env.AUTH_GOOGLE_ID
    process.env.GOOGLE_ID = "google-id"

    expect(getGoogleClientId()).toBe("google-id")
  })

  it("returns AUTH_GOOGLE_SECRET when set", () => {
    process.env.AUTH_GOOGLE_SECRET = "auth-google-secret"
    delete process.env.GOOGLE_SECRET

    expect(getGoogleClientSecret()).toBe("auth-google-secret")
  })

  it("returns GOOGLE_SECRET when AUTH_GOOGLE_SECRET is not set", () => {
    delete process.env.AUTH_GOOGLE_SECRET
    process.env.GOOGLE_SECRET = "google-secret"

    expect(getGoogleClientSecret()).toBe("google-secret")
  })
})
