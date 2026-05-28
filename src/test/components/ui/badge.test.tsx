import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Badge } from "@/components/ui/badge"

describe("Badge", () => {
  it("renders a Glacier badge", () => {
    render(<Badge>New</Badge>)

    expect(screen.getByText("New")).toBeInTheDocument()
  })
})
