import { describe, expect, it } from "vitest"

import { normalizeTags } from "@/features/posts/post-validation"

describe("normalizeTags", () => {
  it("trims, drops empties, and deduplicates tags", () => {
    expect(normalizeTags("alpha, beta, , alpha,  gamma ")).toEqual([
      "alpha",
      "beta",
      "gamma",
    ])
  })

  it("returns an empty array for blank input", () => {
    expect(normalizeTags("   ")).toEqual([])
  })
})
