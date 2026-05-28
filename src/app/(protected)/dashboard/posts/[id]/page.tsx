import { notFound } from "next/navigation"

import { PostActions } from "@/features/posts/components/post-actions"
import { PostCard } from "@/features/posts/components/post-card"
import { getCurrentUserId } from "@/features/posts/current-user"
import { getPostForUserQuery } from "@/features/posts/queries"

type PostPageProps = {
  params: Promise<{ id: string }>
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { id } = await params
  const userId = await getCurrentUserId()
  const post = await getPostForUserQuery(id, userId)

  if (!post) {
    notFound()
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <PostCard post={post} />
      <article className="rounded-2xl border border-white/20 bg-white/50 p-6 text-sm leading-7 whitespace-pre-line text-slate-700 backdrop-blur-md">
        {post.body}
      </article>
      <PostActions postId={post.id} />
    </section>
  )
}
