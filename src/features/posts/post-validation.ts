export function normalizeTags(raw: string) {
  const seen = new Set<string>()

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag)) return false
      seen.add(tag)
      return true
    })
}
