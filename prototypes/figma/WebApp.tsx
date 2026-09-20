import { useEffect, useState } from "react";
type PrototypeBasket={id:number;code:string;product:string;grade:string;size:string;gross:number;tare:number;zone?:string;status?:string;currentLocation?:string;currentState?:string;destination?:string|null;physicalLocation?:string;sortingOrigin?:string;operationalDestination?:string|null;qualityCheckRequired?:boolean;nextAction?:string};
type PrototypeBatch={id:string;supplier:string;reference:string;createdAt:string;status:string;destination?:string|null;qualityCheckRequired?:boolean;baskets:PrototypeBasket[];events:{time:string;title:string;detail:string}[]};
const PROTOTYPE_KEY="storemesh.prototype.batch";
function prototypeColdStorageLocation(value:string|undefined|null):boolean{const location=String(value||"").trim().toUpperCase().replace(/[\s_.-]+/g,"");return location.includes("سردخانه")||location.includes("COLDROOM")||location.includes("COLDSTORAGE")}
function normalizePhysicalDestination(value:string|undefined|null){return value==="COLD_ROOM_DIRTY"?"COLD_ROOM_POSITIVE_DIRTY":value==="COLD_ROOM_CLEAN"?"COLD_ROOM_POSITIVE_CLEAN":value||null}
const PHYSICAL_DESTINATION_NAMES:Record<string,string>={COLD_ROOM_POSITIVE_DIRTY:"سردخانه مثبت کثیف",COLD_ROOM_POSITIVE_CLEAN:"سردخانه مثبت تمیز",COLD_ROOM_NEGATIVE:"سردخانه منفی"};
function normalizePrototypeBasket(b:PrototypeBasket):PrototypeBasket{const legacyWaiting="آماده"+" انتقال",location=normalizePhysicalDestination(b.currentLocation||b.zone)||"RECEIVING";const waiting=b.currentState==="AWAITING_GATE_SCAN"||b.status===legacyWaiting;const state=waiting?"AWAITING_GATE_SCAN":b.currentState||b.status||"RECEIVED";const destination=waiting?(normalizePhysicalDestination(b.destination)||"COLD_ROOM_POSITIVE_DIRTY"):b.destination===undefined?(location==="RECEIVING"?"COLD_ROOM_POSITIVE_DIRTY":null):normalizePhysicalDestination(b.destination);const nextAction=b.nextAction||(destination?`اسکن ورود به ${PHYSICAL_DESTINATION_NAMES[destination]||destination}`:"منتظر تخصیص برنامه تولید");return {...b,zone:location,status:state,currentLocation:location,currentState:state,destination,physicalLocation:b.physicalLocation||location,operationalDestination:b.operationalDestination??null,nextAction}}
function normalizePrototypeBatch(value:PrototypeBatch):PrototypeBatch{const legacyWaiting="آماده"+" انتقال",baskets=(value.baskets||[]).map(normalizePrototypeBasket),pending=baskets.filter(b=>b.currentState==="AWAITING_GATE_SCAN"),pendingDestination=pending[0]?.destination||baskets.find(b=>b.destination)?.destination;return {...value,status:pending.length?`در انتظار اسکن مقصد (${pending.length})`:value.status===legacyWaiting?"موجودی ثبت‌شده":value.status,destination:pendingDestination,baskets,events:value.events||[]}}
function readPrototypeBatch():PrototypeBatch{try{const x=localStorage.getItem(PROTOTYPE_KEY);if(x)return normalizePrototypeBatch(JSON.parse(x))}catch{} return normalizePrototypeBatch({id:"RCV-1405-0928",supplier:"گلخانه نمونه",reference:"BL-1405-091",createdAt:"امروز ۱۴:۳۰",status:"در انتظار اسکن سردخانه",destination:"COLD_ROOM_DIRTY",baskets:[{id:1,code:"TMP-7862368",product:"گوجه فرنگی",grade:"A",size:"درشت",gross:20,tare:1.28,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:"COLD_ROOM_DIRTY",nextAction:"اسکن ورود سردخانه"},{id:2,code:"BSK-0002",product:"گوجه فرنگی",grade:"A",size:"درشت",gross:20.38,tare:1.28,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:"COLD_ROOM_DIRTY",nextAction:"اسکن ورود سردخانه"},{id:3,code:"BSK-0003",product:"گوجه فرنگی",grade:"B",size:"متوسط",gross:19.12,tare:1.28,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:"COLD_ROOM_DIRTY",nextAction:"اسکن ورود سردخانه"}],events:[{time:"۱۴:۳۰",title:"ثبت محموله",detail:"ایستگاه دریافت وب"}]})}
function writePrototypeBatch(b:PrototypeBatch){localStorage.setItem(PROTOTYPE_KEY,JSON.stringify(normalizePrototypeBatch(b)));window.dispatchEvent(new Event("storemesh-data"))}
function applyReceiptWorkflowScan(batch:PrototypeBatch,rawCode:string,target:string):PrototypeBatch{const code=String(rawCode||"").trim().toUpperCase(),normalizedTarget=normalizePhysicalDestination(target)||target;if(!code)throw Error("ابتدا QR سبد را اسکن کنید.");const source=normalizePrototypeBatch(batch),basket=source.baskets.find(item=>item.code.toUpperCase()===code);if(!basket)throw Error("سبد اسکن‌شده در موجودی جاری پیدا نشد.");const sortingEntry=normalizedTarget==="SORTING";if(sortingEntry&&!prototypeColdStorageLocation(basket.currentLocation||basket.zone))throw Error("سبد باید پیش از ورود به سورتینگ در سردخانه ثبت شده باشد.");if(sortingEntry&&basket.qualityCheckRequired)throw Error("این سبد در انتظار تصمیم مدیر کنترل کیفیت است.");if(!sortingEntry&&normalizePhysicalDestination(basket.destination)!==normalizedTarget)throw Error(`مقصد مجاز این سبد ${basket.destination||"تعیین نشده"} است.`);const stored=prototypeColdStorageLocation(normalizedTarget),nextState=stored?"STORED":"IN_PROCESS",nextDestination=null,nextAction=stored?(basket.qualityCheckRequired?"در انتظار تصمیم مدیر کنترل کیفیت":"منتظر انتخاب برای عملیات سورتینگ"):"تکمیل عملیات جاری";const at=new Date().toLocaleTimeString("fa-IR");return normalizePrototypeBatch({...source,baskets:source.baskets.map(item=>item.code.toUpperCase()===code?{...item,zone:normalizedTarget,status:nextState,currentLocation:normalizedTarget,physicalLocation:stored?normalizedTarget:item.physicalLocation,currentState:nextState,destination:nextDestination,nextAction}:item),events:[...source.events,{time:at,title:"اسکن گذرگاه عملیاتی",detail:`${code} · ${basket.currentLocation} ← ${normalizedTarget} · اقدام بعدی: ${nextAction}`}]})}

function ScanSimulator({open,title,suggestedCode,onClose,onScan}:{open:boolean;title:string;suggestedCode:string;onClose:()=>void;onScan:(code:string)=>void}){const [code,setCode]=useState(suggestedCode);useEffect(()=>{if(open)setCode(suggestedCode)},[open,suggestedCode]);if(!open)return null;const submit=(value:string)=>{onScan(String(value||"").trim().toUpperCase());onClose()};return <div className="fixed inset-0 z-[120] bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[480px] relative" dir="rtl"><button onClick={onClose} className="absolute left-4 top-3 text-[22px]">×</button><h3 className="font-bold text-[#18302a] mb-4">{title}</h3><div className="h-40 border-2 border-dashed border-[#29a574] rounded-xl flex flex-col items-center justify-center text-[54px]">⌗<span className="text-[12px] text-[#668078]">اسکنر سخت‌افزاری و شبیه‌ساز از یک اعتبارسنجی استفاده می‌کنند</span></div><div className="mt-4 rounded-lg bg-[#edf8f3] px-3 py-2 text-[11px] text-[#176b50]">کد پیشنهادی آماده است: <b className="font-mono">{suggestedCode||"—"}</b></div><input autoFocus value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")submit(code)}} className="w-full h-11 border rounded-lg px-3 mt-2 font-mono"/><button onClick={()=>submit(code||suggestedCode)} className="w-full mt-3 bg-[#176b50] text-white rounded-lg py-3 text-[12px] font-bold">اسکن کد پیشنهادی</button></div></div>}

type PrototypeUser={id:string;name:string;username:string;phone:string;role:string;active:boolean;last:string};
const USERS_KEY="storemesh.prototype.users.v1";
const USERS_DEFAULT:PrototypeUser[]=[{id:"U1",name:"علی رضایی",username:"ali.rezaei",phone:"۰۹۱۲۱۲۳۴۵۶۷",role:"اپراتور دریافت",active:true,last:"امروز ۰۹:۳۰"},{id:"U2",name:"فاطمه محمدی",username:"fatemeh.m",phone:"۰۹۱۲۹۸۷۶۵۴۳",role:"مسئول QC",active:true,last:"امروز ۱۰:۱۵"},{id:"U3",name:"مریم حسینی",username:"maryam.h",phone:"۰۹۱۲۵۵۵۴۴۳۳",role:"مدیر انبار",active:true,last:"امروز ۰۸:۴۵"}];
function readPrototypeUsers():PrototypeUser[]{try{const raw=localStorage.getItem(USERS_KEY),value=raw?JSON.parse(raw):null;if(Array.isArray(value))return value}catch{}return USERS_DEFAULT}
function validatePrototypeUser(form:Partial<PrototypeUser>,users:PrototypeUser[],editingId?:string){const name=String(form.name||"").trim(),username=String(form.username||"").trim().toLowerCase(),phone=String(form.phone||"").trim(),role=String(form.role||"").trim();if(!name||!username||!role)return "نام، نام کاربری و نقش الزامی است.";if(!/^[a-z0-9._-]{3,}$/i.test(username))return "نام کاربری باید حداقل سه نویسه و شامل حروف انگلیسی، عدد، نقطه، خط تیره یا زیرخط باشد.";if(users.some(user=>user.id!==editingId&&user.username.toLowerCase()===username))return "این نام کاربری قبلاً ثبت شده است.";if(phone&&!/^[۰-۹0-9+ -]{7,}$/.test(phone))return "شماره تماس معتبر نیست.";return ""}
function writePrototypeUsers(users:PrototypeUser[]){localStorage.setItem(USERS_KEY,JSON.stringify(users));window.dispatchEvent(new Event("storemesh-users"))}

type MasterProduct={id:string;code:string;name:string;category:string;grades:string[];sizes:string[];active:boolean};
type MasterParty={id:string;code:string;name:string;contact:string;active:boolean};
type MasterWarehouse={id:string;code:string;name:string;location:string;active:boolean};
type MasterOperationalDestination={id:string;code:string;name:string;appliesTo:string[];active:boolean};
type MasterDataState={products:MasterProduct[];suppliers:MasterParty[];customers:MasterParty[];warehouses:MasterWarehouse[];operationalDestinations:MasterOperationalDestination[]};
const MASTER_DATA_KEY="storemesh.prototype.master-data.v1";
const MASTER_DATA_DEFAULT:MasterDataState={
  products:[
    {id:"P1",code:"PRD-001",name:"سیب قرمز",category:"میوه",grades:["ممتاز","درجه یک","درجه دو"],sizes:["۶۰–۷۰","۷۰–۸۰","۸۰+"],active:true},
    {id:"P2",code:"PRD-002",name:"پرتقال تامسون",category:"میوه",grades:["صادراتی","درجه یک"],sizes:["متوسط","درشت"],active:true},
    {id:"P3",code:"PRD-003",name:"کیوی هایوارد",category:"میوه",grades:["صادراتی","درجه یک"],sizes:["۲۷–۳۰","۳۰–۳۳","۳۳+"],active:true},
    {id:"P4",code:"PRD-004",name:"بادمجان",category:"سبزیجات",grades:["A","B"],sizes:["درشت","متوسط"],active:false}
  ],
  suppliers:[{id:"S1",code:"SUP-001",name:"باغداری سبز شمال",contact:"۰۱۱-۳۳۴۴۵۵۶۶",active:true},{id:"S2",code:"SUP-002",name:"تعاونی کشاورزی دماوند",contact:"۰۲۱-۷۶۳۲۱۰۰۰",active:true}],
  customers:[{id:"C1",code:"CUS-001",name:"فروشگاه زنجیره‌ای نمونه",contact:"۰۲۱-۸۸۸۸۰۰۰۰",active:true},{id:"C2",code:"CUS-002",name:"صادرات سبز",contact:"۰۲۱-۸۸۰۰۱۱۲۲",active:true}],
  warehouses:[{id:"W1",code:"COLD_ROOM_POSITIVE_DIRTY",name:"سردخانه مثبت کثیف",location:"نگهداری محصول پیش از شست‌وشو",active:true},{id:"W2",code:"COLD_ROOM_POSITIVE_CLEAN",name:"سردخانه مثبت تمیز",location:"نگهداری محصول پس از شست‌وشو",active:true},{id:"W3",code:"COLD_ROOM_NEGATIVE",name:"سردخانه منفی",location:"نگهداری محصول منجمد",active:true}],
  operationalDestinations:[
    {id:"OD1",code:"QC",name:"کنترل کیفیت",appliesTo:["RECEIVING","SORTING","WASHING","SLICING","FREEZING","FREEZE_DRYING","DRYING","PACKAGING"],active:true},
    {id:"OD2",code:"FRESH_EXPORT",name:"ارسال تازه",appliesTo:["SORTING"],active:true},
    {id:"OD3",code:"FREEZING",name:"فریز",appliesTo:["SORTING"],active:true},
    {id:"OD4",code:"FREEZING_SLICED",name:"فریز اسلایس",appliesTo:["SORTING"],active:true},
    {id:"OD5",code:"WASTE",name:"دفع / امحاء",appliesTo:["SORTING","WASHING","SLICING","FREEZING","FREEZE_DRYING","DRYING","PACKAGING"],active:true},
    {id:"OD6",code:"DRYING",name:"خشک",appliesTo:["SORTING"],active:true},
    {id:"OD7",code:"FREEZE_DRYING",name:"فریز درای",appliesTo:["SORTING"],active:true}
  ]
};
function readMasterData():MasterDataState{try{const raw=localStorage.getItem(MASTER_DATA_KEY);if(raw){const value=JSON.parse(raw);if(value&&Array.isArray(value.products)&&Array.isArray(value.suppliers)&&Array.isArray(value.customers)&&Array.isArray(value.warehouses))return {...value,warehouses:MASTER_DATA_DEFAULT.warehouses,operationalDestinations:Array.isArray(value.operationalDestinations)?value.operationalDestinations:MASTER_DATA_DEFAULT.operationalDestinations}}}catch{}return MASTER_DATA_DEFAULT}
function writeMasterData(value:MasterDataState){localStorage.setItem(MASTER_DATA_KEY,JSON.stringify(value));window.dispatchEvent(new Event("storemesh-master-data"))}


type WebScreen =
  | "dashboard" | "receiving" | "containers"
  | "inventory" | "production" | "fresh-export"
  | "quality" | "packaging" | "consumables"
  | "shipments" | "inventory-movement" | "tasks"
  | "printing" | "trace" | "config"
  | "master-data" | "users" | "overrides"
  | "audit" | "cloud" | "system";

const sidebarSections: { label: string; item: string; screens: WebScreen[] }[] = [
  { label: "داشبورد", item: "dashboard", screens: ["dashboard"] },
  { label: "دریافت", item: "receiving", screens: ["receiving", "containers"] },
  { label: "موجودی", item: "inventory", screens: ["inventory", "inventory-movement"] },
  { label: "تولید", item: "production", screens: ["production", "fresh-export"] },
  { label: "کیفیت", item: "quality", screens: ["quality"] },
  { label: "بسته‌بندی", item: "packaging", screens: ["packaging", "consumables"] },
  { label: "ارسال", item: "shipments", screens: ["shipments"] },
  { label: "رهگیری", item: "trace", screens: ["trace", "tasks", "printing"] },
  { label: "تنظیمات", item: "config", screens: ["config", "master-data", "users", "overrides", "audit", "cloud", "system"] },
];

const subScreenLabels: Partial<Record<WebScreen, string>> = {
  receiving: "دریافت", containers: "کانتینرها",
  production: "تولید", "fresh-export": "صادرات تازه",
  packaging: "بسته‌بندی", consumables: "اقلام مصرفی",
  shipments: "ارسال‌ها", "inventory-movement": "جابجایی استثنایی",
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
    <div className="flex flex-col bg-[#133a31] w-[220px] min-h-full px-3 py-4 shrink-0" dir="rtl">
      <div
        className="bg-[#c6a45c] rounded-xl flex items-center justify-center mb-5 self-start"
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
  const master=readMasterData();
  const activeProducts=master.products.filter(item=>item.active);
  const options:Record<string,{grades:string[];sizes:string[]}>=Object.fromEntries(activeProducts.map(item=>[item.name,{grades:item.grades,sizes:item.sizes}]));
  const initialProduct=activeProducts[0]?.name||"";
  const [stage,setStage]=useState<"setup"|"capture"|"review"|"dispatch"|"done">("setup");
  const [supplier,setSupplier]=useState("");
  const [reference,setReference]=useState("");
  const [expected,setExpected]=useState(10);
  const [containerCode,setContainerCode]=useState("");
  const [product,setProduct]=useState(initialProduct);
  const [grade,setGrade]=useState(options[initialProduct]?.grades[0]||"");
  const [size,setSize]=useState(options[initialProduct]?.sizes[0]||"");
  const [gross,setGross]=useState(24.68);
  const [tare,setTare]=useState(1.28);
  const [baskets,setBaskets]=useState<ReceivingBasket[]>([]);
  const [scanOpen,setScanOpen]=useState(false);
  const [createOpen,setCreateOpen]=useState(false);
  const [generatedCode,setGeneratedCode]=useState("");
  const [destination,setDestination]=useState("");
  const [qualityCheckRequired,setQualityCheckRequired]=useState(false);
  const [moveMode,setMoveMode]=useState<"batch"|"scan">("batch");
  const [transferBatch,setTransferBatch]=useState<PrototypeBatch|null>(null);
  const [dispatchStarted,setDispatchStarted]=useState(false);
  const [movedCodes,setMovedCodes]=useState<string[]>([]);
  const [transferScanOpen,setTransferScanOpen]=useState(false);
  const [transferError,setTransferError]=useState("");
  const net=Math.max(0,gross-tare);
  const total=baskets.reduce((sum,b)=>sum+b.gross-b.tare,0);
  const acceptContainerScan=(code:string)=>{if(!code)return;if(baskets.some(item=>item.code.toUpperCase()===code.toUpperCase()))return;setContainerCode(code.toUpperCase());setGross(24.68)};
  const addBasket=()=>{if(!containerCode||gross<=0)return;setBaskets([...baskets,{id:baskets.length+1,code:containerCode,product,grade,size,gross,tare}]);setContainerCode("");setGross(0);setTare(1.28)};
  const destinationNames=PHYSICAL_DESTINATION_NAMES;
  const makePendingBatch=(target:string):PrototypeBatch=>{const id="RCV-"+String(Date.now()).slice(-8),at=new Date().toLocaleTimeString("fa-IR");return normalizePrototypeBatch({id,supplier,reference,createdAt:at,status:`در انتظار اجرای مقصد ${destinationNames[target]}`,destination:target,qualityCheckRequired,baskets:baskets.map(b=>({...b,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:target,qualityCheckRequired,nextAction:`اسکن ورود به ${destinationNames[target]}`})),events:[{time:at,title:"دریافت و توزین تکمیل شد",detail:`${supplier} · ${baskets.length} ظرف · محل فیزیکی ${destinationNames[target]}${qualityCheckRequired?" · نیازمند کنترل کیفیت":""}`}]})};
  const startDispatch=()=>{if(!destination)return;const pending=makePendingBatch(destination);setTransferError("");setTransferBatch(pending);if(moveMode==="batch"){let completed=pending;for(const basket of pending.baskets)completed=applyReceiptWorkflowScan(completed,basket.code,destination);completed={...completed,status:`تحویل‌شده به ${destinationNames[destination]}`,events:[...completed.events,{time:new Date().toLocaleTimeString("fa-IR"),title:"انتقال یکجای بچ",detail:`کل ${baskets.length} ظرف در مقصد ${destinationNames[destination]} ثبت شد`} ]};writePrototypeBatch(completed);setTransferBatch(completed);setMovedCodes(completed.baskets.map(item=>item.code));setStage("done");return}writePrototypeBatch(pending);setDispatchStarted(true)};
  const scanDestination=(code:string)=>{if(!transferBatch)return;try{const updated=applyReceiptWorkflowScan(transferBatch,code,destination),nextMoved=[...movedCodes,code.toUpperCase()];writePrototypeBatch(updated);setTransferBatch(updated);setMovedCodes(nextMoved);setTransferError("");if(nextMoved.length===baskets.length){const completed={...updated,status:`تحویل‌شده به ${destinationNames[destination]}`,events:[...updated.events,{time:new Date().toLocaleTimeString("fa-IR"),title:"انتقال اسکن‌شده کامل شد",detail:`هر ${baskets.length} ظرف در مقصد ${destinationNames[destination]} تأیید شد`} ]};writePrototypeBatch(completed);setTransferBatch(completed);setStage("done")}}catch(failure:any){setTransferError(failure.message)}};
  const resetReceiving=()=>{setStage("setup");setBaskets([]);setDestination("");setQualityCheckRequired(false);setMoveMode("batch");setTransferBatch(null);setDispatchStarted(false);setMovedCodes([]);setTransferError("")};
  const selectClass="w-full h-11 rounded-lg border border-[#d9e3de] bg-white px-3 text-[12px] text-[#18302a] outline-none focus:border-[#176b50]";

  if(stage==="done") return <div className="flex-1 bg-[#f4f7f5] p-8 overflow-auto" dir="rtl"><Card className="max-w-3xl mx-auto mt-16 p-10 text-center"><div className="w-16 h-16 rounded-full bg-[#176b50] text-white text-[34px] flex items-center justify-center mx-auto mb-4">✓</div><h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[24px]">دریافت و انتقال کامل شد</h2><p className="text-[#718079] text-[13px] mt-2">محموله بدون خروج از صفحه دریافت، به مقصد «{destinationNames[destination]}» تحویل شد و موقعیت، وضعیت و رهگیری همه ظروف به‌روزرسانی شد.</p><div className="grid grid-cols-3 gap-3 my-7"><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">تعداد ظروف</small><b>{baskets.length}</b></div><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">روش انتقال</small><b>{moveMode==="batch"?"کل بچ یکجا":"اسکن تک‌تک"}</b></div><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">موقعیت فعلی</small><b className="text-[#176b50]">{destinationNames[destination]}</b></div></div><div className="flex justify-center gap-2"><button onClick={resetReceiving} className="bg-[#176b50] text-white rounded-lg px-6 h-11 text-[12px] font-bold">دریافت محموله جدید</button><button onClick={()=>navigate("inventory")} className="border border-[#d8e4df] rounded-lg px-5 h-11 text-[12px]">مشاهده رهگیری (اختیاری)</button></div></Card></div>;

  return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
    <div className="flex items-start justify-between mb-4"><div><p className="text-[#176b50] text-[11px] font-bold">دریافت · {stage==="setup"?"محموله جدید":reference||"محموله جاری"}</p><h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">{stage==="setup"?"تعریف محموله ورودی":stage==="review"?"بازبینی محموله":stage==="dispatch"?"محل فیزیکی و تحویل":"ثبت و توزین ظروف"}</h2><p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">{stage==="setup"?"اطلاعات بار را ثبت کنید؛ سپس ظروف را یکی‌یکی اسکن و توزین کنید.":supplier+" · پیشرفت "+baskets.length+" از "+expected+" ظرف"}</p></div><Badge text={stage==="setup"?"مرحله ۱ از ۴":stage==="capture"?"مرحله ۲ از ۴":stage==="review"?"مرحله ۳ از ۴":"مرحله ۴ از ۴"} color="#176b50" bg="#e1f2eb" /></div>

    {stage==="setup"&&<Card className="p-5"><h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-4">مشخصات محموله</h4><div className="grid grid-cols-2 gap-3"><label className="text-[11px] font-bold text-[#435a52]">تأمین‌کننده<select className={selectClass} value={supplier} onChange={e=>setSupplier(e.target.value)}><option value="">انتخاب تأمین‌کننده…</option>{master.suppliers.filter(item=>item.active).map(item=><option key={item.id}>{item.name}</option>)}</select></label><label className="text-[11px] font-bold text-[#435a52]">شماره بارنامه / مرجع<input className={selectClass} value={reference} onChange={e=>setReference(e.target.value)} placeholder="مثلاً BL-1405-091" /></label><label className="text-[11px] font-bold text-[#435a52]">تعداد ظرف مورد انتظار<input type="number" className={selectClass} value={expected} onChange={e=>setExpected(Number(e.target.value))}/></label></div><div className="bg-[#edf8f3] rounded-xl p-4 mt-4 text-[12px] text-[#365c4f]"><b className="block mb-1">چرخه ثبت چندظرفی</b>برای هر ظرف، QR و وزن جداگانه ثبت می‌شود. «ثبت ظرف و ادامه» سطر جدید می‌سازد و فرم را برای ظرف بعدی آماده می‌کند.</div><div className="flex justify-end mt-4"><button disabled={!supplier||!activeProducts.length} onClick={()=>setStage("capture")} className="bg-[#176b50] disabled:opacity-40 text-white rounded-lg px-6 h-11 text-[12px] font-bold">شروع ثبت ظروف ←</button></div>{!activeProducts.length&&<p role="alert" className="mt-3 text-[#a43838] text-[11px]">هیچ محصول فعالی برای عملیات جدید وجود ندارد.</p>}</Card>}

    {stage==="capture"&&<>
      <section data-purpose="receiving-scale-monitor" className="relative overflow-hidden rounded-2xl border border-[#176b5066] bg-[#07231a] p-5 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#42d99a14] blur-2xl" />
        <div className="relative grid grid-cols-1 gap-4 xl:grid-cols-12" dir="rtl">
          <div className="col-span-1 flex flex-col justify-between gap-3 border-[#1d594744] xl:col-span-3 xl:border-l xl:pl-4">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-lg border border-[#2a765c66] bg-[#0e3d2e] px-3 py-1.5 text-[11px] font-bold text-[#c9f7e4]"><i className="ml-2 inline-block h-2 w-2 rounded-full bg-[#55d69a]"/>باسکول رومیزی ۱</span>
              <span className="rounded bg-[#0e3d2e] px-2 py-1 font-mono text-[9px] text-[#67e5a9]">10 Hz</span>
            </div>
            <div className="rounded-xl border border-[#2a765c55] bg-[#041711] p-3">
              <div className="flex items-center justify-between text-[11px]"><b className="text-[#c9f7e4]">لودسل آنلاین</b><span className="font-mono text-[#67e5a9]">RS485</span></div>
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-[#94b9aa]"><span>قرائت پایدار</span><b className="font-mono text-[#67e5a9]">± 0.002 kg</b></div>
            </div>
            <div className="rounded-lg border border-[#2a765c55] bg-[#0e3d2e99] px-3 py-2 text-center text-[10px] text-[#67e5a9]">✓ ثبات سیگنال حسگر تأیید شد</div>
          </div>
          <div className="col-span-1 flex flex-col justify-between rounded-xl border border-[#2a765c66] bg-[#041711] px-5 py-4 shadow-inner xl:col-span-4">
            <div className="flex items-center justify-between text-[11px] text-[#bdebd8]"><b><i className="ml-2 inline-block h-2 w-2 rounded-full bg-[#55d69a]"/>وزن خالص (Net Weight)</b><span className="font-mono text-[9px]">SENS: HIGH</span></div>
            <div className="my-2 flex items-baseline justify-center gap-3" dir="ltr"><strong className="font-mono text-[46px] tracking-[.16em] text-white">{net.toFixed(2)}</strong><span className="rounded-md border border-[#2a765c66] bg-[#0e3d2e] px-2 py-1 font-mono text-[11px] text-[#67e5a9]">kg</span></div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-[#78ad98]"><span className="font-mono">STATUS: READY</span><span className="h-1.5 w-24 rounded-full bg-gradient-to-l from-[#55d69a] via-[#2b755c] to-[#123d31]"/></div>
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-3 xl:col-span-3">
            <div className="rounded-xl border border-[#2a765c66] bg-[#0e3d2e99] p-3"><div className="mb-2 flex items-center justify-between text-[10px] text-[#bdebd8]"><b>وزن ناخالص (Gross)</b><span className="font-mono text-[#67e5a9]">GROSS</span></div><div className="flex items-baseline justify-center gap-2 rounded-lg border border-[#2a765c66] bg-[#041711] px-3 py-2" dir="ltr"><strong className="font-mono text-[27px] tracking-[.12em] text-[#7df0b8]">{gross.toFixed(3)}</strong><span className="text-[10px] text-[#67e5a9]">kg</span></div></div>
            <label className="rounded-xl border border-[#2a765c66] bg-[#0e3d2e99] p-3 text-[10px] text-[#bdebd8]"><span className="mb-2 flex justify-between"><b>وزن ظرف (Tare)</b><i className="font-mono not-italic text-[#67e5a9]">TARE</i></span><span className="relative block"><input type="number" step="0.01" value={tare} onChange={e=>setTare(Number(e.target.value))} className="w-full rounded-lg border border-[#2a765c66] bg-[#041711] px-3 py-2 text-center font-mono text-[13px] font-bold text-white outline-none focus:border-[#55d69a]"/><i className="absolute left-3 top-2 font-mono not-italic text-[#67e5a9]">kg</i></span></label>
          </div>
          <div className="col-span-1 flex flex-col justify-between gap-3 border-[#1d594744] xl:col-span-2 xl:border-r xl:pr-4">
            <button onClick={()=>setGross(24.5+Math.random())} className="rounded-xl border border-[#3a8b6d88] bg-gradient-to-l from-[#176b50] to-[#0e3d2e] px-3 py-3 text-[11px] font-bold text-white shadow">↻ دریافت وزن از لودسل</button>
            <div className="grid grid-cols-2 gap-2 text-center text-[9px] text-[#bdebd8]"><span className="rounded-lg border border-[#2a765c66] bg-[#0e3d2e] py-2">Zero</span><span className="rounded-lg border border-[#2a765c66] bg-[#0e3d2e] py-2">Tare</span></div>
            <div className="flex items-center justify-between rounded-lg border border-[#2a765c44] bg-[#0e3d2e99] px-3 py-2 text-[9px] text-[#87b7a4]"><span>پورت اتصال</span><b className="font-mono text-[#c9f7e4]">COM 4</b></div>
          </div>
        </div>
      </section>
      <Card className="mt-4 p-5">
        <div className="mb-3 flex items-center justify-between"><h4 className="text-[13px] font-bold text-[#18302a]">۱. شناسایی ظرف</h4><Badge text={(baskets.length+1)+" / "+expected} color="#176b50" bg="#e1f2eb" /></div>
        <div className="flex flex-col gap-2 xl:flex-row"><input className={selectClass} value={containerCode} onChange={e=>setContainerCode(e.target.value)} placeholder="کد ظرف یا QR"/><button onClick={()=>setScanOpen(true)} className="h-11 shrink-0 rounded-xl bg-[#0e3d2e] px-5 text-[11px] font-bold text-white">⌗ اسکن QR</button><button onClick={()=>setCreateOpen(true)} className="h-11 shrink-0 rounded-xl bg-[#176b50] px-5 text-[11px] font-bold text-white">＋ ساخت ظرف یک‌بارمصرف و چاپ QR</button></div>
        <div className="mt-5 border-t border-[#edf2ef] pt-4"><h4 className="mb-3 text-[13px] font-bold text-[#18302a]">۲. مشخصات محصول</h4><div className="grid grid-cols-1 gap-3 xl:grid-cols-3"><label className="text-[11px] font-bold">محصول<select className={selectClass} value={product} onChange={e=>{const v=e.target.value;setProduct(v);setGrade(options[v].grades[0]);setSize(options[v].sizes[0])}}>{Object.keys(options).map(v=><option key={v}>{v}</option>)}</select></label><label className="text-[11px] font-bold">گرید اظهارشده / اولیه<select className={selectClass} value={grade} onChange={e=>setGrade(e.target.value)}>{options[product].grades.map(v=><option key={v}>{v}</option>)}</select></label><label className="text-[11px] font-bold">اندازه اظهارشده / اولیه<select className={selectClass} value={size} onChange={e=>setSize(e.target.value)}>{options[product].sizes.map(v=><option key={v}>{v}</option>)}</select></label></div></div>
      </Card>
      <div className="mt-4 flex flex-wrap justify-end gap-2 rounded-2xl border border-[#dce5e0] bg-white p-3 shadow-sm"><button onClick={()=>setStage("setup")} className="rounded-xl border border-[#dce5e0] bg-white px-5 py-2.5 text-[11px]">بازگشت</button><button disabled={!containerCode||gross<=0} onClick={addBasket} className="rounded-xl bg-[#176b50] px-6 py-2.5 text-[11px] font-bold text-white disabled:opacity-40">ثبت ظرف و ادامه</button><button disabled={!baskets.length} onClick={()=>setStage("review")} className="rounded-xl bg-[#0e3d2e] px-6 py-2.5 text-[11px] font-bold text-white disabled:opacity-40">بازبینی محموله</button></div>
    </>}

    {stage!=="setup"&&<Card className="mt-4 overflow-hidden"><div className="p-3 border-b border-[#edf2ef] flex justify-between"><h4 className="font-bold text-[#18302a] text-[13px]">ظروف ثبت‌شده در این محموله</h4><span className="text-[11px] text-[#718079]">{baskets.length} ظرف · {total.toFixed(2)} کیلوگرم خالص</span></div>{baskets.length===0?<div className="m-4 border border-dashed border-[#ccd9d3] rounded-lg p-6 text-center text-[#82968e] text-[12px]">هنوز ظرفی ثبت نشده است؛ QR اولین ظرف را اسکن کنید.</div>:<><div className="grid grid-cols-[.35fr_1fr_1fr_1fr_.7fr_.7fr_.7fr_.7fr] bg-[#f3f6f4] px-3 py-2 text-[10px] text-[#718079]"><span>#</span><span>کد ظرف</span><span>محصول</span><span>گرید / اندازه</span><span>ناخالص</span><span>ظرف</span><span>خالص</span><span>عملیات</span></div>{baskets.map((b,i)=><div key={b.id} className="grid grid-cols-[.35fr_1fr_1fr_1fr_.7fr_.7fr_.7fr_.7fr] px-3 py-3 border-t border-[#edf2ef] text-[11px]"><span>{i+1}</span><b className="font-mono">{b.code}</b><span>{b.product}</span><span>{b.grade} · {b.size}</span><span>{b.gross.toFixed(2)}</span><span>{b.tare.toFixed(2)}</span><b>{(b.gross-b.tare).toFixed(2)}</b><button onClick={()=>setBaskets(baskets.filter(x=>x.id!==b.id))} className="text-[#b84242] text-right">حذف</button></div>)}</>}</Card>}

    {stage==="review"&&<div className="mt-4 bg-[#fff8e3] border border-[#ead995] rounded-xl p-4 flex items-center gap-3"><div className="ml-auto"><h4 className="font-bold text-[13px]">کنترل نهایی</h4><p className="text-[11px] text-[#6e654a]">{baskets.length<expected?"تعداد ثبت‌شده کمتر از انتظار است؛ برای ادامه می‌توانید برگردید یا اختلاف را آگاهانه ثبت کنید.":"تعداد ظروف با انتظار محموله مطابقت دارد."}</p></div><button onClick={()=>setStage("capture")} className="bg-white rounded-lg px-4 py-2 text-[11px]">افزودن/اصلاح ظروف</button><button onClick={()=>setStage("dispatch")} className="bg-[#176b50] text-white rounded-lg px-5 py-2 text-[11px] font-bold">تأیید دریافت و انتخاب مقصد ←</button></div>}

    {stage==="dispatch"&&<Card className="mt-4 p-5"><div className="flex items-start justify-between"><div><h3 className="font-bold text-[#18302a] text-[16px]">۴. محل فیزیکی و تحویل محموله</h3><p className="text-[11px] text-[#718079] mt-1">در دریافت فقط یکی از سه سردخانه تعیین می‌شود؛ کنترل کیفیت یک درخواست مستقل است.</p></div><Badge text={`${movedCodes.length} از ${baskets.length} ظرف تحویل‌شده`} color="#176b50" bg="#e1f2eb"/></div>{transferError&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mt-4 text-[11px]">{transferError}</p>}{!dispatchStarted?<><label className="block text-[11px] font-bold mt-5">محل فیزیکی نگهداری<select value={destination} onChange={e=>setDestination(e.target.value)} className={selectClass}><option value="">انتخاب سردخانه…</option>{Object.entries(destinationNames).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label className="mt-3 flex items-center gap-2 rounded-xl border border-[#d8e4df] bg-[#f8fbfa] p-3 text-[11px]"><input type="checkbox" checked={qualityCheckRequired} onChange={e=>setQualityCheckRequired(e.target.checked)}/><span><b>نیازمند کنترل کیفیت</b><small className="block text-[#718079] mt-1">محصول در سردخانه انتخابی می‌ماند و برای تصمیم مدیر علامت‌گذاری می‌شود.</small></span></label><div className="grid grid-cols-2 gap-3 mt-4"><button onClick={()=>setMoveMode("batch")} className={(moveMode==="batch"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df]")+" border-2 rounded-xl p-4 text-right"}><b className="text-[12px]">انتقال کل بچ یکجا</b><p className="text-[10px] text-[#718079] mt-1">همه {baskets.length} ظرف با یک تأیید در سردخانه ثبت می‌شوند.</p></button><button onClick={()=>setMoveMode("scan")} className={(moveMode==="scan"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df]")+" border-2 rounded-xl p-4 text-right"}><b className="text-[12px]">اسکن تک‌تک در همین صفحه</b><p className="text-[10px] text-[#718079] mt-1">کد سبد بعدی خودکار داخل شبیه‌ساز قرار می‌گیرد.</p></button></div><div className="flex justify-end gap-2 mt-5"><button onClick={()=>setStage("review")} className="border rounded-lg px-4 h-11 text-[11px]">بازگشت</button><button disabled={!destination} onClick={startDispatch} className="bg-[#176b50] disabled:opacity-40 text-white rounded-lg px-6 h-11 text-[12px] font-bold">{moveMode==="batch"?"انتقال و تکمیل کل بچ":"شروع اسکن در سردخانه"}</button></div></>:<div className="mt-5 grid grid-cols-[1fr_280px] gap-4"><div><button onClick={()=>setTransferScanOpen(true)} className="w-full h-20 border-2 border-dashed border-[#176b50] rounded-xl text-[#176b50] font-bold">⌗ اسکن سبد بعدی در {destinationNames[destination]}<small className="block mt-1 font-mono">{baskets.find(item=>!movedCodes.includes(item.code))?.code}</small></button><div className="mt-3 max-h-48 overflow-auto">{movedCodes.slice().reverse().map(code=><div key={code} className="flex justify-between border-b py-2 text-[11px]"><span className="text-[#176b50]">تحویل سردخانه ✓</span><b className="font-mono">{code}</b></div>)}</div></div><div className="bg-[#edf8f3] rounded-xl p-4"><b className="text-[12px]">محل فیزیکی: {destinationNames[destination]}</b><p className="text-[10px] text-[#718079] mt-2">{qualityCheckRequired?"درخواست کنترل کیفیت هم ثبت می‌شود؛ محصول تا تصمیم مدیر در همین محل می‌ماند.":"هر اسکن موقعیت، وضعیت و سابقه ظرف را ثبت می‌کند."}</p><div className="mt-4 text-center text-[26px] font-bold text-[#176b50]">{movedCodes.length}/{baskets.length}</div></div></div>}</Card>}

    <ScanSimulator open={scanOpen} title="اسکن سبد دریافت" suggestedCode={"BSK-"+String(baskets.length+1).padStart(4,"0")} onClose={()=>setScanOpen(false)} onScan={acceptContainerScan}/>
    <ScanSimulator open={transferScanOpen} title={`اسکن تحویل به ${destinationNames[destination]||"مقصد"}`} suggestedCode={baskets.find(item=>!movedCodes.includes(item.code))?.code||""} onClose={()=>setTransferScanOpen(false)} onScan={scanDestination}/>
    {createOpen&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[560px] relative"><button onClick={()=>{setCreateOpen(false);setGeneratedCode("")}} className="absolute left-4 top-3 text-[22px]">×</button><h3 className="font-bold text-[#18302a] mb-4">ساخت ظرف یک‌بارمصرف و چاپ QR</h3>{!generatedCode?<><div className="grid grid-cols-2 gap-3"><label className="text-[11px] font-bold">نوع ظرف<select className={selectClass}><option>کارتن تأمین‌کننده</option><option>سبد تأمین‌کننده</option></select></label><label className="text-[11px] font-bold">وزن خالی (kg)<input type="number" className={selectClass} value={tare} onChange={e=>setTare(Number(e.target.value))}/></label></div><div className="bg-[#fff8e3] rounded-lg p-3 text-[11px] text-[#765b15] my-4">برای ظرف یک شناسه موقت یکتا ساخته و QR آن برای چاپ آماده می‌شود.</div><button onClick={()=>setGeneratedCode("TMP-"+String(Date.now()).slice(-7))} className="w-full bg-[#176b50] text-white rounded-lg px-5 py-3 text-[12px] font-bold">ایجاد شناسه و چاپ QR</button></>:<><div className="border border-[#b9ddce] bg-[#edf8f3] rounded-xl p-5 text-center"><div className="w-32 h-32 mx-auto bg-white border-4 border-[#18302a] grid place-items-center text-[58px] mb-3">⌗</div><small className="block text-[#4d6b60]">شناسه ظرف ایجاد شد</small><b className="block font-mono text-[22px] text-[#133a31] my-1">{generatedCode}</b><span className="inline-block mt-2 bg-[#d9f3e7] text-[#176b50] rounded-full px-3 py-1 text-[10px] font-bold">✓ QR برای چاپ آماده شد</span></div><div className="flex gap-2 mt-4"><button onClick={()=>setGeneratedCode("")} className="flex-1 bg-[#edf2ef] rounded-lg py-3 text-[11px]">ساخت مجدد</button><button onClick={()=>{setContainerCode(generatedCode);setGross(24.68);setCreateOpen(false);setGeneratedCode("")}} className="flex-[2] bg-[#176b50] text-white rounded-lg py-3 text-[12px] font-bold">استفاده از این کد در دریافت</button></div></>}</div></div>}
  </div>;
}

function ContainersScreen(){const STORE="storemesh.prototype.containers";const inputClass="w-full h-11 rounded-lg border border-[#d9e3de] bg-white px-3 text-[12px] text-[#18302a] outline-none focus:border-[#176b50]";const batch=readPrototypeBatch();const zones=[{id:"RECEIVING",label:"دریافت"},{id:"COLD_STORAGE",label:"سردخانه"},{id:"SORTING",label:"سورتینگ"},{id:"WASHING",label:"شست‌وشو"},{id:"SLICING",label:"اسلایس"},{id:"FREEZING",label:"فریز"},{id:"DRYING",label:"خشک‌کن"},{id:"PACKAGING",label:"بسته‌بندی"},{id:"SHIPPING",label:"ارسال"}];const seed=[{qr:"CTR-001",type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["RECEIVING","COLD_STORAGE","SORTING"],last:"امروز ۰۹:۳۰",status:"فعال"},{qr:"CTR-002",type:"سبد پلاستیکی",tare:1.3,capacity:25,zones:["RECEIVING"],last:"دیروز ۱۵:۱۰",status:"خراب",damageReason:"ترک بدنه",transferredTo:"CTR-003"},{qr:"CTR-003",type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["SORTING","WASHING","COLD_STORAGE"],last:"امروز ۱۱:۰۰",status:"فعال"}];const [rows,setRows]=useState<any[]>(()=>{try{return JSON.parse(localStorage.getItem(STORE)||"null")||seed}catch{return seed}});const [tab,setTab]=useState<"ACTIVE"|"DAMAGED"|"SINGLE_USE">("ACTIVE");const [modal,setModal]=useState<""|"CREATE"|"EDIT"|"DAMAGE">("");const [selectedRow,setSelectedRow]=useState<any>(null);const [created,setCreated]=useState("");const [damageReason,setDamageReason]=useState("");const [target,setTarget]=useState("");const blank={type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["RECEIVING","COLD_STORAGE","SORTING"]};const [form,setForm]=useState<any>(blank);const persist=(next:any[])=>{setRows(next);localStorage.setItem(STORE,JSON.stringify(next));window.dispatchEvent(new Event("storemesh-data"))};const toggle=(z:string)=>setForm((f:any)=>({...f,zones:f.zones.includes(z)?f.zones.filter((x:string)=>x!==z):[...f.zones,z]}));const prefix=(type:string)=>type==="سینی فرایندی"?"TRY":type==="کانتینر عمومی"?"CTR":"BSK";const create=()=>{if(form.tare<0||form.capacity<=form.tare||!form.zones.length)return;const p=prefix(form.type),n=rows.filter(r=>String(r.qr).startsWith(p+"-")).length+1,qr=p+"-"+String(n).padStart(4,"0");persist([...rows,{...form,qr,last:"استفاده نشده",status:"فعال",singleUse:false}]);setCreated(qr)};const openEdit=(r:any)=>{setSelectedRow(r);setForm({type:r.type,tare:r.tare,capacity:r.capacity,zones:[...r.zones]});setModal("EDIT")};const saveEdit=()=>{if(!selectedRow||form.tare<0||form.capacity<=form.tare||!form.zones.length)return;persist(rows.map(r=>r.qr===selectedRow.qr?{...r,tare:form.tare,capacity:form.capacity,zones:form.zones}:r));setModal("")};const markDamaged=()=>{if(!selectedRow||!damageReason.trim())return;persist(rows.map(r=>r.qr===selectedRow.qr?{...r,status:"خراب",damageReason,transferredTo:target||null,last:"امروز · گزارش خرابی"}:r));setModal("");setTab("DAMAGED")};const singles=batch.baskets.filter(b=>b.code.startsWith("TMP-")).map(b=>({qr:b.code,type:"ظرف یک‌بارمصرف تأمین‌کننده",tare:null,capacity:b.gross,zones:[b.zone||"RECEIVING"],last:batch.createdAt,status:"درحال‌استفاده",singleUse:true}));const shown=tab==="SINGLE_USE"?singles:rows.filter(r=>tab==="ACTIVE"?r.status==="فعال":r.status==="خراب");const zoneNames=(r:any)=>r.zones.map((z:string)=>zones.find(x=>x.id===z)?.label||z).join("، ");return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl"><div className="flex items-start justify-between mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">کانتینرها</h2><p className="text-[#718079] text-[13px]">چرخه عمر سبدهای دائمی و نمایش جداگانه ظروف یک‌بارمصرف</p></div><div className="flex gap-2 items-center"><Badge text="سایت ایران" color="#176b50" bg="#e1f2eb"/><button onClick={()=>{setForm(blank);setCreated("");setModal("CREATE")}} className="bg-[#176b50] text-white rounded-lg px-5 py-2 text-[12px] font-bold">+ سبد جدید</button></div></div><div className="grid grid-cols-3 gap-2 mb-4 max-w-2xl">{[{id:"ACTIVE",label:"سبدهای فعال",count:rows.filter(r=>r.status==="فعال").length},{id:"DAMAGED",label:"خراب / از رده خارج",count:rows.filter(r=>r.status==="خراب").length},{id:"SINGLE_USE",label:"ظروف یک‌بارمصرف",count:singles.length}].map(x=><button onClick={()=>setTab(x.id as any)} className={"rounded-xl border p-3 text-right "+(tab===x.id?"bg-[#176b50] text-white border-[#176b50]":"bg-white border-[#d8e4df]")}><b className="block text-[12px]">{x.label}</b><small>{x.count} مورد</small></button>)}</div><Card className="overflow-hidden"><div className="grid grid-cols-[.8fr_1fr_.7fr_.7fr_1.1fr_1.6fr_.8fr_1fr] gap-2 bg-[#eef3f0] px-3 py-2 text-[10px] text-[#718079]"><span>وضعیت</span><span>آخرین استفاده</span><span>ظرفیت</span><span>وزن خالی</span><span>نوع</span><span>زون‌های مجاز</span><span>کد QR</span><span>عملیات</span></div>{!shown.length?<div className="p-8 text-center text-[#718079] text-[12px]">موردی در این گروه وجود ندارد.</div>:shown.map((r:any)=><div key={r.qr} className="grid grid-cols-[.8fr_1fr_.7fr_.7fr_1.1fr_1.6fr_.8fr_1fr] gap-2 px-3 py-3 border-t text-[11px] items-center"><Badge text={r.status} color={r.status==="فعال"?"#16825b":r.status==="خراب"?"#b84242":"#9a6420"} bg={r.status==="فعال"?"#dff3e9":r.status==="خراب"?"#fbe6e6":"#fff0dc"}/><span>{r.last}</span><b>{r.capacity} kg</b><span>{r.singleUse?"—":r.tare+" kg"}</span><span>{r.type}</span><span>{zoneNames(r)}</span><b className="font-mono">{r.qr}</b><div className="flex gap-2">{tab==="ACTIVE"&&<><button onClick={()=>openEdit(r)} className="text-[#176b50] font-bold">ویرایش</button><button onClick={()=>{setSelectedRow(r);setDamageReason("");setTarget("");setModal("DAMAGE")}} className="text-[#b84242] font-bold">خرابی</button></>}{tab==="DAMAGED"&&<span className="text-[#718079]">کد قفل است</span>}{tab==="SINGLE_USE"&&<span className="text-[#718079]">غیرقابل استفاده مجدد</span>}</div></div>)}</Card>{tab==="SINGLE_USE"&&<div className="mt-3 bg-[#fff8e3] text-[#765b15] rounded-lg p-3 text-[11px]">ظروف یک‌بارمصرف در رهگیری باقی می‌مانند، اما وارد ناوگان سبدهای دائمی و انتخاب سورتینگ نمی‌شوند.</div>}{modal&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[720px] max-h-[90vh] overflow-auto relative"><button onClick={()=>setModal("")} className="absolute left-4 top-3 text-[22px]">×</button>{modal==="DAMAGE"?<><h3 className="font-bold text-[#18302a] text-[18px]">گزارش خرابی {selectedRow?.qr}</h3><p className="text-[#718079] text-[11px] mt-1">کد این سبد برای همیشه حفظ و قفل می‌شود و هرگز به سبد دیگری اختصاص نمی‌یابد.</p><label className="block text-[11px] font-bold mt-4">سبد سالم مقصد (در صورت وجود محصول)<select className={inputClass} value={target} onChange={e=>setTarget(e.target.value)}><option value="">سبد خالی است / انتقال لازم نیست</option>{rows.filter(r=>r.status==="فعال"&&r.qr!==selectedRow?.qr).map(r=><option value={r.qr}>{r.qr}</option>)}</select></label><label className="block text-[11px] font-bold mt-3">علت خرابی<textarea className="w-full border rounded-lg p-3 mt-1" value={damageReason} onChange={e=>setDamageReason(e.target.value)} placeholder="مثلاً شکستگی بدنه یا دسته"/></label><div className="bg-[#fbe6e6] text-[#9f3535] rounded-lg p-3 text-[11px] mt-3">این عملیات حذف نیست؛ سابقه سبد حفظ می‌شود و QR آن دیگر قابل استفاده نخواهد بود.</div><button disabled={!damageReason.trim()} onClick={markDamaged} className="w-full mt-4 bg-[#b84242] disabled:opacity-40 text-white rounded-lg py-3 text-[12px] font-bold">ثبت خرابی و قفل دائمی کد</button></>:!created?<><h3 className="font-bold text-[#18302a] text-[18px]">{modal==="CREATE"?"ساخت سبد جدید":"ویرایش سبد "+selectedRow?.qr}</h3><p className="text-[#718079] text-[11px] mt-1">مالکیت سبدهای دائمی همیشه «مجموعه» است. فقط وزن خالی، ظرفیت و زون‌های مجاز قابل اصلاح‌اند.</p><div className="grid grid-cols-3 gap-3 mt-4"><label className="text-[11px] font-bold">نوع سبد<select disabled={modal==="EDIT"} className={inputClass} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>سبد پلاستیکی</option><option>سبد استیل</option><option>سینی فرایندی</option><option>کانتینر عمومی</option></select></label><label className="text-[11px] font-bold">وزن خالی / Tare (kg)<input type="number" step="0.01" className={inputClass} value={form.tare} onChange={e=>setForm({...form,tare:Number(e.target.value)})}/></label><label className="text-[11px] font-bold">ظرفیت مجاز (kg)<input type="number" className={inputClass} value={form.capacity} onChange={e=>setForm({...form,capacity:Number(e.target.value)})}/></label></div><h4 className="font-bold text-[12px] mt-5 mb-2">زون‌های مجاز (حداقل یک مورد)</h4><div className="grid grid-cols-3 gap-2">{zones.map(z=><button onClick={()=>toggle(z.id)} className={"rounded-lg border px-3 py-2 text-[11px] text-right "+(form.zones.includes(z.id)?"bg-[#e1f2eb] border-[#176b50] text-[#176b50]":"border-[#d8e4df]")}>{form.zones.includes(z.id)?"✓ ":""}{z.label}</button>)}</div><div className="bg-[#eef3f0] rounded-lg p-3 text-[11px] mt-4">پیشوند خودکار نوع: <b className="font-mono">{prefix(form.type)}-</b> · مالکیت: <b>مجموعه</b> · تاریخچه جداگانه کالیبراسیون ثبت نمی‌شود.</div><button disabled={!form.zones.length||form.tare<0||form.capacity<=form.tare} onClick={modal==="CREATE"?create:saveEdit} className="w-full mt-4 bg-[#176b50] disabled:opacity-40 text-white rounded-lg py-3 text-[12px] font-bold">{modal==="CREATE"?"ایجاد شناسه دائمی و QR":"ذخیره اصلاح وزن و زون‌ها"}</button></>:<div className="text-center"><div className="w-36 h-36 mx-auto border-4 border-[#18302a] grid place-items-center text-[64px]">⌗</div><small className="block mt-3 text-[#718079]">سبد مجموعه با موفقیت ساخته شد</small><b className="block font-mono text-[24px] text-[#133a31]">{created}</b><span className="inline-block mt-2 bg-[#dff3e9] text-[#176b50] rounded-full px-3 py-1 text-[10px]">QR آماده چاپ · کد دائمی و غیرقابل بازیافت</span><button onClick={()=>setModal("")} className="w-full mt-5 bg-[#176b50] text-white rounded-lg py-3 text-[12px] font-bold">بستن و مشاهده در فهرست</button></div>}</div></div>}</div>}function ReceivingInventoryScreen(){
 const [view,setView]=useState<"batches"|"containers">("batches"); const [query,setQuery]=useState(""); const [trace,setTrace]=useState<PrototypeBasket|null>(null); const [scanOpen,setScanOpen]=useState(false); const [error,setError]=useState(""); const [revision,setRevision]=useState(0); const receipt=readPrototypeBatch(); const consumed=readProductionLedger().consumedInputs; const batch={...receipt,baskets:receipt.baskets.filter(b=>!consumed.includes(receipt.id+":"+b.code))}; const total=batch.baskets.reduce((s,b)=>s+b.gross-b.tare,0); const pending=batch.baskets.find(b=>b.destination==="COLD_ROOM_DIRTY"); const stateNames:Record<string,string>={IN_SORTING:"در حال سورت",STORED:"موجود در سردخانه",AWAITING_GATE_SCAN:"در انتظار اسکن مقصد",CONSUMED:"مصرف‌شده",RECEIVED:"دریافت‌شده"}; const locationNames:Record<string,string>={SORTING:"سورتینگ",COLD_ROOM_DIRTY:"سردخانه کثیف",COLD_ROOM_CLEAN:"سردخانه تمیز",RECEIVING:"دریافت"}; const displayBatchStatus=batch.baskets.some(b=>b.currentState==="IN_SORTING")?"در حال سورت":batch.status; const activeDestinations=[...new Set(batch.baskets.map(b=>b.destination).filter(Boolean))] as string[]; const displayBatchDestination=activeDestinations.length===1?(locationNames[activeDestinations[0]]||activeDestinations[0]):activeDestinations.length>1?`${activeDestinations.length} مقصد فعال`:"فعلاً حرکت لازم نیست"; batch.destination=displayBatchDestination; const scanGate=(code:string)=>{try{writePrototypeBatch(applyReceiptWorkflowScan(readPrototypeBatch(),code,"COLD_ROOM_DIRTY"));setError("");setRevision(revision+1)}catch(failure:any){setError(failure.message)}};
 const rows=batch.baskets.filter(b=>[b.code,b.product,b.grade,batch.id].join(" ").includes(query));
 return <div className="shrink-0 bg-[#f4f7f5] p-4 overflow-visible" dir="rtl"><div className="flex justify-between mb-3"><div><h2 className="font-bold text-[#18302a] text-[20px]">موجودی و رهگیری</h2><p className="text-[#718079] text-[12px]">نمای سلسله‌مراتبی بچ، ظروف و زنجیره رویداد</p></div><Badge text="همگام با داده همین نشست" color="#176b50" bg="#e1f2eb"/></div>
 <div className="grid grid-cols-4 gap-3 mb-3"><StatCard label="بچ فعال" value={batch.baskets.length?"۱":"۰"}/><StatCard label="ظروف بچ" value={String(batch.baskets.length)}/><StatCard label="وزن خالص" value={total.toFixed(2)+"kg"}/><StatCard label="وضعیت" value={displayBatchStatus}/></div>
 {error&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mb-3 text-[12px]">{error}</p>}{pending&&<div className="bg-white border border-[#c9ddd5] rounded-xl p-3 mb-3 flex items-center gap-3"><div className="ml-auto"><b className="text-[12px]">اقدام بعدی: {pending.nextAction}</b><p className="text-[11px] text-[#718079]">{pending.code} · {pending.currentLocation} ← {pending.destination}</p></div><button onClick={()=>setScanOpen(true)} className="bg-[#176b50] text-white rounded-lg px-4 py-2 text-[12px] font-bold">⌗ اسکن گذرگاه</button></div>}
 <Card><div className="p-3 flex justify-between border-b"><div className="flex gap-2"><button onClick={()=>setView("batches")} className={(view==="batches"?"bg-[#176b50] text-white":"bg-[#edf2ef]")+" px-4 h-9 rounded-lg text-[12px]"}>نمای بچ‌ها</button><button onClick={()=>setView("containers")} className={(view==="containers"?"bg-[#176b50] text-white":"bg-[#edf2ef]")+" px-4 h-9 rounded-lg text-[12px]"}>نمای ظروف</button></div><input value={query} onChange={e=>setQuery(e.target.value)} className="border rounded-lg px-3 h-9 text-[12px]" placeholder="جست‌وجوی بچ، QR یا محصول..."/></div>
 {view==="batches"?<div className="p-3 overflow-visible"><div className="grid grid-cols-7 gap-3 text-[11px] text-[#718079] pb-2"><span>عملیات</span><span>وضعیت</span><span>مقصد</span><span>وزن خالص</span><span>تعداد ظروف</span><span>تأمین‌کننده</span><span>سریال بچ</span></div><div className="grid grid-cols-7 gap-3 items-center border-t py-3 text-[12px] overflow-visible"><button onClick={()=>setView("containers")} className="text-[#176b50] font-bold">بازکردن بچ ←</button><Badge text={displayBatchStatus} color="#176b50" bg="#dff3e9"/><span>{batch.destination||"در انتظار تخصیص"}</span><b>{total.toFixed(2)} kg</b><span>{batch.baskets.length} ظرف</span><span>{batch.supplier}</span><div className="flex items-center gap-2 font-mono"><span>{batch.id}</span><div className="relative group"><button aria-label="جزئیات ظروف بچ" className="w-5 h-5 rounded-full bg-[#dcebe5] text-[#176b50] font-bold">ⓘ</button><div className="hidden group-hover:block absolute z-[80] bottom-7 left-0 w-[420px] bg-[#133a31] text-white rounded-xl shadow-2xl p-4 font-sans pointer-events-none"><b className="block mb-2">ظروف عضو بچ · {batch.baskets.length} عدد</b>{batch.baskets.map(b=><div key={b.code} className="grid grid-cols-4 gap-2 py-2 border-t border-white/15 text-[11px]"><span>{(b.gross-b.tare).toFixed(2)} خالص</span><span>{b.tare.toFixed(2)} ظرف</span><span>{b.gross.toFixed(2)} ناخالص</span><span className="font-mono">{b.code}</span></div>)}</div></div></div></div></div>:<div><div className="grid grid-cols-8 gap-2 px-3 py-2 bg-[#f7faf8] text-[11px] text-[#718079]"><span>عملیات</span><span>وضعیت</span><span>موقعیت</span><span>خالص</span><span>گرید اولیه</span><span>محصول</span><span>بچ والد</span><span>ظرف</span></div>{rows.map(b=><div className="grid grid-cols-8 gap-2 px-3 py-3 border-t text-[11px] items-center"><button onClick={()=>setTrace(b)} className="text-[#176b50] font-bold">رهگیری ←</button><Badge text={stateNames[b.currentState||b.status||""]||b.status||batch.status} color="#176b50" bg="#dff3e9"/><span>{locationNames[b.currentLocation||b.zone||""]||b.zone||batch.destination||"دریافت"}</span><b>{(b.gross-b.tare).toFixed(2)} kg</b><span>{b.grade}</span><span>{b.product}</span><span className="font-mono">{batch.id}</span><span className="font-mono">{b.code}</span></div>)}</div>}</Card>
 {trace&&<div className="fixed inset-0 bg-black/40 z-[90] flex items-center justify-center" onClick={()=>setTrace(null)}><div className="bg-white rounded-2xl w-[700px] overflow-hidden" onClick={e=>e.stopPropagation()}><div className="bg-[#133a31] text-white p-5 flex justify-between"><div><h3 className="font-bold">رهگیری ظرف {trace.code}</h3><p className="text-[11px] text-[#bcd4cc]">بچ والد {batch.id}</p></div><button onClick={()=>setTrace(null)}>×</button></div><div className="p-6"><div className="grid grid-cols-4 gap-2 mb-5">{[["ناخالص",trace.gross.toFixed(2)],["وزن ظرف",trace.tare.toFixed(2)],["خالص",(trace.gross-trace.tare).toFixed(2)],["موقعیت",trace.currentLocation||trace.zone||"دریافت"]].map(x=><div className="bg-[#f1f6f3] p-3 rounded-xl"><small className="block text-[#718079]">{x[0]}</small><b>{x[1]}</b></div>)}</div><div className="bg-[#edf8f3] rounded-lg p-3 mb-4 text-[11px]"><b>اقدام بعدی:</b> {trace.nextAction} · <b>مقصد:</b> {trace.destination||"فعلاً حرکت لازم نیست"}</div><div className="border-r-2 border-[#b9d4ca] pr-5 space-y-4">{batch.events.slice().reverse().map(e=><div><b className="text-[12px] text-[#176b50]">{e.time} · {e.title}</b><p className="text-[11px] text-[#718079]">{e.detail}</p></div>)}</div></div></div></div>}<ScanSimulator open={scanOpen} title="اسکن ورود به سردخانه" suggestedCode={pending?.code||""} onClose={()=>setScanOpen(false)} onScan={scanGate}/></div>
}
// BEGIN PRODUCTION WORKSPACE
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
function WashingSessionScreen({
  ledger,
  onChange,
}: {
  ledger: PWLedger
  onChange: (next: PWLedger, message: string) => void
}) {
  const [mode, setMode] = useState<"ENTRY" | "EXIT">("ENTRY"),
    [scan, setScan] = useState(""),
    [entryWeight, setEntryWeight] = useState(""),
    [outputCode, setOutputCode] = useState(""),
    [outputWeight, setOutputWeight] = useState(""),
    [qualityCheckRequired,setQualityCheckRequired]=useState(false),
    [lossReason, setLossReason] = useState(""),
    [empty, setEmpty] = useState(false),
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
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{...pwBox,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <PWButton type="button" onClick={()=>setMode("ENTRY")} secondary={mode!=="ENTRY"}><b>ثبت ورود به شست‌وشو</b><small style={{display:"block",marginTop:5,opacity:.8}}>اسکن چند سبد هم‌گرید و هم‌اندازه و قفل نشست</small></PWButton>
        <PWButton type="button" onClick={()=>setMode("EXIT")} secondary={mode!=="EXIT"}><b>ثبت خروج از شست‌وشو</b><small style={{display:"block",marginTop:5,opacity:.8}}>ثبت سبدهای تازه، وزن و مسیر بعدی</small></PWButton>
      </div>
      {mode === "ENTRY" && <div style={pwBox}>
        <h2>ورود به نشست شست‌وشوی چندسبدی</h2>
        <PWNotice>
          چند سبد هم‌گرید و هم‌اندازه وارد یک نشست می‌شوند. تا ثبت تمام خروجی‌ها و
          خالی‌شدن واحد، گرید یا اندازه دیگر پذیرفته نمی‌شود.
        </PWNotice>
        {error && (
          <div
            role="alert"
            style={{
              background: "#fff0f0",
              color: "#9f2323",
              padding: 12,
              borderRadius: 9,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}
        <ScanOptionalWeighTransition
          scan={scan}
          setScan={setScan}
          onScan={addInput}
          suggestedCode={eligible[0]?.containerCode || ""}
          lastWeight={scanned?.weightKg}
          weight={entryWeight}
          setWeight={setEntryWeight}
          action="ثبت سبد در نشست شست‌وشو"
        />
        <div style={{ marginTop: 16 }}>
          {sources.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "10px 0",
                borderTop: "1px solid #e1eae6",
                fontSize: 13,
              }}
            >
              <b>{item.containerCode}</b> · {item.code} · {item.grade}/
              {item.size} · {item.weightKg} kg
            </div>
          ))}
        </div>
        {active && (
          <div
            style={{
              marginTop: 14,
              background: "#fff8e3",
              padding: 12,
              borderRadius: 9,
              fontSize: 12,
            }}
          >
            نشست {active.id} · قفل سازگاری:{" "}
            <b>
              {active.grade} / {active.size}
            </b>
          </div>
        )}
        {active && <PWNotice>ورودی‌ها ذخیره شده‌اند و پس از خاموش و روشن شدن سیستم نیز نشست {active.id} فعال می‌ماند. برای ثبت محصول شسته‌شده «خروج از شست‌وشو» را انتخاب کنید.</PWNotice>}
      </div>}
      {mode === "EXIT" && <div style={pwBox}>
        <h2>خروج از نشست شست‌وشو</h2>
        {!active ? (
          <PWEmpty>با اسکن اولین ورودی، نشست ساخته می‌شود.</PWEmpty>
        ) : (
          <>
            <PWField label="اسکن سبد خالی خروجی">
              <div style={{display:"flex",gap:8}}><input value={outputCode} onChange={(event) => setOutputCode(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();addOutput()}}} style={pwInput} placeholder="سبد جدید؛ مستقل از ورودی‌ها"/><PWButton secondary onClick={()=>setOutputScanOpen(true)}>⌗ اسکن</PWButton></div>
            </PWField>
            <PWField label="وزن خالص خروجی (kg)">
              <input
                type="number"
                min="0.001"
                step="0.001"
                value={outputWeight}
                onChange={(event) => setOutputWeight(event.target.value)}
                style={pwInput}
              />
            </PWField>
            <label style={{display:"flex",gap:8,alignItems:"center",fontSize:12,margin:"10px 0",padding:10,border:"1px solid #d5e3dd",borderRadius:9}}><input type="checkbox" checked={qualityCheckRequired} onChange={event=>setQualityCheckRequired(event.target.checked)}/><span><b>نیازمند کنترل کیفیت در خروج شست‌وشو</b><small style={{display:"block",color:"#718079"}}>تا تصمیم مدیر، اقدام بعدی برای این سبد متوقف می‌شود.</small></span></label>
            <PWButton
              disabled={!outputCode || !outputWeight}
              onClick={addOutput}
            >
              ثبت این خروجی
            </PWButton>
            <ScanSimulator open={outputScanOpen} title="اسکن سبد خروجی شست‌وشو" suggestedCode={outputCode||"CTR-003"} onClose={()=>setOutputScanOpen(false)} onScan={code=>setOutputCode(code)}/>
            <div style={{ margin: "15px 0" }}>
              {active.outputs.map((row: any, index: number) => (
                <p key={row.containerCode}>
                  {index + 1}. {row.containerCode} · {row.weightKg} kg
                </p>
              ))}
            </div>
            <div
              style={{
                background: "#eff8f5",
                padding: 12,
                borderRadius: 9,
                fontSize: 12,
              }}
            >
              ورودی {inputTotal} kg · خروجی {outputTotal} kg · مانده/افت {loss}{" "}
              kg
            </div>
            <PWField label="علت افت یا مانده (در صورت اختلاف)">
              <input
                value={lossReason}
                onChange={(event) => setLossReason(event.target.value)}
                style={pwInput}
              />
            </PWField>
            <label
              style={{
                display: "flex",
                gap: 8,
                fontSize: 12,
                margin: "12px 0",
              }}
            >
              <input
                type="checkbox"
                checked={empty}
                onChange={(event) => setEmpty(event.target.checked)}
              />
              تمام محصول در خروجی‌ها ثبت شده و واحد شست‌وشو کاملاً خالی است.
            </label>
            <PWButton
              disabled={
                !active.outputs.length ||
                !empty ||
                loss < 0 ||
                (loss > 0 && !lossReason.trim())
              }
              onClick={complete}
            >
              تکمیل نشست و ساخت شجره خروجی‌ها
            </PWButton>
          </>
        )}
      </div>}
    </div>
  )
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
    ["wash", "شست‌وشو"],
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
      {tab === "wash" && (
        <WashingSessionScreen
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
            {title:"عملیات شست‌وشو",hint:"نشست چندسبدی و خروجی‌های تازه",items:[["wash","ثبت ورود یا خروج شست‌وشو","◉"]]},
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
  const [scanOpen,setScanOpen]=useState(false),[scanned,setScanned]=useState(""),[scanError,setScanError]=useState("");
  const handleScan=(raw:string)=>{const code=raw.trim().toUpperCase();try{const ledger=readProductionLedger(),item=ledger.items.find(row=>!row.consumed&&[row.containerCode,...(row.trays||[]).map((tray:any)=>tray.code)].map(pwCode).includes(code));if(!item||(item.zone!=="PACKAGING"&&item.nextZone!=="PACKAGING"))throw Error("این کد برای ورود به بسته‌بندی واجد شرایط نیست.");const from=item.zone;item.zone="PACKAGING";item.currentLocation="PACKAGING";item.currentState="PACKAGING_INPUT_CONFIRMED";item.nextAction="شروع دستور بسته‌بندی";pwEvent(ledger,"اسکن ورود بسته‌بندی",item.code,{scan:code,from,to:"PACKAGING"});saveProductionLedger(ledger);setScanned(code);setScanError("")}catch(failure:any){setScanError(failure.message)}};
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
      {scanError&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mb-3 text-[12px]">{scanError}</p>}<div className="bg-white border border-[#c9ddd5] rounded-xl p-3 mb-4 flex items-center gap-3"><div className="ml-auto"><b className="text-[12px]">ورود بچ به بسته‌بندی با اسکن</b><p className="text-[11px] text-[#718079]">{scanned?`تأیید شد: ${scanned}`:"ظرف یا سینی واجد شرایط را اسکن کنید."}</p></div><button onClick={()=>setScanOpen(true)} className="bg-[#176b50] text-white rounded-lg px-4 py-2 text-[12px] font-bold">⌗ اسکن</button></div>

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
      <ScanSimulator open={scanOpen} title="اسکن ورود بسته‌بندی" suggestedCode={scanned} onClose={()=>setScanOpen(false)} onScan={handleScan}/>
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
  const [scanOpen,setScanOpen]=useState(false),[scanned,setScanned]=useState(""),[scanError,setScanError]=useState("");
  const handleScan=(raw:string)=>{const code=raw.trim().toUpperCase();try{const ledger=readProductionLedger(),item=ledger.items.find(row=>!row.consumed&&[row.containerCode,...(row.trays||[]).map((tray:any)=>tray.code)].map(pwCode).includes(code));if(!item||item.zone!=="PACKAGING")throw Error("فقط موجودی تکمیل‌شده بسته‌بندی برای ارسال پذیرفته می‌شود.");item.zone="SHIPPING";item.currentLocation="SHIPPING";item.currentState="OUTBOUND_STAGED";item.destination=null;item.nextAction="افزودن به محموله خروجی";pwEvent(ledger,"اسکن ورود ارسال",item.code,{scan:code,from:"PACKAGING",to:"SHIPPING"});saveProductionLedger(ledger);setScanned(code);setScanError("")}catch(failure:any){setScanError(failure.message)}};
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
      {scanError&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mb-3 text-[12px]">{scanError}</p>}<div className="bg-white border border-[#c9ddd5] rounded-xl p-3 mb-3 flex items-center gap-3"><div className="ml-auto"><b className="text-[12px]">اسکن خروج واقعی</b><p className="text-[11px] text-[#718079]">{scanned?`در محوطه ارسال ثبت شد: ${scanned}`:"این بخش فقط ارسال بیرونی است؛ جابه‌جایی داخلی از مسیر عملیات انجام می‌شود."}</p></div><button onClick={()=>setScanOpen(true)} className="bg-[#176b50] text-white rounded-lg px-4 py-2 text-[12px] font-bold">⌗ اسکن بسته خروجی</button></div>

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
      <ScanSimulator open={scanOpen} title="اسکن بسته خروجی برای ارسال" suggestedCode={scanned} onClose={()=>setScanOpen(false)} onScan={handleScan}/>
    </div>
  );
}

function LegacyTransfersScreen({navigate}:{navigate:(s:WebScreen)=>void}){
 const receipt=readPrototypeBatch(); const consumed=readProductionLedger().consumedInputs; const batch={...receipt,baskets:receipt.baskets.filter(b=>!consumed.includes(receipt.id+":"+b.code))}; const [kind,setKind]=useState<"internal"|"site">("internal"); const [stage,setStage]=useState<"setup"|"scan"|"done">("setup"); const [dest,setDest]=useState(""); const [moved,setMoved]=useState<string[]>([]); const ids=batch.baskets.map(b=>b.code); const internal=["قرنطینه QC","سردخانه ۱ · زون A","سردخانه ۱ · زون B","سورتینگ · خط ۱","بسته‌بندی · خط ۲","انبار محصول نهایی"];
 const complete=()=>{const updated={...batch,status:kind==="internal"?"موجودی فعال":"در راه",destination:dest,baskets:batch.baskets.map(b=>({...b,zone:dest,status:kind==="internal"?"قابل مصرف":"در راه"})),events:[...batch.events,{time:"همین حالا",title:kind==="internal"?"انتقال داخلی تکمیل شد":"مانیفست بین‌سایتی صادر شد",detail:dest+" · "+batch.baskets.length+" ظرف"}]};writePrototypeBatch({...updated,baskets:receipt.baskets.map(b=>updated.baskets.find(x=>x.code===b.code)||b)});setStage("done")};
 if(stage==="done")return <div className="flex-1 bg-[#f4f7f5] p-8" dir="rtl"><Card className="max-w-3xl mx-auto mt-12 p-9 text-center"><div className="w-16 h-16 rounded-full bg-[#176b50] text-white text-3xl mx-auto flex items-center justify-center">✓</div><h2 className="font-bold text-[23px] mt-4">{kind==="internal"?"انتقال داخلی ثبت شد":"مانیفست انتقال بین‌سایتی ساخته شد"}</h2><p className="text-[12px] text-[#718079] mt-2">{batch.id} · {batch.baskets.length} ظرف · مقصد {dest}</p><div className="flex gap-2 justify-center mt-6"><button onClick={()=>navigate("inventory")} className="bg-[#176b50] text-white h-11 px-6 rounded-lg">مشاهده موجودی و رهگیری</button><button onClick={()=>{setStage("setup");setMoved([]);setDest("")}} className="border h-11 px-5 rounded-lg">انتقال جدید</button></div></Card></div>;
 return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl"><div className="flex justify-between mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">مرکز انتقال</h2><p className="text-[#718079] text-[13px]">انتقال داخلی بین زون‌ها و فرایندها یا انتقال بین سایت‌ها</p></div><Badge text="کنترل مقصد بر اساس وضعیت کالا" color="#176b50" bg="#e1f2eb"/></div><div className="grid grid-cols-2 gap-3 mb-4"><button onClick={()=>{setKind("internal");setStage("setup");setDest("")}} className={(kind==="internal"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df] bg-white")+" border-2 rounded-xl p-4 text-right"}><b>انتقال داخلی سایت</b><p className="text-[11px] text-[#718079]">دریافت، قرنطینه، سردخانه، سورتینگ، تولید و بسته‌بندی</p></button><button onClick={()=>{setKind("site");setStage("setup");setDest("")}} className={(kind==="site"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df] bg-white")+" border-2 rounded-xl p-4 text-right"}><b>انتقال بین سایت‌ها</b><p className="text-[11px] text-[#718079]">ساخت مانیفست، ارسال، وضعیت در راه و تأیید تحویل</p></button></div>
 {stage==="setup"?<div className="grid grid-cols-3 gap-4"><Card className="col-span-2 p-5"><h3 className="font-bold mb-4">۱. تعریف مقصد مجاز</h3><div className="grid grid-cols-2 gap-3"><label className="text-[11px]">بچ/محموله مبدأ<input readOnly value={batch.id} className="w-full h-11 border rounded-lg px-3 mt-1 font-mono bg-[#f7faf8]"/></label><label className="text-[11px]">{kind==="internal"?"زون یا فرایند مقصد":"سایت مقصد"}<select value={dest} onChange={e=>setDest(e.target.value)} className="w-full h-11 border rounded-lg px-3 mt-1 bg-white"><option value="">انتخاب کنید...</option>{(kind==="internal"?internal:["سایت تبریز","سایت اصفهان","سایت شیراز"]).map(x=><option>{x}</option>)}</select></label></div>{dest&&<div className="mt-4 bg-[#edf8f3] rounded-xl p-4 text-[11px]"><b className="text-[#176b50]">مقصد بر اساس وضعیت فعلی مجاز است ✓</b><p className="mt-1">{kind==="internal"?"ظرف قرنطینه فقط به QC و محصول آزادشده به سردخانه/سورتینگ/بسته‌بندی منتقل می‌شود.":"پس از اسکن، مانیفست با شناسه shipment ساخته خواهد شد."}</p></div>}<button disabled={!dest} onClick={()=>setStage("scan")} className="mt-5 bg-[#176b50] disabled:bg-[#aab8b3] text-white h-11 px-6 rounded-lg">شروع عملیات اسکن</button></Card><Card className="p-5"><b>مبدأ</b><p className="font-mono text-[#176b50] mt-2">{batch.id}</p><div className="space-y-2 mt-4 text-[11px]"><div className="flex justify-between"><span>تأمین‌کننده</span><b>{batch.supplier}</b></div><div className="flex justify-between"><span>تعداد ظروف</span><b>{batch.baskets.length}</b></div><div className="flex justify-between"><span>وضعیت</span><b>{batch.status}</b></div></div></Card></div>:<div className="grid grid-cols-[1fr_320px] gap-4"><Card className="p-5"><h3 className="font-bold">۲. اسکن در گیت {dest}</h3><button onClick={()=>{const n=ids.find(x=>!moved.includes(x));if(n)setMoved([...moved,n])}} className="w-full h-14 border-2 border-dashed border-[#176b50] rounded-xl text-[#176b50] mt-4 font-bold">⌗ شبیه‌سازی اسکن ظرف بعدی</button><div className="mt-4">{moved.slice().reverse().map(x=><div className="flex justify-between border-t py-2 text-[11px]"><span className="text-[#176b50]">تأیید گیت ✓</span><span className="font-mono">{x}</span></div>)}</div></Card><Card className="p-5"><div className="w-28 h-28 rounded-full border-[10px] border-[#dbe9e3] mx-auto flex items-center justify-center"><b>{moved.length}/{ids.length}</b></div><button disabled={moved.length<ids.length} onClick={complete} className="w-full mt-5 bg-[#176b50] disabled:bg-[#aab8b3] text-white h-11 rounded-lg">{kind==="internal"?"تکمیل انتقال و ثبت موجودی":"صدور مانیفست و ارسال"}</button><button onClick={()=>setStage("setup")} className="w-full border h-10 rounded-lg mt-2">بازگشت</button></Card></div>}</div>
}
function InventoryMovementScreen({navigate}:{navigate:(s:WebScreen)=>void}){
  const receipt=readPrototypeBatch(),master=readMasterData();
  const locations=["سردخانه ۱", "سردخانه ۲", ...master.warehouses.filter(x=>x.active).map(x=>x.name)];
  const [code,setCode]=useState(""),[from,setFrom]=useState(""),[to,setTo]=useState(""),[reason,setReason]=useState(""),[done,setDone]=useState(false),[error,setError]=useState("");
  const move=()=>{const basket=receipt.baskets.find(item=>item.code===code.trim());if(!basket)return setError("کد اسکن‌شده در موجودی جاری پیدا نشد.");if(!from||!to||from===to||!reason.trim())return setError("مبدأ، مقصد متفاوت و علت جابجایی استثنایی الزامی است.");const at=new Date().toLocaleTimeString("fa-IR");writePrototypeBatch({...receipt,baskets:receipt.baskets.map(item=>item.code===basket.code?{...item,zone:to,status:"STORED",currentLocation:to,currentState:"STORED",destination:null,nextAction:"منتظر تخصیص برنامه تولید"}:item),events:[...receipt.events,{time:at,title:"جابجایی استثنایی موجودی",detail:`${basket.code} · ${from} ← ${to} · ${reason}`} ]});setDone(true);setError("")};
  if(done)return <div className="flex-1 bg-[#f4f7f5] p-8" dir="rtl"><Card className="max-w-2xl mx-auto p-8 text-center"><h2 className="text-xl font-bold text-[#176b50]">جابجایی موجودی ثبت شد</h2><p className="mt-3 text-[12px]">موقعیت جاری، سابقه حرکت و رهگیری هم‌زمان به‌روزرسانی شدند.</p><div className="flex gap-2 justify-center mt-5"><button className="bg-[#176b50] text-white rounded-lg px-5 py-3" onClick={()=>navigate("inventory")}>مشاهده موجودی</button><button className="border rounded-lg px-5 py-3" onClick={()=>{setDone(false);setCode("");setReason("")}}>جابجایی دیگر</button></div></Card></div>;
  return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl"><div className="mb-4"><h2 className="font-bold text-[#18302a] text-[22px]">جابجایی استثنایی موجودی</h2><p className="text-[#718079] text-[13px]">فقط برای انتقال خارج از مسیر عادی؛ حرکت‌های دریافت و تولید با اسکن همان مرحله ثبت می‌شوند.</p></div>{error&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mb-3">{error}</p>}<Card className="p-5 max-w-3xl"><label className="text-[11px] font-bold">اسکن QR سبد<input value={code} onChange={e=>setCode(e.target.value)} placeholder="مثلاً BSK-0002" className="w-full h-12 border-2 border-dashed border-[#176b50] rounded-lg px-3 mt-1 font-mono"/></label><div className="grid grid-cols-2 gap-3 mt-4"><label className="text-[11px]">مبدأ<select value={from} onChange={e=>setFrom(e.target.value)} className="w-full h-11 border rounded-lg px-3 mt-1 bg-white"><option value="">انتخاب…</option>{locations.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-[11px]">مقصد<select value={to} onChange={e=>setTo(e.target.value)} className="w-full h-11 border rounded-lg px-3 mt-1 bg-white"><option value="">انتخاب…</option>{locations.map(x=><option key={x}>{x}</option>)}</select></label></div><label className="block text-[11px] mt-3">علت<textarea value={reason} onChange={e=>setReason(e.target.value)} className="w-full border rounded-lg p-3 mt-1" placeholder="مثلاً جابه‌جایی ظرفیت سردخانه"/></label><button onClick={move} className="w-full mt-4 bg-[#176b50] text-white rounded-lg py-3 font-bold">تأیید جابجایی اسکن‌شده</button></Card></div>
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
}function LegacyMasterDataScreen() {
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
}
function LegacyConfiguredMasterDataScreen(){
  const [data,setData]=useState<MasterDataState>(()=>readMasterData());
  const [tab,setTab]=useState<keyof MasterDataState>("products"),[editing,setEditing]=useState<any>(null),[open,setOpen]=useState(false),[error,setError]=useState("");
  const labels:any={products:"محصولات",suppliers:"تأمین‌کنندگان",customers:"مشتریان",warehouses:"انبارها"};
  const blank=()=>tab==="products"?{id:"",code:"",name:"",category:"",grades:"",sizes:"",active:true}:{id:"",code:"",name:"",contact:"",location:"",active:true};
  const [form,setForm]=useState<any>(blank());
  const persist=(next:MasterDataState)=>{setData(next);writeMasterData(next)};
  const choose=(key:keyof MasterDataState)=>{setTab(key);setOpen(false);setEditing(null);setError("");setForm(key==="products"?{id:"",code:"",name:"",category:"",grades:"",sizes:"",active:true}:{id:"",code:"",name:"",contact:"",location:"",active:true})};
  const begin=(row?:any)=>{setEditing(row||null);setError("");setForm(row?{...row,grades:Array.isArray(row.grades)?row.grades.join("، "):"",sizes:Array.isArray(row.sizes)?row.sizes.join("، "):""}:blank());setOpen(true)};
  const save=()=>{const name=String(form.name||"").trim(),code=String(form.code||"").trim();if(!name||!code)return setError("نام و کد الزامی است.");let row:any={...form,id:editing?.id||`${tab.slice(0,1).toUpperCase()}-${Date.now()}`,name,code};if(tab==="products"){row.grades=String(form.grades||"").split(/[،,]/).map((x:string)=>x.trim()).filter(Boolean);row.sizes=String(form.sizes||"").split(/[،,]/).map((x:string)=>x.trim()).filter(Boolean);if(!row.grades.length)return setError("حداقل یک گرید برای محصول تعریف کنید.");if(!row.sizes.length)row.sizes=["استاندارد"]}const rows=(data[tab] as any[]);const nextRows=editing?rows.map(x=>x.id===editing.id?row:x):[...rows,row];const next={...data,[tab]:nextRows};persist(next);setOpen(false);setEditing(null)};
  const toggle=(row:any)=>{const next={...data,[tab]:(data[tab] as any[]).map(x=>x.id===row.id?{...x,active:!x.active}:x)} as MasterDataState;persist(next)};
  const rows=data[tab] as any[];
  return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl"><div className="flex justify-between items-start mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">داده‌های پایه</h2><p className="text-[#718079] text-[13px]">هر تب منبع داده، فرم ایجاد و ویرایش مستقل دارد.</p></div><GreenBtn onClick={()=>begin()}>+ افزودن {labels[tab]}</GreenBtn></div><div className="flex gap-2 mb-4">{(Object.keys(labels) as (keyof MasterDataState)[]).map(key=><button key={key} onClick={()=>choose(key)} className={(tab===key?"bg-[#176b50] text-white":"bg-[#e8efec] text-[#718079]")+" px-4 py-2 rounded-full text-[12px]"}>{labels[key]}</button>)}</div><Card className="overflow-hidden"><div className="grid grid-cols-[.75fr_1fr_1.2fr_1.3fr_1fr] gap-3 bg-[#eef3f0] p-3 text-[11px] text-[#718079]"><span>عملیات</span><span>وضعیت</span><span>{tab==="products"?"گریدهای محصول":tab==="warehouses"?"موقعیت":"تماس"}</span><span>نام</span><span>کد</span></div>{rows.map(row=><div key={row.id} className="grid grid-cols-[.75fr_1fr_1.2fr_1.3fr_1fr] gap-3 p-3 border-t items-center text-[12px]"><div className="flex gap-2"><button onClick={()=>begin(row)} className="text-[#176b50] font-bold">ویرایش</button><button onClick={()=>toggle(row)} className="text-[#8a611c]">{row.active?"غیرفعال":"فعال"}</button></div><Badge text={row.active?"فعال":"غیرفعال"} color={row.active?"#16825b":"#718079"} bg={row.active?"#dff3e9":"#e8efec"}/><span>{tab==="products"?row.grades.join("، "):tab==="warehouses"?row.location:row.contact}</span><b>{row.name}</b><span className="font-mono">{row.code}</span></div>)}</Card>{open&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[680px]" dir="rtl"><div className="flex justify-between"><h3 className="font-bold text-[18px]">{editing?"ویرایش":"افزودن"} {labels[tab]}</h3><button onClick={()=>setOpen(false)} className="text-xl">×</button></div>{error&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mt-3 text-[12px]">{error}</p>}<div className="grid grid-cols-2 gap-3 mt-4"><label className="text-[11px]">نام<input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label><label className="text-[11px]">کد<input value={form.code||""} onChange={e=>setForm({...form,code:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label>{tab==="products"?<><label className="text-[11px]">دسته‌بندی<input value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label><label className="text-[11px]">گریدها (با ویرگول جدا کنید)<input value={form.grades||""} onChange={e=>setForm({...form,grades:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1" placeholder="A، B، C"/></label><label className="text-[11px] col-span-2">اندازه‌ها<input value={form.sizes||""} onChange={e=>setForm({...form,sizes:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1" placeholder="درشت، متوسط، ریز"/></label></>:tab==="warehouses"?<label className="text-[11px] col-span-2">موقعیت<input value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label>:<label className="text-[11px] col-span-2">شماره تماس<input value={form.contact||""} onChange={e=>setForm({...form,contact:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label>}</div><label className="flex gap-2 mt-4 text-[12px]"><input type="checkbox" checked={form.active!==false} onChange={e=>setForm({...form,active:e.target.checked})}/>فعال و قابل انتخاب در عملیات جدید</label><button onClick={save} className="w-full mt-5 bg-[#176b50] text-white rounded-lg py-3 font-bold">ذخیره</button></div></div>}</div>
}
function MasterDataScreen(){
  const [data,setData]=useState<MasterDataState>(()=>readMasterData());
  const [tab,setTab]=useState<keyof MasterDataState>("products");
  const [open,setOpen]=useState(false),[editing,setEditing]=useState<any>(null),[error,setError]=useState("");
  const processOptions=["RECEIVING","SORTING","WASHING","SLICING","FREEZING","FREEZE_DRYING","DRYING","PACKAGING"];
  const processNames:Record<string,string>={RECEIVING:"دریافت",SORTING:"سورتینگ",WASHING:"شست‌وشو",SLICING:"اسلایس",FREEZING:"فریز",FREEZE_DRYING:"فریز درای",DRYING:"خشک‌کن",PACKAGING:"بسته‌بندی"};
  const labels:Record<keyof MasterDataState,string>={products:"محصولات",suppliers:"تأمین‌کنندگان",customers:"مشتریان",warehouses:"مقصدهای فیزیکی",operationalDestinations:"مقصدهای عملیاتی"};
  const blankFor=(key=tab)=>key==="products"?{id:"",code:"",name:"",category:"",grades:"",sizes:"",active:true}:key==="operationalDestinations"?{id:"",code:"",name:"",appliesTo:["SORTING"],active:true}:{id:"",code:"",name:"",contact:"",location:"",active:true};
  const [form,setForm]=useState<any>(()=>blankFor("products"));
  const choose=(key:keyof MasterDataState)=>{setTab(key);setOpen(false);setEditing(null);setError("");setForm(blankFor(key))};
  const begin=(row?:any)=>{setEditing(row||null);setError("");setForm(row?{...row,grades:Array.isArray(row.grades)?row.grades.join("، "):"",sizes:Array.isArray(row.sizes)?row.sizes.join("، "):"",appliesTo:[...(row.appliesTo||[])]}:blankFor());setOpen(true)};
  const save=()=>{const name=String(form.name||"").trim(),code=String(form.code||"").trim().toUpperCase();if(!name||!code)return setError("نام و کد الزامی است.");const rows=data[tab] as any[];if(rows.some(row=>row.id!==editing?.id&&String(row.code).toUpperCase()===code))return setError("این کد قبلاً ثبت شده است.");let row:any={...form,id:editing?.id||`${String(tab).slice(0,2).toUpperCase()}-${Date.now()}`,name,code};if(tab==="products"){row.grades=String(form.grades||"").split(/[،,]/).map((x:string)=>x.trim()).filter(Boolean);row.sizes=String(form.sizes||"").split(/[،,]/).map((x:string)=>x.trim()).filter(Boolean);if(!row.grades.length)return setError("حداقل یک گرید برای محصول تعریف کنید.");if(!row.sizes.length)row.sizes=["استاندارد"]}if(tab==="operationalDestinations"&&!row.appliesTo.length)return setError("حداقل یک محل کاربرد انتخاب کنید.");const next={...data,[tab]:editing?rows.map(item=>item.id===editing.id?row:item):[...rows,row]};setData(next);writeMasterData(next);setOpen(false);setEditing(null)};
  const toggle=(row:any)=>{const next={...data,[tab]:(data[tab] as any[]).map(item=>item.id===row.id?{...item,active:!item.active}:item)} as MasterDataState;setData(next);writeMasterData(next)};
  const rows=data[tab] as any[],physicalLocked=tab==="warehouses";
  const detail=(row:any)=>tab==="products"?row.grades.join("، "):tab==="warehouses"?row.location:tab==="operationalDestinations"?(row.appliesTo||[]).map((id:string)=>processNames[id]||id).join("، "):row.contact;
  return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
    <div className="flex justify-between items-start mb-4"><div><h2 className="font-bold text-[#18302a] text-[22px]">داده‌های پایه</h2><p className="text-[#718079] text-[13px]">مکان فیزیکی، مقصد عملیاتی و فرایند از هم جدا نگهداری می‌شوند.</p></div>{!physicalLocked&&<GreenBtn onClick={()=>begin()}>+ افزودن {labels[tab]}</GreenBtn>}</div>
    <div className="flex flex-wrap gap-2 mb-4">{(Object.keys(labels) as (keyof MasterDataState)[]).map(key=><button key={key} onClick={()=>choose(key)} className={(tab===key?"bg-[#176b50] text-white":"bg-[#e8efec] text-[#718079]")+" px-4 py-2 rounded-full text-[12px]"}>{labels[key]}</button>)}</div>
    {physicalLocked&&<div className="mb-4 rounded-xl border border-[#b9d8cb] bg-[#eef8f3] p-4 text-[12px]"><b>سه مقصد فیزیکی مصوب</b><p className="mt-1 text-[#60746f]">این سه سردخانه مرجع ثابت نمونه هستند. فرایندهایی مانند سورتینگ و شست‌وشو مقصد فیزیکی محسوب نمی‌شوند.</p></div>}
    {tab==="operationalDestinations"&&<div className="mb-4 rounded-xl border border-[#d8e4df] bg-white p-4 text-[12px]"><b>مقصد عملیاتی یعنی نتیجه نهایی محصول</b><p className="mt-1 text-[#60746f]">سورتینگ، شست‌وشو، اسلایس و بسته‌بندی فرایند هستند و در این فهرست ثبت نمی‌شوند. «محل کاربرد» تعیین می‌کند هر مقصد در کدام خروجی قابل انتخاب باشد.</p></div>}
    <Card className="overflow-hidden"><div className="grid grid-cols-[.8fr_.8fr_2fr_1.2fr_1fr] gap-3 bg-[#eef3f0] p-3 text-[11px] text-[#718079]"><span>عملیات</span><span>وضعیت</span><span>{tab==="operationalDestinations"?"محل‌های کاربرد":tab==="warehouses"?"تعریف":"جزئیات"}</span><span>نام</span><span>کد</span></div>{rows.map(row=><div key={row.id} className="grid grid-cols-[.8fr_.8fr_2fr_1.2fr_1fr] gap-3 p-3 border-t items-center text-[12px]"><div className="flex gap-2">{!physicalLocked&&<><button onClick={()=>begin(row)} className="text-[#176b50] font-bold">ویرایش</button><button onClick={()=>toggle(row)} className="text-[#8a611c]">{row.active?"غیرفعال":"فعال"}</button></>}</div><Badge text={row.active?"فعال":"غیرفعال"} color={row.active?"#16825b":"#718079"} bg={row.active?"#dff3e9":"#e8efec"}/><span>{detail(row)}</span><b>{row.name}</b><span className="font-mono text-[10px]">{row.code}</span></div>)}</Card>
    {open&&<div className="fixed inset-0 z-[110] bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[720px] max-h-[88vh] overflow-auto" dir="rtl"><div className="flex justify-between"><h3 className="font-bold text-[18px]">{editing?"ویرایش":"افزودن"} {labels[tab]}</h3><button onClick={()=>setOpen(false)} className="text-xl">×</button></div>{error&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mt-3 text-[12px]">{error}</p>}<div className="grid grid-cols-2 gap-3 mt-4"><label className="text-[11px]">نام<input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label><label className="text-[11px]">کد<input value={form.code||""} onChange={e=>setForm({...form,code:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1 font-mono"/></label>{tab==="products"?<><label className="text-[11px]">دسته‌بندی<input value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label><label className="text-[11px]">گریدها<input value={form.grades||""} onChange={e=>setForm({...form,grades:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1" placeholder="A، B، C"/></label><label className="text-[11px] col-span-2">اندازه‌ها<input value={form.sizes||""} onChange={e=>setForm({...form,sizes:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label></>:tab==="operationalDestinations"?<div className="col-span-2"><b className="text-[12px]">محل‌های کاربرد</b><div className="grid grid-cols-4 gap-2 mt-2">{processOptions.map(id=><label key={id} className={(form.appliesTo?.includes(id)?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df]")+" flex items-center gap-2 border rounded-lg p-2 text-[11px]"}><input type="checkbox" checked={form.appliesTo?.includes(id)||false} onChange={e=>setForm({...form,appliesTo:e.target.checked?[...(form.appliesTo||[]),id]:(form.appliesTo||[]).filter((x:string)=>x!==id)})}/>{processNames[id]}</label>)}</div></div>:<label className="text-[11px] col-span-2">{tab==="warehouses"?"تعریف":"شماره تماس"}<input value={form.location||form.contact||""} onChange={e=>setForm({...form,[tab==="warehouses"?"location":"contact"]:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label>}</div><label className="flex gap-2 mt-4 text-[12px]"><input type="checkbox" checked={form.active!==false} onChange={e=>setForm({...form,active:e.target.checked})}/>فعال و قابل انتخاب</label><div className="flex gap-2 mt-5"><button onClick={save} className="bg-[#176b50] text-white rounded-lg px-6 py-3 font-bold">ذخیره</button><button onClick={()=>setOpen(false)} className="border rounded-lg px-5 py-3 text-[#718079]">انصراف</button></div></div></div>}
  </div>
}
function UsersScreen() {
  const [users,setUsers]=useState<PrototypeUser[]>(()=>readPrototypeUsers()),[query,setQuery]=useState(""),[open,setOpen]=useState(false),[editing,setEditing]=useState<PrototypeUser|null>(null),[error,setError]=useState("");
  const blank={name:"",username:"",phone:"",role:"",active:true};
  const [form,setForm]=useState<any>(blank);
  const begin=(user?:PrototypeUser)=>{setEditing(user||null);setForm(user?{...user}:blank);setError("");setOpen(true)};
  const cancel=()=>{setOpen(false);setEditing(null);setForm(blank);setError("")};
  const save=()=>{const failure=validatePrototypeUser(form,users,editing?.id);if(failure)return setError(failure);const row:PrototypeUser={id:editing?.id||`U-${Date.now()}`,name:form.name.trim(),username:form.username.trim().toLowerCase(),phone:form.phone.trim(),role:form.role,active:form.active!==false,last:editing?.last||"هنوز وارد نشده"};const next=editing?users.map(user=>user.id===editing.id?row:user):[...users,row];setUsers(next);writePrototypeUsers(next);cancel()};
  const shown=users.filter(user=>[user.name,user.username,user.role,user.phone].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px] mb-1">کاربران</h2>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px] mb-4">مدیریت کاربران و سطوح دسترسی</p>
      <div className="flex justify-between items-center mb-4">
        <input value={query} onChange={e=>setQuery(e.target.value)} className="border border-[#d8e4df] rounded-lg px-3 py-1.5 text-[12px] font-['Vazirmatn:Regular',sans-serif] focus:outline-none w-64" placeholder="جستجو..." dir="rtl" />
        <GreenBtn onClick={() => begin()}>+ کاربر جدید</GreenBtn>
      </div>
      <Card>
        <div className="grid grid-cols-[.7fr_.8fr_1fr_1fr_1.2fr_1fr] gap-3 bg-[#eef3f0] p-3 text-[11px] text-[#718079]"><span>عملیات</span><span>وضعیت</span><span>آخرین ورود</span><span>نقش</span><span>نام</span><span>نام کاربری</span></div>
        {shown.map(user=><div key={user.id} className="grid grid-cols-[.7fr_.8fr_1fr_1fr_1.2fr_1fr] gap-3 p-3 border-t text-[12px] items-center"><button onClick={()=>begin(user)} className="text-[#176b50] font-bold text-right">ویرایش</button><Badge text={user.active?"فعال":"غیرفعال"} color={user.active?"#16825b":"#718079"} bg={user.active?"#dff3e9":"#e8efec"}/><span>{user.last}</span><span>{user.role}</span><b>{user.name}</b><span className="font-mono">{user.username}</span></div>)}
      </Card>
      {open&&<div className="fixed inset-0 z-[110] bg-[#09231dcc] flex items-center justify-center"><div className="bg-white rounded-2xl p-6 w-[680px]" dir="rtl"><div className="flex justify-between"><h3 className="font-bold text-[18px]">{editing?"ویرایش کاربر":"افزودن کاربر جدید"}</h3><button onClick={cancel} className="text-xl">×</button></div>{error&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mt-3 text-[12px]">{error}</p>}<div className="grid grid-cols-2 gap-3 mt-4"><label className="text-[11px]">نام و نام خانوادگی<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label><label className="text-[11px]">نام کاربری<input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1 font-mono"/></label><label className="text-[11px]">شماره تماس<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1"/></label><label className="text-[11px]">نقش<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full border rounded-lg h-11 px-3 mt-1 bg-white"><option value="">انتخاب نقش…</option><option>مدیر انبار</option><option>اپراتور دریافت</option><option>اپراتور تولید</option><option>مسئول QC</option><option>سرپرست ارسال</option></select></label></div><label className="flex gap-2 mt-4 text-[12px]"><input type="checkbox" checked={form.active!==false} onChange={e=>setForm({...form,active:e.target.checked})}/>کاربر فعال باشد</label><div className="flex gap-2 mt-5"><button onClick={save} className="bg-[#176b50] text-white rounded-lg px-6 py-3 font-bold">ذخیره کاربر</button><button onClick={cancel} className="border rounded-lg px-5 py-3 text-[#718079]">انصراف</button></div></div></div>}
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
  receiving: { title: "دریافت", subtitle: "Web / receiving" },
  containers: { title: "کانتینرها", subtitle: "Web / containers" },
  inventory: { title: "موجودی", subtitle: "Web / inventory" },
  production: { title: "تولید", subtitle: "Web / production" },
  "fresh-export": { title: "صادرات تازه", subtitle: "Web / fresh-export" },
  quality: { title: "کنترل کیفیت", subtitle: "Web / quality" },
  packaging: { title: "بسته‌بندی", subtitle: "Web / packaging" },
  consumables: { title: "اقلام مصرفی", subtitle: "Web / consumables" },
  shipments: { title: "ارسال‌ها", subtitle: "Web / shipments" },
  "inventory-movement": { title: "جابجایی استثنایی موجودی", subtitle: "Web / inventory-movement" },
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
      case "receiving": return <ReceivingScreen navigate={setScreen} />;
      case "containers": return <ContainersScreen />;
      case "inventory": return <InventoryScreen />;
      case "production": return <ProductionScreen />;
      case "fresh-export": return <FreshExportScreen />;
      case "quality": return <QualityScreen />;
      case "packaging": return <PackagingScreen />;
      case "consumables": return <ConsumablesScreen />;
      case "shipments": return <ShipmentsScreen />;
      case "inventory-movement": return <InventoryMovementScreen navigate={setScreen} />;
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

      <div className="grid grid-cols-[minmax(0,1fr)_220px] flex-1 min-h-0 overflow-hidden" dir="ltr">
        <main className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
          {section && section.screens.length > 1 && (
            <div className="bg-[#f4f7f5] border-b border-[#d8e4df] shrink-0">
              <SubNav screens={section.screens as WebScreen[]} active={screen} onSelect={setScreen} />
            </div>
          )}
          {renderScreen()}
        </main>
        <Sidebar screen={screen} onNavigate={setScreen} />
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
