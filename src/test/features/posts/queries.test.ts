import { beforeEach, describe, expect, it, vi } from "vitest"

const mockList = vi.fn()
const mockGet = vi.fn()

vi.mock("@/lib/db/posts", () => ({
  listPostsForUser: mockList,
  getPostForUser: mockGet,
}))

describe("post queries", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it("delegates list queries to the repository", async () => {
    const { getPostsForUser } = await import("@/features/posts/queries")
    await getPostsForUser("user_1")

    expect(mockList).toHaveBeenCalledWith("user_1")
  })

  it("delegates ownership lookups to the repository", async () => {
    const { getPostForUserQuery } = await import("@/features/posts/queries")
    await getPostForUserQuery("post_1", "user_1")

    expect(mockGet).toHaveBeenCalledWith("post_1", "user_1")
  })
})
