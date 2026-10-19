#!/usr/bin/env node
import {existsSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {validateSession} from './research-session.mjs';
import {verifyMigration} from './migrate-data.mjs';
import {ROOT,read,validate,validateObservations} from '../../_shared/scripts/plugin-data.mjs';
import {validateMetadata} from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
import {CATALOG,MIGRATION,REGISTRY,pluginDirectory} from '../../_shared/scripts/data-paths.mjs';
const walk=path=>existsSync(path)?readdirSync(path,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(path,e.name)):[resolve(path,e.name)]):[];
try{
 const catalog=read(resolve(ROOT,CATALOG));validate(catalog);
 const registry=read(resolve(ROOT,REGISTRY));
 if(new Set(Object.values(registry)).size!==Object.keys(registry).length)throw Error('duplicate plugin directory');
 for(const plugin of catalog.plugins){
  if(!registry[plugin.id])throw Error(`unregistered plugin directory: ${plugin.id}`);
  const directory=pluginDirectory(plugin,ROOT);
  const metaPath=resolve(ROOT,directory,'META.json');
  if(existsSync(metaPath)){const meta=validateMetadata(read(metaPath));if(meta.repository_id!==null&&meta.repository_id!==plugin.repository_id)throw Error('current META identity differs');}
  for(const evidence of plugin.evidence)if(evidence.artifact&&!existsSync(resolve(ROOT,evidence.artifact)))throw Error(`missing evidence: ${evidence.artifact}`);
 }
 for(const path of walk(resolve(ROOT,'data/runs'))){
  if(path.endsWith('/SESSION.json')&&!path.includes('/migration-originals/'))validateSession(read(path));
  if(path.includes('/observations/')&&!path.includes('/migration-originals/')&&path.endsWith('.json'))validateObservations(read(path));
 }
 if(existsSync(resolve(ROOT,MIGRATION)))verifyMigration();
 console.log('Catalog, evidence, observation batches and research sessions valid');
}catch(error){console.error(`Error: ${error.message}`);process.exitCode=1;}
