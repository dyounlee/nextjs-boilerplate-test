import { prisma } from "@/lib/db/prisma"

export type PostInput = {
  userId: string
  title: string
  body: string
  tags: string[]
}

export type UpdatePostInput = PostInput & {
  postId: string
}

export async function listPostsForUser(userId: string) {
  return prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getPostForUser(postId: string, userId: string) {
  return prisma.post.findFirst({
    where: { id: postId, authorId: userId },
  })
}

export async function createPostForUser({
  userId,
  title,
  body,
  tags,
}: PostInput) {
  return prisma.post.create({
    data: {
      authorId: userId,
      title,
      body,
      tags,
    },
  })
}

export async function updatePostForUser({
  postId,
  userId,
  title,
  body,
  tags,
}: UpdatePostInput) {
  const post = await getPostForUser(postId, userId)
  if (!post) return null

  return prisma.post.update({
    where: { id: postId },
    data: { title, body, tags },
  })
}

export async function deletePostForUser(postId: string, userId: string) {
  const post = await getPostForUser(postId, userId)
  if (!post) return null

  return prisma.post.delete({
    where: { id: postId },
  })
}
