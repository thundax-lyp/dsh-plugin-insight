import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inspectUpdate} from '../scripts/refresh-meta.mjs';
const item={repository:'a/b',revision:'old',path:'plugins/a'};
test('code update flag compares against research baseline and isolates component scripts including moved-out paths',()=>{
 const run=files=>inspectUpdate(item,e=>e.includes('commits?')?[{sha:'new'}]:{status:'ahead',files});
 assert.equal(run([{filename:'plugins/b/a.ts'},{filename:'README.md'}]).script_changed,false);
 assert.equal(run([{filename:'plugins/a/main.ts'}]).script_changed,true);
 assert.equal(run([{filename:'plugins/b/main.ts',previous_filename:'plugins/a/main.ts'}]).script_changed,true);
 assert.equal(inspectUpdate(item,()=>[{sha:'old'}]).script_changed,false);
});
test('failed or truncated comparisons never clear a possible update',()=>{
 const r=inspectUpdate(item,e=>e.includes('commits?')?[{sha:'new'}]:{status:'ahead',files:Array.from({length:300},()=>({filename:'README.md'}))});
 assert.equal(r.script_changed,null);assert.match(r.error,/incomplete/);
 const missing=inspectUpdate(item,()=>{throw Error('HTTP 403');});assert.equal(missing.script_changed,null);
});

test('refresh reads the list, uses only confirmed npm names, retains history and leaves research state untouched',async()=>{
 const {mkdtempSync,writeFileSync,readFileSync,rmSync}=await import('node:fs');
 const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {refresh}=await import('../scripts/refresh-meta.mjs');
 const root=mkdtempSync(join(tmpdir(),'dsh-refresh-'));
 try{
  const list={schema_version:1,id:'round',checked_at:'2026-10-18T00:00:00Z',previous_digest:null,sources:[{url:'https://example.invalid/list',revision:'x',complete:false}],items:[{id:'github:1:root',repository:'a/b',path:'',revision:'old',fingerprints:{code:'old'},source_urls:['https://example.invalid/list'],changes:['added'],status:'pending'},{id:'github:2:root',repository:'c/d',path:'',revision:'old',fingerprints:{code:'old'},source_urls:['https://example.invalid/list'],changes:['added'],status:'pending'}]};
  writeFileSync(join(root,'list.json'),JSON.stringify(list));writeFileSync(join(root,'catalog.json'),'research-sentinel');
  const old={repository:'a/b',repository_id:1,captured_at:'2026-10-18T00:00:00Z',window_start:'2026-09-18T00:00:00Z',stars:1,pushed_at:null,issues:{open:0,closed:0,created_30d:0,closed_30d:0,updated_30d:0},errors:[],npm:{package_name:'@known/plugin',captured_at:'2026-10-18T00:00:00Z',window_start:'2026-09-18',window_end:'2026-10-17',downloads_30d:1,source_url:'https://example.invalid/downloads',error:null}};
  writeFileSync(join(root,'old.json'),JSON.stringify(old));writeFileSync(join(root,'publication.json'),JSON.stringify({session:'list.json',metadata:{'github:1:root':'old.json'}}));
  const names=[];const result=await refresh('publication.json',{root,at:'2026-10-19T00:00:00Z',request:e=>{
   if(e.startsWith('repos/c/d'))throw Error('HTTP 403');
   if(e==='repos/a/b')return{id:1,full_name:'a/b',stargazers_count:2,pushed_at:'2026-10-18T00:00:00Z'};
   if(e.includes('commits?'))return[{sha:'new'}];if(e.includes('/compare/'))return{status:'ahead',files:[{filename:'main.ts'}]};return{total_count:3,incomplete_results:false};
  },downloads:async name=>{names.push(name);return old.npm;}});
  assert.deepEqual(names,['@known/plugin']);assert.equal(result.length,2);assert.equal(result[0].script_changed,true);assert.ok(result[1].errors.length);
  const pub=JSON.parse(readFileSync(join(root,'publication.json')));assert.equal(Object.keys(pub.metadata).length,2);
  assert.equal(readFileSync(join(root,'old.json'),'utf8'),JSON.stringify(old));assert.equal(readFileSync(join(root,'list.json'),'utf8'),JSON.stringify(list));assert.equal(readFileSync(join(root,'catalog.json'),'utf8'),'research-sentinel');
 }finally{rmSync(root,{recursive:true,force:true});}
});
