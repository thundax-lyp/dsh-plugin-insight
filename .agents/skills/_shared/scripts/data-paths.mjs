import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';
// Legacy migration paths only. Current truth is catalog/<slug>/research.json and meta.json; index is derived.
export const CATALOG = 'data/catalog/PLUGINS.json';
export const PUBLICATION = 'data/catalog/PUBLICATION.json';
export const REGISTRY = 'data/catalog/PLUGIN-PATHS.json';
export const MIGRATION = 'data/catalog/MIGRATION.json';
export const slug = (text) =>
    text
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '');
const directoryCache = new Map();
export function pluginDirectory(plugin, root) {
    const index = resolve(root, 'data/catalog/index.jsonl');
    const path = resolve(root, REGISTRY);
    let saved;
    if (existsSync(index)) {
        const stat = statSync(index, { bigint: true });
        const version = `${stat.ino}:${stat.mtimeNs}:${stat.size}`;
        let cached = directoryCache.get(index);
        if (cached?.version !== version) {
            cached = {
                version,
                directories: new Map(
                    readFileSync(index, 'utf8')
                        .trimEnd()
                        .split('\n')
                        .filter(Boolean)
                        .map((line) => {
                            const row = JSON.parse(line);
                            return [row.identity, row.directory];
                        })
                )
            };
            directoryCache.set(index, cached);
        }
        saved = cached.directories.get(plugin.id);
    } else saved = (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {})[plugin.id];
    const directory =
        saved ??
        `data/plugins/${plugin.repository.split('/').map(slug).join('--')}${plugin.component_id === 'root' ? '' : '--' + slug(plugin.component_id)}`;
    if (!/^data\/plugins\/[a-z0-9][a-z0-9._-]*$/.test(directory) || directory.includes('..'))
        throw Error('invalid plugin directory');
    return directory;
}
export function rebaseMarkdown(text, from, to) {
    const folder = (path) => path.slice(0, path.lastIndexOf('/'));
    // Caller supplies project-relative paths; URL and fragment-only links stay intact.
    return text.replace(/\]\(([^)]+)\)/g, (all, href) => {
        if (/^(?:[a-z]+:|#|\/)/i.test(href)) return all;
        const [path, ...hash] = href.split('#');
        const absolute = resolve(folder(from), path);
        const destination = resolve(folder(to));
        return (
            '](' +
            relative(destination, absolute).split('\\').join('/') +
            (hash.length ? '#' + hash.join('#') : '') +
            ')'
        );
    });
}
