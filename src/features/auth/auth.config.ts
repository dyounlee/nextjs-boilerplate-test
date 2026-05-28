import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import { getAuthSecret } from "./env"

export const authConfig = {
  secret: getAuthSecret(),
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) return isLoggedIn
      return true
    },
  },
} satisfies NextAuthConfig
