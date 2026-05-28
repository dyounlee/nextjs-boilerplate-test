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
