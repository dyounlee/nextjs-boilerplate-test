import { describe, expect, it } from "vitest"

import { buttonVariants } from "@/components/ui/button"

describe("buttonVariants", () => {
  it("includes the Glacier glass treatment for the default button", () => {
    const className = buttonVariants({ variant: "default", size: "default" })

    expect(className).toContain("backdrop-blur")
    expect(className).toContain("bg-white/60")
  })

  it("keeps the frosted contract on outline buttons", () => {
    const className = buttonVariants({ variant: "outline", size: "sm" })

    expect(className).toContain("bg-white/35")
    expect(className).toContain("border-sky-200/30")
  })
})
