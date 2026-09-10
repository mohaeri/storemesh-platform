// UI-only Figma Make simulation. Paste into WebApp.tsx; useState and SortingScreen are supplied there.
type PWItem = { id: string; code: string; parentId: string; inputCodes: string[]; product: string; grade: string; size: string; weightKg: number; stage: string; zone: string; destination: string | null; containerCode: string; trays: any[]; allocated: boolean; consumed: boolean; blocked: boolean; [key: string]: any };
type PWLedger = { version: number; seq: number; idSeq: number; items: PWItem[]; cycles: any[]; events: any[]; consumedInputs: string[]; machines: Record<string, string[]>; storageError?: string };
const PW_STORAGE = "storemesh.prototype.production.v1";
const PW_ACTIVE = ["READY", "RUNNING", "IN_PROGRESS", "PAUSED", "COMPLETING"];
const PW_ZONES: Record<string, string> = { SORTING: "سورتینگ", WASHING: "شست‌وشو", SLICING: "اسلایس", FREEZING: "فریز", FREEZE_DRYING: "فریزدرای", DRYING: "خشک‌کن", FRESH_EXPORT: "ارسال تازه", COLD_ROOM_CLEAN: "سردخانه تمیز", COLD_ROOM_DIRTY: "سردخانه کثیف", PACKAGING: "بسته‌بندی", QC: "کیفیت", WASTE: "ضایعات" };
const PW_STAGES: Record<string, string> = { SORTED: "سورت‌شده", WASHED: "شسته‌شده", SLICED: "اسلایس‌شده", FROZEN: "منجمد", FREEZE_DRIED: "فریزدرای‌شده", DRIED: "خشک‌شده", CONSUMED: "مصرف‌شده", WASTED: "ضایعات", READY: "آماده", RUNNING: "در حال اجرا", IN_PROGRESS: "در حال اجرا", PAUSED: "مکث", COMPLETING: "آماده تخلیه", COMPLETED: "تکمیل", FAILED: "خرابی", CANCELLED: "لغوشده", SCRAPPED: "اسقاط" };
const pwNumber = (n: any) => Number(Number(n || 0).toFixed(3));
const pwCode = (value: any) => String(value ?? "").trim().toUpperCase();
const pwEmpty = (): PWLedger => ({ version: 1, seq: 0, idSeq: 0, items: [], cycles: [], events: [], consumedInputs: [], machines: {} });
function readProductionLedger(): PWLedger {
  try {
    const raw = localStorage.getItem(PW_STORAGE);
    if (!raw) return pwEmpty();
    const value = JSON.parse(raw);
    if (value.version !== 1 || !Array.isArray(value.items) || !Array.isArray(value.cycles) || !Array.isArray(value.events)) throw Error("ساختار دفتر تولید قابل خواندن نیست؛ داده را بازنویسی نکردیم.");
    return { ...pwEmpty(), ...value, events: [...value.events].sort((a, b) => a.seq - b.seq) };
  } catch (error: any) { return { ...pwEmpty(), storageError: error.message || "دسترسی به حافظه مرورگر ممکن نیست." }; }
}
function saveProductionLedger(ledger: PWLedger) {
  if (ledger.storageError) throw Error(ledger.storageError);
  localStorage.setItem(PW_STORAGE, JSON.stringify(ledger));
}
function pwEvent(ledger: PWLedger, action: string, entity: string, details: any = {}) {
  ledger.seq = Math.max(ledger.seq || 0, ...ledger.events.map(x => Number(x.seq) || 0)) + 1;
  ledger.events.push({ seq: ledger.seq, action, entity, details, at: new Date().toISOString() });
}
function pwId(ledger: PWLedger, prefix: string) { ledger.idSeq = (ledger.idSeq || 0) + 1; return `${prefix}-SIM-${String(ledger.idSeq).padStart(5, "0")}`; }
function pwCarriers() {
  let value: any;
  try { value = JSON.parse(localStorage.getItem("storemesh.prototype.containers") || "[]"); } catch { throw Error("فهرست کانتینرهای مرورگر قابل خواندن نیست."); }
  return (Array.isArray(value) ? value : value.items || value.rows || []).map((row: any) => ({ ...row, code: pwCode(row.qr || row.code || row.id), capacityKg: Number(row.capacityKg ?? row.capacity ?? 999999), zones: row.designatedZones || row.zones || [], type: String(row.type || "") }));
}
function pwHealthy(carrier: any) { return !carrier.locked && !carrier.singleUse && !/DAMAGED|BROKEN|RETIRED|INACTIVE|SINGLE_USE|خراب|شکسته|غیرفعال|یکبار|یک‌بار/i.test(`${carrier.status || ""} ${carrier.type || ""}`); }
function pwTray(carrier: any) { return /TRAY|سینی/i.test(carrier.type); }
function pwCarrier(code: string, type: "tray" | "basket") {
  const carrier = pwCarriers().find((x: any) => x.code === pwCode(code));
  if (!carrier || !pwHealthy(carrier) || (type === "tray" ? !pwTray(carrier) : pwTray(carrier))) throw Error(type === "tray" ? "یک سینی سالم موجود در بخش کانتینرها را اسکن کنید." : "یک سبد یا کریت سالم موجود در بخش کانتینرها را اسکن کنید.");
  return carrier;
}
function pwBusy(ledger: PWLedger, item: PWItem) { return !!ledger.cycles.find(c => PW_ACTIVE.includes(c.status) && c.itemIds.includes(item.id)); }
function pwUsable(ledger: PWLedger, item: PWItem | undefined): asserts item is PWItem {
  if (!item || item.consumed || !(item.weightKg > 0)) throw Error("بچ ورودی موجود نیست یا قبلاً مصرف شده است.");
  if (item.blocked || /QUARANTINE|QC|WASTE/.test(item.zone)) throw Error("بچ مسدود است؛ ابتدا وضعیت کیفیت یا مغایرت آن را تعیین تکلیف کنید.");
  if (pwBusy(ledger, item)) throw Error("این بچ در یک چرخه فعال قفل است.");
}
function pwFreeCarrier(ledger: PWLedger, code: string, exceptId = "") {
  if (ledger.items.some(item => item.id !== exceptId && !item.consumed && (item.containerCode === code || item.trays.some(t => t.code === code)))) throw Error("این ظرف هنوز به موجودی یا سینی‌های بچ دیگری اختصاص دارد.");
  const receipt = readPrototypeBatch();
  if (receipt.baskets.some(b => pwCode(b.code) === code && !ledger.consumedInputs.includes(`${receipt.id}:${b.code}`))) throw Error("این ظرف هنوز حاوی موجودی دریافت است.");
}
function recordSortingOutputs(batch: any, selected: string[], outputs: any[], lossReason: string) {
  const ledger = readProductionLedger();
  if (ledger.storageError) throw Error(ledger.storageError);
  if (selected.length !== 1) throw Error("هر ثبت سورتینگ یک سبد ورودی دارد؛ سبد بعدی را جداگانه ثبت کنید.");
  const signature = `${batch.id}:${selected[0]}`;
  if (ledger.consumedInputs.some(key => pwCode(key) === pwCode(signature))) throw Error("این سبد ورودی قبلاً سورت شده است.");
  const sources = (batch.baskets || []).filter((x: any) => selected.some(code => pwCode(code) === pwCode(x.code)));
  if (sources.length !== 1) throw Error("سبد انتخابی در محموله پیدا نشد.");
  const physical = pwCarriers().find((c: any) => c.code === pwCode(sources[0].code));
  if (physical && !pwHealthy(physical) || /قرنطینه|در راه|خراب|QUARANTINE|BLOCKED|DAMAGED/.test(sources[0].status || "") || /قرنطینه/.test(sources[0].zone || "")) throw Error("ورودی مسدود یا ظرف آسیب‌دیده است.");
  if (!/سردخانه|COLD_ROOM|COLD_STORAGE/.test(sources[0].zone || "")) throw Error("ورودی باید در سردخانه باشد.");
  const available = pwNumber(sources.reduce((sum: number, x: any) => sum + Number(x.gross) - Number(x.tare || 0), 0));
  const total = pwNumber(outputs.reduce((sum, x) => sum + Number(x.weight), 0)), loss = pwNumber(available - total);
  if (!(available > 0) || !outputs.length || !Number.isFinite(total) || loss < 0 || outputs.some(x => !(Number(x.weight) > 0) || !x.grade || !x.size)) throw Error("گرید، اندازه و وزن معتبر همه خروجی‌ها و توازن وزن الزامی است.");
  if (new Set(outputs.map(x => pwCode(x.code))).size !== outputs.length) throw Error("سبد خروجی تکراری است.");
  if (loss > 0 && !["WASTE", "DAMAGE", "MOISTURE_LOSS", "RESIDUAL_MATERIAL", "MEASUREMENT_VARIANCE"].includes(lossReason)) throw Error("برای هر مقدار افت، یک علت طبقه‌بندی‌شده انتخاب کنید.");
  outputs.forEach(output => {
    const carrier = pwCarrier(output.code, "basket");
    if (selected.some(code => pwCode(code) === carrier.code)) throw Error("سبد ورودی نمی‌تواند خروجی همان عملیات باشد.");
    pwFreeCarrier(ledger, carrier.code);
    if (Number(output.weight) > carrier.capacityKg) throw Error("وزن خروجی از ظرفیت سبد بیشتر است.");
  });
  const children = outputs.map(output => {
    const code = pwId(ledger, "B"), item: PWItem = { id: code, code, parentId: String(batch.id), inputCodes: sources.map((x: any) => x.code), supplier: batch.supplier, product: sources[0].product, grade: output.grade, size: output.size, weightKg: pwNumber(output.weight), stage: "SORTED", zone: "SORTING", destination: null, plannedRoute: output.route || output.label || "", containerCode: pwCode(output.code), trays: [], allocated: false, consumed: false, blocked: false };
    ledger.items.push(item); return item;
  });
  ledger.consumedInputs.push(signature);
  outputs.filter(output => output.designationWarning).forEach(output => pwEvent(ledger, "هشدار زون تعیین‌شده", pwCode(output.code), { zone: "SORTING", severity: "WARNING" }));
  pwEvent(ledger, "ثبت سورتینگ", String(batch.id), { inputCodes: selected, children: children.map(x => x.code), inputWeightKg: available, outputWeightKg: total, lossKg: loss, lossReason: loss > 0 ? lossReason : null });
  saveProductionLedger(ledger); return children;
}
const pwBox = { background: "white", border: "1px solid #dce9e7", borderRadius: 16, padding: 20 };
const pwInput = { width: "100%", border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", color: "#163f3b", background: "white" };
function PWButton({ children, secondary, ...props }: any) { return <button {...props} style={{ padding: "10px 15px", borderRadius: 9, border: secondary ? "1px solid #bdd5d1" : "none", color: secondary ? "#15685e" : "white", background: props.disabled ? "#b5c4c1" : secondary ? "white" : "#0d8071", cursor: props.disabled ? "not-allowed" : "pointer", fontWeight: 600 }}>{children}</button>; }
function PWField({ label, children }: any) { return <label style={{ display: "grid", gap: 6, marginBottom: 14 }}><span style={{ fontSize: 13, color: "#42645f" }}>{label}</span>{children}</label>; }
function PWNotice({ children }: any) { return <div style={{ background: "#eff8f5", color: "#315f54", border: "1px solid #c8e1d7", padding: 12, borderRadius: 10, fontSize: 13, lineHeight: 1.9, marginBottom: 16 }}>{children}</div>; }
function PWEmpty({ children }: any) { return <div style={{ padding: 28, background: "#f8faf9", border: "1px dashed #cbd9d6", borderRadius: 12, color: "#60746f", textAlign: "center" }}>{children || "هنوز موردی ثبت نشده است."}</div>; }
function ProductionScreen(props: any) {
  const [tab, setTab] = useState("overview"), [ledger, setLedger] = useState<PWLedger>(() => readProductionLedger()), [role, setRole] = useState("operator"), [notice, setNotice] = useState(""), [error, setError] = useState(""), [chosen, setChosen] = useState(""), [includeDemo, setIncludeDemo] = useState(false);
  const tabs = [["overview", "صف کار و مسیر"], ["sorting", "سورتینگ"], ["wash", "شست‌وشو"], ["slice", "اسلایس و سینی"], ["FREEZE", "فریز"], ["FREEZE_DRY", "فریزدرای"], ["DRY", "خشک‌کن"], ["merge", "ادغام فیزیکی"], ["results", "نتایج و رویدادها"]];
  const allItems = ledger.items.filter(x => includeDemo || !x.demo), live = allItems.filter(x => !x.consumed), current = live.find(x => x.id === chosen);
  const execute = (message: string, work: (next: PWLedger) => void) => {
    setError(""); setNotice("");
    try { const next = readProductionLedger(); if (next.storageError) throw Error(next.storageError); work(next); saveProductionLedger(next); setLedger(next); setNotice(message); }
    catch (failure: any) { setError(failure.message || "ثبت عملیات انجام نشد."); }
  };
  const form = (event: any) => { event.preventDefault(); return new FormData(event.currentTarget); };
  const switchTab = (value: string) => { setTab(value); setChosen(""); setError(""); setNotice(""); setLedger(readProductionLedger()); };
  const batchPicker = (items: PWItem[]) => <PWField label="بچ ورودی"><select required value={chosen} onChange={e => setChosen(e.target.value)} style={pwInput}><option value="">انتخاب بچ…</option>{items.map(x => <option key={x.id} value={x.id}>{x.code} · {x.product} · {x.grade}/{x.size} · {x.weightKg} kg {x.demo ? "· آزمایشی" : ""}</option>)}</select></PWField>;
  const summary = (item: PWItem) => <PWNotice>{item.code} · {PW_STAGES[item.stage] || item.stage} · وزن رسمی {item.weightKg} kg · ظرف {item.containerCode || "تخصیص به سینی"} · محل فعلی {PW_ZONES[item.zone] || item.zone}{pwBusy(ledger, item) ? " · قفل چرخه" : ""}</PWNotice>;
  const move = (id: string) => execute("انتقال فیزیکی در شبیه‌ساز ثبت شد.", next => {
    const item = next.items.find(x => x.id === id); pwUsable(next, item);
    const destination = item.nextZone || item.destination;
    if (!destination) throw Error("ابتدا مدیر باید مقصد را مشخص کند.");
    if (destination === item.zone) throw Error("بچ از قبل در محل مقصد است.");
    const before = item.zone; item.zone = destination; pwEvent(next, "انتقال فیزیکی", item.code, { from: before, to: destination, containerCode: item.containerCode });
  });
  const processBatch = (event: any, process: "WASH" | "SLICE") => {
    const data = form(event);
    execute(process === "WASH" ? "شست‌وشو ثبت شد؛ اکنون انتقال به اسلایس را ثبت کنید." : "اسلایس ثبت شد؛ سینی‌های خروجی را اسکن و تخصیص دهید.", next => {
      const item = next.items.find(x => x.id === chosen); pwUsable(next, item);
      const required = process === "WASH" ? "SORTED" : "WASHED", zone = process === "WASH" ? "WASHING" : "SLICING";
      if (item.stage !== required || item.zone !== zone) throw Error(`بچ باید ${PW_STAGES[required]} و در ${PW_ZONES[zone]} باشد؛ انتقال فیزیکی را در صف کار ثبت کنید.`);
      if (pwCode(data.get("scan")) !== item.containerCode || !item.containerCode) throw Error("QR اسکن‌شده با سبد همین بچ تطبیق ندارد.");
      pwCarrier(item.containerCode, "basket");
      const observed = String(data.get("observed") || "").trim();
      if (observed && (!Number.isFinite(Number(observed)) || !(Number(observed) > 0))) throw Error("خوانش اطلاعاتی وزن باید مثبت باشد.");
      item.stage = process === "WASH" ? "WASHED" : "SLICED"; item.nextZone = process === "WASH" ? "SLICING" : "FREEZING";
      pwEvent(next, process === "WASH" ? "ثبت شست‌وشو" : "ثبت اسلایس", item.code, { observedWeightKg: observed ? Number(observed) : null, officialWeightKg: item.weightKg, nextZone: item.nextZone });
    });
  };
  const allocate = (event: any) => {
    const data = form(event);
    execute("تخصیص سینی ثبت شد.", next => {
      const item = next.items.find(x => x.id === chosen); pwUsable(next, item);
      if (item.stage !== "SLICED" || item.allocated) throw Error("یک بچ اسلایس‌شده با تخصیص باز انتخاب کنید.");
      const tray = pwCarrier(String(data.get("scan")), "tray"), sequence = Number(data.get("sequence")), raw = String(data.get("quantity") || ""), quantityKg = raw === "" ? null : Number(raw);
      pwFreeCarrier(next, tray.code, item.id);
      if (!Number.isInteger(sequence) || sequence < 1 || (quantityKg !== null && (!Number.isFinite(quantityKg) || quantityKg <= 0))) throw Error("ترتیب مثبت و مقدار معتبر وارد کنید.");
      if (item.trays.some(t => t.code === tray.code || t.sequence === sequence)) throw Error("کد یا ترتیب سینی تکراری است.");
      if (quantityKg !== null && quantityKg > tray.capacityKg) throw Error("مقدار از ظرفیت سینی بیشتر است.");
      const allocated = pwNumber(item.trays.reduce((sum, t) => sum + Number(t.quantityKg || 0), 0) + Number(quantityKg || 0));
      if (allocated > item.weightKg) throw Error("مجموع مقدار تخصیص‌یافته از وزن بچ بیشتر است.");
      item.trays.push({ code: tray.code, quantityKg, sequence }); pwEvent(next, "تخصیص سینی", item.code, { tray: tray.code, quantityKg, sequence });
    });
  };
  const finishAllocation = () => execute("تخصیص نهایی شد و سبد مبدا آزاد شد؛ بچ برای ساخت چرخه فریز آماده است.", next => {
    const item = next.items.find(x => x.id === chosen); pwUsable(next, item);
    if (item.stage !== "SLICED" || !item.trays.length || item.allocated) throw Error("تخصیص سینی باز و معتبر لازم است.");
    if (item.trays.every(t => t.quantityKg !== null) && pwNumber(item.trays.reduce((sum, t) => sum + t.quantityKg, 0)) !== item.weightKg) throw Error("مجموع وزن سینی‌ها باید با کل وزن بچ برابر باشد.");
    const released = item.containerCode; item.containerCode = ""; item.allocated = true; pwEvent(next, "تأیید پایان تخصیص", item.code, { releasedContainer: released, trays: item.trays.map(t => t.code) });
  });
  const createCycle = (event: any, type: string) => {
    const data = form(event);
    execute("چرخه آماده ایجاد شد؛ بچ‌ها تا پایان یا لغو چرخه قفل هستند.", next => {
      const machineId = String(data.get("machine"));
      if (!(next.machines[type] || []).includes(machineId)) throw Error("تجهیزات آزمایشی این فرآیند هنوز فعال نشده‌اند.");
      if (next.cycles.some(c => c.machineId === machineId && PW_ACTIVE.includes(c.status))) throw Error("این ماشین در یک چرخه فعال مشغول است.");
      const ids = data.getAll("items").map(String), items = ids.map(id => next.items.find(x => x.id === id));
      if (!items.length) throw Error("حداقل یک بچ انتخاب کنید.");
      const scans = String(data.get("trays") || "").split(/[\s,،]+/).filter(Boolean).map(pwCode);
      const expectedStage = type === "FREEZE" ? "SLICED" : type === "FREEZE_DRY" ? "FROZEN" : "SORTED", expectedZone = type === "FREEZE" ? "FREEZING" : type === "FREEZE_DRY" ? "FREEZE_DRYING" : "DRYING";
      items.forEach(item => { pwUsable(next, item); if (item.stage !== expectedStage || item.zone !== expectedZone) throw Error("مرحله یا محل فعلی یکی از بچ‌ها برای این چرخه مناسب نیست."); });
      if (items.some(item => !!item!.demo !== !!items[0]!.demo)) throw Error("بچ آزمایشی و داده شما نباید در یک چرخه ترکیب شوند.");
      const available = pwNumber(items.reduce((sum, item) => sum + item!.weightKg, 0));
      const inputWeightKg = type === "FREEZE" ? available : Number(data.get("inputWeight"));
      if (!(inputWeightKg > 0) || inputWeightKg > available) throw Error("وزن کل ورودی باید مثبت و حداکثر برابر موجودی انتخابی باشد.");
      if (type === "FREEZE") {
        const expected = items.flatMap(item => item!.trays.map(t => t.code));
        if (items.some(item => !item!.allocated) || !expected.length || new Set(scans).size !== scans.length || expected.length !== scans.length || expected.some(code => !scans.includes(code))) throw Error("همه سینی‌های تخصیص‌یافته بچ‌های انتخابی را دقیقاً یک‌بار اسکن کنید.");
        scans.forEach(code => pwCarrier(code, "tray"));
      }
      const code = pwId(next, "CY"), cycle = { id: code, code, type, machineId, itemIds: ids, trayCodes: scans, inputWeightKg, status: "READY", createdAt: new Date().toISOString(), demo: !!items[0]!.demo };
      next.cycles.push(cycle); pwEvent(next, "ساخت چرخه", code, { type, machineId, batches: ids, inputWeightKg });
    });
  };
  const cycleAction = (event: any, id: string, action: string) => {
    const data = form(event);
    execute("وضعیت چرخه و موجودی شبیه‌ساز به‌روزرسانی شد.", next => {
      const cycle = next.cycles.find(c => c.id === id); if (!cycle) throw Error("چرخه پیدا نشد.");
      const running = cycle.type === "DRY" ? "IN_PROGRESS" : "RUNNING", transitions: any = { READY: { START: running, CANCEL: "CANCELLED" }, RUNNING: { PAUSE: "PAUSED", COMPLETE: "COMPLETING", FAIL: "FAILED" }, IN_PROGRESS: { PAUSE: "PAUSED", COMPLETE: "COMPLETING", FAIL: "FAILED" }, PAUSED: { RESUME: running, CANCEL: "CANCELLED", FAIL: "FAILED" }, COMPLETING: { FINISH: "COMPLETED", FAIL: "FAILED" }, FAILED: { RESUME: running, RESTART: "READY", SCRAP: "SCRAPPED" } };
      const target = transitions[cycle.status]?.[action], reason = String(data.get("reason") || "").trim(), items: PWItem[] = cycle.itemIds.map((itemId: string) => next.items.find(x => x.id === itemId)!);
      if (!target) throw Error("این تغییر وضعیت مجاز نیست.");
      if (cycle.status === "FAILED" && role !== "manager") throw Error("تصمیم چرخه خراب نیازمند نقش مدیر در شبیه‌ساز است.");
      if ((action === "FAIL" || cycle.status === "FAILED") && !reason) throw Error("علت خرابی یا تصمیم مدیر را وارد کنید.");
      if (cycle.status === "FAILED" && items.some(item => item.consumed || item.weightKg <= 0 || pwBusy(next, item))) throw Error("بچ پس از خرابی مصرف شده یا در چرخه دیگری استفاده شده است.");
      if (cycle.status === "FAILED") items.forEach(item => { if (item.cycleFailureId === cycle.id) { item.blocked = false; delete item.cycleFailureId; } });
      if (action === "FAIL") items.forEach(item => { item.blocked = true; item.cycleFailureId = cycle.id; });
      if (action === "FINISH") {
        items.forEach(item => {
          if (cycle.type === "FREEZE") { item.stage = "FROZEN"; item.zone = "FREEZE_DRYING"; item.nextZone = "FREEZE_DRYING"; }
          else {
            const measured = Number(data.get(`weight-${item.id}`));
            if (!Number.isFinite(measured) || !(measured > 0) || measured > item.weightKg) throw Error(`وزن نهایی معتبر برای ${item.code} لازم است؛ حداکثر ${item.weightKg} kg.`);
            item.beforeDryWeightKg = item.weightKg; item.weightKg = pwNumber(measured); item.yieldPercent = pwNumber(measured / item.beforeDryWeightKg * 100); item.stage = cycle.type === "DRY" ? "DRIED" : "FREEZE_DRIED"; item.zone = "PACKAGING"; item.nextZone = "PACKAGING"; item.containerCode = ""; item.trays = []; item.allocated = false;
          }
        });
      }
      if (action === "SCRAP") items.forEach(item => { item.weightKg = 0; item.stage = "WASTED"; item.zone = "WASTE"; item.consumed = true; item.containerCode = ""; item.trays = []; });
      const from = cycle.status; cycle.status = target; if (action === "START") cycle.startedAt = new Date().toISOString(); if (["COMPLETED", "FAILED", "CANCELLED", "SCRAPPED"].includes(target)) cycle.endedAt = new Date().toISOString();
      pwEvent(next, `چرخه: ${action}`, cycle.code, { from, to: target, reason: reason || null, weights: items.map(item => ({ code: item.code, weightKg: item.weightKg, stage: item.stage })) });
    });
  };
  const merge = (event: any) => {
    const data = form(event);
    execute("ادغام فیزیکی ثبت شد؛ بچ جدید و شجره ورودی‌ها در نتایج قابل مشاهده است.", next => {
      const ids = data.getAll("items").map(String), items = ids.map(id => next.items.find(x => x.id === id));
      if (items.length < 2) throw Error("حداقل دو بچ انتخاب کنید.");
      items.forEach(item => { pwUsable(next, item); if (item!.trays.length) throw Error("بچ تخصیص‌یافته به سینی ابتدا باید عملیات جاری خود را تکمیل کند."); });
      if (items.some(item => !!item!.demo !== !!items[0]!.demo)) throw Error("بچ‌های آزمایشی را با داده خودتان ادغام نکنید.");
      if (items.some(item => item!.product !== items[0]!.product)) throw Error("در این نمونه رابط، ادغام فقط برای یک محصول مشترک انجام می‌شود.");
      const carrier = pwCarrier(String(data.get("scan")), "basket"); pwFreeCarrier(next, carrier.code);
      if (data.get("staged") !== "on") throw Error("قرارگیری فیزیکی سبد خالی در سورتینگ را تأیید کنید.");
      const weightKg = Number(data.get("weight")), sum = pwNumber(items.reduce((n, item) => n + item!.weightKg, 0));
      if (!(weightKg > 0) || weightKg > sum || weightKg > carrier.capacityKg) throw Error("وزن خروجی باید مثبت و در محدوده وزن ورودی و ظرفیت سبد باشد.");
      const grade = String(data.get("grade") || ""), size = String(data.get("size") || ""); if (!grade || !size) throw Error("گرید و اندازه خروجی لازم است.");
      const code = pwId(next, "B"), child: PWItem = { id: code, code, parentId: ids.join(","), parentIds: ids, inputCodes: items.map(item => item!.containerCode), parentContributions: items.map(item => ({ id: item!.id, weightKg: item!.weightKg })), product: items[0]!.product, grade, size, weightKg: pwNumber(weightKg), stage: "SORTED", zone: "SORTING", destination: null, containerCode: carrier.code, trays: [], allocated: false, consumed: false, blocked: false, demo: !!items[0]!.demo };
      items.forEach(item => { item!.consumed = true; item!.stage = "CONSUMED"; item!.weightKg = 0; item!.containerCode = ""; }); next.items.push(child);
      pwEvent(next, "ادغام فیزیکی", code, { parents: ids, inputWeightKg: sum, outputWeightKg: weightKg, lossKg: pwNumber(sum - weightKg), container: carrier.code });
    });
  };
  const demo = () => execute("نمونه آزمایشی جداگانه اضافه شد؛ هیچ ورودی دریافت جایگزین نشد.", next => {
    const carriers = pwCarriers().filter((c: any) => { if (!pwHealthy(c) || pwTray(c)) return false; try { pwFreeCarrier(next, c.code); return true; } catch { return false; } });
    if (!carriers.length) throw Error("ابتدا یک سبد سالم در بخش کانتینرها ایجاد کنید؛ نمونه آزمایشی هم از کد موجود استفاده می‌کند.");
    const carrier = carriers[0], code = pwId(next, "DEMO"); next.items.push({ id: code, code, parentId: "DEMO-RECEIPT", inputCodes: [], product: "محصول آزمایشی", grade: "A", size: "L", weightKg: Math.min(10, carrier.capacityKg), stage: "SORTED", zone: "SORTING", destination: null, containerCode: carrier.code, trays: [], allocated: false, consumed: false, blocked: false, demo: true });
    pwEvent(next, "افزودن نمونه آزمایشی", code); setIncludeDemo(true);
  });
  const cycleType = ["FREEZE", "FREEZE_DRY", "DRY"].includes(tab) ? tab : "";
  const cycleEligible = live.filter(item => !pwBusy(ledger, item) && !item.blocked && (cycleType === "FREEZE" ? item.stage === "SLICED" && item.allocated && item.zone === "FREEZING" : cycleType === "FREEZE_DRY" ? item.stage === "FROZEN" && item.zone === "FREEZE_DRYING" : item.stage === "SORTED" && item.zone === "DRYING"));
  return <div dir="rtl" style={{ padding: 24, color: "#183e38", background: "#f3f7f6", flex: 1, minHeight: 0, overflow: "auto", fontFamily: "inherit" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 16 }}><div><h1 style={{ fontSize: 25, margin: 0 }}>میز کار تولید</h1><p style={{ color: "#6a817b", margin: "6px 0" }}>از سبد ورودی تا عملیات ماشین، خروجی و رهگیری</p></div><span style={{ padding: "8px 12px", borderRadius: 20, background: "#fff2ce", color: "#805900" }}>شبیه‌سازی مرورگر · بدون اتصال به API و تجهیزات</span></div>
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>{tabs.map(([id, name]) => <PWButton key={id} secondary={tab !== id} onClick={() => switchTab(id)}>{name}</PWButton>)}</div>
    <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 16 }}><label>نقش شبیه‌سازی: <select value={role} onChange={e => setRole(e.target.value)} style={{ ...pwInput, width: 145 }}><option value="operator">اپراتور</option><option value="manager">مدیر</option></select></label><label><input type="checkbox" checked={includeDemo} onChange={e => setIncludeDemo(e.target.checked)} /> نمایش داده آزمایشی</label><PWButton secondary onClick={() => { setLedger(readProductionLedger()); setNotice("اطلاعات ذخیره‌شده مرورگر خوانده شد."); }}>بازخوانی</PWButton></div>
    {(error || ledger.storageError) && <div role="alert" style={{ padding: 14, marginBottom: 16, color: "#9f2323", background: "#fff0f0", borderRadius: 10 }}>{error || ledger.storageError}</div>}
    {notice && <div role="status"><PWNotice>{notice}</PWNotice></div>}
    {tab === "sorting" && <SortingScreen {...props} />}
    {tab === "overview" && <>
      <PWNotice>مسیر فعلی بک‌اند: پس از سورت، مدیر مقصد را انتخاب می‌کند. خشک‌کردن معمولی مستقیماً از بچ سورت‌شده انجام می‌شود. مسیر دیگر: شست‌وشو، اسلایس، تخصیص سینی، فریز، فریزدرای و بسته‌بندی. فریز در این نسخه خروجی مستقل نهایی ندارد. مقصد کاری و محل فیزیکی دو مرحله جدا هستند.</PWNotice>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>{[["بچ جاری", live.length], ["چرخه فعال", ledger.cycles.filter(c => PW_ACTIVE.includes(c.status)).length], ["منتظر تصمیم مقصد", live.filter(x => !x.destination && x.stage === "SORTED").length]].map(([title, count]) => <div key={String(title)} style={{ ...pwBox, flex: 1 }}><small>{title}</small><div style={{ fontSize: 28, marginTop: 8 }}>{count}</div></div>)}</div>
      {!live.length ? <PWEmpty>ابتدا یک سبد را در سورتینگ ثبت کنید؛ خروجی‌های آن در همین صف نمایش داده می‌شوند. <PWButton secondary onClick={demo}>افزودن نمونه آزمایشی جداگانه</PWButton></PWEmpty> : <div style={{ display: "grid", gap: 12 }}>{live.map(item => <div key={item.id} style={pwBox}>
        {summary(item)}<div style={{ fontSize: 13, marginBottom: 12 }}>محصول: {item.product} · گرید {item.grade} · اندازه {item.size} · مبدا {item.parentId} · سبد ورودی {item.inputCodes.join("، ") || "آزمایشی"}{item.plannedRoute ? ` · مسیر پیشنهادی سورت: ${item.plannedRoute}` : ""}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
          {["SORTED", "WASHED"].includes(item.stage) && <form onSubmit={event => { const data = form(event); execute("تصمیم مقصد ثبت شد؛ انتقال فیزیکی هنوز انجام نشده است.", next => { if (role !== "manager") throw Error("برای تصمیم مقصد، نقش مدیر را انتخاب کنید."); const row = next.items.find(x => x.id === item.id); pwUsable(next, row); const destination = String(data.get("destination")), reason = String(data.get("reason") || "").trim(); if (row.destination && row.destination !== destination && !reason) throw Error("علت تغییر مقصد قبلی الزامی است."); if (row.destination === destination) throw Error("مقصد تغییری نکرده است."); const previous = row.destination; row.destination = destination; row.nextZone = destination; pwEvent(next, "تصمیم مدیر: مقصد", row.code, { previous, destination, reason: reason || null }); }); }} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select name="destination" defaultValue={item.destination || "WASHING"} style={{ ...pwInput, width: 165 }} required>{["WASHING", "DRYING", "FRESH_EXPORT", "COLD_ROOM_CLEAN", "COLD_ROOM_DIRTY", "PACKAGING"].map(zone => <option key={zone} value={zone}>{PW_ZONES[zone]}</option>)}</select>{item.destination && <input name="reason" placeholder="علت تغییر مقصد" style={{ ...pwInput, width: 190 }} />}<PWButton disabled={role !== "manager" || pwBusy(ledger, item)}>ثبت مقصد مدیر</PWButton>
          </form>}
          <span>مرحله بعد: {PW_ZONES[item.nextZone || item.destination || ""] || "منتظر تصمیم مدیر"}</span><PWButton secondary disabled={pwBusy(ledger, item) || !(item.nextZone || item.destination) || item.zone === (item.nextZone || item.destination) || (item.stage === "SLICED" && !item.allocated)} onClick={() => move(item.id)}>تأیید انتقال فیزیکی</PWButton>
        </div>
      </div>)}</div>}
    </>}
    {(tab === "wash" || tab === "slice") && <div style={{ display: "grid", gridTemplateColumns: tab === "slice" ? "1fr 1fr" : "minmax(360px, 700px)", gap: 20 }}>
      <div style={pwBox}><h2>{tab === "wash" ? "ثبت شست‌وشوی یک بچ کامل" : "ثبت اسلایس یک بچ کامل"}</h2><PWNotice>هویت، گرید، اندازه و وزن رسمی بچ ثابت می‌ماند. خوانش ترازو فقط اطلاعاتی است. برای شروع، انتقال فیزیکی از صف کار را ثبت کنید.</PWNotice>
        <form onSubmit={event => processBatch(event, tab === "wash" ? "WASH" : "SLICE")}>{batchPicker(live.filter(x => x.stage === (tab === "wash" ? "SORTED" : "WASHED") && !pwBusy(ledger, x)))}{current && summary(current)}<PWField label="اسکن QR سبد همین بچ"><input name="scan" placeholder="اسکن یا ورود کد خوانده‌شده" required style={pwInput} /></PWField><PWField label="خوانش اطلاعاتی ترازو (kg، اختیاری)"><input name="observed" type="number" min="0.001" step="0.001" style={pwInput} /></PWField><PWButton disabled={!current || current.stage !== (tab === "wash" ? "SORTED" : "WASHED")}>تأیید پایان {tab === "wash" ? "شست‌وشو" : "اسلایس"}</PWButton></form>
      </div>
      {tab === "slice" && <div style={pwBox}><h2>تخصیص سینی‌های خروجی اسلایس</h2>{batchPicker(live.filter(x => x.stage === "SLICED" && !pwBusy(ledger, x)))}{current?.stage === "SLICED" ? <>{summary(current)}<PWNotice>فقط سینی سالم از فهرست کانتینرها پذیرفته می‌شود. مقدار هر سینی اختیاری است؛ در صورت وزن‌کردن همه سینی‌ها، جمع باید برابر وزن بچ باشد.</PWNotice><form onSubmit={allocate}><PWField label="اسکن QR سینی موجود"><input name="scan" required style={pwInput} /></PWField><PWField label="ترتیب سینی"><input name="sequence" type="number" min="1" step="1" defaultValue="1" required style={pwInput} /></PWField><PWField label="مقدار محصول در سینی (kg، اختیاری)"><input name="quantity" type="number" min="0.001" step="0.001" style={pwInput} /></PWField><PWButton disabled={current.allocated}>ثبت این سینی</PWButton></form><div style={{ margin: "16px 0" }}>{current.trays.map(tray => <p key={tray.code}>{tray.sequence}. {tray.code} · {tray.quantityKg === null ? "بدون وزن مجزا" : `${tray.quantityKg} kg`}</p>)}</div><PWButton disabled={current.allocated || !current.trays.length} onClick={finishAllocation}>{current.allocated ? "تخصیص نهایی شده" : "تأیید پایان تخصیص و آزادسازی سبد"}</PWButton></> : <PWEmpty>بچ اسلایس‌شده را برای تخصیص سینی انتخاب کنید.</PWEmpty>}</div>}
    </div>}
    {cycleType && <>
      <div style={pwBox}><h2>{cycleType === "FREEZE" ? "ساخت چرخه فریز از سینی‌های تخصیص‌یافته" : cycleType === "FREEZE_DRY" ? "ساخت چرخه فریزدرای" : "ساخت چرخه خشک‌کن"}</h2><PWNotice>{cycleType === "DRY" ? "مطابق بک‌اند فعلی: بچ سورت‌شده که به محل خشک‌کن منتقل شده وارد چرخه می‌شود؛ شست‌وشو پیش‌نیاز این مسیر نیست." : cycleType === "FREEZE" ? "تمام سینی‌های بچ‌های انتخابی اسکن می‌شوند. پایان فریز، همان بچ را با وزن ثابت به مرحله فریزدرای می‌برد." : "بچ‌های منجمد در محل فریزدرای و وزن کل ورودی ثبت می‌شوند؛ اسکن تک‌تک سینی‌ها الزامی نیست."}</PWNotice>
        {!(ledger.machines[cycleType] || []).length ? <PWEmpty>هیچ تنظیم تجهیزی در این شبیه‌ساز فعال نیست. <PWButton onClick={() => execute("ماشین آزمایشی فعال شد؛ این تنظیم به کارخانه ارسال نشده است.", next => { next.machines[cycleType] = [`SIM-${cycleType}-01`]; pwEvent(next, "فعال‌سازی تجهیز آزمایشی", cycleType); })}>فعال‌سازی تجهیز آزمایشی {cycleType}</PWButton></PWEmpty> : !cycleEligible.length ? <PWEmpty>بچ آماده با مرحله و محل صحیح وجود ندارد. صف کار و انتقال فیزیکی را بررسی کنید.</PWEmpty> : <form onSubmit={event => createCycle(event, cycleType)}>
          <PWField label="ماشین آزمایشی"><select name="machine" style={pwInput}>{ledger.machines[cycleType].map(code => <option key={code}>{code}</option>)}</select></PWField><PWField label="بچ‌های ورودی (انتخاب یک یا چند مورد)"><div>{cycleEligible.map(item => <label key={item.id} style={{ display: "block", padding: 10, borderBottom: "1px solid #e2eae7" }}><input type="checkbox" name="items" value={item.id} /> {item.code} · {item.weightKg} kg · {item.containerCode || item.trays.map(t => t.code).join("، ")} {item.demo ? "(آزمایشی)" : ""}</label>)}</div></PWField>
          {cycleType === "FREEZE" ? <PWField label="کد سینی‌های اسکن‌شده؛ هر کد در یک خط"><textarea name="trays" rows={3} required style={pwInput} /></PWField> : <PWField label="وزن کل ورودی چرخه (kg)"><input name="inputWeight" type="number" min="0.001" step="0.001" required style={pwInput} /></PWField>}<PWButton>ایجاد چرخه آماده</PWButton>
        </form>}
      </div>
      <div style={{ display: "grid", gap: 14, marginTop: 20 }}>{ledger.cycles.filter(c => c.type === cycleType && (includeDemo || !c.demo)).slice().reverse().map(cycle => <div style={pwBox} key={cycle.id}><h3>{cycle.code} · {PW_STAGES[cycle.status]}</h3><p>{cycle.machineId} · ورودی {cycle.inputWeightKg} kg · بچ‌ها: {cycle.itemIds.join("، ")}</p>
        <form onSubmit={event => { const submitter = (event.nativeEvent as any).submitter; cycleAction(event, cycle.id, submitter?.value); }}><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {cycle.status === "COMPLETING" && cycle.type !== "FREEZE" && cycle.itemIds.map((id: string) => <PWField key={id} label={`وزن نهایی ترازوی شبیه‌سازی ${id} (kg)`}><input name={`weight-${id}`} type="number" min="0.001" step="0.001" max={ledger.items.find(x => x.id === id)?.weightKg} style={pwInput} /></PWField>)}
          {["RUNNING", "IN_PROGRESS", "PAUSED", "COMPLETING", "FAILED"].includes(cycle.status) && <input name="reason" placeholder="علت خرابی / تصمیم مدیر" style={{ ...pwInput, width: 250 }} />}
          {(({ READY: ["START", "CANCEL"], RUNNING: ["PAUSE", "COMPLETE", "FAIL"], IN_PROGRESS: ["PAUSE", "COMPLETE", "FAIL"], PAUSED: ["RESUME", "CANCEL", "FAIL"], COMPLETING: ["FINISH", "FAIL"], FAILED: role === "manager" ? ["RESUME", "RESTART", "SCRAP"] : [] } as any)[cycle.status] || []).map((action: string) => <PWButton key={action} type="submit" name="action" value={action} secondary={["CANCEL", "FAIL", "SCRAP"].includes(action)}>{({ START: "شروع چرخه", CANCEL: "لغو", PAUSE: "مکث", RESUME: "ادامه", COMPLETE: "پایان فرآیند؛ آماده تخلیه", FINISH: "ثبت خروجی و پایان تخلیه", FAIL: "ثبت خرابی", RESTART: "بازگشت به آماده", SCRAP: "اسقاط محصول با تصمیم مدیر" } as any)[action]}</PWButton>)}
        </div></form>{cycle.status === "FAILED" && role !== "manager" && <PWNotice>چرخه خراب منتظر تصمیم مدیر است؛ ادامه، شروع مجدد یا اسقاط با علت.</PWNotice>}
      </div>)}</div>
    </>}
    {tab === "merge" && <div style={{ ...pwBox, maxWidth: 850 }}><h2>ادغام فیزیکی در یک سبد مجزا</h2><PWNotice>این عملیات یک بچ جدید با شجره ورودی می‌سازد؛ گروه‌بندی نمایشی سبدها محسوب نمی‌شود. در این رابط تمام وزن بچ‌های انتخابی مصرف می‌شود.</PWNotice><form onSubmit={merge}><PWField label="بچ‌های ورودی"><div>{live.filter(item => !pwBusy(ledger, item) && !item.trays.length).map(item => <label key={item.id} style={{ display: "block", padding: 8 }}><input name="items" type="checkbox" value={item.id} /> {item.code} · {item.product} · {item.grade}/{item.size} · {item.weightKg} kg</label>)}</div></PWField><PWField label="اسکن سبد خالی خروجی در سورتینگ"><input name="scan" required style={pwInput} /></PWField><label style={{ display: "block", marginBottom: 14 }}><input name="staged" type="checkbox" required /> سبد خروجی خالی و در محل سورتینگ قرار دارد.</label><PWField label="وزن خروجی (kg)"><input name="weight" type="number" min="0.001" step="0.001" required style={pwInput} /></PWField><PWField label="گرید خروجی"><select name="grade" required style={pwInput}><option value="">انتخاب…</option>{[...new Set(live.map(x => x.grade))].map(x => <option key={x}>{x}</option>)}</select></PWField><PWField label="اندازه خروجی"><select name="size" required style={pwInput}><option value="">انتخاب…</option>{[...new Set(live.map(x => x.size))].map(x => <option key={x}>{x}</option>)}</select></PWField><PWButton disabled={live.length < 2}>تأیید ادغام و ایجاد بچ</PWButton></form></div>}
    {tab === "results" && <div style={{ display: "grid", gap: 18 }}>
      <div style={pwBox}><h2>بچ‌ها، خروجی‌ها و شجره</h2>{!allItems.length ? <PWEmpty /> : <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr>{["بچ", "محصول / گرید / اندازه", "والد / سبد ورودی", "ظرف فعلی", "وزن رسمی", "بازده", "وضعیت / محل"].map(h => <th key={h} style={{ padding: 12, textAlign: "right", background: "#eff6f3" }}>{h}</th>)}</tr></thead><tbody>{allItems.map(item => <tr key={item.id}>{[item.code, `${item.product} / ${item.grade} / ${item.size}`, `${item.parentId} / ${item.inputCodes.join("، ")}`, item.containerCode || item.trays.map(t => t.code).join("، ") || "—", `${item.weightKg} kg`, item.yieldPercent === undefined ? "—" : `${item.yieldPercent}%`, `${PW_STAGES[item.stage]} / ${PW_ZONES[item.zone] || item.zone}`].map((value, index) => <td key={index} style={{ padding: 12, borderBottom: "1px solid #e1eae6" }}>{value}</td>)}</tr>)}</tbody></table></div>}</div>
      <div style={pwBox}><h2>افت سورتینگ</h2>{!ledger.events.some(e => e.action === "ثبت سورتینگ") ? <PWEmpty>پس از ثبت سورتینگ، وزن ورودی، خروجی و علت افت در اینجا نمایش داده می‌شود.</PWEmpty> : ledger.events.filter(e => e.action === "ثبت سورتینگ").map(event => <p key={event.seq}>{event.entity} · ورودی {event.details.inputWeightKg} kg · خروجی {event.details.outputWeightKg} kg · افت {event.details.lossKg} kg · علت {event.details.lossReason || "بدون افت"}</p>)}</div>
      <div style={pwBox}><h2>رویدادهای شبیه‌سازی</h2><small>ترتیب پایدار بر اساس شماره رویداد است؛ زمان برابر ترتیب را تغییر نمی‌دهد.</small>{!ledger.events.length ? <PWEmpty /> : ledger.events.slice().reverse().map(event => <div key={event.seq} style={{ borderBottom: "1px solid #e1eae6", padding: "12px 0" }}><b>#{event.seq} · {event.action}</b> · {event.entity}<small style={{ display: "block", color: "#6a817b", marginTop: 5 }}>{new Date(event.at).toLocaleString("fa-IR")}</small><pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 11, color: "#56756d", direction: "ltr" }}>{JSON.stringify(event.details)}</pre></div>)}</div>
    </div>}
  </div>;
}
