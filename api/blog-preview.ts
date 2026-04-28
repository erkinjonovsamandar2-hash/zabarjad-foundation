// Vercel serverless function — serves OG meta HTML for social media crawlers.
// Regular users never hit this; vercel.json only routes known bot User-Agents here.
// Humans continue to the SPA (index.html) as normal.

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL  ?? "";
const SUPABASE_KEY  = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const SITE_URL      = "https://www.booktopia.uz";
const FALLBACK_IMG  = `${SITE_URL}/booktopia-logo_dark.jpg`;

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: any, res: any) {
  const id = String(req.query?.id ?? "").trim();

  let title       = "Booktopia Blog";
  let description = "Booktopia nashriyotining yangi maqolasi";
  let image       = FALLBACK_IMG;

  if (id && SUPABASE_URL && SUPABASE_KEY) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      // Use only the matching column — mixing UUID cast with a slug string crashes PostgREST
      const filter = isUuid
        ? `or=(slug.eq.${encodeURIComponent(id)},id.eq.${encodeURIComponent(id)})`
        : `slug=eq.${encodeURIComponent(id)}`;

      const url =
        `${SUPABASE_URL}/rest/v1/blog_posts` +
        `?${filter}` +
        `&published=eq.true` +
        `&select=title,excerpt,image_url` +
        `&limit=1`;

      const resp = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      const rows: any[] = await resp.json();
      const article = rows?.[0];

      if (article) {
        if (article.title)     title       = `${article.title} — Booktopia`;
        if (article.excerpt)   description = article.excerpt;
        if (article.image_url) image       = article.image_url;
      }
    } catch {
      // use defaults — don't crash the crawler response
    }
  }

  const pageUrl = `${SITE_URL}/blog/${encodeURIComponent(id)}`;

  const html = `<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">

<!-- Open Graph -->
<meta property="og:type"        content="article">
<meta property="og:url"         content="${esc(pageUrl)}">
<meta property="og:site_name"   content="Booktopia">
<meta property="og:title"       content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image"       content="${esc(image)}">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale"      content="uz_UZ">

<!-- Twitter / X -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:site"        content="@booktopia_uz">
<meta name="twitter:title"       content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image"       content="${esc(image)}">
</head>
<body>
<h1>${esc(title)}</h1>
<p>${esc(description)}</p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  res.status(200).send(html);
}
