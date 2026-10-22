import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export const gitReferenceSchema = JSON.parse(
    readFileSync(new URL('../schemas/git-reference.schema.json', import.meta.url), 'utf8')
);
const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const check = ajv.compile(gitReferenceSchema);
export function validateGitReference(value) {
    if (!check(value)) throw Error('invalid Git reference: ' + ajv.errorsText(check.errors));
    const url = new URL(value.repository_url);
    if (
        !['https:', 'http:', 'ssh:', 'git:'].includes(url.protocol) ||
        !url.hostname ||
        url.pathname.length < 2 ||
        url.search ||
        url.hash ||
        url.password ||
        (url.username && url.protocol !== 'ssh:')
    )
        throw Error('Git repository must be an original repository URL without tokens, query or fragment');
    if (
        /[\\\r\n\0]/.test(value.path) ||
        /^[A-Za-z]:/.test(value.path) ||
        value.path.split('/').some((part) => !part || part === '.' || part === '..')
    )
        throw Error('Git source path must be repository-relative and normalized');
    if (value.line_start !== undefined && value.line_end < value.line_start)
        throw Error('Git source line range is reversed');
    if (value.symbol !== undefined && !value.symbol.trim()) throw Error('Git source symbol must not be blank');
    return value;
}
export function createGitReference(repository_url, commit, path, { content, ...locator } = {}) {
    return validateGitReference({
        repository_url,
        commit,
        path,
        ...locator,
        ...(content === undefined ? {} : { content_sha256: createHash('sha256').update(content, 'utf8').digest('hex') })
    });
}
// A URL is a convenience view of the stored locator, not a replacement for its fields.
export function gitReferenceUrl(reference) {
    validateGitReference(reference);
    const url = new URL(reference.repository_url);
    if (url.hostname !== 'github.com' || !['http:', 'https:'].includes(url.protocol)) return null;
    const repository = reference.repository_url.replace(/\/$/, '').replace(/\.git$/, '');
    const path = reference.path.split('/').map(encodeURIComponent).join('/');
    return `${repository}/blob/${reference.commit}/${path}${reference.line_start === undefined ? '' : `#L${reference.line_start}-L${reference.line_end}`}`;
}
