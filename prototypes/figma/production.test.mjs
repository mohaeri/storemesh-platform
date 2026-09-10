import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const ts = require(process.env.PROTOTYPE_TYPESCRIPT || 'typescript');
const source = fs.readFileSync(new URL('./ProductionWorkbench.tsx', import.meta.url), 'utf8').split('const pwBox =')[0];
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
function setup() {
  const data = new Map();
  const receipt = { id: 'R1', supplier: 'Test', baskets: [{ code: 'IN1', product: 'Apple', gross: 11, tare: 1, zone: 'COLD_ROOM_CLEAN' }] };
  const carriers = ['IN1', 'OUT1', 'OUT2'].map(code => ({ code, type: 'BASKET', capacityKg: 20, status: 'ACTIVE' }));
  data.set('storemesh.prototype.containers', JSON.stringify(carriers));
  const localStorage = { getItem: k => data.get(k) || null, setItem: (k,v) => data.set(k,v) };
  const ctx = vm.createContext({ localStorage, readPrototypeBatch: () => receipt });
  vm.runInContext(js + '\nthis.api={recordSortingOutputs,readProductionLedger,saveProductionLedger,pwEvent,pwEmpty,pwFreeCarrier,pwUsable};',ctx);
  const output = (code='OUT1',weight=10) => ({code,weight,grade:'A',size:'L'});
  return { ...ctx.api, data, receipt, carriers, output, localStorage };
}
test('sorting persists one child per basket and exact mass balance', () => {
  const s=setup(); const children=s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',6),s.output('OUT2',4)],'');
  assert.equal(children.length,2); assert.notEqual(children[0].id,children[1].id);
  const l=s.readProductionLedger(); assert.equal(l.items.length,2); assert.equal(l.events[0].details.lossKg,0);
  assert.equal(l.items[0].parentId,'R1'); assert.equal(l.items[0].inputCodes[0],'IN1'); assert.equal(l.items[0].zone,'SORTING'); assert.equal(l.items[0].destination,null);
});
test('consumed source cannot be sorted twice', () => { const s=setup(); s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],''); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT2')],'')); assert.equal(s.readProductionLedger().items.length,1); });
test('positive loss needs classified reason', () => { const s=setup(); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',9)],'')); s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',9)],'WASTE'); assert.equal(s.readProductionLedger().events[0].details.lossKg,1); });
test('overweight and duplicate output reject without partial write', () => { const s=setup(); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',11)],'')); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',5),s.output('OUT1',5)],'')); assert.equal(s.readProductionLedger().items.length,0); });
test('input cannot also be output', () => { const s=setup(); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('IN1')],'')); });
test('receiving occupied basket cannot become production output', () => { const s=setup(); s.receipt.baskets.push({code:'OUT1',gross:3,tare:1,zone:'COLD_ROOM_CLEAN'}); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); });
test('production occupied basket cannot become output', () => { const s=setup(); const l=s.pwEmpty(); l.items.push({id:'X',containerCode:'OUT1',trays:[],consumed:false}); s.saveProductionLedger(l); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); });
test('damaged and single-use outputs rejected', () => { for (const change of [{status:'DAMAGED'},{type:'SINGLE_USE'}]) { const s=setup(); Object.assign(s.carriers[1],change); s.data.set('storemesh.prototype.containers',JSON.stringify(s.carriers)); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); } });
test('physical cold-room gate enforced', () => { const s=setup(); s.receipt.baskets[0].zone='RECEIVING'; assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); });
test('timestamp ties reload in sequence order', () => { const s=setup(); const l=s.pwEmpty(); l.events=[{seq:2,at:'2026-09-10T00:00:00Z'},{seq:1,at:'2026-09-10T00:00:00Z'}]; s.saveProductionLedger(l); const reloaded=s.readProductionLedger(); assert.equal(reloaded.events[0].seq,1); s.pwEvent(reloaded,'NEXT','B'); assert.equal(reloaded.events[2].seq,3); });
test('corrupt storage fails closed and remains intact', () => { const s=setup(); s.data.set('storemesh.prototype.production.v1','broken'); assert.ok(s.readProductionLedger().storageError); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); assert.equal(s.data.get('storemesh.prototype.production.v1'),'broken'); });
test('storage write failure cannot report successful sorting', () => { const s=setup(); s.localStorage.setItem=()=>{throw Error('quota');}; assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],''),/quota/); assert.equal(s.readProductionLedger().items.length,0); });
test('zone designation mismatch persists warning, not false hard gate', () => { const s=setup(); s.recordSortingOutputs(s.receipt,['IN1'],[{...s.output(),designationWarning:true}],''); const l=s.readProductionLedger(); assert.equal(l.events[0].details.severity,'WARNING'); assert.equal(l.items.length,1); });
test('active cycle and blocked batch prevent further work', () => { const s=setup(); const l=s.pwEmpty(), item={id:'X',weightKg:10,zone:'SORTING'}; l.cycles=[{status:'READY',itemIds:['X']}]; assert.throws(()=>s.pwUsable(l,item)); l.cycles=[]; item.blocked=true; assert.throws(()=>s.pwUsable(l,item)); });
