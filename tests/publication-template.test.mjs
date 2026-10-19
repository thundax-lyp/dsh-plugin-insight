import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fillTemplate,template} from '../scripts/publication/template.mjs';
test('templates reject missing fields and do not interpret inserted research text recursively',()=>{
 assert.throws(()=>fillTemplate('{{missing}}',{}),/missing template value/);
 assert.equal(fillTemplate('{{text}}',{text:'$& {{unrelated}}'}),'$& {{unrelated}}');
});
test('template loading is constrained to named project resources',()=>{
 assert.throws(()=>template('../README'),/invalid template/);
 assert.throws(()=>template('DOES-NOT-EXIST'),/ENOENT/);
});
