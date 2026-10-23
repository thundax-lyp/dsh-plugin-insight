import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { resolve } from 'node:path';
import { ROOT, read } from './plugin-data.mjs';
import { validateMetadata } from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';

const ajv = new Ajv({ strict: true, allErrors: true, verbose: true });
addFormats(ajv);
const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/publication.schema.json'));
const checkPublication = ajv.compile(schema);
const fields = ['metadata', 'summaries', 'capabilities', 'advice'];
// DISPLAY carries one component; use the publication item definitions without duplicating constraints.
const checkDisplay = ajv.compile({
    type: 'object',
    additionalProperties: false,
    required: fields,
    properties: Object.fromEntries(
        fields.map((field) => [
            field,
            field === 'metadata' ? { type: 'object' } : schema.properties[field].additionalProperties
        ])
    )
});
function assertValid(check, value, label) {
    if (check(value)) return value;
    const errors = check.errors.map((error) => {
        const path = `${label}${error.instancePath}`;
        const pointer = (key) => key.replace(/~/g, '~0').replace(/\//g, '~1');
        if (error.keyword === 'required')
            return `${path}/${pointer(error.params.missingProperty)}: required field missing`;
        if (error.keyword === 'additionalProperties') {
            const allowed = Object.keys(error.parentSchema?.properties ?? {});
            return `${path}/${pointer(error.params.additionalProperty)}: unknown field${allowed.length ? `; allowed: ${allowed.join(', ')}` : ''}`;
        }
        return `${path}: ${error.message}`;
    });
    throw Error(errors.join('; '));
}
export function validatePublication(value) {
    return assertValid(checkPublication, value, 'publication');
}
export function validateDisplay(value) {
    assertValid(checkDisplay, value, 'display');
    try {
        validateMetadata(value.metadata);
    } catch (error) {
        throw Error(`display/metadata: ${error.message}`, { cause: error });
    }
    return value;
}
