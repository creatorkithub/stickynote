export function parseFrontmatter(md: string) {
    // Strip BOM if present
    let cleanMd = md.trimStart();
    const match = cleanMd.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { data: {}, content: cleanMd };

    const yaml = match[1];
    const content = match[2];

    const data: Record<string, any> = {};
    yaml.split(/\r?\n/).forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) return;

        const key = line.substring(0, colonIdx).trim();
        let val = line.substring(colonIdx + 1).trim();

        // Quick handle for tags array ["foo", "bar"]
        if (val.startsWith('[') && val.endsWith(']')) {
            data[key] = val.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$|^'|'$/g, ''));
        }
        // Quick handle string "foo"
        else if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            data[key] = val.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
        } else {
            data[key] = val;
        }
    });

    return { data, content };
}
