import { auth } from "@/features/auth/auth"
import { SignOutButton } from "@/features/auth/components/sign-out-button"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/25 bg-white/55 px-5 py-4 shadow-[0_0_30px_rgba(125,211,252,0.08)] backdrop-blur-xl">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-xl font-semibold tracking-tight text-slate-900">
            Glacier Posts
          </Link>
          <p className="text-sm text-slate-600">
            {session.user?.name ?? "사용자"}님의 게시판
          </p>
        </div>
        <SignOutButton />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
