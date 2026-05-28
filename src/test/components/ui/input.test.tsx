import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("renders a frosted glass input", () => {
    render(<Input placeholder="Type here" />)

    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument()
  })
})
