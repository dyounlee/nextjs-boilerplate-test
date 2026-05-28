"use client"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/features/auth/actions"

export function SignInButton() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit" className="w-full">
        Google로 로그인
      </Button>
    </form>
  )
}
