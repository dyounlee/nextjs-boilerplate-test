import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export type PostFormDefaults = {
  id?: string
  title?: string
  body?: string
  tags?: string[]
}

export type PostFormProps = {
  action: (formData: FormData) => Promise<void>
  defaultValues?: PostFormDefaults
}

export function PostForm({ action, defaultValues }: PostFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>게시글 작성</CardTitle>
        <CardDescription>제목, 본문, 태그를 입력해 글을 저장합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {defaultValues?.id ? (
            <input type="hidden" name="postId" value={defaultValues.id} />
          ) : null}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800" htmlFor="title">
              제목
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={defaultValues?.title ?? ""}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800" htmlFor="body">
              본문
            </label>
            <textarea
              id="body"
              name="body"
              defaultValue={defaultValues?.body ?? ""}
              placeholder="본문을 입력하세요"
              rows={10}
              className="min-h-40 w-full rounded-xl border border-white/20 bg-white/50 px-3 py-2 text-sm text-slate-900 shadow-[0_0_30px_rgba(125,211,252,0.08)] backdrop-blur-md outline-none transition-all placeholder:text-slate-500 focus:border-sky-300 focus:ring-3 focus:ring-sky-300/35"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800" htmlFor="tags">
              태그
            </label>
            <Input
              id="tags"
              name="tags"
              defaultValue={defaultValues?.tags?.join(", ") ?? ""}
              placeholder="glacier, ui"
            />
          </div>
          <Button type="submit">글 저장</Button>
        </form>
      </CardContent>
    </Card>
  )
}
