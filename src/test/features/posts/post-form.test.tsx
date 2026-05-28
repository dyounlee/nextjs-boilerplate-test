import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { PostForm } from "@/features/posts/components/post-form"

describe("PostForm", () => {
  it("renders default values for editing", () => {
    render(
      <PostForm
        action={vi.fn()}
        defaultValues={{
          id: "post_1",
          title: "Frozen Light",
          body: "A short preview",
          tags: ["glacier", "ui"],
        }}
      />
    )

    expect(screen.getByLabelText("제목")).toHaveValue("Frozen Light")
    expect(screen.getByLabelText("본문")).toHaveValue("A short preview")
    expect(screen.getByLabelText("태그")).toHaveValue("glacier, ui")
    expect(screen.getByRole("button", { name: "글 저장" })).toBeInTheDocument()
  })
})
