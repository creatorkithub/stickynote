import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputSvgPath = path.join(process.cwd(), 'public', 'sticky-note-icon.svg');
const publicDir = path.join(process.cwd(), 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

async function generate() {
    try {
        const svgStr = fs.readFileSync(inputSvgPath, 'utf8');
        // For maskable icon, remove rx="110" from background so it fills the 512x512 space fully
        const maskableSvgStr = svgStr.replace(/rx="110"/g, 'rx="0"');
        const maskableSvgPath = path.join(publicDir, 'sticky-note-icon-maskable.svg');
        fs.writeFileSync(maskableSvgPath, maskableSvgStr);

        // Re-generate basic icons
        await sharp(inputSvgPath)
            .resize(48, 48)
            .png()
            .toFile(path.join(publicDir, 'icon-48.png'));

        await sharp(inputSvgPath)
            .resize(192, 192)
            .png()
            .toFile(path.join(iconsDir, 'icon-192.png'));

        await sharp(inputSvgPath)
            .resize(512, 512)
            .png()
            .toFile(path.join(iconsDir, 'icon-512.png'));

        // Generate maskable transparent-less PNGs
        await sharp(Buffer.from(maskableSvgStr))
            .resize(192, 192)
            .png()
            .toFile(path.join(iconsDir, 'icon-maskable-192.png'));

        await sharp(Buffer.from(maskableSvgStr))
            .resize(512, 512)
            .png()
            .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

        console.log("Icons generated successfully.");
    } catch (error) {
        console.error("Error generating icons:", error);
    }
}

generate();
