import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PostCard } from "@/features/posts/components/post-card"

describe("PostCard", () => {
  it("renders title, tags, and preview text", () => {
    render(
      <PostCard
        post={{
          id: "post_1",
          title: "Frozen Light",
          body: "A short preview",
          tags: ["glacier", "ui"],
          updatedAt: new Date("2026-05-28T00:00:00.000Z"),
        }}
      />
    )

    expect(screen.getByText("Frozen Light")).toBeInTheDocument()
    expect(screen.getByText("A short preview")).toBeInTheDocument()
    expect(screen.getByText("glacier")).toBeInTheDocument()
    expect(screen.getByText("ui")).toBeInTheDocument()
  })
})
