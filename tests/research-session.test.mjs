import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { main, startSession, validateSession, completeItem, saveSession } from '../scripts/research-session.mjs';
import { ROOT, read, plan } from '../scripts/plugin-data.mjs';
const url = 'https://example.com/plugins';
const candidate = { id:'github:1:root', repository:'a/b', path:'', revision:'abc', fingerprints:{code:'abc'}, source_urls:[url] };
const input = (id='round1', date='2026-10-19T00:00:00Z') => ({id,checked_at:date,sources:[{url,revision:'dir1',complete:true}],plugins:[structuredClone(candidate)]});
test('new rounds compare change markers but reset every completed analysis', () => {
 const old = startSession(input());
 const next = startSession(input('round2','2026-10-20T00:00:00Z'),old);
 assert.deepEqual(next.items[0].changes,['unchanged']); assert.equal(next.items[0].status,'pending');
 const moved = input('round3','2026-10-21T00:00:00Z'); moved.plugins[0].path='new'; moved.plugins[0].revision='def';
 assert.deepEqual(startSession(moved,next).items[0].changes,['moved','content_changed']);
});
test('absence is removal only after every old source was completely checked', () => {
 const old=startSession(input()); const fresh=input('round2','2026-10-20T00:00:00Z'); fresh.plugins=[];
 assert.deepEqual(startSession(fresh,old).items[0].changes,['removed_from_source']);
 fresh.sources[0].complete=false; assert.deepEqual(startSession(fresh,old).items[0].changes,['unknown']);
 fresh.sources=[{url:'https://example.com/other',revision:'x',complete:true}];
 assert.deepEqual(startSession(fresh,old).items[0].changes,['unknown']);
});
test('duplicates and unsafe identities do not silently enter a queue', () => {
 const bad=input(); bad.plugins.push(candidate); assert.throws(()=>startSession(bad),/duplicate/);
 const unsafe=input(); unsafe.plugins[0].path='../escape'; assert.throws(()=>startSession(unsafe),/unsafe/);
});
test('checkpoint requires fresh analysis, applied data and durable artifacts; resume detects tampering', () => {
 const root=mkdtempSync(join(tmpdir(),'dsh-session-'));
 try {
  const obs=read(join(ROOT,'examples/observations.json')); const plugin=obs.plugins[0];
  const cutoff='2020-01-01T00:00:00Z';
  const source=plugin.evidence[0]; source.kind='source_inspection';
  const s=startSession({id:'sample',checked_at:cutoff,sources:[{url,revision:'dir',complete:true}],plugins:[{...candidate,id:plugin.id,repository:plugin.repository,path:plugin.path,revision:source.revision}]});
  for(const e of plugin.evidence) delete e.artifact;
  writeFileSync(join(root,'obs.json'),JSON.stringify(obs));writeFileSync(join(root,'report.md'),'analysis');
  const empty={schema_version:1,plugins:[],runs:[]};
  assert.throws(()=>completeItem(structuredClone(s),plugin.id,'obs.json','report.md',empty,root),/apply/);
  const catalog=plan(empty,obs,'init').result;
  const wrong=structuredClone(s); wrong.items[0].revision='other';
  assert.throws(()=>completeItem(wrong,plugin.id,'obs.json','report.md',catalog,root),/revision/);
  const stale=structuredClone(s); stale.checked_at='2099-01-01T00:00:00Z';
  assert.throws(()=>completeItem(stale,plugin.id,'obs.json','report.md',catalog,root),/fresh analysis/);
  const completed=completeItem(s,plugin.id,'obs.json','report.md',catalog,root);
  assert.equal(completed.items[0].status,'complete');validateSession(completed,root);
  assert.throws(()=>completeItem(completed,plugin.id,'obs.json','report.md',catalog,root),/already/);
  writeFileSync(join(root,'report.md'),'modified');assert.throws(()=>validateSession(completed,root),/report changed/);
 } finally {rmSync(root,{recursive:true,force:true});}
});
test('existing writer locks are preserved',()=>{
 const root=mkdtempSync(join(tmpdir(),'dsh-lock-'));const path=join(root,'session.json');
 try{writeFileSync(path+'.lock','owner');assert.throws(()=>saveSession(path,()=>startSession(input())),/EEXIST/);}
 finally{rmSync(root,{recursive:true,force:true});}
});

test('CLI creates, resumes, blocks and retries a durable queue without overwriting it', () => {
 const root=mkdtempSync(join(tmpdir(),'dsh-cli-session-'));
 try {
  const source=join(root,'input.json'); const out=join(root,'nested','session.json');
  writeFileSync(source,JSON.stringify(input()));
  main(['start','--input',source,'--out',out]);
  assert.throws(()=>main(['start','--input',source,'--out',out]),/exists/);
  main(['block','--session',out,'--plugin',candidate.id,'--reason','API unavailable; retry later']);
  assert.equal(read(out).items[0].status,'blocked');
  main(['retry','--session',out,'--plugin',candidate.id]);
  assert.equal(read(out).items[0].status,'pending');
  main(['validate','--session',out]);
 } finally {rmSync(root,{recursive:true,force:true});}
});
