import { beforeEach, describe, expect, it, vi } from "vitest"

const mockRedirect = vi.fn(() => {
  throw new Error("REDIRECT")
})
const mockNotFound = vi.fn(() => {
  throw new Error("NOT_FOUND")
})
const mockAuth = vi.fn()
const mockFindUnique = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
  notFound: mockNotFound,
}))

vi.mock("@/features/auth/auth", () => ({
  auth: mockAuth,
}))

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    user: {
      findUnique: mockFindUnique,
    },
  },
}))

vi.mock("@/lib/db/posts", () => ({
  createPostForUser: mockCreate,
  updatePostForUser: mockUpdate,
  deletePostForUser: mockDelete,
  getPostForUser: vi.fn(),
}))

describe("post actions", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it("redirects unauthenticated users to login when creating a post", async () => {
    mockAuth.mockResolvedValue(null)

    const { createPostAction } = await import("@/features/posts/actions")

    await expect(createPostAction(new FormData())).rejects.toThrow("REDIRECT")
    expect(mockRedirect).toHaveBeenCalledWith("/login")
  })

  it("creates a post for the signed in author", async () => {
    mockAuth.mockResolvedValue({
      user: { email: "writer@example.com" },
    })
    mockFindUnique.mockResolvedValue({ id: "user_1" })
    mockCreate.mockResolvedValue({ id: "post_1" })

    const { createPostAction } = await import("@/features/posts/actions")
    const formData = new FormData()
    formData.set("title", "Frozen Light")
    formData.set("body", "A short preview")
    formData.set("tags", "glacier, ui, glacier")

    await expect(createPostAction(formData)).rejects.toThrow("REDIRECT")

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: "writer@example.com" },
      select: { id: true },
    })
    expect(mockCreate).toHaveBeenCalledWith({
      userId: "user_1",
      title: "Frozen Light",
      body: "A short preview",
      tags: ["glacier", "ui"],
    })
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard")
  })

  it("returns notFound when updating a post that is not owned", async () => {
    mockAuth.mockResolvedValue({
      user: { email: "writer@example.com" },
    })
    mockFindUnique.mockResolvedValue({ id: "user_1" })
    mockUpdate.mockResolvedValue(null)

    const { updatePostAction } = await import("@/features/posts/actions")
    const formData = new FormData()
    formData.set("postId", "post_1")
    formData.set("title", "Frozen Light")
    formData.set("body", "Updated body")
    formData.set("tags", "glacier")

    await expect(updatePostAction(formData)).rejects.toThrow("NOT_FOUND")
    expect(mockNotFound).toHaveBeenCalled()
  })

  it("deletes an owned post", async () => {
    mockAuth.mockResolvedValue({
      user: { email: "writer@example.com" },
    })
    mockFindUnique.mockResolvedValue({ id: "user_1" })
    mockDelete.mockResolvedValue({ id: "post_1" })

    const { deletePostAction } = await import("@/features/posts/actions")
    const formData = new FormData()
    formData.set("postId", "post_1")

    await expect(deletePostAction(formData)).rejects.toThrow("REDIRECT")
    expect(mockDelete).toHaveBeenCalledWith("post_1", "user_1")
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard")
  })
})
