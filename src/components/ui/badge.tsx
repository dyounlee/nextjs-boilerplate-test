import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-3 focus:ring-sky-300/35",
  {
    variants: {
      variant: {
        default: "border-sky-200/35 bg-sky-100/45 text-sky-950",
        secondary: "border-white/20 bg-white/40 text-slate-700",
        outline: "border-sky-200/30 bg-transparent text-slate-700",
        destructive: "border-red-300/30 bg-red-100/45 text-red-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
