#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import ts from 'typescript';
import sloc from 'sloc';
import { ROOT, read, atomicWrite, digest } from '../../_shared/scripts/plugin-data.mjs';
const CODE = new Set(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.mts', '.cts', '.tsx']);
const SKIP = /(^|\/)(node_modules|dist|build|vendor|third_party|coverage|\.git)(\/|$)|\.min\.[cm]?js$|\.d\.[cm]?ts$/;
const role = (path) =>
    /(^|\/)(examples?|fixtures?)(\/|$)/i.test(path)
        ? 'example'
        : /(^|\/)(__tests__|tests?|spec)(\/|$)|\.(test|spec)\.[^.]+$/.test(path)
          ? 'test'
          : 'source';
export const markdownWords = (text) =>
    [...text.matchAll(/\p{Script=Han}/gu)].length +
    [...text.replace(/\p{Script=Han}/gu, ' ').matchAll(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)].length;
// Extract only literal definitions/candidates. No target package is imported or executed.
export function scanCapabilities(path, text) {
    const file = ts.createSourceFile(
        path,
        text,
        ts.ScriptTarget.Latest,
        true,
        path.endsWith('tsx') ? ts.ScriptKind.TSX : path.endsWith('jsx') ? ts.ScriptKind.JSX : ts.ScriptKind.TS
    );
    const result = { agents: [], tools: [], commands: [], events: [], timers: [], ui: [] };
    const literal = (node) =>
        node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : null;
    const field = (node, key) =>
        ts.isObjectLiteralExpression(node ?? {})
            ? node.properties.find(
                  (p) => ts.isPropertyAssignment(p) && p.name.getText(file).replace(/['"]/g, '') === key
              )?.initializer
            : null;
    const visit = (node) => {
        if (ts.isCallExpression(node)) {
            const callee = node.expression.getText(file);
            let kind = null,
                key = 'name',
                arg = node.arguments[0];
            if (/\.agentPresets\.register$/.test(callee)) {
                kind = 'agents';
                key = 'id';
            } else if (/(^|\.)defineTool$|\.tools\.register$/.test(callee)) kind = 'tools';
            else if (/\.commands\.register$|(^|\.)registerCommand$/.test(callee)) kind = 'commands';
            else if (/\.(on|before)$/.test(callee)) kind = 'events';
            else if (/(^|\.)(setInterval|setTimeout)$/.test(callee)) kind = 'timers';
            else if (/\.slots\.(register|provide)$/.test(callee)) kind = 'ui';
            if (kind) {
                let name =
                    literal(field(arg, key)) ?? (['events', 'commands', 'ui'].includes(kind) ? literal(arg) : null);
                let aliases = [];
                if (kind === 'commands' && ts.isArrayLiteralExpression(arg ?? {})) {
                    const names = arg.elements.map(literal);
                    name = names[0];
                    aliases = names.slice(1).filter(Boolean);
                }
                result[kind].push({
                    path,
                    line: file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1,
                    api: callee,
                    name,
                    aliases,
                    status: name ? 'literal_candidate' : 'dynamic_unresolved'
                });
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(file);
    return {
        candidates: result,
        parse_errors: file.parseDiagnostics.map((d) => ({
            path,
            start: d.start,
            message: ts.flattenDiagnosticMessageText(d.messageText, ' ')
        }))
    };
}
export function analyzeFiles(files, metadata) {
    const diagnostics = [];
    const record = (message) => {
        diagnostics.push(message);
        console.warn(`[inventory] ${message}`);
    };
    let temporary;
    try {
        temporary = mkdtempSync(resolve(tmpdir(), 'dsh-inventory-'));
    } catch (error) {
        record(`LOC staging unavailable; use the pinned sloc library: ${error.message}`);
    }
    try {
        const selected = [],
            excluded = [],
            skills = [],
            capabilities = { agents: [], tools: [], commands: [], events: [], timers: [], ui: [] },
            parseErrors = [];
        for (const [path, text] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
            if (path.startsWith('/') || path.split('/').includes('..') || path.includes('\\'))
                throw Error('unsafe source path');
            if (SKIP.test(path)) {
                excluded.push({ path, reason: 'generated/dependency/vendor/declaration heuristic; review exclusions' });
                continue;
            }
            const ext = extname(path).toLowerCase();
            if (ext !== '.md' && !CODE.has(ext)) continue;
            if (typeof text !== 'string') throw Error(`source content must be text: ${path}`);
            if (text.includes('\0')) record(`NUL bytes in ${path}; preserve original text for counting.`);
            const stagedExtension =
                ext === '.md' ? '.html' : ext === '.cjs' ? '.js' : ['.mts', '.cts'].includes(ext) ? '.ts' : ext;
            // sloc ignores dot-prefixed files and directories. The temporary tree is only a transport for
            // per-file counts, so use visible synthetic names and retain the real path in `selected`.
            const staged = `file-${selected.length}${stagedExtension}`;
            if (temporary) {
                try {
                    const target = resolve(temporary, staged);
                    mkdirSync(dirname(target), { recursive: true });
                    writeFileSync(target, text);
                } catch (error) {
                    record(`LOC staging failed for ${path}; use the pinned sloc library: ${error.message}`);
                }
            }
            selected.push({ path, staged, extension: ext, role: role(path) });
            if (path.split('/').at(-1) === 'SKILL.md') {
                const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
                const title = frontmatter.match(/^name:\s*["']?([^\r\n"']+)/m)?.[1]?.trim();
                const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim();
                skills.push({
                    path,
                    name: title ?? null,
                    description: description ?? null,
                    role: role(path),
                    status: title && description ? 'entry_candidate' : 'needs_review'
                });
            }
            if (CODE.has(ext)) {
                const found = scanCapabilities(path, text);
                parseErrors.push(...found.parse_errors);
                for (const key of Object.keys(capabilities))
                    capabilities[key].push(...found.candidates[key].map((c) => ({ ...c, role: role(path) })));
            }
        }
        // sloc 0.3.2 CLI aliases are broken with its Commander dependency and it ignores dot-prefixed paths.
        // Stage visible synthetic names; map md to html for total lines only and cjs/mts/cts to js/ts,
        // while preserving the original path and extension in output.
        let stats = new Map();
        if (selected.length && temporary) {
            try {
                const raw = JSON.parse(
                    execFileSync(
                        process.execPath,
                        [resolve(ROOT, 'node_modules/sloc/bin/sloc'), '--format', 'json', '--details', temporary],
                        { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: 60000 }
                    )
                );
                if (!Array.isArray(raw?.files)) throw Error('missing file results');
                stats = new Map(raw.files.map((f) => [relative(temporary, resolve(f.path)).split('\\').join('/'), f]));
            } catch (error) {
                record(`LOC CLI failed; use the pinned sloc library: ${error.message}`);
            }
        }
        let uncounted = 0;
        const rows = selected.flatMap((f) => {
            let item = stats.get(f.staged);
            const valid = (value) =>
                value &&
                !value.badFile &&
                ['total', 'source', 'comment', 'empty'].every(
                    (key) => Number.isSafeInteger(value.stats?.[key]) && value.stats[key] >= 0
                );
            if (!valid(item)) {
                try {
                    item = { stats: sloc(files[f.path], extname(f.staged).slice(1)) };
                    if (!valid(item)) throw Error('invalid file counts');
                    record(`LOC counted ${f.path} with the pinned sloc library instead of the CLI.`);
                } catch (error) {
                    uncounted++;
                    const reason = `LOC unavailable: ${error.message}`;
                    excluded.push({ path: f.path, reason });
                    record(`${reason}; omit ${f.path} from LOC totals, not zero.`);
                    return [];
                }
            }
            const { staged, ...original } = f;
            return {
                ...original,
                lines: item.stats.total,
                ...(f.extension === '.md'
                    ? { words: markdownWords(files[f.path]) }
                    : { code: item.stats.source, comments: item.stats.comment, blank: item.stats.empty })
            };
        });
        const groups = [];
        for (const row of rows) {
            let g = groups.find((x) => x.extension === row.extension && x.role === row.role);
            if (!g) {
                g = {
                    extension: row.extension,
                    role: row.role,
                    files: 0,
                    lines: 0,
                    ...(row.extension === '.md' ? { words: 0 } : { code: 0, comments: 0, blank: 0 })
                };
                groups.push(g);
            }
            g.files++;
            for (const key of ['lines', 'words', 'code', 'comments', 'blank']) if (key in row) g[key] += row[key];
        }
        const summary = Object.fromEntries(
            Object.entries(capabilities).map(([key, items]) => [
                key,
                {
                    literal_names: [
                        ...new Set(items.filter((c) => c.role === 'source' && c.name).map((c) => c.name))
                    ].sort(),
                    unresolved_sites: items.filter((c) => c.role === 'source' && !c.name).length,
                    literal_count: new Set(items.filter((c) => c.role === 'source' && c.name).map((c) => c.name)).size,
                    confirmed_count: null,
                    status: 'static_candidates_require_review'
                }
            ])
        );
        return {
            schema_version: 1,
            ...metadata,
            ...(uncounted
                ? {
                      coverage: `${metadata.coverage}; LOC covers ${rows.length}/${selected.length} files; uncounted files are unknown, not zero`
                  }
                : {}),
            tools: {
                loc: {
                    name: 'sloc',
                    version: read(resolve(ROOT, 'node_modules/sloc/package.json')).version,
                    command: 'node node_modules/sloc/bin/sloc --format json --details <selected-files-directory>'
                },
                parser: { name: 'typescript', version: ts.version }
            },
            content_digest: digest(files),
            groups,
            files: rows,
            excluded,
            skills: {
                entry_candidates: skills,
                non_example_candidates: skills.filter((s) => s.role === 'source' && s.status === 'entry_candidate')
                    .length,
                status: 'ownership_and_runtime_registration_require_review'
            },
            capabilities,
            capability_summary: summary,
            parse_errors: parseErrors,
            limitations: [
                'LOC uses pinned sloc total; comment and source counts can overlap. Files use visible synthetic staging names because sloc ignores dot-prefixed paths; Markdown is staged as HTML for total lines only, and cjs/mts/cts are staged as js/ts because CLI aliases are ineffective.',
                'Markdown words: one Han character or one contiguous non-Han letter/number word; markup and fenced code included.',
                'Generated/vendor exclusions are heuristics; manually identify copied or bundled third-party code.',
                'Agent counts are preset-definition candidates, not AGENTS.md, prompt roles, spawned instances or runtime availability.',
                'Zero static candidates means not detected, not confirmed absent. YAML/JSON preset composition, aliases, dynamic factories and external providers need manual review.',
                ...diagnostics
            ]
        };
    } finally {
        if (temporary) {
            try {
                rmSync(temporary, { recursive: true, force: true });
            } catch (error) {
                console.warn(`[inventory] LOC temporary cleanup failed: ${error.message}`);
            }
        }
    }
}
export function gitFiles(root, ref, component = '') {
    if (component.startsWith('/') || component.split('/').includes('..')) throw Error('unsafe component');
    const git = (args) =>
        execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 60000 });
    const revision = git(['rev-parse', '--verify', `${ref}^{commit}`]).trim();
    const tree = git(['ls-tree', '-rz', revision, ...(component ? ['--', component] : [])])
        .split('\0')
        .filter(Boolean);
    const files = {},
        omitted = [];
    for (const entry of tree) {
        const [info, path] = entry.split('\t');
        if (!info.startsWith('100')) {
            omitted.push(path);
            continue;
        }
        const ext = extname(path).toLowerCase();
        if (!SKIP.test(path) && (ext === '.md' || CODE.has(ext))) files[path] = git(['show', `${revision}:${path}`]);
        else if (SKIP.test(path)) files[path] = '';
    }
    return {
        files,
        metadata: {
            revision,
            component,
            coverage: 'git tracked files at exact commit; component scope only',
            omitted_non_regular: omitted
        }
    };
}
export function main(args = process.argv.slice(2)) {
    const { values: v } = parseArgs({
        args,
        options: Object.fromEntries(['root', 'ref', 'component', 'snapshot', 'out'].map((k) => [k, { type: 'string' }]))
    });
    if (!v.out || Boolean(v.root) === Boolean(v.snapshot))
        throw Error('use --root ... --ref ... or --snapshot ..., with --out');
    let input;
    if (v.snapshot) {
        const s = read(v.snapshot);
        if (!s.repository || !s.revision || !s.files) throw Error('snapshot requires repository, revision and files');
        const component = v.component ?? '';
        input = {
            files: Object.fromEntries(
                Object.entries(s.files).filter(([p]) => !component || p === component || p.startsWith(component + '/'))
            ),
            metadata: {
                repository: s.repository,
                revision: s.revision,
                component,
                coverage: 'partial inspected snapshot; not whole-plugin LOC',
                source_artifact: v.snapshot
            }
        };
    } else {
        if (!v.ref) throw Error('--ref required');
        input = gitFiles(resolve(v.root), v.ref, v.component);
    }
    const result = analyzeFiles(input.files, input.metadata);
    atomicWrite(v.out, result);
    console.log(
        JSON.stringify({
            revision: result.revision,
            coverage: result.coverage,
            files: result.files.length,
            skill_candidates: result.skills.non_example_candidates
        })
    );
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        main();
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
}
