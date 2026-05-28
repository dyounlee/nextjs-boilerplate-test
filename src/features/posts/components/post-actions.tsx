import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { deletePostAction } from "@/features/posts/actions"
import { cn } from "@/lib/utils"

export function PostActions({ postId }: { postId: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/dashboard/posts/${postId}/edit`}
        className={cn(buttonVariants({ variant: "secondary" }))}
      >
        수정
      </Link>
      <form action={deletePostAction}>
        <input type="hidden" name="postId" value={postId} />
        <Button type="submit" variant="destructive">
          삭제
        </Button>
      </form>
    </div>
  )
}
