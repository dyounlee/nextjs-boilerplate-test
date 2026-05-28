import { auth } from "@/features/auth/auth"
import { prisma } from "@/lib/db/prisma"
import { redirect } from "next/navigation"

export async function getCurrentUserId() {
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
