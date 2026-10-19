#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, relative, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, read, validateObservations, validate as validateCatalog } from '../../_shared/scripts/plugin-data.mjs';
import {validateMetadata} from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
import {template} from './publication/template.mjs';
import {categoryGroups,renderCategoryIndex,renderHomeCategories,renderUpdated,renderWeeklyNew,renderLatest,renderHot,renderRecommended,renderCategories,renderSources} from './publication/blocks.mjs';
import {CATALOG,REGISTRY,pluginDirectory,rebaseMarkdown} from '../../_shared/scripts/data-paths.mjs';
import { validateSession } from './research-session.mjs';
const ajv = new Ajv({ strict:true, allErrors:true }); addFormats(ajv);
const check = ajv.compile(read(resolve(ROOT,'.agents/skills/_shared/schemas/publication.schema.json')));
const sources=['https://github.com/awesome-dsh-plugin/awesome-dsh-plugin','https://github.com/0xsline/awesome-deepseek-harness'];
const clean = text => text.replace(/[\r\n]/g,' ').replace(/[\[\]<>|]/g,'');
function local(root,path) {
 const full=resolve(root,path);
 if(isAbsolute(path)||relative(root,full).startsWith('..')) throw Error('path must be inside project');
 return full;
}
export function relativeTime(date,at){
 const a=Date.parse(at),d=Date.parse(date);if(!Number.isFinite(a)||!Number.isFinite(d)||d>a)return '暂未获取';
 const days=Math.floor((a+8*3600000)/86400000)-Math.floor((d+8*3600000)/86400000);
 if(days<3)return ['今天','昨天','前天'][days];
 return days<30?`${days}天前`:days<365?`${Math.floor(days/30)}个月前`:`${Math.floor(days/365)}年前`;
}
export function renderPublication(input,root=ROOT) {
 if(!check(input)) throw Error(ajv.errorsText(check.errors));
 const text=path=>readFileSync(local(root,path),'utf8');
 const session=validateSession(read(local(root,input.session)),root);
 if(!session.sources.every(s=>sources.includes(s.url))) throw Error('unexpected discovery source');
 if(input.catalog)validateCatalog(read(local(root,input.catalog)));
 const metadataDates=new Set();
 const items=session.items.filter(i=>i.status==='complete').map(i=>{
  const obs=read(local(root,i.checkpoint.observations));validateObservations(obs);
  const plugin=obs.plugins.find(p=>p.id===i.id);
  const report=text(i.checkpoint.report);
  const labels=['用途','亮点','思考','建议'];
  const short=labels.map(label=>{
   const sourceLabel=label==='思考'?'(?:思考|关键质疑)':label;
   const matches=[...report.matchAll(new RegExp(`^- \\*\\*${sourceLabel}(?:：\\*\\*|\\*\\*：)(.+)$`,'gm'))];
   if(matches.length!==1) throw Error(`detail needs one ${label}: ${i.id}`);
   return template('SHORT-ITEM',{label,text:matches[0][1]});
  }).join('\n');
  const detailPath=pluginDirectory(plugin,root)+'/INSIGHT.md';
  const displayReport=rebaseMarkdown(report,i.checkpoint.report,detailPath);
  const description=report.match(/^- \*\*用途(?:：\*\*|\*\*：)(.+)$/m)[1].split(/[。！？]/)[0];
  const anchor=`plugin-${plugin.repository_id}-${plugin.component_id}`;
  const path=input.metadata?.[i.id];let npmFirstPublished=null,meta='META：暂未获取。',homeMeta=null,pushedBadge=null,needsReview=false,stars=null,starsBadge=null,pushedAt=null,pushedLabel=null,issues='暂未获取。';
  if(path){
   const m=validateMetadata(read(local(root,path)));
   if(m.repository_id!==null&&m.repository_id!==plugin.repository_id)throw Error('metadata repository identity differs');
   if(m.repository.toLowerCase()!==plugin.repository.toLowerCase())throw Error('metadata repository differs');
   const n=v=>v===null?'暂未获取':v;
   issues=template('ISSUES',{open:n(m.issues.open),closed:n(m.issues.closed),created:n(m.issues.created_30d),closed_recent:n(m.issues.closed_30d),updated:n(m.issues.updated_30d),date:new Date(Date.parse(m.captured_at)+8*3600000).toISOString().slice(0,10)});
   const pushed=m.pushed_at?`${relativeTime(m.pushed_at,m.captured_at)}（${m.pushed_at.slice(0,10)}）`:'暂未获取';
   const badge=m.npm?'https://img.shields.io/static/v1?'+new URLSearchParams({label:'npm 30d',message:m.npm.downloads_30d===null?'暂未获取':m.npm.downloads_30d.toLocaleString('en-US'),color:m.npm.downloads_30d===null?'lightgrey':'blue',logo:'npm',style:'flat'}).toString():null;
   const downloads=m.npm?' · '+template('BADGE',{alt:`npm 30d ${n(m.npm.downloads_30d)}`,image:badge,url:`https://www.npmjs.com/package/${m.npm.package_name}`}):'';
   npmFirstPublished=m.npm?.publication?.error?null:m.npm?.publication?.first_published_at??null;
   for(const at of [m.captured_at,m.npm?.captured_at,m.npm?.publication?.captured_at].filter(Boolean)) metadataDates.add(new Date(Date.parse(at)+8*3600000).toISOString().slice(0,10));
   const starImage='https://img.shields.io/static/v1?'+new URLSearchParams({label:'GitHub ★',message:String(n(m.stars)),color:'yellow',logo:'github',style:'flat'}).toString();
   needsReview=m.code_update?.script_changed===true;
   const update=needsReview?' · **脚本有更新，待重新洞察**':m.code_update?.script_changed===null?' · 脚本更新状态暂未确认':'';
   stars=m.stars;pushedAt=m.pushed_at;pushedLabel=m.pushed_at?relativeTime(m.pushed_at,m.captured_at):null;
   starsBadge=template('BADGE',{alt:`GitHub ★ ${n(m.stars)}`,image:starImage,url:`https://github.com/${m.repository}`});
   meta=template('META',{stars:starsBadge,downloads,open:n(m.issues.open),closed:n(m.issues.closed),created:n(m.issues.created_30d),closed_recent:n(m.issues.closed_30d),updated:n(m.issues.updated_30d),pushed,review:update});
   const updatedLabel=pushedLabel??'暂未获取';
   const updatedImage='https://img.shields.io/static/v1?'+new URLSearchParams({label:'最后更新',message:updatedLabel,color:pushedLabel?'blue':'lightgrey',logo:'github',style:'flat'}).toString();
   pushedBadge=template('BADGE',{alt:`最后更新 ${updatedLabel}`,image:updatedImage,url:`https://github.com/${m.repository}/commits`});
   homeMeta=template('HOME-META',{stars:starsBadge,downloads,updated:pushedBadge,review:update});
  }
  return {i,plugin,short,description,anchor,meta,homeMeta,pushedBadge,needsReview,stars,starsBadge,pushedAt,pushedLabel,npmFirstPublished,detailPath,detail:template('DETAIL',{analysis:displayReport.trimEnd().replace(/^- \*\*(用途|亮点|思考|关键质疑|建议)(?:：\*\*|\*\*：)(.*)$/gm,(_,label,text)=>template('SHORT-ITEM',{label:label==='关键质疑'?'思考':label,text})),issues})+'\n'};
 });
 const byId=new Map(items.map(p=>[p.i.id,p]));
 if(input.recommendations.length!==new Set(input.recommendations.map(r=>r.plugin_id)).size) throw Error('duplicate recommendation');
 const link=(from,to)=>relative(dirname(local(root,from)),local(root,to)).split('\\').join('/');
 for(const path of [input.report,input.recommendation_page,...(input.history??[]).map(h=>h.report)]) text(path);
 for(const rec of input.recommendations) {
  const entry=byId.get(rec.plugin_id);if(!entry) throw Error('recommendation must reference completed analysis');
  if(rec.kind==='install' && !entry.plugin.evidence.some(e=>e.kind==='host_acceptance'&&e.revision===entry.i.revision&&e.environment&&e.artifact)) throw Error('install recommendation needs pinned host acceptance');
 }
 const dates=[...metadataDates].sort();
 const updated=dates.at(-1)??new Date(Date.parse(session.checked_at)+8*3600000).toISOString().slice(0,10);
 const directory=dirname(input.catalog_page);
 const groups=categoryGroups(items).map(g=>({...g,path:`${directory}/${g.key.toUpperCase()}.md`}));
 const categoryPages=groups.map(g=>({path:g.path,content:template('CATEGORY-PAGE',{name:g.name,home:link(g.path,'README.md'),categories:renderCategories(g.entries,e=>link(g.path,e.detailPath)),updated:renderUpdated(updated)})+'\n'}));
 const catalog=template('CATALOG',{updated:renderUpdated(updated),categories:renderCategoryIndex(groups.map(g=>({...g,href:link(input.catalog_page,g.path)})))})+'\n';
 const homeGroups=groups.map(g=>({...g,href:link('README.md',g.path),entries:g.entries.map(e=>({...e,meta:e.homeMeta??e.meta}))}));
 const homeItems=items.map(e=>({...e,href:e.detailPath}));
 const homeById=new Map(homeItems.map(e=>[e.i.id,e]));
 const readme=template('README',{updated:renderUpdated(updated),weekly_new:renderWeeklyNew(homeItems,updated),latest:renderLatest(homeItems),hot:renderHot(homeItems),recommended:renderRecommended(input.recommendations,homeById),categories:renderHomeCategories(homeGroups,e=>e.detailPath),sources:renderSources(sources)})+'\n';
 const registry=existsSync(local(root,REGISTRY))?read(local(root,REGISTRY)):{};
 const allPlugins=input.catalog?read(local(root,input.catalog)).plugins:items.map(e=>e.plugin);
 const outputs=[];
 for(const p of allPlugins){
  const directory=pluginDirectory(p,root);registry[p.id]=directory;const history=[];
  const runs=local(root,'data/runs');
  if(existsSync(runs))for(const name of readdirSync(runs).sort()){
   const sessionPath=`data/runs/${name}/SESSION.json`;if(!existsSync(local(root,sessionPath)))continue;
   const item=read(local(root,sessionPath)).items.find(i=>i.id===p.id&&i.status==='complete');
   if(item)history.push(`- [${name}](${link(directory+'/HISTORY/INDEX.md',item.checkpoint.report)})`);
  }
  outputs.push({path:directory+'/HISTORY/INDEX.md',content:template('HISTORY',{name:clean(p.name),entries:history.join('\n')||'暂无独立会话记录。'})+'\n'});
 }
 return {readme,catalog,categoryPages,details:items.map(e=>({path:e.detailPath,content:e.detail})),outputs,registry};
}
export function main(args=process.argv.slice(2)) {
 const {values:v}=parseArgs({args,options:{input:{type:'string'},check:{type:'boolean',default:false}}});
 if(!v.input) throw Error('--input is required');const input=read(resolve(v.input));const result=renderPublication(input);
 // Validate all output before writing either artifact.
 for(const [path,content]of [['README.md',result.readme],[input.catalog_page,result.catalog],...result.details.map(d=>[d.path,d.content]),...result.categoryPages.map(d=>[d.path,d.content]),...result.outputs.map(d=>[d.path,d.content]),[REGISTRY,JSON.stringify(result.registry,null,2)+'\n']]) {
  const target=local(ROOT,path);
  if(v.check){if(!existsSync(target)||readFileSync(target,'utf8')!==content) throw Error(`generated output differs: ${path}`);}
  else {mkdirSync(dirname(target),{recursive:true});writeFileSync(target,content);}
 }
 console.log(v.check?'Research navigation matches inputs':'Research navigation generated');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main();}catch(e){console.error(e.message);process.exitCode=1;}}
