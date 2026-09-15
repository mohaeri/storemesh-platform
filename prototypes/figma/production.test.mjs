import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const ts = require(process.env.PROTOTYPE_TYPESCRIPT || 'typescript');
const source = fs.readFileSync(new URL('./ProductionWorkbench.tsx', import.meta.url), 'utf8').split('const pwBox =')[0];
const helperSource = source.replace(/function ScanOptionalWeighTransition[\s\S]*?(?=function pwTransitionWeight)/, '');
const assembled = fs.readFileSync(new URL('./WebApp.tsx', import.meta.url), 'utf8');
const hub = fs.readFileSync(new URL('./HubApp.tsx', import.meta.url), 'utf8');
const js = ts.transpileModule(helperSource, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const modelSource = assembled.slice(assembled.indexOf('type PrototypeBasket'), assembled.indexOf('type MasterProduct')).replace(/function ScanSimulator[\s\S]*?(?=type PrototypeUser)/, '');
const modelJs = ts.transpileModule(modelSource, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
function setupModels(){const data=new Map(),localStorage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};const window={dispatchEvent(){}};const ctx=vm.createContext({localStorage,window,Event:function(){},Date});vm.runInContext(modelJs+'\nthis.api={normalizePrototypeBatch,applyReceiptWorkflowScan,validatePrototypeUser,writePrototypeUsers,readPrototypeUsers};',ctx);return {...ctx.api,data}}
function setup() {
  const data = new Map();
  const receipt = { id: 'R1', supplier: 'Test', baskets: [{ code: 'IN1', product: 'Apple', gross: 11, tare: 1, zone: 'SORTING', currentLocation: 'SORTING' }] };
  const carriers = ['IN1', 'OUT1', 'OUT2'].map(code => ({ code, type: 'BASKET', capacityKg: 20, status: 'ACTIVE' }));
  data.set('storemesh.prototype.containers', JSON.stringify(carriers));
  const localStorage = { getItem: k => data.get(k) || null, setItem: (k,v) => data.set(k,v) };
  const ctx = vm.createContext({ localStorage, readPrototypeBatch: () => receipt });
  vm.runInContext(js + '\nthis.api={recordSortingOutputs,readProductionLedger,saveProductionLedger,pwEvent,pwEmpty,pwFreeCarrier,pwUsable,pwAssertWashCompatibility,pwProportionalParentContributions};',ctx);
  const output = (code='OUT1',weight=10,destination='FRESH_EXPORT',parentContributions=[{batchId:'IN1',inputWeightKg:weight}]) => ({code,weight,grade:'A',size:'L',destination,parentContributions});
  return { ...ctx.api, data, receipt, carriers, output, localStorage };
}
test('sorting persists one child per basket and exact mass balance', () => {
  const s=setup(); const before=s.pwEmpty(); before.sortingSessions=[{id:'SORT-1',receiptId:'R1',inputCodes:['IN1'],status:'IN_PROGRESS'}]; s.saveProductionLedger(before); const children=s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',6),s.output('OUT2',4)],'');
  assert.equal(children.length,2); assert.notEqual(children[0].id,children[1].id);
  const l=s.readProductionLedger(); assert.equal(l.items.length,2); assert.equal(l.events.find(event=>event.action==='ثبت سورتینگ').details.lossKg,0);
  assert.equal(l.items[0].parentId,'IN1'); assert.equal(l.items[0].inputCodes[0],'IN1'); assert.equal(l.items[0].zone,'SORTING'); assert.equal(l.items[0].destination,'FRESH_EXPORT'); assert.equal(l.items[0].nextZone,'FRESH_EXPORT');
  assert.equal(l.sortingSessions[0].status,'COMPLETED');
});
test('multiple input baskets preserve exact weighted parents and create processing prerequisite route', () => { const s=setup(); s.receipt.baskets.push({code:'IN2',product:'Apple',gross:6,tare:1,zone:'SORTING',currentLocation:'SORTING'}); s.carriers.push({code:'IN2',type:'BASKET',capacityKg:20,status:'ACTIVE'}); s.data.set('storemesh.prototype.containers',JSON.stringify(s.carriers)); const [child]=s.recordSortingOutputs(s.receipt,['IN1','IN2'],[s.output('OUT1',15,'FREEZE_DRYING',[{batchId:'IN1',inputWeightKg:10},{batchId:'IN2',inputWeightKg:5}])],''); assert.equal(child.nextZone,'WASHING'); assert.deepEqual(Array.from(child.parentIds),['IN1','IN2']); assert.deepEqual(Array.from(s.readProductionLedger().consumedInputs),['R1:IN1','R1:IN2']); });
test('sorting distributes every output across mixed parents by entry weight',()=>{const s=setup(),sources=Array.from({length:5},(_,index)=>({code:`IN${index+1}`,gross:21,tare:1}));const rows=s.pwProportionalParentContributions(sources,20,{});assert.deepEqual(Array.from(rows,({batchId,inputWeightKg,sharePercent})=>({batchId,inputWeightKg,sharePercent})),Array.from({length:5},(_,index)=>({batchId:`IN${index+1}`,inputWeightKg:4,sharePercent:20})));assert.equal(rows.reduce((sum,row)=>sum+row.inputWeightKg,0),20)});
test('sorting parent distribution uses captured entry weights and balances rounding exactly',()=>{const s=setup(),sources=[{code:'A',gross:11,tare:1},{code:'B',gross:11,tare:1},{code:'C',gross:11,tare:1}];const rows=s.pwProportionalParentContributions(sources,10,{A:10,B:30,C:20});assert.deepEqual(Array.from(rows,row=>row.inputWeightKg),[1.667,5,3.333]);assert.equal(rows.reduce((sum,row)=>Number((sum+row.inputWeightKg).toFixed(3)),0),10);assert.deepEqual(Array.from(rows,row=>row.sharePercent),[16.667,50,33.333])});
test('consumed source cannot be sorted twice', () => { const s=setup(); s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],''); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT2')],'')); assert.equal(s.readProductionLedger().items.length,1); });
test('positive loss needs classified reason', () => { const s=setup(); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',9)],'')); s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',9)],'WASTE'); assert.equal(s.readProductionLedger().events.find(event=>event.action==='ثبت سورتینگ').details.lossKg,1); });
test('overweight and duplicate output reject without partial write', () => { const s=setup(); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',11)],'')); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('OUT1',5),s.output('OUT1',5)],'')); assert.equal(s.readProductionLedger().items.length,0); });
test('input cannot also be output', () => { const s=setup(); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output('IN1')],'')); });
test('receiving occupied basket cannot become production output', () => { const s=setup(); s.receipt.baskets.push({code:'OUT1',gross:3,tare:1,zone:'COLD_ROOM_CLEAN'}); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); });
test('production occupied basket cannot become output', () => { const s=setup(); const l=s.pwEmpty(); l.items.push({id:'X',containerCode:'OUT1',trays:[],consumed:false}); s.saveProductionLedger(l); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); });
test('damaged and single-use outputs rejected', () => { for (const change of [{status:'DAMAGED'},{type:'SINGLE_USE'}]) { const s=setup(); Object.assign(s.carriers[1],change); s.data.set('storemesh.prototype.containers',JSON.stringify(s.carriers)); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); } });
test('sorting completion requires every scanned input to be at the sorting station', () => { const s=setup(); s.receipt.baskets[0].zone='COLD_ROOM_CLEAN';s.receipt.baskets[0].currentLocation='COLD_ROOM_CLEAN'; assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],''),/ایستگاه سورتینگ/); });
test('timestamp ties reload in sequence order', () => { const s=setup(); const l=s.pwEmpty(); l.events=[{seq:2,at:'2026-09-10T00:00:00Z'},{seq:1,at:'2026-09-10T00:00:00Z'}]; s.saveProductionLedger(l); const reloaded=s.readProductionLedger(); assert.equal(reloaded.events[0].seq,1); s.pwEvent(reloaded,'NEXT','B'); assert.equal(reloaded.events[2].seq,3); });
test('corrupt storage fails closed and remains intact', () => { const s=setup(); s.data.set('storemesh.prototype.production.v1','broken'); assert.ok(s.readProductionLedger().storageError); assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],'')); assert.equal(s.data.get('storemesh.prototype.production.v1'),'broken'); });
test('storage write failure cannot report successful sorting', () => { const s=setup(); s.localStorage.setItem=()=>{throw Error('quota');}; assert.throws(()=>s.recordSortingOutputs(s.receipt,['IN1'],[s.output()],''),/quota/); assert.equal(s.readProductionLedger().items.length,0); });
test('zone designation mismatch persists warning, not false hard gate', () => { const s=setup(); s.recordSortingOutputs(s.receipt,['IN1'],[{...s.output(),designationWarning:true}],''); const l=s.readProductionLedger(); assert.equal(l.events[0].details.severity,'WARNING'); assert.equal(l.items.length,1); });
test('active cycle and blocked batch prevent further work', () => { const s=setup(); const l=s.pwEmpty(), item={id:'X',weightKg:10,zone:'SORTING'}; l.cycles=[{status:'READY',itemIds:['X']}]; assert.throws(()=>s.pwUsable(l,item)); l.cycles=[]; item.blocked=true; assert.throws(()=>s.pwUsable(l,item)); });
test('web shell keeps sub-navigation inside content and removes control tower', () => {
  assert.doesNotMatch(assembled, /control-tower|برج کنترل/);
  assert.match(assembled, /<div className="grid grid-cols-\[minmax\(0,1fr\)_220px\] flex-1 min-h-0 overflow-hidden" dir="ltr">/);
  assert.match(assembled, /w-\[220px\][^>]+dir="rtl"/);
  assert.match(assembled, /<main className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">/);
  assert.match(assembled, /<\/main>\s*<Sidebar screen=\{screen\} onNavigate=\{setScreen\} \/>/);
  assert.match(hub, /۲۰ صفحه Web/);
  assert.doesNotMatch(hub, /۲۱ صفحه Web|۳۷ صفحه/);
});
test('inventory detail opens upward and page owns no outer scrollbar', () => {
  assert.match(assembled, /aria-label="جزئیات ظروف بچ"/);
  assert.match(assembled, /z-\[80\] bottom-7 left-0/);
  assert.match(assembled, /function InventoryScreen\(\) \{ return <div className="flex flex-col flex-1 min-h-0 overflow-hidden">/);
});
test('production hides test controls and keeps same-session data flow', () => {
  for (const label of ['نقش شبیه‌سازی', 'نمایش داده آزمایشی', 'افزودن نمونه آزمایشی جداگانه', 'بازخوانی', 'فعال‌سازی تجهیز آزمایشی']) assert.doesNotMatch(assembled, new RegExp(label));
  assert.match(assembled, /با داده همین نشست/);
  assert.match(assembled, /PW_DEFAULT_MACHINES/);
});
test('master data has independent persisted collections and product-specific grades', () => {
  assert.match(assembled, /storemesh\.prototype\.master-data\.v1/);
  assert.match(assembled, /products:\s*MasterProduct\[\]/);
  assert.match(assembled, /suppliers:\s*MasterParty\[\]/);
  assert.match(assembled, /customers:\s*MasterParty\[\]/);
  assert.match(assembled, /warehouses:\s*MasterWarehouse\[\]/);
  assert.match(assembled, /\.filter\((?:\(item\)|item)\s*=>\s*item\.active\)/);
  assert.match(assembled, /row\.grades=String\(form\.grades/);
  assert.match(assembled, /row\.sizes=String\(form\.sizes/);
});
test('shipping contains no internal transfer and exceptional movement lives under inventory', () => {
  assert.doesNotMatch(assembled, /screens:\s*\[\s*"shipments",\s*"transfers"/);
  assert.match(assembled, /screens:\s*\[\s*"inventory",\s*"inventory-movement"/);
  assert.match(assembled, /جابجایی استثنایی/);
  assert.match(assembled, /فقط برای انتقال خارج از مسیر عادی/);
});
test('sorting input is scan-driven with optional weighing and product grades', () => {
  assert.match(assembled, /اسکن سبدهای ورودی/);
  assert.match(assembled, /ScanOptionalWeighTransition/);
  assert.match(assembled, /entryWeights/);
  assert.match(assembled, /readMasterData\(\)\.products/);
  assert.doesNotMatch(assembled, /افزودن سبد ورودی/);
  assert.doesNotMatch(assembled, /انتخاب از موجودی/);
});
test('optional transition weighing records previous, new and delta weights', () => {
  assert.match(source, /previousWeightKg/);
  assert.match(source, /newWeightKg/);
  assert.match(source, /deltaKg/);
  assert.match(source, /بدون توزین/);
});
test('washing session enforces compatibility, multiple outputs, complete genealogy and empty unit', () => {
  assert.match(assembled, /نشست شست‌وشوی چندسبدی/);
  assert.match(assembled, /نشست فعال شست‌وشو شامل گرید/);
  assert.match(assembled, /session\.outputs\.push/);
  assert.match(assembled, /parentIds: parents\.map/);
  assert.match(assembled, /parentContributions: contributions/);
  assert.match(assembled, /واحد شست‌وشو کاملاً خالی است/);
  assert.match(assembled, /if \(!empty\)/);
});
test('washing compatibility accepts five same-grade/size inputs and blocks a different group',()=>{const s=setup(),session={grade:'A',size:'L'};for(let i=0;i<5;i++)assert.equal(s.pwAssertWashCompatibility(session,{grade:'A',size:'L'}),true);assert.throws(()=>s.pwAssertWashCompatibility(session,{grade:'B',size:'L'}),/ابتدا تمام محصول/);assert.throws(()=>s.pwAssertWashCompatibility(session,{grade:'A',size:'S'}),/واحد را خالی/)});
test('receiving stores in cold room and sorting recognizes canonical or displayed cold-room names',()=>{const s=setupModels();const batch=s.normalizePrototypeBatch({id:'R',supplier:'S',reference:'X',createdAt:'now',status:'در انتظار',baskets:[{id:1,code:'B1',product:'Apple',grade:'A',size:'L',gross:11,tare:1,currentLocation:'RECEIVING',currentState:'AWAITING_GATE_SCAN',destination:'COLD_ROOM_DIRTY',nextAction:'scan'}],events:[]});const cold=s.applyReceiptWorkflowScan(batch,'B1','COLD_ROOM_DIRTY');assert.equal(cold.baskets[0].currentLocation,'COLD_ROOM_DIRTY');assert.equal(cold.baskets[0].currentState,'STORED');assert.equal(cold.baskets[0].destination,null);assert.ok(cold.baskets[0].nextAction);const sorting=s.applyReceiptWorkflowScan(cold,'B1','SORTING');assert.equal(sorting.baskets[0].currentLocation,'SORTING');assert.equal(sorting.baskets[0].currentState,'IN_PROCESS');assert.equal(sorting.baskets[0].destination,null);const displayed=s.normalizePrototypeBatch({...batch,baskets:[{...batch.baskets[0],currentLocation:'سردخانه کثیف',zone:'سردخانه کثیف',currentState:'STORED',destination:null}]});assert.equal(s.applyReceiptWorkflowScan(displayed,'B1','SORTING').baskets[0].currentLocation,'SORTING');assert.throws(()=>s.applyReceiptWorkflowScan(batch,'B1','SORTING'));assert.throws(()=>s.applyReceiptWorkflowScan(sorting,'B1','WASHING'))});
test('user create and edit model validates required and unique fields and persists',()=>{const s=setupModels(),users=[];assert.ok(s.validatePrototypeUser({},users));assert.equal(s.validatePrototypeUser({name:'Test',username:'operator.one',role:'اپراتور',phone:'09121234567'},users),'');const row={id:'U1',name:'Test',username:'operator.one',role:'اپراتور',phone:'09121234567',active:true,last:'never'};s.writePrototypeUsers([row]);assert.equal(s.readPrototypeUsers()[0].username,'operator.one');assert.ok(s.validatePrototypeUser({...row,id:'U2'},[row]));assert.equal(s.validatePrototypeUser({...row,name:'Edited'},[row],'U1'),'')});
test('shared scan simulator is reused by receiving production packaging and shipping handlers',()=>{assert.match(assembled,/function ScanSimulator/);assert.match(assembled,/اسکن سبد دریافت/);assert.match(assembled,/اسکن تأیید گذرگاه عملیاتی/);assert.match(assembled,/اسکن سبد خروجی شست‌وشو/);assert.match(assembled,/اسکن ورود بسته‌بندی/);assert.match(assembled,/اسکن بسته خروجی برای ارسال/);assert.match(assembled,/اسکنر سخت‌افزاری و شبیه‌ساز از یک اعتبارسنجی استفاده می‌کنند/)});
test('generic ready-for-transfer status is absent and movement records have explicit operator fields',()=>{assert.doesNotMatch(assembled,/Ready for Transfer|آماده انتقال/);assert.match(assembled,/currentLocation/);assert.match(assembled,/currentState/);assert.match(assembled,/nextAction/);assert.match(source,/pwNormalizeItem/)});
test('receiving selects and executes destination before completion without requiring inventory',()=>{assert.match(assembled,/تأیید دریافت و انتخاب مقصد/);assert.match(assembled,/مقصد مستقیم محموله/);assert.match(assembled,/انتقال کل بچ یکجا/);assert.match(assembled,/اسکن تک‌تک در همین صفحه/);assert.match(assembled,/برای ثبت آن لازم نیست به صفحه موجودی بروید/);assert.match(assembled,/مشاهده رهگیری \(اختیاری\)/)});
test('scan simulator refreshes and prefills the suggested basket code on every open',()=>{assert.match(assembled,/useEffect\(\(\)=>\{if\(open\)setCode\(suggestedCode\)\}/);assert.match(assembled,/کد پیشنهادی آماده است/);assert.match(assembled,/اسکن کد پیشنهادی/)});
test('washing scan simulator proposes the first compatible eligible basket',()=>{assert.match(assembled,/suggestedCode=\{eligible\[0\]\?\.containerCode \|\| ""\}/)});
test('sorting discovers baskets by physical cold-room location without a fake receiving destination',()=>{assert.match(assembled,/const eligibleSources = batch\.baskets\.filter/);assert.match(assembled,/pwColdStorageLocation\(b\.currentLocation \|\| b\.zone\)/);assert.doesNotMatch(assembled,/b\.destination === "SORTING"/);assert.match(assembled,/سبدهای شناسایی‌شده برای سورت/);assert.match(assembled,/suggestedCode=\{eligibleSources\[0\]\?\.code \|\| ""\}/);assert.match(assembled,/const destinationNames:Record<string,string>=\{COLD_ROOM_DIRTY:"سردخانه کثیف",QUARANTINE:"قرنطینه \/ QC"\}/)});
test('sorting entry and exit are separate persistent operator flows',()=>{assert.match(assembled,/ورود به سورتینگ/);assert.match(assembled,/خروج از سورتینگ/);assert.match(assembled,/sortingSessions: any\[\]/);assert.match(assembled,/status: "IN_PROGRESS"/);assert.match(assembled,/currentState: "IN_SORTING"/);assert.match(assembled,/nextAction: "ثبت خروجی سورتینگ"/);assert.match(assembled,/function openExit\(\)/);assert.match(assembled,/activeSortingSession\.inputCodes/);assert.match(assembled,/دریافت وزن از ترازو \(اختیاری\)/)});
test('inventory presents persisted sorting state in Persian',()=>{assert.match(assembled,/IN_SORTING:"در حال سورت"/);assert.match(assembled,/displayBatchStatus/);assert.match(assembled,/locationNames\[b\.currentLocation/)});
test('completed movement does not retain a stale batch destination',()=>{const s=setupModels();const normalized=s.normalizePrototypeBatch({id:'R',supplier:'S',reference:'X',createdAt:'now',status:'active',destination:'COLD_ROOM_DIRTY',baskets:[{id:1,code:'B1',product:'Apple',grade:'A',size:'L',gross:11,tare:1,currentLocation:'SORTING',currentState:'IN_SORTING',destination:null,nextAction:'ثبت خروجی سورتینگ'}],events:[]});assert.equal(normalized.destination,undefined);assert.match(assembled,/فعلاً حرکت لازم نیست/)});
test('sorting output uses the shared scanner with an automatic empty-basket suggestion',()=>{assert.match(assembled,/function scanOutput\(rawCode = outputCode\)/);assert.match(assembled,/aria-label="کد سبد خروجی سورت"/);assert.match(assembled,/title="اسکن سبد خالی خروجی سورتینگ"/);assert.match(assembled,/onScan=\{scanOutput\}/);assert.match(assembled,/setStaged\(\[\.\.\.new Set\(\[\.\.\.staged, selected\.qr \|\| selected\.code\]\)\]\)/);assert.match(assembled,/localStorage\.getItem\("storemesh\.prototype\.containers"\) \|\|\s+JSON\.stringify\(defaultFleet\)/);assert.match(assembled,/qr: "CTR-001"/)});
test('sorting output calculates parent genealogy automatically without manual contribution fields',()=>{assert.match(assembled,/pwProportionalParentContributions\(\s*sources,\s*net,\s*entryWeights/);assert.match(assembled,/شجره والد این خروجی خودکار و متناسب با وزن ثبت‌شده سبدهای ورودی نشست محاسبه می‌شود/);assert.doesNotMatch(assembled,/سهم واقعی والدها در این خروجی|setContributions|placeholder="۰ یعنی بدون سهم"/)});
