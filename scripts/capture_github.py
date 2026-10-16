#!/usr/bin/env python3
"""Capture GitHub source evidence without executing repository content (requires gh auth)."""
import argparse
import base64
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import subprocess
import sys

from plugin_data import atomic_write, digest


def api(endpoint):
    completed = subprocess.run(['gh', 'api', endpoint], capture_output=True, text=True, timeout=90)
    if completed.returncode:
        raise ValueError(f'GitHub request failed for {endpoint}: {completed.stderr.strip()}')
    return json.loads(completed.stdout)


def release_fingerprint(releases):
    # Download counters are adoption metadata, not changes to a published artifact.
    versions = []
    for release in releases:
        versions.append({
            'id': release['id'], 'tag': release['tag_name'],
            'published_at': release['published_at'], 'body': release.get('body'),
            'prerelease': release['prerelease'], 'draft': release['draft'],
            'assets': sorted([
                {k: asset.get(k) for k in ('id', 'name', 'size', 'updated_at', 'digest')}
                for asset in release['assets']
            ], key=lambda asset: asset['id'])
        })
    return digest(sorted(versions, key=lambda release: release['id']))


def capture(repository):
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repository):
        raise ValueError('expected owner/repository')
    meta = api(f'repos/{repository}')
    canonical = meta['full_name']
    head = api(f'repos/{canonical}/commits/{meta["default_branch"]}')
    sha = head['sha']
    tree = api(f'repos/{canonical}/git/trees/{head["commit"]["tree"]["sha"]}?recursive=1')
    releases = api(f'repos/{canonical}/releases?per_page=100')
    files = {}
    paths = {entry['path'] for entry in tree['tree'] if entry['type'] == 'blob'}
    for name in ('README.md', 'readme.md', 'CATALOG.md', 'package.json', 'dsh.bundle.json'):
        if name in paths:
            content = api(f'repos/{canonical}/contents/{name}?ref={sha}')
            if content.get('encoding') != 'base64':
                raise ValueError(f'content too large or unsupported: {name}; retrieve separately at {sha}')
            files[name] = base64.b64decode(content['content']).decode('utf-8')
    return {
        'captured_at': datetime.now(timezone.utc).isoformat(),
        'repository_id': meta['id'], 'repository': canonical, 'commit': sha,
        'metadata': {k: meta.get(k) for k in (
            'id', 'full_name', 'description', 'default_branch', 'archived', 'disabled',
            'created_at', 'pushed_at', 'license', 'topics', 'html_url')},
        'tree': tree, 'releases': releases, 'files': files,
        'fingerprints': {
            'code': head['commit']['tree']['sha'],
            'release': release_fingerprint(releases),
            'maintenance': digest({k: meta[k] for k in ('archived', 'disabled', 'pushed_at')})
        },
        'limitations': ['Default branch snapshot is not a published-package or runtime validation.',
                        'Release endpoint includes at most 100 entries; no claim of complete release history.',
                        'Tree fingerprint includes documentation and generated files; inspect diff before judging effective engineering work.'] +
                       (['Recursive tree is truncated; retrieve affected subtrees before analysis.'] if tree.get('truncated') else [])
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository')
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    try:
        result = capture(args.repository)
        atomic_write(Path(args.out), result)
        print(f'Captured {result["repository"]} at {result["commit"]}')
    except (ValueError, OSError, subprocess.TimeoutExpired) as error:
        print(f'Error: {error}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
