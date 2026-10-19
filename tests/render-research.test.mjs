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
 const f=fixture();try{const result=renderPublication(f.input,f.root);assert.match(result.readme,/完成 \*\*3\/3\*\*/);assert.match(result.readme,/软件交付（2）/);assert.match(result.catalog,/关键质疑/);assert.match(result.catalog,/\]\(d3.md\)/);assert.doesNotMatch(result.readme,/AGENTS|package.json|工程使用|sessions\//);}finally{rmSync(f.root,{recursive:true,force:true});}
});
test('recommendations reject unresearched identities and unsupported installation claims',()=>{
 const f=fixture();try{f.input.recommendations[0].plugin_id='github:9:root';assert.throws(()=>renderPublication(f.input,f.root),/completed/);f.input.recommendations[0].plugin_id='github:1:root';f.input.recommendations[0].kind='install';assert.throws(()=>renderPublication(f.input,f.root),/host acceptance/);}finally{rmSync(f.root,{recursive:true,force:true});}
});
test('missing evidence pages and changed checkpoint details stop publication',()=>{
 const f=fixture();try{f.input.report='data/missing.md';assert.throws(()=>renderPublication(f.input,f.root),/ENOENT/);f.input.report='data/report.md';f.put('data/d1.md','changed');assert.throws(()=>renderPublication(f.input,f.root),/report changed/);}finally{rmSync(f.root,{recursive:true,force:true});}
});
