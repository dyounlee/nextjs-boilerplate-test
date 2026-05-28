import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type PostCardData = {
  id: string
  title: string
  body: string
  tags: string[]
  updatedAt: Date
}

export function PostCard({ post, className }: { post: PostCardData; className?: string }) {
  const preview = post.body.trim() || "내용이 없습니다."
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(post.updatedAt)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-slate-700">
          {preview}
        </p>
      </CardContent>
    </Card>
  )
}
