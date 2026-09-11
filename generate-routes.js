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

files.forEach(file => {
    const slug = file.replace('.md', '');
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const parsed = matter(content);
    // Construct dynamic tags
    const title = `${parsed.data.title} | Screen Stickynote Blog`;
    const description = parsed.data.excerpt ? parsed.data.excerpt.replace(/"/g, '&quot;') : "Read the latest updates and deep-dives on the Screen Stickynote application.";
    const url = `https://screenstickynote.com/blog/${slug}`;
    const imageUrl = parsed.data.thumbnail || "https://screenstickynote.com/og-image.jpg";

    let specificHtml = baseHtml;

    // Regex replacements for standard SEO tags
    specificHtml = specificHtml.replace(/<title>.*?<\/title>/gi, `<title>${title}</title>`);
    specificHtml = specificHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/>/gi, `<meta name="description" content="${description}" />`);

    // Find JS-injected canonical tag and make it static for the specific route 
    specificHtml = specificHtml.replace(
        /document\.write\('<link rel="canonical" href="' \+ window\.location\.origin \+ window\.location\.pathname \+ '" \/>'\);/g,
        `document.write('<link rel="canonical" href="${url}" />');`
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

    console.log(`- Generated metadata static file: /blog/${slug}/index.html`);
});

console.log("Static route generation for blogs complete.");
