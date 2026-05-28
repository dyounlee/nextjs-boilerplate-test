"use server"

import { auth } from "@/features/auth/auth"
import { normalizeTags } from "@/features/posts/post-validation"
import { prisma } from "@/lib/db/prisma"
import {
  createPostForUser,
  deletePostForUser,
  updatePostForUser,
} from "@/lib/db/posts"
import { notFound, redirect } from "next/navigation"

async function getCurrentUserId() {
  const session = await auth()
  const email = session?.user?.email?.trim()

  if (!email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  if (!user) {
    redirect("/login")
  }

  return user.id
}

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function createPostAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const title = getFormValue(formData, "title")
  const body = getFormValue(formData, "body")
  const tags = normalizeTags(getFormValue(formData, "tags"))

  await createPostForUser({
    userId,
    title,
    body,
    tags,
  })

  redirect("/dashboard")
}

export async function updatePostAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const postId = getFormValue(formData, "postId")
  const title = getFormValue(formData, "title")
  const body = getFormValue(formData, "body")
  const tags = normalizeTags(getFormValue(formData, "tags"))

  if (!postId) {
    notFound()
  }

  const post = await updatePostForUser({
    postId,
    userId,
    title,
    body,
    tags,
  })

  if (!post) {
    notFound()
  }

  redirect("/dashboard")
}

export async function deletePostAction(formData: FormData) {
  const userId = await getCurrentUserId()
  const postId = getFormValue(formData, "postId")

  if (!postId) {
    notFound()
  }

  const deletedPost = await deletePostForUser(postId, userId)

  if (!deletedPost) {
    notFound()
  }

  redirect("/dashboard")
}
