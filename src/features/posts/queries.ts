import { getPostForUser, listPostsForUser } from "@/lib/db/posts"

export function getPostsForUser(userId: string) {
  return listPostsForUser(userId)
}

export function getPostForUserQuery(postId: string, userId: string) {
  return getPostForUser(postId, userId)
}
