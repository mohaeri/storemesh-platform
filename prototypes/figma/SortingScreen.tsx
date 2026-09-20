// Stitch is used only as a visual reference. All behavior below remains StoreMesh logic.
function SortingScaleConsole({
  mode,
  code,
  gross,
  tare,
  net,
  previousNet,
  onRead,
}: {
  mode: "entry" | "exit"
  code?: string
  gross: number
  tare: number
  net: number
  previousNet?: number
  onRead?: () => void
}) {
  const number = (value: number) => Number.isFinite(value) ? value.toFixed(3) : "0.000"
  return <section className="overflow-hidden rounded-2xl border border-[#1b5a46] bg-[#082b20] p-4 text-white shadow-xl" aria-label={`کنسول توزین ${mode === "entry" ? "ورود" : "خروج"} سورتینگ`}>
    <div className="grid grid-cols-12 gap-3" dir="rtl">
      <div className="col-span-3 flex flex-col justify-between rounded-xl border border-[#1b5a46] bg-[#061f17] p-3">
        <div className="flex items-center justify-between text-[11px]"><b className="text-[#c9f7e4]">● باسکول رومیزی ۱</b><span className="font-mono text-[#62e5ad]">10 Hz</span></div>
        <div className="mt-3 rounded-lg border border-[#1b5a46] bg-[#0d382a] p-2 text-[10px]"><div className="flex justify-between"><span>لودسل آنلاین</span><b className="font-mono text-[#62e5ad]">RS485</b></div><div className="mt-2 flex justify-between text-[#8eb8a8]"><span>قرائت پایدار</span><b>± 0.002 kg</b></div></div>
        <div className="mt-3 rounded-lg border border-[#1b5a46] px-3 py-2 text-center text-[10px] text-[#62e5ad]">✓ ثبات سیگنال حسگر تأیید شد</div>
        {code && <div className="mt-3 rounded-lg bg-[#041711] p-2 text-center"><small className="block text-[#8eb8a8]">سریال سبد جاری</small><b className="font-mono text-xl text-[#62e5ad]">{code}</b></div>}
      </div>
      <div className="col-span-3 rounded-xl border border-[#1b5a46] bg-[#061f17] p-4">
        <div className="flex justify-between text-[11px] text-[#c9f7e4]"><b>{mode === "entry" ? "وزن خالص جدید" : "وزن خالص"}</b><span className="font-mono text-[#62e5ad]">SENS: HIGH</span></div>
        <div className="my-5 flex items-baseline justify-center gap-2" dir="ltr"><strong className="font-mono text-[38px] tracking-[.12em]">{number(net)}</strong><span className="rounded bg-[#0d382a] px-2 py-1 text-[10px] text-[#62e5ad]">kg</span></div>
        <div className="flex justify-between border-t border-white/10 pt-2 text-[10px]"><span>وزن ظرف</span><b className="font-mono text-[#62e5ad]">{number(tare)} kg</b></div>
      </div>
      <div className="col-span-3 rounded-xl border border-[#1b5a46] bg-[#061f17] p-4">
        <div className="flex justify-between text-[11px] text-[#c9f7e4]"><b>{mode === "entry" ? "وزن خالص قبلی" : "وزن ناخالص"}</b><span className="font-mono text-[#62e5ad]">GROSS</span></div>
        <div className="my-5 flex items-baseline justify-center gap-2" dir="ltr"><strong className="font-mono text-[38px] tracking-[.12em]">{number(mode === "entry" ? previousNet || 0 : gross)}</strong><span className="rounded bg-[#0d382a] px-2 py-1 text-[10px] text-[#62e5ad]">kg</span></div>
        <div className="flex justify-between border-t border-white/10 pt-2 text-[10px]"><span>{mode === "entry" ? "اختلاف" : "وضعیت"}</span><b className="font-mono text-[#62e5ad]">{mode === "entry" ? `${number(net - (previousNet || 0))} kg` : "READY"}</b></div>
      </div>
      <div className="col-span-3 flex flex-col justify-between gap-2 rounded-xl border border-[#1b5a46] bg-[#0a3326] p-3">
        <button type="button" onClick={onRead} className="rounded-xl border border-[#2b765b] bg-[#14513d] px-3 py-3 text-[11px] font-bold">↻ دریافت وزن از سنسور</button>
        <div className="grid grid-cols-2 gap-2"><button type="button" className="rounded-lg border border-[#1b5a46] bg-[#061f17] py-2 text-[10px]">صفر (Zero)</button><button type="button" className="rounded-lg border border-[#1b5a46] bg-[#061f17] py-2 text-[10px]">تار (Tare)</button></div>
        <div className="rounded-lg border border-[#1b5a46] bg-[#061f17] px-3 py-2 text-[10px]"><span className="text-[#8eb8a8]">پورت اتصال: </span><b className="font-mono text-[#62e5ad]">COM 4</b></div>
      </div>
    </div>
  </section>
}

// Figma prototype fragment; assembled into WebApp.tsx. No backend calls.
function SortingScreen({ initialStep = "input" }: { initialStep?: "input" | "output" }) {
  const batch = readPrototypeBatch(),
    ledger = readProductionLedger()
  const activeSortingSession = (ledger.sortingSessions || []).find(
    (session: any) => session.status === "IN_PROGRESS",
  )
  const [step, setStep] = useState<"input" | "output" | "entry-done" | "done">(initialStep),
    [inputCodes, setInputCodes] = useState<string[]>(() => initialStep === "output" ? [...(activeSortingSession?.inputCodes || [])] : []),
    [scanCode, setScanCode] = useState(""),
    [entryWeights, setEntryWeights] = useState<Record<string, number>>(() => initialStep === "output" ? { ...(activeSortingSession?.entryWeights || {}) } : {}),
    [outputCode, setOutputCode] = useState(""),
    [gross, setGross] = useState(""),
    [grade, setGrade] = useState("A"),
    [size, setSize] = useState("درشت"),
    [destination, setDestination] = useState("FRESH_EXPORT"),
    [qualityCheckRequired, setQualityCheckRequired] = useState(false),
    [lossReason, setLossReason] = useState(""),
    [outputs, setOutputs] = useState<any[]>([]),
    [error, setError] = useState(initialStep === "output" && !activeSortingSession ? "هیچ نشست سورتینگ فعالی برای ثبت خروج وجود ندارد." : ""),
    [scale, setScale] = useState("STABLE"),
    [staged, setStaged] = useState<string[]>([]),
    [outputScanOpen, setOutputScanOpen] = useState(false),
    [inputScanOpen, setInputScanOpen] = useState(false)
  const defaultFleet = [
    {
      qr: "CTR-001",
      type: "سبد پلاستیکی",
      tare: 1.28,
      capacity: 25,
      zones: ["RECEIVING", "COLD_STORAGE", "SORTING"],
      status: "فعال",
    },
    {
      qr: "CTR-003",
      type: "سبد پلاستیکی",
      tare: 1.28,
      capacity: 25,
      zones: ["SORTING", "WASHING", "COLD_STORAGE"],
      status: "فعال",
    },
  ]
  const fleet: any[] = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("storemesh.prototype.containers") ||
          JSON.stringify(defaultFleet),
      )
    } catch {
      return defaultFleet
    }
  })()
  const consumed = ledger.consumedInputs || [],
    used = (b: any) => consumed.includes(batch.id + ":" + b.code)
  const blocked = (b: any) => {
    const physical = fleet.find((c) => (c.qr || c.code) === b.code)
    return (
      used(b) ||
      !!physical?.locked ||
      /خراب|DAMAGED/.test(physical?.status || "") ||
      /قرنطینه|در راه|خراب|CONSUMED|QUARANTINE|BLOCKED|DAMAGED/.test(
        b.status || "",
      ) ||
      /قرنطینه/.test(b.zone || "")
    )
  }
  const eligibleSources = batch.baskets.filter(
    (b: any) =>
      !blocked(b) &&
      !inputCodes.includes(b.code) &&
      pwColdStorageLocation(b.currentLocation || b.zone),
  )
  const sources = inputCodes
      .map((code) => batch.baskets.find((b: any) => b.code === code))
      .filter(Boolean),
    inputWeight = Number(
      sources
        .reduce(
          (n: number, source: any) =>
            n +
            (entryWeights[pwCode(source.code)] ??
              Number(source.gross) - Number(source.tare)),
          0,
        )
        .toFixed(3),
    ),
    total = Number(outputs.reduce((n, o) => n + o.weight, 0).toFixed(3)),
    loss = Number((inputWeight - total).toFixed(3))
  const occupied = (code: string) =>
    ledger.items.some(
      (i: any) =>
        i.containerCode === code &&
        !i.consumed &&
        !i.allocated &&
        i.weightKg > 0,
    ) || batch.baskets.some((b: any) => b.code === code && !used(b))
  const pool = fleet.filter(
      (c) =>
        (c.status === "فعال" || c.status === "AVAILABLE") &&
        !c.singleUse &&
        !/سینی|TRAY|SINGLE_USE/.test(c.type || "") &&
        !c.locked &&
        !occupied(c.qr || c.code),
    ),
    carrier = pool.find((c) => (c.qr || c.code) === outputCode),
    tare = Number(carrier?.tare ?? carrier?.tareWeightKg ?? 0),
    net = Number((Number(gross) - tare).toFixed(3)),
    zones = carrier?.zones || carrier?.designatedZones || [],
    warning = carrier && !zones.includes("SORTING")
  const field =
      "h-11 w-full rounded-lg border border-[#d4e2db] bg-white px-3 text-[13px]",
    primary =
      "rounded-lg bg-[#176b50] px-4 py-3 text-white text-[12px] font-bold disabled:opacity-40"
  const destinationLabel: Record<string, string> = {
    FRESH_EXPORT: "ارسال تازه · بسته‌بندی · سردخانه مثبت کثیف",
    DRYING: "خشک · شست‌وشو ← اسلایس ← خشک‌کن ← بسته‌بندی",
    FREEZING: "فریز · شست‌وشو ← سردخانه منفی ← بسته‌بندی",
    FREEZING_SLICED: "فریز اسلایس · شست‌وشو ← اسلایس ← سردخانه منفی ← بسته‌بندی",
    FREEZE_DRYING: "فریز درای · شست‌وشو ← اسلایس ← سردخانه منفی ← فریز درای ← بسته‌بندی",
    QC: "کنترل کیفیت",
    WASTE: "دفع / امحاء · فقط ثبت وزن",
  }
  const productGrades = readMasterData().products.find(
    (item) => item.name === sources[0]?.product,
  )?.grades || ["A", "B", "C"]
  function scanInput(rawCode = scanCode) {
    const code = pwCode(rawCode),
      source = batch.baskets.find((b: any) => pwCode(b.code) === code)
    if (!source || blocked(source))
      return setError("سبد اسکن‌شده برای این نوبت سورت واجد شرایط نیست.")
    if (inputCodes.includes(source.code))
      return setError("این سبد قبلاً اسکن شده است.")
    if (!pwColdStorageLocation(source.currentLocation || source.zone))
      return setError(
        "سبد باید ابتدا با اسکن گیت وارد سردخانه و سپس سورتینگ شود.",
      )
    if (sources.length && sources[0]?.product !== source.product)
      return setError("همه ورودی‌های یک نوبت سورت باید یک محصول باشند.")
    setInputCodes([...inputCodes, source.code])
    setScanCode("")
    setError("")
  }
  function captureEntryWeight(source: any) {
    const measured = Number((Number(source.gross) - Number(source.tare || 0)).toFixed(3))
    if (!(measured > 0)) return setError("ترازو وزن معتبر دریافت نکرد.")
    setEntryWeights({ ...entryWeights, [pwCode(source.code)]: measured })
    setError("")
  }
  function start() {
    if (
      !sources.length ||
      sources.length !== inputCodes.length ||
      new Set(inputCodes).size !== inputCodes.length ||
      sources.some((source: any) => blocked(source)) ||
      !(inputWeight > 0)
    )
      return setError("یک یا چند سبد موجود، آزاد و غیرتکراری انتخاب کنید.")
    if (sources.some((source: any) => !pwColdStorageLocation(source.currentLocation || source.zone)))
      return setError("همه سبدها باید هنگام قفل نشست در سردخانه موجود باشند.")
    if (new Set(sources.map((source: any) => source.product)).size !== 1)
      return setError("همه ورودی‌های یک نوبت سورت باید یک محصول باشند.")
    if (activeSortingSession)
      return setError("یک نشست سورتینگ در حال اجراست؛ ابتدا خروج آن را ثبت کنید.")
    try {
      const next = readProductionLedger()
      const session = {
        id: pwId(next, "SORT"),
        receiptId: batch.id,
        inputCodes: [...inputCodes],
        entryWeights: { ...entryWeights },
        status: "IN_PROGRESS",
        startedAt: new Date().toISOString(),
      }
      next.sortingSessions = [...(next.sortingSessions || []), session]
      pwEvent(next, "شروع نشست سورتینگ", session.id, {
        receiptId: batch.id,
        inputCodes: session.inputCodes,
        entryWeights: session.entryWeights,
      })
      saveProductionLedger(next)
      const current = readPrototypeBatch()
      writePrototypeBatch({
        ...current,
        destination: undefined,
        baskets: current.baskets.map((basket: any) =>
          inputCodes.some((code) => pwCode(code) === pwCode(basket.code))
            ? { ...basket, sortingOrigin: basket.physicalLocation||basket.currentLocation||basket.zone, physicalLocation:basket.physicalLocation||basket.currentLocation||basket.zone, status: "IN_SORTING", currentState: "IN_SORTING", currentLocation: "SORTING", zone: "SORTING", destination: null, nextAction: "ثبت خروجی سورتینگ" }
            : basket,
        ),
        events: [...current.events, { time: new Date().toLocaleTimeString("fa-IR"), title: "شروع نشست سورتینگ", detail: `${inputCodes.length} سبد قفل شد و در وضعیت در حال سورت قرار گرفت.` }],
      })
      setStep("entry-done")
      setInputCodes([])
      setEntryWeights({})
      setError("")
    } catch (failure: any) {
      setError(failure.message || "نشست سورتینگ ذخیره نشد.")
    }
  }
  function openExit() {
    if (!activeSortingSession)
      return setError("هیچ نشست سورتینگ فعالی برای خروج وجود ندارد.")
    setInputCodes([...(activeSortingSession.inputCodes || [])])
    setEntryWeights({ ...(activeSortingSession.entryWeights || {}) })
    setStep("output")
    setError("")
  }
  function scanOutput(rawCode = outputCode) {
    if(destination==="WASTE")return setError("برای دفع سبد تخصیص داده نمی‌شود؛ فقط وزن را ثبت کنید.")
    const code = pwCode(rawCode),
      selected = pool.find((c) => pwCode(c.qr || c.code) === code)
    if (
      !selected ||
      outputs.some((o) => pwCode(o.code) === code) ||
      inputCodes.some((inputCode) => pwCode(inputCode) === code)
    )
      return setError("سبد خروجی باید موجود، خالی و غیرتکراری باشد.")
    setOutputCode(selected.qr || selected.code)
    setStaged([...new Set([...staged, selected.qr || selected.code])])
    setError("")
  }
  function add() {
    const waste=destination==="WASTE"
    if (
      (!waste&&!carrier) ||
      outputs.some((o) => o.code === outputCode) ||
      (!waste&&inputCodes.includes(outputCode))
    )
      return setError("سبد خروجی باید موجود، خالی و غیرتکراری باشد.")
    if (!waste&&!staged.includes(outputCode))
      return setError("حضور فیزیکی سبد خروجی در سورتینگ را تأیید کنید.")
    if (scale !== "STABLE")
      return setError("ترازو قطع است یا وزن ناپایدار است.")
    if (
      !Number.isFinite(net) ||
      net <= 0 ||
      (!waste&&net > Number(carrier.capacity ?? carrier.capacityKg ?? Infinity)) ||
      total + net > inputWeight + 0.001
    )
      return setError(
        "خالص خروجی باید مثبت و در محدوده ظرفیت و وزن ورودی باشد.",
      )
    const parentContributions = pwProportionalParentContributions(
      sources,
      net,
      entryWeights,
    )
    setOutputs([
      ...outputs,
      {
        code: waste?"":outputCode,
        grade,
        size,
        gross: Number(gross),
        tare,
        weight: net,
        destination,
        qualityCheckRequired,
        parentContributions,
        designationWarning: !!warning,
      },
    ])
    setOutputCode("")
    setGross("")
    setQualityCheckRequired(false)
    setError("")
  }
  function finish() {
    if (!outputs.length || loss < -0.001 || (loss > 0 && !lossReason))
      return setError("برای هر افت مثبت، دلیل افت الزامی است.")
    try {
      recordSortingOutputs(batch, inputCodes, outputs, lossReason, entryWeights)
      setStep("done")
      setError("")
    } catch (failure: any) {
      setError(failure.message || "ذخیره انجام نشد.")
    }
  }
  return (
    <div className="space-y-4 p-5 bg-[#f4f7f5] text-[#18302a]" dir="rtl">
      <div>
        <h2 className="text-xl font-bold">
          {initialStep === "input" ? "ورود به سورتینگ" : "خروج از سورتینگ"}
        </h2>
        <p className="text-[12px] text-[#718079] mt-1">
          {initialStep === "input"
            ? "سبدهای ورودی را اسکن کنید، در صورت نیاز وزن تازه بگیرید و نشست را برای شروع سورت قفل کنید."
            : "پس از پایان فیزیکی سورت، هر خروجی را جداگانه اسکن، توزین و مقصدگذاری کنید."}
        </p>
      </div>
      {error && (
        <div
          role="alert"
          className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg text-[13px]"
        >
          {error}
        </div>
      )}
      {step === "entry-done" ? (
        <Card className="p-7 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#176b50] text-2xl text-white">✓</div>
          <h3 className="text-xl font-bold text-[#176b50]">ورود سبدها ثبت و نشست سورتینگ قفل شد</h3>
          <p className="my-3 text-[13px]">{inputCodes.length} سبد با وزن ورودی {inputWeight.toFixed(3)} کیلوگرم اکنون در وضعیت «در حال سورت» هستند.</p>
          <p className="text-[12px] text-[#718079]">خاموش یا روشن‌شدن سیستم وضعیت نشست را از بین نمی‌برد؛ خروج سورتینگ از کلید مستقل میز کار ثبت می‌شود.</p>
        </Card>
      ) : step === "done" ? (
        <Card className="p-7 text-center">
          <h3 className="text-xl font-bold text-[#176b50]">
            سورت و مسیر خروجی‌ها ثبت شد
          </h3>
          <p className="my-3">
            {inputCodes.length} ورودی → {outputs.length} بچ مستقل،{" "}
            {total.toFixed(3)} کیلوگرم.
          </p>
          <p className="text-[12px]">
            موقعیت، حرکت و شجره همه خروجی‌ها در همان نشست ثبت شد.
          </p>
        </Card>
      ) : (
        <>
          {step === "input" && <>
            <SortingScaleConsole
              mode="entry"
              code={sources[sources.length - 1]?.code || eligibleSources[0]?.code}
              gross={Number(sources[sources.length - 1]?.gross || 0)}
              tare={Number(sources[sources.length - 1]?.tare || 0)}
              net={Number(entryWeights[pwCode(sources[sources.length - 1]?.code)] ?? ((sources[sources.length - 1]?.gross || 0) - (sources[sources.length - 1]?.tare || 0)))}
              previousNet={Number((sources[sources.length - 1]?.gross || 0) - (sources[sources.length - 1]?.tare || 0))}
              onRead={() => sources[sources.length - 1] && captureEntryWeight(sources[sources.length - 1])}
            />
            <Card className="p-5">
            <h3 className="font-bold mb-3">ورود به سورتینگ · اسکن سبدهای ورودی</h3>
            {step === "input" && (
              <><div aria-label="سبدهای شناسایی‌شده برای سورت" className="mb-3 rounded-lg bg-[#edf8f3] p-3 text-[11px] text-[#365c4f]"><b>{eligibleSources.length} سبد موجود در سردخانه و آماده ورود به سورت شناسایی شد.</b>{eligibleSources.length>0?<span className="block mt-1 font-mono">سبد بعدی: {eligibleSources[0].code} · {eligibleSources[0].product}</span>:<span className="block mt-1">سبد آزاد و قابل‌استفاده‌ای در سردخانه وجود ندارد.</span>}</div><div className="flex gap-2"><input aria-label="اسکن QR ورود سورتینگ" className={field + " font-mono"} value={scanCode} onChange={(event) => setScanCode(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") scanInput() }} placeholder="اسکن QR سبد ورودی"/><button className={primary} disabled={!scanCode.trim()} onClick={() => scanInput()}>افزودن سبد</button><button className="rounded-lg border border-[#176b50] px-4 text-[12px] font-bold text-[#176b50]" onClick={() => setInputScanOpen(true)}>⌗ شبیه‌ساز اسکن</button></div><ScanSimulator open={inputScanOpen} title="اسکن سبد ورودی سورتینگ" suggestedCode={eligibleSources[0]?.code || ""} onClose={() => setInputScanOpen(false)} onScan={scanInput}/></>
            )}
            <div className="mt-3 divide-y">
              {sources.map((source: any) => (
                <div
                  key={source.code}
                  className="flex justify-between py-2 text-[12px]"
                >
                  <button
                    onClick={() => {
                      setInputCodes(
                        inputCodes.filter((code) => code !== source.code),
                      )
                      const next = { ...entryWeights }
                      delete next[pwCode(source.code)]
                      setEntryWeights(next)
                    }}
                    className="text-red-700"
                    disabled={step !== "input"}
                  >
                    حذف
                  </button>
                  <span className="flex items-center gap-2">
                    {entryWeights[pwCode(source.code)] !== undefined
                      ? `وزن ورود ${entryWeights[pwCode(source.code)].toFixed(3)} kg`
                      : `آخرین وزن ${(source.gross - source.tare).toFixed(3)} kg`}
                    <button onClick={() => captureEntryWeight(source)} className="rounded-lg border border-[#176b50] px-3 py-1 text-[#176b50]">⚖ دریافت وزن از ترازو (اختیاری)</button>
                  </span>
                  <b className="font-mono">{source.code}</b>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-[#e7f1ec] rounded-lg text-[12px]">
              {sources.length} سبد · وزن قابل سورت{" "}
              <b>{inputWeight.toFixed(3)} kg</b>
            </div>
            {step === "input" ? (
              <button
                className={primary + " mt-3"}
                disabled={!inputCodes.length}
                onClick={start}
              >
                قفل سبدها و شروع سورتینگ
              </button>
            ) : (
              <span className="block mt-3 text-[#176b50] text-[12px]">
                ✓ {inputCodes.length} ورودی قفل شد
              </span>
            )}
          </Card></>}
          {step === "output" && (activeSortingSession ? (
            <>
            <SortingScaleConsole
              mode="exit"
              code={outputCode || pool.find((c) => !outputs.some((o) => pwCode(o.code) === pwCode(c.qr || c.code)))?.qr}
              gross={Number(gross || 0)}
              tare={tare}
              net={gross && net > 0 ? net : 0}
              onRead={() => carrier && scale === "STABLE" && setGross((Math.min(18.5, Math.max(0, inputWeight - total)) + tare).toFixed(3))}
            />
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Card className="p-4">
                <h3 className="font-bold mb-3">
                  خروج از سورتینگ · اسکن، توزین و تعیین مقصد هر خروجی
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[12px]">
                    سبد خروجی
                    <div className="flex gap-2">
                    <input
                      aria-label="کد سبد خروجی سورت"
                      className={field + " font-mono"}
                      value={destination==="WASTE"?"بدون تخصیص سبد":outputCode}
                      disabled={destination==="WASTE"}
                      onChange={(e) => setOutputCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") scanOutput()
                      }}
                      placeholder="اسکن QR سبد خالی"
                    />
                    <button
                      type="button"
                      className="shrink-0 rounded-lg border border-[#176b50] px-3 text-[11px] font-bold text-[#176b50]"
                      disabled={destination==="WASTE"}
                      onClick={() => setOutputScanOpen(true)}
                    >
                      شبیه‌ساز اسکن
                    </button>
                    </div>
                    <span className="mt-1 block text-[10px] text-[#718079]">
                      اسکن سخت‌افزاری و شبیه‌ساز هر دو همین اعتبارسنجی را اجرا می‌کنند.
                    </span>
                  </label>
                  <label className="text-[12px]">
                    مقصد نهایی
                    <select
                      aria-label="مقصد نهایی خروجی سورت"
                      className={field}
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      {Object.entries(destinationLabel).map(([id, label]) => (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="col-span-2 flex items-center gap-2 rounded-xl border border-[#d4e2db] bg-[#f8fbfa] p-3 text-[12px]"><input type="checkbox" checked={qualityCheckRequired} onChange={e=>setQualityCheckRequired(e.target.checked)}/><span><b>نیازمند کنترل کیفیت در خروج این مرحله</b><small className="block text-[#718079]">مسیر بعدی تا تصمیم مدیر متوقف و این خروجی علامت‌گذاری می‌شود.</small></span></label>
                  <label className="text-[12px]">
                    گرید نهایی
                    <select
                      className={field}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                    >
                      {productGrades.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[12px]">
                    اندازه نهایی
                    <select
                      className={field}
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    >
                      {["درشت", "متوسط", "ریز", "مخلوط"].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[12px]">
                    وزن ناخالص (kg)
                    <input
                      type="number"
                      step="0.001"
                      className={field}
                      value={gross}
                      onChange={(e) => setGross(e.target.value)}
                    />
                  </label>
                  <label className="text-[12px]">
                    وضعیت لودسل
                    <select
                      className={field}
                      value={scale}
                      onChange={(e) => setScale(e.target.value)}
                    >
                      <option value="STABLE">متصل · پایدار</option>
                      <option value="UNSTABLE">ناپایدار</option>
                      <option value="OFFLINE">قطع</option>
                    </select>
                  </label>
                </div>
                <ScanSimulator
                  open={outputScanOpen}
                  title="اسکن سبد خالی خروجی سورتینگ"
                  suggestedCode={
                    pool.find(
                      (c) =>
                        !outputs.some(
                          (o) => pwCode(o.code) === pwCode(c.qr || c.code),
                        ),
                    )?.qr ||
                    pool.find(
                      (c) =>
                        !outputs.some(
                          (o) => pwCode(o.code) === pwCode(c.qr || c.code),
                        ),
                    )?.code ||
                    ""
                  }
                  onClose={() => setOutputScanOpen(false)}
                  onScan={scanOutput}
                />
                <div className="flex items-center justify-between rounded-xl bg-[#102f29] text-white p-4 my-3">
                  <span className="text-[12px]">
                    خالص = ناخالص − وزن خالی ({tare.toFixed(3)})
                  </span>
                  <b className="text-xl font-mono">
                    {gross && net > 0 ? net.toFixed(3) : "0.000"} kg
                  </b>
                  <button
                    className="border border-white/40 rounded-lg px-3 py-2 text-[11px]"
                    disabled={!carrier || scale !== "STABLE"}
                    onClick={() =>
                      setGross(
                        (
                          Math.min(18.5, Math.max(0, inputWeight - total)) +
                          tare
                        ).toFixed(3),
                      )
                    }
                  >
                    دریافت از ترازو
                  </button>
                </div>
                <p className="mb-3 rounded-lg border border-[#cde3da] bg-[#edf7f3] p-3 text-[12px] text-[#176b50]">
                  شجره والد این خروجی خودکار و متناسب با وزن ثبت‌شده سبدهای ورودی نشست محاسبه می‌شود.
                </p>
                {carrier && destination!=="WASTE" && (
                  <label className="flex gap-2 text-[12px] mb-3">
                    <input
                      type="checkbox"
                      checked={staged.includes(outputCode)}
                      onChange={(e) =>
                        setStaged(
                          e.target.checked
                            ? [...staged, outputCode]
                            : staged.filter((x) => x !== outputCode),
                        )
                      }
                    />
                    حضور فیزیکی این سبد در سورتینگ تأیید شد
                  </label>
                )}
                {warning && (
                  <p className="p-3 bg-[#fff3d6] rounded-lg text-[12px] mb-3">
                    هشدار زون ظرف ثبت می‌شود.
                  </p>
                )}
                <button
                  className={primary + " w-full"}
                  disabled={
                    (destination!=="WASTE"&&!carrier) ||
                    !gross ||
                    scale !== "STABLE" ||
                    (destination!=="WASTE"&&!staged.includes(outputCode))
                  }
                  onClick={add}
                >
                  ثبت این خروجی و ادامه
                </button>
                <div className="mt-4 divide-y">
                  {outputs.map((o, n) => (
                    <div
                      key={o.code||`waste-${n}`}
                      className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 py-3 text-[12px]"
                    >
                      <b>{o.code||"بدون سبد"}</b>
                      <span>{o.weight.toFixed(3)} kg</span>
                      <span>{destinationLabel[o.destination]}</span>
                      <button
                        className="text-red-700"
                        onClick={() =>
                          setOutputs(outputs.filter((_, i) => i !== n))
                        }
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-4 h-fit">
                <h3 className="font-bold mb-4">تراز وزن</h3>
                <p className="flex justify-between my-3">
                  ورودی <b>{inputWeight.toFixed(3)} kg</b>
                </p>
                <p className="flex justify-between my-3">
                  خروجی <b>{total.toFixed(3)} kg</b>
                </p>
                <p className="flex justify-between my-3">
                  افت <b>{loss.toFixed(3)} kg</b>
                </p>
                <label className="text-[12px]">
                  دلیل افت
                  <select
                    className={field + " mt-2"}
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value)}
                  >
                    <option value="">بدون افت</option>
                    {[
                      "WASTE",
                      "DAMAGE",
                      "MOISTURE_LOSS",
                      "RESIDUAL_MATERIAL",
                      "MEASUREMENT_VARIANCE",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <button
                  className={primary + " w-full mt-4"}
                  disabled={
                    !outputs.length ||
                    loss < -0.001 ||
                    (loss > 0 && !lossReason)
                  }
                  onClick={finish}
                >
                  تکمیل سورت و ساخت مسیرها
                </button>
                <p className="p-3 mt-3 text-[12px] bg-[#e7f1ec] rounded-lg">
                  شست‌وشو مقصد نیست؛ برای خشک، فریز و فریزدرای خودکار است. ارسال
                  تازه هرگز شسته نمی‌شود.
                </p>
              </Card>
            </div>
            </>
            ) : (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-bold text-[#a43838]">نشست فعالی برای خروج سورتینگ وجود ندارد</h3>
                <p className="mt-2 text-[12px] text-[#718079]">ابتدا از کلید مستقل «ورود به سورتینگ» سبدها را اسکن و نشست را قفل کنید.</p>
              </Card>
            )
          )}
        </>
      )}
    </div>
  )
}

