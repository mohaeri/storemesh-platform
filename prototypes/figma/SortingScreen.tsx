// Figma prototype fragment; assembled into WebApp.tsx. No backend calls.
function SortingScreen() {
  const batch = readPrototypeBatch();
  const [step, setStep] = useState("input");
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [gross, setGross] = useState("");
  const [grade, setGrade] = useState("A");
  const [size, setSize] = useState("درشت");
  const [lossReason, setLossReason] = useState("");
  const [outputs, setOutputs] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [scale, setScale] = useState("STABLE");
  const [staged, setStaged] = useState<string[]>([]);
  const ledger = readProductionLedger();
  const fleet: any[] = (() => { try { return JSON.parse(localStorage.getItem("storemesh.prototype.containers") || "[]"); } catch { return []; } })();
  const consumed = ledger.consumedInputs || [];
  const used = (b: any) => consumed.includes(batch.id + ":" + b.code);
  const blocked = (b: any) => {
    const physical = fleet.find(c => (c.qr || c.code) === b.code);
    return used(b) || !!physical?.locked || /خراب|DAMAGED/.test(physical?.status || "") || /قرنطینه|در راه|خراب|CONSUMED|QUARANTINE|BLOCKED|DAMAGED/.test(b.status || "") || /قرنطینه/.test(b.zone || "");
  };
  const source = batch.baskets.find(b => b.code === inputCode);
  const inputWeight = source ? Number((source.gross - source.tare).toFixed(3)) : 0;
  const total = Number(outputs.reduce((n, o) => n + o.weight, 0).toFixed(3));
  const loss = Number((inputWeight - total).toFixed(3));
  const occupied = (code: string) => ledger.items.some((i: any) => i.containerCode === code && !i.consumed && !i.allocated && i.weightKg > 0) || batch.baskets.some(b => b.code === code && !used(b));
  const pool = fleet.filter(c => (c.status === "فعال" || c.status === "AVAILABLE") && !c.singleUse && !/سینی|TRAY|SINGLE_USE/.test(c.type || "") && !c.locked && !occupied(c.qr || c.code));
  const carrier = pool.find(c => (c.qr || c.code) === outputCode);
  const tare = Number(carrier?.tare ?? carrier?.tareWeightKg ?? 0);
  const net = Number((Number(gross) - tare).toFixed(3));
  const zones = carrier?.zones || carrier?.designatedZones || [];
  const warning = carrier && !zones.includes("SORTING");
  const field = "h-11 w-full rounded-lg border border-[#d4e2db] bg-white px-3 text-[13px]";
  const primary = "rounded-lg bg-[#176b50] px-4 py-3 text-white text-[12px] font-bold disabled:opacity-40";
  function start() {
    if (!source || blocked(source) || !(inputWeight > 0)) { setError("یک ظرف موجود، آزاد و مجاز را انتخاب کنید."); return; }
    if (!/سردخانه|COLD_ROOM|COLD_STORAGE/.test(source.zone || "")) { setError("ورودی سورت باید در سردخانه باشد؛ ابتدا از مرکز انتقال، انتقال ظرف به سردخانه را ثبت کنید."); return; }
    setStep("output"); setError("");
  }
  function add() {
    if (!carrier || outputs.some(o => o.code === outputCode) || outputCode === inputCode) { setError("سبد خروجی باید موجود، خالی و غیرتکراری باشد."); return; }
    if (!staged.includes(outputCode)) { setError("حضور فیزیکی سبد خروجی در سورتینگ را تأیید کنید."); return; }
    if (scale !== "STABLE") { setError("ترازو قطع است یا وزن ناپایدار است."); return; }
    if (!Number.isFinite(net) || net <= 0 || net > Number(carrier.capacity ?? carrier.capacityKg ?? Infinity) || total + net > inputWeight + 0.001) { setError("خالص خروجی باید مثبت و در محدوده ظرفیت سبد و وزن ورودی باشد."); return; }
    setOutputs([...outputs, {code: outputCode, grade, size, gross: Number(gross), tare, weight: net, location: "SORTING", route: "", designationWarning: !!warning}]);
    setOutputCode(""); setGross(""); setError("");
  }
  function finish() {
    if (!outputs.length || loss < -0.001 || (loss > 0 && !lossReason)) { setError("برای هر افت مثبت، دلیل افت الزامی است."); return; }
    try { recordSortingOutputs(batch, [inputCode], outputs, lossReason); setStep("done"); setError(""); }
    catch (e: any) { setError(e.message || "ذخیره انجام نشد."); }
  }
  return <div className="space-y-4 p-5 bg-[#f4f7f5] text-[#18302a]" dir="rtl">
    <div className="flex justify-between items-center"><div><h2 className="text-xl font-bold">سورتینگ · ثبت ورودی و خروجی</h2><p className="text-[12px] text-[#718079] mt-1">هر نوبت یک ظرف ورودی؛ هر سبد خروجی یک بچ مستقل با سابقهٔ مبدأ.</p></div><span className="text-[11px] px-3 py-2 bg-[#fff3d6] rounded-full">ترازو و اسکن شبیه‌سازی‌شده</span></div>
    {error && <div role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg text-[13px]">{error}</div>}
    {step === "done" ? <Card className="p-7 text-center"><h3 className="text-xl font-bold text-[#176b50]">خروجی سورت ذخیره شد</h3><p className="my-3">{outputs.length} بچ مستقل، {total.toFixed(3)} کیلوگرم؛ در انتظار تصمیم مقصد مدیر.</p><p className="text-[12px]">از «نمای کلی» مقصد و انتقال فیزیکی را ثبت کنید. جزئیات در «نتایج و رهگیری» باقی می‌ماند.</p><button className={primary + " mt-5"} onClick={() => {setStep("input"); setInputCode(""); setOutputs([]); setLossReason(""); setStaged([]);}}>ثبت ظرف ورودی بعدی</button></Card> : <>
      <Card className="p-4"><h3 className="font-bold mb-3">۱. اسکن و تأیید یک ظرف ورودی</h3><div className="grid grid-cols-3 gap-3"><label className="text-[12px]">محموله<input className={field} readOnly value={batch.id}/></label><label className="text-[12px]">کد سبد ورودی<input aria-label="کد سبد ورودی سورت" className={field} disabled={step !== "input"} value={inputCode} onChange={e => {setInputCode(e.target.value.trim()); setError("");}} placeholder="اسکن QR یا واردکردن کد"/></label><label className="text-[12px]">انتخاب از فهرست<select aria-label="انتخاب ظرف ورودی سورت" className={field} disabled={step !== "input"} value={inputCode} onChange={e => setInputCode(e.target.value)}><option value="">انتخاب کنید…</option>{batch.baskets.map(b => <option key={b.code} value={b.code} disabled={blocked(b)}>{b.code} · {(b.gross - b.tare).toFixed(3)} kg {used(b) ? "· قبلاً مصرف شده" : ""}</option>)}</select></label></div>
        {source && <div className="mt-3 p-3 bg-[#e7f1ec] rounded-lg text-[12px]">{source.product} · گرید اولیه {source.grade} · {source.size} · موقعیت {source.zone || "دریافت"} · خالص <b>{inputWeight.toFixed(3)} kg</b></div>}
        {step === "input" ? <button className={primary + " mt-3"} disabled={!source || blocked(source)} onClick={start}>تأیید ورودی و شروع سورت</button> : <span className="block mt-3 text-[#176b50] text-[12px]">✓ ورودی در این نوبت قفل شده است</span>}
      </Card>
      {step === "output" && <div className="grid grid-cols-[2fr_1fr] gap-4"><Card className="p-4"><h3 className="font-bold mb-3">۲. اسکن سبد موجود و توزین خروجی</h3>{!pool.length && <p className="bg-[#fff3d6] p-3 rounded-lg mb-3 text-[12px]">سبد خالی ثبت نشده است؛ در دریافت ← کانتینرها سبد موجود را تعریف کنید.</p>}
        <div className="grid grid-cols-2 gap-3"><label className="text-[12px]">اسکن کد خروجی<input aria-label="اسکن سبد خروجی سورت" className={field} value={outputCode} onChange={e => setOutputCode(e.target.value.trim())}/></label><label className="text-[12px]">انتخاب سبد خالی<select aria-label="انتخاب سبد خروجی سورت" className={field} value={outputCode} onChange={e => setOutputCode(e.target.value)}><option value="">انتخاب کنید…</option>{pool.filter(c => !outputs.some(o => o.code === (c.qr || c.code))).map(c => <option key={c.qr || c.code} value={c.qr || c.code}>{c.qr || c.code} · خالی {c.tare ?? c.tareWeightKg ?? 0} kg</option>)}</select></label>
          <label className="text-[12px]">گرید نهایی<select className={field} value={grade} onChange={e => setGrade(e.target.value)}>{["A", "B", "C"].map(x => <option key={x}>{x}</option>)}</select></label><label className="text-[12px]">اندازه نهایی<select className={field} value={size} onChange={e => setSize(e.target.value)}>{["درشت", "متوسط", "ریز", "مخلوط"].map(x => <option key={x}>{x}</option>)}</select></label>
          <label className="text-[12px]">وزن ناخالص با محصول (kg)<input aria-label="وزن ناخالص خروجی سورت" type="number" step="0.001" className={field} value={gross} onChange={e => setGross(e.target.value)}/></label><label className="text-[12px]">وضعیت لودسل<select aria-label="وضعیت ترازو سورت" className={field} value={scale} onChange={e => setScale(e.target.value)}><option value="STABLE">متصل · پایدار</option><option value="UNSTABLE">ناپایدار</option><option value="OFFLINE">قطع ارتباط</option></select></label>
        </div><div className="flex items-center justify-between rounded-xl bg-[#102f29] text-white p-4 my-3"><span className="text-[12px]">خالص = ناخالص − وزن خالی ({tare.toFixed(3)})</span><b className="text-xl font-mono">{gross && net > 0 ? net.toFixed(3) : "0.000"} kg</b><button className="border border-white/40 rounded-lg px-3 py-2 text-[11px] disabled:opacity-40" disabled={!carrier || scale !== "STABLE"} onClick={() => setGross((Math.min(18.5, Math.max(0, inputWeight - total)) + tare).toFixed(3))}>دریافت وزن نمونه</button></div>
        {carrier && <label className="flex gap-2 text-[12px] mb-3"><input type="checkbox" checked={staged.includes(outputCode)} onChange={e => setStaged(e.target.checked ? [...staged, outputCode] : staged.filter(x => x !== outputCode))}/>اسکن و حضور فیزیکی این سبد در زون سورتینگ تأیید شد</label>}
        {warning && <p className="p-3 bg-[#fff3d6] rounded-lg text-[12px] mb-3">هشدار: سورتینگ در زون‌های تعیین‌شدهٔ این ظرف نیست. مغایرت ثبت می‌شود؛ حضور فیزیکی همچنان الزامی است.</p>}
        <button className={primary + " w-full"} disabled={!carrier || !gross || scale !== "STABLE" || !staged.includes(outputCode)} onClick={add}>ثبت سبد خروجی و ادامه</button>
        <div className="mt-4 divide-y">{outputs.map((o, n) => <div key={o.code} className="flex justify-between py-3 text-[12px]"><b>{o.code}</b><span>{o.grade} · {o.size}</span><span>{o.weight.toFixed(3)} kg</span><button className="text-red-700" onClick={() => setOutputs(outputs.filter((_, i) => i !== n))}>حذف از پیش‌نویس</button></div>)}</div>
      </Card><div className="space-y-3"><Card className="p-4"><h3 className="font-bold mb-4">تراز وزن</h3><p className="flex justify-between my-3">ورودی <b>{inputWeight.toFixed(3)} kg</b></p><p className="flex justify-between my-3">خروجی <b>{total.toFixed(3)} kg</b></p><p className="flex justify-between my-3">افت <b>{loss.toFixed(3)} kg</b></p><label className="text-[12px]">دلیل افت (برای هر افت مثبت الزامی)<select aria-label="دلیل افت سورت" className={field + " mt-2"} value={lossReason} onChange={e => setLossReason(e.target.value)}><option value="">بدون افت</option><option value="WASTE">ضایعات</option><option value="DAMAGE">آسیب‌دیدگی</option><option value="MOISTURE_LOSS">کاهش رطوبت</option><option value="RESIDUAL_MATERIAL">مواد باقی‌مانده</option><option value="MEASUREMENT_VARIANCE">مغایرت اندازه‌گیری</option></select></label><button className={primary + " w-full mt-4"} disabled={!outputs.length || loss < -0.001 || (loss > 0 && !lossReason)} onClick={finish}>تکمیل سورت و ذخیره خروجی‌ها</button></Card><p className="p-3 text-[12px] bg-[#e7f1ec] rounded-lg">مقصد تصمیم جداگانهٔ مدیر است؛ محل فعلی خروجی پس از سورت همچنان سورتینگ خواهد بود.</p></div></div>}
    </>}
  </div>;
}
