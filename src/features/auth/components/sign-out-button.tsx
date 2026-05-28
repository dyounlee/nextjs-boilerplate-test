"use client"

import { Button } from "@/components/ui/button"
import { signOutAction } from "@/features/auth/actions"

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" className="w-full sm:w-auto">
        로그아웃
      </Button>
    </form>
  )
}
