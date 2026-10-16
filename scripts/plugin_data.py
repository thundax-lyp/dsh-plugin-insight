#!/usr/bin/env python3
"""Versioned plugin research: validate, plan and atomically apply local data."""
import argparse
import copy
from datetime import datetime
import fcntl
import hashlib
import json
import os
import re
from pathlib import Path
import sys
import tempfile

from jsonschema import Draft202012Validator, FormatChecker
from referencing import Registry, Resource

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = json.loads((ROOT / 'schemas/catalog.schema.json').read_text())
OBS_SCHEMA = json.loads((ROOT / 'schemas/observations.schema.json').read_text())
REGISTRY = Registry().with_resource('catalog.schema.json', Resource.from_contents(SCHEMA))
FORMATS = FormatChecker()


@FORMATS.checks('date-time', raises=ValueError)
def valid_time(value):
    if not isinstance(value, str):
        return True  # The schema's type check reports this separately.
    if not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})', value):
        return False
    datetime.fromisoformat(value.replace('Z', '+00:00'))
    return True


def timestamp(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00'))


def read(path):
    def unique(pairs):
        result = {}
        for key, value in pairs:
            if key in result:
                raise ValueError(f'duplicate JSON key: {key}')
            result[key] = value
        return result
    return json.loads(Path(path).read_text(), object_pairs_hook=unique)


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False,
                                     separators=(',', ':')).encode()).hexdigest()


def schema_check(value, schema):
    validator = Draft202012Validator(schema, registry=REGISTRY, format_checker=FORMATS)
    errors = sorted(validator.iter_errors(value), key=lambda e: str(list(e.absolute_path)))
    if errors:
        raise ValueError('; '.join(f'{list(e.absolute_path)}: {e.message}' for e in errors))


def indexed(items, label):
    result = {}
    for item in items:
        if item['id'] in result:
            raise ValueError(f'duplicate {label} id: {item["id"]}')
        result[item['id']] = item
    return result


def stale(finding, plugins):
    return any(plugins.get(d['plugin_id'], {}).get('fingerprints', {}).get(d['area'])
               != d['fingerprint'] for d in finding['dependencies'])


def validate(catalog):
    schema_check(catalog, SCHEMA)
    plugins = indexed(catalog['plugins'], 'plugin')
    indexed(catalog['runs'], 'run')
    evidence = {}
    for p in plugins.values():
        expected = f'github:{p["repository_id"]}:{p["component_id"]}'
        if p['id'] != expected:
            raise ValueError(f'identity must be {expected}')
        if p['path'].startswith('/') or '..' in p['path'].split('/'):
            raise ValueError(f'unsafe component path: {p["path"]}')
        indexed(p['sources'], 'source')
        indexed(p['findings'], 'finding')
        for e in p['evidence']:
            if e['id'] in evidence:
                raise ValueError(f'duplicate evidence id: {e["id"]}')
            evidence[e['id']] = e
            if e['kind'] in ('local_test', 'host_acceptance') and not (e.get('artifact') and e.get('environment')):
                raise ValueError(f'execution evidence needs artifact and environment: {e["id"]}')
        kinds = {e['kind'] for e in p['evidence']}
        required = {'source': 'source_inspection', 'tested': 'local_test', 'host_verified': 'host_acceptance'}
        if p['research_depth'] in required and required[p['research_depth']] not in kinds:
            raise ValueError(f'research depth lacks evidence: {p["id"]}')
    for p in plugins.values():
        for f in p['findings']:
            if any(e not in evidence for e in f['evidence_ids']):
                raise ValueError(f'unknown evidence reference: {f["id"]}')
            if f['basis'] != 'unverified' and not f['evidence_ids']:
                raise ValueError(f'finding needs evidence: {f["id"]}')
            for d in f['dependencies']:
                if d['plugin_id'] not in plugins or d['area'] not in plugins[d['plugin_id']]['fingerprints']:
                    raise ValueError(f'unknown finding dependency: {f["id"]}')
            if f['status'] == 'current' and stale(f, plugins):
                raise ValueError(f'current finding has obsolete dependency: {f["id"]}')
    for run in catalog['runs']:
        for change in run['changes']:
            if change['plugin_id'] not in plugins:
                raise ValueError(f'unknown change target: {change["plugin_id"]}')


def validate_observations(observations):
    schema_check(observations, OBS_SCHEMA)
    incoming = indexed(observations['plugins'], 'observation')
    for plugin in incoming.values():
        expected = f'github:{plugin["repository_id"]}:{plugin["component_id"]}'
        if plugin['id'] != expected:
            raise ValueError(f'identity must be {expected}')
        indexed(plugin['sources'], 'source')
        indexed(plugin['evidence'], 'evidence')
        indexed(plugin['findings'], 'finding')
        if timestamp(plugin['last_checked_at']) > timestamp(observations['checked_at']):
            raise ValueError('plugin check is later than batch cutoff')
    return incoming


def merge_immutable(old, new, label):
    result = indexed(copy.deepcopy(old), label)
    for item in new:
        if item['id'] in result and result[item['id']] != item:
            raise ValueError(f'{label} is immutable; use a new id: {item["id"]}')
        result[item['id']] = copy.deepcopy(item)
    return list(result.values())


def plan(catalog, observations, mode):
    validate(catalog)
    incoming = validate_observations(observations)
    if any(r['id'] == observations['run_id'] for r in catalog['runs']):
        raise ValueError('run_id already applied; use a new run id for a new check')
    if mode == 'init' and (catalog['plugins'] or catalog['runs']):
        raise ValueError('init requires an empty catalog; use update for an existing baseline')
    result = copy.deepcopy(catalog)
    plugins = indexed(result['plugins'], 'plugin')
    changes = []
    for key, new in incoming.items():
        old = plugins.get(key)
        if old and timestamp(new['last_checked_at']) < timestamp(old['last_checked_at']):
            raise ValueError(f'observation older than existing check: {key}')
        if old:
            merged = copy.deepcopy(new)
            merged['sources'] = merge_immutable(old['sources'], new['sources'], 'source')
            merged['evidence'] = merge_immutable(old['evidence'], new['evidence'], 'evidence')
            findings = indexed(copy.deepcopy(old['findings']), 'finding')
            findings.update(indexed(copy.deepcopy(new['findings']), 'finding'))
            merged['findings'] = list(findings.values())
            merged['aliases'] = sorted(set(old['aliases'] + new['aliases'] +
                                           ([old['repository'] + '/' + old['path']] if
                                            (old['repository'], old['path']) != (new['repository'], new['path']) else [])))
            # Observation batches may omit areas they did not inspect.
            merged['fingerprints'] = {**old['fingerprints'], **new['fingerprints']}
            areas = sorted(k for k, v in new['fingerprints'].items() if old['fingerprints'].get(k) != v)
            comparable = lambda p: {k: v for k, v in p.items() if k not in ('last_checked_at', 'sources', 'findings')}
            if comparable(old) != comparable(merged):
                changes.append({'plugin_id': key, 'kind': 'changed', 'areas': areas})
            if old['findings'] != merged['findings']:
                changes.append({'plugin_id': key, 'kind': 'reviewed', 'areas': []})
            plugins[key] = merged
        else:
            plugins[key] = copy.deepcopy(new)
            changes.append({'plugin_id': key, 'kind': 'added', 'areas': sorted(new['fingerprints'])})
    # Resolve all dependencies after the batch, including comparisons in other plugins.
    for key, p in plugins.items():
        invalidated = False
        for f in p['findings']:
            if stale(f, plugins):
                invalidated |= f['status'] == 'current'
                f['status'] = 'needs_review'
        if invalidated:
            changes.append({'plugin_id': key, 'kind': 'review_invalidated', 'areas': []})
    result['plugins'] = sorted(plugins.values(), key=lambda p: p['id'])
    result['runs'].append({'id': observations['run_id'], 'checked_at': observations['checked_at'],
                           'mode': mode, 'changes': changes, 'errors': observations['errors']})
    validate(result)
    return {'plan_version': 1, 'base_digest': digest(catalog), 'result_digest': digest(result),
            'summary': changes, 'errors': observations['errors'], 'result': result}


def atomic_write(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(dir=path.parent, prefix='.' + path.name)
    try:
        with os.fdopen(fd, 'w') as stream:
            json.dump(value, stream, ensure_ascii=False, indent=2)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def apply(catalog_path, prepared):
    if prepared.get('plan_version') != 1:
        raise ValueError('unsupported plan version')
    with Path(str(catalog_path) + '.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        current = read(catalog_path)
        if digest(current) != prepared['base_digest']:
            raise ValueError('catalog changed since planning; regenerate the plan')
        if digest(prepared['result']) != prepared['result_digest']:
            raise ValueError('plan result digest mismatch')
        validate(prepared['result'])
        atomic_write(catalog_path, prepared['result'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    v = sub.add_parser('validate')
    v.add_argument('--catalog', default=str(ROOT / 'data/catalog.json'))
    v.add_argument('--observations')
    p = sub.add_parser('plan')
    p.add_argument('--catalog', default=str(ROOT / 'data/catalog.json'))
    p.add_argument('--observations', required=True)
    p.add_argument('--mode', choices=['init', 'update'], required=True)
    p.add_argument('--out', required=True)
    a = sub.add_parser('apply')
    a.add_argument('--catalog', default=str(ROOT / 'data/catalog.json'))
    a.add_argument('--plan', required=True)
    args = parser.parse_args()
    try:
        if args.command == 'validate':
            Draft202012Validator.check_schema(SCHEMA)
            Draft202012Validator.check_schema(OBS_SCHEMA)
            validate(read(args.catalog))
            if args.observations:
                validate_observations(read(args.observations))
            print('Data validation passed')
        elif args.command == 'plan':
            prepared = plan(read(args.catalog), read(args.observations), args.mode)
            atomic_write(args.out, prepared)
            print(json.dumps({'changes': prepared['summary'], 'errors': prepared['errors']}, ensure_ascii=False))
        else:
            apply(args.catalog, read(args.plan))
            print('Plan applied')
    except (ValueError, KeyError, OSError) as error:
        print(f'Error: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
