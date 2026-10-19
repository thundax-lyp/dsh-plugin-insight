#!/usr/bin/env node
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {ROOT,read,atomicWrite} from './plugin-data.mjs';
import {api} from './capture-github.mjs';
const ajv=new Ajv({strict:true,allErrors:true});addFormats(ajv);
const check=ajv.compile(read(resolve(ROOT,'schemas/github-meta.schema.json')));
export function validateMetadata(value){if(!check(value))throw Error(ajv.errorsText(check.errors));return value;}
export function captureMetadata(repository,request=api,at=new Date().toISOString()){
 if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository))throw Error('expected owner/repository');
 const from=new Date(Date.parse(at)-30*86400000).toISOString();
 const result={repository,repository_id:null,captured_at:at,window_start:from,stars:null,pushed_at:null,issues:{open:null,closed:null,created_30d:null,closed_30d:null,updated_30d:null},errors:[]};
 try{const m=request(`repos/${repository}`);result.repository=m.full_name;result.repository_id=m.id;result.stars=m.stargazers_count;result.pushed_at=m.pushed_at;}catch(e){result.errors.push({target:repository,message:e.message});return validateMetadata(result);}
 const queries={open:'is:open',closed:'is:closed',created_30d:`created:${from}..${at}`,closed_30d:`is:closed closed:${from}..${at}`,updated_30d:`updated:${from}..${at}`};
 for(const [name,filter]of Object.entries(queries)){
  try{const q=`repo:${result.repository} is:issue ${filter}`;const r=request(`search/issues?q=${encodeURIComponent(q)}&per_page=1`);if(r.incomplete_results||!Number.isSafeInteger(r.total_count))throw Error('incomplete issue search');result.issues[name]=r.total_count;}
  catch(e){result.errors.push({target:name,message:e.message});}
 }
 return validateMetadata(result);
}
export async function captureNpmDownloads(name,request=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json();},at=new Date().toISOString()){
 if(!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name))throw Error('invalid npm package name');
 const end=new Date(Date.parse(at));end.setUTCHours(0,0,0,0);end.setUTCDate(end.getUTCDate()-1);
 const start=new Date(end);start.setUTCDate(start.getUTCDate()-29);
 const from=start.toISOString().slice(0,10),to=end.toISOString().slice(0,10);
 const url=`https://api.npmjs.org/downloads/point/${from}:${to}/${encodeURIComponent(name)}`;
 const result={package_name:name,captured_at:at,window_start:from,window_end:to,downloads_30d:null,source_url:url,error:null};
 try{const data=await request(url);if(data.package!==name||data.start!==from||data.end!==to||!Number.isSafeInteger(data.downloads)||data.downloads<0)throw Error('npm package, window or count mismatch');result.downloads_30d=data.downloads;}
 catch(e){result.error=e.message;}
 return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const {values,positionals}=parseArgs({options:{out:{type:'string'},npm:{type:'string'}},allowPositionals:true});if(positionals.length!==1||!values.out)throw Error('Usage: capture-plugin-meta.mjs OWNER/REPO [--npm PACKAGE] --out FILE');const result=captureMetadata(positionals[0]);if(values.npm)result.npm=await captureNpmDownloads(values.npm);validateMetadata(result);atomicWrite(values.out,result);console.log(`${result.repository}: ${result.errors.length} GitHub errors${result.npm?.error?', npm: '+result.npm.error:''}`);}catch(e){console.error(e.message);process.exitCode=1;}
}
