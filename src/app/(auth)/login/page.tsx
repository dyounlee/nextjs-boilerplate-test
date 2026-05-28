import { auth } from "@/features/auth/auth"
import { getAuthShellClassName } from "@/features/auth/auth-shell"
import { SignInButton } from "@/features/auth/components/sign-in-button"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className={getAuthShellClassName()}>
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-700/80">
            Glacier
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            로그인
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            Google 계정으로 로그인해 글을 작성하고 관리하세요.
          </p>
        </div>
        <SignInButton />
      </div>
    </main>
  )
}
