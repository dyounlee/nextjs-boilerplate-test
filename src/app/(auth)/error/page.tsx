import Link from "next/link"

import { getAuthShellClassName } from "@/features/auth/auth-shell"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className={getAuthShellClassName()}>
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-rose-700/80">
            Auth Error
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            인증 오류
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            로그인 중 문제가 발생했습니다. 잠시 후 다시 시도하세요.
          </p>
        </div>
        <Link href="/login" className="underline underline-offset-4">
          로그인으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
