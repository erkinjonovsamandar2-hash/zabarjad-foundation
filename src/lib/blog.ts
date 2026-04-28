/** URL-safe slug from an article title (handles Uzbek apostrophes). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ʻʼ''`]/g, "")   // o' → o, g' → g
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Returns the canonical URL path for a blog post. */
export function postPath(article: { id: string; slug?: string | null }): string {
  const s = article.slug?.trim();
  return `/blog/${s || article.id}`;
}
