#!/usr/bin/env node
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateSession } from './research-session.mjs';
import { ROOT, read, validate, validateObservations } from './plugin-data.mjs';

try {
  validate(read(resolve(ROOT, 'data/catalog.json')));
  validateObservations(read(resolve(ROOT, 'examples/observations.json')));
  const directory = resolve(ROOT, 'data/observations');
  if (existsSync(directory)) {
    for (const entry of readdirSync(directory, { recursive: true, withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        validateObservations(read(resolve(entry.parentPath, entry.name)));
      }
    }
  }
  const sessions = resolve(ROOT, 'data/sessions');
  if (existsSync(sessions)) {
    for (const entry of readdirSync(sessions, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.json')) validateSession(read(resolve(sessions, entry.name)));
    }
  }
  console.log('Catalog, synthetic example, observation batches and research sessions valid');
} catch (error) { console.error(`Error: ${error.message}`); process.exitCode = 1; }
