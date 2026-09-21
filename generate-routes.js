import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');
const contentDir = path.resolve(__dirname, 'src/content/blog');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
    console.error("dist/index.html not found! Ensure 'vite build' ran successfully.");
    process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));

console.log(`Generating static routes for ${files.length} blog posts...`);

let rssItems = '';
let llmsFullContent = `# Screen Stickynote - Full AI Catalog\n\n`;

files.forEach(file => {
    const slug = file.replace('.md', '');
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const parsed = matter(content);
    // Construct dynamic tags
    const title = `${parsed.data.title} | Screen Stickynote Blog`;
    const description = parsed.data.excerpt ? parsed.data.excerpt.replace(/"/g, '&quot;') : "Read the latest updates and deep-dives on the Screen Stickynote application.";
    const url = `https://screenstickynote.com/blog/${slug}/`;
    const imageUrl = parsed.data.thumbnail || "https://screenstickynote.com/og-image.jpg";

    let specificHtml = baseHtml;

    // Regex replacements for standard SEO tags
    specificHtml = specificHtml.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);
    specificHtml = specificHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/>/gi, `<meta name="description" content="${description}" />`);

    // Replace default canonical tag
    specificHtml = specificHtml.replace(
        /<link\s+rel="canonical"\s+href="https:\/\/screenstickynote\.com\/"\s*\/>/gi,
        `<link rel="canonical" id="canonical-link" href="${url}" data-rh="true" />`
    );

    // Replace OG tags
    specificHtml = specificHtml.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/>/gi, `<meta property="og:title" content="${title}" />`);
    specificHtml = specificHtml.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/>/gi, `<meta property="og:description" content="${description}" />`);
    specificHtml = specificHtml.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/>/gi, `<meta property="og:url" content="${url}" />`);
    specificHtml = specificHtml.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/>/gi, `<meta property="og:image" content="${imageUrl}" />`);

    // Replace Twitter tags
    specificHtml = specificHtml.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/>/gi, `<meta name="twitter:title" content="${title}" />`);
    specificHtml = specificHtml.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/gi, `<meta name="twitter:description" content="${description}" />`);
    specificHtml = specificHtml.replace(/<meta\s+property="twitter:url"\s+content=".*?"\s*\/>/gi, `<meta property="twitter:url" content="${url}" />`);
    specificHtml = specificHtml.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/>/gi, `<meta name="twitter:image" content="${imageUrl}" />`);

    // Write to a dedicated subfolder so /blog/<slug> resolves purely as an identical index file but with unique metadata heads
    const routeDir = path.join(distDir, 'blog', slug);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), specificHtml);

    // Add to LLM catalog
    llmsFullContent += `## ${title}\nURL: ${url}\n\n${parsed.content}\n\n---\n\n`;

    // Add to RSS
    const pubDate = parsed.data.date ? new Date(parsed.data.date).toUTCString() : new Date().toUTCString();
    rssItems += `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid>${url}</guid>
    </item>\n`;

    console.log(`- Generated metadata static file: /blog/${slug}/index.html`);
});

const rssOutput = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Screen Stickynote Blog</title>
    <link>https://screenstickynote.com/</link>
    <description>Insights on offline-first organization and productivity.</description>
${rssItems}  </channel>
</rss>`;
fs.writeFileSync(path.join(distDir, 'feed.xml'), rssOutput);
console.log("- Generated static feed: /feed.xml");

fs.writeFileSync(path.join(distDir, 'llms-full.txt'), llmsFullContent);
console.log("- Generated full LLM catalog: /llms-full.txt");

console.log("Static route generation for blogs complete.");

// Generate static fallback directories for core routes to prevent server SPA 404 redirects
const coreRoutes = ['download', 'privacy', 'terms', 'contact', 'install', 'uninstall', 'windows-app-privacy'];
console.log(`Generating static fallback routes for core pages...`);

coreRoutes.forEach(route => {
    const url = `https://screenstickynote.com/${route}/`;
    let specificHtml = baseHtml;

    // Replace default canonical tag
    specificHtml = specificHtml.replace(
        /<link\s+rel="canonical"\s+href="https:\/\/screenstickynote\.com\/"\s*\/>/gi,
        `<link rel="canonical" id="canonical-link" href="${url}" data-rh="true" />`
    );

    // Replace OG URL and Twitter URL to match the specific route
    specificHtml = specificHtml.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/>/gi, `<meta property="og:url" content="${url}" />`);
    specificHtml = specificHtml.replace(/<meta\s+property="twitter:url"\s+content=".*?"\s*\/>/gi, `<meta property="twitter:url" content="${url}" />`);

    // Optional: We let App Helmet handle <title> and Description for these generic routes dynamically since they aren't generated from Markdown yet.
    // However, fixing the canonical avoids "Page with redirect" errors on standard hosting

    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), specificHtml);
    console.log(`- Generated static directory for core route: /${route}/index.html`);
});

console.log("Static route generation complete.");
