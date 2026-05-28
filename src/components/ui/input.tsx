import * as React from "react"

import { glassFieldBase } from "@/components/ui/glass"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      data-slot="input"
      type={type}
      className={cn(glassFieldBase, className)}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
