const inventoryStatusNames: Record<string, string> = {
  IN_SORTING: "در حال سورت", STORED: "موجود در سردخانه", AWAITING_GATE_SCAN: "در انتظار اسکن مقصد",
  WASH_SESSION_LOCKED: "نشست شست‌وشو قفل‌شده", IN_PROCESS: "در حال عملیات", COMPLETED: "تکمیل‌شده",
  READY: "آماده", RUNNING: "در حال اجرا", IN_PROGRESS: "در حال اجرا", PAUSED: "متوقف موقت",
  LOCKED: "قفل‌شده", DRAFT: "باز", CONSUMED: "مصرف‌شده",
}

const inventoryKindStyle: Record<string, { label: string; color: string; bg: string }> = {
  RECEIPT: { label: "محموله ورودی", color: "#875d13", bg: "#fff3cf" },
  PRODUCT: { label: "بچ محصول", color: "#176b50", bg: "#dff3e9" },
  CONTAINER: { label: "ظرف فیزیکی", color: "#255a8a", bg: "#e6f1fb" },
  SESSION: { label: "نشست عملیات", color: "#6b4a87", bg: "#f0e8f7" },
  CYCLE: { label: "چرخه دستگاه", color: "#9a4b27", bg: "#fbe9df" },
}

function InventoryKindBadge({ kind }: { kind: keyof typeof inventoryKindStyle }) {
  const style = inventoryKindStyle[kind]
  return <span style={{ color: style.color, background: style.bg, borderRadius: 999, padding: "4px 9px", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>{style.label}</span>
}

function inventoryLocationName(value: any) {
  const key = String(value || "")
  return PW_ZONES[key] || ({ COLD_ROOM_POSITIVE_DIRTY: "سردخانه مثبت کثیف", COLD_ROOM_POSITIVE_CLEAN: "سردخانه مثبت تمیز", COLD_ROOM_NEGATIVE: "سردخانه منفی", RECEIVING: "دریافت" } as Record<string, string>)[key] || key || "تعیین نشده"
}

function inventoryStageName(value: any) {
  const key = String(value || "")
  return PW_STAGES[key] || inventoryStatusNames[key] || key || "ثبت اولیه"
}

function inventoryActionName(value:any){const action=String(value||"").trim();if(!action)return "فعلاً اقدام دیگری لازم نیست";if(/ثبت خروج اسلایس نشست|انجام عملیات اسلایس/.test(action))return "در مرحله اسلایس و منتظر ثبت خروج";if(/اسکن ورود به اسلایس|منتظر ورود دوباره به اسلایس/.test(action))return "در انتظار اسلایس";if(/ثبت خروج از فریز و بسته‌بندی|انجام عملیات فریز/.test(action))return "در حال فریزینگ و منتظر ثبت خروج و بسته‌بندی";if(/ثبت خروج از خشک‌کن و بسته‌بندی|انجام عملیات خشک‌کن/.test(action))return "در حال خشک‌شدن و منتظر ثبت خروج و بسته‌بندی";if(/ثبت ورود به دستگاه فریزدرای|ثبت ورود سینی‌ها به فریزدرای/.test(action))return "در انتظار ورود به دستگاه فریزدرای";if(/اسکن ورود به شست‌وشو/.test(action))return "در انتظار شست‌وشو";if(/انجام شست‌وشوی نشست|انجام عملیات شست‌وشو/.test(action))return "در مرحله شست‌وشو و منتظر ثبت خروج";if(/اسکن ورود به بسته‌بندی/.test(action))return "در انتظار بسته‌بندی";return action}

const PROTOTYPE_AGING_WARNING_DAYS=7
function prototypeAgingDays(item:any){if(Number.isFinite(Number(item?.agingDays)))return Math.max(0,Math.floor(Number(item.agingDays)));const since=Date.parse(item?.storedAt||item?.updatedAt||item?.createdAt||"");return Number.isFinite(since)?Math.max(0,Math.floor((Date.now()-since)/86400000)):0}
function prototypeAgingState(items:any[]){const agingDays=Math.max(0,...items.map(prototypeAgingDays)),agingWarning=items.some(item=>item.agingWarning===true)||agingDays>=PROTOTYPE_AGING_WARNING_DAYS;return{agingDays,agingWarning}}

function buildInventoryModel(history = false) {
  const receipt = readPrototypeBatch()
  const ledger = readProductionLedger()
  const consumed = new Set(ledger.consumedInputs || [])
  const receiptBaskets = receipt.baskets.filter((basket: any) => history || !consumed.has(`${receipt.id}:${basket.code}`))
  const productionItems = ledger.items.filter((item: any) => !item.demo && (history || !item.consumed))
  const productGroups = new Map<string, any[]>()
  productionItems.forEach((item: any) => {
    const code = item.batchCode || item.code
    productGroups.set(code, [...(productGroups.get(code) || []), item])
  })
  const batches: any[] = []
  if (receiptBaskets.length) batches.push({
    code: receipt.id, kind: "RECEIPT",
    product: [...new Set(receiptBaskets.map((basket: any) => basket.product))].join("، "),
    grade: [...new Set(receiptBaskets.map((basket: any) => basket.grade))].join("، "),
    weightKg: receiptBaskets.reduce((sum: number, basket: any) => sum + Number(basket.gross || 0) - Number(basket.tare || 0), 0),
    stage: receipt.status,
    locations: [...new Set(receiptBaskets.map((basket: any) => inventoryLocationName(basket.currentLocation || basket.zone)))],
    containers: receiptBaskets.map((basket: any) => basket.code), parents: [],
    nextActions: [...new Set(receiptBaskets.map((basket: any) => inventoryActionName(basket.nextAction)).filter(Boolean))],
    destination: [...new Set(receiptBaskets.map((basket: any) => basket.destination).filter(Boolean))].map(inventoryLocationName), rows: receiptBaskets, ...prototypeAgingState(receiptBaskets),
  })
  productGroups.forEach((items: any[], code: string) => {
    const parents = [...new Set(items.flatMap((item: any) => item.parentIds || String(item.parentId || "").split(",")).filter(Boolean))]
    batches.push({
      code, kind: "PRODUCT",
      product: [...new Set(items.map((item: any) => item.product).filter(Boolean))].join("، "),
      grade: [...new Set(items.map((item: any) => item.grade).filter(Boolean))].join("، "),
      weightKg: items.reduce((sum: number, item: any) => sum + Number(item.weightKg || 0), 0),
      stage: [...new Set(items.map((item: any) => inventoryStageName(item.stage)))].join("، "),
      locations: [...new Set(items.map((item: any) => inventoryLocationName(item.currentLocation || item.zone)))],
      containers: [...new Set(items.flatMap((item: any) => [item.containerCode, ...(item.trays || []).map((tray: any) => tray.code)].filter(Boolean)))],
      parents, nextActions: [...new Set(items.map((item: any) => inventoryActionName(item.nextAction)).filter(Boolean))],
      destination: [...new Set(items.map((item: any) => item.destination).filter(Boolean))].map(inventoryLocationName), rows: items, ...prototypeAgingState(items),
    })
  })
  const containers = [
    ...receiptBaskets.map((basket: any) => ({ code: basket.code, batchCode: receipt.id, product: basket.product, grade: basket.grade, weightKg: Number(basket.gross || 0) - Number(basket.tare || 0), location: inventoryLocationName(basket.currentLocation || basket.zone), state: inventoryStatusNames[basket.currentState || basket.status] || basket.currentState || basket.status || receipt.status, nextAction: basket.nextAction || "فعلاً اقدام دیگری لازم نیست" })),
    ...productionItems.flatMap((item: any) => {
      const codes = [item.containerCode, ...(item.trays || []).map((tray: any) => tray.code)].filter(Boolean)
      return codes.map((code: string) => ({ code, batchCode: item.batchCode || item.code, product: item.product, grade: item.grade, weightKg: codes.length === 1 ? Number(item.weightKg || 0) : Number((item.trays || []).find((tray: any) => tray.code === code)?.quantityKg || 0), location: inventoryLocationName(item.currentLocation || item.zone), state: inventoryStatusNames[item.currentState] || inventoryStageName(item.stage), nextAction: item.nextAction || "فعلاً اقدام دیگری لازم نیست" }))
    }),
  ]
  const operations = [
    ...(ledger.sortingSessions || []).map((session: any) => ({ code: session.id, kind: "SESSION", title: "نشست سورتینگ", status: session.status, inputs: session.inputCodes || [], outputs: session.outputIds || [], machine: "ایستگاه سورتینگ" })),
    ...(ledger.washSessions || []).map((session: any) => ({ code: session.id, kind: "SESSION", title: "نشست شست‌وشو", status: session.status, inputs: session.inputIds || [], outputs: session.childIds || session.outputs || [], machine: `${session.product || "محصول"} · گرید ${session.grade || "—"}` })),
    ...(ledger.cycles || []).map((cycle: any) => ({ code: cycle.id, kind: "CYCLE", title: cycle.type === "FREEZE_DRY" ? "چرخه فریزدرای" : cycle.type === "DRY" ? "چرخه خشک‌کن" : "چرخه فریز", status: cycle.status, inputs: cycle.itemIds || [], outputs: [], machine: cycle.machineId || "دستگاه تعیین نشده" })),
  ]
  batches.sort((a,b)=>Number(b.agingWarning)-Number(a.agingWarning)||Number(b.agingDays)-Number(a.agingDays)||String(a.code).localeCompare(String(b.code)))
  return { receipt, ledger, batches, containers, operations }
}

function InventoryBatchDetails({ row }: { row: any }) {
  return <div className="border-t bg-[#fbfdfc] p-4 grid grid-cols-3 gap-3 text-[12px]">
    <div className="bg-white border rounded-lg p-3"><small className="block text-[#718079]">ظروف حامل فعلی</small><b className="font-mono">{row.containers.join("، ") || "بدون ظرف؛ تخصیص فرایندی"}</b></div>
    <div className="bg-white border rounded-lg p-3"><small className="block text-[#718079]">والدها</small><b className="font-mono">{row.parents.join("، ") || "مبدأ دریافت"}</b></div>
    <div className="bg-white border rounded-lg p-3"><small className="block text-[#718079]">مقصد نهایی</small><b>{row.destination.join("، ") || "هنوز تعیین نشده"}</b></div>
    <div className="col-span-3 bg-[#edf8f3] rounded-lg p-3"><b>اقدام بعدی: </b>{row.nextActions.join("، ") || "فعلاً اقدام دیگری لازم نیست"}</div>
  </div>
}

function InventoryBatchRow({ row }: { row: any }) {
  return <details className="border border-[#d8e4df] rounded-xl bg-white overflow-hidden">
    <summary className={`cursor-pointer list-none grid grid-cols-[1.1fr_.8fr_1.2fr_.7fr_.7fr_auto] gap-3 items-center p-4 ${row.agingWarning?"bg-[#fffaf2]":""}`}>
      <div><InventoryKindBadge kind={row.kind} /><b className="block font-mono mt-2 text-[#183e38]">{row.code}</b></div>
      <span><small className="block text-[#718079]">محصول / گرید</small><b>{row.product || "—"} · {row.grade || "—"}</b></span>
      <span><small className="block text-[#718079]">موقعیت / مرحله فعلی</small><b>{row.locations.join("، ")} / {inventoryStageName(row.stage)}</b></span>
      <span><small className="block text-[#718079]">وزن خالص</small><b>{row.weightKg.toFixed(3)} kg</b></span>
      <span><small className="block text-[#718079]">سن نگهداری</small><b>{row.agingDays} روز</b>{row.agingWarning&&<small className="block text-[#c67518]">در حال پیرشدن</small>}</span>
      <span className="text-[#176b50] font-bold">بازکردن ←</span>
    </summary><InventoryBatchDetails row={row} />
  </details>
}

function ProductionInventorySummary({ history = false }: { history?: boolean }) {
  const model = buildInventoryModel(history)
  const [query, setQuery] = useState("")
  const needle = query.trim().toLowerCase()
  const rows = model.batches.filter((row: any) => [row.code, row.product, row.grade, ...row.containers, ...row.parents].join(" ").toLowerCase().includes(needle))
  return <section className="flex-1 min-h-0 overflow-auto p-4 bg-[#f4f7f5] text-[#18302a] border-t border-[#d8e4df]" dir="rtl">
    <h2 className="text-lg font-bold mb-1">{history ? "رهگیری شجره محصول" : "بچ‌های محصول"}</h2>
    <p className="text-[11px] text-[#718079] mb-3">کد محموله و کد بچ محصول جدا از کد ظرف، نشست و چرخه نمایش داده می‌شوند.</p>
    <input aria-label="جست‌وجوی بچ محصول" value={query} onChange={event => setQuery(event.target.value)} placeholder="کد محموله یا بچ، ظرف، محصول یا والد" className="border rounded-lg px-3 h-9 w-full mb-3" />
    <div className="space-y-3">{!rows.length ? <p className="bg-white rounded-lg p-5">هیچ بچ منطبق با جست‌وجو وجود ندارد.</p> : rows.map((row: any) => <InventoryBatchRow key={row.code} row={row} />)}</div>
  </section>
}

function InventoryScreen() {
  const [tab, setTab] = useState<"BATCHES" | "CONTAINERS" | "OPERATIONS">("BATCHES")
  const [query, setQuery] = useState("")
  const model = buildInventoryModel(false)
  const needle = query.trim().toLowerCase()
  const batches = model.batches.filter((row: any) => [row.code, row.product, row.grade, ...row.containers, ...row.parents].join(" ").toLowerCase().includes(needle))
  const containers = model.containers.filter((row: any) => [row.code, row.batchCode, row.product, row.grade, row.location, row.state].join(" ").toLowerCase().includes(needle))
  const operations = model.operations.filter((row: any) => [row.code, row.title, row.status, row.machine, ...row.inputs].join(" ").toLowerCase().includes(needle))
  const totalWeight = model.batches.reduce((sum: number, row: any) => sum + row.weightKg, 0)
  const activeOperations = model.operations.filter((row: any) => !["COMPLETED", "CANCELLED", "SCRAPPED"].includes(row.status)).length
  const tabs = [{ id: "BATCHES", label: "بچ‌های محصول", count: model.batches.length }, { id: "CONTAINERS", label: "ظروف حامل محصول", count: model.containers.length }, { id: "OPERATIONS", label: "نشست‌ها و چرخه‌ها", count: model.operations.length }] as const
  return <div className="flex-1 min-h-0 overflow-auto bg-[#f4f7f5] p-5 text-[#18302a]" dir="rtl">
    <div className="flex items-start justify-between gap-4 mb-4"><div><h1 className="font-bold text-[24px]">موجودی</h1><p className="text-[12px] text-[#718079] mt-1">نمای واحد محصول، ظرف فیزیکی و عملیات؛ هر کد فقط با نقش واقعی خودش نمایش داده می‌شود.</p></div><div className="bg-[#eef5f2] border border-[#d5e4de] rounded-xl p-3 text-[11px] min-w-[360px]"><b className="block text-[#176b50] mb-1">راهنمای سریع کدها</b><span className="font-mono">RCV</span> محموله ورودی · <span className="font-mono">B</span> بچ محصول · <span className="font-mono">CTR/BSK</span> ظرف · <span className="font-mono">SORT/WS</span> نشست · <span className="font-mono">CY</span> چرخه دستگاه</div></div>
    <div className="grid grid-cols-4 gap-3 mb-4">{[["بچ فعال", model.batches.length, "محموله یا بچ محصول"], ["وزن خالص موجود", `${totalWeight.toFixed(3)} kg`, "بدون شمارش دوباره والد مصرف‌شده"], ["ظرف حامل", model.containers.length, "فقط ظروف دارای محصول"], ["عملیات باز", activeOperations, "نشست یا چرخه تکمیل‌نشده"]].map(([label, value, hint]) => <div key={String(label)} className="bg-white border border-[#d8e4df] rounded-xl p-4"><small className="text-[#718079]">{label}</small><b className="block text-[22px] mt-1">{value}</b><span className="text-[10px] text-[#718079]">{hint}</span></div>)}</div>
    <div className="flex gap-2 mb-3">{tabs.map(item => <button key={item.id} onClick={() => setTab(item.id)} className={`rounded-xl border px-4 py-3 text-right min-w-[190px] ${tab === item.id ? "bg-[#176b50] border-[#176b50] text-white" : "bg-white border-[#d8e4df]"}`}><b className="text-[12px]">{item.label}</b><span className="mr-2 text-[11px] opacity-75">{item.count} مورد</span></button>)}</div>
    <input aria-label="جست‌وجوی موجودی" value={query} onChange={event => setQuery(event.target.value)} placeholder={tab === "BATCHES" ? "جست‌وجوی کد محموله، بچ، محصول، والد یا ظرف" : tab === "CONTAINERS" ? "جست‌وجوی کد ظرف، بچ یا موقعیت" : "جست‌وجوی کد نشست، چرخه یا دستگاه"} className="w-full h-10 border border-[#d8e4df] rounded-lg px-3 mb-3 bg-white" />
    {tab === "BATCHES" && <div className="space-y-3">{!batches.length ? <div className="bg-white rounded-xl p-8 text-center text-[#718079]">بچی پیدا نشد.</div> : batches.map((row: any) => <InventoryBatchRow key={row.code} row={row} />)}</div>}
    {tab === "CONTAINERS" && <div className="bg-white border border-[#d8e4df] rounded-xl overflow-hidden"><div className="grid grid-cols-[1fr_1fr_1fr_.7fr_1fr_1.4fr] gap-3 bg-[#eef4f1] px-4 py-3 text-[11px] text-[#718079] font-bold"><span>کد ظرف</span><span>محتوای فعلی</span><span>محصول / گرید</span><span>وزن خالص</span><span>موقعیت</span><span>وضعیت و اقدام بعدی</span></div>{!containers.length ? <div className="p-8 text-center text-[#718079]">ظرف حامل محصول پیدا نشد.</div> : containers.map((row: any) => <div key={`${row.code}-${row.batchCode}`} className="grid grid-cols-[1fr_1fr_1fr_.7fr_1fr_1.4fr] gap-3 px-4 py-3 border-t text-[12px] items-center"><div><InventoryKindBadge kind="CONTAINER" /><b className="block font-mono mt-2">{row.code}</b></div><div><small className="block text-[#718079]">کد بچ/محموله</small><b className="font-mono">{row.batchCode}</b></div><b>{row.product} · {row.grade}</b><b>{row.weightKg.toFixed(3)} kg</b><span>{row.location}</span><div><b>{row.state}</b><small className="block text-[#718079] mt-1">{row.nextAction}</small></div></div>)}</div>}
    {tab === "OPERATIONS" && <div className="grid grid-cols-2 gap-3">{!operations.length ? <div className="col-span-2 bg-white rounded-xl p-8 text-center text-[#718079]">نشست یا چرخه‌ای ثبت نشده است.</div> : operations.map((row: any) => <div key={row.code} className="bg-white border border-[#d8e4df] rounded-xl p-4"><div className="flex justify-between items-start"><div><InventoryKindBadge kind={row.kind} /><b className="block font-mono mt-2 text-[15px]">{row.code}</b></div><span className="bg-[#eef4f1] rounded-full px-3 py-1 text-[11px] font-bold">{inventoryStatusNames[row.status] || row.status}</span></div><h3 className="font-bold mt-3">{row.title}</h3><p className="text-[11px] text-[#718079] mt-1">{row.machine}</p><div className="grid grid-cols-2 gap-2 mt-3 text-[11px]"><div className="bg-[#f7faf8] rounded-lg p-2"><small className="block text-[#718079]">ورودی‌ها</small><b className="font-mono">{row.inputs.length ? `${row.inputs.length} مورد` : "—"}</b></div><div className="bg-[#f7faf8] rounded-lg p-2"><small className="block text-[#718079]">خروجی‌ها</small><b>{row.outputs.length ? `${row.outputs.length} مورد` : "هنوز ثبت نشده"}</b></div></div><p className="text-[10px] text-[#718079] mt-3">این شناسه برای کنترل عملیات است و بچ محصول محسوب نمی‌شود.</p></div>)}</div>}
  </div>
}

function TraceScreen() { return <div className="flex-1 min-h-0 overflow-auto"><ProductionInventorySummary history /><LegacyTraceScreen /></div> }
