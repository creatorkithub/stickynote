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

    // Inject the markdown text structure back into the SEO section for crawlers (prevents thin-content penalty)
    const safeContent = parsed.content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    specificHtml = specificHtml.replace(
        /<!-- NATIVE STATIC SEO LANDING CONTENT -->[\s\S]*?<\/section>/gi,
        `<section id="seo-content" class="sr-only">\n<h1>${parsed.data.title}</h1>\n<p>${description}</p>\n<pre>${safeContent}</pre>\n</section>`
    );

    // Regex replacements (allowing for data-rh attributes and internal newlines)
    specificHtml = specificHtml.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, `<title data-rh="true">${title}</title>`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?name="description"[\s\S]*?\/>/gi, `<meta data-rh="true" name="description" content="${description}" />`);

    // Replace default canonical tag
    specificHtml = specificHtml.replace(
        /<link\s+[^>]*?rel="canonical"[\s\S]*?\/>/gi,
        `<link data-rh="true" rel="canonical" id="canonical-link" href="${url}" />`
    );

    // Replace OG tags
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?property="og:title"[\s\S]*?\/>/gi, `<meta data-rh="true" property="og:title" content="${title}" />`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?property="og:description"[\s\S]*?\/>/gi, `<meta data-rh="true" property="og:description" content="${description}" />`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?property="og:url"[\s\S]*?\/>/gi, `<meta data-rh="true" property="og:url" content="${url}" />`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?property="og:image"[\s\S]*?\/>/gi, `<meta data-rh="true" property="og:image" content="${imageUrl}" />`);

    // Replace Twitter tags
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?name="twitter:title"[\s\S]*?\/>/gi, `<meta data-rh="true" name="twitter:title" content="${title}" />`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?name="twitter:description"[\s\S]*?\/>/gi, `<meta data-rh="true" name="twitter:description" content="${description}" />`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?property="twitter:url"[\s\S]*?\/>/gi, `<meta data-rh="true" property="twitter:url" content="${url}" />`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?name="twitter:image"[\s\S]*?\/>/gi, `<meta data-rh="true" name="twitter:image" content="${imageUrl}" />`);

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
const coreRoutes = ['download', 'privacy', 'terms', 'contact', 'install', 'uninstall', 'windows-app-privacy', 'about'];
console.log(`Generating static fallback routes for core pages...`);

const coreRouteDescriptions = {
    'download': 'Download Screen Stickynote for Windows PC.',
    'privacy': 'Privacy Policy for Screen Stickynote - We prioritize your data sovereignty. We do not store your data on our servers.',
    'terms': 'Terms of Service for Screen Stickynote.',
    'contact': 'Contact Screen Stickynote support team. We would love to hear from you.',
    'install': 'Screen Stickynote Installation Guide and successful installation.',
    'uninstall': 'Screen Stickynote Uninstallation complete.',
    'windows-app-privacy': 'Windows App Privacy Policy for Screen Stickynote.',
    'about': 'About Screen Stickynote - The infinite virtual canvas entirely offline. We believe that the best ideas need room to grow. Traditional linear to-do lists and narrow text documents force our thoughts into rigid structures.'
};

coreRoutes.forEach(route => {
    const url = `https://screenstickynote.com/${route}/`;
    let specificHtml = baseHtml;

    // Replace the NATIVE STATIC SEO LANDING CONTENT with core route fallback text (prevents thin-content penalty)
    const fallbackText = coreRouteDescriptions[route] || route;
    specificHtml = specificHtml.replace(
        /<!-- NATIVE STATIC SEO LANDING CONTENT -->[\s\S]*?<\/section>/gi,
        `<section id="seo-content" class="sr-only"><h1>${route}</h1><p>${fallbackText}</p></section>`
    );

    // Replace default canonical tag
    specificHtml = specificHtml.replace(
        /<link\s+[^>]*?rel="canonical"[\s\S]*?\/>/gi,
        `<link data-rh="true" rel="canonical" id="canonical-link" href="${url}" />`
    );

    // Replace OG URL and Twitter URL to match the specific route
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?property="og:url"[\s\S]*?\/>/gi, `<meta data-rh="true" property="og:url" content="${url}" />`);
    specificHtml = specificHtml.replace(/<meta\s+[^>]*?property="twitter:url"[\s\S]*?\/>/gi, `<meta data-rh="true" property="twitter:url" content="${url}" />`);

    // Optional: We let App Helmet handle <title> and Description for these generic routes dynamically since they aren't generated from Markdown yet.
    // However, fixing the canonical avoids "Page with redirect" errors on standard hosting

    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), specificHtml);
    console.log(`- Generated static directory for core route: /${route}/index.html`);
});

console.log("Static route generation complete.");
