function ProductionInventorySummary({ history = false }: { history?: boolean }) {
  const ledger = readProductionLedger();
  const items = ledger.items.filter(x => !x.demo && (history || !x.consumed));
  const [query, setQuery] = useState("");
  const rows = items.filter(x => [x.code, x.containerCode, x.parentId, x.product, ...x.inputCodes].join(" ").toLowerCase().includes(query.toLowerCase()));
  return <section className="flex-1 min-h-0 overflow-auto p-4 bg-[#f4f7f5] text-[#18302a] border-t border-[#d8e4df]" dir="rtl"><h2 className="text-lg font-bold mb-1">{history ? "رهگیری تولید" : "موجودی حاصل از تولید"}</h2><p className="text-[11px] text-[#718079] mb-2">همان خروجی‌های ثبت‌شده در تولید؛ ورودی مصرف‌شده دوباره در موجودی قابل مصرف شمرده نمی‌شود.</p>
    <input aria-label="جست‌وجوی خروجی تولید" value={query} onChange={e => setQuery(e.target.value)} placeholder="کد بچ، ظرف، محصول یا مبدأ" className="border rounded-lg px-3 h-9 w-full mb-3"/>
    {!rows.length ? <p className="bg-white rounded-lg p-5">هنوز خروجی تولیدی در این فهرست وجود ندارد.</p> : rows.map(item => <details key={item.id} className="border rounded-xl bg-white mb-3 p-4"><summary className="cursor-pointer"><b>{item.code}</b> · {item.product} · {item.grade}/{item.size} · <b>{item.weightKg.toFixed(3)} kg</b> · {PW_STAGES[item.stage]} · {PW_ZONES[item.zone] || item.zone}</summary><div className="text-[13px] mt-3 space-y-2"><p>والد: {item.parentId} · ظروف ورودی: {item.inputCodes.join("، ")}</p><p>ظرف فعلی: {item.containerCode || item.trays.map(t => t.code).join("، ") || "تخلیه‌شده"}</p>{ledger.events.filter(e => e.entity === item.id || e.details.children?.includes(item.id) || e.details.batches?.includes(item.id) || e.details.weights?.some((w: any) => w.code === item.id)).map(e => <p key={e.seq} className="border-t pt-2">#{e.seq} · {e.action} · {new Date(e.at).toLocaleString("fa-IR")}</p>)}</div></details>)}
  </section>;
}
function InventoryScreen() { return <div className="flex flex-col flex-1 min-h-0 overflow-hidden"><ReceivingInventoryScreen/><ProductionInventorySummary/></div>; }
function TraceScreen() { return <div className="flex-1 min-h-0 overflow-auto"><ProductionInventorySummary history/><LegacyTraceScreen/></div>; }
