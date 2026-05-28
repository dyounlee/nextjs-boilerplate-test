import { describe, expect, it } from "vitest"

import { buttonVariants } from "@/components/ui/button"

describe("buttonVariants", () => {
  it("includes the Glacier glass treatment for the default button", () => {
    const className = buttonVariants({ variant: "default", size: "default" })

    expect(className).toContain("backdrop-blur")
    expect(className).toContain("bg-white/60")
  })
})
