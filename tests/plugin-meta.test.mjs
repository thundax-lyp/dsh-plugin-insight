import {test} from 'node:test';
import assert from 'node:assert/strict';
import {captureMetadata} from '../scripts/capture-plugin-meta.mjs';
import {relativeTime} from '../scripts/render-research.mjs';
test('metadata excludes PRs and preserves failed or incomplete counts as unknown',()=>{
 const queries=[];const result=captureMetadata('a/b',endpoint=>{
  if(endpoint==='repos/a/b')return{full_name:'a/b',id:1,stargazers_count:7,pushed_at:'2026-10-17T00:00:00Z'};
  const q=new URLSearchParams(endpoint.split('?')[1]).get('q');queries.push(q);
  return {total_count:3,incomplete_results:q.includes('updated:')};
 },'2026-10-19T00:00:00Z');
 assert.equal(result.stars,7);assert.equal(result.issues.closed,3);assert.equal(result.issues.updated_30d,null);assert.equal(result.errors.length,1);assert.ok(queries.every(q=>q.includes('is:issue')));assert.ok(queries.some(q=>q.includes('is:closed closed:')));
});
test('relative times use Shanghai calendar days and fixed captured time',()=>{
 const at='2026-10-19T00:10:00Z';
 assert.equal(relativeTime('2026-10-18T17:00:00Z',at),'今天');
 assert.equal(relativeTime('2026-10-18T15:59:00Z',at),'昨天');
 assert.equal(relativeTime('2026-10-17T00:00:00Z',at),'前天');
 assert.equal(relativeTime('2026-10-15T00:00:00Z',at),'4天前');
 assert.equal(relativeTime('2026-09-10T00:00:00Z',at),'1个月前');
 assert.equal(relativeTime('2025-09-10T00:00:00Z',at),'1年前');
 assert.equal(relativeTime('2027-01-01T00:00:00Z',at),'暂未获取');
});

test('npm downloads use exact confirmed package and thirty complete UTC days; failure remains unknown',async()=>{
 const {captureNpmDownloads}=await import('../scripts/capture-plugin-meta.mjs');
 let requested;
 const value=await captureNpmDownloads('@scope/plugin',async url=>{requested=url;return{package:'@scope/plugin',start:'2026-09-19',end:'2026-10-18',downloads:123};},'2026-10-19T00:10:00Z');
 assert.equal(value.downloads_30d,123);assert.match(requested,/%40scope%2Fplugin$/);assert.equal(value.window_start,'2026-09-19');
 const failed=await captureNpmDownloads('example',async()=>{throw Error('HTTP 404');},'2026-10-19T00:10:00Z');
 assert.equal(failed.downloads_30d,null);assert.equal(failed.error,'HTTP 404');
 const wrong=await captureNpmDownloads('example',async()=>({package:'other',start:'2026-09-19',end:'2026-10-18',downloads:0}),'2026-10-19T00:10:00Z');
 assert.equal(wrong.downloads_30d,null);assert.match(wrong.error,/mismatch/);
});
