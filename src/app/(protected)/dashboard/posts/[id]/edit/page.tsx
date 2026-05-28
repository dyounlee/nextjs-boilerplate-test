import { notFound } from "next/navigation"

import { PostForm } from "@/features/posts/components/post-form"
import { getCurrentUserId } from "@/features/posts/current-user"
import { getPostForUserQuery } from "@/features/posts/queries"
import { updatePostAction } from "@/features/posts/actions"

type PostEditPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PostEditPageProps) {
  const { id } = await params
  const userId = await getCurrentUserId()
  const post = await getPostForUserQuery(id, userId)

  if (!post) {
    notFound()
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          글 수정
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          작성자 본인만 수정할 수 있습니다.
        </p>
      </div>
      <PostForm
        action={updatePostAction}
        defaultValues={{
          id: post.id,
          title: post.title,
          body: post.body,
          tags: post.tags,
        }}
      />
    </section>
  )
}
