import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("renders a frosted glass input", () => {
    const { container } = render(<Input placeholder="Type here" />)

    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("backdrop-blur-md")
  })
})
