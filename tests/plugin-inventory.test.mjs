import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {analyzeFiles,scanCapabilities,markdownWords,gitFiles} from '../scripts/plugin-inventory.mjs';
test('pinned Node LOC CLI separates Markdown and each JS/TS extension, excludes Python and build output',()=>{
 const files={'README.md':'中文hello world\n','src/a.mjs':'// comment\nconst x=1;\n','src/b.cjs':'module.exports=1;\n','src/c.mts':'const x:number=1;\n','src/d.tsx':'const x=<div/>;\n','src/external.py':'print(1)','dist/a.js':'generated','tests/a.test.mjs':'// test\n'};
 const r=analyzeFiles(files,{revision:'fixture',coverage:'synthetic'});
 assert.equal(r.tools.loc.name,'sloc');assert.equal(r.files.length,6);assert.equal(r.files.find(f=>f.path==='README.md').words,4);
 assert.equal(r.files.find(f=>f.path==='src/a.mjs').lines,2);assert.equal(r.files.find(f=>f.path==='src/b.cjs').extension,'.cjs');
 assert.ok(r.groups.some(g=>g.extension==='.mjs'&&g.role==='test'));assert.ok(r.excluded.some(f=>f.path==='dist/a.js'));assert.equal('total_lines' in r,false);
});
test('AST inventory ignores comments and string examples, deduplicates names, keeps dynamic registrations unresolved',()=>{
 const text=`// defineTool({name:'fake'})\nconst s="ctx.agentPresets.register({id:'fake'})";\ndefineTool({name:'lookup'});ctx.tools.register({name:'lookup'});ctx.tools.register(makeTool());\nctx.agentPresets.register({id:'research'});registerCommand(['go','g'], handler);`;
 const r=analyzeFiles({'src/index.ts':text},{revision:'fixture'});
 assert.deepEqual(r.capability_summary.tools.literal_names,['lookup']);assert.equal(r.capability_summary.tools.literal_count,1);assert.equal(r.capability_summary.tools.unresolved_sites,1);
 assert.deepEqual(r.capability_summary.agents.literal_names,['research']);assert.equal(r.capability_summary.agents.confirmed_count,null);assert.deepEqual(r.capabilities.commands[0].aliases,['g']);
});
test('Skill entries distinguish examples and malformed metadata; Markdown counts Han separately from adjacent Latin',()=>{
 const text='---\nname: lookup\ndescription: Find data\n---\n';
 const r=analyzeFiles({'skills/lookup/SKILL.md':text,'examples/lookup/SKILL.md':text,'skills/broken/SKILL.md':'# missing frontmatter'},{revision:'fixture'});
 assert.equal(r.skills.entry_candidates.length,3);assert.equal(r.skills.non_example_candidates,1);assert.equal(markdownWords('中文hello世界 123'),6);
 assert.throws(()=>analyzeFiles({'../outside.md':'no'},{}),/unsafe/);
});
test('git input reads a fixed commit and never counts uncommitted source',()=>{
 const root=mkdtempSync(join(tmpdir(),'dsh-git-inventory-'));
 const git=args=>execFileSync('git',['-C',root,...args],{encoding:'utf8'});
 try{git(['init','-q']);writeFileSync(join(root,'a.mjs'),'const old=1;\n');git(['add','a.mjs']);git(['-c','user.name=Fixture','-c','user.email=fixture@example.invalid','commit','-qm','fixture']);const sha=git(['rev-parse','HEAD']).trim();writeFileSync(join(root,'a.mjs'),'changed');const r=gitFiles(root,sha);assert.equal(r.metadata.revision,sha);assert.equal(r.files['a.mjs'],'const old=1;\n');}
 finally{rmSync(root,{recursive:true,force:true});}
});
