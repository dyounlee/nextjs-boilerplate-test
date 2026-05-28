"use client"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/features/auth/actions"

export function SignInButton() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit">Google로 로그인</Button>
    </form>
  )
}
