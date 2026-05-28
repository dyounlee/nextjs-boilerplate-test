import { vi, describe, expect, it, beforeEach } from "vitest"

const mockFindMany = vi.fn()
const mockFindFirst = vi.fn()
const mockCreate = vi.fn()
const mockUpdate = vi.fn()
const mockDelete = vi.fn()

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    post: {
      findMany: mockFindMany,
      findFirst: mockFindFirst,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}))

describe("post repository", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it("lists posts for a user by updatedAt descending", async () => {
    const { listPostsForUser } = await import("@/lib/db/posts")
    await listPostsForUser("user_1")

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { authorId: "user_1" },
      orderBy: { updatedAt: "desc" },
    })
  })

  it("finds a post owned by a user", async () => {
    const { getPostForUser } = await import("@/lib/db/posts")
    await getPostForUser("post_1", "user_1")

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: "post_1", authorId: "user_1" },
    })
  })

  it("creates a post for a user", async () => {
    const { createPostForUser } = await import("@/lib/db/posts")
    await createPostForUser({
      userId: "user_1",
      title: "Frozen Light",
      body: "A short preview",
      tags: ["glacier", "ui"],
    })

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        authorId: "user_1",
        title: "Frozen Light",
        body: "A short preview",
        tags: ["glacier", "ui"],
      },
    })
  })
})
