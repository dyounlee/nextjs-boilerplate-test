export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error(
      "Missing auth secret. Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET in your environment."
    )
  }

  return secret
}
