import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { PostCard, type PostCardData } from "./post-card"
import { cn } from "@/lib/utils"

export function PostList({ posts }: { posts: PostCardData[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/40 p-6 text-sm text-slate-600 backdrop-blur-md">
        아직 작성한 글이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="space-y-3">
          <PostCard post={post} />
          <div className="flex gap-2">
            <Link
              href={`/dashboard/posts/${post.id}`}
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              상세 보기
            </Link>
            <Link
              href={`/dashboard/posts/${post.id}/edit`}
              className={cn(buttonVariants({ size: "sm", variant: "secondary" }))}
            >
              수정
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
