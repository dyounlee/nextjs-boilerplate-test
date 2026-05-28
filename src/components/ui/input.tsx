import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "flex h-9 w-full rounded-xl border border-white/20 bg-white/50 px-3 py-2 text-sm text-slate-900 shadow-[0_0_30px_rgba(125,211,252,0.08)] backdrop-blur-md outline-none transition-all placeholder:text-slate-500 focus:border-sky-300 focus:ring-3 focus:ring-sky-300/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-400 aria-invalid:ring-3 aria-invalid:ring-red-300/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
