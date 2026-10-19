import {readFileSync} from 'node:fs';
export function fillTemplate(source,values){
 return source.trimEnd().replace(/\{\{([a-z_]+)\}\}/g,(_,key)=>{
  if(!Object.hasOwn(values,key))throw Error(`missing template value: ${key}`);
  return String(values[key]);
 });
}
export function template(name,values={}){
 if(!/^[A-Z-]+$/.test(name))throw Error('invalid template name');
 return fillTemplate(readFileSync(new URL(`../../templates/publication/${name}.md`,import.meta.url),'utf8'),values);
}
