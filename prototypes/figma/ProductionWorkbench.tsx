// UI-only Figma Make simulation. Paste into WebApp.tsx; useState and SortingScreen are supplied there.
type PWItem = {
  id: string
  code: string
  parentId: string
  inputCodes: string[]
  product: string
  grade: string
  size: string
  weightKg: number
  stage: string
  zone: string
  destination: string | null
  containerCode: string
  trays: any[]
  allocated: boolean
  consumed: boolean
  blocked: boolean
  [key: string]: any
}
type PWLedger = {
  version: number
  seq: number
  idSeq: number
  items: PWItem[]
  cycles: any[]
  washSessions: any[]
  sortingSessions: any[]
  events: any[]
  consumedInputs: string[]
  machines: Record<string, string[]>
  storageError?: string
}
const PW_STORAGE = "storemesh.prototype.production.v1"
const PW_ACTIVE = ["READY", "RUNNING", "IN_PROGRESS", "PAUSED", "COMPLETING"]
function pwColdStorageLocation(value:string|undefined|null):boolean{const location=String(value||"").trim().toUpperCase().replace(/[\s_.-]+/g,"");return location.includes("سردخانه")||location.includes("COLDROOM")||location.includes("COLDSTORAGE")}
function pwSortingLocation(value:string|undefined|null):boolean{const location=String(value||"").trim().toUpperCase().replace(/[\s_.-]+/g,"");return location.includes("سورتینگ")||location.includes("SORTING")}
const PW_ZONES: Record<string, string> = {
  SORTING: "سورتینگ",
  WASHING: "شست‌وشو",
  SLICING: "اسلایس",
  FREEZING: "فریز",
  FREEZING_SLICED: "فریز اسلایس",
  FREEZE_DRYING: "فریزدرای",
  DRYING: "خشک‌کن",
  FRESH_EXPORT: "ارسال تازه",
  COLD_ROOM_POSITIVE_CLEAN: "سردخانه مثبت تمیز",
  COLD_ROOM_POSITIVE_DIRTY: "سردخانه مثبت کثیف",
  COLD_ROOM_NEGATIVE: "سردخانه منفی",
  COLD_ROOM_CLEAN: "سردخانه مثبت تمیز",
  COLD_ROOM_DIRTY: "سردخانه مثبت کثیف",
  PACKAGING: "بسته‌بندی",
  QC: "کیفیت",
  WASTE: "ضایعات",
}
const PW_OPERATIONAL_DESTINATIONS=["FRESH_EXPORT","DRYING","FREEZING","FREEZING_SLICED","FREEZE_DRYING","QC","WASTE"]
function pwRouteFor(destination:string){
  const routes:Record<string,{processes:string[];physicalAfterSorting:string;physicalAfterWashing?:string}>={
    FRESH_EXPORT:{processes:["PACKAGING"],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY"},
    DRYING:{processes:["WASHING","SLICING","DRYING","PACKAGING"],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY",physicalAfterWashing:"COLD_ROOM_POSITIVE_CLEAN"},
    FREEZING:{processes:["WASHING","FREEZING","PACKAGING"],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY",physicalAfterWashing:"COLD_ROOM_NEGATIVE"},
    FREEZING_SLICED:{processes:["WASHING","SLICING","FREEZING","PACKAGING"],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY",physicalAfterWashing:"COLD_ROOM_POSITIVE_CLEAN"},
    FREEZE_DRYING:{processes:["WASHING","SLICING","FREEZING","FREEZE_DRYING","PACKAGING"],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY",physicalAfterWashing:"COLD_ROOM_POSITIVE_CLEAN"},
    QC:{processes:["QC"],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY"},
    WASTE:{processes:[],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY"},
  }
  return routes[destination]||{processes:[],physicalAfterSorting:"COLD_ROOM_POSITIVE_DIRTY"}
}
const PW_STAGES: Record<string, string> = {
  SORTED: "سورت‌شده",
  WASHED: "شسته‌شده",
  SLICED: "اسلایس‌شده",
  FROZEN: "منجمد",
  FREEZE_DRIED: "فریزدرای‌شده",
  DRIED: "خشک‌شده",
  PACKAGED: "بسته‌بندی‌شده",
  CONSUMED: "مصرف‌شده",
  WASTED: "ضایعات",
  READY: "آماده",
  RUNNING: "در حال اجرا",
  IN_PROGRESS: "در حال اجرا",
  PAUSED: "مکث",
  COMPLETING: "آماده تخلیه",
  COMPLETED: "تکمیل",
  FAILED: "خرابی",
  CANCELLED: "لغوشده",
  SCRAPPED: "اسقاط",
}
const pwNumber = (n: any) => Number(Number(n || 0).toFixed(3))
const pwCode = (value: any) =>
  String(value ?? "")
    .trim()
    .toUpperCase()
function pwProportionalParentContributions(
  sources: any[],
  outputWeightKg: number,
  entryWeights: Record<string, number> = {},
) {
  const parents = sources
    .map((source: any) => ({
      batchId: source.code,
      sourceWeightKg: pwNumber(
        entryWeights[pwCode(source.code)] ??
          Number(source.gross) - Number(source.tare || 0),
      ),
    }))
    .filter((parent: any) => parent.sourceWeightKg > 0)
  const totalSourceWeightKg = pwNumber(
    parents.reduce(
      (sum: number, parent: any) => sum + parent.sourceWeightKg,
      0,
    ),
  )
  const output = pwNumber(outputWeightKg)
  if (!parents.length || !(totalSourceWeightKg > 0) || !(output > 0))
    throw Error("وزن معتبر والدها و خروجی برای محاسبه شجره لازم است.")

  let allocatedWeightKg = 0
  return parents.map((parent: any, index: number) => {
    const inputWeightKg =
      index === parents.length - 1
        ? pwNumber(output - allocatedWeightKg)
        : pwNumber(
            (output * parent.sourceWeightKg) / totalSourceWeightKg,
          )
    allocatedWeightKg = pwNumber(allocatedWeightKg + inputWeightKg)
    return {
      batchId: parent.batchId,
      inputWeightKg,
      sharePercent: pwNumber(
        (parent.sourceWeightKg * 100) / totalSourceWeightKg,
      ),
    }
  })
}
const PW_DEFAULT_MACHINES: Record<string, string[]> = {
  FREEZE: ["FRZ-01"],
  FREEZE_DRY: ["FD-01"],
  DRY: ["DRY-01"],
}
const pwEmpty = (): PWLedger => ({
  version: 1,
  seq: 0,
  idSeq: 0,
  items: [],
  cycles: [],
  washSessions: [],
  sortingSessions: [],
  events: [],
  consumedInputs: [],
  machines: { ...PW_DEFAULT_MACHINES },
})
function pwNormalizeItem(item:PWItem):PWItem{const currentLocation=item.currentLocation||item.zone||"SORTING",currentState=item.currentState||item.stage||"READY",destination=item.nextZone||item.destination||null,nextAction=item.nextAction||(destination&&destination!==currentLocation?`اسکن ورود به ${PW_ZONES[destination]||destination}`:"انجام عملیات جاری");return {...item,zone:currentLocation,currentLocation,currentState,physicalLocation:item.physicalLocation||(pwColdStorageLocation(currentLocation)?currentLocation:"COLD_ROOM_POSITIVE_DIRTY"),operationalDestination:item.operationalDestination??item.destination??null,destination:item.destination??null,nextAction}}
function pwAssertWashCompatibility(session:any,item:PWItem){if(session&&(session.grade!==item.grade||session.size!==item.size))throw Error(`نشست فعال شست‌وشو شامل گرید ${session.grade} / اندازه ${session.size} است. ابتدا تمام محصول را در سبدهای خروجی ثبت و واحد را خالی و تکمیل کنید.`);return true}
function ScanOptionalWeighTransition({
  scan,
  setScan,
  onScan,
  lastWeight,
  weight,
  setWeight,
  suggestedCode = "",
  action = "تأیید اسکن",
  disabled = false,
}: {
  scan: string
  setScan: (value: string) => void
  onScan: (code?: string) => void
  lastWeight?: number
  weight: string
  setWeight: (value: string) => void
  suggestedCode?: string
  action?: string
  disabled?: boolean
}) {
  const [simulatorOpen, setSimulatorOpen] = useState(false)
  const next = weight === "" ? null : Number(weight),
    delta =
      next === null || lastWeight === undefined
        ? null
        : pwNumber(next - lastWeight)
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <label style={{ display: "grid", gap: 5, fontSize: 12 }}>
        اسکن QR
        <input
          aria-label="اسکن QR"
          value={scan}
          onChange={(event) => setScan(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onScan(scan)
            }
          }}
          placeholder="اسکنر سخت‌افزاری یا ورود کد"
          style={pwInput}
        />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div
          style={{
            background: "#eff8f5",
            padding: 11,
            borderRadius: 9,
            fontSize: 12,
          }}
        >
          آخرین وزن معتبر:{" "}
          <b>
            {lastWeight === undefined
              ? "پس از اسکن"
              : `${lastWeight.toFixed(3)} kg`}
          </b>
        </div>
        <label style={{ fontSize: 12 }}>
          وزن این انتقال (اختیاری)
          <input
            type="number"
            min="0.001"
            step="0.001"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="بدون وزن ادامه می‌یابد"
            style={pwInput}
          />
        </label>
      </div>
      {delta !== null && Number.isFinite(delta) && (
        <div style={{ fontSize: 12, color: delta > 0 ? "#9a6420" : "#176b50" }}>
          تغییر وزن:{" "}
          <b>
            {delta > 0 ? "+" : ""}
            {delta.toFixed(3)} kg
          </b>
        </div>
      )}
      <div style={{display:"flex",gap:8}}><PWButton disabled={disabled || !scan.trim()} onClick={()=>onScan(scan)}>{action}</PWButton><PWButton secondary disabled={disabled} onClick={()=>setSimulatorOpen(true)}>⌗ شبیه‌ساز اسکن</PWButton></div>
      <ScanSimulator open={simulatorOpen} title={action} suggestedCode={scan||suggestedCode} onClose={()=>setSimulatorOpen(false)} onScan={(code)=>{setScan(code);onScan(code)}}/>
    </div>
  )
}
function pwTransitionWeight(
  ledger: PWLedger,
  item: PWItem,
  transition: string,
  value?: number,
) {
  const previous = pwNumber(item.weightKg)
  if (value === undefined)
    return pwEvent(ledger, "انتقال بدون توزین", item.code, {
      transition,
      previousWeightKg: previous,
    })
  if (!Number.isFinite(value) || value <= 0)
    throw Error("وزن انتقال باید مثبت باشد.")
  const next = pwNumber(value),
    delta = pwNumber(next - previous)
  item.weightKg = next
  pwEvent(ledger, "توزین انتقال", item.code, {
    transition,
    previousWeightKg: previous,
    weightKg: next,
    newWeightKg: next,
    deltaKg: delta,
  })
}
function readProductionLedger(): PWLedger {
  try {
    const raw = localStorage.getItem(PW_STORAGE)
    if (!raw) return pwEmpty()
    const value = JSON.parse(raw)
    if (
      value.version !== 1 ||
      !Array.isArray(value.items) ||
      !Array.isArray(value.cycles) ||
      !Array.isArray(value.events)
    )
      throw Error(
        "ساختار دفتر تولید قابل خواندن نیست؛ داده را بازنویسی نکردیم.",
      )
    return {
      ...pwEmpty(),
      ...value,
      machines: { ...PW_DEFAULT_MACHINES, ...(value.machines || {}) },
      items: value.items.map(pwNormalizeItem),
      events: [...value.events].sort((a, b) => a.seq - b.seq),
    }
  } catch (error: any) {
    return {
      ...pwEmpty(),
      storageError: error.message || "دسترسی به حافظه مرورگر ممکن نیست.",
    }
  }
}
function saveProductionLedger(ledger: PWLedger) {
  if (ledger.storageError) throw Error(ledger.storageError)
  localStorage.setItem(PW_STORAGE, JSON.stringify({...ledger,items:ledger.items.map(pwNormalizeItem)}))
}
function pwEvent(
  ledger: PWLedger,
  action: string,
  entity: string,
  details: any = {},
) {
  ledger.seq =
    Math.max(ledger.seq || 0, ...ledger.events.map((x) => Number(x.seq) || 0)) +
    1
  ledger.events.push({
    seq: ledger.seq,
    action,
    entity,
    details,
    at: new Date().toISOString(),
  })
}
function pwId(ledger: PWLedger, prefix: string) {
  ledger.idSeq = (ledger.idSeq || 0) + 1
  return `${prefix}-SIM-${String(ledger.idSeq).padStart(5, "0")}`
}
function pwCarriers() {
  let value: any
  const defaults = [
    { qr: "CTR-001", type: "سبد پلاستیکی", tare: 1.28, capacity: 25, zones: ["RECEIVING", "COLD_STORAGE", "SORTING"], status: "فعال" },
    { qr: "CTR-003", type: "سبد پلاستیکی", tare: 1.28, capacity: 25, zones: ["SORTING", "WASHING", "COLD_STORAGE"], status: "فعال" },
  ]
  try {
    value = JSON.parse(
      localStorage.getItem("storemesh.prototype.containers") || JSON.stringify(defaults),
    )
  } catch {
    throw Error("فهرست کانتینرهای مرورگر قابل خواندن نیست.")
  }
  return (Array.isArray(value) ? value : value.items || value.rows || []).map(
    (row: any) => ({
      ...row,
      code: pwCode(row.qr || row.code || row.id),
      capacityKg: Number(row.capacityKg ?? row.capacity ?? 999999),
      zones: row.designatedZones || row.zones || [],
      type: String(row.type || ""),
    }),
  )
}
function pwHealthy(carrier: any) {
  return (
    !carrier.locked &&
    !carrier.singleUse &&
    !/DAMAGED|BROKEN|RETIRED|INACTIVE|SINGLE_USE|خراب|شکسته|غیرفعال|یکبار|یک‌بار/i.test(
      `${carrier.status || ""} ${carrier.type || ""}`,
    )
  )
}
function pwTray(carrier: any) {
  return /TRAY|سینی/i.test(carrier.type)
}
function pwCarrier(code: string, type: "tray" | "basket") {
  const carrier = pwCarriers().find((x: any) => x.code === pwCode(code))
  if (
    !carrier ||
    !pwHealthy(carrier) ||
    (type === "tray" ? !pwTray(carrier) : pwTray(carrier))
  )
    throw Error(
      type === "tray"
        ? "یک سینی سالم موجود در بخش کانتینرها را اسکن کنید."
        : "یک سبد یا کریت سالم موجود در بخش کانتینرها را اسکن کنید.",
    )
  return carrier
}
function pwBusy(ledger: PWLedger, item: PWItem) {
  return !!ledger.cycles.find(
    (c) => PW_ACTIVE.includes(c.status) && c.itemIds.includes(item.id),
  )
}
function pwUsable(
  ledger: PWLedger,
  item: PWItem | undefined,
): asserts item is PWItem {
  if (!item || item.consumed || !(item.weightKg > 0))
    throw Error("بچ ورودی موجود نیست یا قبلاً مصرف شده است.")
  if (item.blocked || /QUARANTINE|QC|WASTE/.test(item.zone))
    throw Error(
      "بچ مسدود است؛ ابتدا وضعیت کیفیت یا مغایرت آن را تعیین تکلیف کنید.",
    )
  if (pwBusy(ledger, item)) throw Error("این بچ در یک چرخه فعال قفل است.")
}
function pwFreeCarrier(ledger: PWLedger, code: string, exceptId = "") {
  if (
    ledger.items.some(
      (item) =>
        item.id !== exceptId &&
        !item.consumed &&
        (item.containerCode === code ||
          item.trays.some((t) => t.code === code)),
    )
  )
    throw Error("این ظرف هنوز به موجودی یا سینی‌های بچ دیگری اختصاص دارد.")
  const receipt = readPrototypeBatch()
  if (
    receipt.baskets.some(
      (b) =>
        pwCode(b.code) === code &&
        !ledger.consumedInputs.includes(`${receipt.id}:${b.code}`),
    )
  )
    throw Error("این ظرف هنوز حاوی موجودی دریافت است.")
}
function recordSortingOutputs(
  batch: any,
  selected: string[],
  outputs: any[],
  lossReason: string,
  entryWeights: Record<string, number> = {},
) {
  const ledger = readProductionLedger()
  if (ledger.storageError) throw Error(ledger.storageError)
  if (
    !selected.length ||
    new Set(selected.map(pwCode)).size !== selected.length
  )
    throw Error("حداقل یک سبد ورودی غیرتکراری لازم است.")
  const signatures = selected.map((code) => `${batch.id}:${code}`)
  if (
    signatures.some((signature) =>
      ledger.consumedInputs.some((key) => pwCode(key) === pwCode(signature)),
    )
  )
    throw Error("یکی از سبدهای ورودی قبلاً سورت شده است.")
  const sources = (batch.baskets || []).filter((x: any) =>
    selected.some((code) => pwCode(code) === pwCode(x.code)),
  )
  if (sources.length !== selected.length)
    throw Error("یکی از سبدهای انتخابی در محموله پیدا نشد.")
  if (new Set(sources.map((source: any) => source.product)).size !== 1)
    throw Error("همه ورودی‌های سورت باید یک محصول باشند.")
  if (
    sources.some((source: any) => {
      const physical = pwCarriers().find(
        (c: any) => c.code === pwCode(source.code),
      )
      return (
        (physical && !pwHealthy(physical)) ||
        /قرنطینه|در راه|خراب|QUARANTINE|BLOCKED|DAMAGED/.test(
          source.status || "",
        ) ||
        /قرنطینه/.test(source.zone || "")
      )
    })
  )
    throw Error("یکی از ورودی‌ها مسدود یا ظرف آن آسیب‌دیده است.")
  if (
    sources.some(
      (source: any) =>
        !pwSortingLocation(source.currentLocation || source.zone),
    )
  )
    throw Error("همه ورودی‌ها باید با اسکن در ایستگاه سورتینگ ثبت شده باشند.")
  const available = pwNumber(
    sources.reduce(
      (sum: number, x: any) =>
        sum +
        (entryWeights[pwCode(x.code)] ?? Number(x.gross) - Number(x.tare || 0)),
      0,
    ),
  )
  const total = pwNumber(outputs.reduce((sum, x) => sum + Number(x.weight), 0)),
    loss = pwNumber(available - total)
  if (
    !(available > 0) ||
    !outputs.length ||
    !Number.isFinite(total) ||
    loss < 0 ||
    outputs.some(
      (x) => !(Number(x.weight) > 0) || !x.grade || !x.size || !x.destination,
    )
  )
    throw Error(
      "گرید، اندازه، وزن و مقصد معتبر همه خروجی‌ها و توازن وزن الزامی است.",
    )
  const carrierOutputs=outputs.filter((x)=>x.destination!=="WASTE")
  if (new Set(carrierOutputs.map((x) => pwCode(x.code))).size !== carrierOutputs.length)
    throw Error("سبد خروجی تکراری است.")
  if (
    loss > 0 &&
    ![
      "WASTE",
      "DAMAGE",
      "MOISTURE_LOSS",
      "RESIDUAL_MATERIAL",
      "MEASUREMENT_VARIANCE",
    ].includes(lossReason)
  )
    throw Error("برای هر مقدار افت، یک علت طبقه‌بندی‌شده انتخاب کنید.")
  outputs.forEach((output) => {
    if(output.destination==="WASTE")return
    const carrier = pwCarrier(output.code, "basket")
    if (selected.some((code) => pwCode(code) === carrier.code))
      throw Error("سبد ورودی نمی‌تواند خروجی همان عملیات باشد.")
    pwFreeCarrier(ledger, carrier.code)
    if (Number(output.weight) > carrier.capacityKg)
      throw Error("وزن خروجی از ظرفیت سبد بیشتر است.")
    const parentContributions = output.parentContributions || []
    if (
      !parentContributions.length ||
      parentContributions.some(
        (row: any) =>
          !(Number(row.inputWeightKg) > 0) ||
          !selected.some((code) => pwCode(code) === pwCode(row.batchId)),
      ) ||
      Math.abs(
        parentContributions.reduce(
          (sum: number, row: any) => sum + Number(row.inputWeightKg),
          0,
        ) - Number(output.weight),
      ) > 0.001
    )
      throw Error("شجره وزنی هر خروجی باید دقیق و برابر وزن آن باشد.")
  })
  const children = outputs.map((output) => {
    const contributed = output.parentContributions.map((row: any) =>
        pwCode(row.batchId),
      ),
      route=pwRouteFor(output.destination),
      sourcePhysical=String(sources[0]?.physicalLocation||sources[0]?.sortingOrigin||"COLD_ROOM_POSITIVE_DIRTY"),
      isWaste=output.destination==="WASTE"
    const code = pwId(ledger, "B"),
      item: PWItem = {
        id: code,
        code,
        parentId: contributed.join(","),
        parentIds: contributed,
        parentContributions: output.parentContributions.map((row: any) => ({
          id: pwCode(row.batchId),
          weightKg: Number(row.inputWeightKg),
        })),
        inputCodes: contributed,
        supplier: batch.supplier,
        suppliers: [batch.supplier],
        supplierContributions: [
          { supplier: batch.supplier, weightKg: pwNumber(output.weight) },
        ],
        product: sources[0].product,
        grade: output.grade,
        size: output.size,
        weightKg: pwNumber(output.weight),
        stage: "SORTED",
        zone: isWaste?"WASTE":sourcePhysical,
        currentLocation:isWaste?"WASTE":sourcePhysical,
        physicalLocation:isWaste?"WASTE":sourcePhysical,
        destination: output.destination,
        operationalDestination:output.destination,
        nextZone: isWaste?null:(route.processes[0]||null),
        nextAction:isWaste?"ثبت پایان دفع":`اسکن ورود به ${PW_ZONES[route.processes[0]]||route.processes[0]}`,
        qualityCheckRequired:!!output.qualityCheckRequired,
        containerCode: isWaste?"":pwCode(output.code),
        trays: [],
        allocated: false,
        consumed: false,
        blocked: false,
      }
    ledger.items.push(item)
    return item
  })
  ledger.consumedInputs.push(...signatures)
  outputs
    .filter((output) => output.designationWarning)
    .forEach((output) =>
      pwEvent(ledger, "هشدار زون تعیین‌شده", pwCode(output.code), {
        zone: "SORTING",
        severity: "WARNING",
      }),
    )
  sources.forEach((source: any) => {
    const code = pwCode(source.code),
      previous = pwNumber(Number(source.gross) - Number(source.tare || 0))
    if (entryWeights[code] !== undefined)
      pwEvent(ledger, "توزین ورود فرایند", code, {
        transition: "SORTING_ENTRY",
        previousWeightKg: previous,
        weightKg: entryWeights[code],
        deltaKg: pwNumber(entryWeights[code] - previous),
      })
    else
      pwEvent(ledger, "ورود فرایند بدون توزین", code, {
        transition: "SORTING_ENTRY",
        previousWeightKg: previous,
      })
  })
  pwEvent(ledger, "ثبت سورتینگ", String(batch.id), {
    inputCodes: selected,
    children: children.map((x) => ({
      code: x.code,
      destination: x.destination,
      parents: x.parentContributions,
    })),
    inputWeightKg: available,
    outputWeightKg: total,
    lossKg: loss,
    lossReason: loss > 0 ? lossReason : null,
  })
  ledger.sortingSessions = (ledger.sortingSessions || []).map((session: any) =>
    session.receiptId === batch.id && session.status === "IN_PROGRESS"
      ? { ...session, status: "COMPLETED", completedAt: new Date().toISOString() }
      : session,
  )
  saveProductionLedger(ledger)
  return children
}
const pwBox = {
  background: "white",
  border: "1px solid #dce9e7",
  borderRadius: 16,
  padding: 20,
}
const pwInput = {
  width: "100%",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#163f3b",
  background: "white",
}
function PWButton({ children, secondary, ...props }: any) {
  return (
    <button
      {...props}
      style={{
        padding: "10px 15px",
        borderRadius: 9,
        border: secondary ? "1px solid #bdd5d1" : "none",
        color: secondary ? "#15685e" : "white",
        background: props.disabled
          ? "#b5c4c1"
          : secondary
            ? "white"
            : "#0d8071",
        cursor: props.disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  )
}
function PWField({ label, children }: any) {
  return (
    <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
      <span style={{ fontSize: 13, color: "#42645f" }}>{label}</span>
      {children}
    </label>
  )
}
function PWNotice({ children }: any) {
  return (
    <div
      style={{
        background: "#eff8f5",
        color: "#315f54",
        border: "1px solid #c8e1d7",
        padding: 12,
        borderRadius: 10,
        fontSize: 13,
        lineHeight: 1.9,
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  )
}
function PWEmpty({ children }: any) {
  return (
    <div
      style={{
        padding: 28,
        background: "#f8faf9",
        border: "1px dashed #cbd9d6",
        borderRadius: 12,
        color: "#60746f",
        textAlign: "center",
      }}
    >
      {children || "هنوز موردی ثبت نشده است."}
    </div>
  )
}
function WashingScaleConsole({mode,code,net,previousNet,tare,onRead}:{mode:"ENTRY"|"EXIT";code?:string;net:number;previousNet:number;tare:number;onRead:()=>void}) {
  const n=(value:number)=>Number.isFinite(value)?value.toFixed(3):"0.000"
  const gross=pwNumber(net+tare)
  return <section aria-label={`کنسول باسکول ${mode==="ENTRY"?"ورود":"خروج"} شست‌وشو`} style={{background:"#06291f",border:"1px solid #1b5a46",borderRadius:18,padding:16,color:"white",boxShadow:"0 12px 28px #173f3524"}}>
    <div style={{display:"grid",gridTemplateColumns:"1.05fr 1.45fr 1.15fr 1fr",gap:12}} dir="rtl">
      <div style={{border:"1px solid #1b5a46",borderRadius:13,padding:13,background:"#041d16"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><b style={{color:"#c9f7e4"}}>● باسکول رومیزی ۱</b><span style={{color:"#62e5ad",fontFamily:"monospace"}}>10 Hz</span></div><div style={{marginTop:12,padding:9,borderRadius:9,background:"#0b382a",fontSize:10}}><div style={{display:"flex",justifyContent:"space-between"}}><span>لودسل آنلاین</span><b style={{color:"#62e5ad"}}>RS485</b></div><div style={{display:"flex",justifyContent:"space-between",marginTop:8,color:"#91b9aa"}}><span>قرائت پایدار</span><b>± 0.002 kg</b></div></div><div style={{marginTop:10,padding:8,border:"1px solid #1b5a46",borderRadius:8,textAlign:"center",fontSize:10,color:"#62e5ad"}}>✓ ثبات سیگنال حسگر تأیید شد</div>{code&&<div style={{marginTop:10,padding:8,borderRadius:8,background:"#03160f",textAlign:"center"}}><small style={{display:"block",color:"#91b9aa"}}>سریال سبد جاری</small><b style={{fontFamily:"monospace",fontSize:20,color:"#62e5ad"}}>{code}</b></div>}</div>
      <div style={{border:"1px solid #1b5a46",borderRadius:13,padding:15,background:"#041d16"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#c9f7e4"}}><b>{mode==="ENTRY"?"وزن خالص جدید":"وزن خالص خروجی"}</b><span style={{fontFamily:"monospace",color:"#62e5ad"}}>SENS: HIGH</span></div><div style={{display:"flex",justifyContent:"center",alignItems:"baseline",gap:8,margin:"18px 0"}} dir="ltr"><strong style={{fontFamily:"monospace",fontSize:40,letterSpacing:4}}>{n(net)}</strong><span style={{background:"#0b382a",padding:"4px 8px",borderRadius:6,fontSize:10,color:"#62e5ad"}}>kg</span></div><div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #ffffff18",paddingTop:8,fontSize:10}}><span>وزن ظرف (Tare)</span><b style={{color:"#62e5ad",fontFamily:"monospace"}}>{n(tare)} kg</b></div></div>
      <div style={{border:"1px solid #1b5a46",borderRadius:13,padding:15,background:"#041d16"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#c9f7e4"}}><b>{mode==="ENTRY"?"وزن خالص قبلی":"وزن ناخالص"}</b><span style={{fontFamily:"monospace",color:"#62e5ad"}}>GROSS</span></div><div style={{display:"flex",justifyContent:"center",alignItems:"baseline",gap:8,margin:"18px 0"}} dir="ltr"><strong style={{fontFamily:"monospace",fontSize:36,letterSpacing:3}}>{n(mode==="ENTRY"?previousNet:gross)}</strong><span style={{background:"#0b382a",padding:"4px 8px",borderRadius:6,fontSize:10,color:"#62e5ad"}}>kg</span></div><div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #ffffff18",paddingTop:8,fontSize:10}}><span>{mode==="ENTRY"?"اختلاف":"وضعیت"}</span><b style={{color:"#62e5ad",fontFamily:"monospace"}}>{mode==="ENTRY"?`${n(net-previousNet)} kg`:"READY"}</b></div></div>
      <div style={{border:"1px solid #1b5a46",borderRadius:13,padding:13,background:"#0a3326",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:9}}>{mode==="ENTRY"?<button type="button" onClick={onRead} style={{border:"1px solid #2b765b",background:"#14513d",color:"white",borderRadius:11,padding:12,fontWeight:800,cursor:"pointer"}}>↻ ثبت وزن جدید</button>:<div style={{border:"1px solid #2b765b",background:"#041d16",color:"#62e5ad",borderRadius:11,padding:12,fontWeight:800,textAlign:"center",fontSize:11}}>● وزن آنلاین پس از اسکن سبد</div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><button type="button" style={{border:"1px solid #1b5a46",background:"#041d16",color:"white",borderRadius:8,padding:8}}>صفر (Zero)</button><button type="button" style={{border:"1px solid #1b5a46",background:"#041d16",color:"white",borderRadius:8,padding:8}}>تار (Tare)</button></div><div style={{border:"1px solid #1b5a46",background:"#041d16",borderRadius:8,padding:8,fontSize:10}}><span style={{color:"#91b9aa"}}>پورت اتصال: </span><b style={{fontFamily:"monospace",color:"#62e5ad"}}>COM 4</b></div></div>
    </div>
  </section>
}
function WashingSessionScreen({
  ledger,
  onChange,
  initialMode = "ENTRY",
}: {
  ledger: PWLedger
  onChange: (next: PWLedger, message: string) => void
  initialMode?: "ENTRY" | "EXIT"
}) {
  const mode = initialMode,
    [scan, setScan] = useState(""),
    [entryWeight, setEntryWeight] = useState(""),
    [outputCode, setOutputCode] = useState(""),
    [outputWeight, setOutputWeight] = useState(""),
    [qualityCheckRequired,setQualityCheckRequired]=useState(false),
    [lossReason, setLossReason] = useState(""),
    [empty, setEmpty] = useState(false),
    [inputScanOpen, setInputScanOpen] = useState(false),
    [outputScanOpen, setOutputScanOpen] = useState(false),
    [error, setError] = useState("")
  const active = ledger.washSessions.find(
      (session) => session.status === "ACTIVE",
    ),
    sources = (active?.inputIds || [])
      .map((id: string) => ledger.items.find((item) => item.id === id))
      .filter(Boolean) as PWItem[]
  const eligible = ledger.items.filter(
    (item) =>
      !item.consumed &&
      !item.blocked &&
      item.stage === "SORTED" &&
      (item.zone === "WASHING" || item.nextZone === "WASHING") &&
      !active?.inputIds.includes(item.id),
  )
  const inputTotal = pwNumber(
      sources.reduce((sum, item) => sum + item.weightKg, 0),
    ),
    outputTotal = pwNumber(
      (active?.outputs || []).reduce(
        (sum: number, row: any) => sum + row.weightKg,
        0,
      ),
    ),
    loss = pwNumber(inputTotal - outputTotal)
  const addInput = (rawCode = scan) => {
    setError("")
    try {
      const next = readProductionLedger(),
        item = next.items.find(
          (row) => row.containerCode === pwCode(rawCode) && !row.consumed,
        )
      pwUsable(next, item)
      if (
        item.stage !== "SORTED" ||
        (item.zone !== "WASHING" && item.nextZone !== "WASHING")
      )
        throw Error("سبد اسکن‌شده برای ورود به شست‌وشو واجد شرایط نیست.")
      let session = next.washSessions.find((row) => row.status === "ACTIVE")
      pwAssertWashCompatibility(session,item)
      if (session?.inputIds.includes(item.id))
        throw Error("این سبد قبلاً در نشست فعال ثبت شده است.")
      if (!session) {
        session = {
          id: pwId(next, "WS"),
          status: "ACTIVE",
          grade: item.grade,
          size: item.size,
          inputIds: [],
          outputs: [],
          startedAt: new Date().toISOString(),
        }
        next.washSessions.push(session)
      }
      pwTransitionWeight(
        next,
        item,
        "WASHING_ENTRY",
        entryWeight === "" ? undefined : Number(entryWeight),
      )
      const entryLocation = item.zone
      item.zone = "WASHING"
      item.currentLocation = "WASHING"
      item.currentState = "IN_PROCESS"
      item.nextAction = "انجام عملیات شست‌وشو"
      session.inputIds.push(item.id)
      pwEvent(next, "اسکن ورودی شست‌وشو", session.id, {
        itemId: item.id,
        containerCode: item.containerCode,
        grade: item.grade,
        size: item.size,
        from: entryLocation,
        to: "WASHING",
      })
      saveProductionLedger(next)
      setScan("")
      setEntryWeight("")
      onChange(next, "سبد به نشست فعال شست‌وشو افزوده شد.")
    } catch (failure: any) {
      setError(failure.message)
    }
  }
  const removeInput = (itemId:string) => {
    try {
      const next=readProductionLedger(),session=next.washSessions.find(row=>row.status==="ACTIVE")
      if(!session||session.outputs.length)throw Error("پس از ثبت اولین خروجی، حذف ورودی نشست مجاز نیست.")
      const item=next.items.find(row=>row.id===itemId)
      session.inputIds=session.inputIds.filter((id:string)=>id!==itemId)
      if(item){item.zone=item.physicalLocation||"COLD_ROOM_POSITIVE_DIRTY";item.currentLocation=item.zone;item.currentState="READY";item.nextAction="اسکن ورود به شست‌وشو"}
      if(!session.inputIds.length)next.washSessions=next.washSessions.filter(row=>row.id!==session.id)
      saveProductionLedger(next);onChange(next,"سبد از نشست شست‌وشو خارج شد.");setError("")
    }catch(failure:any){setError(failure.message)}
  }
  const addOutput = () => {
    setError("")
    try {
      const next = readProductionLedger(),
        session = next.washSessions.find((row) => row.status === "ACTIVE")
      if (!session || !session.inputIds.length)
        throw Error("ابتدا حداقل یک سبد ورودی اسکن کنید.")
      const carrier = pwCarrier(outputCode, "basket")
      pwFreeCarrier(next, carrier.code)
      if (
        session.inputIds.some(
          (id: string) =>
            next.items.find((item) => item.id === id)?.containerCode ===
            carrier.code,
        )
      )
        throw Error("سبد خروجی باید با سبدهای ورودی متفاوت و خالی باشد.")
      const weight = pwNumber(outputWeight)
      if (!(weight > 0) || weight > carrier.capacityKg)
        throw Error("وزن خروجی باید مثبت و در محدوده ظرفیت سبد باشد.")
      const available = pwNumber(
        session.inputIds.reduce(
          (sum: number, id: string) =>
            sum + (next.items.find((item) => item.id === id)?.weightKg || 0),
          0,
        ),
      )
      const registered = pwNumber(
        session.outputs.reduce(
          (sum: number, row: any) => sum + row.weightKg,
          0,
        ),
      )
      if (registered + weight > available)
        throw Error("مجموع وزن خروجی از وزن ورودی نشست بیشتر است.")
      if (
        session.outputs.some((row: any) => row.containerCode === carrier.code)
      )
        throw Error("این سبد خروجی قبلاً ثبت شده است.")
      session.outputs.push({
        containerCode: carrier.code,
        weightKg: weight,
        qualityCheckRequired,
        at: new Date().toISOString(),
      })
      pwEvent(next, "ثبت سبد خروجی شست‌وشو", session.id, {
        containerCode: carrier.code,
        weightKg: weight,
      })
      saveProductionLedger(next)
      setOutputCode("")
      setOutputWeight("")
      setQualityCheckRequired(false)
      onChange(next, "سبد خروجی ثبت شد؛ برای باقی محصول ادامه دهید.")
    } catch (failure: any) {
      setError(failure.message)
    }
  }
  const complete = () => {
    setError("")
    try {
      const next = readProductionLedger(),
        session = next.washSessions.find((row) => row.status === "ACTIVE")
      if (!session || !session.outputs.length)
        throw Error("حداقل یک سبد خروجی وزن‌شده لازم است.")
      if (!empty) throw Error("خالی بودن کامل واحد شست‌وشو را تأیید کنید.")
      const parents = session.inputIds
          .map((id: string) => next.items.find((item) => item.id === id))
          .filter(Boolean) as PWItem[],
        available = pwNumber(
          parents.reduce((sum, item) => sum + item.weightKg, 0),
        ),
        total = pwNumber(
          session.outputs.reduce(
            (sum: number, row: any) => sum + row.weightKg,
            0,
          ),
        ),
        difference = pwNumber(available - total)
      if (difference < 0) throw Error("وزن خروجی از ورودی بیشتر است.")
      if (difference > 0 && !lossReason.trim())
        throw Error("برای اختلاف وزن نشست، علت ثبت کنید.")
      const destination = parents[0]?.destination || "DRYING",route=pwRouteFor(destination),physicalAfterWashing=route.physicalAfterWashing||"COLD_ROOM_POSITIVE_CLEAN",nextProcess=route.processes[1]||"PACKAGING"
      const children = session.outputs.map((row: any) => {
        const id = pwId(next, "B"),
          contributions = parents.map((parent) => ({
            id: parent.id,
            weightKg: pwNumber(row.weightKg * (parent.weightKg / available)),
          }))
        const child: PWItem = {
          id,
          code: id,
          parentId: parents.map((parent) => parent.id).join(","),
          parentIds: parents.map((parent) => parent.id),
          parentContributions: contributions,
          inputCodes: parents.map((parent) => parent.containerCode),
          product: parents[0].product,
          grade: session.grade,
          size: session.size,
          weightKg: row.weightKg,
          stage: "WASHED",
          zone: physicalAfterWashing,
          currentLocation:physicalAfterWashing,
          physicalLocation:physicalAfterWashing,
          destination,
          operationalDestination:destination,
          nextZone: nextProcess,
          nextProcess,
          nextAction:`اسکن ورود به ${PW_ZONES[nextProcess]||nextProcess}`,
          qualityCheckRequired:!!row.qualityCheckRequired,
          containerCode: row.containerCode,
          trays: [],
          allocated: false,
          consumed: false,
          blocked: false,
        }
        next.items.push(child)
        return child
      })
      parents.forEach((parent) => {
        parent.consumed = true
        parent.stage = "CONSUMED"
        parent.containerCode = ""
        parent.weightKg = 0
      })
      session.status = "COMPLETED"
      session.completedAt = new Date().toISOString()
      session.childIds = children.map((child: PWItem) => child.id)
      session.unitEmpty = true
      pwEvent(next, "تکمیل نشست شست‌وشو", session.id, {
        parents: session.inputIds,
        children: children.map((child: PWItem) => ({
          id: child.id,
          containerCode: child.containerCode,
        })),
        inputWeightKg: available,
        outputWeightKg: total,
        deltaKg: pwNumber(total - available),
        lossReason: lossReason || null,
        unitEmpty: true,
      })
      saveProductionLedger(next)
      setEmpty(false)
      setLossReason("")
      onChange(
        next,
        "نشست شست‌وشو تکمیل شد؛ خروجی‌ها به محل فیزیکی مناسب می‌روند و سپس فرایند بعدی آغاز می‌شود.",
      )
    } catch (failure: any) {
      setError(failure.message)
    }
  }
  const scanned = ledger.items.find(
    (item) => item.containerCode === pwCode(scan),
  )
  const entryCandidate = scanned || eligible[0]
  const outputCarrier = (()=>{try{return outputCode?pwCarrier(outputCode,"basket"):null}catch{return null}})()
  const outputTare = Number(outputCarrier?.tareWeightKg || 0)
  const washDestination=sources[0]?.destination||"DRYING",washRoute=pwRouteFor(washDestination),washNextProcess=washRoute.processes[1]||"PACKAGING"
  const scanWashingOutput=(rawCode:string)=>{try{const carrier=pwCarrier(rawCode,"basket");pwFreeCarrier(ledger,carrier.code);const measured=Math.min(18.5,Math.max(0,inputTotal-outputTotal));setOutputCode(carrier.code);setOutputWeight(measured.toFixed(3));setError("")}catch(failure:any){setError(failure.message)}}
  return <div style={{display:"grid",gap:18}}>
    <div><h2 style={{margin:0}}>{mode==="ENTRY"?"ورود به شست‌وشو":"خروج از شست‌وشو"}</h2><p style={{margin:"5px 0 0",fontSize:12,color:"#718079"}}>{mode==="ENTRY"?"سبدهای هم‌گرید و هم‌اندازه را اسکن کنید و وزن تازه را فقط از باسکول ثبت کنید.":"سبدهای تازه خروجی را تک‌به‌تک اسکن کنید؛ وزن پایدار همان لحظه به‌صورت آنلاین از باسکول خوانده می‌شود."}</p></div>
    <WashingScaleConsole mode={mode} code={mode==="ENTRY"?entryCandidate?.containerCode:outputCode} net={mode==="ENTRY"?Number(entryWeight||entryCandidate?.weightKg||0):Number(outputWeight||0)} previousNet={mode==="ENTRY"?Number(entryCandidate?.weightKg||0):0} tare={mode==="ENTRY"?0:outputTare} onRead={()=>{if(mode==="ENTRY"){if(!entryCandidate)return setError("ابتدا سبد ورودی را اسکن کنید.");setEntryWeight(Number(entryCandidate.weightKg).toFixed(3));setError("")}}}/>
    {error&&<div role="alert" style={{background:"#fff0f0",color:"#9f2323",padding:12,borderRadius:9}}>{error}</div>}
    {mode==="ENTRY"?<div style={pwBox}>
      <h3 style={{marginTop:0}}>اسکن سبدهای ورودی شست‌وشو</h3>
      <PWNotice>چند سبد هم‌گرید و هم‌اندازه وارد یک نشست می‌شوند. تا خالی‌شدن کامل واحد، گرید یا اندازه متفاوت پذیرفته نمی‌شود.</PWNotice>
      <div style={{display:"flex",gap:8,marginTop:14}}><input aria-label="اسکن QR ورود شست‌وشو" value={scan} onChange={event=>setScan(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();addInput()}}} style={{...pwInput,flex:1,fontFamily:"monospace"}} placeholder="اسکن QR سبد ورودی یا ورود دستی"/><PWButton disabled={!scan.trim()} onClick={()=>addInput()}>افزودن سبد</PWButton><PWButton secondary onClick={()=>setInputScanOpen(true)}>⌗ شبیه‌ساز اسکن</PWButton></div>
      <ScanSimulator open={inputScanOpen} title="اسکن سبد ورودی شست‌وشو" suggestedCode={eligible[0]?.containerCode||""} onClose={()=>setInputScanOpen(false)} onScan={addInput}/>
      <div style={{border:"1px solid #d8e4df",borderRadius:12,overflow:"hidden",marginTop:16,background:"white"}}>{sources.length?sources.map(item=><div key={item.id} style={{display:"grid",gridTemplateColumns:"1.05fr 1.15fr 1.2fr 1.1fr .45fr",gap:12,padding:"12px 16px",borderBottom:"1px solid #e6eeea",fontSize:12,alignItems:"center"}}><b style={{fontFamily:"monospace",fontSize:13}}>{item.containerCode}</b><span style={{border:"1px solid #cde3da",background:"#edf7f3",borderRadius:9,padding:"6px 9px",textAlign:"center"}}><small style={{display:"block",color:"#718079"}}>مقصد بعدی</small><b>{PW_ZONES[item.nextZone||washNextProcess]||item.nextZone||washNextProcess}</b></span><span style={{border:"1px solid #72d9ad",background:"#ebfff6",color:"#176b50",borderRadius:12,padding:"6px 9px",fontWeight:800,textAlign:"center"}}>✓ وزن جدید ثبت شد</span><span style={{color:"#718079"}}>آخرین وزن: <b style={{fontFamily:"monospace",color:"#18302a",background:"#f1f3f2",padding:"4px 7px",borderRadius:5}}>{item.weightKg.toFixed(3)} kg</b></span><button type="button" onClick={()=>removeInput(item.id)} style={{border:0,background:"transparent",color:"#c23d3d",cursor:"pointer"}}>حذف</button></div>):<PWEmpty>هنوز سبدی وارد نشست نشده است.</PWEmpty>}</div>
      <div style={{marginTop:14,background:"#eaf6f0",padding:13,borderRadius:10,fontSize:12,display:"flex",justifyContent:"space-between"}}><span>{sources.length} سبد آماده شست‌وشو</span><b>مجموع {inputTotal.toFixed(3)} kg</b></div>
      {active&&<><div style={{marginTop:12,background:"#fff8e3",padding:12,borderRadius:9,fontSize:12}}>نشست {active.id} · قفل سازگاری: <b>{active.grade} / {active.size}</b></div><PWNotice>ورودی‌ها ذخیره شده‌اند و پس از خاموش و روشن شدن سیستم نیز نشست {active.id} فعال می‌ماند. ثبت محصول شسته‌شده از صفحه مستقل «خروج از شست‌وشو» انجام می‌شود.</PWNotice></>}
    </div>:<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
      <div style={pwBox}><h3 style={{marginTop:0}}>اسکن و ثبت سبدهای تازه خروجی</h3>{!active?<PWEmpty>هیچ نشست فعال شست‌وشویی برای ثبت خروج وجود ندارد.</PWEmpty>:<><div style={{display:"flex",gap:8}}><input aria-label="اسکن سبد خالی خروجی شست‌وشو" value={outputCode} onChange={event=>setOutputCode(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();scanWashingOutput(outputCode)}}} style={{...pwInput,flex:1,fontFamily:"monospace"}} placeholder="اسکن QR سبد خالی"/><PWButton secondary onClick={()=>setOutputScanOpen(true)}>⌗ شبیه‌ساز اسکن</PWButton></div><p style={{fontSize:11,color:"#718079"}}>با اسکن سبد روی باسکول، وزن پایدار همان لحظه به‌صورت آنلاین ثبت می‌شود.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}><label style={{fontSize:11,color:"#718079"}}>مقصد بعدی<input readOnly value={PW_ZONES[washNextProcess]||washNextProcess} style={{...pwInput,marginTop:5,background:"#f7f9f8"}}/></label><label style={{fontSize:11,color:"#718079"}}>مقصد نهایی<input readOnly value={PW_ZONES[washDestination]||washDestination} style={{...pwInput,marginTop:5,background:"#f7f9f8"}}/></label></div><label style={{display:"flex",gap:8,alignItems:"center",fontSize:12,margin:"12px 0",padding:10,border:"1px solid #d5e3dd",borderRadius:9}}><input type="checkbox" checked={qualityCheckRequired} onChange={event=>setQualityCheckRequired(event.target.checked)}/><span><b>نیازمند کنترل کیفیت در خروج شست‌وشو</b><small style={{display:"block",color:"#718079"}}>تا تصمیم مدیر، اقدام بعدی این سبد متوقف می‌شود.</small></span></label><PWButton disabled={!outputCode||!outputWeight} onClick={addOutput}>ثبت این خروجی و ادامه</PWButton><ScanSimulator open={outputScanOpen} title="اسکن سبد خروجی شست‌وشو" suggestedCode={outputCode||"CTR-003"} onClose={()=>setOutputScanOpen(false)} onScan={scanWashingOutput}/><div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden",marginTop:16}}><div style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1.5fr",background:"#eef4f1",padding:9,fontSize:11,fontWeight:800}}><span>#</span><span>کد سبد</span><span>وزن خالص</span><span>مسیر</span></div>{active.outputs.map((row:any,index:number)=><div key={row.containerCode} style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1.5fr",padding:10,borderTop:"1px solid #e1eae6",fontSize:12}}><span>{index+1}</span><b style={{fontFamily:"monospace"}}>{row.containerCode}</b><b>{row.weightKg.toFixed(3)} kg</b><span>{PW_ZONES[washNextProcess]||washNextProcess} ← {PW_ZONES[washDestination]||washDestination}</span></div>)}</div></>}</div>
      <div style={pwBox}><h3 style={{marginTop:0}}>تراز وزن نشست</h3><div style={{display:"grid",gap:12,fontSize:13}}><div style={{display:"flex",justifyContent:"space-between"}}><span>ورودی</span><b>{inputTotal.toFixed(3)} kg</b></div><div style={{display:"flex",justifyContent:"space-between"}}><span>خروجی</span><b>{outputTotal.toFixed(3)} kg</b></div><div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid #e1eae6"}}><span>مانده / افت</span><b>{loss.toFixed(3)} kg</b></div></div><PWField label="علت افت یا مانده (در صورت اختلاف)"><input value={lossReason} onChange={event=>setLossReason(event.target.value)} style={pwInput}/></PWField><label style={{display:"flex",gap:8,fontSize:12,margin:"12px 0"}}><input type="checkbox" checked={empty} onChange={event=>setEmpty(event.target.checked)}/>تمام محصول ثبت شده و واحد شست‌وشو کاملاً خالی است.</label><PWButton disabled={!active?.outputs.length||!empty||loss<0||(loss>0&&!lossReason.trim())} onClick={complete}>تکمیل شست‌وشو و ساخت مسیرها</PWButton></div>
    </div>}
  </div>
}
function ProductionScreen(props: any) {
  const [tab, setTab] = useState("overview"),
    [ledger, setLedger] = useState<PWLedger>(() => readProductionLedger()),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [chosen, setChosen] = useState("")
  const tabs = [
    ["overview", "صف کار و مسیر"],
    ["sorting-entry", "ورود به سورتینگ"],
    ["sorting-exit", "خروج از سورتینگ"],
    ["wash-entry", "ورود به شست‌وشو"],
    ["wash-exit", "خروج از شست‌وشو"],
    ["slice", "ثبت اسلایس"],
    ["FREEZE", "خروج فریز و بسته‌بندی"],
    ["DRY", "خروج خشک‌کن و بسته‌بندی"],
    ["FREEZE_DRY_ENTRY", "ورود به فریزدرای"],
    ["FREEZE_DRY_EXIT", "خروج فریزدرای و بسته‌بندی"],
    ["results", "نتایج و رویدادها"],
  ]
  const allItems = ledger.items.filter((x) => !x.demo),
    live = allItems.filter((x) => !x.consumed),
    current = live.find((x) => x.id === chosen)
  const execute = (message: string, work: (next: PWLedger) => void) => {
    setError("")
    setNotice("")
    try {
      const next = readProductionLedger()
      if (next.storageError) throw Error(next.storageError)
      work(next)
      saveProductionLedger(next)
      setLedger(next)
      setNotice(message)
    } catch (failure: any) {
      setError(failure.message || "ثبت عملیات انجام نشد.")
    }
  }
  const form = (event: any) => {
    event.preventDefault()
    return new FormData(event.currentTarget)
  }
  const switchTab = (value: string) => {
    setTab(value)
    setChosen("")
    setError("")
    setNotice("")
    setLedger(readProductionLedger())
  }
  const batchPicker = (items: PWItem[]) => (
    <PWField label="بچ ورودی">
      <select
        required
        value={chosen}
        onChange={(e) => setChosen(e.target.value)}
        style={pwInput}
      >
        <option value="">انتخاب بچ…</option>
        {items.map((x) => (
          <option key={x.id} value={x.id}>
            {x.code} · {x.product} · {x.grade}/{x.size} · {x.weightKg} kg
          </option>
        ))}
      </select>
    </PWField>
  )
  const summary = (item: PWItem) => (
    <PWNotice>
      {item.code} · {PW_STAGES[item.stage] || item.stage} · وزن رسمی{" "}
      {item.weightKg} kg · ظرف {item.containerCode || "تخصیص به سینی"} · محل
      فعلی {PW_ZONES[item.zone] || item.zone}
      {pwBusy(ledger, item) ? " · قفل چرخه" : ""}
    </PWNotice>
  )
  const processBatch = (event: any, process: "WASH" | "SLICE") => {
    const data = form(event)
    execute(
      process === "WASH"
        ? "شست‌وشو ثبت شد؛ اکنون انتقال به اسلایس را ثبت کنید."
        : "اسلایس ثبت شد؛ مرحله بعد از روی مقصد نهایی تعیین شد.",
      (next) => {
        const item = next.items.find((x) => x.id === chosen)
        pwUsable(next, item)
        const required = process === "WASH" ? "SORTED" : "WASHED",
          zone = process === "WASH" ? "WASHING" : "SLICING"
        if (
          item.stage !== required ||
          (item.zone !== zone && item.nextZone !== zone)
        )
          throw Error(
            `بچ باید ${PW_STAGES[required]} باشد و مسیر بعدی آن ${PW_ZONES[zone]} ثبت شده باشد.`,
          )
        if (
          pwCode(data.get("scan")) !== item.containerCode ||
          !item.containerCode
        )
          throw Error("QR اسکن‌شده با سبد همین بچ تطبیق ندارد.")
        pwCarrier(item.containerCode, "basket")
        const entryLocation = item.zone
        item.zone = zone
        item.currentLocation = zone
        item.currentState = "IN_PROCESS"
        item.nextAction = `انجام عملیات ${PW_ZONES[zone]}`
        pwEvent(next, `اسکن ورود ${PW_ZONES[zone]}`, item.code, {
          from: entryLocation,
          to: zone,
          containerCode: item.containerCode,
        })
        const observed = String(data.get("observed") || "").trim()
        if (
          observed &&
          (!Number.isFinite(Number(observed)) || !(Number(observed) > 0))
        )
          throw Error("خوانش اطلاعاتی وزن باید مثبت باشد.")
        pwTransitionWeight(
          next,
          item,
          process === "WASH" ? "WASHING_EXIT" : "SLICING_EXIT",
          observed ? Number(observed) : undefined,
        )
        item.stage = process === "WASH" ? "WASHED" : "SLICED"
        const route=pwRouteFor(item.destination||"")
        if(process==="WASH"){
          item.physicalLocation=route.physicalAfterWashing||"COLD_ROOM_POSITIVE_CLEAN"
          item.zone=item.physicalLocation
          item.currentLocation=item.physicalLocation
          item.nextProcess=route.processes[1]||"PACKAGING"
          item.nextZone=item.nextProcess
        }else{
          const nextProcess=route.processes[route.processes.indexOf("SLICING")+1]||"PACKAGING"
          if(nextProcess==="FREEZING") item.physicalLocation="COLD_ROOM_NEGATIVE"
          item.zone=item.physicalLocation||"COLD_ROOM_POSITIVE_CLEAN"
          item.currentLocation=item.zone
          item.nextZone=nextProcess
          item.nextProcess=null
        }
        item.qualityCheckRequired=data.get("qualityCheckRequired")==="on"
        item.nextAction=item.qualityCheckRequired?"در انتظار تصمیم مدیر کنترل کیفیت":`اسکن ورود به ${PW_ZONES[item.nextZone]||item.nextZone}`
        pwEvent(
          next,
          process === "WASH" ? "ثبت شست‌وشو" : "ثبت اسلایس",
          item.code,
          { nextZone: item.nextZone },
        )
      },
    )
  }
  const allocate = (event: any) => {
    const data = form(event)
    execute("تخصیص سینی ثبت شد.", (next) => {
      const item = next.items.find((x) => x.id === chosen)
      pwUsable(next, item)
      if (item.stage !== "SLICED" || item.allocated)
        throw Error("یک بچ اسلایس‌شده با تخصیص باز انتخاب کنید.")
      const tray = pwCarrier(String(data.get("scan")), "tray"),
        sequence = Number(data.get("sequence")),
        raw = String(data.get("quantity") || ""),
        quantityKg = raw === "" ? null : Number(raw)
      pwFreeCarrier(next, tray.code, item.id)
      if (
        !Number.isInteger(sequence) ||
        sequence < 1 ||
        (quantityKg !== null &&
          (!Number.isFinite(quantityKg) || quantityKg <= 0))
      )
        throw Error("ترتیب مثبت و مقدار معتبر وارد کنید.")
      if (
        item.trays.some((t) => t.code === tray.code || t.sequence === sequence)
      )
        throw Error("کد یا ترتیب سینی تکراری است.")
      if (quantityKg !== null && quantityKg > tray.capacityKg)
        throw Error("مقدار از ظرفیت سینی بیشتر است.")
      const allocated = pwNumber(
        item.trays.reduce((sum, t) => sum + Number(t.quantityKg || 0), 0) +
          Number(quantityKg || 0),
      )
      if (allocated > item.weightKg)
        throw Error("مجموع مقدار تخصیص‌یافته از وزن بچ بیشتر است.")
      item.trays.push({ code: tray.code, quantityKg, sequence })
      pwEvent(next, "تخصیص سینی", item.code, {
        tray: tray.code,
        quantityKg,
        sequence,
      })
    })
  }
  const finishAllocation = () =>
    execute(
      "تخصیص نهایی شد و سبد مبدا آزاد شد؛ بچ برای ساخت چرخه فریز آماده است.",
      (next) => {
        const item = next.items.find((x) => x.id === chosen)
        pwUsable(next, item)
        if (item.stage !== "SLICED" || !item.trays.length || item.allocated)
          throw Error("تخصیص سینی باز و معتبر لازم است.")
        if (
          item.trays.every((t) => t.quantityKg !== null) &&
          pwNumber(item.trays.reduce((sum, t) => sum + t.quantityKg, 0)) !==
            item.weightKg
        )
          throw Error("مجموع وزن سینی‌ها باید با کل وزن بچ برابر باشد.")
        const released = item.containerCode
        item.containerCode = ""
        item.allocated = true
        pwEvent(next, "تأیید پایان تخصیص", item.code, {
          releasedContainer: released,
          trays: item.trays.map((t) => t.code),
        })
      },
    )
  const createCycle = (event: any, type: string) => {
    const data = form(event)
    execute(
      "چرخه آماده ایجاد شد؛ بچ‌ها تا پایان یا لغو چرخه قفل هستند.",
      (next) => {
        const machineId = String(data.get("machine"))
        if (!(next.machines[type] || []).includes(machineId))
          throw Error("تجهیز انتخاب‌شده برای این فرآیند فعال نیست.")
        if (
          next.cycles.some(
            (c) => c.machineId === machineId && PW_ACTIVE.includes(c.status),
          )
        )
          throw Error("این ماشین در یک چرخه فعال مشغول است.")
        const ids = data.getAll("items").map(String),
          items = ids.map((id) => next.items.find((x) => x.id === id))
        if (!items.length) throw Error("حداقل یک بچ انتخاب کنید.")
        const scans = String(data.get("trays") || "")
          .split(/[\s,،]+/)
          .filter(Boolean)
          .map(pwCode)
        const expectedStage =
            type === "FREEZE"
              ? "SLICED"
              : type === "FREEZE_DRY"
                ? "FROZEN"
                : "SLICED",
          expectedZone =
            type === "FREEZE"
              ? "FREEZING"
              : type === "FREEZE_DRY"
                ? "FREEZE_DRYING"
                : "DRYING"
        items.forEach((item) => {
          pwUsable(next, item)
          if (
            item.stage !== expectedStage ||
            (item.zone !== expectedZone && item.nextZone !== expectedZone)
          )
            throw Error(
              "مرحله یا محل فعلی یکی از بچ‌ها برای این چرخه مناسب نیست.",
            )
        })
        if (items.some((item) => !!item!.demo !== !!items[0]!.demo))
          throw Error("بچ آزمایشی و داده شما نباید در یک چرخه ترکیب شوند.")
        items.forEach((item) => {
          const before = item!.zone
          item!.zone = expectedZone
          item!.currentLocation = expectedZone
          item!.currentState = "IN_PROCESS"
          item!.nextAction = `انجام عملیات ${PW_ZONES[expectedZone]}`
          pwEvent(next, `ورود به ${PW_ZONES[expectedZone]}`, item!.code, {
            from: before,
            to: expectedZone,
          })
        })
        const available = pwNumber(
          items.reduce((sum, item) => sum + item!.weightKg, 0),
        )
        const inputWeightKg =
          type === "FREEZE" ? available : Number(data.get("inputWeight"))
        if (!(inputWeightKg > 0) || inputWeightKg > available)
          throw Error(
            "وزن کل ورودی باید مثبت و حداکثر برابر موجودی انتخابی باشد.",
          )
        if (type === "FREEZE") {
          const expected = items.flatMap((item) =>
            item!.trays.map((t) => t.code),
          )
          if (
            items.some((item) => !item!.allocated) ||
            !expected.length ||
            new Set(scans).size !== scans.length ||
            expected.length !== scans.length ||
            expected.some((code) => !scans.includes(code))
          )
            throw Error(
              "همه سینی‌های تخصیص‌یافته بچ‌های انتخابی را دقیقاً یک‌بار اسکن کنید.",
            )
          scans.forEach((code) => pwCarrier(code, "tray"))
        }
        const code = pwId(next, "CY"),
          cycle = {
            id: code,
            code,
            type,
            machineId,
            itemIds: ids,
            trayCodes: scans,
            inputWeightKg,
            status: "READY",
            createdAt: new Date().toISOString(),
            demo: !!items[0]!.demo,
          }
        next.cycles.push(cycle)
        pwEvent(next, "ساخت چرخه", code, {
          type,
          machineId,
          batches: ids,
          inputWeightKg,
        })
      },
    )
  }
  const cycleAction = (event: any, id: string, action: string) => {
    const data = form(event)
    execute("وضعیت چرخه و موجودی به‌روزرسانی شد.", (next) => {
      const cycle = next.cycles.find((c) => c.id === id)
      if (!cycle) throw Error("چرخه پیدا نشد.")
      const running = cycle.type === "DRY" ? "IN_PROGRESS" : "RUNNING",
        transitions: any = {
          READY: { START: running, CANCEL: "CANCELLED" },
          RUNNING: { PAUSE: "PAUSED", COMPLETE: "COMPLETING", FAIL: "FAILED" },
          IN_PROGRESS: {
            PAUSE: "PAUSED",
            COMPLETE: "COMPLETING",
            FAIL: "FAILED",
          },
          PAUSED: { RESUME: running, CANCEL: "CANCELLED", FAIL: "FAILED" },
          COMPLETING: { FINISH: "COMPLETED", FAIL: "FAILED" },
          FAILED: { RESUME: running, RESTART: "READY", SCRAP: "SCRAPPED" },
        }
      const target = transitions[cycle.status]?.[action],
        reason = String(data.get("reason") || "").trim(),
        items: PWItem[] = cycle.itemIds.map(
          (itemId: string) => next.items.find((x) => x.id === itemId)!,
        )
      if (!target) throw Error("این تغییر وضعیت مجاز نیست.")
      if ((action === "FAIL" || cycle.status === "FAILED") && !reason)
        throw Error("علت خرابی یا تصمیم مدیر را وارد کنید.")
      if (
        cycle.status === "FAILED" &&
        items.some(
          (item) => item.consumed || item.weightKg <= 0 || pwBusy(next, item),
        )
      )
        throw Error("بچ پس از خرابی مصرف شده یا در چرخه دیگری استفاده شده است.")
      if (cycle.status === "FAILED")
        items.forEach((item) => {
          if (item.cycleFailureId === cycle.id) {
            item.blocked = false
            delete item.cycleFailureId
          }
        })
      if (action === "FAIL")
        items.forEach((item) => {
          item.blocked = true
          item.cycleFailureId = cycle.id
        })
      if (action === "FINISH") {
        items.forEach((item) => {
          if (cycle.type === "FREEZE") {
            const freezeOnly = item.destination === "FREEZING"
            item.stage = "FROZEN"
            item.zone = freezeOnly ? "PACKAGING" : "FREEZE_DRYING"
            item.nextZone = item.zone
          } else {
            const measured = Number(data.get(`weight-${item.id}`))
            const packageCode=String(data.get(`package-${item.id}`)||"").trim().toUpperCase()
            if (
              !Number.isFinite(measured) ||
              !(measured > 0) ||
              measured > item.weightKg
            )
              throw Error(
                `وزن نهایی معتبر برای ${item.code} لازم است؛ حداکثر ${item.weightKg} kg.`,
              )
            if(!packageCode) throw Error(`کد بسته یا لیبل خروجی برای ${item.code} لازم است.`)
            item.beforeDryWeightKg = item.weightKg
            item.weightKg = pwNumber(measured)
            item.yieldPercent = pwNumber(
              (measured / item.beforeDryWeightKg) * 100,
            )
            item.machineOutputStage = cycle.type === "DRY" ? "DRIED" : "FREEZE_DRIED"
            item.stage = "PACKAGED"
            item.zone = item.physicalLocation||"COLD_ROOM_POSITIVE_CLEAN"
            item.currentLocation=item.zone
            item.currentState="COMPLETED"
            item.nextZone = null
            item.nextAction="آماده نگهداری یا ارسال"
            item.containerCode = packageCode
            item.trays = []
            item.allocated = false
          }
        })
      }
      if (action === "SCRAP")
        items.forEach((item) => {
          item.weightKg = 0
          item.stage = "WASTED"
          item.zone = "WASTE"
          item.consumed = true
          item.containerCode = ""
          item.trays = []
        })
      const from = cycle.status
      cycle.status = target
      if (action === "START") cycle.startedAt = new Date().toISOString()
      if (["COMPLETED", "FAILED", "CANCELLED", "SCRAPPED"].includes(target))
        cycle.endedAt = new Date().toISOString()
      pwEvent(next, `چرخه: ${action}`, cycle.code, {
        from,
        to: target,
        reason: reason || null,
        weights: items.map((item) => ({
          code: item.code,
          weightKg: item.weightKg,
          stage: item.stage,
        })),
      })
    })
  }
  const merge = (event: any) => {
    const data = form(event)
    execute(
      "ادغام فیزیکی ثبت شد؛ بچ جدید و شجره ورودی‌ها در نتایج قابل مشاهده است.",
      (next) => {
        const ids = data.getAll("items").map(String),
          items = ids.map((id) => next.items.find((x) => x.id === id))
        if (items.length < 2) throw Error("حداقل دو بچ انتخاب کنید.")
        items.forEach((item) => {
          pwUsable(next, item)
          if (item!.trays.length)
            throw Error(
              "بچ تخصیص‌یافته به سینی ابتدا باید عملیات جاری خود را تکمیل کند.",
            )
        })
        if (items.some((item) => !!item!.demo !== !!items[0]!.demo))
          throw Error("بچ‌های آزمایشی را با داده خودتان ادغام نکنید.")
        if (items.some((item) => item!.product !== items[0]!.product))
          throw Error(
            "در این نمونه رابط، ادغام فقط برای یک محصول مشترک انجام می‌شود.",
          )
        const carrier = pwCarrier(String(data.get("scan")), "basket")
        pwFreeCarrier(next, carrier.code)
        if (data.get("staged") !== "on")
          throw Error("قرارگیری فیزیکی سبد خالی در سورتینگ را تأیید کنید.")
        const weightKg = Number(data.get("weight")),
          sum = pwNumber(items.reduce((n, item) => n + item!.weightKg, 0))
        if (!(weightKg > 0) || weightKg > sum || weightKg > carrier.capacityKg)
          throw Error(
            "وزن خروجی باید مثبت و در محدوده وزن ورودی و ظرفیت سبد باشد.",
          )
        const grade = String(data.get("grade") || ""),
          size = String(data.get("size") || "")
        if (!grade || !size) throw Error("گرید و اندازه خروجی لازم است.")
        const code = pwId(next, "B"),
          child: PWItem = {
            id: code,
            code,
            parentId: ids.join(","),
            parentIds: ids,
            inputCodes: items.map((item) => item!.containerCode),
            parentContributions: items.map((item) => ({
              id: item!.id,
              weightKg: item!.weightKg,
            })),
            product: items[0]!.product,
            grade,
            size,
            weightKg: pwNumber(weightKg),
            stage: "SORTED",
            zone: "SORTING",
            destination: null,
            containerCode: carrier.code,
            trays: [],
            allocated: false,
            consumed: false,
            blocked: false,
            demo: !!items[0]!.demo,
          }
        items.forEach((item) => {
          item!.consumed = true
          item!.stage = "CONSUMED"
          item!.weightKg = 0
          item!.containerCode = ""
        })
        next.items.push(child)
        pwEvent(next, "ادغام فیزیکی", code, {
          parents: ids,
          inputWeightKg: sum,
          outputWeightKg: weightKg,
          lossKg: pwNumber(sum - weightKg),
          container: carrier.code,
        })
      },
    )
  }
  const finishMachineOutput = (event:any,type:"FREEZE"|"DRY") => {
    const data=form(event)
    execute(type==="FREEZE"?"خروج از فریز ثبت شد.":"خروج از خشک‌کن ثبت شد و محصول بسته‌بندی شد.",(next)=>{
      const item=next.items.find((row)=>row.id===chosen)
      pwUsable(next,item)
      const isFreezeDry=type==="FREEZE"&&item.destination==="FREEZE_DRYING"
      const valid=type==="FREEZE"
        ? item.nextZone==="FREEZING"&&["WASHED","SLICED"].includes(item.stage)
        : item.nextZone==="DRYING"&&item.stage==="SLICED"&&item.destination==="DRYING"
      if(!valid) throw Error("این بچ برای خروجی انتخاب‌شده آماده نیست.")
      const measured=Number(data.get("weight")),packageCode=String(data.get("packageCode")||"").trim().toUpperCase()
      if(!Number.isFinite(measured)||!(measured>0)||measured>item.weightKg) throw Error(`وزن خروجی باید مثبت و حداکثر ${item.weightKg} کیلوگرم باشد.`)
      if(!isFreezeDry&&!packageCode) throw Error("کد بسته یا لیبل خروجی لازم است.")
      const before=item.weightKg
      item.weightKg=pwNumber(measured)
      item.beforeMachineWeightKg=before
      item.yieldPercent=pwNumber((measured/before)*100)
      item.containerCode=isFreezeDry?item.containerCode:packageCode
      item.currentState="COMPLETED"
      item.blocked=data.get("qualityCheckRequired")==="on"
      if(type==="FREEZE"){
        item.physicalLocation="COLD_ROOM_NEGATIVE"
        item.zone="COLD_ROOM_NEGATIVE"
        item.currentLocation="COLD_ROOM_NEGATIVE"
        item.stage=isFreezeDry?"FROZEN":"PACKAGED"
        item.nextZone=isFreezeDry?"FREEZE_DRYING":null
        item.nextAction=item.blocked?"در انتظار تصمیم مدیر کنترل کیفیت":isFreezeDry?"ثبت ورود سینی‌ها به فریزدرای":"آماده نگهداری یا ارسال"
      }else{
        item.physicalLocation="COLD_ROOM_POSITIVE_CLEAN"
        item.zone="COLD_ROOM_POSITIVE_CLEAN"
        item.currentLocation="COLD_ROOM_POSITIVE_CLEAN"
        item.stage="PACKAGED"
        item.nextZone=null
        item.nextAction=item.blocked?"در انتظار تصمیم مدیر کنترل کیفیت":"آماده نگهداری یا ارسال"
      }
      pwEvent(next,type==="FREEZE"?"ثبت خروج از فریز":"ثبت خروج از خشک‌کن",item.code,{beforeWeightKg:before,outputWeightKg:item.weightKg,packageCode:packageCode||null,nextZone:item.nextZone})
    })
  }
  const cycleType = tab==="FREEZE_DRY_ENTRY"||tab==="FREEZE_DRY_EXIT" ? "FREEZE_DRY" : ""
  const cycleEligible = live.filter(
    (item) =>
      !pwBusy(ledger, item) &&
      !item.blocked &&
      (cycleType === "FREEZE_DRY"
          ? item.stage === "FROZEN" && (item.zone === "FREEZE_DRYING" || item.nextZone === "FREEZE_DRYING")
          : false),
  )
  const freezeOutputEligible=live.filter(item=>!pwBusy(ledger,item)&&!item.blocked&&item.nextZone==="FREEZING"&&["WASHED","SLICED"].includes(item.stage))
  const dryOutputEligible=live.filter(item=>!pwBusy(ledger,item)&&!item.blocked&&item.nextZone==="DRYING"&&item.stage==="SLICED"&&item.destination==="DRYING")
  return (
    <div
      dir="rtl"
      style={{
        padding: 24,
        color: "#183e38",
        background: "#f3f7f6",
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 25, margin: 0 }}>میز کار تولید</h1>
          <p style={{ color: "#6a817b", margin: "6px 0" }}>
            از سبد ورودی تا عملیات ماشین، خروجی و رهگیری با داده همین نشست
          </p>
        </div>
      </div>
      {tab !== "overview" && <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:16,padding:"12px 14px",background:"#eaf3ef",borderRadius:12}}>
        <b>{tabs.find(([id])=>id===tab)?.[1]}</b>
        <PWButton secondary onClick={()=>switchTab("overview")}>بازگشت به میز کار تولید</PWButton>
      </div>}
      {(error || ledger.storageError) && (
        <div
          role="alert"
          style={{
            padding: 14,
            marginBottom: 16,
            color: "#9f2323",
            background: "#fff0f0",
            borderRadius: 10,
          }}
        >
          {error || ledger.storageError}
        </div>
      )}
      {notice && (
        <div role="status">
          <PWNotice>{notice}</PWNotice>
        </div>
      )}
      {tab === "sorting-entry" && <SortingScreen initialStep="input" {...props} />}
      {tab === "sorting-exit" && <SortingScreen initialStep="output" {...props} />}
      {tab === "wash-entry" && (
        <WashingSessionScreen
          initialMode="ENTRY"
          ledger={ledger}
          onChange={(next, message) => {
            setLedger(next)
            setNotice(message)
            setError("")
          }}
        />
      )}
      {tab === "wash-exit" && (
        <WashingSessionScreen
          initialMode="EXIT"
          ledger={ledger}
          onChange={(next, message) => {
            setLedger(next)
            setNotice(message)
            setError("")
          }}
        />
      )}
      {tab === "overview" && (
        <div style={{display:"grid",gap:22}}>
          {[
            {title:"عملیات نظارتی",hint:"نظارت بر صف و نتیجه فرایندها",items:[["overview","صف کار و مسیر","↯"],["results","نتایج و رویدادها","▣"]]},
            {title:"عملیات سورتینگ",hint:"ورودی و خروجی در دو ایستگاه مستقل",items:[["sorting-entry","ورود به سورتینگ","⇥"],["sorting-exit","خروج از سورتینگ","⇤"]]},
            {title:"عملیات شست‌وشو",hint:"ورودی و خروجی در دو ایستگاه مستقل",items:[["wash-entry","ورود به شست‌وشو","⇥"],["wash-exit","خروج از شست‌وشو","⇤"]]},
            {title:"عملیات فریزینگ",hint:"ثبت خروج، وزن و بسته‌بندی",items:[["FREEZE","ثبت خروج از فریز و بسته‌بندی","❄"]]},
            {title:"عملیات اسلایس و خشک‌کن",hint:"تأیید اسلایس و ثبت محصول خشک‌شده",items:[["slice","ثبت ورود به اسلایس","▦"],["DRY","ثبت خروج از خشک‌کن و بسته‌بندی","♨"]]},
            {title:"عملیات فریزدرای",hint:"ورود سینی از فریزر و خروج محصول نهایی",items:[["FREEZE_DRY_ENTRY","ثبت ورود به فریزدرای","✣"],["FREEZE_DRY_EXIT","ثبت خروج از فریزدرای و بسته‌بندی","⇥"]]},
          ].map((group:any)=><section key={group.title}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}><b style={{whiteSpace:"nowrap"}}>● {group.title}</b><span style={{height:1,background:"#d8e4df",flex:1}}/><small style={{color:"#718079"}}>{group.hint}</small></div>
            <div style={{display:"grid",gridTemplateColumns:group.items.length>1?"1fr 1fr":"1fr",gap:16}}>{group.items.map(([id,label,icon]:string[])=><button key={id} type="button" onClick={()=>id==="overview"?document.getElementById("production-queue")?.scrollIntoView({behavior:"smooth"}):switchTab(id)} style={{border:"1px solid #d8e4df",borderRadius:16,background:"white",padding:18,boxShadow:"0 2px 8px #143b2f12",cursor:"pointer"}}><span style={{display:"block",background:id==="overview"?"#17332d":"#115d49",color:"white",borderRadius:11,padding:"13px 16px",fontWeight:800,fontSize:14}}>{icon}　{label}</span></button>)}</div>
          </section>)}
          <div id="production-queue" style={{...pwBox,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            <div><small>بچ جاری</small><b style={{display:"block",fontSize:24}}>{live.length}</b></div>
            <div><small>نشست شست‌وشوی فعال</small><b style={{display:"block",fontSize:24}}>{ledger.washSessions.filter((x:any)=>x.status==="ACTIVE").length}</b></div>
            <div><small>چرخه فعال ماشین</small><b style={{display:"block",fontSize:24}}>{ledger.cycles.filter((x:any)=>PW_ACTIVE.includes(x.status)).length}</b></div>
          </div>
        </div>
      )}
      {false && tab === "overview" && (
        <>
          <PWNotice>
            مقصد عملیاتی هنگام توزین هر خروجی توسط کارشناس سورت تعیین می‌شود و
            محل فیزیکی با آن یکی نیست. ارسال تازه مستقیم به بسته‌بندی می‌رود؛ خشک،
            فریز، فریز اسلایس و فریز درای مسیرهای اجباری متفاوت دارند. کنترل کیفیت
            می‌تواند در خروج هر مرحله فعال شود. اسکن ورودی هر ایستگاه، ورود و
            تغییر وضعیت را همان‌جا ثبت می‌کند و تأیید جداگانه‌ای در صف لازم نیست.
          </PWNotice>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {[
              ["بچ جاری", live.length],
              [
                "چرخه فعال",
                ledger.cycles.filter((c) => PW_ACTIVE.includes(c.status))
                  .length,
              ],
              ["مسیر تعیین‌شده", live.filter((x) => !!x.destination).length],
            ].map(([title, count]) => (
              <div key={String(title)} style={{ ...pwBox, flex: 1 }}>
                <small>{title}</small>
                <div style={{ fontSize: 28, marginTop: 8 }}>{count}</div>
              </div>
            ))}
          </div>
          {!live.length ? (
            <PWEmpty>
              ابتدا سبدهای همان محموله را در سورتینگ ثبت کنید؛ خروجی‌ها در همین
              صف نمایش داده می‌شوند.
            </PWEmpty>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {live.map((item) => (
                <div key={item.id} style={pwBox}>
                  {summary(item)}
                  <div style={{ fontSize: 13, marginBottom: 12 }}>
                    محصول: {item.product} · گرید {item.grade} · اندازه{" "}
                    {item.size} · مبدا {item.parentId} · سبد ورودی{" "}
                    {item.inputCodes.join("، ") || "—"}
                    {item.plannedRoute
                      ? ` · مسیر پیشنهادی سورت: ${item.plannedRoute}`
                      : ""}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "end",
                      flexWrap: "wrap",
                    }}
                  >
                    {item.destination && item.stage === "SORTED" && (
                      <form
                        onSubmit={(event) => {
                          const data = form(event)
                          execute(
                            "اصلاح مقصد ثبت شد؛ مرحله بعد در صف به‌روزرسانی شد.",
                            (next) => {
                              const row = next.items.find(
                                (x) => x.id === item.id,
                              )
                              pwUsable(next, row)
                              const destination = String(
                                  data.get("destination"),
                                ),
                                reason = String(data.get("reason") || "").trim()
                              if (!reason)
                                throw Error("علت اصلاح مقصد الزامی است.")
                              if (row.destination === destination)
                                throw Error("مقصد تغییری نکرده است.")
                              const previous = row.destination
                              row.destination = destination
                              row.operationalDestination=destination
                              row.nextZone=pwRouteFor(destination).processes[0]||null
                              pwEvent(next, "اصلاح مقصد", row.code, {
                                previous,
                                destination,
                                reason,
                              })
                            },
                          )
                        }}
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        <select
                          name="destination"
                          defaultValue={item.destination}
                          style={{ ...pwInput, width: 180 }}
                          required
                        >
                          {[
                            "FRESH_EXPORT",
                            "DRYING",
                            "FREEZING",
                            "FREEZING_SLICED",
                            "FREEZE_DRYING",
                            "QC",
                            "WASTE",
                          ].map((zone) => (
                            <option key={zone} value={zone}>
                              {PW_ZONES[zone]}
                            </option>
                          ))}
                        </select>
                        <input
                          name="reason"
                          required
                          placeholder="علت اصلاح مقصد"
                          style={{ ...pwInput, width: 190 }}
                        />
                        <PWButton disabled={pwBusy(ledger, item)}>
                          اصلاح مقصد
                        </PWButton>
                      </form>
                    )}
                    <span>
                      مرحله بعد:{" "}
                      {PW_ZONES[item.nextZone || item.destination || ""] ||
                        "مسیر نامشخص"}
                    </span>
                    <span style={{color:"#60746f",fontSize:12}}>
                      ثبت ورود با اسکن همان ایستگاه انجام می‌شود.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {tab === "slice" && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          <div style={pwBox}>
            <h2>ثبت اسلایس یک بچ کامل</h2>
            <PWNotice>
              ورود با اسکن انجام می‌شود و وزن انتقال اختیاری است؛ در صورت ثبت،
              اختلاف با آخرین وزن معتبر در تاریخچه ذخیره می‌شود.
            </PWNotice>
            <form onSubmit={(event) => processBatch(event, "SLICE")}>
              {batchPicker(
                live.filter((x) => x.stage === "WASHED" && !pwBusy(ledger, x)),
              )}
              {current && summary(current)}
              <PWField label="اسکن QR سبد همین بچ">
                <input
                  name="scan"
                  placeholder="اسکن یا ورود کد خوانده‌شده"
                  required
                  style={pwInput}
                />
              </PWField>
              <PWField label="وزن خروج از شست‌وشو / ورود به اسلایس (kg، اختیاری)">
                <input
                  name="observed"
                  type="number"
                  min="0.001"
                  step="0.001"
                  style={pwInput}
                />
              </PWField>
              <label style={{display:"flex",gap:8,fontSize:12,margin:"10px 0"}}><input name="qualityCheckRequired" type="checkbox"/>نیازمند کنترل کیفیت در خروج اسلایس</label>
              <PWButton disabled={!current || current.stage !== "WASHED"}>
                تأیید پایان اسلایس
              </PWButton>
            </form>
          </div>
          {tab === "slice" && (
            <div style={pwBox}>
              <h2>تخصیص سینی‌های خروجی اسلایس</h2>
              {batchPicker(
                live.filter(
                  (x) =>
                    x.stage === "SLICED" &&
                    x.destination !== "DRYING" &&
                    !pwBusy(ledger, x),
                ),
              )}
              {current?.stage === "SLICED" &&
              current.destination !== "DRYING" ? (
                <>
                  {summary(current)}
                  <PWNotice>
                    برای مسیر فریز یا فریزدرای، فقط سینی سالم پذیرفته می‌شود.
                    مسیر خشک در همان سبد به خشک‌کن می‌رود و این مرحله را ندارد.
                  </PWNotice>
                  <form onSubmit={allocate}>
                    <PWField label="اسکن QR سینی موجود">
                      <input name="scan" required style={pwInput} />
                    </PWField>
                    <PWField label="ترتیب سینی">
                      <input
                        name="sequence"
                        type="number"
                        min="1"
                        step="1"
                        defaultValue="1"
                        required
                        style={pwInput}
                      />
                    </PWField>
                    <PWField label="مقدار محصول در سینی (kg، اختیاری)">
                      <input
                        name="quantity"
                        type="number"
                        min="0.001"
                        step="0.001"
                        style={pwInput}
                      />
                    </PWField>
                    <PWButton disabled={current.allocated}>
                      ثبت این سینی
                    </PWButton>
                  </form>
                  <div style={{ margin: "16px 0" }}>
                    {current.trays.map((tray) => (
                      <p key={tray.code}>
                        {tray.sequence}. {tray.code} ·{" "}
                        {tray.quantityKg === null
                          ? "بدون وزن مجزا"
                          : `${tray.quantityKg} kg`}
                      </p>
                    ))}
                  </div>
                  <PWButton
                    disabled={current.allocated || !current.trays.length}
                    onClick={finishAllocation}
                  >
                    {current.allocated
                      ? "تخصیص نهایی شده"
                      : "تأیید پایان تخصیص و آزادسازی سبد"}
                  </PWButton>
                </>
              ) : (
                <PWEmpty>
                  فقط بچ اسلایس‌شده با مقصد فریز یا فریزدرای به سینی تخصیص
                  می‌یابد.
                </PWEmpty>
              )}
            </div>
          )}
        </div>
      )}
      {(tab === "FREEZE" || tab === "DRY") && (()=>{
        const rows=tab==="FREEZE"?freezeOutputEligible:dryOutputEligible
        const selected=rows.find(item=>item.id===chosen)
        const freezeDryContinuation=tab==="FREEZE"&&selected?.destination==="FREEZE_DRYING"
        return <div style={{...pwBox,maxWidth:900}}>
          <h2>{tab==="FREEZE"?"ثبت خروج از فریز و بسته‌بندی":"ثبت خروج از خشک‌کن و بسته‌بندی"}</h2>
          <PWNotice>{tab==="FREEZE"?"ورود به فریز قبلاً از مسیر شست‌وشو یا اسلایس مشخص شده است. اینجا فقط خروج محصول، وزن نهایی و بسته‌بندی ثبت می‌شود. محصول مسیر فریزدرای بدون بسته‌بندی به مرحله ورود فریزدرای می‌رود.":"چرخه خشک‌کردن از مسیر اسلایس مشخص شده است. اینجا خروج محصول خشک، وزن نهایی و بسته‌بندی ثبت می‌شود."}</PWNotice>
          {!rows.length?<PWEmpty>محصول آماده خروج در این مرحله وجود ندارد.</PWEmpty>:<form onSubmit={event=>finishMachineOutput(event,tab as "FREEZE"|"DRY")}>
            {batchPicker(rows)}
            {selected&&summary(selected)}
            <PWField label="وزن نهایی خروجی (kg)"><input name="weight" type="number" min="0.001" step="0.001" max={selected?.weightKg} required style={pwInput}/></PWField>
            {!freezeDryContinuation&&<PWField label="کد بسته یا لیبل خروجی"><input name="packageCode" placeholder="مثلاً PKG-0001" required style={pwInput}/></PWField>}
            {freezeDryContinuation&&<PWNotice>این بچ پس از ثبت خروج فریز، در سردخانه منفی باقی می‌ماند و برای «ورود به فریزدرای» آماده می‌شود؛ در این مرحله بسته‌بندی نمی‌شود.</PWNotice>}
            <label style={{display:"flex",gap:8,alignItems:"center",fontSize:12,margin:"12px 0"}}><input name="qualityCheckRequired" type="checkbox"/>نیازمند کنترل کیفیت در خروج این مرحله</label>
            <PWButton disabled={!selected}>ثبت وزن و {freezeDryContinuation?"ارسال به فریزدرای":"بسته‌بندی"}</PWButton>
          </form>}
        </div>
      })()}
      {cycleType && (
        <>
          {tab === "FREEZE_DRY_ENTRY" && <div style={pwBox}>
            <h2>
              ثبت ورود سینی‌ها به دستگاه فریزدرای
            </h2>
            <PWNotice>
              فقط سینی‌های محصولی که ابتدا منجمد شده و مقصد نهایی آن فریزدرای است وارد دستگاه می‌شوند. ثبت این فرم یعنی سینی‌ها واقعاً از فریزر وارد دستگاه شده‌اند.
            </PWNotice>
            {!cycleEligible.length ? (
              <PWEmpty>
                بچ آماده با مرحله و مسیر صحیح وجود ندارد. ابتدا عملیات قبلی را
                کامل کنید؛ ورود به این ایستگاه با همان اسکن ثبت می‌شود.
              </PWEmpty>
            ) : (
              <form onSubmit={(event) => createCycle(event, cycleType)}>
                <PWField label="تجهیز">
                  <select name="machine" style={pwInput}>
                    {ledger.machines[cycleType].map((code) => (
                      <option key={code}>{code}</option>
                    ))}
                  </select>
                </PWField>
                <PWField label="بچ‌های ورودی (انتخاب یک یا چند مورد)">
                  <div>
                    {cycleEligible.map((item) => (
                      <label
                        key={item.id}
                        style={{
                          display: "block",
                          padding: 10,
                          borderBottom: "1px solid #e2eae7",
                        }}
                      >
                        <input type="checkbox" name="items" value={item.id} />{" "}
                        {item.code} · {item.weightKg} kg ·{" "}
                        {item.containerCode ||
                          item.trays.map((t) => t.code).join("، ")}
                      </label>
                    ))}
                  </div>
                </PWField>
                  <PWField label="وزن کل ورودی دستگاه (kg)">
                    <input
                      name="inputWeight"
                      type="number"
                      min="0.001"
                      step="0.001"
                      required
                      style={pwInput}
                    />
                  </PWField>
                <PWButton>ثبت ورود و ایجاد چرخه</PWButton>
              </form>
            )}
          </div>}
          <div style={{ display: "grid", gap: 14, marginTop: 20 }}>
            {ledger.cycles
              .filter((c) => c.type === cycleType && !c.demo)
              .filter((c)=>tab==="FREEZE_DRY_ENTRY"?["READY"].includes(c.status):["RUNNING","IN_PROGRESS","PAUSED","COMPLETING","FAILED"].includes(c.status))
              .slice()
              .reverse()
              .map((cycle) => (
                <div style={pwBox} key={cycle.id}>
                  <h3>
                    {cycle.code} · {PW_STAGES[cycle.status]}
                  </h3>
                  <p>
                    {cycle.machineId} · ورودی {cycle.inputWeightKg} kg · بچ‌ها:{" "}
                    {cycle.itemIds.join("، ")}
                  </p>
                  <form
                    onSubmit={(event) => {
                      const submitter = (event.nativeEvent as any).submitter
                      cycleAction(event, cycle.id, submitter?.value)
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                       {cycle.status === "COMPLETING" &&
                        cycle.type !== "FREEZE" &&
                        cycle.itemIds.map((id: string) => (
                          <div key={id} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%"}}><PWField label={`وزن نهایی ${id} (kg)`}>
                            <input
                              name={`weight-${id}`}
                              type="number"
                              min="0.001"
                              step="0.001"
                              max={
                                ledger.items.find((x) => x.id === id)?.weightKg
                              }
                              style={pwInput}
                            />
                          </PWField><PWField label={`کد بسته یا لیبل ${id}`}><input name={`package-${id}`} required placeholder="مثلاً PKG-0001" style={pwInput}/></PWField></div>
                        ))}
                      {[
                        "RUNNING",
                        "IN_PROGRESS",
                        "PAUSED",
                        "COMPLETING",
                        "FAILED",
                      ].includes(cycle.status) && (
                        <input
                          name="reason"
                          placeholder="علت خرابی / تصمیم مدیر"
                          style={{ ...pwInput, width: 250 }}
                        />
                      )}
                      {(
                        ({
                          READY: ["START", "CANCEL"],
                          RUNNING: ["PAUSE", "COMPLETE", "FAIL"],
                          IN_PROGRESS: ["PAUSE", "COMPLETE", "FAIL"],
                          PAUSED: ["RESUME", "CANCEL", "FAIL"],
                          COMPLETING: ["FINISH", "FAIL"],
                          FAILED: ["RESUME", "RESTART", "SCRAP"],
                        } as any)[cycle.status] || []
                      ).map((action: string) => (
                        <PWButton
                          key={action}
                          type="submit"
                          name="action"
                          value={action}
                          secondary={["CANCEL", "FAIL", "SCRAP"].includes(
                            action,
                          )}
                        >
                          {
                            ({
                              START: "شروع چرخه",
                              CANCEL: "لغو",
                              PAUSE: "مکث",
                              RESUME: "ادامه",
                              COMPLETE: "پایان فرآیند؛ آماده تخلیه",
                              FINISH: "ثبت خروج، وزن و بسته‌بندی",
                              FAIL: "ثبت خرابی",
                              RESTART: "بازگشت به آماده",
                              SCRAP: "اسقاط محصول",
                            } as any)[action]
                          }
                        </PWButton>
                      ))}
                    </div>
                  </form>
                </div>
              ))}
          </div>
        </>
      )}
      {tab === "merge" && (
        <div style={{ ...pwBox, maxWidth: 850 }}>
          <h2>ادغام فیزیکی در یک سبد مجزا</h2>
          <PWNotice>
            این عملیات یک بچ جدید با شجره ورودی می‌سازد؛ گروه‌بندی نمایشی سبدها
            محسوب نمی‌شود. در این رابط تمام وزن بچ‌های انتخابی مصرف می‌شود.
          </PWNotice>
          <form onSubmit={merge}>
            <PWField label="بچ‌های ورودی">
              <div>
                {live
                  .filter((item) => !pwBusy(ledger, item) && !item.trays.length)
                  .map((item) => (
                    <label
                      key={item.id}
                      style={{ display: "block", padding: 8 }}
                    >
                      <input name="items" type="checkbox" value={item.id} />{" "}
                      {item.code} · {item.product} · {item.grade}/{item.size} ·{" "}
                      {item.weightKg} kg
                    </label>
                  ))}
              </div>
            </PWField>
            <PWField label="اسکن سبد خالی خروجی در سورتینگ">
              <input name="scan" required style={pwInput} />
            </PWField>
            <label style={{ display: "block", marginBottom: 14 }}>
              <input name="staged" type="checkbox" required /> سبد خروجی خالی و
              در محل سورتینگ قرار دارد.
            </label>
            <PWField label="وزن خروجی (kg)">
              <input
                name="weight"
                type="number"
                min="0.001"
                step="0.001"
                required
                style={pwInput}
              />
            </PWField>
            <PWField label="گرید خروجی">
              <select name="grade" required style={pwInput}>
                <option value="">انتخاب…</option>
                {[...new Set(live.map((x) => x.grade))].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </PWField>
            <PWField label="اندازه خروجی">
              <select name="size" required style={pwInput}>
                <option value="">انتخاب…</option>
                {[...new Set(live.map((x) => x.size))].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </PWField>
            <PWButton disabled={live.length < 2}>
              تأیید ادغام و ایجاد بچ
            </PWButton>
          </form>
        </div>
      )}
      {tab === "results" && (
        <div style={{ display: "grid", gap: 18 }}>
          <div style={pwBox}>
            <h2>بچ‌ها، خروجی‌ها و شجره</h2>
            {!allItems.length ? (
              <PWEmpty />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "بچ",
                        "محصول / گرید / اندازه",
                        "والد / سبد ورودی",
                        "ظرف فعلی",
                        "وزن رسمی",
                        "بازده",
                        "وضعیت / محل",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: 12,
                            textAlign: "right",
                            background: "#eff6f3",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allItems.map((item) => (
                      <tr key={item.id}>
                        {[
                          item.code,
                          `${item.product} / ${item.grade} / ${item.size}`,
                          `${item.parentId} / ${item.inputCodes.join("، ")}`,
                          item.containerCode ||
                            item.trays.map((t) => t.code).join("، ") ||
                            "—",
                          `${item.weightKg} kg`,
                          item.yieldPercent === undefined
                            ? "—"
                            : `${item.yieldPercent}%`,
                          `${PW_STAGES[item.stage]} / ${PW_ZONES[item.zone] || item.zone}`,
                        ].map((value, index) => (
                          <td
                            key={index}
                            style={{
                              padding: 12,
                              borderBottom: "1px solid #e1eae6",
                            }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div style={pwBox}>
            <h2>افت سورتینگ</h2>
            {!ledger.events.some((e) => e.action === "ثبت سورتینگ") ? (
              <PWEmpty>
                پس از ثبت سورتینگ، وزن ورودی، خروجی و علت افت در اینجا نمایش
                داده می‌شود.
              </PWEmpty>
            ) : (
              ledger.events
                .filter((e) => e.action === "ثبت سورتینگ")
                .map((event) => (
                  <p key={event.seq}>
                    {event.entity} · ورودی {event.details.inputWeightKg} kg ·
                    خروجی {event.details.outputWeightKg} kg · افت{" "}
                    {event.details.lossKg} kg · علت{" "}
                    {event.details.lossReason || "بدون افت"}
                  </p>
                ))
            )}
          </div>
          <div style={pwBox}>
            <h2>رویدادهای عملیات</h2>
            <small>
              ترتیب پایدار بر اساس شماره رویداد است؛ زمان برابر ترتیب را تغییر
              نمی‌دهد.
            </small>
            {!ledger.events.length ? (
              <PWEmpty />
            ) : (
              ledger.events
                .slice()
                .reverse()
                .map((event) => (
                  <div
                    key={event.seq}
                    style={{
                      borderBottom: "1px solid #e1eae6",
                      padding: "12px 0",
                    }}
                  >
                    <b>
                      #{event.seq} · {event.action}
                    </b>{" "}
                    · {event.entity}
                    <small
                      style={{
                        display: "block",
                        color: "#6a817b",
                        marginTop: 5,
                      }}
                    >
                      {new Date(event.at).toLocaleString("fa-IR")}
                    </small>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        fontSize: 11,
                        color: "#56756d",
                        direction: "ltr",
                      }}
                    >
                      {JSON.stringify(event.details)}
                    </pre>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
