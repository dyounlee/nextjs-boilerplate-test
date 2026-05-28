import { auth } from "@/features/auth/auth"
import { redirect } from "next/navigation"
import { SignInButton } from "@/features/auth/components/sign-in-button"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold tracking-tight">로그인</h1>
        <SignInButton />
      </div>
    </main>
  )
}
