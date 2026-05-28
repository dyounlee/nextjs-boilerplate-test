export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error(
      "Missing auth secret. Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET in your environment."
    )
  }

  return secret
}

export function getGoogleClientId() {
  const clientId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_ID

  if (!clientId) {
    throw new Error(
      "Missing Google OAuth client ID. Set AUTH_GOOGLE_ID (preferred) or GOOGLE_ID in your environment."
    )
  }

  return clientId
}

export function getGoogleClientSecret() {
  const clientSecret =
    process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_SECRET

  if (!clientSecret) {
    throw new Error(
      "Missing Google OAuth client secret. Set AUTH_GOOGLE_SECRET (preferred) or GOOGLE_SECRET in your environment."
    )
  }

  return clientSecret
}
