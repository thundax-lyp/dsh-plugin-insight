import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {ROOT,read,digest} from '../scripts/plugin-data.mjs';
import {renderPublication} from '../scripts/render-research.mjs';
function fixture(){
 const root=mkdtempSync(join(tmpdir(),'dsh-render-'));
 const put=(p,v)=>{const dest=join(root,p);mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,typeof v==='string'?v:JSON.stringify(v));};
 const items=[];
 for(let i=1;i<=3;i++){
  const obs=read(join(ROOT,'examples/observations.json'));const p=obs.plugins[0];p.id=`github:${i}:root`;p.repository_id=i;p.repository=`example/plugin${i}`;p.name=`插件${i}`;p.evidence[0].kind='source_inspection';p.business_category=i===1?'office-operations':'software-delivery';
  const report='- **用途：**任务\n- **亮点：**机制\n- **关键质疑：**收益待验\n- **建议：**条件试用\n';
  put(`data/o${i}.json`,obs);put(`data/d${i}.md`,report);
  items.push({id:p.id,repository:p.repository,path:'',revision:p.evidence[0].revision,fingerprints:p.fingerprints,source_urls:['https://github.com/awesome-dsh-plugin/awesome-dsh-plugin'],changes:['added'],status:'complete',checkpoint:{observations:`data/o${i}.json`,observations_digest:digest(obs),report:`data/d${i}.md`,report_digest:digest(report),run_id:obs.run_id}});
 }
 put('data/session.json',{schema_version:1,id:'test',checked_at:'2026-10-19T00:00:00Z',previous_digest:null,sources:[{url:'https://github.com/awesome-dsh-plugin/awesome-dsh-plugin',revision:'x',complete:false}],items});
 put('data/report.md','轮次报告');put('data/recommendations.md','推荐');put('data/history.md','历史');
 return {root,put,input:{schema_version:1,session:'data/session.json',scope:'三插件定向冒烟',report:'data/report.md',recommendation_page:'data/recommendations.md',catalog_page:'data/catalog.md',recommendations:[{plugin_id:'github:1:root',kind:'trial',summary:'小批试用，收益待验'}],history:[{date:'2026-10-16',scope:'前轮',changes:'新增样本',report:'data/history.md'}]}};
}
test('three-plugin publication generates category counts and routes details without engineering navigation',()=>{
 const f=fixture();try{const result=renderPublication(f.input,f.root);assert.match(result.readme,/## 更新时间/);assert.match(result.readme,/id="plugin-3-root"/);assert.match(result.readme,/#### \[插件3\]\(data\/test-3-root-detail.md\)/);assert.doesNotMatch(result.readme,/\[详细分析\]/);assert.doesNotMatch(result.readme,/历史研究|本轮范围|具体来源版本|data\/catalog.md/);assert.match(result.readme,/软件交付（2）/);assert.match(result.catalog,/分类索引/);assert.equal(result.categoryPages.length,2);const pages=result.categoryPages.map(p=>p.content).join('\n');assert.match(pages,/关键质疑/);assert.match(pages,/\[插件3\]\(#plugin-3-root\)/);assert.doesNotMatch(pages,/研究深度：/);assert.match(pages,/test-3-root-detail.md/);assert.equal(result.details.length,3);assert.doesNotMatch(result.readme,/AGENTS|package.json|工程使用|sessions\//);}finally{rmSync(f.root,{recursive:true,force:true});}
});
test('recommendations reject unresearched identities and unsupported installation claims',()=>{
 const f=fixture();try{f.input.recommendations[0].plugin_id='github:9:root';assert.throws(()=>renderPublication(f.input,f.root),/completed/);f.input.recommendations[0].plugin_id='github:1:root';f.input.recommendations[0].kind='install';assert.throws(()=>renderPublication(f.input,f.root),/host acceptance/);}finally{rmSync(f.root,{recursive:true,force:true});}
});
test('missing evidence pages and changed checkpoint details stop publication',()=>{
 const f=fixture();try{f.input.report='data/missing.md';assert.throws(()=>renderPublication(f.input,f.root),/ENOENT/);f.input.report='data/report.md';f.put('data/d1.md','changed');assert.throws(()=>renderPublication(f.input,f.root),/report changed/);}finally{rmSync(f.root,{recursive:true,force:true});}
});

test('catalog renders linked popularity metrics without repeating collection notes',()=>{
 const f=fixture();try{
  const m={repository:'example/plugin1',repository_id:1,captured_at:'2026-10-19T00:00:00Z',window_start:'2026-09-19T00:00:00Z',stars:7,pushed_at:'2026-10-18T00:00:00Z',issues:{open:1,closed:2,created_30d:1,closed_30d:1,updated_30d:2},errors:[],npm:{package_name:'@scope/plugin',captured_at:'2026-10-19T02:00:00Z',window_start:'2026-09-19',window_end:'2026-10-18',downloads_30d:77,source_url:'https://api.npmjs.org/downloads/point/2026-09-19:2026-10-18/%40scope%2Fplugin',error:null}};
  f.put('data/meta.json',m);f.input.metadata={'github:1:root':'data/meta.json'};
  const result=renderPublication(f.input,f.root).categoryPages[0].content;
  assert.match(result,/\[!\[GitHub Star 7\]\(https:\/\/img.shields.io\/static\/v1\?/);assert.match(result,/logo=github/);assert.doesNotMatch(result,/Issue：|近30天：新建/);assert.match(renderPublication(f.input,f.root).details[0].content,/Issue：未关闭 1／已关闭 2/);
  assert.match(result,/\[!\[npm近30天下载 77\]\(https:\/\/img.shields.io\/static\/v1\?/);assert.match(result,/logo=npm/);assert.match(result,/\]\(https:\/\/www.npmjs.com\/package\/@scope\/plugin\)/);
  assert.match(result,/## 更新时间\n\n2026-10-19/);
  m.code_update={checked_at:'2026-10-19T02:00:00Z',baseline_revision:'old',current_revision:'new',script_changed:true,changed_files:['src/index.ts'],error:null};f.put('data/meta.json',m);const updated=renderPublication(f.input,f.root);assert.match(updated.categoryPages[0].content,/脚本有更新，待重新洞察/);assert.match(updated.readme,/脚本已更新，待复核/);assert.doesNotMatch(result,/META 采集于|Issue 不含 PR|2026-10-19T02:00:00Z/);
  m.npm.downloads_30d=null;m.npm.error='HTTP 404';f.put('data/meta.json',m);assert.match(renderPublication(f.input,f.root).categoryPages[0].content,/npm近30天下载 暂未获取/);
 }finally{rmSync(f.root,{recursive:true,force:true});}
});

test('latest and hot blocks sort independently, omit unknown metrics and recommendations exclude observe entries',async()=>{
 const {renderLatest,renderHot,renderRecommended}=await import('../scripts/publication/blocks.mjs');
 const entry=(id,stars,pushedAt)=>({i:{id},plugin:{name:id},anchor:id,stars,pushedAt,pushedLabel:'今天',starsBadge:'badge',needsReview:false});
 const a=entry('a',10,'2026-10-18T00:00:00Z'),b=entry('b',2,'2026-10-19T00:00:00Z'),c=entry('c',null,null);
 assert.ok(renderLatest([a,b,c]).indexOf('[b]')<renderLatest([a,b,c]).indexOf('[a]'));
 assert.ok(renderHot([b,a,c]).indexOf('[a]')<renderHot([b,a,c]).indexOf('[b]'));
 assert.doesNotMatch(renderHot([c]),/\[c\]/);
 assert.doesNotMatch(renderRecommended([{plugin_id:'a',kind:'observe',summary:'watch'}],new Map([['a',a]])),/watch/);
});

test('weekly additions use first admission date and Shanghai Monday boundary rather than code updates',async()=>{
 const {renderWeeklyNew}=await import('../scripts/publication/blocks.mjs');
 const entry=(id,firstAdded)=>({i:{id},plugin:{name:id},anchor:id,description:'用途',firstAdded});
 const output=renderWeeklyNew([entry('this-week','2026-10-18T16:00:00Z'),entry('last-week','2026-10-18T15:59:59Z'),entry('unknown',null),entry('future','2026-10-20T00:00:00Z')],'2026-10-19');
 assert.match(output,/this-week/);assert.doesNotMatch(output,/last-week|unknown|future/);
 assert.match(renderWeeklyNew([entry('old','2026-09-01T00:00:00Z')],'2026-10-19'),/本周暂无新增/);
});

test('home limits each category to five hottest plugins while category pages are alphabetical',async()=>{
 const {categoryGroups,renderHomeCategories,renderCategories}=await import('../scripts/publication/blocks.mjs');
 const names=['Zulu','alpha','Echo','bravo','Delta','charlie','Unknown'];const stars=[1,8,5,6,4,7,null];
 const items=names.map((name,i)=>({i:{id:String(i)},plugin:{name,business_category:'software-delivery'},anchor:'p'+i,description:'用途',stars:stars[i],meta:'meta',short:'短评'}));
 const groups=categoryGroups(items).map(g=>({...g,href:'category.md'}));
 const home=renderHomeCategories(groups,e=>e.plugin.name+'.md');
 assert.equal((home.match(/#### /g)||[]).length,5);assert.doesNotMatch(home,/#### \[Zulu\]|#### \[Unknown\]/);assert.match(home,/更多 软件交付/);assert.ok(home.indexOf('#### [alpha]')<home.indexOf('#### [charlie]'));
 const full=renderCategories(items,e=>e.plugin.name+'.md');
 assert.equal((full.match(/#### /g)||[]).length,7);assert.ok(full.indexOf('#### [bravo]')<full.indexOf('#### [charlie]'));assert.ok(full.indexOf('#### [Unknown]')<full.indexOf('#### [Zulu]'));
});
