import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Badge } from "@/components/ui/badge"

describe("Badge", () => {
  it("renders a Glacier badge", () => {
    const { container } = render(<Badge>New</Badge>)

    expect(screen.getByText("New")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("bg-sky-100/45")
  })
})
