import {existsSync,readFileSync} from 'node:fs';
import {resolve,relative} from 'node:path';
export const CATALOG='data/catalog/PLUGINS.json';
export const PUBLICATION='data/catalog/PUBLICATION.json';
export const REGISTRY='data/catalog/PLUGIN-PATHS.json';
export const MIGRATION='data/catalog/MIGRATION.json';
export const slug=text=>text.toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'');
export function pluginDirectory(plugin,root){
 const path=resolve(root,REGISTRY);const registry=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):{};
 const saved=registry[plugin.id];
 const directory=saved??`data/plugins/${plugin.repository.split('/').map(slug).join('--')}${plugin.component_id==='root'?'':'--'+slug(plugin.component_id)}`;
 if(!/^data\/plugins\/[a-z0-9][a-z0-9._-]*$/.test(directory)||directory.includes('..'))throw Error('invalid plugin directory');
 return directory;
}
export function rebaseMarkdown(text,from,to){
 const folder=path=>path.slice(0,path.lastIndexOf('/'));
 // Caller supplies project-relative paths; URL and fragment-only links stay intact.
 return text.replace(/\]\(([^)]+)\)/g,(all,href)=>{
  if(/^(?:[a-z]+:|#|\/)/i.test(href))return all;
  const [path,...hash]=href.split('#');
  const absolute=resolve(folder(from),path);const destination=resolve(folder(to));
  return ']('+relative(destination,absolute).split('\\').join('/')+(hash.length?'#'+hash.join('#'):'')+')';
 });
}
