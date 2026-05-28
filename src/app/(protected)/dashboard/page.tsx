import { auth } from "@/features/auth/auth"
import { redirect } from "next/navigation"
import { SignOutButton } from "@/features/auth/components/sign-out-button"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <SignOutButton />
      </div>
      <p className="mt-4 text-muted-foreground">
        안녕하세요, {session.user?.name ?? "사용자"}님
      </p>
    </main>
  )
}
