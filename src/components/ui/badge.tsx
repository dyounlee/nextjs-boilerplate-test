import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { glassBadgeBase } from "@/components/ui/glass"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  glassBadgeBase,
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

const Badge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>
>(function Badge({ className, variant = "default", ...props }, ref) {
  return (
    <span
      ref={ref}
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export { Badge, badgeVariants }
