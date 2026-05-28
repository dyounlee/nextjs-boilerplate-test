import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">인증 오류</h1>
        <p className="text-muted-foreground">
          로그인 중 문제가 발생했습니다.
        </p>
        <Link href="/login" className="underline underline-offset-4">
          로그인으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
