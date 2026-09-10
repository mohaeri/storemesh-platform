import { useState } from "react";
type PrototypeBasket={id:number;code:string;product:string;grade:string;size:string;gross:number;tare:number;zone?:string;status?:string};
type PrototypeBatch={id:string;supplier:string;reference:string;createdAt:string;status:string;destination?:string;baskets:PrototypeBasket[];events:{time:string;title:string;detail:string}[]};
const PROTOTYPE_KEY="storemesh.prototype.batch";
function readPrototypeBatch():PrototypeBatch{try{const x=localStorage.getItem(PROTOTYPE_KEY);if(x)return JSON.parse(x)}catch{} return {id:"RCV-1405-0928",supplier:"گلخانه نمونه",reference:"BL-1405-091",createdAt:"امروز ۱۴:۳۰",status:"آماده انتقال",baskets:[{id:1,code:"TMP-7862368",product:"گوجه فرنگی",grade:"A",size:"درشت",gross:20,tare:1.28},{id:2,code:"BSK-0002",product:"گوجه فرنگی",grade:"A",size:"درشت",gross:20.38,tare:1.28},{id:3,code:"BSK-0003",product:"گوجه فرنگی",grade:"B",size:"متوسط",gross:19.12,tare:1.28}],events:[{time:"۱۴:۳۰",title:"ثبت محموله",detail:"ایستگاه دریافت وب"}]}}
function writePrototypeBatch(b:PrototypeBatch){localStorage.setItem(PROTOTYPE_KEY,JSON.stringify(b));window.dispatchEvent(new Event("storemesh-data"))}


type WebScreen =
  | "dashboard" | "receiving" | "containers"
  | "inventory" | "production" | "fresh-export"
  | "quality" | "packaging" | "consumables"
  | "shipments" | "transfers" | "tasks"
  | "printing" | "trace" | "config"
  | "master-data" | "users" | "overrides"
  | "audit" | "cloud" | "system" | "control-tower";

const sidebarSections: { label: string; item: string; screens: WebScreen[] }[] = [
  { label: "داشبورد", item: "dashboard", screens: ["dashboard"] },
  { label: "برج کنترل", item: "control-tower", screens: ["control-tower"] },
  { label: "دریافت", item: "receiving", screens: ["receiving", "containers"] },
  { label: "موجودی", item: "inventory", screens: ["inventory"] },
  { label: "تولید", item: "production", screens: ["production", "fresh-export"] },
  { label: "کیفیت", item: "quality", screens: ["quality"] },
  { label: "بسته‌بندی", item: "packaging", screens: ["packaging", "consumables"] },
  { label: "ارسال", item: "shipments", screens: ["shipments", "transfers"] },
  { label: "رهگیری", item: "trace", screens: ["trace", "tasks", "printing"] },
  { label: "تنظیمات", item: "config", screens: ["config", "master-data", "users", "overrides", "audit", "cloud", "system"] },
];

const subScreenLabels: Partial<Record<WebScreen, string>> = {
  receiving: "دریافت", containers: "کانتینرها",
  production: "تولید", "fresh-export": "صادرات تازه",
  packaging: "بسته‌بندی", consumables: "اقلام مصرفی",
  shipments: "ارسال‌ها", transfers: "انتقال",
  trace: "رهگیری", tasks: "کارها", printing: "چاپ و لیبل",
  config: "تنظیمات", "master-data": "داده‌های پایه", users: "کاربران",
  overrides: "لغو تصمیمات", audit: "حسابرسی", cloud: "ابری", system: "سیستم",
};

function getActiveSidebarSection(screen: WebScreen) {
  return sidebarSections.find((s) => s.screens.includes(screen));
}

function Sidebar({ screen, onNavigate }: { screen: WebScreen; onNavigate: (s: WebScreen) => void }) {
  const activeSection = getActiveSidebarSection(screen);
  return (
    <div className="flex flex-col bg-[#133a31] w-[220px] min-h-full px-3 py-4 shrink-0">
      <div
        className="bg-[#c6a45c] rounded-xl flex items-center justify-center mb-5"
        style={{ width: 40, height: 40 }}
      >
        <span className="font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold text-white text-[11px]">SM</span>
      </div>
      {sidebarSections.map((section) => {
        const isActive = activeSection?.item === section.item;
        return (
          <button
            key={section.item}
            onClick={() => onNavigate(section.screens[0] as WebScreen)}
            className={`w-full text-right px-3 py-2 rounded-lg mb-0.5 text-[13px] transition-colors ${
              isActive
                ? "bg-[rgba(255,255,255,0.08)] text-white border-r-2 border-[#c6a45c]"
                : "text-[#b7cec5] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
            dir="rtl"
          >
            <span className="font-['Vazirmatn:Regular',sans-serif]">{section.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-[#0f382f] h-14 flex items-center px-5 justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[15px]" dir="rtl">{title}</span>
        {subtitle && (
          <span className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[13px]">· {subtitle}</span>
        )}
      </div>
      <span className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[12px]">1920 × 1080</span>
    </div>
  );
}

function SubNav({ screens, active, onSelect }: { screens: WebScreen[]; active: WebScreen; onSelect: (s: WebScreen) => void }) {
  if (screens.length <= 1) return null;
  return (
    <div className="flex gap-1 px-4 pt-3 pb-0" dir="rtl">
      {screens.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`px-4 py-1.5 rounded-full text-[12px] font-['Vazirmatn:Regular',sans-serif] transition-colors ${
            s === active
              ? "bg-[#176b50] text-white"
              : "bg-[#e8efec] text-[#718079] hover:bg-[#d0e0da]"
          }`}
        >
          {subScreenLabels[s] || s}
        </button>
      ))}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-[#d8e4df] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="p-3 flex flex-col gap-1">
      <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]" dir="rtl">{label}</span>
      <span className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">{value}</span>
      {sub && <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[10px]">{sub}</span>}
    </Card>
  );
}

function GreenBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#176b50] text-white rounded-lg px-4 py-2 text-[13px] font-['Vazirmatn:Bold',sans-serif] font-bold hover:bg-[#14573f] transition-colors"
      dir="rtl"
    >
      {children}
    </button>
  );
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <div className="bg-[#f8faf9] border-b border-[#edf2ef] grid gap-2 px-4 py-2" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }} dir="rtl">
      {cols.map((c) => (
        <span key={c} className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#718079] text-[11px]">{c}</span>
      ))}
    </div>
  );
}

function TableRow({ cells, badge }: { cells: string[]; badge?: { text: string; color: string; bg: string } }) {
  return (
    <div className="grid gap-2 px-4 py-2.5 border-b border-[#edf2ef] hover:bg-[#fafcfb] transition-colors" style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }} dir="rtl">
      {cells.map((c, i) =>
        i === 0 && badge ? (
          <span key={i} className="inline-flex">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold" style={{ color: badge.color, background: badge.bg }}>{badge.text}</span>
          </span>
        ) : (
          <span key={i} className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">{c}</span>
        )
      )}
    </div>
  );
}

function Badge({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold" style={{ color, background: bg }}>
      {text}
    </span>
  );
}

function InputField({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1" dir="rtl">
      <label className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">{label}</label>
      <input
        className="bg-[#fbfdfc] border border-[#cbd8d2] rounded-lg px-3 py-2 text-[12px] font-['Vazirmatn:Regular',sans-serif] text-[#18302a] focus:outline-none focus:border-[#176b50] w-full"
        placeholder={placeholder || label}
        dir="rtl"
      />
    </div>
  );
}

/* ─── SCREEN CONTENTS ─── */

function DashboardScreen({ navigate }: { navigate: (s: WebScreen) => void }) {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">داشبورد</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">نمای کلی عملیات</p>
        </div>
        <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
      </div>

      {/* Today's card */}
      <div className="rounded-xl p-4 mb-4 text-white" style={{ background: "linear-gradient(166deg, #173f35 6%, #24785e 94%)" }}>
        <h3 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[18px] mb-1">امروز در سایت ایران</h3>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#bdd4cc] text-[12px]">وضعیت زنده جریان مواد از دریافت تا ارسال</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="دریافت امروز" value="۲۴.۸t" />
        <StatCard label="QC باز" value="۷" />
        <StatCard label="ارسال آماده" value="۳۲" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Distribution chart */}
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">توزیع موجودی</h4>
          <div className="space-y-2">
            {[{ label: "مخزن A", pct: 68 }, { label: "مخزن B", pct: 45 }, { label: "مخزن C", pct: 82 }].map(({ label, pct }) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079]">{label}</span>
                  <span className="font-['Vazirmatn:Bold',sans-serif] text-[#18302a]">{pct}%</span>
                </div>
                <div className="bg-[#e8efec] rounded-full h-1.5">
                  <div className="bg-[#35a17b] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Priority tasks */}
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">کارهای اولویت‌دار</h4>
          <div className="space-y-2">
            <div className="bg-white border border-[#d8e4df] rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#f8faf9]" onClick={() => navigate("quality")}>
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">بررسی اختلاف وزن</span>
              <Badge text="P4" color="#c64545" bg="#fbe6e6" />
            </div>
            <div className="bg-white border border-[#d8e4df] rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#f8faf9]" onClick={() => navigate("quality")}>
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">تصمیم QC</span>
              <Badge text="P3" color="#c67518" bg="#fff0dc" />
            </div>
            <div className="bg-white border border-[#d8e4df] rounded-lg px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#f8faf9]" onClick={() => navigate("receiving")}>
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">تأیید دریافت کانتینر</span>
              <Badge text="P2" color="#176b50" bg="#e1f2eb" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[
          { label: "دریافت", screen: "receiving" as WebScreen },
          { label: "موجودی", screen: "inventory" as WebScreen },
          { label: "کیفیت", screen: "quality" as WebScreen },
          { label: "ارسال", screen: "shipments" as WebScreen },
        ].map(({ label, screen }) => (
          <button
            key={screen}
            onClick={() => navigate(screen)}
            className="bg-white border border-[#d8e4df] rounded-xl p-3 text-center hover:bg-[#f4f7f5] hover:border-[#35a17b] transition-colors"
          >
            <span className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

type ReceivingBasket = { id:number; code:string; product:string; grade:string; size:string; gross:number; tare:number };

function ReceivingScreen({ navigate }: { navigate: (s: WebScreen) => void }) {
  const [stage,setStage]=useState<"setup"|"capture"|"review"|"done">("setup");
  const [supplier,setSupplier]=useState("");
  const [reference,setReference]=useState("");
  const [expected,setExpected]=useState(10);
  const [containerCode,setContainerCode]=useState("");
  const [product,setProduct]=useState("سیب قرمز");
  const [grade,setGrade]=useState("ممتاز");
  const [size,setSize]=useState("۷۰–۸۰");
  const [gross,setGross]=useState(24.68);
  const [tare,setTare]=useState(1.28);
  const [baskets,setBaskets]=useState<ReceivingBasket[]>([]);
  const [scanOpen,setScanOpen]=useState(false);
  const [createOpen,setCreateOpen]=useState(false);
  const [generatedCode,setGeneratedCode]=useState("");
  const options:Record<string,{grades:string[];sizes:string[]}>= {
    "سیب قرمز":{grades:["ممتاز","درجه یک","درجه دو"],sizes:["۶۰–۷۰","۷۰–۸۰","۸۰+"]},
    "پرتقال تامسون":{grades:["صادراتی","درجه یک"],sizes:["متوسط","درشت"]},
    "کیوی هایوارد":{grades:["صادراتی","درجه یک"],sizes:["۲۷–۳۰","۳۰–۳۳","۳۳+"]}
  };
  const net=Math.max(0,gross-tare);
  const total=baskets.reduce((sum,b)=>sum+b.gross-b.tare,0);
  const addBasket=()=>{if(!containerCode||gross<=0)return;setBaskets([...baskets,{id:baskets.length+1,code:containerCode,product,grade,size,gross,tare}]);setContainerCode("");setGross(0);setTare(1.28)};
  const selectClass="w-full h-11 rounded-lg border border-[#d9e3de] bg-white px-3 text-[12px] text-[#18302a] outline-none focus:border-[#176b50]";

  if(stage==="done") return <div className="flex-1 bg-[#f4f7f5] p-8 overflow-auto" dir="rtl"><Card className="max-w-3xl mx-auto mt-16 p-10 text-center"><div className="w-16 h-16 rounded-full bg-[#176b50] text-white text-[34px] flex items-center justify-center mx-auto mb-4">✓</div><h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[24px]">محموله تکمیل شد</h2><p className="text-[#718079] text-[13px] mt-2">بچ دریافت از داده‌های همین فرم ساخته شد و وظیفه انتقال داخلی در صف عملیات قرار گرفت.</p><div className="grid grid-cols-3 gap-3 my-7"><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">تعداد ظروف</small><b>{baskets.length}</b></div><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">وزن خالص</small><b>{total.toFixed(2)} kg</b></div><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">وضعیت</small><b className="text-[#176b50]">آماده انتقال</b></div></div><div className="flex justify-center gap-2"><button onClick={()=>navigate("transfers")} className="bg-[#176b50] text-white rounded-lg px-6 h-11 text-[12px] font-bold">باز کردن مرکز انتقال</button><button onClick={()=>{setStage("setup");setBaskets([])}} className="border border-[#d8e4df] rounded-lg px-5 h-11 text-[12px]">دریافت محموله جدید</button></div></Card></div>;

  return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
    <div className="flex items-start justify-between mb-4"><div><p className="text-[#176b50] text-[11px] font-bold">دریافت · {stage==="setup"?"محموله جدید":reference||"محموله جاری"}</p><h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">{stage==="setup"?"تعریف محموله ورودی":stage==="review"?"بازبینی و تکمیل محموله":"ثبت و توزین ظروف"}</h2><p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">{stage==="setup"?"اطلاعات بار را ثبت کنید؛ سپس ظروف را یکی‌یکی اسکن و توزین کنید.":supplier+" · پیشرفت "+baskets.length+" از "+expected+" ظرف"}</p></div><Badge text={stage==="setup"?"مرحله ۱ از ۳":stage==="capture"?"مرحله ۲ از ۳":"مرحله ۳ از ۳"} color="#176b50" bg="#e1f2eb" /></div>

    {stage==="setup"&&<Card className="p-5"><h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-4">مشخصات محموله</h4><div className="grid grid-cols-2 gap-3"><label className="text-[11px] font-bold text-[#435a52]">تأمین‌کننده<select className={selectClass} value={supplier} onChange={e=>setSupplier(e.target.value)}><option value="">انتخاب تأمین‌کننده…</option><option>باغداری سبز شمال</option><option>تعاونی کشاورزی دماوند</option><option>شرکت کشت البرز</option></select></label><label className="text-[11px] font-bold text-[#435a52]">شماره بارنامه / مرجع<input className={selectClass} value={reference} onChange={e=>setReference(e.target.value)} placeholder="مثلاً BL-1405-091" /></label><label className="text-[11px] font-bold text-[#435a52]">تعداد ظرف مورد انتظار<input type="number" className={selectClass} value={expected} onChange={e=>setExpected(Number(e.target.value))}/></label></div><div className="bg-[#edf8f3] rounded-xl p-4 mt-4 text-[12px] text-[#365c4f]"><b className="block mb-1">چرخه ثبت چندظرفی</b>برای هر ظرف، QR و وزن جداگانه ثبت می‌شود. «ثبت ظرف و ادامه» سطر جدید می‌سازد و فرم را برای ظرف بعدی آماده می‌کند.</div><div className="flex justify-end mt-4"><button disabled={!supplier} onClick={()=>setStage("capture")} className="bg-[#176b50] disabled:opacity-40 text-white rounded-lg px-6 h-11 text-[12px] font-bold">شروع ثبت ظروف ←</button></div></Card>}

    {stage==="capture"&&<><div className="grid grid-cols-[1.35fr_.65fr] gap-4"><Card className="p-4"><div className="flex items-center justify-between mb-3"><h4 className="font-bold text-[#18302a] text-[13px]">۱. شناسایی ظرف</h4><Badge text={(baskets.length+1)+" / "+expected} color="#176b50" bg="#e1f2eb" /></div><div className="flex gap-2"><input className={selectClass} value={containerCode} onChange={e=>setContainerCode(e.target.value)} placeholder="کد ظرف یا QR"/><button onClick={()=>setScanOpen(true)} className="shrink-0 bg-[#176b50] text-white rounded-lg px-4 text-[12px] font-bold">⌗ اسکن QR</button></div><button onClick={()=>setCreateOpen(true)} className="mt-2 border border-dashed border-[#42a981] text-[#176b50] rounded-lg px-3 py-2 text-[11px]">＋ ساخت ظرف یک‌بارمصرف و چاپ QR</button><h4 className="font-bold text-[#18302a] text-[13px] mt-5 mb-3">۲. مشخصات محصول</h4><div className="grid grid-cols-3 gap-2"><label className="text-[11px] font-bold">محصول<select className={selectClass} value={product} onChange={e=>{const v=e.target.value;setProduct(v);setGrade(options[v].grades[0]);setSize(options[v].sizes[0])}}>{Object.keys(options).map(v=><option key={v}>{v}</option>)}</select></label><label className="text-[11px] font-bold">گرید اظهارشده / اولیه<select className={selectClass} value={grade} onChange={e=>setGrade(e.target.value)}>{options[product].grades.map(v=><option key={v}>{v}</option>)}</select></label><label className="text-[11px] font-bold">اندازه اظهارشده / اولیه<select className={selectClass} value={size} onChange={e=>setSize(e.target.value)}>{options[product].sizes.map(v=><option key={v}>{v}</option>)}</select></label></div></Card><div className="rounded-2xl bg-[#102f29] text-white p-5 shadow-lg"><div className="flex justify-between text-[11px]"><span><i className="inline-block w-2 h-2 bg-[#55d69a] rounded-full ml-1"/>ترازوی ورودی ۰۱</span><b className="text-[#67e5a9]">متصل · پایدار</b></div><div className="text-center text-[34px] mt-4">⚖</div><small className="block text-center text-[#a8c2b8]">وزن ناخالص روی لودسل</small><strong className="block text-center text-[38px] font-mono my-1">{gross.toFixed(3)} <i className="text-[13px] not-italic">kg</i></strong><div className="border-y border-white/15 py-2 mt-3"><label className="flex items-center justify-between text-[11px]">وزن ظرف (Tare)<input type="number" step="0.01" value={tare} onChange={e=>setTare(Number(e.target.value))} className="w-24 bg-[#1a493d] border border-[#397064] rounded-md p-1 text-white"/></label><div className="flex justify-between text-[11px] mt-2"><span>وزن خالص</span><b>{net.toFixed(3)} kg</b></div></div><div className="text-[#67e5a9] text-[11px] text-center my-3">✓ قرائت پایدار · همین حالا</div><button onClick={()=>setGross(24.5+Math.random())} className="w-full bg-[#23594b] border border-[#4c796d] rounded-lg py-2 text-[11px]">↻ دریافت مجدد از لودسل</button></div></div><div className="bg-white rounded-xl border border-[#dce5e0] p-3 flex gap-2 mt-4"><button onClick={()=>setStage("setup")} className="bg-[#edf2ef] rounded-lg px-4 py-2 text-[11px]">بازگشت</button><button disabled={!containerCode||gross<=0} onClick={addBasket} className="bg-[#176b50] disabled:opacity-40 text-white rounded-lg px-5 py-2 text-[11px] font-bold">ثبت ظرف و ادامه</button><button disabled={!baskets.length} onClick={()=>setStage("review")} className="bg-[#133a31] disabled:opacity-40 text-white rounded-lg px-5 py-2 text-[11px] font-bold">بازبینی محموله</button></div></>}

    {stage!=="setup"&&<Card className="mt-4 overflow-hidden"><div className="p-3 border-b border-[#edf2ef] flex justify-between"><h4 className="font-bold text-[#18302a] text-[13px]">ظروف ثبت‌شده در این محموله</h4><span className="text-[11px] text-[#718079]">{baskets.length} ظرف · {total.toFixed(2)} کیلوگرم خالص</span></div>{baskets.length===0?<div className="m-4 border border-dashed border-[#ccd9d3] rounded-lg p-6 text-center text-[#82968e] text-[12px]">هنوز ظرفی ثبت نشده است؛ QR اولین ظرف را اسکن کنید.</div>:<><div className="grid grid-cols-[.35fr_1fr_1fr_1fr_.7fr_.7fr_.7fr_.7fr] bg-[#f3f6f4] px-3 py-2 text-[10px] text-[#718079]"><span>#</span><span>کد ظرف</span><span>محصول</span><span>گرید / اندازه</span><span>ناخالص</span><span>ظرف</span><span>خالص</span><span>عملیات</span></div>{baskets.map((b,i)=><div key={b.id} className="grid grid-cols-[.35fr_1fr_1fr_1fr_.7fr_.7fr_.7fr_.7fr] px-3 py-3 border-t border-[#edf2ef] text-[11px]"><span>{i+1}</span><b className="font-mono">{b.code}</b><span>{b.product}</span><span>{b.grade} · {b.size}</span><span>{b.gross.toFixed(2)}</span><span>{b.tare.toFixed(2)}</span><b>{(b.gross-b.tare).toFixed(2)}</b><button onClick={()=>setBaskets(baskets.filter(x=>x.id!==b.id))} className="text-[#b84242] text-right">حذف</button></div>)}</>}</Card>}

    {stage==="review"&&<div className="mt-4 bg-[#fff8e3] border border-[#ead995] rounded-xl p-4 flex items-center gap-3"><div className="ml-auto"><h4 className="font-bold text-[13px]">کنترل نهایی</h4><p className="text-[11px] text-[#6e654a]">{baskets.length<expected?"تعداد ثبت‌شده کمتر از انتظار است؛ برای ادامه می‌توانید برگردید یا اختلاف را آگاهانه ثبت کنید.":"تعداد ظروف با انتظار محموله مطابقت دارد."}</p></div><button onClick={()=>setStage("capture")} className="bg-white rounded-lg px-4 py-2 text-[11px]">افزودن/اصلاح ظروف</button><button onClick={()=>{const id="RCV-"+String(Date.now()).slice(-8);writePrototypeBatch({id,supplier,reference,createdAt:new Date().toLocaleTimeString("fa-IR"),status:"آماده انتقال",baskets,events:[{time:new Date().toLocaleTimeString("fa-IR"),title:"دریافت و توزین تکمیل شد",detail:supplier+" · "+baskets.length+" ظرف"}]});setStage("done")}} className="bg-[#176b50] text-white rounded-lg px-5 py-2 text-[11px] font-bold">تکمیل محموله و ایجاد وظیفه انتقال</button></div>}

    {scanOpen&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[480px] relative"><button onClick={()=>setScanOpen(false)} className="absolute left-4 top-3 text-[22px]">×</button><div className="h-56 border-2 border-dashed border-[#29a574] rounded-xl flex flex-col items-center justify-center text-[54px]">⌗<span className="text-[12px] text-[#668078]">QR را مقابل دوربین یا اسکنر بگیرید</span></div><button onClick={()=>{setContainerCode("BSK-"+String(baskets.length+1).padStart(4,"0"));setGross(24.68);setScanOpen(false)}} className="w-full mt-4 bg-[#176b50] text-white rounded-lg py-3 text-[12px] font-bold">شبیه‌سازی اسکن موفق</button></div></div>}
    {createOpen&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[560px] relative"><button onClick={()=>{setCreateOpen(false);setGeneratedCode("")}} className="absolute left-4 top-3 text-[22px]">×</button><h3 className="font-bold text-[#18302a] mb-4">ساخت ظرف یک‌بارمصرف و چاپ QR</h3>{!generatedCode?<><div className="grid grid-cols-2 gap-3"><label className="text-[11px] font-bold">نوع ظرف<select className={selectClass}><option>کارتن تأمین‌کننده</option><option>سبد تأمین‌کننده</option></select></label><label className="text-[11px] font-bold">وزن خالی (kg)<input type="number" className={selectClass} value={tare} onChange={e=>setTare(Number(e.target.value))}/></label></div><div className="bg-[#fff8e3] rounded-lg p-3 text-[11px] text-[#765b15] my-4">برای ظرف یک شناسه موقت یکتا ساخته و QR آن برای چاپ آماده می‌شود.</div><button onClick={()=>setGeneratedCode("TMP-"+String(Date.now()).slice(-7))} className="w-full bg-[#176b50] text-white rounded-lg px-5 py-3 text-[12px] font-bold">ایجاد شناسه و چاپ QR</button></>:<><div className="border border-[#b9ddce] bg-[#edf8f3] rounded-xl p-5 text-center"><div className="w-32 h-32 mx-auto bg-white border-4 border-[#18302a] grid place-items-center text-[58px] mb-3">⌗</div><small className="block text-[#4d6b60]">شناسه ظرف ایجاد شد</small><b className="block font-mono text-[22px] text-[#133a31] my-1">{generatedCode}</b><span className="inline-block mt-2 bg-[#d9f3e7] text-[#176b50] rounded-full px-3 py-1 text-[10px] font-bold">✓ QR برای چاپ آماده شد</span></div><div className="flex gap-2 mt-4"><button onClick={()=>setGeneratedCode("")} className="flex-1 bg-[#edf2ef] rounded-lg py-3 text-[11px]">ساخت مجدد</button><button onClick={()=>{setContainerCode(generatedCode);setGross(24.68);setCreateOpen(false);setGeneratedCode("")}} className="flex-[2] bg-[#176b50] text-white rounded-lg py-3 text-[12px] font-bold">استفاده از این کد در دریافت</button></div></>}</div></div>}
  </div>;
}

function ContainersScreen(){const STORE="storemesh.prototype.containers";const inputClass="w-full h-11 rounded-lg border border-[#d9e3de] bg-white px-3 text-[12px] text-[#18302a] outline-none focus:border-[#176b50]";const batch=readPrototypeBatch();const zones=[{id:"RECEIVING",label:"دریافت"},{id:"COLD_STORAGE",label:"سردخانه"},{id:"SORTING",label:"سورتینگ"},{id:"WASHING",label:"شست‌وشو"},{id:"SLICING",label:"اسلایس"},{id:"FREEZING",label:"فریز"},{id:"DRYING",label:"خشک‌کن"},{id:"PACKAGING",label:"بسته‌بندی"},{id:"SHIPPING",label:"ارسال"}];const seed=[{qr:"CTR-001",type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["RECEIVING","COLD_STORAGE","SORTING"],last:"امروز ۰۹:۳۰",status:"فعال"},{qr:"CTR-002",type:"سبد پلاستیکی",tare:1.3,capacity:25,zones:["RECEIVING"],last:"دیروز ۱۵:۱۰",status:"خراب",damageReason:"ترک بدنه",transferredTo:"CTR-003"},{qr:"CTR-003",type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["SORTING","WASHING","COLD_STORAGE"],last:"امروز ۱۱:۰۰",status:"فعال"}];const [rows,setRows]=useState<any[]>(()=>{try{return JSON.parse(localStorage.getItem(STORE)||"null")||seed}catch{return seed}});const [tab,setTab]=useState<"ACTIVE"|"DAMAGED"|"SINGLE_USE">("ACTIVE");const [modal,setModal]=useState<""|"CREATE"|"EDIT"|"DAMAGE">("");const [selectedRow,setSelectedRow]=useState<any>(null);const [created,setCreated]=useState("");const [damageReason,setDamageReason]=useState("");const [target,setTarget]=useState("");const blank={type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["RECEIVING","COLD_STORAGE","SORTING"]};const [form,setForm]=useState<any>(blank);const persist=(next:any[])=>{setRows(next);localStorage.setItem(STORE,JSON.stringify(next));window.dispatchEvent(new Event("storemesh-data"))};const toggle=(z:string)=>setForm((f:any)=>({...f,zones:f.zones.includes(z)?f.zones.filter((x:string)=>x!==z):[...f.zones,z]}));const prefix=(type:string)=>type==="سینی فرایندی"?"TRY":type==="کانتینر عمومی"?"CTR":"BSK";const create=()=>{if(form.tare<0||form.capacity<=form.tare||!form.zones.length)return;const p=prefix(form.type),n=rows.filter(r=>String(r.qr).startsWith(p+"-")).length+1,qr=p+"-"+String(n).padStart(4,"0");persist([...rows,{...form,qr,last:"استفاده نشده",status:"فعال",singleUse:false}]);setCreated(qr)};const openEdit=(r:any)=>{setSelectedRow(r);setForm({type:r.type,tare:r.tare,capacity:r.capacity,zones:[...r.zones]});setModal("EDIT")};const saveEdit=()=>{if(!selectedRow||form.tare<0||form.capacity<=form.tare||!form.zones.length)return;persist(rows.map(r=>r.qr===selectedRow.qr?{...r,tare:form.tare,capacity:form.capacity,zones:form.zones}:r));setModal("")};const markDamaged=()=>{if(!selectedRow||!damageReason.trim())return;persist(rows.map(r=>r.qr===selectedRow.qr?{...r,status:"خراب",damageReason,transferredTo:target||null,last:"امروز · گزارش خرابی"}:r));setModal("");setTab("DAMAGED")};const singles=batch.baskets.filter(b=>b.code.startsWith("TMP-")).map(b=>({qr:b.code,type:"ظرف یک‌بارمصرف تأمین‌کننده",tare:null,capacity:b.gross,zones:[b.zone||"RECEIVING"],last:batch.createdAt,status:"درحال‌استفاده",singleUse:true}));const shown=tab==="SINGLE_USE"?singles:rows.filter(r=>tab==="ACTIVE"?r.status==="فعال":r.status==="خراب");const zoneNames=(r:any)=>r.zones.map((z:string)=>zones.find(x=>x.id===z)?.label||z).join("، ");return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl"><div className="flex items-start justify-between mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">کانتینرها</h2><p className="text-[#718079] text-[13px]">چرخه عمر سبدهای دائمی و نمایش جداگانه ظروف یک‌بارمصرف</p></div><div className="flex gap-2 items-center"><Badge text="سایت ایران" color="#176b50" bg="#e1f2eb"/><button onClick={()=>{setForm(blank);setCreated("");setModal("CREATE")}} className="bg-[#176b50] text-white rounded-lg px-5 py-2 text-[12px] font-bold">+ سبد جدید</button></div></div><div className="grid grid-cols-3 gap-2 mb-4 max-w-2xl">{[{id:"ACTIVE",label:"سبدهای فعال",count:rows.filter(r=>r.status==="فعال").length},{id:"DAMAGED",label:"خراب / از رده خارج",count:rows.filter(r=>r.status==="خراب").length},{id:"SINGLE_USE",label:"ظروف یک‌بارمصرف",count:singles.length}].map(x=><button onClick={()=>setTab(x.id as any)} className={"rounded-xl border p-3 text-right "+(tab===x.id?"bg-[#176b50] text-white border-[#176b50]":"bg-white border-[#d8e4df]")}><b className="block text-[12px]">{x.label}</b><small>{x.count} مورد</small></button>)}</div><Card className="overflow-hidden"><div className="grid grid-cols-[.8fr_1fr_.7fr_.7fr_1.1fr_1.6fr_.8fr_1fr] gap-2 bg-[#eef3f0] px-3 py-2 text-[10px] text-[#718079]"><span>وضعیت</span><span>آخرین استفاده</span><span>ظرفیت</span><span>وزن خالی</span><span>نوع</span><span>زون‌های مجاز</span><span>کد QR</span><span>عملیات</span></div>{!shown.length?<div className="p-8 text-center text-[#718079] text-[12px]">موردی در این گروه وجود ندارد.</div>:shown.map((r:any)=><div key={r.qr} className="grid grid-cols-[.8fr_1fr_.7fr_.7fr_1.1fr_1.6fr_.8fr_1fr] gap-2 px-3 py-3 border-t text-[11px] items-center"><Badge text={r.status} color={r.status==="فعال"?"#16825b":r.status==="خراب"?"#b84242":"#9a6420"} bg={r.status==="فعال"?"#dff3e9":r.status==="خراب"?"#fbe6e6":"#fff0dc"}/><span>{r.last}</span><b>{r.capacity} kg</b><span>{r.singleUse?"—":r.tare+" kg"}</span><span>{r.type}</span><span>{zoneNames(r)}</span><b className="font-mono">{r.qr}</b><div className="flex gap-2">{tab==="ACTIVE"&&<><button onClick={()=>openEdit(r)} className="text-[#176b50] font-bold">ویرایش</button><button onClick={()=>{setSelectedRow(r);setDamageReason("");setTarget("");setModal("DAMAGE")}} className="text-[#b84242] font-bold">خرابی</button></>}{tab==="DAMAGED"&&<span className="text-[#718079]">کد قفل است</span>}{tab==="SINGLE_USE"&&<span className="text-[#718079]">غیرقابل استفاده مجدد</span>}</div></div>)}</Card>{tab==="SINGLE_USE"&&<div className="mt-3 bg-[#fff8e3] text-[#765b15] rounded-lg p-3 text-[11px]">ظروف یک‌بارمصرف در رهگیری باقی می‌مانند، اما وارد ناوگان سبدهای دائمی و انتخاب سورتینگ نمی‌شوند.</div>}{modal&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[720px] max-h-[90vh] overflow-auto relative"><button onClick={()=>setModal("")} className="absolute left-4 top-3 text-[22px]">×</button>{modal==="DAMAGE"?<><h3 className="font-bold text-[#18302a] text-[18px]">گزارش خرابی {selectedRow?.qr}</h3><p className="text-[#718079] text-[11px] mt-1">کد این سبد برای همیشه حفظ و قفل می‌شود و هرگز به سبد دیگری اختصاص نمی‌یابد.</p><label className="block text-[11px] font-bold mt-4">سبد سالم مقصد (در صورت وجود محصول)<select className={inputClass} value={target} onChange={e=>setTarget(e.target.value)}><option value="">سبد خالی است / انتقال لازم نیست</option>{rows.filter(r=>r.status==="فعال"&&r.qr!==selectedRow?.qr).map(r=><option value={r.qr}>{r.qr}</option>)}</select></label><label className="block text-[11px] font-bold mt-3">علت خرابی<textarea className="w-full border rounded-lg p-3 mt-1" value={damageReason} onChange={e=>setDamageReason(e.target.value)} placeholder="مثلاً شکستگی بدنه یا دسته"/></label><div className="bg-[#fbe6e6] text-[#9f3535] rounded-lg p-3 text-[11px] mt-3">این عملیات حذف نیست؛ سابقه سبد حفظ می‌شود و QR آن دیگر قابل استفاده نخواهد بود.</div><button disabled={!damageReason.trim()} onClick={markDamaged} className="w-full mt-4 bg-[#b84242] disabled:opacity-40 text-white rounded-lg py-3 text-[12px] font-bold">ثبت خرابی و قفل دائمی کد</button></>:!created?<><h3 className="font-bold text-[#18302a] text-[18px]">{modal==="CREATE"?"ساخت سبد جدید":"ویرایش سبد "+selectedRow?.qr}</h3><p className="text-[#718079] text-[11px] mt-1">مالکیت سبدهای دائمی همیشه «مجموعه» است. فقط وزن خالی، ظرفیت و زون‌های مجاز قابل اصلاح‌اند.</p><div className="grid grid-cols-3 gap-3 mt-4"><label className="text-[11px] font-bold">نوع سبد<select disabled={modal==="EDIT"} className={inputClass} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>سبد پلاستیکی</option><option>سبد استیل</option><option>سینی فرایندی</option><option>کانتینر عمومی</option></select></label><label className="text-[11px] font-bold">وزن خالی / Tare (kg)<input type="number" step="0.01" className={inputClass} value={form.tare} onChange={e=>setForm({...form,tare:Number(e.target.value)})}/></label><label className="text-[11px] font-bold">ظرفیت مجاز (kg)<input type="number" className={inputClass} value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})}/></label></div><h4 className="font-bold text-[12px] mt-5 mb-2">زون‌های مجاز (حداقل یک مورد)</h4><div className="grid grid-cols-3 gap-2">{zones.map(z=><button onClick={()=>toggle(z.id)} className={"rounded-lg border px-3 py-2 text-[11px] text-right "+(form.zones.includes(z.id)?"bg-[#e1f2eb] border-[#176b50] text-[#176b50]":"border-[#d8e4df]")}>{form.zones.includes(z.id)?"✓ ":""}{z.label}</button>)}</div><div className="bg-[#eef3f0] rounded-lg p-3 text-[11px] mt-4">پیشوند خودکار نوع: <b className="font-mono">{prefix(form.type)}-</b> · مالکیت: <b>مجموعه</b> · تاریخچه جداگانه کالیبراسیون ثبت نمی‌شود.</div><button disabled={!form.zones.length||form.tare<0||form.capacity<=form.tare} onClick={modal==="CREATE"?create:saveEdit} className="w-full mt-4 bg-[#176b50] disabled:opacity-40 text-white rounded-lg py-3 text-[12px] font-bold">{modal==="CREATE"?"ایجاد شناسه دائمی و QR":"ذخیره اصلاح وزن و زون‌ها"}</button></>:<div className="text-center"><div className="w-36 h-36 mx-auto border-4 border-[#18302a] grid place-items-center text-[64px]">⌗</div><small className="block mt-3 text-[#718079]">سبد مجموعه با موفقیت ساخته شد</small><b className="block font-mono text-[24px] text-[#133a31]">{created}</b><span className="inline-block mt-2 bg-[#dff3e9] text-[#176b50] rounded-full px-3 py-1 text-[10px]">QR آماده چاپ · کد دائمی و غیرقابل بازیافت</span><button onClick={()=>setModal("")} className="w-full mt-5 bg-[#176b50] text-white rounded-lg py-3 text-[12px] font-bold">بستن و مشاهده در فهرست</button></div>}</div></div>}</div>}function ReceivingInventoryScreen(){
 const [view,setView]=useState<"batches"|"containers">("batches"); const [query,setQuery]=useState(""); const [trace,setTrace]=useState<PrototypeBasket|null>(null); const receipt=readPrototypeBatch(); const consumed=readProductionLedger().consumedInputs; const batch={...receipt,baskets:receipt.baskets.filter(b=>!consumed.includes(receipt.id+":"+b.code))}; const total=batch.baskets.reduce((s,b)=>s+b.gross-b.tare,0);
 const rows=batch.baskets.filter(b=>[b.code,b.product,b.grade,batch.id].join(" ").includes(query));
 return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl"><div className="flex justify-between mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">موجودی و رهگیری</h2><p className="text-[#718079] text-[13px]">نمای سلسله‌مراتبی بچ، ظروف و زنجیره رویداد</p></div><Badge text="همگام با داده پروتوتایپ" color="#176b50" bg="#e1f2eb"/></div>
 <div className="grid grid-cols-4 gap-3 mb-4"><StatCard label="بچ فعال" value={batch.baskets.length?"۱":"۰"}/><StatCard label="ظروف بچ" value={String(batch.baskets.length)}/><StatCard label="وزن خالص" value={total.toFixed(2)+"kg"}/><StatCard label="وضعیت" value={batch.status}/></div>
 <Card><div className="p-3 flex justify-between border-b"><div className="flex gap-2"><button onClick={()=>setView("batches")} className={(view==="batches"?"bg-[#176b50] text-white":"bg-[#edf2ef]")+" px-4 h-9 rounded-lg text-[12px]"}>نمای بچ‌ها</button><button onClick={()=>setView("containers")} className={(view==="containers"?"bg-[#176b50] text-white":"bg-[#edf2ef]")+" px-4 h-9 rounded-lg text-[12px]"}>نمای ظروف</button></div><input value={query} onChange={e=>setQuery(e.target.value)} className="border rounded-lg px-3 h-9 text-[12px]" placeholder="جست‌وجوی بچ، QR یا محصول..."/></div>
 {view==="batches"?<div className="p-4"><div className="grid grid-cols-7 gap-3 text-[11px] text-[#718079] pb-2"><span>عملیات</span><span>وضعیت</span><span>مقصد</span><span>وزن خالص</span><span>تعداد ظروف</span><span>تأمین‌کننده</span><span>سریال بچ</span></div><div className="grid grid-cols-7 gap-3 items-center border-t py-4 text-[12px]"><button onClick={()=>setView("containers")} className="text-[#176b50] font-bold">بازکردن بچ ←</button><Badge text={batch.status} color="#176b50" bg="#dff3e9"/><span>{batch.destination||"در انتظار تخصیص"}</span><b>{total.toFixed(2)} kg</b><span>{batch.baskets.length} ظرف</span><span>{batch.supplier}</span><div className="flex items-center gap-2 font-mono"><span>{batch.id}</span><div className="relative group"><button className="w-5 h-5 rounded-full bg-[#dcebe5] text-[#176b50] font-bold">ⓘ</button><div className="hidden group-hover:block absolute z-40 top-7 left-0 w-[420px] bg-[#133a31] text-white rounded-xl shadow-2xl p-4 font-sans"><b className="block mb-2">ظروف عضو بچ · {batch.baskets.length} عدد</b>{batch.baskets.map(b=><div key={b.code} className="grid grid-cols-4 gap-2 py-2 border-t border-white/15 text-[11px]"><span>{(b.gross-b.tare).toFixed(2)} خالص</span><span>{b.tare.toFixed(2)} ظرف</span><span>{b.gross.toFixed(2)} ناخالص</span><span className="font-mono">{b.code}</span></div>)}</div></div></div></div></div>:<div><div className="grid grid-cols-8 gap-2 px-3 py-2 bg-[#f7faf8] text-[11px] text-[#718079]"><span>عملیات</span><span>وضعیت</span><span>موقعیت</span><span>خالص</span><span>گرید اولیه</span><span>محصول</span><span>بچ والد</span><span>ظرف</span></div>{rows.map(b=><div className="grid grid-cols-8 gap-2 px-3 py-3 border-t text-[11px] items-center"><button onClick={()=>setTrace(b)} className="text-[#176b50] font-bold">رهگیری ←</button><Badge text={b.status||batch.status} color="#176b50" bg="#dff3e9"/><span>{b.zone||batch.destination||"دریافت"}</span><b>{(b.gross-b.tare).toFixed(2)} kg</b><span>{b.grade}</span><span>{b.product}</span><span className="font-mono">{batch.id}</span><span className="font-mono">{b.code}</span></div>)}</div>}</Card>
 {trace&&<div className="fixed inset-0 bg-black/40 z-[90] flex items-center justify-center" onClick={()=>setTrace(null)}><div className="bg-white rounded-2xl w-[700px] overflow-hidden" onClick={e=>e.stopPropagation()}><div className="bg-[#133a31] text-white p-5 flex justify-between"><div><h3 className="font-bold">رهگیری ظرف {trace.code}</h3><p className="text-[11px] text-[#bcd4cc]">بچ والد {batch.id}</p></div><button onClick={()=>setTrace(null)}>×</button></div><div className="p-6"><div className="grid grid-cols-4 gap-2 mb-5">{[["ناخالص",trace.gross.toFixed(2)],["وزن ظرف",trace.tare.toFixed(2)],["خالص",(trace.gross-trace.tare).toFixed(2)],["موقعیت",trace.zone||batch.destination||"دریافت"]].map(x=><div className="bg-[#f1f6f3] p-3 rounded-xl"><small className="block text-[#718079]">{x[0]}</small><b>{x[1]}</b></div>)}</div><div className="border-r-2 border-[#b9d4ca] pr-5 space-y-4">{batch.events.slice().reverse().map(e=><div><b className="text-[12px] text-[#176b50]">{e.time} · {e.title}</b><p className="text-[11px] text-[#718079]">{e.detail}</p></div>)}</div></div></div></div>}</div>
}
// BEGIN PRODUCTION WORKSPACE
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

function ProductionInventorySummary({ history = false }: { history?: boolean }) {
  const ledger = readProductionLedger();
  const items = ledger.items.filter(x => !x.demo && (history || !x.consumed));
  const [query, setQuery] = useState("");
  const rows = items.filter(x => [x.code, x.containerCode, x.parentId, x.product, ...x.inputCodes].join(" ").toLowerCase().includes(query.toLowerCase()));
  return <section className="p-5 bg-[#f4f7f5] text-[#18302a]" dir="rtl"><h2 className="text-xl font-bold mb-2">{history ? "رهگیری تولید" : "موجودی حاصل از تولید"}</h2><p className="text-[12px] text-[#718079] mb-3">همان خروجی‌های ثبت‌شده در تولید؛ ورودی مصرف‌شده دوباره در موجودی قابل مصرف شمرده نمی‌شود.</p>
    <input aria-label="جست‌وجوی خروجی تولید" value={query} onChange={e => setQuery(e.target.value)} placeholder="کد بچ، ظرف، محصول یا مبدأ" className="border rounded-lg p-3 w-full mb-4"/>
    {!rows.length ? <p className="bg-white rounded-lg p-5">هنوز خروجی تولیدی در این فهرست وجود ندارد.</p> : rows.map(item => <details key={item.id} className="border rounded-xl bg-white mb-3 p-4"><summary className="cursor-pointer"><b>{item.code}</b> · {item.product} · {item.grade}/{item.size} · <b>{item.weightKg.toFixed(3)} kg</b> · {PW_STAGES[item.stage]} · {PW_ZONES[item.zone] || item.zone}</summary><div className="text-[13px] mt-3 space-y-2"><p>والد: {item.parentId} · ظروف ورودی: {item.inputCodes.join("، ")}</p><p>ظرف فعلی: {item.containerCode || item.trays.map(t => t.code).join("، ") || "تخلیه‌شده"}</p>{ledger.events.filter(e => e.entity === item.id || e.details.children?.includes(item.id) || e.details.batches?.includes(item.id) || e.details.weights?.some((w: any) => w.code === item.id)).map(e => <p key={e.seq} className="border-t pt-2">#{e.seq} · {e.action} · {new Date(e.at).toLocaleString("fa-IR")}</p>)}</div></details>)}
  </section>;
}
function InventoryScreen() { return <div className="flex-1 min-h-0 overflow-auto"><ReceivingInventoryScreen/><ProductionInventorySummary/></div>; }
function TraceScreen() { return <div className="flex-1 min-h-0 overflow-auto"><ProductionInventorySummary history/><LegacyTraceScreen/></div>; }

// END PRODUCTION WORKSPACE
function FreshExportScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">صادرات تازه</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">مدیریت صادرات محصولات تازه</p>
        </div>
        <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="صادرات امروز" value="۱۴.۵t" />
        <StatCard label="مقصدها" value="۶" />
        <StatCard label="در راه" value="۳" />
      </div>

      <Card>
        <div className="p-3 border-b border-[#edf2ef] flex justify-between items-center">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">محموله‌های صادراتی</h4>
          <GreenBtn>+ محموله جدید</GreenBtn>
        </div>
        <TableHeader cols={["وضعیت", "وزن (t)", "مقصد", "محصول", "شناسه"]} />
        {[
          { id: "EXP-001", product: "تماتو A", dest: "آلمان", weight: "۴.۸", status: "در راه", sc: "#176b50", sb: "#e1f2eb" },
          { id: "EXP-002", product: "خیار B", dest: "هلند", weight: "۳.۲", status: "بارگیری", sc: "#c67518", sb: "#fff0dc" },
          { id: "EXP-003", product: "فلفل A", dest: "انگلستان", weight: "۲.۵", status: "آماده", sc: "#35a17b", sb: "#dff3e9" },
        ].map((row, i) => (
          <TableRow key={i} cells={[row.status, row.weight, row.dest, row.product, row.id]} badge={{ text: row.status, color: row.sc, bg: row.sb }} />
        ))}
      </Card>
    </div>
  );
}

function QualityScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">کنترل کیفیت</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">بررسی و تصمیم‌گیری QC</p>
        </div>
        <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="در انتظار بررسی" value="۷" />
        <StatCard label="تأیید شده امروز" value="۴۲" />
        <StatCard label="رد شده" value="۳" />
        <StatCard label="نرخ قبولی" value="۹۳%" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">ثبت نتیجه QC</h4>
          <div className="space-y-2">
            <InputField label="⌗ اسکن نمونه" placeholder="شناسه نمونه" />
            <InputField label="رطوبت (%)" />
            <InputField label="درجه بریکس" />
            <InputField label="اندازه میانگین (mm)" />
            <div className="flex gap-2 mt-2">
              <button className="flex-1 bg-[#176b50] text-white rounded-lg py-2 text-[13px] font-['Vazirmatn:Bold',sans-serif] hover:bg-[#14573f]">تأیید</button>
              <button className="flex-1 bg-[#fbe6e6] text-[#c64545] rounded-lg py-2 text-[13px] font-['Vazirmatn:Bold',sans-serif] hover:bg-[#fad0d0]">رد</button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-3 border-b border-[#edf2ef]">
            <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">موارد در انتظار</h4>
          </div>
          <TableHeader cols={["اولویت", "محصول", "شناسه"]} />
          {[
            { id: "QC-007", product: "تماتو A گرید ۱", priority: "P4", sc: "#c64545", sb: "#fbe6e6" },
            { id: "QC-006", product: "خیار B", priority: "P3", sc: "#c67518", sb: "#fff0dc" },
            { id: "QC-005", product: "فلفل دلمه", priority: "P2", sc: "#176b50", sb: "#e1f2eb" },
            { id: "QC-004", product: "بادمجان", priority: "P1", sc: "#35a17b", sb: "#dff3e9" },
          ].map((row, i) => (
            <TableRow key={i} cells={[row.priority, row.product, row.id]} badge={{ text: row.priority, color: row.sc, bg: row.sb }} />
          ))}
        </Card>
      </div>
    </div>
  );
}

function PackagingScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">بسته‌بندی</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">مدیریت خطوط بسته‌بندی</p>
        </div>
        <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="خطوط فعال" value="۴" />
        <StatCard label="بسته‌بندی امروز" value="۶۸,۴۰۰" />
        <StatCard label="نرخ بهره‌وری" value="۸۸%" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">ثبت دستور بسته‌بندی</h4>
          <div className="space-y-2">
            <InputField label="محصول" />
            <InputField label="نوع بسته‌بندی" />
            <InputField label="تعداد واحد" />
            <InputField label="وزن هر واحد (g)" />
            <GreenBtn>شروع بسته‌بندی</GreenBtn>
          </div>
        </Card>

        <Card>
          <div className="p-3 border-b border-[#edf2ef]">
            <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">وضعیت خطوط</h4>
          </div>
          <TableHeader cols={["وضعیت", "محصول", "خط"]} />
          {[
            { line: "خط ۱", product: "تماتو ۵۰۰g", status: "فعال", sc: "#16825b", sb: "#dff3e9" },
            { line: "خط ۲", product: "خیار ۱kg", status: "فعال", sc: "#16825b", sb: "#dff3e9" },
            { line: "خط ۳", product: "فلفل ۲۵۰g", status: "توقف", sc: "#c67518", sb: "#fff0dc" },
            { line: "خط ۴", product: "بادمجان ۷۵۰g", status: "فعال", sc: "#16825b", sb: "#dff3e9" },
          ].map((row, i) => (
            <TableRow key={i} cells={[row.status, row.product, row.line]} badge={{ text: row.status, color: row.sc, bg: row.sb }} />
          ))}
        </Card>
      </div>
    </div>
  );
}

function ConsumablesScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">اقلام مصرفی</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">موجودی و سفارش مواد مصرفی</p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
          <GreenBtn>+ سفارش جدید</GreenBtn>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="اقلام کم‌موجود" value="۴" />
        <StatCard label="سفارش در راه" value="۲" />
        <StatCard label="مصرف هفتگی" value="۱۲.۴t" />
      </div>

      <Card>
        <TableHeader cols={["وضعیت", "موجودی", "واحد", "نام قلم"]} />
        {[
          { name: "سلفون بسته‌بندی", unit: "رول", qty: "۴۵", status: "کافی", sc: "#16825b", sb: "#dff3e9" },
          { name: "کارتن ۵kg", unit: "عدد", qty: "۱۲۰", status: "کم", sc: "#c67518", sb: "#fff0dc" },
          { name: "برچسب قیمت", unit: "برگ", qty: "۵۰۰", status: "کافی", sc: "#16825b", sb: "#dff3e9" },
          { name: "تسمه پلاستیک", unit: "رول", qty: "۸", status: "بحرانی", sc: "#c64545", sb: "#fbe6e6" },
          { name: "چسب حرارتی", unit: "کارتن", qty: "۳", status: "کم", sc: "#c67518", sb: "#fff0dc" },
        ].map((row, i) => (
          <TableRow key={i} cells={[row.status, row.qty, row.unit, row.name]} badge={{ text: row.status, color: row.sc, bg: row.sb }} />
        ))}
      </Card>
    </div>
  );
}

function ShipmentsScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">ارسال‌ها</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">مدیریت محموله‌های خروجی</p>
        </div>
        <div className="flex gap-2 items-center">
          <button className="border border-[#d8e4df] bg-white rounded-lg px-3 py-1.5 text-[12px] font-['Vazirmatn:Regular',sans-serif] text-[#718079]">خروجی Excel</button>
          <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
          <GreenBtn>+ ارسال جدید</GreenBtn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="آماده ارسال" value="۳۲" />
        <StatCard label="در حال ارسال" value="۸" />
        <StatCard label="تحویل داده شده" value="۱۲۴" />
        <StatCard label="برگشتی" value="۲" />
      </div>

      <div className="flex gap-2 mb-3">
        {["همه", "آماده", "در حال ارسال", "تحویل داده شده", "برگشتی"].map((f, i) => (
          <button key={f} className={`px-3 py-1.5 rounded-full text-[12px] font-['Vazirmatn:Regular',sans-serif] transition-colors ${i === 0 ? "bg-[#176b50] text-white" : "bg-[#e8efec] text-[#718079] hover:bg-[#35a17b] hover:text-white"}`}>
            {f}
          </button>
        ))}
      </div>

      <Card>
        <TableHeader cols={["وضعیت", "وزن", "مقصد", "محصول", "شناسه"]} />
        {[
          { id: "SHP-0081", product: "تماتو A", dest: "تهران", weight: "۵t", status: "آماده", sc: "#35a17b", sb: "#dff3e9" },
          { id: "SHP-0080", product: "خیار", dest: "اصفهان", weight: "۳.۲t", status: "در حال ارسال", sc: "#c67518", sb: "#fff0dc" },
          { id: "SHP-0079", product: "فلفل A", dest: "شیراز", weight: "۱.۸t", status: "تحویل داده شده", sc: "#16825b", sb: "#dff3e9" },
          { id: "SHP-0078", product: "بادمجان", dest: "مشهد", weight: "۲.۴t", status: "تحویل داده شده", sc: "#16825b", sb: "#dff3e9" },
        ].map((row, i) => (
          <TableRow key={i} cells={[row.status, row.weight, row.dest, row.product, row.id]} badge={{ text: row.status, color: row.sc, bg: row.sb }} />
        ))}
      </Card>
    </div>
  );
}

function TransfersScreen({navigate}:{navigate:(s:WebScreen)=>void}){
 const receipt=readPrototypeBatch(); const consumed=readProductionLedger().consumedInputs; const batch={...receipt,baskets:receipt.baskets.filter(b=>!consumed.includes(receipt.id+":"+b.code))}; const [kind,setKind]=useState<"internal"|"site">("internal"); const [stage,setStage]=useState<"setup"|"scan"|"done">("setup"); const [dest,setDest]=useState(""); const [moved,setMoved]=useState<string[]>([]); const ids=batch.baskets.map(b=>b.code); const internal=["قرنطینه QC","سردخانه ۱ · زون A","سردخانه ۱ · زون B","سورتینگ · خط ۱","بسته‌بندی · خط ۲","انبار محصول نهایی"];
 const complete=()=>{const updated={...batch,status:kind==="internal"?"موجودی فعال":"در راه",destination:dest,baskets:batch.baskets.map(b=>({...b,zone:dest,status:kind==="internal"?"قابل مصرف":"در راه"})),events:[...batch.events,{time:"همین حالا",title:kind==="internal"?"انتقال داخلی تکمیل شد":"مانیفست بین‌سایتی صادر شد",detail:dest+" · "+batch.baskets.length+" ظرف"}]};writePrototypeBatch({...updated,baskets:receipt.baskets.map(b=>updated.baskets.find(x=>x.code===b.code)||b)});setStage("done")};
 if(stage==="done")return <div className="flex-1 bg-[#f4f7f5] p-8" dir="rtl"><Card className="max-w-3xl mx-auto mt-12 p-9 text-center"><div className="w-16 h-16 rounded-full bg-[#176b50] text-white text-3xl mx-auto flex items-center justify-center">✓</div><h2 className="font-bold text-[23px] mt-4">{kind==="internal"?"انتقال داخلی ثبت شد":"مانیفست انتقال بین‌سایتی ساخته شد"}</h2><p className="text-[12px] text-[#718079] mt-2">{batch.id} · {batch.baskets.length} ظرف · مقصد {dest}</p><div className="flex gap-2 justify-center mt-6"><button onClick={()=>navigate("inventory")} className="bg-[#176b50] text-white h-11 px-6 rounded-lg">مشاهده موجودی و رهگیری</button><button onClick={()=>{setStage("setup");setMoved([]);setDest("")}} className="border h-11 px-5 rounded-lg">انتقال جدید</button></div></Card></div>;
 return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl"><div className="flex justify-between mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">مرکز انتقال</h2><p className="text-[#718079] text-[13px]">انتقال داخلی بین زون‌ها و فرایندها یا انتقال بین سایت‌ها</p></div><Badge text="کنترل مقصد بر اساس وضعیت کالا" color="#176b50" bg="#e1f2eb"/></div><div className="grid grid-cols-2 gap-3 mb-4"><button onClick={()=>{setKind("internal");setStage("setup");setDest("")}} className={(kind==="internal"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df] bg-white")+" border-2 rounded-xl p-4 text-right"}><b>انتقال داخلی سایت</b><p className="text-[11px] text-[#718079]">دریافت، قرنطینه، سردخانه، سورتینگ، تولید و بسته‌بندی</p></button><button onClick={()=>{setKind("site");setStage("setup");setDest("")}} className={(kind==="site"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df] bg-white")+" border-2 rounded-xl p-4 text-right"}><b>انتقال بین سایت‌ها</b><p className="text-[11px] text-[#718079]">ساخت مانیفست، ارسال، وضعیت در راه و تأیید تحویل</p></button></div>
 {stage==="setup"?<div className="grid grid-cols-3 gap-4"><Card className="col-span-2 p-5"><h3 className="font-bold mb-4">۱. تعریف مقصد مجاز</h3><div className="grid grid-cols-2 gap-3"><label className="text-[11px]">بچ/محموله مبدأ<input readOnly value={batch.id} className="w-full h-11 border rounded-lg px-3 mt-1 font-mono bg-[#f7faf8]"/></label><label className="text-[11px]">{kind==="internal"?"زون یا فرایند مقصد":"سایت مقصد"}<select value={dest} onChange={e=>setDest(e.target.value)} className="w-full h-11 border rounded-lg px-3 mt-1 bg-white"><option value="">انتخاب کنید...</option>{(kind==="internal"?internal:["سایت تبریز","سایت اصفهان","سایت شیراز"]).map(x=><option>{x}</option>)}</select></label></div>{dest&&<div className="mt-4 bg-[#edf8f3] rounded-xl p-4 text-[11px]"><b className="text-[#176b50]">مقصد بر اساس وضعیت فعلی مجاز است ✓</b><p className="mt-1">{kind==="internal"?"ظرف قرنطینه فقط به QC و محصول آزادشده به سردخانه/سورتینگ/بسته‌بندی منتقل می‌شود.":"پس از اسکن، مانیفست با شناسه shipment ساخته خواهد شد."}</p></div>}<button disabled={!dest} onClick={()=>setStage("scan")} className="mt-5 bg-[#176b50] disabled:bg-[#aab8b3] text-white h-11 px-6 rounded-lg">شروع عملیات اسکن</button></Card><Card className="p-5"><b>مبدأ</b><p className="font-mono text-[#176b50] mt-2">{batch.id}</p><div className="space-y-2 mt-4 text-[11px]"><div className="flex justify-between"><span>تأمین‌کننده</span><b>{batch.supplier}</b></div><div className="flex justify-between"><span>تعداد ظروف</span><b>{batch.baskets.length}</b></div><div className="flex justify-between"><span>وضعیت</span><b>{batch.status}</b></div></div></Card></div>:<div className="grid grid-cols-[1fr_320px] gap-4"><Card className="p-5"><h3 className="font-bold">۲. اسکن در گیت {dest}</h3><button onClick={()=>{const n=ids.find(x=>!moved.includes(x));if(n)setMoved([...moved,n])}} className="w-full h-14 border-2 border-dashed border-[#176b50] rounded-xl text-[#176b50] mt-4 font-bold">⌗ شبیه‌سازی اسکن ظرف بعدی</button><div className="mt-4">{moved.slice().reverse().map(x=><div className="flex justify-between border-t py-2 text-[11px]"><span className="text-[#176b50]">تأیید گیت ✓</span><span className="font-mono">{x}</span></div>)}</div></Card><Card className="p-5"><div className="w-28 h-28 rounded-full border-[10px] border-[#dbe9e3] mx-auto flex items-center justify-center"><b>{moved.length}/{ids.length}</b></div><button disabled={moved.length<ids.length} onClick={complete} className="w-full mt-5 bg-[#176b50] disabled:bg-[#aab8b3] text-white h-11 rounded-lg">{kind==="internal"?"تکمیل انتقال و ثبت موجودی":"صدور مانیفست و ارسال"}</button><button onClick={()=>setStage("setup")} className="w-full border h-10 rounded-lg mt-2">بازگشت</button></Card></div>}</div>
}
function TasksScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">کارها</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">صف کارها و وظایف اپراتورها</p>
        </div>
        <GreenBtn>+ کار جدید</GreenBtn>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="کارهای باز" value="۱۸" />
        <StatCard label="در حال انجام" value="۶" />
        <StatCard label="تکمیل شده امروز" value="۴۳" />
      </div>

      <Card>
        <TableHeader cols={["اولویت", "مسئول", "نوع کار", "شناسه"]} />
        {[
          { id: "TSK-018", type: "توزین دریافت", responsible: "علی رضایی", priority: "P4", sc: "#c64545", sb: "#fbe6e6" },
          { id: "TSK-017", type: "QC نمونه‌برداری", responsible: "فاطمه محمدی", priority: "P3", sc: "#c67518", sb: "#fff0dc" },
          { id: "TSK-016", type: "بسته‌بندی خط ۱", responsible: "احمد کریمی", priority: "P2", sc: "#176b50", sb: "#e1f2eb" },
          { id: "TSK-015", type: "انتقال به انبار", responsible: "مریم حسینی", priority: "P1", sc: "#35a17b", sb: "#dff3e9" },
          { id: "TSK-014", type: "چاپ لیبل", responsible: "حسن نصیری", priority: "P2", sc: "#176b50", sb: "#e1f2eb" },
        ].map((row, i) => (
          <TableRow key={i} cells={[row.priority, row.responsible, row.type, row.id]} badge={{ text: row.priority, color: row.sc, bg: row.sb }} />
        ))}
      </Card>
    </div>
  );
}

function PrintingScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">چاپ و لیبل</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">مدیریت چاپگرها و قالب‌های لیبل</p>
        </div>
        <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">چاپ لیبل جدید</h4>
          <div className="space-y-2">
            <InputField label="⌗ اسکن یا ورود شناسه" />
            <InputField label="قالب لیبل" placeholder="انتخاب قالب" />
            <InputField label="تعداد نسخه" />
            <InputField label="چاپگر" placeholder="انتخاب چاپگر" />
            <GreenBtn>ارسال به چاپگر</GreenBtn>
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">وضعیت چاپگرها</h4>
          <div className="space-y-2">
            {[
              { name: "چاپگر دریافت", status: "آنلاین", sc: "#16825b", sb: "#dff3e9" },
              { name: "چاپگر بسته‌بندی ۱", status: "آنلاین", sc: "#16825b", sb: "#dff3e9" },
              { name: "چاپگر بسته‌بندی ۲", status: "آفلاین", sc: "#c64545", sb: "#fbe6e6" },
              { name: "چاپگر ارسال", status: "آنلاین", sc: "#16825b", sb: "#dff3e9" },
            ].map((p) => (
              <div key={p.name} className="flex justify-between items-center py-2 border-b border-[#edf2ef]">
                <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">{p.name}</span>
                <Badge text={p.status} color={p.sc} bg={p.sb} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function LegacyTraceScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">رهگیری</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">ردیابی کامل جریان محصول</p>
        </div>
        <Badge text="سایت ایران" color="#176b50" bg="#e1f2eb" />
      </div>

      <Card className="p-4 mb-4">
        <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">جستجوی رهگیری</h4>
        <div className="flex gap-2">
          <input className="flex-1 bg-[#fbfdfc] border border-[#cbd8d2] rounded-lg px-3 py-2 text-[13px] font-['Vazirmatn:Regular',sans-serif] focus:outline-none focus:border-[#176b50]" placeholder="اسکن QR یا ورود شناسه محموله..." dir="rtl" />
          <GreenBtn>جستجو</GreenBtn>
        </div>
      </Card>

      <Card>
        <div className="p-3 border-b border-[#edf2ef]">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px]">تاریخچه محموله REC-047</h4>
        </div>
        <div className="p-4 space-y-3">
          {[
            { time: "امروز ۱۴:۳۰", event: "ارسال به مشتری", status: "تحویل", sc: "#16825b", sb: "#dff3e9" },
            { time: "امروز ۱۱:۰۰", event: "چاپ لیبل و بارگیری", status: "بارگیری", sc: "#c67518", sb: "#fff0dc" },
            { time: "امروز ۰۹:۱۵", event: "بسته‌بندی تکمیل شد", status: "بسته‌بندی", sc: "#176b50", sb: "#e1f2eb" },
            { time: "امروز ۰۸:۳۰", event: "تأیید QC: A+", status: "تأیید", sc: "#35a17b", sb: "#dff3e9" },
            { time: "دیروز ۱۶:۰۰", event: "دریافت از تأمین‌کننده", status: "دریافت", sc: "#718079", sb: "#e8efec" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: item.sc }} />
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px] w-28">{item.time}</span>
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px] flex-1">{item.event}</span>
              <Badge text={item.status} color={item.sc} bg={item.sb} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}function ControlTowerScreen() {
  const scenarios = ["جریان عادی", "رد QC", "کمبود اقلام", "قطع شبکه PDA", "خطای چاپ لیبل", "انتقال بین سایت‌ها"];
  const [scenario, setScenario] = useState("جریان عادی");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(2);
  const stages = ["دریافت", "QC", "موجودی", "تولید", "بسته‌بندی", "ارسال", "انتقال"];
  const run = () => { setRunning(true); setStep((s) => s >= 6 ? 0 : s + 1); };
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex justify-between items-start mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">برج کنترل کارخانه</h2><p className="text-[#718079] text-[13px]">Digital Twin · شبیه‌سازی و رصد انتها‌به‌انتها</p></div><div className="flex gap-2"><Badge text={running ? "در حال اجرا" : "آماده"} color={running ? "#c67518" : "#16825b"} bg={running ? "#fff0dc" : "#dff3e9"}/><GreenBtn onClick={run}>{running ? "مرحله بعد" : "اجرای سناریو"}</GreenBtn></div></div>
      <div className="grid grid-cols-4 gap-3 mb-4"><StatCard label="سلامت سیستم" value={scenario === "جریان عادی" ? "۹۸٪" : "۸۴٪"}/><StatCard label="رویدادهای امروز" value="۱,۲۴۸"/><StatCard label="هشدار باز" value={scenario === "جریان عادی" ? "۲" : "۵"}/><StatCard label="میانگین چرخه" value="۴۲m"/></div>
      <Card className="p-4 mb-4"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-[#18302a] text-[14px]">نقشه زنده فرایند</h3><select value={scenario} onChange={(e)=>{setScenario(e.target.value);setRunning(false);setStep(1)}} className="border rounded-lg px-3 py-2 text-[12px] bg-white">{scenarios.map(s=><option key={s}>{s}</option>)}</select></div><div className="flex items-center justify-between">{stages.map((s,i)=><div key={s} className="flex items-center flex-1"><button onClick={()=>setStep(i)} className={"flex-1 rounded-xl p-3 text-[12px] border transition-all " + (i===step?"bg-[#176b50] text-white border-[#176b50] shadow-lg":i<step?"bg-[#dff3e9] text-[#16825b] border-[#9fd3bd]":"bg-white text-[#718079] border-[#d8e4df]")}>{s}<div className="text-[10px] mt-1">{i<step?"تکمیل":i===step?"فعال":"در انتظار"}</div></button>{i<stages.length-1&&<span className="px-1 text-[#9ab0a7]">←</span>}</div>)}</div></Card>
      <div className="grid grid-cols-3 gap-4"><Card className="p-4"><h3 className="font-bold text-[14px] mb-3">وضعیت کانال‌ها</h3>{[["Web","آنلاین"],["PDA","۱۲ آنلاین · ۲ آفلاین"],["Terminal","۵ فعال"]].map(x=><div className="flex justify-between py-2 border-b text-[12px]" key={x[0]}><span>{x[0]}</span><Badge text={x[1]} color="#16825b" bg="#dff3e9"/></div>)}</Card><Card className="p-4"><h3 className="font-bold text-[14px] mb-3">تایم‌لاین رویدادها</h3>{stages.slice(0,4).map((s,i)=><div key={s} className="flex gap-2 py-2 text-[11px]"><span className="text-[#718079]">۱۰:{24-i*3}</span><span className={i===0?"text-[#c67518]":"text-[#18302a]"}>{scenario} · {s}</span></div>)}</Card><Card className="p-4"><h3 className="font-bold text-[14px] mb-3">کنترل سناریو</h3><p className="text-[12px] text-[#718079] mb-3">سناریو: {scenario}</p><div className="space-y-2"><button onClick={()=>setStep(Math.max(0,step-1))} className="w-full border rounded-lg p-2 text-[12px]">مرحله قبل</button><GreenBtn onClick={run}>مرحله بعد</GreenBtn><button onClick={()=>{setRunning(false);setStep(0)}} className="w-full border rounded-lg p-2 text-[12px] text-[#c64545]">بازنشانی</button></div></Card></div>
    </div>
  );
}

function ConfigScreen({ navigate }: { navigate: (s: WebScreen) => void }) {
  const configSections: { screen: WebScreen; label: string; desc: string }[] = [
    { screen: "master-data", label: "داده‌های پایه", desc: "محصولات، تأمین‌کنندگان، مشتریان" },
    { screen: "users", label: "کاربران", desc: "مدیریت کاربران و سطوح دسترسی" },
    { screen: "overrides", label: "لغو تصمیمات", desc: "تاریخچه و مدیریت override های QC" },
    { screen: "audit", label: "حسابرسی", desc: "لاگ کامل فعالیت‌های سیستم" },
    { screen: "cloud", label: "ابری", desc: "تنظیمات همگام‌سازی ابری" },
    { screen: "system", label: "سیستم", desc: "پیکربندی و نگهداری سیستم" },
  ];
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="mb-6">
        <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">تنظیمات</h2>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">پیکربندی کامل سیستم StoreMesh</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {configSections.map(({ screen, label, desc }) => (
          <button key={screen} onClick={() => navigate(screen)} className="text-right">
            <Card className="p-4 hover:border-[#35a17b] hover:shadow-md transition-all cursor-pointer">
              <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-1">{label}</h4>
              <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[12px]">{desc}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}function MasterDataScreen() {
  const [activeTab, setActiveTab] = useState("محصولات");
  const [showCreateForm, setShowCreateForm] = useState(false);
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px] mb-1">داده‌های پایه</h2>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] mb-4">مدیریت محصولات، تأمین‌کنندگان و مشتریان</p>
      <div className="flex gap-2 mb-4">
        {["محصولات", "تأمین‌کنندگان", "مشتریان", "انبارها"].map((t, i) => (
          <button key={t} onClick={() => { setActiveTab(t); setShowCreateForm(false); }} className={`px-4 py-2 rounded-full text-[12px] font-['Vazirmatn:Regular',sans-serif] transition-colors ${activeTab === t ? "bg-[#176b50] text-white" : "bg-[#e8efec] text-[#718079] hover:bg-[#35a17b] hover:text-white"}`}>{t}</button>
        ))}
        <div className="flex-1" />
        <GreenBtn onClick={() => setShowCreateForm((open) => !open)}>{showCreateForm ? "فرم ایجاد باز شد" : activeTab === "محصولات" ? "+ محصول جدید" : `+ افزودن ${activeTab}`}</GreenBtn>
      </div>
      <Card>
        {showCreateForm && (
          <div className="m-4 p-4 rounded-xl border border-[#c9ddd5] bg-[#f7fbf9]">
            <h3 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[15px] mb-3">افزودن {activeTab}</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px]" placeholder={activeTab === "محصولات" ? "نام محصول" : "نام"} />
              <input className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px]" placeholder={activeTab === "محصولات" ? "کد محصول" : activeTab === "انبارها" ? "کد انبار" : "کد/شناسه"} />
              <input className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px]" placeholder={activeTab === "محصولات" ? "دسته‌بندی" : "شماره تماس"} />
              <input className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px]" placeholder={activeTab === "انبارها" ? "موقعیت انبار" : "توضیحات"} />
            </div>
            <div className="flex gap-2">
              <GreenBtn onClick={() => setShowCreateForm(false)}>ذخیره</GreenBtn>
              <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 rounded-lg border border-[#d8e4df] text-[#718079] text-[12px]">انصراف</button>
            </div>
          </div>
        )}
        <TableHeader cols={["وضعیت", "گرید", "دسته‌بندی", "نام محصول", "کد"]} />
        {[
          { code: "PRD-001", name: "تماتو", cat: "سبزیجات", grade: "A,B,C", status: "فعال", sc: "#16825b", sb: "#dff3e9" },
          { code: "PRD-002", name: "خیار", cat: "سبزیجات", grade: "A,B", status: "فعال", sc: "#16825b", sb: "#dff3e9" },
          { code: "PRD-003", name: "فلفل دلمه", cat: "سبزیجات", grade: "A+,A,B", status: "فعال", sc: "#16825b", sb: "#dff3e9" },
          { code: "PRD-004", name: "بادمجان", cat: "سبزیجات", grade: "A,B", status: "غیرفعال", sc: "#718079", sb: "#e8efec" },
        ].map((row, i) => (
          <TableRow key={i} cells={[row.status, row.grade, row.cat, row.name, row.code]} badge={{ text: row.status, color: row.sc, bg: row.sb }} />
        ))}
      </Card>
    </div>
  );
}function UsersScreen() {
  const [showNewUser, setShowNewUser] = useState(false);
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px] mb-1">کاربران</h2>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] mb-4">مدیریت کاربران و سطوح دسترسی</p>
      <div className="flex justify-between items-center mb-4">
        <input className="border border-[#d8e4df] rounded-lg px-3 py-1.5 text-[12px] font-['Vazirmatn:Regular',sans-serif] focus:outline-none w-64" placeholder="جستجو..." dir="rtl" />
        <GreenBtn onClick={() => setShowNewUser((open) => !open)}>{showNewUser ? "فرم کاربر باز شد" : "+ کاربر جدید"}</GreenBtn>
      </div>
      <Card>
        {showNewUser && (
          <div className="m-4 p-4 rounded-xl border border-[#c9ddd5] bg-[#f7fbf9]">
            <h3 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[15px] mb-3">افزودن کاربر جدید</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px]" placeholder="نام و نام خانوادگی" />
              <input className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px]" placeholder="نام کاربری" />
              <input className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px]" placeholder="شماره تماس" />
              <select className="border border-[#d8e4df] rounded-lg px-3 py-2 text-[12px] bg-white"><option>انتخاب نقش</option><option>مدیر انبار</option><option>اپراتور دریافت</option><option>مسئول QC</option></select>
            </div>
            <div className="flex gap-2">
              <GreenBtn onClick={() => setShowNewUser(false)}>ذخیره کاربر</GreenBtn>
              <button onClick={() => setShowNewUser(false)} className="px-4 py-2 rounded-lg border border-[#d8e4df] text-[#718079] text-[12px]">انصراف</button>
            </div>
          </div>
        )}
        <TableHeader cols={["وضعیت", "آخرین ورود", "نقش", "نام"]} />
        {[
          { name: "علی رضایی", role: "اپراتور دریافت", last: "امروز ۰۹:۳۰", status: "آنلاین", sc: "#16825b", sb: "#dff3e9" },
          { name: "فاطمه محمدی", role: "مسئول QC", last: "امروز ۱۰:۱۵", status: "آنلاین", sc: "#16825b", sb: "#dff3e9" },
          { name: "احمد کریمی", role: "اپراتور بسته‌بندی", last: "دیروز ۱۷:۰۰", status: "آفلاین", sc: "#718079", sb: "#e8efec" },
          { name: "مریم حسینی", role: "مدیر انبار", last: "امروز ۰۸:۴۵", status: "آنلاین", sc: "#16825b", sb: "#dff3e9" },
          { name: "حسن نصیری", role: "سرپرست ارسال", last: "امروز ۱۱:۳۰", status: "آنلاین", sc: "#16825b", sb: "#dff3e9" },
        ].map((row, i) => (
          <TableRow key={i} cells={[row.status, row.last, row.role, row.name]} badge={{ text: row.status, color: row.sc, bg: row.sb }} />
        ))}
      </Card>
    </div>
  );
}

function OverridesScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px] mb-1">لغو تصمیمات</h2>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] mb-4">تاریخچه و مدیریت override های QC و سیستم</p>
      <Card>
        <TableHeader cols={["وضعیت", "دلیل", "تصمیم اصلی", "کاربر", "تاریخ"]} />
        {[
          { date: "امروز ۱۴:۰۰", user: "مریم حسینی", orig: "رد QC", reason: "خطای دستگاه", status: "تأیید مدیر", sc: "#c67518", sb: "#fff0dc" },
          { date: "دیروز ۱۰:۳۰", user: "فاطمه محمدی", orig: "توقف تولید", reason: "تغییر برنامه", status: "اجرا شده", sc: "#16825b", sb: "#dff3e9" },
          { date: "دیروز ۰۹:۰۰", user: "علی رضایی", orig: "رد ورود", reason: "تأمین‌کننده اضطراری", status: "در انتظار", sc: "#718079", sb: "#e8efec" },
        ].map((row, i) => (
          <TableRow key={i} cells={[row.status, row.reason, row.orig, row.user, row.date]} badge={{ text: row.status, color: row.sc, bg: row.sb }} />
        ))}
      </Card>
    </div>
  );
}

function AuditScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px] mb-1">حسابرسی</h2>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] mb-4">لاگ کامل فعالیت‌های سیستم</p>
      <div className="flex gap-2 mb-4 items-center">
        <input className="border border-[#d8e4df] rounded-lg px-3 py-1.5 text-[12px] font-['Vazirmatn:Regular',sans-serif] focus:outline-none w-48" placeholder="جستجو..." dir="rtl" />
        <select className="border border-[#d8e4df] rounded-lg px-3 py-1.5 text-[12px] font-['Vazirmatn:Regular',sans-serif] focus:outline-none" dir="rtl">
          <option>همه رویدادها</option>
          <option>دریافت</option>
          <option>QC</option>
          <option>ارسال</option>
        </select>
        <div className="flex-1" />
        <button className="border border-[#d8e4df] bg-white rounded-lg px-3 py-1.5 text-[12px] font-['Vazirmatn:Regular',sans-serif] text-[#718079]">خروجی PDF</button>
      </div>
      <Card>
        <TableHeader cols={["جزئیات", "رویداد", "کاربر", "زمان"]} />
        {[
          { time: "امروز ۱۴:۳۵", user: "علی رضایی", event: "ثبت توزین سبد", detail: "CTR-012 · ۴۸۲kg" },
          { time: "امروز ۱۴:۳۰", user: "فاطمه محمدی", event: "تأیید QC", detail: "QC-007 · نمونه A" },
          { time: "امروز ۱۴:۱۵", user: "احمد کریمی", event: "شروع بسته‌بندی", detail: "خط ۱ · تماتو ۵۰۰g" },
          { time: "امروز ۱۴:۰۰", user: "مریم حسینی", event: "override تصمیم", detail: "QC-006 · رد شده" },
          { time: "امروز ۱۳:۴۵", user: "حسن نصیری", event: "ثبت ارسال", detail: "SHP-0082 · ۳t" },
        ].map((row, i) => (
          <div key={i} className="grid gap-2 px-4 py-2.5 border-b border-[#edf2ef] hover:bg-[#fafcfb]" style={{ gridTemplateColumns: "repeat(4,1fr)" }} dir="rtl">
            <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">{row.time}</span>
            <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">{row.user}</span>
            <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">{row.event}</span>
            <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[11px]">{row.detail}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function CloudScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px] mb-1">ابری</h2>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] mb-4">تنظیمات همگام‌سازی و اتصال ابری</p>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">وضعیت اتصال</h4>
          <div className="space-y-3">
            {[
              { name: "همگام‌سازی داده", status: "متصل", sc: "#16825b", sb: "#dff3e9" },
              { name: "پشتیبان‌گیری خودکار", status: "فعال", sc: "#16825b", sb: "#dff3e9" },
              { name: "API خارجی", status: "قطع", sc: "#c64545", sb: "#fbe6e6" },
              { name: "گزارش‌دهی ابری", status: "متصل", sc: "#16825b", sb: "#dff3e9" },
            ].map((item) => (
              <div key={item.name} className="flex justify-between items-center py-2 border-b border-[#edf2ef]">
                <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">{item.name}</span>
                <Badge text={item.status} color={item.sc} bg={item.sb} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">آخرین همگام‌سازی</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079]">آخرین همگام‌سازی</span>
              <span className="font-['Vazirmatn:Bold',sans-serif] text-[#18302a]">۳ دقیقه پیش</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079]">رکوردهای منتقل‌شده</span>
              <span className="font-['Vazirmatn:Bold',sans-serif] text-[#18302a]">۱۲,۸۴۷</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="font-['Vazirmatn:Regular',sans-serif] text-[#718079]">فضای مصرفی</span>
              <span className="font-['Vazirmatn:Bold',sans-serif] text-[#18302a]">۲.۴ GB</span>
            </div>
            <GreenBtn>همگام‌سازی دستی</GreenBtn>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SystemScreen() {
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px] mb-1">سیستم</h2>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] mb-4">پیکربندی و نگهداری سیستم StoreMesh</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="نسخه سیستم" value="v3.2.1" />
        <StatCard label="آپتایم" value="۹۹.۸%" />
        <StatCard label="فضای ذخیره‌سازی" value="۳۴%" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">سرویس‌ها</h4>
          <div className="space-y-2">
            {[
              { name: "سرویس اصلی", status: "در حال اجرا", sc: "#16825b", sb: "#dff3e9" },
              { name: "پایگاه داده", status: "در حال اجرا", sc: "#16825b", sb: "#dff3e9" },
              { name: "صف آفلاین", status: "در حال اجرا", sc: "#16825b", sb: "#dff3e9" },
              { name: "چاپگر سرویس", status: "هشدار", sc: "#c67518", sb: "#fff0dc" },
            ].map((svc) => (
              <div key={svc.name} className="flex justify-between items-center py-2 border-b border-[#edf2ef]">
                <span className="font-['Vazirmatn:Regular',sans-serif] text-[#18302a] text-[12px]">{svc.name}</span>
                <Badge text={svc.status} color={svc.sc} bg={svc.sb} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[13px] mb-3">عملیات نگهداری</h4>
          <div className="space-y-2">
            <GreenBtn>پاکسازی کش</GreenBtn>
            <GreenBtn>پشتیبان‌گیری فوری</GreenBtn>
            <button className="w-full bg-[#fbe6e6] text-[#c64545] rounded-lg px-4 py-2 text-[13px] font-['Vazirmatn:Bold',sans-serif] hover:bg-[#fad0d0]">ریست سیستم</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

const screenTitles: Record<WebScreen, { title: string; subtitle: string }> = {
  dashboard: { title: "داشبورد", subtitle: "Web / dashboard" },
  "control-tower": { title: "برج کنترل کارخانه", subtitle: "Web / control-tower" },
  receiving: { title: "دریافت", subtitle: "Web / receiving" },
  containers: { title: "کانتینرها", subtitle: "Web / containers" },
  inventory: { title: "موجودی", subtitle: "Web / inventory" },
  production: { title: "تولید", subtitle: "Web / production" },
  "fresh-export": { title: "صادرات تازه", subtitle: "Web / fresh-export" },
  quality: { title: "کنترل کیفیت", subtitle: "Web / quality" },
  packaging: { title: "بسته‌بندی", subtitle: "Web / packaging" },
  consumables: { title: "اقلام مصرفی", subtitle: "Web / consumables" },
  shipments: { title: "ارسال‌ها", subtitle: "Web / shipments" },
  transfers: { title: "انتقال بین سایت", subtitle: "Web / transfers" },
  tasks: { title: "کارها", subtitle: "Web / tasks" },
  printing: { title: "چاپ و لیبل", subtitle: "Web / printing" },
  trace: { title: "رهگیری", subtitle: "Web / trace" },
  config: { title: "تنظیمات", subtitle: "Web / config" },
  "master-data": { title: "داده‌های پایه", subtitle: "Web / master-data" },
  users: { title: "کاربران", subtitle: "Web / users" },
  overrides: { title: "لغو تصمیمات", subtitle: "Web / overrides" },
  audit: { title: "حسابرسی", subtitle: "Web / audit" },
  cloud: { title: "ابری", subtitle: "Web / cloud" },
  system: { title: "سیستم", subtitle: "Web / system" },
};

export default function WebApp({ onExit }: { onExit: () => void }) {
  const [screen, setScreen] = useState<WebScreen>("dashboard");
  const section = getActiveSidebarSection(screen);
  const { title, subtitle } = screenTitles[screen];

  function renderScreen() {
    switch (screen) {
      case "dashboard": return <DashboardScreen navigate={setScreen} />;
      case "control-tower": return <ControlTowerScreen />;
      case "receiving": return <ReceivingScreen navigate={setScreen} />;
      case "containers": return <ContainersScreen />;
      case "inventory": return <InventoryScreen />;
      case "production": return <ProductionScreen />;
      case "fresh-export": return <FreshExportScreen />;
      case "quality": return <QualityScreen />;
      case "packaging": return <PackagingScreen />;
      case "consumables": return <ConsumablesScreen />;
      case "shipments": return <ShipmentsScreen />;
      case "transfers": return <TransfersScreen navigate={setScreen} />;
      case "tasks": return <TasksScreen />;
      case "printing": return <PrintingScreen />;
      case "trace": return <TraceScreen />;
      case "config": return <ConfigScreen navigate={setScreen} />;
      case "master-data": return <MasterDataScreen />;
      case "users": return <UsersScreen />;
      case "overrides": return <OverridesScreen />;
      case "audit": return <AuditScreen />;
      case "cloud": return <CloudScreen />;
      case "system": return <SystemScreen />;
    }
  }

  return (
    <div className="flex flex-col h-full w-full" style={{ minHeight: "100vh" }}>
      {/* App top bar */}
      <TopBar title={title} subtitle={subtitle} />

      {/* Sub-nav */}
      {section && section.screens.length > 1 && (
        <div className="bg-[#f4f7f5] border-b border-[#d8e4df]">
          <SubNav screens={section.screens as WebScreen[]} active={screen} onSelect={setScreen} />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar screen={screen} onNavigate={setScreen} />
        {renderScreen()}
      </div>

      {/* Exit button */}
      <button
        onClick={onExit}
        className="fixed bottom-4 left-4 bg-[rgba(19,58,49,0.9)] text-[#adc8bf] rounded-full px-4 py-2 text-[12px] font-['Vazirmatn:Regular',sans-serif] hover:bg-[#133a31] hover:text-white transition-colors backdrop-blur-sm z-50"
      >
        ← بازگشت به Hub
      </button>
    </div>
  );
}
