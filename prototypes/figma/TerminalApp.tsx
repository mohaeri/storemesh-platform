import { useEffect, useState } from "react";
import {
  authenticatePrototypeTerminal,
  TERMINAL_STATIONS,
  TerminalStationWorkspace,
  type PrototypeTerminalIdentity,
  type TerminalStationId,
} from "./WebApp";

let lastCycledSelect: HTMLSelectElement | null = null;
let lastCycleAt = 0;
function cycleTerminalSelect(event: any) {
  const directSelect = event.target instanceof Element ? event.target.closest("select") : null;
  const pointSelect = Number.isFinite(event.clientX) && Number.isFinite(event.clientY)
    ? Array.from(document.querySelectorAll<HTMLSelectElement>(".raspberry-terminal select:not([multiple])")).find((candidate) => { const box = candidate.getBoundingClientRect(); return event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom; })
    : null;
  const select = directSelect || pointSelect;
  if (!(select instanceof HTMLSelectElement) || select.disabled || select.multiple) return;
  const options = Array.from(select.options).filter((option) => !option.disabled && option.value !== "");
  if (!options.length) return;
  event.preventDefault();
  event.stopPropagation();
  const current = options.findIndex((option) => option.value === select.value);
  const now = performance.now();
  if (lastCycledSelect === select && now - lastCycleAt < 350) return;
  lastCycledSelect = select;
  lastCycleAt = now;
  const next = options[(current + 1 + options.length) % options.length];
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
  setter?.call(select, next.value);
  select.dispatchEvent(new Event("input", { bubbles: true }));
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function RaspberryTerminalStyles() {
  return <style>{`
    .raspberry-terminal { --terminal-green:#0f382f; --terminal-accent:#176b50; --terminal-gold:#c6a45c; }
    .raspberry-terminal * { box-sizing:border-box; }
    .raspberry-terminal button, .raspberry-terminal input, .raspberry-terminal select, .raspberry-terminal textarea { touch-action:manipulation; }
    .raspberry-terminal button { min-height:44px; }
    .raspberry-terminal input, .raspberry-terminal select { min-height:44px; font-size:14px !important; }
    .terminal-station-grid { height:min(100%,474px); grid-template-columns:repeat(5,minmax(0,1fr)); grid-template-rows:repeat(3,minmax(0,1fr)); }
    .terminal-station-card { min-height:0 !important; }
    .raspberry-terminal select:not([multiple]) { appearance:none; pointer-events:none; cursor:pointer; padding-inline:12px !important; background-image:none !important; user-select:none; }
    .raspberry-terminal textarea { min-height:76px; font-size:14px !important; }
    .raspberry-station-content { scrollbar-gutter:stable; overscroll-behavior:contain; }
    .raspberry-station-selector .terminal-selector-intro { display:none !important; }
    .raspberry-station-content > div { padding:12px !important; }
    .raspberry-station-content h1 { font-size:22px !important; }
    .raspberry-station-content h2 { font-size:20px !important; }
    .raspberry-station-content h3 { font-size:16px !important; }
    .raspberry-station-content table, .raspberry-station-content [role="table"] { font-size:12px !important; }
    .raspberry-station-content [data-scale-console] { display:none !important; }
    .terminal-shared-scale { min-height:82px; height:82px; }
    .terminal-shared-scale-grid { grid-template-columns:1.2fr .9fr 1.1fr auto; }

    .raspberry-station-content .rounded-2xl { border-radius:12px !important; }
    .raspberry-station-content .p-8 { padding:14px !important; }
    .raspberry-station-content .p-6 { padding:12px !important; }
    .raspberry-station-content .p-5 { padding:10px !important; }
    @media (max-width:1180px) {
      .raspberry-station-content .grid-cols-4 { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
      .raspberry-station-content .grid-cols-3 { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
      .raspberry-station-content .grid-cols-2 { grid-template-columns:minmax(0,1fr) !important; }
      .raspberry-station-content .xl\\:grid-cols-4 { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
    }
    @media (max-width:1180px) {
      .raspberry-terminal-header { min-height:50px !important; height:50px !important; padding-inline:8px !important; gap:8px !important; }
      .raspberry-terminal-header > div:first-child { gap:8px !important; }
      .raspberry-terminal-header button { min-height:38px !important; padding-inline:9px !important; font-size:10px !important; }
      .raspberry-workspace-header .terminal-header-logo { width:36px !important; height:36px !important; border-radius:10px !important; }
      .raspberry-workspace-header .terminal-header-brand { min-width:86px; }
      .raspberry-workspace-header .terminal-header-brand b { font-size:13px !important; }
      .raspberry-workspace-header .terminal-header-brand span { font-size:8px !important; }
      .raspberry-workspace-header .terminal-header-divider { height:26px; width:1px; background:#ffffff26; }
      .raspberry-workspace-header .terminal-workspace-title { min-width:0; }
      .raspberry-workspace-header .terminal-workspace-title small { display:block; color:#9fc4b6; font-size:8px; line-height:1.15; }
      .raspberry-workspace-header .terminal-workspace-title b { display:block; max-width:215px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:white; font-size:14px; line-height:1.35; }
      .raspberry-workspace-header .terminal-operator-chip { max-width:105px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; border-radius:8px; background:#ffffff12; padding:6px 8px; color:#d8ebe4; font-size:9px; }
      .raspberry-device-badges { display:none !important; }
      .raspberry-station-content > div { padding:8px !important; }
      .raspberry-station-content .grid-cols-4, .raspberry-station-content .grid-cols-3, .raspberry-station-content .grid-cols-2 { grid-template-columns:minmax(0,1fr) !important; }
      .terminal-shared-scale { min-height:74px; height:74px; padding:6px !important; }
      .terminal-shared-scale-grid { height:62px; gap:5px !important; }
      .terminal-shared-scale-cell { padding:4px 7px !important; }
      .terminal-shared-scale-weight { font-size:25px !important; }
      .raspberry-station-content .terminal-receiving-setup-grid { grid-template-columns:minmax(0,1fr) !important; gap:14px !important; }
      .raspberry-station-content .terminal-receiving-product-grid { grid-template-columns:repeat(3,minmax(0,1fr)) !important; }
      .raspberry-station-content .terminal-receiving-scan-actions { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
      .terminal-receiving-setup-card { min-height:284px; margin:12px 6px !important; padding:14px !important; display:flex; flex-direction:column; }
      .terminal-receiving-setup-card h4 { margin-bottom:16px !important; font-size:14px !important; }
      .terminal-receiving-setup-actions { margin-top:auto !important; }
      .terminal-receiving-setup-actions button { min-width:162px; height:50px !important; }
      .terminal-receiving-recent-hidden { display:none !important; }
      .terminal-receiving-recent-open { position:fixed !important; inset:72px 16px 16px 16px; z-index:120; overflow:auto; box-shadow:0 18px 50px #09231d70 !important; }
      .terminal-receiving-capture-card { min-height:188px; margin:18px 6px 0 !important; padding:12px !important; }
      .terminal-receiving-scan-actions { gap:78px !important; padding-inline:44px; }
      .terminal-receiving-scan-actions button { height:50px !important; }
      .terminal-receiving-product-grid { margin-top:16px; padding-inline:88px; gap:66px !important; }
      .terminal-receiving-capture-actions { min-height:78px; margin:18px 6px !important; padding:12px !important; align-items:center; }
      .terminal-receiving-capture-actions button { min-width:84px; height:50px; }
      .raspberry-login-card { grid-template-columns:.82fr 1.18fr !important; max-width:780px !important; }
      .raspberry-login-card > section { padding:16px !important; }
      .raspberry-login-intro p:not(.raspberry-login-kicker) { display:none !important; }
      .raspberry-login-intro h1 { font-size:22px !important; margin-top:8px !important; }
      .raspberry-login-device { margin-top:14px !important; padding:10px !important; }
      .raspberry-login-device > div:last-child { display:none !important; }
      .raspberry-station-selector { padding:10px !important; }
      .raspberry-station-selector .terminal-selector-intro { display:none !important; }
      .raspberry-station-selector .terminal-selector-intro { margin-bottom:10px !important; }
      .raspberry-station-selector .terminal-selector-intro p:last-child { display:none !important; }
      .raspberry-station-selector .terminal-selector-intro h1 { font-size:22px !important; }
      .raspberry-station-selector .terminal-station-card { padding:8px !important; }
    }
    @media (max-width:640px) {
      .raspberry-login-card { grid-template-columns:1fr !important; }
      .raspberry-login-intro { display:none !important; }
      .raspberry-workspace-header .terminal-header-brand { display:none !important; }
    }
  `}</style>;
}

function TerminalScaleBar({ station }: { station: TerminalStationId }) {
  const [snapshot, setSnapshot] = useState({ code: "در انتظار اسکن", detail: "RS485 · آنلاین", weight: "0.000 kg", label: "وزن آنلاین", hasAction: false });
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let cancelled = false;
    const connect = () => {
      if (cancelled) return;
      const consoleNode = document.querySelector<HTMLElement>(".raspberry-station-content [data-scale-console]");
      const strip = consoleNode?.querySelector<HTMLElement>(".terminal-scale-strip");
      if (!strip) {
        setSnapshot({ code: "در انتظار اسکن", detail: "RS485 · آنلاین", weight: "0.000 kg", label: "وزن آنلاین", hasAction: false });
        return;
      }
      const read = () => {
        const cells = strip.querySelectorAll<HTMLElement>(".terminal-scale-cell");
        setSnapshot({
          code: cells[0]?.querySelector("b")?.textContent?.trim() || "در انتظار اسکن",
          detail: cells[0]?.querySelector("small:last-child")?.textContent?.trim() || "RS485 · آنلاین",
          weight: strip.querySelector(".terminal-scale-weight")?.textContent?.replace(/\s+/g, " ").trim() || "0.000 kg",
          label: cells[2]?.querySelector("small")?.textContent?.trim() || "وزن آنلاین",
          hasAction: Boolean(strip.querySelector(".terminal-scale-action")),
        });
      };
      read();
      observer = new MutationObserver(read);
      observer.observe(strip, { subtree: true, childList: true, characterData: true, attributes: true });
    };
    const timer = window.setTimeout(connect, 0);
    return () => { cancelled = true; window.clearTimeout(timer); observer?.disconnect(); };
  }, [station]);
  const triggerActiveScale = () => document.querySelector<HTMLButtonElement>(".raspberry-station-content [data-scale-console] .terminal-scale-action")?.click();
  return <section className="terminal-shared-scale shrink-0 border-b border-[#245849] bg-[#07231a] p-2 text-white" dir="rtl" aria-label="باسکول مشترک ترمینال"><div className="terminal-shared-scale-grid grid h-full items-stretch gap-2"><div className="terminal-shared-scale-cell flex min-w-0 flex-col justify-center rounded-lg border border-[#255b49] bg-[#0b3025] px-3"><small className="text-[9px] text-[#8fb8aa]">باسکول مشترک · {TERMINAL_STATIONS.find(item=>item.id===station)?.label}</small><b className="truncate font-mono text-[13px] text-[#62e5ad]">{snapshot.code}</b><small className="truncate text-[8px] text-[#8fb8aa]">{snapshot.detail}</small></div><div className="terminal-shared-scale-cell flex flex-col justify-center rounded-lg border border-[#255b49] bg-[#0b3025] px-3"><small className="text-[9px] text-[#8fb8aa]">اتصال</small><b className="text-[12px] text-[#62e5ad]">● لودسل آنلاین</b><small className="text-[8px] text-[#8fb8aa]">COM 4 · 10 Hz</small></div><div className="terminal-shared-scale-cell flex flex-col justify-center rounded-lg border border-[#255b49] bg-[#041711] px-3"><small className="text-[9px] text-[#8fb8aa]">{snapshot.label}</small><b className="terminal-shared-scale-weight font-mono text-[29px] leading-none text-white" dir="ltr">{snapshot.weight}</b></div><button type="button" disabled={!snapshot.hasAction} onClick={triggerActiveScale} className="min-w-[116px] rounded-lg border border-[#36775f] bg-[#176b50] px-3 text-[11px] font-extrabold text-white disabled:cursor-default disabled:opacity-35">↻ ثبت وزن</button></div></section>;
}
function TerminalLogin({ onLogin }: { onLogin: (identity: PrototypeTerminalIdentity) => void }) {
  const [mode, setMode] = useState<"PASSWORD" | "QR">("PASSWORD");
  const [username, setUsername] = useState("ali.rezaei");
  const [password, setPassword] = useState("1234");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  const submit = (method: "PASSWORD" | "QR", scannedQr = qr) => {
    try {
      const identity = authenticatePrototypeTerminal({ method, username, password, qr: scannedQr });
      setError("");
      onLogin(identity);
    } catch (failure: any) {
      setError(failure.message || "ورود به ترمینال انجام نشد.");
    }
  };
  return (
    <main className="grid min-h-0 flex-1 place-items-center overflow-auto bg-[#eef4f1] p-6" dir="rtl">
      <div className="raspberry-login-card grid w-full max-w-[1040px] overflow-hidden rounded-3xl border border-[#cdded7] bg-white shadow-xl lg:grid-cols-[1fr_1.1fr]">
        <section className="raspberry-login-intro flex flex-col justify-between bg-[#0f382f] p-8 text-white">
          <div>
            <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#c6a45c] text-[15px] font-extrabold text-[#17342d]">SM</span>
            <p className="raspberry-login-kicker text-[11px] tracking-[.18em] text-[#8fb8aa]">FIXED RASPBERRY PI TERMINAL</p>
            <h1 className="mt-3 text-[28px] font-extrabold">ورود اپراتور</h1>
            <p className="mt-3 text-[13px] leading-7 text-[#b7d2c8]">پس از احراز هویت، اپراتور یکی از ۱۳ ایستگاه مجاز را انتخاب می‌کند و نشست عملیاتی روی همین ترمینال ساخته می‌شود.</p>
          </div>
          <div className="raspberry-login-device mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-[12px]">
            <div className="flex justify-between"><span className="text-[#9fc4b6]">شناسه دستگاه</span><b className="font-mono">RPI-TERM-IRAN-01</b></div>
            <div className="flex justify-between"><span className="text-[#9fc4b6]">نوع</span><b>Raspberry Pi · ثابت</b></div>
            <div className="border-t border-white/10 pt-3 text-center text-[#72d9ad]">● اسکنر متصل　● باسکول متصل　● چاپگر متصل</div>
          </div>
        </section>
        <section className="p-8">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#edf3f0] p-1">
            <button type="button" onClick={() => { setMode("PASSWORD"); setError(""); }} className={`rounded-lg px-4 py-3 text-[13px] font-bold ${mode === "PASSWORD" ? "bg-white text-[#176b50] shadow" : "text-[#718079]"}`}>نام کاربری و رمز</button>
            <button type="button" onClick={() => { setMode("QR"); setError(""); }} className={`rounded-lg px-4 py-3 text-[13px] font-bold ${mode === "QR" ? "bg-white text-[#176b50] shadow" : "text-[#718079]"}`}>اسکن QR اپراتور</button>
          </div>
          {error && <p role="alert" className="mb-4 rounded-xl bg-[#fbe6e6] p-3 text-[12px] text-[#a43838]">{error}</p>}
          {mode === "PASSWORD" ? (
            <form onSubmit={(event) => { event.preventDefault(); submit("PASSWORD"); }} className="space-y-4">
              <label className="block text-[12px] font-bold text-[#425b52]">نام کاربری<input autoFocus value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cbd9d3] px-4 text-left font-mono outline-none focus:border-[#176b50]" dir="ltr" /></label>
              <label className="block text-[12px] font-bold text-[#425b52]">رمز عبور<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-[#cbd9d3] px-4 text-left font-mono outline-none focus:border-[#176b50]" dir="ltr" /></label>
              <button type="submit" className="h-12 w-full rounded-xl bg-[#176b50] text-[14px] font-bold text-white hover:bg-[#125941]">ورود و ساخت نشست ترمینال</button>
              <p className="text-center text-[11px] text-[#87968f]">ورود آزمایشی لوکال: ali.rezaei / 1234</p>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid min-h-[150px] place-items-center rounded-2xl border-2 border-dashed border-[#78a99a] bg-[#f5faf8] text-center">
                <div><span className="text-[42px] text-[#176b50]">⌗</span><b className="mt-2 block text-[14px] text-[#18302a]">QR کارت اپراتور را اسکن کنید</b><small className="text-[#718079]">اسکنر سخت‌افزاری یا شبیه‌ساز از همین مسیر ورود استفاده می‌کند.</small></div>
              </div>
              <input autoFocus value={qr} onChange={(event) => setQr(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") submit("QR"); }} placeholder="کد QR اپراتور" className="h-12 w-full rounded-xl border border-[#cbd9d3] px-4 text-left font-mono outline-none focus:border-[#176b50]" dir="ltr" />
              <button type="button" onClick={() => { setQr("USR-U1"); submit("QR", "USR-U1"); }} className="h-12 w-full rounded-xl border border-[#176b50] bg-white text-[13px] font-bold text-[#176b50]">⌗ شبیه‌ساز اسکن QR اپراتور</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StationSelector({ onSelect }: { onSelect: (station: TerminalStationId) => void }) {
  return (
    <main className="raspberry-station-selector min-h-0 flex-1 overflow-hidden bg-[#f2f6f4] p-3" dir="rtl">
      <section className="h-full min-h-0">
        <div className="terminal-station-grid mx-auto grid w-full gap-3">
          {TERMINAL_STATIONS.map((station, index) => (
            <button key={station.id} type="button" aria-label={station.label} onClick={() => onSelect(station.id)} className="terminal-station-card group flex flex-col items-center justify-center rounded-2xl border border-[#d5e2dc] bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#176b50] hover:shadow-lg">
              <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[#e4f3ed] font-mono text-[13px] font-bold text-[#176b50]">{String(index + 1).padStart(2, "0")}</span>
              <b className="text-[15px] leading-6 text-[#17342d] group-hover:text-[#176b50]">{station.label}</b>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function TerminalApp({ onExit }: { onExit: () => void }) {
  const [identity, setIdentity] = useState<PrototypeTerminalIdentity | null>(null);
  const [station, setStation] = useState<TerminalStationId | null>(null);
  useEffect(() => {
    const root = document.querySelector(".raspberry-terminal");
    const handlePointerDown = (event: Event) => cycleTerminalSelect(event);
    root?.addEventListener("pointerdown", handlePointerDown, true);
    root?.addEventListener("click", handlePointerDown, true);
    return () => { root?.removeEventListener("pointerdown", handlePointerDown, true); root?.removeEventListener("click", handlePointerDown, true); };
  }, []);
  const selected = TERMINAL_STATIONS.find((item) => item.id === station);
  return (
    <div className="raspberry-terminal flex h-screen min-h-0 w-full flex-col overflow-hidden bg-[#f2f6f4]">
      <RaspberryTerminalStyles />
      <header className={`raspberry-terminal-header flex min-h-16 shrink-0 items-center justify-between gap-4 bg-[#0f382f] px-6 ${identity && station ? "raspberry-workspace-header" : ""}`} dir="rtl">
        <div className="flex items-center gap-4">
          <div className="terminal-header-logo grid h-10 w-10 place-items-center rounded-xl bg-[#c6a45c] text-[12px] font-extrabold text-white">SM</div>
          {identity && station ? (
            <>
              <div className="terminal-header-brand">
                <b className="block text-[15px] text-white">StoreMesh</b>
                <span className="text-[10px] text-[#a9c9bd]">RPI-TERM-IRAN-01</span>
              </div>
              <span className="terminal-header-divider" aria-hidden="true" />
              <div className="terminal-workspace-title">
                <small>ایستگاه {String(TERMINAL_STATIONS.findIndex(item => item.id === station) + 1).padStart(2, "0")} از ۱۳</small>
                <b>{selected?.label}</b>
              </div>
            </>
          ) : (
            <div>
              <b className="block text-[16px] text-white">ترمینال ایستگاهی StoreMesh</b>
              <span className="text-[12px] text-[#a9c9bd]">{!identity ? "RPI-TERM-IRAN-01 · در انتظار ورود" : `${identity.name} · ${identity.role}`}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {identity && station && <span className="terminal-operator-chip" title={`${identity.name} · ${identity.role}`}>{identity.name}</span>}
          <span className="raspberry-device-badges hidden rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-[#9fc4b6] lg:block">● اسکنر　● باسکول　● چاپگر</span>
          {identity && station && (
            <button type="button" onClick={() => setStation(null)} className="rounded-lg border border-[#78a99a] px-4 py-2 text-[12px] font-bold text-white hover:bg-white/10">
              انتخاب ایستگاه دیگر
            </button>
          )}
          <button type="button" onClick={() => { if (identity) { setStation(null); setIdentity(null); } else onExit(); }} className="rounded-lg bg-[#c6a45c] px-4 py-2 text-[12px] font-bold text-[#17342d]">
            {identity ? "خروج اپراتور" : "بازگشت به Hub"}
          </button>
        </div>
      </header>
      {!identity ? (
        <TerminalLogin onLogin={setIdentity} />
      ) : station ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden" data-terminal-station={station}>
          <TerminalScaleBar station={station} />
          <div className="raspberry-station-content flex min-h-0 flex-1 flex-col overflow-auto">
            <TerminalStationWorkspace station={station} />
          </div>
        </div>
      ) : (
        <StationSelector onSelect={setStation} />
      )}
    </div>
  );
}
