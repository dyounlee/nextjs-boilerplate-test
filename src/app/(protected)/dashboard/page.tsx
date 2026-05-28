import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/features/auth/auth"
import { getCurrentUserId } from "@/features/posts/current-user"
import { PostList } from "@/features/posts/components/post-list"
import { getPostsForUser } from "@/features/posts/queries"
import { cn } from "@/lib/utils"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const userId = await getCurrentUserId()
  const posts = await getPostsForUser(userId)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            내 글
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            로그인한 사용자만 글을 작성하고 관리할 수 있습니다.
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          새 글 작성
        </Link>
      </div>
      <PostList posts={posts} />
    </section>
  )
}
