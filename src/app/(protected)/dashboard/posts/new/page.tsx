import { PostForm } from "@/features/posts/components/post-form"
import { createPostAction } from "@/features/posts/actions"

export default function NewPostPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          새 글 작성
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          제목, 본문, 태그만 입력하면 됩니다.
        </p>
      </div>
      <PostForm action={createPostAction} />
    </section>
  )
}
