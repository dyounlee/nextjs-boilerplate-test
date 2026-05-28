import { createRef } from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Badge } from "@/components/ui/badge"

describe("Badge", () => {
  it("renders a Glacier badge", () => {
    const { container } = render(<Badge>New</Badge>)

    expect(screen.getByText("New")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("bg-sky-100/45")
  })

  it("supports destructive badges", () => {
    const { container } = render(<Badge variant="destructive">Alert</Badge>)

    expect(screen.getByText("Alert")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("bg-red-100/45")
  })

  it("forwards refs to the badge element", () => {
    const ref = createRef<HTMLSpanElement>()

    render(<Badge ref={ref}>Ref check</Badge>)

    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveTextContent("Ref check")
  })
})
