import {template} from './template.mjs';
// Reader-facing blocks shared by README and the standalone classification page.
const clean=text=>text.replace(/[\r\n]/g,' ').replace(/[\[\]<>|]/g,'');
const categoryNames={'office-operations':'办公与运营','software-delivery':'软件交付','research-knowledge':'研究与知识','customer-service':'客户服务','content-creation':'内容生产','personal-productivity':'个人效率',infrastructure:'基础设施',other:'其他'};
const nameLink=e=>template('LINK',{label:clean(e.plugin.name),url:e.href??`#${e.anchor}`});
export const renderUpdated=date=>template('UPDATED',{date});
export function renderWeeklyNew(items,date){
 const day=new Date(date+'T00:00:00Z');
 const start=new Date(day);start.setUTCDate(start.getUTCDate()-(start.getUTCDay()+6)%7);
 const from=start.toISOString().slice(0,10);
 const selected=items.filter(e=>{if(!e.firstAdded)return false;const d=new Date(Date.parse(e.firstAdded)+8*3600000).toISOString().slice(0,10);return d>=from&&d<=date;}).sort((a,b)=>Date.parse(b.firstAdded)-Date.parse(a.firstAdded)||a.i.id.localeCompare(b.i.id));
 return template('WEEKLY-NEW',{items:selected.map(e=>template('NAVIGATION-ITEM',{plugin:nameLink(e),description:clean(e.description)})).join('\n')||'本周暂无新增。'});
}
export function renderLatest(items,limit=3){
 const selected=items.filter(e=>e.pushedAt).sort((a,b)=>Date.parse(b.pushedAt)-Date.parse(a.pushedAt)||a.i.id.localeCompare(b.i.id)).slice(0,limit);
 return template('LATEST',{items:selected.map(e=>template('LATEST-ITEM',{plugin:nameLink(e),time:e.pushedBadge??e.pushedLabel})).join('\n')||'暂无更新信息。'});
}
export function renderHot(items,limit=3){
 const selected=items.filter(e=>e.stars!==null&&e.stars!==undefined).sort((a,b)=>b.stars-a.stars||a.i.id.localeCompare(b.i.id)).slice(0,limit);
 return template('HOT',{items:selected.map(e=>template('HOT-ITEM',{plugin:nameLink(e),stars:e.starsBadge})).join('\n')||'暂无热度信息。'});
}
export function renderRecommended(recommendations,byId){
 const selected=recommendations.filter(r=>r.kind!=='observe');
 return template('RECOMMENDED',{items:selected.map(r=>{const e=byId.get(r.plugin_id);return template('RECOMMENDED-ITEM',{plugin:nameLink(e),kind:r.kind==='install'?'值得装':'条件试用',summary:clean(r.summary),review:e.needsReview?'（脚本已更新，待复核）':''});}).join('\n')||'暂无推荐。'});
}
export function categoryGroups(items){
 const groups=new Map();for(const e of items){const key=e.plugin.business_category;const category=categoryNames[key]??'其他';if(!groups.has(key))groups.set(key,{key,name:category,entries:[]});groups.get(key).entries.push(e);}
 return [...groups.values()];
}
export const alphabetical=(a,b)=>a.plugin.name.localeCompare(b.plugin.name,'en',{sensitivity:'base'})||a.i.id.localeCompare(b.i.id);
export function renderCategoryIndex(groups){
 return template('CATEGORY-INDEX',{items:groups.map(g=>template('CATEGORY-INDEX-ITEM',{name:g.name,count:g.entries.length,url:g.href})).join('\n')});
}
export function renderHomeCategories(groups,href,limit=5){
 const navigation=groups.map(g=>template('CATEGORY-INDEX-ITEM',{name:g.name,count:g.entries.length,url:`#category-${g.key}`})).join('\n');
 const sections=groups.map(g=>{
  const selected=[...g.entries].sort((a,b)=>(b.stars??-Infinity)-(a.stars??-Infinity)||alphabetical(a,b)).slice(0,limit);
  const plugins=selected.map(e=>template('PLUGIN',{anchor:e.anchor,name:clean(e.plugin.name),meta:e.meta,short:e.short,detail:href(e)})).join('\n\n');
  return template('HOME-CATEGORY',{key:g.key,name:g.name,count:g.entries.length,plugins,more:g.href});
 });
 return template('CATEGORIES',{navigation,groups:sections.join('\n\n')});
}
export function renderCategories(items,href){
 const groups=new Map();for(const e of items){const category=categoryNames[e.plugin.business_category]??'其他';if(!groups.has(category))groups.set(category,[]);groups.get(category).push(e);}
 const ordered=[...items].sort(alphabetical);
 const navigation=ordered.map(e=>template('NAVIGATION-ITEM',{plugin:nameLink(e),description:clean(e.description)})).join('\n');
 const sections=[];
 for(const [category,entries]of groups){
  const plugins=[...entries].sort(alphabetical).map(e=>template('PLUGIN',{anchor:e.anchor,name:clean(e.plugin.name),meta:e.meta,short:e.short,detail:href(e)})).join('\n\n');
  sections.push(template('CATEGORY',{name:category,count:entries.length,plugins}));
 }
 return template('CATEGORIES',{navigation,groups:sections.join('\n\n')});
}
export const renderSources=sources=>template('SOURCES',{items:sources.map(url=>template('SOURCE-ITEM',{name:url.split('github.com/')[1],url})).join('\n')});
