#!/usr/bin/env node
import {existsSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {ROOT,read,atomicWrite} from '../../_shared/scripts/plugin-data.mjs';
import {MIGRATION} from '../../_shared/scripts/data-paths.mjs';
const manifestPath='data/catalog/RUNS-CLEANUP.json';
const hash=p=>createHash('sha256').update(readFileSync(resolve(ROOT,p))).digest('hex');
const walk=p=>existsSync(p)?readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(p,e.name)):[resolve(p,e.name)]):[];
export function validateRunNames(){
 if(!existsSync(resolve(ROOT,'data/runs')))return;
 for(const e of readdirSync(resolve(ROOT,'data/runs'),{withFileTypes:true})){
  if(!e.isDirectory()||!/^\d{4}-\d{2}-\d{2}-\d{2,}$/.test(e.name)||Number(e.name.slice(11))<1)throw Error(`invalid run directory: ${e.name}`);
  const date=e.name.slice(0,10);if(new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date)throw Error(`invalid run date: ${date}`);
 }
 for(const p of walk(resolve(ROOT,'data/runs'))){
  if(p.includes('/migration-originals/'))continue;
  if(p.includes('/views/')||/\.(tmp|lock)$/.test(p)||p.endsWith('/.DS_Store'))throw Error(`generated or temporary run file: ${relative(ROOT,p)}`);
 }
}
export function verifyCleanup(){
 if(!existsSync(resolve(ROOT,manifestPath)))return new Map();
 const m=read(resolve(ROOT,manifestPath)),audit=read(resolve(ROOT,MIGRATION));
 const removed=new Map();
 for(const r of m.removed){
  const original=audit.files.find(x=>x.to===r.path);
  if(!/^data\/runs\/\d{4}-\d{2}-\d{2}-\d{2,}\/views\/.+\.md$/.test(r.path)||!original?.original_copy||original.original_copy!==r.original_copy||original.original_sha256!==r.original_sha256||original.migrated_sha256!==r.sha256||removed.has(r.path))throw Error('invalid cleanup record');
  if(existsSync(resolve(ROOT,r.path))||hash(r.original_copy)!==r.original_sha256)throw Error(`retired view or archive differs: ${r.path}`);
  removed.set(r.path,r);
 }
 return removed;
}
export function maintainRuns(apply=false){
 if(!existsSync(resolve(ROOT,'data/runs'))){console.log('No local runs to maintain');return;}
 if(existsSync(resolve(ROOT,manifestPath))){verifyCleanup();validateRunNames();console.log('Runs cleanup already applied; evidence verified');return;}
 const audit=read(resolve(ROOT,MIGRATION));
 const removed=audit.files.filter(r=>/^data\/runs\/[^/]+\/views\/.+\.md$/.test(r.to)).map(r=>{
  if(!r.original_copy||hash(r.original_copy)!==r.original_sha256||hash(r.to)!==r.migrated_sha256)throw Error(`view differs from audited copy: ${r.to}`);
  return {path:r.to,sha256:r.migrated_sha256,original_copy:r.original_copy,original_sha256:r.original_sha256};
 });
 const paths=new Set(removed.map(r=>r.path)),edits=[];
 // Only navigation in uncheckpointed round reports is rewritten. Fixed research stays intact.
 for(const p of walk(resolve(ROOT,'data/runs')).filter(p=>/\/(REPORT|RECOMMENDATIONS|PUBLICATION-REPORT)\.md$/.test(p)&&!p.includes('/migration-originals/'))){
  const old=readFileSync(p,'utf8');
  const text=old.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(all,label,href)=>paths.has(relative(ROOT,resolve(dirname(p),href)))?'[当前分类索引]('+relative(dirname(p),resolve(ROOT,'data/views/categories/INDEX.md'))+')':all);
  if(text!==old)edits.push({path:relative(ROOT,p),text});
 }
 // Refuse deletion if any other active Markdown still links to a retired page.
 for(const p of walk(resolve(ROOT,'data')).filter(p=>p.endsWith('.md')&&!p.includes('/migration-originals/')&&!paths.has(relative(ROOT,p)))){
  const text=edits.find(e=>e.path===relative(ROOT,p))?.text??readFileSync(p,'utf8');
  for(const match of text.matchAll(/\]\(([^)]+)\)/g))if(paths.has(relative(ROOT,resolve(dirname(p),match[1]))))throw Error(`remaining view reference: ${relative(ROOT,p)}`);
 }
 console.log(JSON.stringify({removed:removed.map(r=>r.path),navigation:edits.map(e=>e.path),apply},null,2));
 if(!apply)return;
 for(const e of edits)writeFileSync(resolve(ROOT,e.path),e.text);
 atomicWrite(resolve(ROOT,manifestPath),{schema_version:1,removed,navigation:edits.map(e=>e.path)});
 for(const r of removed)rmSync(resolve(ROOT,r.path));
 for(const p of readdirSync(resolve(ROOT,'data/runs'))) {
  const dir=resolve(ROOT,'data/runs',p,'views');
  const prune=d=>{if(!existsSync(d))return;for(const e of readdirSync(d,{withFileTypes:true}))if(e.isDirectory())prune(resolve(d,e.name));if(!readdirSync(d).length)rmSync(d,{recursive:true});};prune(dir);
 }
 verifyCleanup();validateRunNames();
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{if(process.argv.includes('--check')){if(existsSync(resolve(ROOT,'data/runs')))verifyCleanup();validateRunNames();}else maintainRuns(process.argv.includes('--apply'));}catch(e){console.error(e.message);process.exitCode=1;}
}
