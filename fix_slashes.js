import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Fix sitemap.xml
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// The regex matches <loc>...</loc> ensuring it doesn't already end in /</loc>
sitemapContent = sitemapContent.replace(/<loc>(https:\/\/screenstickynote\.com.*?)(?<!\/)<\/loc>/g, '<loc>$1/</loc>');
fs.writeFileSync(sitemapPath, sitemapContent);
console.log("Updated sitemap.xml trailing slashes.");

// 2. Fix llms.txt
const llmsPath = path.join(__dirname, 'public', 'llms.txt');
let llmsContent = fs.readFileSync(llmsPath, 'utf8');

// Match markdown links taking care to not add / to the root if it is just domain? 
// In llms.txt, most are like (https://screenstickynote.com/blog/xxx)
llmsContent = llmsContent.replace(/\((https:\/\/screenstickynote\.com.*?)(?<!\/)\)/g, '($1/)');
fs.writeFileSync(llmsPath, llmsContent);
console.log("Updated llms.txt trailing slashes.");
