import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

describe("Card", () => {
  it("renders the Glacier card primitives", () => {
    const { container } = render(
      <Card className="custom-glacier">
        <CardHeader>
          <CardTitle>Glacier</CardTitle>
          <CardDescription>Layered glass surface</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText("Glacier")).toBeInTheDocument()
    expect(screen.getByText("Layered glass surface")).toBeInTheDocument()
    expect(screen.getByText("Content")).toBeInTheDocument()
    expect(screen.getByText("Footer")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("backdrop-blur-xl")
    expect(container.firstChild).toHaveClass("custom-glacier")
  })
})
