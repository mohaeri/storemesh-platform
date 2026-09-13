// Figma prototype fragment; assembled into WebApp.tsx. No backend calls.
function SortingScreen() {
  const batch = readPrototypeBatch(),
    ledger = readProductionLedger()
  const [step, setStep] = useState("input"),
    [inputCodes, setInputCodes] = useState<string[]>([]),
    [scanCode, setScanCode] = useState(""),
    [entryWeight, setEntryWeight] = useState(""),
    [entryWeights, setEntryWeights] = useState<Record<string, number>>({}),
    [outputCode, setOutputCode] = useState(""),
    [gross, setGross] = useState(""),
    [grade, setGrade] = useState("A"),
    [size, setSize] = useState("درشت"),
    [destination, setDestination] = useState("FRESH_EXPORT"),
    [contributions, setContributions] = useState<Record<string, string>>({}),
    [lossReason, setLossReason] = useState(""),
    [outputs, setOutputs] = useState<any[]>([]),
    [error, setError] = useState(""),
    [scale, setScale] = useState("STABLE"),
    [staged, setStaged] = useState<string[]>([])
  const fleet: any[] = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("storemesh.prototype.containers") || "[]",
      )
    } catch {
      return []
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
  const scannedSource = batch.baskets.find(
    (basket: any) => pwCode(basket.code) === pwCode(scanCode),
  )
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
    FRESH_EXPORT: "ارسال تازه · بدون شست‌وشو",
    DRYING: "خشک · شست‌وشو ← اسلایس ← خشک",
    FREEZING: "فریز · شست‌وشو ← اسلایس ← فریز",
    FREEZE_DRYING: "فریزدرای · شست‌وشو ← اسلایس ← فریز ← فریزدرای",
    QC: "کنترل کیفیت",
    COLD_ROOM_CLEAN: "سردخانه تمیز",
    COLD_ROOM_DIRTY: "سردخانه کثیف",
    WASTE: "دفع",
  }
  const productGrades = readMasterData().products.find(
    (item) => item.name === sources[0]?.product,
  )?.grades || ["A", "B", "C"]
  function scanInput() {
    const code = pwCode(scanCode),
      source = batch.baskets.find((b: any) => pwCode(b.code) === code)
    if (!source || blocked(source))
      return setError("سبد اسکن‌شده برای این نوبت سورت واجد شرایط نیست.")
    if (inputCodes.includes(source.code))
      return setError("این سبد قبلاً اسکن شده است.")
    if (!/سردخانه|COLD_ROOM|COLD_STORAGE/.test(source.zone || ""))
      return setError(
        "سبد باید ابتدا با اسکن گیت وارد سردخانه و سپس سورتینگ شود.",
      )
    if (sources.length && sources[0]?.product !== source.product)
      return setError("همه ورودی‌های یک نوبت سورت باید یک محصول باشند.")
    const last = Number(source.gross) - Number(source.tare || 0),
      weight = entryWeight === "" ? undefined : Number(entryWeight)
    if (weight !== undefined && (!Number.isFinite(weight) || weight <= 0))
      return setError("وزن ورود باید مثبت باشد.")
    setInputCodes([...inputCodes, source.code])
    if (weight !== undefined)
      setEntryWeights({ ...entryWeights, [pwCode(source.code)]: weight })
    setScanCode("")
    setEntryWeight("")
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
    if (
      sources.some(
        (source: any) =>
          !/سردخانه|COLD_ROOM|COLD_STORAGE/.test(source.zone || ""),
      )
    )
      return setError(
        "همه ورودی‌های سورت باید در سردخانه باشند؛ انتقال فیزیکی را ابتدا ثبت کنید.",
      )
    if (new Set(sources.map((source: any) => source.product)).size !== 1)
      return setError("همه ورودی‌های یک نوبت سورت باید یک محصول باشند.")
    setStep("output")
    setError("")
  }
  function add() {
    if (
      !carrier ||
      outputs.some((o) => o.code === outputCode) ||
      inputCodes.includes(outputCode)
    )
      return setError("سبد خروجی باید موجود، خالی و غیرتکراری باشد.")
    if (!staged.includes(outputCode))
      return setError("حضور فیزیکی سبد خروجی در سورتینگ را تأیید کنید.")
    if (scale !== "STABLE")
      return setError("ترازو قطع است یا وزن ناپایدار است.")
    if (
      !Number.isFinite(net) ||
      net <= 0 ||
      net > Number(carrier.capacity ?? carrier.capacityKg ?? Infinity) ||
      total + net > inputWeight + 0.001
    )
      return setError(
        "خالص خروجی باید مثبت و در محدوده ظرفیت و وزن ورودی باشد.",
      )
    const parentContributions =
      sources.length === 1
        ? [{ batchId: sources[0]!.code, inputWeightKg: net }]
        : sources
            .map((source: any) => ({
              batchId: source.code,
              inputWeightKg: Number(contributions[source.code] || 0),
            }))
            .filter((row: any) => row.inputWeightKg > 0)
    if (
      !parentContributions.length ||
      Math.abs(
        parentContributions.reduce(
          (sum: number, row: any) => sum + row.inputWeightKg,
          0,
        ) - net,
      ) > 0.001
    )
      return setError(
        "سهم واقعی والدها باید دقیقاً برابر وزن خالص باشد؛ صفر یعنی آن والد در این خروجی حضور ندارد.",
      )
    setOutputs([
      ...outputs,
      {
        code: outputCode,
        grade,
        size,
        gross: Number(gross),
        tare,
        weight: net,
        destination,
        parentContributions,
        designationWarning: !!warning,
      },
    ])
    setOutputCode("")
    setGross("")
    setContributions({})
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
          سورتینگ · ورودی اسکن‌محور، خروجی تک‌به‌تک
        </h2>
        <p className="text-[12px] text-[#718079] mt-1">
          اسکنر سخت‌افزاری هر سبد را مستقیم به نشست اضافه می‌کند؛ وزن ورود اختیاری
          و مقصد هر خروجی در همان لحظه ثبت می‌شود.
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
      {step === "done" ? (
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
          <button
            className={primary + " mt-5"}
            onClick={() => {
              setStep("input")
              setInputCodes([])
              setEntryWeights({})
              setOutputs([])
              setLossReason("")
              setStaged([])
            }}
          >
            نوبت سورت جدید
          </button>
        </Card>
      ) : (
        <>
          <Card className="p-4">
            <h3 className="font-bold mb-3">۱. اسکن سبدهای ورودی</h3>
            {step === "input" && (
              <ScanOptionalWeighTransition
                scan={scanCode}
                setScan={setScanCode}
                onScan={scanInput}
                lastWeight={
                  scannedSource
                    ? Number(scannedSource.gross) - Number(scannedSource.tare)
                    : undefined
                }
                weight={entryWeight}
                setWeight={setEntryWeight}
                action="ثبت اسکن و افزودن به نشست"
              />
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
                  <span>
                    {entryWeights[pwCode(source.code)] !== undefined
                      ? `وزن ورود ${entryWeights[pwCode(source.code)].toFixed(3)} kg`
                      : `بدون توزین · آخرین وزن ${(source.gross - source.tare).toFixed(3)} kg`}
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
                قفل ورودی‌های اسکن‌شده و شروع خروجی‌گیری
              </button>
            ) : (
              <span className="block mt-3 text-[#176b50] text-[12px]">
                ✓ {inputCodes.length} ورودی قفل شد
              </span>
            )}
          </Card>
          {step === "output" && (
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Card className="p-4">
                <h3 className="font-bold mb-3">
                  ۲. اسکن، توزین و تعیین مقصد هر خروجی
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[12px]">
                    سبد خروجی
                    <select
                      className={field}
                      value={outputCode}
                      onChange={(e) => setOutputCode(e.target.value)}
                    >
                      <option value="">انتخاب کنید…</option>
                      {pool
                        .filter(
                          (c) =>
                            !outputs.some((o) => o.code === (c.qr || c.code)),
                        )
                        .map((c) => (
                          <option key={c.qr || c.code} value={c.qr || c.code}>
                            {c.qr || c.code} · خالی{" "}
                            {c.tare ?? c.tareWeightKg ?? 0} kg
                          </option>
                        ))}
                    </select>
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
                {sources.length > 1 && (
                  <fieldset className="border border-dashed rounded-lg p-3 mb-3">
                    <legend className="text-[12px]">
                      سهم واقعی والدها در این خروجی
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {sources.map((source: any) => (
                        <label key={source.code} className="text-[12px]">
                          {source.code}
                          <input
                            type="number"
                            min="0"
                            step="0.001"
                            className={field}
                            value={contributions[source.code] || ""}
                            onChange={(e) =>
                              setContributions({
                                ...contributions,
                                [source.code]: e.target.value,
                              })
                            }
                            placeholder="۰ یعنی بدون سهم"
                          />
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {carrier && (
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
                    !carrier ||
                    !gross ||
                    scale !== "STABLE" ||
                    !staged.includes(outputCode)
                  }
                  onClick={add}
                >
                  ثبت این خروجی و ادامه
                </button>
                <div className="mt-4 divide-y">
                  {outputs.map((o, n) => (
                    <div
                      key={o.code}
                      className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 py-3 text-[12px]"
                    >
                      <b>{o.code}</b>
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
          )}
        </>
      )}
    </div>
  )
}
