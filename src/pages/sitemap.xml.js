import { SITE } from '../lib/site.mjs';

export async function GET() {
  const base = (process.env.SITE_URL || SITE.url).replace(/\/$/, '');
  const paths = [''];
  for (const tool of SITE.tools) {
    paths.push(`/tools/${tool.slug}/`, `/zh/tools/${tool.slug}/`);
  }
  paths.push('/guides/', '/zh/guides/');
  for (const guide of SITE.guides) {
    paths.push(`/guides/${guide.slug}/`, `/zh/guides/${guide.slug}/`);
  }
  paths.push('/zh/');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${base}${p}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
