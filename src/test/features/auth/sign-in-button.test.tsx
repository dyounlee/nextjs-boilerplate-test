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
