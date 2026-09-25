import { useEffect, useState } from "react";
type PrototypeBasket={id:number;code:string;product:string;grade:string;size:string;gross:number;tare:number;zone?:string;status?:string;currentLocation?:string;currentState?:string;destination?:string|null;physicalLocation?:string;sortingOrigin?:string;operationalDestination?:string|null;qualityCheckRequired?:boolean;nextAction?:string;storedAt?:string;agingDays?:number;agingWarning?:boolean};
type PrototypeBatch={id:string;supplier:string;reference:string;createdAt:string;status:string;destination?:string|null;qualityCheckRequired?:boolean;baskets:PrototypeBasket[];events:{time:string;title:string;detail:string}[]};
const PROTOTYPE_KEY="storemesh.prototype.batch";
function prototypeColdStorageLocation(value:string|undefined|null):boolean{const location=String(value||"").trim().toUpperCase().replace(/[\s_.-]+/g,"");return location.includes("سردخانه")||location.includes("COLDROOM")||location.includes("COLDSTORAGE")}
function normalizePhysicalDestination(value:string|undefined|null){return value==="COLD_ROOM_DIRTY"?"COLD_ROOM_POSITIVE_DIRTY":value==="COLD_ROOM_CLEAN"?"COLD_ROOM_POSITIVE_CLEAN":value||null}
const PHYSICAL_DESTINATION_NAMES:Record<string,string>={COLD_ROOM_POSITIVE_DIRTY:"سردخانه مثبت کثیف",COLD_ROOM_POSITIVE_CLEAN:"سردخانه مثبت تمیز",COLD_ROOM_NEGATIVE:"سردخانه منفی"};
function normalizePrototypeBasket(b:PrototypeBasket):PrototypeBasket{const legacyWaiting="آماده"+" انتقال",location=normalizePhysicalDestination(b.currentLocation||b.zone)||"RECEIVING";const waiting=b.currentState==="AWAITING_GATE_SCAN"||b.status===legacyWaiting;const state=waiting?"AWAITING_GATE_SCAN":b.currentState||b.status||"RECEIVED";const destination=waiting?(normalizePhysicalDestination(b.destination)||"COLD_ROOM_POSITIVE_DIRTY"):b.destination===undefined?(location==="RECEIVING"?"COLD_ROOM_POSITIVE_DIRTY":null):normalizePhysicalDestination(b.destination);const nextAction=b.nextAction||(destination?`اسکن ورود به ${PHYSICAL_DESTINATION_NAMES[destination]||destination}`:"منتظر تخصیص برنامه تولید");return {...b,zone:location,status:state,currentLocation:location,currentState:state,destination,physicalLocation:b.physicalLocation||location,operationalDestination:b.operationalDestination??null,nextAction}}
function normalizePrototypeBatch(value:PrototypeBatch):PrototypeBatch{const legacyWaiting="آماده"+" انتقال",baskets=(value.baskets||[]).map(normalizePrototypeBasket),pending=baskets.filter(b=>b.currentState==="AWAITING_GATE_SCAN"),pendingDestination=pending[0]?.destination||baskets.find(b=>b.destination)?.destination;return {...value,status:pending.length?`در انتظار اسکن مقصد (${pending.length})`:value.status===legacyWaiting?"موجودی ثبت‌شده":value.status,destination:pendingDestination,baskets,events:value.events||[]}}
function readPrototypeBatch():PrototypeBatch{try{const x=localStorage.getItem(PROTOTYPE_KEY);if(x)return normalizePrototypeBatch(JSON.parse(x))}catch{} return normalizePrototypeBatch({id:"RCV-1405-0928",supplier:"گلخانه نمونه",reference:"BL-1405-091",createdAt:"امروز ۱۴:۳۰",status:"در انتظار اسکن سردخانه",destination:"COLD_ROOM_DIRTY",baskets:[{id:1,code:"TMP-7862368",product:"گوجه فرنگی",grade:"A",size:"درشت",gross:20,tare:1.28,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:"COLD_ROOM_DIRTY",nextAction:"اسکن ورود سردخانه"},{id:2,code:"BSK-0002",product:"گوجه فرنگی",grade:"A",size:"درشت",gross:20.38,tare:1.28,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:"COLD_ROOM_DIRTY",nextAction:"اسکن ورود سردخانه"},{id:3,code:"BSK-0003",product:"گوجه فرنگی",grade:"B",size:"متوسط",gross:19.12,tare:1.28,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:"COLD_ROOM_DIRTY",nextAction:"اسکن ورود سردخانه"}],events:[{time:"۱۴:۳۰",title:"ثبت محموله",detail:"ایستگاه دریافت وب"}]})}
function writePrototypeBatch(b:PrototypeBatch){localStorage.setItem(PROTOTYPE_KEY,JSON.stringify(normalizePrototypeBatch(b)));window.dispatchEvent(new Event("storemesh-data"))}
const PROTOTYPE_FIXTURE_VERSION="local-fixtures-150kg-v1";
const PROTOTYPE_FIXTURE_KEY="storemesh.prototype.fixture.version";
const PROTOTYPE_ALL_ZONES=["RECEIVING","COLD_STORAGE","SORTING","WASHING","SLICING","FREEZING","DRYING","PACKAGING","SHIPPING"];
function buildPrototypeTestBatch(containers:any[]):PrototypeBatch{
  const netWeights=[22.5,22.5,22.5,22.5,20,20,20];
  const agingDays=[12,9,8,5,3,2,1];
  const baskets=netWeights.map((net,index)=>{
    const code=`CTR-${String(index+1).padStart(3,"0")}`,container=containers.find((row:any)=>String(row.qr||row.code).toUpperCase()===code)||{qr:code,tare:1.28},tare=Number(container.tare??container.tareWeightKg??1.28);
    return {id:index+1,code:container.qr||container.code,product:"سیب قرمز",grade:index<4?"A":"B",size:index<4?"درشت":"متوسط",gross:Number((net+tare).toFixed(2)),tare,zone:"COLD_ROOM_POSITIVE_DIRTY",status:"STORED",currentLocation:"COLD_ROOM_POSITIVE_DIRTY",physicalLocation:"COLD_ROOM_POSITIVE_DIRTY",currentState:"STORED",destination:null,operationalDestination:null,qualityCheckRequired:false,nextAction:"منتظر انتخاب برای عملیات سورتینگ",agingDays:agingDays[index],agingWarning:agingDays[index]>=7};
  });
  return {id:"RCV-TEST-150KG",supplier:"تأمین‌کننده آزمایشی",reference:"TEST-150-7",createdAt:"داده آماده تست",status:"موجود در سردخانه مثبت کثیف",destination:null,baskets,events:[{time:"داده آماده تست",title:"ثبت محموله ورودی",detail:"یک محصول · ۱۵۰ کیلوگرم خالص · ۷ سبد · دو گرید"},{time:"داده آماده تست",title:"ثبت در سردخانه",detail:"همه سبدها در سردخانه مثبت کثیف ثبت شدند"}]};
}
function ensurePrototypeTestFixtures(){
  try{
    if(localStorage.getItem(PROTOTYPE_FIXTURE_KEY)===PROTOTYPE_FIXTURE_VERSION)return;
    const containers=Array.from({length:20},(_,index)=>({
      qr:`CTR-${String(index+1).padStart(3,"0")}`,
      type:"کانتینر عمومی",
      tare:1.28,
      capacity:25,
      zones:[...PROTOTYPE_ALL_ZONES],
      last:"آماده تست",
      status:"فعال",
      singleUse:false,
    }));
    const netWeights=[22.5,22.5,22.5,22.5,20,20,20],agingDays=[12,9,8,5,3,2,1];
    const baskets=netWeights.map((net,index)=>({
      id:index+1,
      code:containers[index].qr,
      product:"سیب قرمز",
      grade:index<4?"A":"B",
      size:index<4?"درشت":"متوسط",
      gross:Number((net+containers[index].tare).toFixed(2)),
      tare:containers[index].tare,
      zone:"COLD_ROOM_POSITIVE_DIRTY",
      status:"STORED",
      currentLocation:"COLD_ROOM_POSITIVE_DIRTY",
      physicalLocation:"COLD_ROOM_POSITIVE_DIRTY",
      currentState:"STORED",
      destination:null,
      operationalDestination:null,
      qualityCheckRequired:false,
      nextAction:"منتظر انتخاب برای عملیات سورتینگ",
      agingDays:agingDays[index],
      agingWarning:agingDays[index]>=7,
    }));
    const batch:PrototypeBatch={
      id:"RCV-TEST-150KG",
      supplier:"تأمین‌کننده آزمایشی",
      reference:"TEST-150-7",
      createdAt:"داده آماده تست",
      status:"موجود در سردخانه مثبت کثیف",
      destination:null,
      baskets,
      events:[
        {time:"داده آماده تست",title:"ثبت محموله ورودی",detail:"یک محصول · ۱۵۰ کیلوگرم خالص · ۷ سبد · دو گرید"},
        {time:"داده آماده تست",title:"ثبت در سردخانه",detail:"همه سبدها در سردخانه مثبت کثیف ثبت شدند"},
      ],
    };
    localStorage.setItem("storemesh.prototype.containers",JSON.stringify(containers));
    localStorage.setItem(PROTOTYPE_KEY,JSON.stringify(normalizePrototypeBatch(batch)));
    localStorage.setItem(PROTOTYPE_FIXTURE_KEY,PROTOTYPE_FIXTURE_VERSION);
    window.dispatchEvent(new Event("storemesh-data"));
  }catch{}
}
function resetPrototypeOperationalScenario(){
  const containers=JSON.parse(localStorage.getItem("storemesh.prototype.containers")||"[]");
  localStorage.removeItem("storemesh.prototype.production.v1");
  localStorage.setItem(PROTOTYPE_KEY,JSON.stringify(normalizePrototypeBatch(buildPrototypeTestBatch(containers))));
  localStorage.setItem(PROTOTYPE_FIXTURE_KEY,PROTOTYPE_FIXTURE_VERSION);
  window.dispatchEvent(new Event("storemesh-data"));
}
function applyReceiptWorkflowScan(batch:PrototypeBatch,rawCode:string,target:string):PrototypeBatch{const code=String(rawCode||"").trim().toUpperCase(),normalizedTarget=normalizePhysicalDestination(target)||target;if(!code)throw Error("ابتدا QR سبد را اسکن کنید.");const source=normalizePrototypeBatch(batch),basket=source.baskets.find(item=>item.code.toUpperCase()===code);if(!basket)throw Error("سبد اسکن‌شده در موجودی جاری پیدا نشد.");const sortingEntry=normalizedTarget==="SORTING";if(sortingEntry&&!prototypeColdStorageLocation(basket.currentLocation||basket.zone))throw Error("سبد باید پیش از ورود به سورتینگ در سردخانه ثبت شده باشد.");if(sortingEntry&&basket.qualityCheckRequired)throw Error("این سبد در انتظار تصمیم مدیر کنترل کیفیت است.");if(!sortingEntry&&normalizePhysicalDestination(basket.destination)!==normalizedTarget)throw Error(`مقصد مجاز این سبد ${basket.destination||"تعیین نشده"} است.`);const stored=prototypeColdStorageLocation(normalizedTarget),nextState=stored?"STORED":"IN_PROCESS",nextDestination=null,nextAction=stored?(basket.qualityCheckRequired?"در انتظار تصمیم مدیر کنترل کیفیت":"منتظر انتخاب برای عملیات سورتینگ"):"تکمیل عملیات جاری";const at=new Date().toLocaleTimeString("fa-IR"),storedAt=new Date().toISOString();return normalizePrototypeBatch({...source,baskets:source.baskets.map(item=>item.code.toUpperCase()===code?{...item,zone:normalizedTarget,status:nextState,currentLocation:normalizedTarget,physicalLocation:stored?normalizedTarget:item.physicalLocation,currentState:nextState,destination:nextDestination,nextAction,storedAt:stored?storedAt:item.storedAt,agingDays:stored?0:item.agingDays,agingWarning:stored?false:item.agingWarning}:item),events:[...source.events,{time:at,title:"اسکن گذرگاه عملیاتی",detail:`${code} · ${basket.currentLocation} ← ${normalizedTarget} · اقدام بعدی: ${nextAction}`}]})}

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
  { label: "دریافت", item: "receiving", screens: ["receiving"] },
  { label: "موجودی", item: "inventory", screens: ["inventory", "inventory-movement"] },
  { label: "تولید", item: "production", screens: ["production", "fresh-export"] },
  { label: "کیفیت", item: "quality", screens: ["quality"] },
  { label: "بسته‌بندی", item: "packaging", screens: ["packaging"] },
  { label: "ارسال", item: "shipments", screens: ["shipments"] },
  { label: "رهگیری", item: "trace", screens: ["trace", "tasks", "printing"] },
  { label: "تنظیمات", item: "config", screens: ["config", "master-data", "containers", "consumables", "users", "overrides", "audit", "cloud", "system"] },
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
    <div className="flex flex-nowrap gap-1 px-4 pt-3 pb-2 overflow-x-auto shrink-0" dir="rtl">
      {screens.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`px-4 py-1.5 rounded-full whitespace-nowrap shrink-0 text-[12px] font-['Vazirmatn:Regular',sans-serif] transition-colors ${
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
  const recentSeed=[
    {code:"D-IRAN-0017",batchCode:"BA-IRAN-0017",supplier:"تأمین‌کننده البرز",containers:6,weightKg:74.3,status:"COMPLETED"},
    {code:"D-IRAN-0016",batchCode:"BA-IRAN-0016",supplier:"تأمین‌کننده خراسان",containers:4,weightKg:41.8,status:"COMPLETED"},
    {code:"D-IRAN-0015",batchCode:"BA-IRAN-0015",supplier:"تأمین‌کننده گیلان",containers:9,weightKg:96.1,status:"COMPLETED"},
    {code:"D-IRAN-0014",batchCode:"—",supplier:"تأمین‌کننده البرز",containers:3,weightKg:28.4,status:"CANCELLED"},
  ];
  const [recentDeliveries,setRecentDeliveries]=useState<any[]>(()=>{try{return JSON.parse(localStorage.getItem("storemesh.prototype.recent-receipts")||"null")||recentSeed}catch{return recentSeed}});
  const net=Math.max(0,gross-tare);
  const total=baskets.reduce((sum,b)=>sum+b.gross-b.tare,0);
  const acceptContainerScan=(code:string)=>{if(!code)return;if(baskets.some(item=>item.code.toUpperCase()===code.toUpperCase()))return;setContainerCode(code.toUpperCase());setGross(24.68)};
  const addBasket=()=>{if(!containerCode||gross<=0)return;setBaskets([...baskets,{id:baskets.length+1,code:containerCode,product,grade,size,gross,tare}]);setContainerCode("");setGross(0);setTare(1.28)};
  const destinationNames=PHYSICAL_DESTINATION_NAMES;
  const makePendingBatch=(target:string):PrototypeBatch=>{const id="RCV-"+String(Date.now()).slice(-8),at=new Date().toLocaleTimeString("fa-IR");return normalizePrototypeBatch({id,supplier,reference,createdAt:at,status:`در انتظار اجرای مقصد ${destinationNames[target]}`,destination:target,qualityCheckRequired,baskets:baskets.map(b=>({...b,currentLocation:"RECEIVING",currentState:"AWAITING_GATE_SCAN",destination:target,qualityCheckRequired,nextAction:`اسکن ورود به ${destinationNames[target]}`})),events:[{time:at,title:"دریافت و توزین تکمیل شد",detail:`${supplier} · ${baskets.length} ظرف · محل فیزیکی ${destinationNames[target]}${qualityCheckRequired?" · نیازمند کنترل کیفیت":""}`}]})};
  const rememberDelivery=(completed:PrototypeBatch)=>{const next=[{code:`D-IRAN-${String(Date.now()).slice(-4)}`,batchCode:completed.id,supplier:completed.supplier,containers:completed.baskets.length,weightKg:completed.baskets.reduce((sum,item)=>sum+item.gross-item.tare,0),status:"COMPLETED"},...recentDeliveries].slice(0,8);setRecentDeliveries(next);localStorage.setItem("storemesh.prototype.recent-receipts",JSON.stringify(next))};
  const startDispatch=()=>{if(!destination)return;const pending=makePendingBatch(destination);setTransferError("");setTransferBatch(pending);if(moveMode==="batch"){let completed=pending;for(const basket of pending.baskets)completed=applyReceiptWorkflowScan(completed,basket.code,destination);completed={...completed,status:`تحویل‌شده به ${destinationNames[destination]}`,events:[...completed.events,{time:new Date().toLocaleTimeString("fa-IR"),title:"انتقال یکجای بچ",detail:`کل ${baskets.length} ظرف در مقصد ${destinationNames[destination]} ثبت شد`} ]};writePrototypeBatch(completed);rememberDelivery(completed);setTransferBatch(completed);setMovedCodes(completed.baskets.map(item=>item.code));setStage("done");return}writePrototypeBatch(pending);setDispatchStarted(true)};
  const scanDestination=(code:string)=>{if(!transferBatch)return;try{const updated=applyReceiptWorkflowScan(transferBatch,code,destination),nextMoved=[...movedCodes,code.toUpperCase()];writePrototypeBatch(updated);setTransferBatch(updated);setMovedCodes(nextMoved);setTransferError("");if(nextMoved.length===baskets.length){const completed={...updated,status:`تحویل‌شده به ${destinationNames[destination]}`,events:[...updated.events,{time:new Date().toLocaleTimeString("fa-IR"),title:"انتقال اسکن‌شده کامل شد",detail:`هر ${baskets.length} ظرف در مقصد ${destinationNames[destination]} تأیید شد`} ]};writePrototypeBatch(completed);rememberDelivery(completed);setTransferBatch(completed);setStage("done")}}catch(failure:any){setTransferError(failure.message)}};
  const resetReceiving=()=>{setStage("setup");setBaskets([]);setDestination("");setQualityCheckRequired(false);setMoveMode("batch");setTransferBatch(null);setDispatchStarted(false);setMovedCodes([]);setTransferError("")};
  const selectClass="w-full h-11 rounded-lg border border-[#d9e3de] bg-white px-3 text-[12px] text-[#18302a] outline-none focus:border-[#176b50]";

  if(stage==="done") return <div className="flex-1 bg-[#f4f7f5] p-8 overflow-auto" dir="rtl"><Card className="max-w-3xl mx-auto mt-16 p-10 text-center"><div className="w-16 h-16 rounded-full bg-[#176b50] text-white text-[34px] flex items-center justify-center mx-auto mb-4">✓</div><h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[24px]">دریافت و انتقال کامل شد</h2><p className="text-[#718079] text-[13px] mt-2">محموله بدون خروج از صفحه دریافت، به مقصد «{destinationNames[destination]}» تحویل شد و موقعیت، وضعیت و رهگیری همه ظروف به‌روزرسانی شد.</p><div className="grid grid-cols-3 gap-3 my-7"><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">تعداد ظروف</small><b>{baskets.length}</b></div><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">روش انتقال</small><b>{moveMode==="batch"?"کل بچ یکجا":"اسکن تک‌تک"}</b></div><div className="bg-[#f1f6f3] rounded-xl p-4"><small className="block text-[#718079]">موقعیت فعلی</small><b className="text-[#176b50]">{destinationNames[destination]}</b></div></div><div className="flex justify-center gap-2"><button onClick={resetReceiving} className="bg-[#176b50] text-white rounded-lg px-6 h-11 text-[12px] font-bold">دریافت محموله جدید</button><button onClick={()=>navigate("inventory")} className="border border-[#d8e4df] rounded-lg px-5 h-11 text-[12px]">مشاهده رهگیری (اختیاری)</button></div></Card></div>;

  return <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
    <div className="flex items-start justify-between mb-4"><div><p className="text-[#176b50] text-[11px] font-bold">دریافت · {stage==="setup"?"محموله جدید":reference||"محموله جاری"}</p><h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">{stage==="setup"?"تعریف محموله ورودی":stage==="review"?"بازبینی محموله":stage==="dispatch"?"محل فیزیکی و تحویل":"ثبت و توزین ظروف"}</h2><p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">{stage==="setup"?"اطلاعات بار را ثبت کنید؛ سپس ظروف را یکی‌یکی اسکن و توزین کنید.":supplier+" · پیشرفت "+baskets.length+" از "+expected+" ظرف"}</p></div><Badge text={stage==="setup"?"مرحله ۱ از ۴":stage==="capture"?"مرحله ۲ از ۴":stage==="review"?"مرحله ۳ از ۴":"مرحله ۴ از ۴"} color="#176b50" bg="#e1f2eb" /></div>

    {stage==="setup"&&<><Card className="p-5"><h4 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[14px] mb-4">مشخصات محموله</h4><div className="grid grid-cols-2 gap-3"><label className="text-[11px] font-bold text-[#435a52]">تأمین‌کننده<select className={selectClass} value={supplier} onChange={e=>setSupplier(e.target.value)}><option value="">انتخاب تأمین‌کننده…</option>{master.suppliers.filter(item=>item.active).map(item=><option key={item.id}>{item.name}</option>)}</select></label><label className="text-[11px] font-bold text-[#435a52]">شماره بارنامه / مرجع<input className={selectClass} value={reference} onChange={e=>setReference(e.target.value)} placeholder="مثلاً BL-1405-091" /></label><label className="text-[11px] font-bold text-[#435a52]">تعداد ظرف مورد انتظار<input type="number" className={selectClass} value={expected} onChange={e=>setExpected(Number(e.target.value))}/></label></div><div className="flex justify-end mt-4"><button disabled={!supplier||!activeProducts.length} onClick={()=>setStage("capture")} className="bg-[#176b50] disabled:opacity-40 text-white rounded-lg px-6 h-11 text-[12px] font-bold">شروع ثبت ظروف ←</button></div>{!activeProducts.length&&<p role="alert" className="mt-3 text-[#a43838] text-[11px]">هیچ محصول فعالی برای عملیات جدید وجود ندارد.</p>}</Card><Card className="mt-4 overflow-hidden"><div className="flex items-center gap-2 px-5 py-4"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e1f2eb] text-[#176b50]">↟</span><h3 className="font-bold text-[#18302a] text-[16px]">تحویل‌های اخیر</h3></div><div className="grid grid-cols-[1fr_1fr_1.2fr_.6fr_.7fr_.8fr] gap-3 bg-[#fbfdfc] px-5 py-3 text-[10px] font-bold text-[#718079]"><span>کد</span><span>بچ تجمیعی</span><span>تأمین‌کننده</span><span>سبدها</span><span>وزن</span><span>وضعیت</span></div>{recentDeliveries.map((row:any)=><div key={row.code} className="grid grid-cols-[1fr_1fr_1.2fr_.6fr_.7fr_.8fr] gap-3 border-t border-[#e8efeb] px-5 py-4 text-[12px] items-center"><b className="font-mono">{row.code}</b><b className="font-mono text-[#365c4f]">{row.batchCode}</b><span>{row.supplier}</span><b>{row.containers}</b><b>{Number(row.weightKg).toFixed(1)} kg</b><span className={`justify-self-start rounded-full px-3 py-1 text-[10px] font-bold ${row.status==="COMPLETED"?"bg-[#dff3e9] text-[#16825b]":"bg-[#fbe6e6] text-[#b84242]"}`}>{row.status}</span></div>)}</Card></>}

    {stage==="capture"&&<>
      <section data-purpose="receiving-scale-monitor" className="relative mx-auto w-full max-w-[1240px] overflow-hidden rounded-2xl border border-[#176b5066] bg-[#07231a] p-4 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#42d99a14] blur-2xl" />
        <div className="relative grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12" dir="rtl">
          <div className="col-span-1 min-w-0 flex flex-col justify-between gap-3 border-[#1d594744] lg:col-span-3 lg:border-l lg:pl-4">
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
          <div className="col-span-1 min-w-0 flex flex-col justify-between rounded-xl border border-[#2a765c66] bg-[#041711] px-4 py-3 shadow-inner lg:col-span-4">
            <div className="flex items-center justify-between text-[11px] text-[#bdebd8]"><b><i className="ml-2 inline-block h-2 w-2 rounded-full bg-[#55d69a]"/>وزن خالص (Net Weight)</b><span className="font-mono text-[9px]">SENS: HIGH</span></div>
            <div className="my-2 flex min-w-0 items-baseline justify-center gap-2" dir="ltr"><strong className="min-w-0 font-mono text-[32px] tracking-[.08em] text-white xl:text-[40px]">{net.toFixed(2)}</strong><span className="shrink-0 rounded-md border border-[#2a765c66] bg-[#0e3d2e] px-2 py-1 font-mono text-[11px] text-[#67e5a9]">kg</span></div>
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-[#78ad98]"><span className="font-mono">STATUS: READY</span><span className="h-1.5 w-24 rounded-full bg-gradient-to-l from-[#55d69a] via-[#2b755c] to-[#123d31]"/></div>
          </div>
          <div className="col-span-1 min-w-0 grid grid-rows-2 gap-3 lg:col-span-3">
            <div className="rounded-xl border border-[#2a765c66] bg-[#0e3d2e99] p-3"><div className="mb-2 flex items-center justify-between text-[10px] text-[#bdebd8]"><b>وزن ناخالص (Gross)</b><span className="font-mono text-[#67e5a9]">GROSS</span></div><div className="flex items-baseline justify-center gap-2 rounded-lg border border-[#2a765c66] bg-[#041711] px-3 py-2" dir="ltr"><strong className="font-mono text-[27px] tracking-[.12em] text-[#7df0b8]">{gross.toFixed(3)}</strong><span className="text-[10px] text-[#67e5a9]">kg</span></div></div>
            <label className="rounded-xl border border-[#2a765c66] bg-[#0e3d2e99] p-3 text-[10px] text-[#bdebd8]"><span className="mb-2 flex justify-between"><b>وزن ظرف (Tare)</b><i className="font-mono not-italic text-[#67e5a9]">TARE</i></span><span className="relative block"><input type="number" step="0.01" value={tare} onChange={e=>setTare(Number(e.target.value))} className="w-full rounded-lg border border-[#2a765c66] bg-[#041711] px-3 py-2 text-center font-mono text-[13px] font-bold text-white outline-none focus:border-[#55d69a]"/><i className="absolute left-3 top-2 font-mono not-italic text-[#67e5a9]">kg</i></span></label>
          </div>
          <div className="col-span-1 min-w-0 flex flex-col justify-between gap-3 border-[#1d594744] lg:col-span-2 lg:border-r lg:pr-4">
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

    {stage==="dispatch"&&<Card className="mt-4 p-5"><div className="flex items-start justify-between"><h3 className="font-bold text-[#18302a] text-[16px]">۴. محل فیزیکی و تحویل محموله</h3><Badge text={`${movedCodes.length} از ${baskets.length} ظرف تحویل‌شده`} color="#176b50" bg="#e1f2eb"/></div>{transferError&&<p role="alert" className="bg-[#fbe7e7] text-[#a43838] p-3 rounded-lg mt-4 text-[11px]">{transferError}</p>}{!dispatchStarted?<><label className="block text-[11px] font-bold mt-5">محل فیزیکی نگهداری<select value={destination} onChange={e=>setDestination(e.target.value)} className={selectClass}><option value="">انتخاب سردخانه…</option>{Object.entries(destinationNames).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label className="mt-3 flex items-center gap-2 rounded-xl border border-[#d8e4df] bg-[#f8fbfa] p-3 text-[11px]"><input type="checkbox" checked={qualityCheckRequired} onChange={e=>setQualityCheckRequired(e.target.checked)}/><b>نیازمند کنترل کیفیت</b></label><div className="grid grid-cols-2 gap-3 mt-4"><button onClick={()=>setMoveMode("batch")} className={(moveMode==="batch"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df]")+" border-2 rounded-xl p-4 text-right"}><b className="text-[12px]">انتقال کل بچ یکجا</b></button><button onClick={()=>setMoveMode("scan")} className={(moveMode==="scan"?"border-[#176b50] bg-[#eaf6f0]":"border-[#d8e4df]")+" border-2 rounded-xl p-4 text-right"}><b className="text-[12px]">اسکن تک‌تک در همین صفحه</b></button></div><div className="flex justify-end gap-2 mt-5"><button onClick={()=>setStage("review")} className="border rounded-lg px-4 h-11 text-[11px]">بازگشت</button><button disabled={!destination} onClick={startDispatch} className="bg-[#176b50] disabled:opacity-40 text-white rounded-lg px-6 h-11 text-[12px] font-bold">{moveMode==="batch"?"انتقال و تکمیل کل بچ":"شروع اسکن در سردخانه"}</button></div></>:<div className="mt-5 grid grid-cols-[1fr_280px] gap-4"><div><button onClick={()=>setTransferScanOpen(true)} className="w-full h-20 border-2 border-dashed border-[#176b50] rounded-xl text-[#176b50] font-bold">⌗ اسکن سبد بعدی در {destinationNames[destination]}<small className="block mt-1 font-mono">{baskets.find(item=>!movedCodes.includes(item.code))?.code}</small></button><div className="mt-3 max-h-48 overflow-auto">{movedCodes.slice().reverse().map(code=><div key={code} className="flex justify-between border-b py-2 text-[11px]"><span className="text-[#176b50]">تحویل سردخانه ✓</span><b className="font-mono">{code}</b></div>)}</div></div><div className="bg-[#edf8f3] rounded-xl p-4"><b className="text-[12px]">محل فیزیکی: {destinationNames[destination]}</b><p className="text-[10px] text-[#718079] mt-2">{qualityCheckRequired?"درخواست کنترل کیفیت هم ثبت می‌شود؛ محصول تا تصمیم مدیر در همین محل می‌ماند.":"هر اسکن موقعیت، وضعیت و سابقه ظرف را ثبت می‌کند."}</p><div className="mt-4 text-center text-[26px] font-bold text-[#176b50]">{movedCodes.length}/{baskets.length}</div></div></div>}</Card>}

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
  slicingSessions: any[]
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
function pwNextOperatorAction(destination:string|null|undefined,stage:string,nextZone:string|null|undefined){if(nextZone==="FREEZING")return destination==="FREEZE_DRYING"&&stage==="SLICED"?"در انتظار ورود به دستگاه فریزدرای":"در حال فریزینگ و منتظر ثبت خروج و بسته‌بندی";if(nextZone==="DRYING")return "در حال خشک‌شدن و منتظر ثبت خروج و بسته‌بندی";if(nextZone==="SLICING")return "در انتظار اسلایس";if(nextZone==="WASHING")return "در انتظار شست‌وشو";if(nextZone==="PACKAGING")return "در انتظار بسته‌بندی";if(nextZone==="QC")return "در انتظار کنترل کیفیت";return nextZone?`در انتظار ${PW_ZONES[nextZone]||nextZone}`:"فعلاً اقدام دیگری لازم نیست"}
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
type SortingEntryWeightState = "PENDING" | "CAPTURED" | "PREVIOUS"
function pwSelectSortingEntryWeightState(
  states: Record<string, SortingEntryWeightState>,
  currentCode: string,
  nextCode: string,
  entryWeights: Record<string, number>,
) {
  const next = { ...states },
    current = pwCode(currentCode),
    selected = pwCode(nextCode)
  if (
    current &&
    current !== selected &&
    next[current] === "PENDING" &&
    entryWeights[current] === undefined
  )
    next[current] = "PREVIOUS"
  if (selected && entryWeights[selected] === undefined)
    next[selected] = "PENDING"
  return next
}
function pwCaptureSortingEntryWeightState(
  states: Record<string, SortingEntryWeightState>,
  code: string,
) {
  const key = pwCode(code)
  return key
    ? { ...states, [key]: "CAPTURED" as SortingEntryWeightState }
    : states
}
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
const PW_DRY_POUCHES=[
  {code:"CNS-MET-100",name:"پاکت متالایز ۱۰۰ گرمی",fillWeightGrams:100,tareWeightGrams:5,stock:860},
  {code:"CNS-MET-250",name:"پاکت متالایز ۲۵۰ گرمی",fillWeightGrams:250,tareWeightGrams:8,stock:420},
  {code:"CNS-MET-500",name:"پاکت متالایز ۵۰۰ گرمی",fillWeightGrams:500,tareWeightGrams:12,stock:260},
]
const PW_DRY_ABSORBERS=[
  {code:"NONE",name:"بدون رطوبت‌گیر",weightGrams:0,stock:0},
  {code:"CNS-DES-005",name:"رطوبت‌گیر ۵ گرمی",weightGrams:5,stock:1200},
  {code:"CNS-DES-010",name:"رطوبت‌گیر ۱۰ گرمی",weightGrams:10,stock:780},
]
const pwEmpty = (): PWLedger => ({
  version: 1,
  seq: 0,
  idSeq: 0,
  items: [],
  cycles: [],
  washSessions: [],
  slicingSessions: [],
  sortingSessions: [],
  events: [],
  consumedInputs: [],
  machines: { ...PW_DEFAULT_MACHINES },
})
function pwNormalizeItem(item:PWItem):PWItem{const routedDirectlyToDryer=item.stage==="SLICED"&&(item.destination==="DRYING"||item.operationalDestination==="DRYING")&&(item.nextZone==="DRYING"||item.nextProcess==="DRYING"),currentLocation=routedDirectlyToDryer?"DRYING":item.currentLocation||item.zone||"SORTING",currentState=item.currentState||item.stage||"READY",destination=item.nextZone||item.destination||null,workflowAction=pwNextOperatorAction(item.destination??item.operationalDestination,item.stage,item.nextZone),repairWorkflowAction=item.nextZone==="FREEZING"||item.nextZone==="DRYING",nextAction=repairWorkflowAction?workflowAction:item.nextAction||(destination&&destination!==currentLocation?`اسکن ورود به ${PW_ZONES[destination]||destination}`:"انجام عملیات جاری");return {...item,zone:currentLocation,currentLocation,currentState,physicalLocation:routedDirectlyToDryer?"DRYING":item.physicalLocation||(pwColdStorageLocation(currentLocation)?currentLocation:"COLD_ROOM_POSITIVE_DIRTY"),operationalDestination:item.operationalDestination??item.destination??null,destination:item.destination??null,nextAction}}
function pwWashDestination(item:PWItem|undefined|null){
  const finalDestination=pwCode(item?.destination),legacyDestination=pwCode(item?.operationalDestination)
  return PW_OPERATIONAL_DESTINATIONS.includes(finalDestination)?finalDestination:legacyDestination
}
function pwNormalizeWashSessions(sessions:any[],items:PWItem[]){
  return sessions.map((session:any)=>{
    if(session.status==="COMPLETED")return session
    const destinations=[...new Set((session.inputIds||[]).map((id:string)=>pwWashDestination(items.find((item)=>item.id===id))).filter(Boolean))]
    const normalized=destinations.length===1&&pwCode(session.destination)!==destinations[0]?{...session,destination:destinations[0]}:{...session}
    if(normalized.status==="LOCKED"){
      const remembered=new Map((normalized.inputCarriers||[]).map((row:any)=>[row.itemId,pwCode(row.containerCode)]))
      normalized.inputCarriers=(normalized.inputIds||[]).map((id:string)=>{
        const item=items.find((row)=>row.id===id),containerCode=remembered.get(id)||pwCode(item?.containerCode)
        if(item)item.containerCode=""
        return {itemId:id,containerCode}
      }).filter((row:any)=>row.containerCode)
    }
    return normalized
  })
}
function pwAssertWashCompatibility(session:any,item:PWItem){const destination=pwWashDestination(item);if(session&&(session.product!==item.product||session.grade!==item.grade||pwCode(session.destination)!==destination))throw Error(`نشست فعال شست‌وشو برای ${session.product} / گرید ${session.grade} / مقصد ${PW_ZONES[session.destination]||session.destination} قفل است. ابتدا تمام محصول را در سبدهای خروجی ثبت و واحد را خالی و تکمیل کنید.`);return true}
function pwLockWashingSession(ledger:PWLedger,session:any){
  if(!session||!session.inputIds?.length)throw Error("حداقل یک سبد برای قفل نشست لازم است.")
  const remembered=new Map((session.inputCarriers||[]).map((row:any)=>[row.itemId,pwCode(row.containerCode)]))
  session.status="LOCKED";session.lockedAt=new Date().toISOString()
  session.inputCarriers=session.inputIds.map((id:string)=>{
    const item=ledger.items.find((row)=>row.id===id),containerCode=remembered.get(id)||pwCode(item?.containerCode)
    if(item){item.currentState="WASH_SESSION_LOCKED";item.nextAction=`انجام شست‌وشوی نشست ${session.id}`;item.containerCode=""}
    return {itemId:id,containerCode}
  }).filter((row:any)=>row.containerCode)
  pwEvent(ledger,"قفل نشست شست‌وشو",session.id,{product:session.product,grade:session.grade,destination:session.destination,inputIds:session.inputIds,releasedContainerCodes:session.inputCarriers.map((row:any)=>row.containerCode)})
  return session
}
function pwLockSlicingSession(ledger:PWLedger,inputIds:string[]){
  if(!inputIds.length||new Set(inputIds).size!==inputIds.length)throw Error("حداقل یک سبد ورودی غیرتکراری برای قفل نشست اسلایس لازم است.")
  if((ledger.slicingSessions||[]).some((row:any)=>row.status==="LOCKED"))throw Error("یک نشست اسلایس قفل‌شده در حال انجام است؛ ابتدا همان نشست را تکمیل کنید.")
  const parents=inputIds.map((id)=>ledger.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[]
  if(parents.length!==inputIds.length)throw Error("یکی از سبدهای انتخابی دیگر موجود نیست.")
  parents.forEach((item)=>{pwUsable(ledger,item);if(item.stage!=="WASHED"||item.nextZone!=="SLICING"||!item.containerCode)throw Error("یکی از سبدهای ورودی برای اسلایس معتبر نیست.")})
  const first=parents[0],destination=pwWashDestination(first)
  if(parents.some((item)=>item.product!==first.product||item.grade!==first.grade||pwWashDestination(item)!==destination))throw Error("محصول، گرید و مقصد نهایی سبدهای ورودی باید یکسان باشد.")
  const session={id:pwId(ledger,"SLC"),status:"LOCKED",lockedAt:new Date().toISOString(),inputIds:[...inputIds],inputCarriers:parents.map((item)=>({itemId:item.id,containerCode:item.containerCode})),product:first.product,grade:first.grade,destination,outputIds:[]}
  parents.forEach((item)=>{item.zone="SLICING";item.currentLocation="SLICING";item.currentState="IN_SLICING";item.nextAction="در مرحله اسلایس و منتظر ثبت خروج"})
  ledger.slicingSessions.push(session)
  pwEvent(ledger,"قفل نشست اسلایس",session.id,{inputIds:session.inputIds,inputCarriers:session.inputCarriers,product:session.product,grade:session.grade,destination:session.destination})
  return session
}
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
    const items=value.items.map(pwNormalizeItem)
    return {
      ...pwEmpty(),
      ...value,
      machines: { ...PW_DEFAULT_MACHINES, ...(value.machines || {}) },
      items,
      washSessions:pwNormalizeWashSessions(value.washSessions||[],items),
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
  )||!!(ledger.slicingSessions||[]).find((session:any)=>session.status==="LOCKED"&&session.inputIds.includes(item.id))
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
  const activeSortingSession=(ledger.sortingSessions||[]).find((session:any)=>session.receiptId===batch.id&&session.status==="IN_PROGRESS"),sortedBatchCodes=new Map<string,string>();
  const children = outputs.map((output) => {
    const contributed = output.parentContributions.map((row: any) =>
        pwCode(row.batchId),
      ),
      route=pwRouteFor(output.destination),
      sourcePhysical=String(sources[0]?.physicalLocation||sources[0]?.sortingOrigin||"COLD_ROOM_POSITIVE_DIRTY"),
      isWaste=output.destination==="WASTE"
    const batchKey=[sources[0].product,output.grade,output.size,output.destination].join("|"),batchCode=sortedBatchCodes.get(batchKey)||`BA-${activeSortingSession?.id||batch.id}-${String(sortedBatchCodes.size+1).padStart(2,"0")}`;
    sortedBatchCodes.set(batchKey,batchCode)
    const code = pwId(ledger, "B"),
      item: PWItem = {
        id: code,
        code,
        batchCode,
        parentBatchIds:[batch.id],
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
        nextAction:isWaste?"در انتظار ثبت پایان دفع":pwNextOperatorAction(output.destination,"SORTED",route.processes[0]),
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
      ? { ...session, status: "COMPLETED", outputIds:children.map(item=>item.id), completedAt: new Date().toISOString() }
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
function WashingScaleConsole({mode,code,net,previousNet,tare,onRead,netOnly=false,onSimulate,testWeights=[0.1,0.25,0.5]}:{mode:"ENTRY"|"EXIT";code?:string;net:number;previousNet:number;tare:number;onRead?:()=>void;netOnly?:boolean;onSimulate?:(weight:number)=>void;testWeights?:number[]}) {
  const n=(value:number)=>Number.isFinite(value)?value.toFixed(3):"0.000"
  const gross=pwNumber(net+tare)
  const controlStyle={border:"1px solid #1b5a46",background:"#041d16",color:"white",borderRadius:8,padding:"6px 12px",fontSize:10,cursor:"pointer"} as const
  return <section aria-label={`کنسول باسکول ${mode==="ENTRY"?"ورود":"خروج"} شست‌وشو`} style={{width:"100%",maxWidth:760,margin:"10px auto",background:"#06291f",border:"1px solid #1b5a46",borderRadius:14,padding:10,color:"white",boxShadow:"0 8px 20px #173f351b"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:"6px 14px",padding:"5px 8px",borderRadius:8,background:"#041d16",fontSize:9}}><b style={{color:"#c9f7e4"}}>● باسکول رومیزی ۱</b><span style={{fontFamily:"monospace",color:"#62e5ad"}}>10 Hz</span><span>لودسل آنلاین <b style={{color:"#62e5ad"}}>RS485</b></span><span style={{color:"#91b9aa"}}>قرائت پایدار <b style={{color:"#c9f7e4"}}>± 0.002 kg</b></span><span style={{color:"#62e5ad"}}>✓ ثبات سیگنال حسگر تأیید شد</span>{code&&<b style={{fontFamily:"monospace",color:"#62e5ad"}}>{code}</b>}</div>
    <div style={{display:"grid",gridTemplateColumns:netOnly?"1fr":"1fr 1fr",gap:8,margin:"8px 0"}} dir="rtl">
      <div style={{border:"1px solid #1b5a46",borderRadius:10,padding:"9px 12px",background:"#041d16",textAlign:"center"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#c9f7e4"}}><b>{mode==="ENTRY"?"وزن خالص جدید":"وزن خالص خروجی"}</b><span style={{fontFamily:"monospace",color:"#62e5ad"}}>SENS: HIGH</span></div><div style={{display:"flex",justifyContent:"center",alignItems:"baseline",gap:7,margin:"7px 0"}} dir="ltr"><strong style={{fontFamily:"monospace",fontSize:29,letterSpacing:2}}>{n(net)}</strong><span style={{fontSize:10,color:"#62e5ad"}}>kg</span></div><small style={{color:"#91b9aa"}}>{netOnly?"وزن خالص محصول؛ بدون محاسبه وزن ناخالص":`وزن ظرف ${n(tare)} kg`}</small></div>
      {!netOnly&&<div style={{border:"1px solid #1b5a46",borderRadius:10,padding:"9px 12px",background:"#041d16",textAlign:"center"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#c9f7e4"}}><b>{mode==="ENTRY"?"وزن خالص قبلی":"وزن ناخالص"}</b><span style={{fontFamily:"monospace",color:"#62e5ad"}}>{mode==="ENTRY"?"DELTA":"GROSS"}</span></div><div style={{display:"flex",justifyContent:"center",alignItems:"baseline",gap:7,margin:"7px 0"}} dir="ltr"><strong style={{fontFamily:"monospace",fontSize:27,letterSpacing:2}}>{n(mode==="ENTRY"?previousNet:gross)}</strong><span style={{fontSize:10,color:"#62e5ad"}}>kg</span></div><small style={{color:"#91b9aa"}}>{mode==="ENTRY"?`اختلاف ${n(net-previousNet)} kg`:"READY"}</small></div>}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:7,padding:"6px 8px",borderRadius:8,background:"#0a3326",fontSize:9}}>{mode==="ENTRY"&&onRead?<button type="button" onClick={onRead} style={controlStyle}>↻ ثبت وزن جدید</button>:<b style={{color:"#62e5ad"}}>● وزن آنلاین پس از اسکن سبد</b>}<button type="button" style={controlStyle}>صفر (Zero)</button><button type="button" style={controlStyle}>تار (Tare)</button><span style={{color:"#91b9aa"}}>پورت اتصال: <b style={{fontFamily:"monospace",color:"#62e5ad"}}>COM 4</b></span></div>
    {onSimulate&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:6,marginTop:7,fontSize:9}}><span style={{color:"#91b9aa"}}>وزن آزمایشی:</span>{testWeights.map((weight)=><button key={weight} type="button" onClick={()=>onSimulate(weight)} style={{...controlStyle,color:"#62e5ad"}}>{n(weight)} kg</button>)}</div>}
  </section>
}
function SlicingRemainderScaleConsole({code,net,tare}:{code?:string;net:number;tare:number}) {
  const n=(value:number)=>Number.isFinite(value)?value.toFixed(3):"0.000"
  const gross=pwNumber(net+tare)
  return <section aria-label="باسکول آنلاین مانده اسلایس" style={{width:"100%",maxWidth:560,margin:"12px auto 0",background:"#06291f",border:"1px solid #1b5a46",borderRadius:13,padding:11,color:"white",boxShadow:"0 8px 20px #173f3520"}}>
    <div style={{display:"grid",gridTemplateColumns:"1.15fr .85fr .85fr",gap:8,alignItems:"stretch"}} dir="rtl">
      <div style={{border:"1px solid #1b5a46",borderRadius:9,padding:10,background:"#041d16"}}><div style={{display:"flex",justifyContent:"space-between",gap:8,fontSize:10}}><b style={{color:"#c9f7e4"}}>● لودسل آنلاین</b><span style={{color:"#62e5ad",fontFamily:"monospace"}}>RS485 · 10 Hz</span></div><div style={{marginTop:9,display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}><span style={{fontSize:10,color:"#91b9aa"}}>وزن خالص مانده</span><span dir="ltr"><strong style={{fontFamily:"monospace",fontSize:25,letterSpacing:2}}>{n(net)}</strong> <small style={{color:"#62e5ad"}}>kg</small></span></div><div style={{marginTop:7,fontSize:9,color:"#62e5ad"}}>✓ قرائت پایدار و ثبت خودکار پس از اسکن</div></div>
      <div style={{border:"1px solid #1b5a46",borderRadius:9,padding:10,background:"#041d16",display:"flex",flexDirection:"column",justifyContent:"space-between"}}><small style={{color:"#91b9aa"}}>وزن ظرف (Tare)</small><b dir="ltr" style={{fontFamily:"monospace",fontSize:18}}>{n(tare)} kg</b><small style={{color:"#91b9aa"}}>وزن ناخالص: <b dir="ltr" style={{color:"#c9f7e4"}}>{n(gross)} kg</b></small></div>
      <div style={{border:"1px solid #1b5a46",borderRadius:9,padding:10,background:"#0a3326",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:6}}><small style={{color:"#91b9aa"}}>سبد روی باسکول</small><b style={{fontFamily:"monospace",fontSize:16,color:code?"#62e5ad":"#91b9aa"}}>{code||"در انتظار اسکن"}</b><small style={{color:"#91b9aa"}}>COM 4 · پایدار ±0.002 kg</small></div>
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
    [entryWeights, setEntryWeights] = useState<Record<string, number>>(() => ({
      ...(ledger.washSessions.find((session) => ["DRAFT","ACTIVE"].includes(session.status))
        ?.entryWeights || {}),
    })),
    [entryWeightStates, setEntryWeightStates] = useState<
      Record<string, SortingEntryWeightState>
    >(() =>
      Object.fromEntries(
        Object.keys(
          ledger.washSessions.find((session) => ["DRAFT","ACTIVE"].includes(session.status))
            ?.entryWeights || {},
        ).map((code) => [pwCode(code), "CAPTURED"]),
      ),
    ),
    [weighingCode, setWeighingCode] = useState(""),
    [outputCode, setOutputCode] = useState(""),
    [outputWeight, setOutputWeight] = useState(""),
    [qualityCheckRequired,setQualityCheckRequired]=useState(false),
    [lossReason, setLossReason] = useState(""),
    [empty, setEmpty] = useState(false),
    [inputScanOpen, setInputScanOpen] = useState(false),
    [outputScanOpen, setOutputScanOpen] = useState(false),
    [selectedSessionId,setSelectedSessionId]=useState(()=>ledger.washSessions.find((session)=>session.status==="LOCKED")?.id||""),
    [labelCounts,setLabelCounts]=useState<Record<string,number>>({}),
    [lastPrinted,setLastPrinted]=useState<any>(null),
    [error, setError] = useState("")
  const draftSession=ledger.washSessions.find((session)=>["DRAFT","ACTIVE"].includes(session.status)),
    lockedSessions=ledger.washSessions.filter((session)=>session.status==="LOCKED"),
    active = mode==="ENTRY"?draftSession:(lockedSessions.find((session)=>session.id===selectedSessionId)||lockedSessions[0]),
    sources = (active?.inputIds || [])
      .map((id: string) => ledger.items.find((item) => item.id === id))
      .filter(Boolean) as PWItem[]
  const reservedInputIds=new Set(ledger.washSessions.filter((session)=>session.status!=="COMPLETED").flatMap((session)=>session.inputIds||[]))
  const eligible = ledger.items.filter(
    (item) =>
      !item.consumed &&
      !item.blocked &&
      item.stage === "SORTED" &&
      (item.zone === "WASHING" || item.nextZone === "WASHING") &&
      !reservedInputIds.has(item.id),
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
      let session = next.washSessions.find((row) => ["DRAFT","ACTIVE"].includes(row.status))
      if (session) {
        const firstInput = next.items.find((row) => row.id === session.inputIds[0])
        session.product = session.product || firstInput?.product
        session.grade = session.grade || firstInput?.grade
        session.destination = session.destination || pwWashDestination(firstInput)
        session.sizes = session.sizes || [session.size || firstInput?.size].filter(Boolean)
      }
      pwAssertWashCompatibility(session,item)
      if (session?.inputIds.includes(item.id))
        throw Error("این سبد قبلاً در نشست فعال ثبت شده است.")
      if (!session) {
        session = {
          id: pwId(next, "WS"),
          status: "DRAFT",
          product: item.product,
          grade: item.grade,
          destination: pwWashDestination(item),
          size: item.size,
          sizes: [item.size],
          inputIds: [],
          entryWeights: {},
          outputs: [],
          startedAt: new Date().toISOString(),
        }
        next.washSessions.push(session)
      }
      session.sizes = [...new Set([...(session.sizes || []), item.size].filter(Boolean))]
      session.size = session.sizes.length === 1 ? session.sizes[0] : "مختلط"
      pwTransitionWeight(
        next,
        item,
        "WASHING_ENTRY",
        entryWeights[pwCode(item.containerCode)],
      )
      session.entryWeights = session.entryWeights || {}
      if (entryWeights[pwCode(item.containerCode)] !== undefined)
        session.entryWeights[pwCode(item.containerCode)] =
          entryWeights[pwCode(item.containerCode)]
      const entryLocation = item.zone
      item.zone = "WASHING"
      item.currentLocation = "WASHING"
      item.currentState = "IN_PROCESS"
      item.nextAction = "در مرحله شست‌وشو و منتظر ثبت خروج"
      session.inputIds.push(item.id)
      pwEvent(next, "اسکن ورودی شست‌وشو", session.id, {
        itemId: item.id,
        containerCode: item.containerCode,
        grade: item.grade,
        size: item.size,
        destination: session.destination,
        from: entryLocation,
        to: "WASHING",
      })
      saveProductionLedger(next)
      setEntryWeightStates(
        pwSelectSortingEntryWeightState(
          entryWeightStates,
          weighingCode,
          item.containerCode,
          entryWeights,
        ),
      )
      setWeighingCode(item.containerCode)
      setScan("")
      onChange(next, "سبد به نشست باز شست‌وشو افزوده شد.")
    } catch (failure: any) {
      setError(failure.message)
    }
  }
  const removeInput = (itemId:string) => {
    try {
      const next=readProductionLedger(),session=next.washSessions.find(row=>["DRAFT","ACTIVE"].includes(row.status))
      if(!session||session.outputs.length)throw Error("پس از ثبت اولین خروجی، حذف ورودی نشست مجاز نیست.")
      const item=next.items.find(row=>row.id===itemId)
      session.inputIds=session.inputIds.filter((id:string)=>id!==itemId)
      if(item){item.zone=item.physicalLocation||"COLD_ROOM_POSITIVE_DIRTY";item.currentLocation=item.zone;item.currentState="READY";item.nextAction="در انتظار شست‌وشو"}
      if(!session.inputIds.length)next.washSessions=next.washSessions.filter(row=>row.id!==session.id)
      saveProductionLedger(next)
      const code=pwCode(item?.containerCode),nextWeights={...entryWeights},nextStates={...entryWeightStates}
      delete nextWeights[code];delete nextStates[code]
      setEntryWeights(nextWeights);setEntryWeightStates(nextStates)
      if(pwCode(weighingCode)===code)setWeighingCode("")
      onChange(next,"سبد از نشست شست‌وشو خارج شد.");setError("")
    }catch(failure:any){setError(failure.message)}
  }
  const lockSession=()=>{
    setError("")
    try{
      const next=readProductionLedger(),session=next.washSessions.find((row)=>["DRAFT","ACTIVE"].includes(row.status))
      pwLockWashingSession(next,session)
      saveProductionLedger(next);setWeighingCode("");setEntryWeights({});setEntryWeightStates({});setSelectedSessionId(session.id)
      onChange(next,`نشست ${session.id} قفل شد؛ اکنون می‌توانید نشست بعدی را باز کنید.`)
    }catch(failure:any){setError(failure.message)}
  }
  const printSessionLabels=(sessionId:string)=>{
    setError("")
    try{
      const next=readProductionLedger(),session=next.washSessions.find((row)=>row.id===sessionId&&row.status==="LOCKED"),count=Math.floor(Number(labelCounts[sessionId]||1))
      if(!session)throw Error("نشست قفل‌شده پیدا نشد.")
      if(!Number.isInteger(count)||count<1||count>100)throw Error("تعداد برچسب باید بین ۱ تا ۱۰۰ باشد.")
      const destination=PW_ZONES[session.destination]||session.destination
      pwEvent(next,"چاپ برچسب نشست شست‌وشو",session.id,{count,destination:session.destination,product:session.product,grade:session.grade})
      saveProductionLedger(next);setLastPrinted({sessionId,count,destination,product:session.product,grade:session.grade})
      onChange(next,`${count} برچسب برای نشست ${session.id} آماده چاپ شد.`)
    }catch(failure:any){setError(failure.message)}
  }
  const addOutput = () => {
    setError("")
    try {
      const next = readProductionLedger(),
        session = next.washSessions.find((row) => row.id===active?.id&&row.status === "LOCKED")
      if (!session || !session.inputIds.length)
        throw Error("ابتدا یک نشست قفل‌شده را انتخاب کنید.")
      const carrier = pwCarrier(outputCode, "basket")
      pwFreeCarrier(next, carrier.code)
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
        session = next.washSessions.find((row) => row.id===active?.id&&row.status === "LOCKED")
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
      const destination = session.destination || pwWashDestination(parents[0]) || "DRYING",route=pwRouteFor(destination),physicalAfterWashing=route.physicalAfterWashing||"COLD_ROOM_POSITIVE_CLEAN",nextProcess=route.processes[1]||"PACKAGING"
      const washBatchCode=pwId(next,"B")
      const children = session.outputs.map((row: any) => {
        const id = pwId(next, "U"),
          contributions = parents.map((parent) => ({
            id: parent.id,
            weightKg: pwNumber(row.weightKg * (parent.weightKg / available)),
          }))
        const child: PWItem = {
          id,
          code: washBatchCode,
          batchCode: washBatchCode,
          parentId: parents.map((parent) => parent.id).join(","),
          parentIds: parents.map((parent) => parent.id),
          parentContributions: contributions,
          inputCodes: (session.inputCarriers||[]).map((entry:any) => entry.containerCode).filter(Boolean),
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
          nextAction:pwNextOperatorAction(destination,"WASHED",nextProcess),
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
  const entryCandidate = sources.find(
    (item) => pwCode(item.containerCode) === pwCode(weighingCode),
  )
  const outputCarrier = (()=>{try{return outputCode?pwCarrier(outputCode,"basket"):null}catch{return null}})()
  const outputTare = Number(outputCarrier?.tareWeightKg || 0)
  const washDestination=active?.destination||pwWashDestination(sources[0])||"DRYING",washRoute=pwRouteFor(washDestination),washNextProcess=washRoute.processes[1]||"PACKAGING"
  const captureWashingEntryWeight=()=>{try{
    if(!entryCandidate)throw Error("ابتدا سبد ورودی را اسکن کنید.")
    const next=readProductionLedger(),session=next.washSessions.find(row=>["DRAFT","ACTIVE"].includes(row.status)),item=next.items.find(row=>row.id===entryCandidate.id)
    if(!session||!item||!session.inputIds.includes(item.id))throw Error("سبد جاری در نشست فعال شست‌وشو پیدا نشد.")
    const measured=pwNumber(item.weightKg)
    if(!(measured>0))throw Error("ترازو وزن معتبر دریافت نکرد.")
    pwTransitionWeight(next,item,"WASHING_ENTRY",measured)
    session.entryWeights=session.entryWeights||{}
    session.entryWeights[pwCode(item.containerCode)]=measured
    saveProductionLedger(next)
    setEntryWeights({...entryWeights,[pwCode(item.containerCode)]:measured})
    setEntryWeightStates(pwCaptureSortingEntryWeightState(entryWeightStates,item.containerCode))
    onChange(next,"وزن جدید سبد ورودی شست‌وشو ثبت شد.")
    setError("")
  }catch(failure:any){setError(failure.message)}}
  const scanWashingOutput=(rawCode:string)=>{try{const carrier=pwCarrier(rawCode,"basket");pwFreeCarrier(ledger,carrier.code);const measured=Math.min(18.5,Math.max(0,inputTotal-outputTotal));setOutputCode(carrier.code);setOutputWeight(measured.toFixed(3));setError("")}catch(failure:any){setError(failure.message)}}
  return <div style={{display:"grid",gap:18}}>
    <WashingScaleConsole mode={mode} code={mode==="ENTRY"?entryCandidate?.containerCode:outputCode} net={mode==="ENTRY"?Number(entryWeights[pwCode(entryCandidate?.containerCode)]??entryCandidate?.weightKg??0):Number(outputWeight||0)} previousNet={mode==="ENTRY"?Number(entryCandidate?.weightKg||0):0} tare={mode==="ENTRY"?0:outputTare} onRead={captureWashingEntryWeight}/>
    {error&&<div role="alert" style={{background:"#fff0f0",color:"#9f2323",padding:12,borderRadius:9}}>{error}</div>}
    {mode==="ENTRY"?<div style={pwBox}>
      <h3 style={{marginTop:0}}>اسکن سبدهای ورودی شست‌وشو</h3>
      <PWNotice>مواد داخل واحد شست‌وشو با هم مخلوط می‌شوند؛ بنابراین محصول، گرید و مقصد نهایی تمام ورودی‌های یک نشست باید یکسان باشد. اندازه می‌تواند متفاوت باشد.</PWNotice>
      <div style={{display:"flex",gap:8,marginTop:14}}><input aria-label="اسکن QR ورود شست‌وشو" value={scan} onChange={event=>setScan(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();addInput()}}} style={{...pwInput,flex:1,fontFamily:"monospace"}} placeholder="اسکن QR سبد ورودی یا ورود دستی"/><PWButton disabled={!scan.trim()} onClick={()=>addInput()}>افزودن سبد</PWButton><PWButton secondary onClick={()=>setInputScanOpen(true)}>⌗ شبیه‌ساز اسکن</PWButton></div>
      <ScanSimulator open={inputScanOpen} title="اسکن سبد ورودی شست‌وشو" suggestedCode={eligible[0]?.containerCode||""} onClose={()=>setInputScanOpen(false)} onScan={addInput}/>
      <div style={{border:"1px solid #d8e4df",borderRadius:12,overflow:"hidden",marginTop:16,background:"white"}}>{sources.length?sources.map(item=>{const code=pwCode(item.containerCode),weightState=entryWeightStates[code]||"PREVIOUS",finalDestination=pwWashDestination(item);return <div key={item.id} style={{display:"grid",gridTemplateColumns:"1.05fr 1.15fr 1.2fr 1.1fr .45fr",gap:12,padding:"12px 16px",borderBottom:"1px solid #e6eeea",fontSize:12,alignItems:"center"}}><b style={{fontFamily:"monospace",fontSize:13}}>{item.containerCode}</b><span style={{border:"1px solid #cde3da",background:"#edf7f3",borderRadius:9,padding:"6px 9px",textAlign:"center"}}><small style={{display:"block",color:"#718079"}}>مقصد نهایی</small><b>{PW_ZONES[finalDestination||""]||finalDestination||"تعیین نشده"}</b></span><button type="button" onClick={()=>{setEntryWeightStates(pwSelectSortingEntryWeightState(entryWeightStates,weighingCode,item.containerCode,entryWeights));setWeighingCode(item.containerCode)}} style={{border:`1px solid ${weightState==="CAPTURED"?"#72d9ad":weightState==="PENDING"?"#efbd4e":"#cfd9d5"}`,background:weightState==="CAPTURED"?"#ebfff6":weightState==="PENDING"?"#fff9e9":"#f5f7f6",color:weightState==="CAPTURED"?"#176b50":weightState==="PENDING"?"#9a6420":"#718079",borderRadius:12,padding:"6px 9px",fontWeight:800,textAlign:"center",cursor:"pointer"}}>{weightState==="CAPTURED"?"✓ وزن جدید ثبت شد":weightState==="PENDING"?"در انتظار ثبت وزن":"وزن قبلی انتخاب شد"}</button><span style={{color:"#718079"}}>آخرین وزن: <b style={{fontFamily:"monospace",color:"#18302a",background:"#f1f3f2",padding:"4px 7px",borderRadius:5}}>{item.weightKg.toFixed(3)} kg</b></span><button type="button" onClick={()=>removeInput(item.id)} style={{border:0,background:"transparent",color:"#c23d3d",cursor:"pointer"}}>حذف</button></div>}):<PWEmpty>هنوز سبدی وارد نشست نشده است.</PWEmpty>}</div>
      <div style={{marginTop:14,background:"#eaf6f0",padding:13,borderRadius:10,fontSize:12,display:"flex",justifyContent:"space-between"}}><span>{sources.length} سبد آماده شست‌وشو</span><b>مجموع {inputTotal.toFixed(3)} kg</b></div>
      {active?<><div style={{marginTop:12,background:"#fff8e3",padding:12,borderRadius:9,fontSize:12}}>نشست باز {active.id} · ترکیب: <b>{active.product} / گرید {active.grade} / {PW_ZONES[active.destination]||active.destination}</b></div><PWNotice>پس از اسکن تمام سبدهای همین وان، نشست را قفل کنید. سپس می‌توانید نشست دیگری با محصول، گرید یا مقصد متفاوت باز کنید.</PWNotice><PWButton disabled={!active.inputIds.length} onClick={lockSession}>قفل نشست و آماده‌سازی برای شست‌وشو</PWButton></>:<PWNotice>نشست بازی وجود ندارد؛ با اسکن اولین سبد، یک نشست تازه ساخته می‌شود.</PWNotice>}
      {!!lockedSessions.length&&<div style={{marginTop:18}}><h3>نشست‌های قفل‌شده آماده شست‌وشو</h3><div style={{display:"grid",gap:10}}>{lockedSessions.map((session:any)=><div key={session.id} style={{border:"1px solid #cfe0d9",borderRadius:12,padding:12,display:"grid",gridTemplateColumns:"1.2fr 1fr .8fr auto",gap:10,alignItems:"center",fontSize:12}}><div><b>{session.id}</b><small style={{display:"block",color:"#718079"}}>{session.inputIds.length} سبد · {session.product} / گرید {session.grade}</small></div><span><small style={{display:"block",color:"#718079"}}>مقصد نهایی روی برچسب</small><b>{PW_ZONES[session.destination]||session.destination}</b></span><input aria-label={`تعداد برچسب ${session.id}`} type="number" min="1" max="100" value={labelCounts[session.id]||1} onChange={(event)=>setLabelCounts({...labelCounts,[session.id]:Number(event.target.value)})} style={pwInput}/><PWButton secondary onClick={()=>printSessionLabels(session.id)}>چاپ برچسب</PWButton></div>)}</div>{lastPrinted&&<div style={{marginTop:10,border:"2px dashed #176b50",borderRadius:12,padding:12,background:"#f2fbf7",fontSize:12}}><b>پیش‌نمایش برچسب · {lastPrinted.sessionId}</b><span style={{display:"block"}}>{lastPrinted.product} · گرید {lastPrinted.grade} · مقصد نهایی: <b>{lastPrinted.destination}</b> · تعداد {lastPrinted.count}</span></div>}</div>}
    </div>:<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
      <div style={pwBox}><h3 style={{marginTop:0}}>اسکن و ثبت سبدهای تازه خروجی</h3>{!!lockedSessions.length&&<PWField label="نشست قفل‌شده شست‌وشو"><select value={active?.id||""} onChange={(event)=>{setSelectedSessionId(event.target.value);setOutputCode("");setOutputWeight("");setLossReason("");setEmpty(false)}} style={pwInput}>{lockedSessions.map((session:any)=><option key={session.id} value={session.id}>{session.id} · {session.product} · گرید {session.grade} · {PW_ZONES[session.destination]||session.destination}</option>)}</select></PWField>}{!active?<PWEmpty>هیچ نشست قفل‌شده‌ای برای ثبت خروج وجود ندارد.</PWEmpty>:<><div style={{display:"flex",gap:8}}><input aria-label="اسکن سبد خالی خروجی شست‌وشو" value={outputCode} onChange={event=>setOutputCode(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();scanWashingOutput(outputCode)}}} style={{...pwInput,flex:1,fontFamily:"monospace"}} placeholder="اسکن QR سبد خالی"/><PWButton secondary onClick={()=>setOutputScanOpen(true)}>⌗ شبیه‌ساز اسکن</PWButton></div><p style={{fontSize:11,color:"#718079"}}>با اسکن سبد روی باسکول، وزن پایدار همان لحظه به‌صورت آنلاین ثبت می‌شود.</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"12px 0"}}><label style={{fontSize:11,color:"#718079"}}>مقصد بعدی<input readOnly value={PW_ZONES[washNextProcess]||washNextProcess} style={{...pwInput,marginTop:5,background:"#f7f9f8"}}/></label><label style={{fontSize:11,color:"#718079"}}>مقصد نهایی<input readOnly value={PW_ZONES[washDestination]||washDestination} style={{...pwInput,marginTop:5,background:"#f7f9f8"}}/></label></div><label style={{display:"flex",gap:8,alignItems:"center",fontSize:12,margin:"12px 0",padding:10,border:"1px solid #d5e3dd",borderRadius:9}}><input type="checkbox" checked={qualityCheckRequired} onChange={event=>setQualityCheckRequired(event.target.checked)}/><span><b>نیازمند کنترل کیفیت در خروج شست‌وشو</b><small style={{display:"block",color:"#718079"}}>تا تصمیم مدیر، اقدام بعدی این سبد متوقف می‌شود.</small></span></label><PWButton disabled={!outputCode||!outputWeight} onClick={addOutput}>ثبت این خروجی و ادامه</PWButton><ScanSimulator open={outputScanOpen} title="اسکن سبد خروجی شست‌وشو" suggestedCode={outputCode||"CTR-003"} onClose={()=>setOutputScanOpen(false)} onScan={scanWashingOutput}/><div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden",marginTop:16}}><div style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1.5fr",background:"#eef4f1",padding:9,fontSize:11,fontWeight:800}}><span>#</span><span>کد سبد</span><span>وزن خالص</span><span>مسیر</span></div>{active.outputs.map((row:any,index:number)=><div key={row.containerCode} style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1.5fr",padding:10,borderTop:"1px solid #e1eae6",fontSize:12}}><span>{index+1}</span><b style={{fontFamily:"monospace"}}>{row.containerCode}</b><b>{row.weightKg.toFixed(3)} kg</b><span>{PW_ZONES[washNextProcess]||washNextProcess} ← {PW_ZONES[washDestination]||washDestination}</span></div>)}</div></>}</div>
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
  const [sliceInputIds,setSliceInputIds]=useState<string[]>(()=>[...((ledger.slicingSessions||[]).find((session:any)=>session.status==="LOCKED")?.inputIds||[])])
  const [sliceScan,setSliceScan]=useState("")
  const [sliceScanOpen,setSliceScanOpen]=useState(false)
  const [sliceTrayGroups,setSliceTrayGroups]=useState([{id:1,count:"1",unitWeightKg:""}])
  const [sliceRemainderCode,setSliceRemainderCode]=useState("")
  const [sliceRemainderWeight,setSliceRemainderWeight]=useState("")
  const [sliceRemainderScanOpen,setSliceRemainderScanOpen]=useState(false)
  const [sliceDifferenceReason,setSliceDifferenceReason]=useState("")
  const [cycleEntryIds,setCycleEntryIds]=useState<string[]>([])
  const [dryGradeRows,setDryGradeRows]=useState([{id:1,grade:"A",weightKg:""}])
  const [dryPackagingSourceIds,setDryPackagingSourceIds]=useState<string[]>([])
  const [dryPouchCode,setDryPouchCode]=useState(PW_DRY_POUCHES[0].code)
  const [dryAbsorberCode,setDryAbsorberCode]=useState("CNS-DES-005")
  const [dryPackageScaleKg,setDryPackageScaleKg]=useState(PW_DRY_POUCHES[0].fillWeightGrams/1000)
  const [dryScaleMode,setDryScaleMode]=useState<"GRADING"|"PACKAGING">("GRADING")
  const [dryRemainderCode,setDryRemainderCode]=useState("")
  const [dryRemainderScanOpen,setDryRemainderScanOpen]=useState(false)
  const [freezeDryGradeRows,setFreezeDryGradeRows]=useState([{id:1,grade:"A",weightKg:""}])
  const [freezeDryOutputCycleId,setFreezeDryOutputCycleId]=useState("")
  const [freezeDryPackagingSourceIds,setFreezeDryPackagingSourceIds]=useState<string[]>([])
  const [freezeDryPouchCode,setFreezeDryPouchCode]=useState(PW_DRY_POUCHES[0].code)
  const [freezeDryAbsorberCode,setFreezeDryAbsorberCode]=useState("CNS-DES-005")
  const [freezeDryPackageScaleKg,setFreezeDryPackageScaleKg]=useState(PW_DRY_POUCHES[0].fillWeightGrams/1000)
  const [freezeDryScaleMode,setFreezeDryScaleMode]=useState<"GRADING"|"PACKAGING">("GRADING")
  const [freezeDryRemainderCode,setFreezeDryRemainderCode]=useState("")
  const [freezeDryRemainderScanOpen,setFreezeDryRemainderScanOpen]=useState(false)
  const [resetArmed,setResetArmed]=useState(false)
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
  const sliceEligible=live.filter((item)=>!pwBusy(ledger,item)&&!item.blocked&&item.stage==="WASHED"&&item.nextZone==="SLICING"&&!!item.containerCode)
  const activeSliceSession=(ledger.slicingSessions||[]).find((session:any)=>session.status==="LOCKED")
  const effectiveSliceInputIds=activeSliceSession?.inputIds||sliceInputIds
  const selectedSliceItems=effectiveSliceInputIds.map((id:string)=>live.find((item)=>item.id===id)).filter(Boolean) as PWItem[]
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
    setCycleEntryIds([])
    setDryCarryoverIds([])
    setDryScaleWeight("")
    setDryPackageRows([{id:1,count:"1",unitWeightGrams:"100",grade:""}])
    setDryRemainderCode("")
    setDryRemainderWeight("")
    setError("")
    setNotice("")
    const refreshed=readProductionLedger()
    setLedger(refreshed)
    if(value==="slice")setSliceInputIds([...((refreshed.slicingSessions||[]).find((session:any)=>session.status==="LOCKED")?.inputIds||[])])
  }
  const batchPicker = (items: PWItem[],label="بچ ورودی") => (
    <PWField label={label}>
      <select
        required
        value={chosen}
        onChange={(e) => setChosen(e.target.value)}
        style={pwInput}
      >
        <option value="">انتخاب بچ…</option>
        {items.map((x) => (
          <option key={x.id} value={x.id}>
            {x.batchCode||x.code} · {x.containerCode?`ظرف ${x.containerCode} · `:""}{x.product} · {x.grade}/{x.size} · {x.weightKg} kg
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
        item.nextAction = `در مرحله ${PW_ZONES[zone]} و منتظر ثبت خروج`
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
          if(nextProcess==="DRYING") item.physicalLocation="DRYING"
          item.zone=item.physicalLocation||"COLD_ROOM_POSITIVE_CLEAN"
          item.currentLocation=item.zone
          item.nextZone=nextProcess
          item.nextProcess=null
        }
        item.qualityCheckRequired=data.get("qualityCheckRequired")==="on"
        item.nextAction=item.qualityCheckRequired?"در انتظار تصمیم مدیر کنترل کیفیت":pwNextOperatorAction(item.destination,item.stage,item.nextZone)
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
  const scanSliceInput=(rawCode:string)=>{
    setError("")
    if(activeSliceSession){setError("نشست اسلایس قفل شده است؛ ابتدا خروج همین نشست را تکمیل کنید.");return}
    const code=pwCode(rawCode),item=sliceEligible.find((row)=>pwCode(row.containerCode)===code)
    if(!item){setError("این سبد برای ورود به اسلایس واجد شرایط نیست.");return}
    if(sliceInputIds.includes(item.id)){setError("این سبد قبلاً وارد شده است.");return}
    const selected=sliceEligible.filter((row)=>sliceInputIds.includes(row.id)),first=selected[0]
    if(first&&(first.product!==item.product||first.grade!==item.grade||pwWashDestination(first)!==pwWashDestination(item))){setError("سبدهای یک عملیات اسلایس باید محصول، گرید و مقصد نهایی یکسان داشته باشند.");return}
    setSliceInputIds([...sliceInputIds,item.id])
    setSliceScan("")
  }
  const lockSlicingInputs=()=>{
    let locked:any=null
    execute("سبدها قفل شدند و نشست اسلایس پایدار شد.",(next)=>{locked=pwLockSlicingSession(next,sliceInputIds)})
    if(locked)setSliceInputIds([...locked.inputIds])
  }
  const addSliceTrayGroup=()=>setSliceTrayGroups([...sliceTrayGroups,{id:Math.max(0,...sliceTrayGroups.map((row)=>row.id))+1,count:"1",unitWeightKg:""}])
  const updateSliceTrayGroup=(id:number,field:"count"|"unitWeightKg",value:string)=>setSliceTrayGroups(sliceTrayGroups.map((row)=>row.id===id?{...row,[field]:value}:row))
  const removeSliceTrayGroup=(id:number)=>setSliceTrayGroups(sliceTrayGroups.filter((row)=>row.id!==id))
  const scanSliceRemainder=(rawCode:string)=>{try{
    const carrier=pwCarrier(rawCode,"basket")
    pwFreeCarrier(ledger,carrier.code)
    const inputTotal=selectedSliceItems.reduce((sum,item)=>sum+item.weightKg,0)
    const trayTotal=sliceTrayGroups.reduce((sum,row)=>sum+(Number(row.count)||0)*(Number(row.unitWeightKg)||0),0)
    const measured=pwNumber(Math.max(0,inputTotal-trayTotal))
    setSliceRemainderCode(carrier.code)
    setSliceRemainderWeight(measured>0?measured.toFixed(3):"")
    setSliceRemainderScanOpen(false)
    setError(measured>0?"":"وزن پایدار لودسل صفر است؛ سبد مانده را روی باسکول قرار دهید.")
  }catch(failure:any){setSliceRemainderWeight("");setError(failure.message||"سبد مانده معتبر نیست.")}}
  const completeSlicing=(event:any)=>{
    const data=form(event)
    let completed=false
    execute("اسلایس و تراز وزن سینی‌ها ثبت شد.",(next)=>{
      const session=(next.slicingSessions||[]).find((row:any)=>row.status==="LOCKED")
      if(!session)throw Error("ابتدا سبدهای ورودی را ثبت و نشست اسلایس را قفل کنید.")
      const parents=session.inputIds.map((id:string)=>next.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[]
      if(!parents.length||parents.length!==session.inputIds.length) throw Error("ورودی‌های نشست قفل‌شده کامل نیستند.")
      parents.forEach((item)=>{if(item.consumed||item.blocked||!(item.weightKg>0)||item.stage!=="WASHED"||item.nextZone!=="SLICING"||item.currentState!=="IN_SLICING"||!item.containerCode)throw Error("یکی از سبدهای قفل‌شده دیگر برای خروج اسلایس معتبر نیست.")})
      const first=parents[0],destination=pwWashDestination(first)
      if(parents.some((item)=>item.product!==first.product||item.grade!==first.grade||pwWashDestination(item)!==destination))throw Error("محصول، گرید و مقصد نهایی سبدهای ورودی باید یکسان باشد.")
      const trayGroups=sliceTrayGroups.map((row)=>({count:Number(row.count),unitWeightKg:Number(row.unitWeightKg)}))
      if(!trayGroups.length||trayGroups.some((row)=>!Number.isInteger(row.count)||row.count<1||row.count>100||!Number.isFinite(row.unitWeightKg)||!(row.unitWeightKg>0)))throw Error("در هر ردیف، تعداد سینی و وزن هر سینی باید معتبر و مثبت باشد.")
      const trayCount=trayGroups.reduce((sum,row)=>sum+row.count,0)
      const trays:{sequence:number;quantityKg:number;groupIndex:number}[]=[]
      trayGroups.forEach((row,groupIndex)=>Array.from({length:row.count}).forEach(()=>trays.push({sequence:trays.length+1,quantityKg:pwNumber(row.unitWeightKg),groupIndex:groupIndex+1})))
      const weights=trays.map((tray)=>tray.quantityKg)
      const inputWeightKg=pwNumber(parents.reduce((sum,item)=>sum+item.weightKg,0)),trayOutputWeightKg=pwNumber(weights.reduce((sum,weight)=>sum+weight,0))
      const remainderCode=pwCode(sliceRemainderCode),rawRemainderWeight=String(sliceRemainderWeight||"").trim(),remainderWeightKg=rawRemainderWeight?pwNumber(Number(rawRemainderWeight)):0
      if((remainderCode&&!rawRemainderWeight)||(!remainderCode&&rawRemainderWeight))throw Error("برای مانده‌بار، هم QR سبد و هم وزن مانده را ثبت کنید.")
      if(rawRemainderWeight&&(!Number.isFinite(Number(rawRemainderWeight))||!(remainderWeightKg>0)))throw Error("وزن مانده‌بار باید مثبت باشد.")
      const accountedWeightKg=pwNumber(trayOutputWeightKg+remainderWeightKg),deltaKg=pwNumber(accountedWeightKg-inputWeightKg),reason=String(data.get("differenceReason")||"").trim()
      if(Math.abs(deltaKg)>0.0005&&!reason)throw Error("برای اختلاف وزن ورودی با مجموع سینی‌ها و مانده‌بار علت را ثبت کنید.")
      const route=pwRouteFor(destination),nextProcess=route.processes[route.processes.indexOf("SLICING")+1]||"PACKAGING",physicalLocation=nextProcess==="FREEZING"?"COLD_ROOM_NEGATIVE":nextProcess==="DRYING"?"DRYING":first.physicalLocation||"COLD_ROOM_POSITIVE_CLEAN",id=pwId(next,"B")
      const inputCodes=parents.map((item)=>item.containerCode),contributionsFor=(weightKg:number)=>{let allocated=0;return parents.map((item,index)=>{const weight=index===parents.length-1?pwNumber(weightKg-allocated):pwNumber(weightKg*item.weightKg/inputWeightKg);allocated=pwNumber(allocated+weight);return {id:item.id,weightKg:weight}})}
      const child:PWItem={id,code:id,parentId:parents.map((item)=>item.id).join(","),parentIds:parents.map((item)=>item.id),parentContributions:contributionsFor(trayOutputWeightKg),inputCodes,product:first.product,grade:first.grade,size:[...new Set(parents.map((item)=>item.size))].join("، "),weightKg:trayOutputWeightKg,stage:"SLICED",zone:physicalLocation,currentLocation:physicalLocation,physicalLocation,destination,operationalDestination:destination,nextZone:nextProcess,nextProcess:null,nextAction:pwNextOperatorAction(destination,"SLICED",nextProcess),qualityCheckRequired:data.get("qualityCheckRequired")==="on",containerCode:"",trays,allocated:true,consumed:false,blocked:data.get("qualityCheckRequired")==="on"}
      parents.forEach((item)=>{item.consumed=true;item.stage="CONSUMED";item.containerCode="";item.weightKg=0})
      next.items.push(child)
      let remainderBatchCode:string|null=null
      if(remainderWeightKg>0){const carrier=pwCarrier(remainderCode,"basket");pwFreeCarrier(next,carrier.code);const remainderId=pwId(next,"B"),remainderLocation=first.physicalLocation||"COLD_ROOM_POSITIVE_CLEAN";const remainder:PWItem={id:remainderId,code:remainderId,parentId:parents.map((item)=>item.id).join(","),parentIds:parents.map((item)=>item.id),parentContributions:contributionsFor(remainderWeightKg),inputCodes,product:first.product,grade:first.grade,size:[...new Set(parents.map((item)=>item.size))].join("، "),weightKg:remainderWeightKg,stage:"WASHED",zone:remainderLocation,currentLocation:remainderLocation,physicalLocation:remainderLocation,destination,operationalDestination:destination,nextZone:"SLICING",nextProcess:null,nextAction:"منتظر ورود دوباره به اسلایس",qualityCheckRequired:false,containerCode:carrier.code,trays:[],allocated:false,consumed:false,blocked:false};next.items.push(remainder);remainderBatchCode=remainder.code;pwEvent(next,"ثبت مانده‌بار اسلایس",remainder.code,{containerCode:carrier.code,weightKg:remainderWeightKg,returnLocation:remainderLocation,nextZone:"SLICING"})}
      pwEvent(next,"ثبت اسلایس",child.code,{parents:child.parentIds,inputCodes:child.inputCodes,trayCount,trayGroups:trayGroups.map((row)=>({...row,totalWeightKg:pwNumber(row.count*row.unitWeightKg)})),trayWeightsKg:child.trays.map((tray:any)=>tray.quantityKg),inputWeightKg,trayOutputWeightKg,remainderWeightKg,remainderContainerCode:remainderCode||null,remainderBatchCode,accountedWeightKg,deltaKg,differenceReason:reason||null,nextZone:nextProcess})
      session.status="COMPLETED";session.completedAt=new Date().toISOString();session.outputIds=[child.id,...(remainderBatchCode?[remainderBatchCode]:[])]
      completed=true
    })
    if(completed){setSliceInputIds([]);setSliceScan("");setSliceTrayGroups([{id:1,count:"1",unitWeightKg:""}]);setSliceRemainderCode("");setSliceRemainderWeight("");setSliceDifferenceReason("")}
  }
  const createCycle = (event: any, type: string) => {
    const data = form(event)
    let completed=false
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
          const directFreezeDryEntry=type==="FREEZE_DRY"&&item.destination==="FREEZE_DRYING"&&item.stage==="SLICED"&&item.nextZone==="FREEZING"&&item.physicalLocation==="COLD_ROOM_NEGATIVE"
          if (!directFreezeDryEntry&&(item.stage !== expectedStage || (item.zone !== expectedZone && item.nextZone !== expectedZone)))
            throw Error(
              "مرحله یا محل فعلی یکی از بچ‌ها برای این چرخه مناسب نیست.",
            )
        })
        if (items.some((item) => !!item!.demo !== !!items[0]!.demo))
          throw Error("بچ آزمایشی و داده شما نباید در یک چرخه ترکیب شوند.")
        items.forEach((item) => {
          const before = item!.zone
          if(type==="FREEZE_DRY"&&item!.stage==="SLICED"&&item!.destination==="FREEZE_DRYING")item!.stage="FROZEN"
          item!.zone = expectedZone
          item!.currentLocation = expectedZone
          item!.currentState = "IN_PROCESS"
            item!.nextAction = `در مرحله ${PW_ZONES[expectedZone]} و منتظر ثبت خروج`
          pwEvent(next, `ورود به ${PW_ZONES[expectedZone]}`, item!.code, {
            from: before,
            to: expectedZone,
          })
        })
        const available = pwNumber(
          items.reduce((sum, item) => sum + item!.weightKg, 0),
        )
        const inputWeightKg =
          type === "FREEZE" || type === "FREEZE_DRY"
            ? available
            : Number(data.get("inputWeight"))
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
        completed=true
        pwEvent(next, "ساخت چرخه", code, {
          type,
          machineId,
          batches: ids,
          inputWeightKg,
        })
      },
    )
    if(completed)setCycleEntryIds([])
  }
  const cycleAction = (event: any, id: string, action: string) => {
    const data = form(event)
    execute("وضعیت چرخه و موجودی به‌روزرسانی شد.", (next) => {
      const cycle = next.cycles.find((c) => c.id === id)
      if (!cycle) throw Error("چرخه پیدا نشد.")
      if(action==="FINISH"&&cycle.type==="FREEZE_DRY")throw Error("خروج فریزدرای باید ابتدا تفکیک و قفل شود و سپس بسته‌ها تک‌به‌تک وزن شوند.")
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
  const updateDryGradeRow=(id:number,key:"weightKg"|"grade",value:string)=>setDryGradeRows((rows)=>rows.map((row)=>row.id===id?{...row,[key]:value}:row))
  const addDryGradeRow=()=>setDryGradeRows((rows)=>[...rows,{id:Math.max(0,...rows.map((row)=>row.id))+1,grade:"A",weightKg:""}])
  const removeDryGradeRow=(id:number)=>setDryGradeRows((rows)=>rows.length===1?rows:rows.filter((row)=>row.id!==id))
  const lockDryOutput=(event:any)=>{
    form(event)
    let lockedIds:string[]=[]
    execute("خروج خشک‌کن تفکیک شد؛ بچ‌های گریددار برای بسته‌بندی قفل شدند.",(next)=>{
      const current=next.items.find((item)=>item.id===chosen)
      pwUsable(next,current)
      if(current.nextZone!=="DRYING"||current.stage!=="SLICED"||current.destination!=="DRYING")throw Error("محصول انتخاب‌شده برای خروج خشک‌کن آماده نیست.")
      const rows=dryGradeRows.map((row)=>({grade:String(row.grade||"").trim(),weightKg:pwNumber(Number(row.weightKg))}))
      if(!rows.length||rows.some((row)=>!row.grade||!(row.weightKg>0)))throw Error("برای هر خروجی، گرید و وزن مثبت ثبت کنید.")
      const totalOutputKg=pwNumber(rows.reduce((sum,row)=>sum+row.weightKg,0))
      if(totalOutputKg>current.weightKg)throw Error("مجموع خروجی گریدها نمی‌تواند از وزن ورود به خشک‌کن بیشتر باشد.")
      const dryGradingSessionId=pwId(next,"DGS"),inputWeightKg=current.weightKg,inputCodes=current.inputCodes||[]
      rows.forEach((row)=>{const id=pwId(next,"DRY"),item:PWItem={id,code:id,batchCode:id,parentId:current.id,parentIds:[current.id],parentContributions:[{id:current.id,weightKg:row.weightKg}],inputCodes,product:current.product,grade:row.grade,size:current.size,weightKg:row.weightKg,stage:"DRIED",zone:"PACKAGING",currentLocation:"PACKAGING",physicalLocation:"PACKAGING",currentState:"READY_FOR_PACKAGING",destination:"DRYING",operationalDestination:"DRYING",nextZone:"PACKAGING",nextAction:"در انتظار بسته‌بندی تک‌به‌تک",containerCode:"",trays:[],allocated:false,consumed:false,blocked:false,remainderForPackaging:true,dryGradingSessionId,beforeMachineWeightKg:inputWeightKg,yieldPercent:pwNumber((totalOutputKg/inputWeightKg)*100)};next.items.push(item);lockedIds.push(id)})
      current.consumed=true;current.stage="CONSUMED";current.currentState="DRY_OUTPUT_GRADED";current.weightKg=0;current.containerCode="";current.trays=[];current.nextZone=null;current.nextAction="خروج خشک‌کن تفکیک و قفل شد"
      pwEvent(next,"قفل تفکیک خروج خشک‌کن",dryGradingSessionId,{sourceId:current.id,inputWeightKg,totalOutputKg,processLossKg:pwNumber(inputWeightKg-totalOutputKg),outputs:rows.map((row,index)=>({id:lockedIds[index],...row}))})
    })
    if(lockedIds.length){setChosen("");setDryGradeRows([{id:1,grade:"A",weightKg:""}]);setDryPackagingSourceIds(lockedIds);setDryScaleMode("PACKAGING")}
  }
  const packageOneDryUnit=()=>{
    let survivingIds:string[]=[]
    let completed=false
    execute("بسته توزین شد؛ شناسه و برچسب همان بسته چاپ شد.",(next)=>{
      const sources=dryPackagingSourceIds.map((id)=>next.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[]
      if(!sources.length||sources.length!==dryPackagingSourceIds.length)throw Error("حداقل یک بچ گریددار معتبر برای بسته‌بندی انتخاب کنید.")
      sources.forEach((item)=>{pwUsable(next,item);if(item.stage!=="DRIED"||item.nextZone!=="PACKAGING")throw Error("فقط خروجی خشک گریدشده و قفل‌شده قابل بسته‌بندی است.")})
      if(sources.some((item)=>item.product!==sources[0].product||item.grade!==sources[0].grade))throw Error("برای یک بسته فقط بچ‌های هم‌محصول و هم‌گرید را ترکیب کنید.")
      const pouch=PW_DRY_POUCHES.find((row)=>row.code===dryPouchCode),absorber=PW_DRY_ABSORBERS.find((row)=>row.code===dryAbsorberCode)
      if(!pouch||!absorber)throw Error("پاکت یا رطوبت‌گیر انتخاب‌شده معتبر نیست.")
      const netWeightKg=pwNumber(dryPackageScaleKg),availableWeightKg=pwNumber(sources.reduce((sum,item)=>sum+item.weightKg,0))
      if(!(netWeightKg>0))throw Error("وزن آنلاین بسته باید مثبت باشد.")
      if(availableWeightKg<netWeightKg)throw Error("موجودی انتخاب‌شده برای پر کردن این پاکت کافی نیست؛ مانده را داخل سبد ثبت کنید.")
      const sourceWeights=sources.map((item)=>({code:item.id,gross:item.weightKg,tare:0})),contributions=pwProportionalParentContributions(sourceWeights,netWeightKg,{})
      contributions.forEach((part:any)=>{const source=sources.find((item)=>item.id===part.batchId)!;source.weightKg=pwNumber(source.weightKg-part.inputWeightKg);if(source.weightKg<=0.0005){source.weightKg=0;source.consumed=true;source.stage="CONSUMED";source.currentState="CONSUMED_BY_PACKAGING";source.nextZone=null;source.nextAction="در بسته‌بندی مصرف شد"}else{survivingIds.push(source.id)}})
      const id=pwId(next,"PKG"),packagingSessionId=pwId(next,"PKS"),tareWeightGrams=pouch.tareWeightGrams+absorber.weightGrams,grossWeightGrams=Math.round((netWeightKg*1000)+tareWeightGrams),packaged:PWItem={id,code:id,batchCode:packagingSessionId,parentId:sources.map((item)=>item.id).join(","),parentIds:sources.map((item)=>item.id),parentContributions:contributions.map((part:any)=>({id:part.batchId,weightKg:part.inputWeightKg})),inputCodes:sources.flatMap((item)=>item.inputCodes||[]),product:sources[0].product,grade:sources[0].grade,size:`${Math.round(netWeightKg*1000)} g`,weightKg:netWeightKg,stage:"PACKAGED",zone:"PACKAGING",currentLocation:"PACKAGING",physicalLocation:"PACKAGING",currentState:"FINISHED_PACKAGE",destination:null,operationalDestination:"DRYING",nextZone:null,nextAction:"آماده انبار محصول نهایی",containerCode:"",trays:[],allocated:false,consumed:false,blocked:false,packagingSessionId,packageUnitWeightGrams:Math.round(netWeightKg*1000),pouchCode:pouch.code,pouchTareWeightGrams:pouch.tareWeightGrams,moistureAbsorberCode:absorber.code,moistureAbsorberWeightGrams:absorber.weightGrams,grossWeightGrams,labelPrintedAt:new Date().toISOString()};next.items.push(packaged);pwEvent(next,"توزین، چاپ برچسب و بستن بسته",id,{sourceIds:sources.map((item)=>item.id),netWeightKg,pouchCode:pouch.code,pouchTareWeightGrams:pouch.tareWeightGrams,moistureAbsorberCode:absorber.code,moistureAbsorberWeightGrams:absorber.weightGrams,grossWeightGrams,labelPrinted:true});completed=true
    })
    if(completed)setDryPackagingSourceIds([...new Set(survivingIds)])
  }
  const closeDryPackaging=()=>{
    let completed=false
    execute("نشست بسته‌بندی بسته شد و مانده برای نوبت بعد داخل سبد ثبت شد.",(next)=>{
      const sources=dryPackagingSourceIds.map((id)=>next.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[],remainingKg=pwNumber(sources.reduce((sum,item)=>sum+item.weightKg,0))
      if(!sources.length)throw Error("بچ بازی برای بستن نشست وجود ندارد.")
      if(remainingKg>0&&!dryRemainderCode)throw Error("برای مانده محصول، QR سبد را اسکن کنید.")
      let carrier:any=null
      if(remainingKg>0){carrier=pwCarrier(dryRemainderCode,"basket");pwFreeCarrier(next,carrier.code);if(remainingKg>carrier.capacityKg)throw Error("مانده بیشتر از ظرفیت سبد است.")}
      const first=sources[0],parentIds=sources.map((item)=>item.id),parentContributions=sources.map((item)=>({id:item.id,weightKg:item.weightKg}))
      sources.forEach((item)=>{item.consumed=true;item.stage="CONSUMED";item.currentState="PACKAGING_SESSION_CLOSED";item.weightKg=0;item.nextZone=null;item.nextAction="نشست بسته‌بندی بسته شد"})
      if(remainingKg>0){const id=pwId(next,"B"),remainder:PWItem={id,code:id,batchCode:id,parentId:parentIds.join(","),parentIds,parentContributions,inputCodes:sources.flatMap((item)=>item.inputCodes||[]),product:first.product,grade:first.grade,size:first.size,weightKg:remainingKg,stage:"DRIED",zone:"COLD_ROOM_POSITIVE_CLEAN",currentLocation:"COLD_ROOM_POSITIVE_CLEAN",physicalLocation:"COLD_ROOM_POSITIVE_CLEAN",currentState:"AVAILABLE",destination:"DRYING",operationalDestination:"DRYING",nextZone:"PACKAGING",nextAction:"مانده محصول خشک؛ در انتظار بسته‌بندی بعدی",containerCode:carrier.code,trays:[],allocated:false,consumed:false,blocked:false,remainderForPackaging:true};next.items.push(remainder);pwEvent(next,"ثبت مانده محصول خشک",id,{sourceIds:parentIds,containerCode:carrier.code,weightKg:remainingKg})}
      completed=true
    })
    if(completed){setDryPackagingSourceIds([]);setDryRemainderCode("")}
  }
  const updateFreezeDryGradeRow=(id:number,key:"weightKg"|"grade",value:string)=>setFreezeDryGradeRows((rows)=>rows.map((row)=>row.id===id?{...row,[key]:value}:row))
  const addFreezeDryGradeRow=()=>setFreezeDryGradeRows((rows)=>[...rows,{id:Math.max(0,...rows.map((row)=>row.id))+1,grade:"A",weightKg:""}])
  const removeFreezeDryGradeRow=(id:number)=>setFreezeDryGradeRows((rows)=>rows.length===1?rows:rows.filter((row)=>row.id!==id))
  const lockFreezeDryOutput=(event:any,cycleId:string)=>{
    form(event)
    let lockedIds:string[]=[]
    execute("خروج فریزدرای تفکیک و برای بسته‌بندی قفل شد.",(next)=>{
      const cycle=next.cycles.find((row)=>row.id===cycleId&&row.type==="FREEZE_DRY")
      if(!cycle||cycle.status!=="COMPLETING")throw Error("چرخه فریزدرای باید در وضعیت آماده تخلیه باشد.")
      const parents=cycle.itemIds.map((id:string)=>next.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[]
      if(!parents.length||parents.some((item)=>item.consumed||item.weightKg<=0||item.destination!=="FREEZE_DRYING"))throw Error("ورودی معتبر چرخه فریزدرای پیدا نشد.")
      if(parents.some((item)=>item.product!==parents[0].product))throw Error("محصولات متفاوت را در یک خروجی فریزدرای تفکیک نکنید.")
      const inputWeightKg=pwNumber(parents.reduce((sum,item)=>sum+item.weightKg,0)),rows=freezeDryGradeRows.map((row)=>({grade:String(row.grade||"").trim(),weightKg:pwNumber(Number(row.weightKg))}))
      if(!rows.length||rows.some((row)=>!row.grade||!(row.weightKg>0)))throw Error("برای هر خروجی فریزدرای، گرید و وزن مثبت ثبت کنید.")
      const totalOutputKg=pwNumber(rows.reduce((sum,row)=>sum+row.weightKg,0))
      if(totalOutputKg>inputWeightKg)throw Error("مجموع خروجی گریدها نمی‌تواند از وزن ورودی فریزدرای بیشتر باشد.")
      const sessionId=pwId(next,"FGS"),sourceWeights=parents.map((item)=>({code:item.id,gross:item.weightKg,tare:0}))
      rows.forEach((row)=>{const contributions=pwProportionalParentContributions(sourceWeights,row.weightKg,{}),id=pwId(next,"FDR"),item:PWItem={id,code:id,batchCode:id,parentId:parents.map((parent)=>parent.id).join(","),parentIds:parents.map((parent)=>parent.id),parentContributions:contributions.map((part:any)=>({id:part.batchId,weightKg:part.inputWeightKg})),inputCodes:parents.flatMap((parent)=>parent.inputCodes||[]),product:parents[0].product,grade:row.grade,size:parents.map((parent)=>parent.size).filter(Boolean).join("، "),weightKg:row.weightKg,stage:"FREEZE_DRIED",zone:"PACKAGING",currentLocation:"PACKAGING",physicalLocation:"PACKAGING",currentState:"READY_FOR_PACKAGING",destination:"FREEZE_DRYING",operationalDestination:"FREEZE_DRYING",nextZone:"PACKAGING",nextAction:"در انتظار بسته‌بندی تک‌به‌تک",containerCode:"",trays:[],allocated:false,consumed:false,blocked:false,remainderForPackaging:true,freezeDryOutputSessionId:sessionId,cycleId};next.items.push(item);lockedIds.push(id)})
      parents.forEach((item)=>{item.consumed=true;item.stage="CONSUMED";item.currentState="FREEZE_DRY_OUTPUT_GRADED";item.weightKg=0;item.containerCode="";item.trays=[];item.nextZone=null;item.nextAction="خروج فریزدرای تفکیک شد"})
      cycle.status="COMPLETED";cycle.completedAt=new Date().toISOString();cycle.outputIds=lockedIds
      pwEvent(next,"قفل تفکیک خروج فریزدرای",sessionId,{cycleId,inputWeightKg,totalOutputKg,processLossKg:pwNumber(inputWeightKg-totalOutputKg),outputs:rows.map((row,index)=>({id:lockedIds[index],...row}))})
    })
    if(lockedIds.length){setFreezeDryGradeRows([{id:1,grade:"A",weightKg:""}]);setFreezeDryPackagingSourceIds(lockedIds);setFreezeDryScaleMode("PACKAGING")}
  }
  const packageOneFreezeDryUnit=()=>{
    let survivingIds:string[]=[],completed=false
    execute("بسته فریزدرای توزین شد؛ شناسه و برچسب همان بسته چاپ شد.",(next)=>{
      const sources=freezeDryPackagingSourceIds.map((id)=>next.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[]
      if(!sources.length||sources.length!==freezeDryPackagingSourceIds.length)throw Error("حداقل یک خروجی فریزدرای گریدشده انتخاب کنید.")
      sources.forEach((item)=>{pwUsable(next,item);if(item.stage!=="FREEZE_DRIED"||item.nextZone!=="PACKAGING")throw Error("فقط خروجی فریزدرای قفل‌شده قابل بسته‌بندی است.")})
      if(sources.some((item)=>item.product!==sources[0].product||item.grade!==sources[0].grade))throw Error("برای یک بسته فقط موجودی هم‌محصول و هم‌گرید را ترکیب کنید.")
      const pouch=PW_DRY_POUCHES.find((row)=>row.code===freezeDryPouchCode),absorber=PW_DRY_ABSORBERS.find((row)=>row.code===freezeDryAbsorberCode),netWeightKg=pwNumber(freezeDryPackageScaleKg)
      if(!pouch||!absorber||!(netWeightKg>0))throw Error("پاکت، رطوبت‌گیر یا وزن آنلاین بسته معتبر نیست.")
      const availableWeightKg=pwNumber(sources.reduce((sum,item)=>sum+item.weightKg,0))
      if(availableWeightKg<netWeightKg)throw Error("موجودی انتخاب‌شده برای این بسته کافی نیست.")
      const contributions=pwProportionalParentContributions(sources.map((item)=>({code:item.id,gross:item.weightKg,tare:0})),netWeightKg,{})
      contributions.forEach((part:any)=>{const source=sources.find((item)=>item.id===part.batchId)!;source.weightKg=pwNumber(source.weightKg-part.inputWeightKg);if(source.weightKg<=0.0005){source.weightKg=0;source.consumed=true;source.stage="CONSUMED";source.currentState="CONSUMED_BY_PACKAGING";source.nextZone=null;source.nextAction="در بسته‌بندی مصرف شد"}else survivingIds.push(source.id)})
      const id=pwId(next,"PKG"),packagingSessionId=pwId(next,"FPK"),tareWeightGrams=pouch.tareWeightGrams+absorber.weightGrams,grossWeightGrams=Math.round(netWeightKg*1000+tareWeightGrams),packaged:PWItem={id,code:id,batchCode:packagingSessionId,parentId:sources.map((item)=>item.id).join(","),parentIds:sources.map((item)=>item.id),parentContributions:contributions.map((part:any)=>({id:part.batchId,weightKg:part.inputWeightKg})),inputCodes:sources.flatMap((item)=>item.inputCodes||[]),product:sources[0].product,grade:sources[0].grade,size:`${Math.round(netWeightKg*1000)} g`,weightKg:netWeightKg,stage:"PACKAGED",zone:"PACKAGING",currentLocation:"PACKAGING",physicalLocation:"PACKAGING",currentState:"FINISHED_PACKAGE",destination:null,operationalDestination:"FREEZE_DRYING",nextZone:null,nextAction:"آماده انبار محصول نهایی",containerCode:"",trays:[],allocated:false,consumed:false,blocked:false,packagingSessionId,packageUnitWeightGrams:Math.round(netWeightKg*1000),pouchCode:pouch.code,pouchTareWeightGrams:pouch.tareWeightGrams,moistureAbsorberCode:absorber.code,moistureAbsorberWeightGrams:absorber.weightGrams,grossWeightGrams,labelPrintedAt:new Date().toISOString()};next.items.push(packaged);pwEvent(next,"توزین، چاپ برچسب و بستن بسته فریزدرای",id,{sourceIds:sources.map((item)=>item.id),netWeightKg,pouchCode:pouch.code,moistureAbsorberCode:absorber.code,grossWeightGrams,labelPrinted:true});completed=true
    })
    if(completed)setFreezeDryPackagingSourceIds([...new Set(survivingIds)])
  }
  const closeFreezeDryPackaging=()=>{
    let completed=false
    execute("نشست بسته‌بندی فریزدرای بسته شد و مانده برای نوبت بعد ثبت شد.",(next)=>{
      const sources=freezeDryPackagingSourceIds.map((id)=>next.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[],remainingKg=pwNumber(sources.reduce((sum,item)=>sum+item.weightKg,0))
      if(!sources.length)throw Error("خروجی بازی برای بستن نشست وجود ندارد.")
      if(remainingKg>0&&!freezeDryRemainderCode)throw Error("برای مانده محصول، QR سبد را اسکن کنید.")
      let carrier:any=null
      if(remainingKg>0){carrier=pwCarrier(freezeDryRemainderCode,"basket");pwFreeCarrier(next,carrier.code);if(remainingKg>carrier.capacityKg)throw Error("مانده بیشتر از ظرفیت سبد است.")}
      const first=sources[0],parentIds=sources.map((item)=>item.id),parentContributions=sources.map((item)=>({id:item.id,weightKg:item.weightKg}))
      sources.forEach((item)=>{item.consumed=true;item.stage="CONSUMED";item.currentState="PACKAGING_SESSION_CLOSED";item.weightKg=0;item.nextZone=null;item.nextAction="نشست بسته‌بندی بسته شد"})
      if(remainingKg>0){const id=pwId(next,"B"),remainder:PWItem={id,code:id,batchCode:id,parentId:parentIds.join(","),parentIds,parentContributions,inputCodes:sources.flatMap((item)=>item.inputCodes||[]),product:first.product,grade:first.grade,size:first.size,weightKg:remainingKg,stage:"FREEZE_DRIED",zone:"COLD_ROOM_POSITIVE_CLEAN",currentLocation:"COLD_ROOM_POSITIVE_CLEAN",physicalLocation:"COLD_ROOM_POSITIVE_CLEAN",currentState:"AVAILABLE",destination:"FREEZE_DRYING",operationalDestination:"FREEZE_DRYING",nextZone:"PACKAGING",nextAction:"مانده فریزدرای؛ در انتظار بسته‌بندی بعدی",containerCode:carrier.code,trays:[],allocated:false,consumed:false,blocked:false,remainderForPackaging:true};next.items.push(remainder);pwEvent(next,"ثبت مانده محصول فریزدرای",id,{sourceIds:parentIds,containerCode:carrier.code,weightKg:remainingKg})}
      completed=true
    })
    if(completed){setFreezeDryPackagingSourceIds([]);setFreezeDryRemainderCode("")}
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
      const measured=Number(data.get("weight")),packageCode=String(data.get("packageCode")||"").trim().toUpperCase(),weightDifferenceReason=String(data.get("weightDifferenceReason")||"").trim()
      if(!Number.isFinite(measured)||!(measured>0)) throw Error("وزن خروجی باید مثبت باشد.")
      const weightDeltaKg=pwNumber(measured-item.weightKg)
      if(type==="FREEZE"&&Math.abs(weightDeltaKg)>0.0005&&!weightDifferenceReason) throw Error("برای افزایش یا کاهش وزن، علت اختلاف را ثبت کنید.")
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
      pwEvent(next,type==="FREEZE"?"ثبت خروج از فریز":"ثبت خروج از خشک‌کن",item.code,{beforeWeightKg:before,outputWeightKg:item.weightKg,weightDeltaKg,weightDifferenceReason:weightDifferenceReason||null,packageCode:packageCode||null,nextZone:item.nextZone})
    })
  }
  const cycleType = tab==="FREEZE_DRY_ENTRY"||tab==="FREEZE_DRY_EXIT" ? "FREEZE_DRY" : ""
  const cycleEligible = live.filter(
    (item) =>
      !pwBusy(ledger, item) &&
      !item.blocked &&
      (cycleType === "FREEZE_DRY"
          ? (item.stage === "FROZEN" && (item.zone === "FREEZE_DRYING" || item.nextZone === "FREEZE_DRYING")) || (item.destination==="FREEZE_DRYING"&&item.stage==="SLICED"&&item.nextZone==="FREEZING"&&item.physicalLocation==="COLD_ROOM_NEGATIVE")
          : false),
  )
  const freezeOutputEligible=live.filter(item=>!pwBusy(ledger,item)&&!item.blocked&&item.nextZone==="FREEZING"&&["WASHED","SLICED"].includes(item.stage))
  const dryOutputEligible=live.filter(item=>!pwBusy(ledger,item)&&!item.blocked&&item.nextZone==="DRYING"&&item.stage==="SLICED"&&item.destination==="DRYING")
  const dryPackagingEligible=live.filter(item=>!pwBusy(ledger,item)&&!item.blocked&&item.stage==="DRIED"&&item.nextZone==="PACKAGING"&&item.remainderForPackaging)
  const dryPreparedPackages=live.filter(item=>item.stage==="PACKAGED"&&item.operationalDestination==="DRYING"&&item.packagingSessionId)
  const freezeDryPackagingEligible=live.filter(item=>!pwBusy(ledger,item)&&!item.blocked&&item.stage==="FREEZE_DRIED"&&item.nextZone==="PACKAGING"&&item.remainderForPackaging)
  const freezeDryPreparedPackages=live.filter(item=>item.stage==="PACKAGED"&&item.operationalDestination==="FREEZE_DRYING"&&item.packagingSessionId)
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
          <h1 style={{fontSize:25,margin:0,display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}><span>میز کار تولید</span>{tab!=="overview"&&<><span style={{color:"#a8b8b2",fontWeight:400}}>—</span><span style={{fontSize:17,color:"#176b50",fontWeight:800}}>{tabs.find(([id])=>id===tab)?.[1]}</span></>}</h1>
        </div>
        <button type="button" onClick={()=>setResetArmed(true)} style={{border:"1px solid #c85b5b",background:"#fff7f7",color:"#a43838",borderRadius:10,padding:"10px 14px",fontWeight:800,cursor:"pointer"}}>↺ بازنشانی سناریوی آزمایشی</button>
      </div>
      {resetArmed&&<div role="alertdialog" aria-label="تأیید بازنشانی سناریوی آزمایشی" style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:16,padding:"12px 14px",border:"1px solid #e3b0b0",background:"#fff7f7",borderRadius:12,fontSize:12}}><span><b>همه عملیات سورت، شست‌وشو و تولید این سناریو پاک شود؟</b><small style={{display:"block",color:"#718079",marginTop:3}}>محموله ۱۵۰ کیلویی و ۷ سبد اولیه برمی‌گردد؛ کاربران، تنظیمات پایه و فهرست کانتینرها حفظ می‌شوند.</small></span><span style={{display:"flex",gap:8}}><button type="button" onClick={()=>setResetArmed(false)} style={{border:"1px solid #cad7d1",background:"white",borderRadius:8,padding:"8px 12px",cursor:"pointer"}}>انصراف</button><button type="button" onClick={()=>{resetPrototypeOperationalScenario();setLedger(pwEmpty());setTab("overview");setChosen("");setNotice("سناریوی آزمایشی به محموله اولیه ۱۵۰ کیلویی بازنشانی شد.");setError("");setResetArmed(false)}} style={{border:0,background:"#b84242",color:"white",borderRadius:8,padding:"8px 12px",fontWeight:800,cursor:"pointer"}}>بله، بازنشانی شود</button></span></div>}
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
            <div><small>نشست شست‌وشوی باز / قفل‌شده</small><b style={{display:"block",fontSize:24}}>{ledger.washSessions.filter((x:any)=>["DRAFT","ACTIVE","LOCKED"].includes(x.status)).length}</b></div>
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
        <div style={{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:20}}>
          <div style={pwBox}>
            <h2>ثبت ورود سبدها به اسلایس</h2>
            <PWNotice>سبدهای هم‌محصول، هم‌گرید و هم‌مقصد را اسکن کنید. سینی‌ها شناسه و QR جداگانه ندارند؛ فقط تعداد و وزن اجباری هر سینی ثبت می‌شود.</PWNotice>
            {!activeSliceSession&&<div style={{display:"flex",gap:8}}><input aria-label="اسکن سبد ورودی اسلایس" value={sliceScan} onChange={(event)=>setSliceScan(event.target.value)} onKeyDown={(event)=>{if(event.key==="Enter"){event.preventDefault();scanSliceInput(sliceScan)}}} style={{...pwInput,flex:1,fontFamily:"monospace"}} placeholder="اسکن QR سبد"/><PWButton secondary onClick={()=>setSliceScanOpen(true)}>⌗ شبیه‌ساز اسکن</PWButton><PWButton disabled={!sliceScan} onClick={()=>scanSliceInput(sliceScan)}>افزودن</PWButton></div>}
            <ScanSimulator open={sliceScanOpen} title="اسکن سبد ورودی اسلایس" suggestedCode={sliceEligible.find((item)=>!sliceInputIds.includes(item.id))?.containerCode||""} onClose={()=>setSliceScanOpen(false)} onScan={scanSliceInput}/>
            {activeSliceSession&&<PWNotice>نشست <b>{activeSliceSession.id}</b> قفل و ذخیره شده است. خروج از صفحه یا رفرش، سبدها را از وضعیت «داخل اسلایس» خارج نمی‌کند.</PWNotice>}
            <div style={{marginTop:14,border:"1px solid #d8e4df",borderRadius:10,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:".35fr .8fr 1fr .7fr .9fr .9fr .35fr",gap:6,padding:9,background:"#eef4f1",fontSize:11,fontWeight:800}}><span>#</span><span>سبد</span><span>محصول / گرید</span><span>وزن ورودی</span><span>مقصد بعدی</span><span>مقصد نهایی</span><span></span></div>{selectedSliceItems.map((item,index)=><div key={item.id} style={{display:"grid",gridTemplateColumns:".35fr .8fr 1fr .7fr .9fr .9fr .35fr",gap:6,padding:10,borderTop:"1px solid #e1eae6",fontSize:12,alignItems:"center"}}><span>{index+1}</span><b style={{fontFamily:"monospace"}}>{item.containerCode}</b><span>{item.product} / {item.grade}</span><b>{item.weightKg.toFixed(3)} kg</b><span>{PW_ZONES[item.nextZone||"SLICING"]||item.nextZone||"اسلایس"}</span><b>{PW_ZONES[pwWashDestination(item)]||pwWashDestination(item)}</b>{activeSliceSession?<b style={{color:"#176b50"}}>قفل</b>:<button type="button" onClick={()=>setSliceInputIds(sliceInputIds.filter((id)=>id!==item.id))} style={{border:0,background:"transparent",color:"#c23d3d"}}>حذف</button>}</div>)}</div>
            {!activeSliceSession&&<div style={{marginTop:12}}><PWButton disabled={!sliceInputIds.length} onClick={lockSlicingInputs}>ثبت ورود و قفل نشست اسلایس</PWButton></div>}
          </div>
          <form onSubmit={completeSlicing} style={pwBox}>
            <h2>ثبت گروه‌های سینی</h2>
            <PWNotice>برای سینی‌های هم‌وزن فقط یک ردیف ثبت کنید؛ مثلاً ۱۸ سینی × ۲٫۵ کیلو. سینی‌های آخر با وزن متفاوت در ردیف جدا ثبت می‌شوند.</PWNotice>
            <div style={{border:"1px solid #d8e4df",borderRadius:10,overflow:"hidden",marginBottom:12}}><div style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1fr .4fr",gap:8,padding:9,background:"#eef4f1",fontSize:11,fontWeight:800}}><span>#</span><span>تعداد سینی</span><span>وزن هر سینی</span><span>جمع ردیف</span><span></span></div>{sliceTrayGroups.map((row,index)=><div key={row.id} style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1fr .4fr",gap:8,padding:9,borderTop:"1px solid #e1eae6",alignItems:"center"}}><b>{index+1}</b><input aria-label={`تعداد سینی گروه ${index+1}`} type="number" min="1" max="100" step="1" value={row.count} onChange={(event)=>updateSliceTrayGroup(row.id,"count",event.target.value)} required style={pwInput}/><input aria-label={`وزن هر سینی گروه ${index+1}`} type="number" min="0.001" step="0.001" value={row.unitWeightKg} onChange={(event)=>updateSliceTrayGroup(row.id,"unitWeightKg",event.target.value)} required style={pwInput}/><b>{pwNumber((Number(row.count)||0)*(Number(row.unitWeightKg)||0)).toFixed(3)} kg</b><button type="button" disabled={sliceTrayGroups.length===1} onClick={()=>removeSliceTrayGroup(row.id)} style={{border:0,background:"transparent",color:"#c23d3d"}}>حذف</button></div>)}</div>
            <PWButton secondary onClick={addSliceTrayGroup}>＋ افزودن ردیف با وزن متفاوت</PWButton>
            <div style={{marginTop:16,padding:14,border:"1px solid #d8e4df",borderRadius:10,background:"#fafcfb"}}><h3 style={{margin:"0 0 6px"}}>مانده‌بار برگشتی به سردخانه (اختیاری)</h3><p style={{fontSize:11,color:"#718079",marginTop:0}}>اگر بخشی از محصول در سینی‌ها جا نشد، سبد مانده را روی باسکول بگذارید و QR آن را اسکن کنید؛ وزن پایدار لودسل خودکار ثبت می‌شود.</p><div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"end"}}><PWField label="QR سبد مانده"><input aria-label="QR سبد مانده اسلایس" value={sliceRemainderCode} onChange={(event)=>{setSliceRemainderCode(event.target.value);setSliceRemainderWeight("")}} onKeyDown={(event)=>{if(event.key==="Enter"){event.preventDefault();scanSliceRemainder(sliceRemainderCode)}}} style={{...pwInput,fontFamily:"monospace"}} placeholder="CTR-..."/></PWField><PWButton secondary onClick={()=>setSliceRemainderScanOpen(true)}>⌗ اسکن</PWButton></div><SlicingRemainderScaleConsole code={sliceRemainderCode} net={Number(sliceRemainderWeight||0)} tare={Number(pwCarriers().find((carrier:any)=>carrier.code===pwCode(sliceRemainderCode))?.tareWeightKg??pwCarriers().find((carrier:any)=>carrier.code===pwCode(sliceRemainderCode))?.tare??0)}/><ScanSimulator open={sliceRemainderScanOpen} title="اسکن سبد مانده اسلایس" suggestedCode={sliceRemainderCode||"CTR-008"} onClose={()=>setSliceRemainderScanOpen(false)} onScan={scanSliceRemainder}/></div>
            {(()=>{const inputTotal=selectedSliceItems.reduce((sum,item)=>sum+item.weightKg,0),trayTotal=sliceTrayGroups.reduce((sum,row)=>sum+(Number(row.count)||0)*(Number(row.unitWeightKg)||0),0),remainderTotal=Number(sliceRemainderWeight)||0,accountedTotal=trayTotal+remainderTotal,delta=pwNumber(accountedTotal-inputTotal);return <><PWNotice>وزن ورودی: <b>{inputTotal.toFixed(3)} kg</b> · سینی‌ها: <b>{trayTotal.toFixed(3)} kg</b> · مانده سبد: <b>{remainderTotal.toFixed(3)} kg</b> · اختلاف: <b>{delta.toFixed(3)} kg</b></PWNotice>{Math.abs(delta)>0.0005&&<PWField label="علت اختلاف وزن"><input name="differenceReason" value={sliceDifferenceReason} onChange={(event)=>setSliceDifferenceReason(event.target.value)} required style={pwInput}/></PWField>}</>})()}
            <label style={{display:"flex",gap:8,fontSize:12,margin:"10px 0"}}><input name="qualityCheckRequired" type="checkbox"/>نیازمند کنترل کیفیت در خروج اسلایس</label>
            <PWButton disabled={!activeSliceSession||!sliceTrayGroups.length||sliceTrayGroups.some((row)=>!(Number(row.count)>0)||!(Number(row.unitWeightKg)>0))||((!!sliceRemainderCode)!=(!!sliceRemainderWeight))}>ثبت پایان اسلایس، سینی‌ها و مانده‌بار</PWButton>
          </form>
        </div>
      )}
      {/* Legacy dry-packaging draft retained temporarily for reference; the active flow below separates grade locking from per-package weighing.
      {tab === "DRY" && (()=>{
        const selected=dryOutputEligible.find((item)=>item.id===chosen),compatibleCarryovers=dryCarryoverEligible.filter((item)=>!selected||item.product===selected.product),selectedCarryovers=compatibleCarryovers.filter((item)=>dryCarryoverIds.includes(item.id)),newDryWeightKg=Number(dryScaleWeight)||0,carryoverWeightKg=selectedCarryovers.reduce((sum,item)=>sum+item.weightKg,0),availableWeightKg=pwNumber(newDryWeightKg+carryoverWeightKg),packagedWeightKg=pwNumber(dryPackageRows.reduce((sum,row)=>sum+((Number(row.count)||0)*(Number(row.unitWeightGrams)||0))/1000,0)),remainderWeightKg=Number(dryRemainderWeight)||0,balanceKg=pwNumber(availableWeightKg-packagedWeightKg-remainderWeightKg),grades=[...new Set([selected?.grade,...selectedCarryovers.map((item)=>item.grade)].filter(Boolean))] as string[]
        return <div style={{display:"grid",gap:16}}>
          <div style={{...pwBox,maxWidth:1240,margin:"0 auto",width:"100%"}}><h2>ثبت خروج از خشک‌کن و بسته‌بندی</h2><PWNotice>محصول خشک‌شده جدید می‌تواند با مانده سازگار از تولید قبلی در یک نشست بسته‌بندی ترکیب شود. هر بسته و مانده، سهم همه بچ‌های والد را حفظ می‌کند.</PWNotice>
            {!dryOutputEligible.length?<PWEmpty>محصول جدیدی برای خروج از خشک‌کن آماده نیست.</PWEmpty>:<form onSubmit={finishDryPackaging}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"start"}}>
                <div style={{display:"grid",gap:12}}><PWField label="محصول جدید خروجی خشک‌کن"><select required value={chosen} onChange={(event)=>{const id=event.target.value,item=dryOutputEligible.find((row)=>row.id===id);setChosen(id);setDryScaleWeight(item?String(item.weightKg):"");setDryCarryoverIds([]);setDryPackageRows([{id:1,count:"1",unitWeightGrams:"100",grade:item?.grade||""}]);setDryRemainderCode("");setDryRemainderWeight("")}} style={pwInput}><option value="">انتخاب بچ…</option>{dryOutputEligible.map((item)=><option key={item.id} value={item.id}>{item.batchCode||item.code} · {item.product} · {item.grade} · وزن پیش از خشک‌کردن {item.weightKg.toFixed(3)} kg</option>)}</select></PWField>{selected&&summary(selected)}<PWField label="وزن پایدار خوانده‌شده از باسکول (kg)"><input aria-label="وزن باسکول خروج خشک‌کن" type="number" min="0.001" step="0.001" value={dryScaleWeight} onChange={(event)=>setDryScaleWeight(event.target.value)} required style={pwInput}/></PWField><div style={{border:"1px solid #d8e4df",borderRadius:11,padding:12}}><b style={{fontSize:12}}>مانده‌های بسته‌بندی‌نشده تولید قبل</b><p style={{fontSize:11,color:"#718079"}}>فقط مانده همان محصول نمایش داده می‌شود؛ انتخاب چند مورد مجاز است.</p>{!compatibleCarryovers.length?<small style={{color:"#718079"}}>مانده سازگاری وجود ندارد.</small>:compatibleCarryovers.map((item)=><label key={item.id} style={{display:"flex",justifyContent:"space-between",gap:8,padding:"9px 0",borderTop:"1px solid #e1eae6",fontSize:12}}><span><input type="checkbox" checked={dryCarryoverIds.includes(item.id)} onChange={(event)=>setDryCarryoverIds((current)=>event.target.checked?[...current,item.id]:current.filter((id)=>id!==item.id))}/> <b className="font-mono">{item.containerCode}</b> · {item.grade}</span><b>{item.weightKg.toFixed(3)} kg</b></label>)}</div></div>
                <div style={{display:"grid",gap:12}}><WashingScaleConsole mode="EXIT" code={selected?.code} net={newDryWeightKg} previousNet={selected?.weightKg||0} tare={0} onRead={()=>{}}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><PWNotice>خروج جدید<br/><b>{newDryWeightKg.toFixed(3)} kg</b></PWNotice><PWNotice>مانده قبلی<br/><b>{carryoverWeightKg.toFixed(3)} kg</b></PWNotice><PWNotice>کل قابل بسته‌بندی<br/><b>{availableWeightKg.toFixed(3)} kg</b></PWNotice></div></div>
              </div>
              <div style={{marginTop:16,border:"1px solid #d8e4df",borderRadius:12,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1fr 1fr .4fr",gap:8,padding:10,background:"#eef4f1",fontSize:11,fontWeight:800}}><span>#</span><span>تعداد بسته</span><span>وزن هر بسته (گرم)</span><span>گرید روی بسته</span><span>جمع ردیف</span><span></span></div>{dryPackageRows.map((row,index)=><div key={row.id} style={{display:"grid",gridTemplateColumns:".4fr 1fr 1fr 1fr 1fr .4fr",gap:8,padding:10,borderTop:"1px solid #e1eae6",alignItems:"center"}}><b>{index+1}</b><input aria-label={`تعداد بسته ردیف ${index+1}`} type="number" min="1" max="500" step="1" value={row.count} onChange={(event)=>updateDryPackageRow(row.id,"count",event.target.value)} style={pwInput}/><input aria-label={`وزن بسته ردیف ${index+1}`} type="number" min="1" step="1" value={row.unitWeightGrams} onChange={(event)=>updateDryPackageRow(row.id,"unitWeightGrams",event.target.value)} style={pwInput}/><select aria-label={`گرید بسته ردیف ${index+1}`} value={row.grade||selected?.grade||""} onChange={(event)=>updateDryPackageRow(row.id,"grade",event.target.value)} style={pwInput}>{(grades.length?grades:[selected?.grade||""]).map((grade)=><option key={grade}>{grade}</option>)}</select><b>{pwNumber((Number(row.count)||0)*(Number(row.unitWeightGrams)||0)/1000).toFixed(3)} kg</b><button type="button" disabled={dryPackageRows.length===1} onClick={()=>removeDryPackageRow(row.id)} style={{border:0,background:"transparent",color:"#b84242"}}>حذف</button></div>)}</div><PWButton secondary onClick={addDryPackageRow}>＋ افزودن ردیف با وزن متفاوت</PWButton>
              <div style={{marginTop:16,padding:14,border:"1px solid #d8e4df",borderRadius:12,background:"#fafcfb"}}><h3 style={{margin:"0 0 5px"}}>مانده برای بسته‌بندی بعدی</h3><p style={{fontSize:11,color:"#718079",marginTop:0}}>اگر محصول باقی ماند، سبد آزاد را اسکن و وزن مانده را ثبت کنید؛ این مانده در نوبت بعد قابل ترکیب است.</p><div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"end"}}><PWField label="QR سبد مانده"><input value={dryRemainderCode} onChange={(event)=>setDryRemainderCode(event.target.value)} style={{...pwInput,fontFamily:"monospace"}} placeholder="CTR-..."/></PWField><PWButton secondary onClick={()=>setDryRemainderScanOpen(true)}>⌗ شبیه‌ساز اسکن</PWButton><PWField label="وزن خالص مانده (kg)"><input type="number" min="0.001" step="0.001" value={dryRemainderWeight} onChange={(event)=>setDryRemainderWeight(event.target.value)} style={pwInput}/></PWField></div><ScanSimulator open={dryRemainderScanOpen} title="اسکن سبد مانده محصول خشک" suggestedCode={dryRemainderCode||"CTR-008"} onClose={()=>setDryRemainderScanOpen(false)} onScan={setDryRemainderCode}/></div>
              <div style={{marginTop:14,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}><PWNotice>کل موجودی<br/><b>{availableWeightKg.toFixed(3)} kg</b></PWNotice><PWNotice>بسته‌شده<br/><b>{packagedWeightKg.toFixed(3)} kg</b></PWNotice><PWNotice>مانده سبد<br/><b>{remainderWeightKg.toFixed(3)} kg</b></PWNotice><div style={{padding:12,borderRadius:10,background:Math.abs(balanceKg)<0.0005?"#e3f5ec":"#fbe7e7",color:Math.abs(balanceKg)<0.0005?"#176b50":"#a43838",fontSize:12}}>تراز نشست<br/><b>{balanceKg.toFixed(3)} kg</b></div></div>
              <label style={{display:"flex",gap:8,alignItems:"center",fontSize:12,margin:"12px 0"}}><input name="qualityCheckRequired" type="checkbox"/>نیازمند کنترل کیفیت در خروج این مرحله</label><PWButton disabled={!selected||!(newDryWeightKg>0)||Math.abs(balanceKg)>0.0005||((!!dryRemainderCode)!=(!!dryRemainderWeight))}>ساخت بسته‌ها، چاپ شناسه و بستن نشست</PWButton>
            </form>}
          </div>
          <div style={{...pwBox,maxWidth:1240,margin:"0 auto",width:"100%"}}><h3 style={{marginTop:0}}>لیست بسته‌های آماده‌شده</h3>{!dryPreparedPackages.length?<PWEmpty>هنوز بسته‌ای از خروج خشک‌کن ساخته نشده است.</PWEmpty>:<div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",padding:10,background:"#eef4f1",fontSize:11,fontWeight:800}}><span>شناسه بسته</span><span>نشست</span><span>محصول / گرید</span><span>وزن</span><span>والدها</span></div>{dryPreparedPackages.slice().reverse().map((item)=><div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",padding:10,borderTop:"1px solid #e1eae6",fontSize:12}}><b className="font-mono">{item.code}</b><span className="font-mono">{item.packagingSessionId}</span><span>{item.product} / {item.grade}</span><b>{item.weightKg.toFixed(3)} kg</b><span>{item.parentIds?.length||1} بچ والد</span></div>)}</div>}</div>
        </div>
      })()}
      */}
      {tab === "DRY" && (()=>{
        const selected=dryOutputEligible.find((item)=>item.id===chosen)
        const totalGradedKg=pwNumber(dryGradeRows.reduce((sum,row)=>sum+(Number(row.weightKg)||0),0))
        const processLossKg=pwNumber((selected?.weightKg||0)-totalGradedKg)
        const selectedSources=dryPackagingEligible.filter((item)=>dryPackagingSourceIds.includes(item.id))
        const packagingBase=selectedSources[0]
        const availableWeightKg=pwNumber(selectedSources.reduce((sum,item)=>sum+item.weightKg,0))
        const pouch=PW_DRY_POUCHES.find((row)=>row.code===dryPouchCode)||PW_DRY_POUCHES[0]
        const absorber=PW_DRY_ABSORBERS.find((row)=>row.code===dryAbsorberCode)||PW_DRY_ABSORBERS[0]
        const packageNetKg=pwNumber(dryPackageScaleKg)
        const packageTareKg=pwNumber((pouch.tareWeightGrams+absorber.weightGrams)/1000)
        const packageGrossKg=pwNumber(packageNetKg+packageTareKg)
        return <div style={{display:"grid",gap:16,maxWidth:1320,margin:"0 auto",width:"100%"}}>
          <div style={pwBox}>
            <h2 style={{marginTop:0}}>خروج خشک‌کن و بسته‌بندی</h2>
            <PWNotice>ابتدا خروج خشک‌کن را به گریدهای نهایی تفکیک و قفل کنید. سپس هر پاکت را جداگانه روی باسکول وزن کنید، برچسب بزنید و ببندید. مانده سازگار تولید قبل نیز می‌تواند در همان بسته‌بندی مصرف شود.</PWNotice>
            <div style={{margin:"12px 0",padding:10,border:"1px solid #cfe0d9",borderRadius:12,background:"#edf7f2"}}><b style={{fontSize:12}}>باسکول مشترک · حالت فعال: {dryScaleMode==="GRADING"?`تفکیک خروج خشک‌کن${selected?` — ${selected.batchCode||selected.code}`:""}`:`بسته‌بندی تک‌به‌تک${packagingBase?` — ${packagingBase.product} / ${packagingBase.grade}`:""}`}</b><WashingScaleConsole mode="EXIT" code={dryScaleMode==="GRADING"?selected?.code:packagingBase?.code} net={dryScaleMode==="GRADING"?totalGradedKg:packageNetKg} previousNet={dryScaleMode==="GRADING"?(selected?.weightKg||0):0} tare={dryScaleMode==="GRADING"?0:packageTareKg} netOnly={dryScaleMode==="GRADING"} onSimulate={dryScaleMode==="GRADING"?(weight)=>{const first=dryGradeRows[0];if(first)updateDryGradeRow(first.id,"weightKg",weight.toFixed(3))}:setDryPackageScaleKg} testWeights={dryScaleMode==="GRADING"?[5,10,15]:[0.1,0.25,0.5]}/></div>
            <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:18,alignItems:"start"}}>
              <section style={{border:"1px solid #d8e4df",borderRadius:14,padding:16,background:"#fff"}}>
                <h3 style={{marginTop:0}}>۱. تفکیک و قفل خروج خشک‌کن</h3>
                {!dryOutputEligible.length?<PWEmpty>محصولی برای ثبت خروج از خشک‌کن آماده نیست.</PWEmpty>:<form onSubmit={lockDryOutput}>
                  <PWField label="محصول ورودی خشک‌کن"><select required value={chosen} onChange={(event)=>{setChosen(event.target.value);setDryGradeRows([{id:1,grade:"A",weightKg:""}]);setDryScaleMode("GRADING")}} style={pwInput}><option value="">انتخاب بچ…</option>{dryOutputEligible.map((item)=><option key={item.id} value={item.id}>{item.batchCode||item.code} · {item.product} · {item.grade} · {item.weightKg.toFixed(3)} kg</option>)}</select></PWField>
                  {selected&&summary(selected)}
                  <div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden",marginTop:12}}>
                    <div style={{display:"grid",gridTemplateColumns:".35fr 1fr 1fr .35fr",gap:8,padding:10,background:"#eef4f1",fontSize:11,fontWeight:800}}><span>#</span><span>گرید نهایی</span><span>وزن خروجی (kg)</span><span></span></div>
                    {dryGradeRows.map((row,index)=><div key={row.id} style={{display:"grid",gridTemplateColumns:".35fr 1fr 1fr .35fr",gap:8,padding:10,borderTop:"1px solid #e1eae6",alignItems:"center"}}><b>{index+1}</b><select aria-label={`گرید نهایی خروجی ${index+1}`} value={row.grade} onChange={(event)=>updateDryGradeRow(row.id,"grade",event.target.value)} style={pwInput}>{["A++","A+","A","B","Industrial"].map((grade)=><option key={grade}>{grade}</option>)}</select><input aria-label={`وزن خروجی گرید ${index+1}`} type="number" min="0.001" step="0.001" value={row.weightKg} onChange={(event)=>updateDryGradeRow(row.id,"weightKg",event.target.value)} required style={pwInput}/><button type="button" disabled={dryGradeRows.length===1} onClick={()=>removeDryGradeRow(row.id)} style={{border:0,background:"transparent",color:"#b84242"}}>حذف</button></div>)}
                  </div>
                  <div style={{margin:"10px 0"}}><PWButton secondary onClick={addDryGradeRow}>＋ افزودن گرید خروجی</PWButton></div>
                  <PWNotice>با انتخاب این بچ، باسکول مشترک به حالت تفکیک خروج خشک‌کن می‌رود و وزن آزمایشی روی ردیف گرید فعال ثبت می‌شود.</PWNotice>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"12px 0"}}><PWNotice>ورود خشک‌کن<br/><b>{(selected?.weightKg||0).toFixed(3)} kg</b></PWNotice><PWNotice>خروج تفکیک‌شده<br/><b>{totalGradedKg.toFixed(3)} kg</b></PWNotice><PWNotice>افت فرآیند<br/><b>{processLossKg.toFixed(3)} kg</b></PWNotice></div>
                  <PWButton disabled={!selected||!(totalGradedKg>0)||processLossKg<0}>قفل خروجی‌ها و ارسال به بسته‌بندی</PWButton>
                </form>}
              </section>
              <section style={{border:"1px solid #d8e4df",borderRadius:14,padding:16,background:"#fff"}}>
                <h3 style={{marginTop:0}}>۲. توزین و بسته‌بندی تک‌به‌تک</h3>
                <p style={{fontSize:12,color:"#657770"}}>بچ‌های هم‌محصول و هم‌گرید، از تولید جدید یا مانده قبلی، قابل انتخاب هم‌زمان هستند.</p>
                {!dryPackagingEligible.length?<PWEmpty>هنوز خروجی گریدشده‌ای برای بسته‌بندی قفل نشده است.</PWEmpty>:<div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden",marginBottom:12}}>{dryPackagingEligible.map((item)=>{const incompatible=!!packagingBase&&(item.product!==packagingBase.product||item.grade!==packagingBase.grade);return <label key={item.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:9,padding:10,borderTop:"1px solid #e1eae6",alignItems:"center",opacity:incompatible?.45:1}}><input type="checkbox" disabled={incompatible} checked={dryPackagingSourceIds.includes(item.id)} onChange={(event)=>{setDryPackagingSourceIds((current)=>event.target.checked?[...current,item.id]:current.filter((id)=>id!==item.id));if(event.target.checked)setDryScaleMode("PACKAGING")}}/><span><b className="font-mono">{item.batchCode||item.code}</b> · {item.product} / {item.grade}</span><b>{item.weightKg.toFixed(3)} kg</b></label>})}</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><PWField label="پاکت متالایز"><select value={dryPouchCode} onChange={(event)=>{const code=event.target.value;setDryPouchCode(code);const next=PW_DRY_POUCHES.find((row)=>row.code===code);if(next)setDryPackageScaleKg(next.fillWeightGrams/1000);setDryScaleMode("PACKAGING")}} style={pwInput}>{PW_DRY_POUCHES.map((row)=><option key={row.code} value={row.code}>{row.name} · موجودی {row.stock} · وزن ظرف {row.tareWeightGrams} g</option>)}</select></PWField><PWField label="رطوبت‌گیر"><select value={dryAbsorberCode} onChange={(event)=>{setDryAbsorberCode(event.target.value);setDryScaleMode("PACKAGING")}} style={pwInput}>{PW_DRY_ABSORBERS.map((row)=><option key={row.code} value={row.code}>{row.name}{row.weightGrams?` · ${row.weightGrams} g · موجودی ${row.stock}`:""}</option>)}</select></PWField></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"12px 0"}}><PWNotice>وزن خالص آنلاین<br/><b>{Math.round(packageNetKg*1000)} g</b></PWNotice><PWNotice>پاکت + رطوبت‌گیر<br/><b>{pouch.tareWeightGrams+absorber.weightGrams} g</b></PWNotice><PWNotice>وزن ناخالص<br/><b>{Math.round(packageGrossKg*1000)} g</b></PWNotice></div>
                <PWNotice>موجودی انتخاب‌شده: <b>{availableWeightKg.toFixed(3)} kg</b> · هر بار ثبت، فقط یک بسته را می‌سازد و برچسب همان بسته را چاپ می‌کند.</PWNotice>
                <PWButton disabled={!selectedSources.length||availableWeightKg<packageNetKg} onClick={packageOneDryUnit}>ثبت این بسته، چاپ برچسب و بستن</PWButton>
                <div style={{marginTop:16,padding:13,border:"1px solid #d8e4df",borderRadius:11,background:"#fafcfb"}}><h4 style={{margin:"0 0 5px"}}>بستن نشست و ثبت مانده</h4><p style={{fontSize:11,color:"#718079"}}>اگر محصول باقی ماند، یک سبد آزاد اسکن کنید تا مانده برای بسته‌بندی بعدی به سردخانه تمیز برگردد.</p><div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"end"}}><PWField label="QR سبد مانده"><input value={dryRemainderCode} onChange={(event)=>setDryRemainderCode(event.target.value)} style={{...pwInput,fontFamily:"monospace"}} placeholder="CTR-..."/></PWField><PWButton secondary onClick={()=>setDryRemainderScanOpen(true)}>⌗ اسکن سبد</PWButton></div><ScanSimulator open={dryRemainderScanOpen} title="اسکن سبد مانده محصول خشک" suggestedCode={dryRemainderCode||"CTR-008"} onClose={()=>setDryRemainderScanOpen(false)} onScan={setDryRemainderCode}/><div style={{marginTop:10}}><PWButton secondary disabled={!selectedSources.length||(!dryRemainderCode&&availableWeightKg>0)} onClick={closeDryPackaging}>بستن نشست و ثبت مانده</PWButton></div></div>
              </section>
            </div>
          </div>
          <div style={pwBox}><h3 style={{marginTop:0}}>بسته‌های آماده‌شده</h3>{!dryPreparedPackages.length?<PWEmpty>هنوز بسته‌ای ساخته نشده است.</PWEmpty>:<div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden"}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",padding:10,background:"#eef4f1",fontSize:11,fontWeight:800}}><span>شناسه</span><span>محصول / گرید</span><span>پاکت</span><span>رطوبت‌گیر</span><span>خالص / ناخالص</span><span>برچسب</span></div>{dryPreparedPackages.slice().reverse().map((item)=><div key={item.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",padding:10,borderTop:"1px solid #e1eae6",fontSize:12}}><b className="font-mono">{item.code}</b><span>{item.product} / {item.grade}</span><span className="font-mono">{item.pouchCode}</span><span className="font-mono">{item.moistureAbsorberCode}</span><b>{item.weightKg.toFixed(3)} / {((item.grossWeightGrams||0)/1000).toFixed(3)} kg</b><span>{item.labelPrintedAt?"چاپ شد":"—"}</span></div>)}</div>}</div>
        </div>
      })()}
      {tab === "FREEZE" && (()=>{
        const rows=freezeOutputEligible
        const selected=rows.find(item=>item.id===chosen)
        const freezeDryContinuation=selected?.destination==="FREEZE_DRYING"
        return <div style={{...pwBox,maxWidth:900}}>
          <h2>ثبت خروج از فریز و بسته‌بندی</h2>
          <PWNotice>ورود به فریز قبلاً از مسیر شست‌وشو یا اسلایس مشخص شده است. اینجا فقط خروج محصول، وزن نهایی و بسته‌بندی ثبت می‌شود. محصول مسیر فریزدرای بدون بسته‌بندی به مرحله ورود فریزدرای می‌رود.</PWNotice>
          {!rows.length?<PWEmpty>محصول آماده خروج در این مرحله وجود ندارد.</PWEmpty>:<form onSubmit={event=>finishMachineOutput(event,"FREEZE")}>
            {batchPicker(rows,"محموله / نشست ورودی فریز")}
            {selected&&summary(selected)}
            <PWField label="وزن نهایی خروجی (kg)"><input name="weight" type="number" min="0.001" step="0.001" required style={pwInput}/></PWField>
            <PWField label="علت افزایش یا کاهش وزن (در صورت اختلاف)"><input name="weightDifferenceReason" placeholder="مثلاً جذب رطوبت، برفک یا افت فرایند" style={pwInput}/></PWField>
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
                        <input type="checkbox" name="items" value={item.id} checked={cycleEntryIds.includes(item.id)} onChange={(event)=>setCycleEntryIds((current)=>event.target.checked?[...current,item.id]:current.filter((id)=>id!==item.id))} />{" "}
                        {item.code} · {item.weightKg} kg ·{" "}
                        {item.containerCode ||
                          item.trays.map((t) => `سینی ${t.sequence} · ${t.quantityKg} kg`).join("، ")}
                      </label>
                    ))}
                  </div>
                </PWField>
                  <PWNotice>
                    تعداد سینی انتخابی: <b>{cycleEligible.filter((item)=>cycleEntryIds.includes(item.id)).reduce((sum,item)=>sum+(item.trays?.length||0),0)}</b> · وزن کل محاسبه‌شده: <b>{pwNumber(cycleEligible.filter((item)=>cycleEntryIds.includes(item.id)).reduce((sum,item)=>sum+item.weightKg,0)).toFixed(3)} kg</b><br/>
                    وزن از جمع داده ثبت‌شده بچ‌ها و سینی‌های انتخابی محاسبه می‌شود و اپراتور نیازی به ورود دوباره آن ندارد.
                  </PWNotice>
                <PWButton>ثبت ورود و ایجاد چرخه</PWButton>
              </form>
            )}
          </div>}
          {tab === "FREEZE_DRY_EXIT" && (()=>{
            const completingCycles=ledger.cycles.filter((cycle)=>cycle.type==="FREEZE_DRY"&&cycle.status==="COMPLETING"&&!cycle.demo),selectedCycle=completingCycles.find((cycle)=>cycle.id===freezeDryOutputCycleId)||completingCycles[0],cycleParents=(selectedCycle?.itemIds||[]).map((id:string)=>ledger.items.find((item)=>item.id===id)).filter(Boolean) as PWItem[],cycleInputKg=pwNumber(cycleParents.reduce((sum,item)=>sum+item.weightKg,0)),totalGradedKg=pwNumber(freezeDryGradeRows.reduce((sum,row)=>sum+(Number(row.weightKg)||0),0)),processLossKg=pwNumber(cycleInputKg-totalGradedKg)
            const selectedSources=freezeDryPackagingEligible.filter((item)=>freezeDryPackagingSourceIds.includes(item.id)),packagingBase=selectedSources[0],availableWeightKg=pwNumber(selectedSources.reduce((sum,item)=>sum+item.weightKg,0)),pouch=PW_DRY_POUCHES.find((row)=>row.code===freezeDryPouchCode)||PW_DRY_POUCHES[0],absorber=PW_DRY_ABSORBERS.find((row)=>row.code===freezeDryAbsorberCode)||PW_DRY_ABSORBERS[0],packageNetKg=pwNumber(freezeDryPackageScaleKg),packageTareKg=pwNumber((pouch.tareWeightGrams+absorber.weightGrams)/1000),packageGrossKg=pwNumber(packageNetKg+packageTareKg)
            return <div style={{...pwBox,marginBottom:18}}><h2 style={{marginTop:0}}>خروج فریزدرای و بسته‌بندی</h2><PWNotice>پس از پایان چرخه، خروج فریزدرای ابتدا به گریدهای نهایی تفکیک و قفل می‌شود؛ سپس موجودی هم‌محصول و هم‌گرید با همان باسکول، پاکت و رطوبت‌گیر به‌صورت تک‌به‌تک بسته‌بندی می‌شود.</PWNotice>
              <div style={{margin:"12px 0",padding:10,border:"1px solid #cfe0d9",borderRadius:12,background:"#edf7f2"}}><b style={{fontSize:12}}>باسکول مشترک · حالت فعال: {freezeDryScaleMode==="GRADING"?`تفکیک خروج فریزدرای${selectedCycle?` — ${selectedCycle.code}`:""}`:`بسته‌بندی تک‌به‌تک${packagingBase?` — ${packagingBase.product} / ${packagingBase.grade}`:""}`}</b><WashingScaleConsole mode="EXIT" code={freezeDryScaleMode==="GRADING"?selectedCycle?.code:packagingBase?.code} net={freezeDryScaleMode==="GRADING"?totalGradedKg:packageNetKg} previousNet={freezeDryScaleMode==="GRADING"?cycleInputKg:0} tare={freezeDryScaleMode==="GRADING"?0:packageTareKg} netOnly={freezeDryScaleMode==="GRADING"} onSimulate={freezeDryScaleMode==="GRADING"?(weight)=>{const first=freezeDryGradeRows[0];if(first)updateFreezeDryGradeRow(first.id,"weightKg",weight.toFixed(3))}:setFreezeDryPackageScaleKg} testWeights={freezeDryScaleMode==="GRADING"?[1,2.5,5]:[0.1,0.25,0.5]}/></div>
              <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:18,alignItems:"start"}}>
                <section style={{border:"1px solid #d8e4df",borderRadius:14,padding:16,background:"#fff"}}><h3 style={{marginTop:0}}>۱. تفکیک و قفل خروج فریزدرای</h3>{!completingCycles.length?<PWEmpty>چرخه‌ای در وضعیت «آماده تخلیه» وجود ندارد. ابتدا پایان فرآیند چرخه را ثبت کنید.</PWEmpty>:<form onSubmit={(event)=>lockFreezeDryOutput(event,selectedCycle.id)}><PWField label="چرخه آماده تخلیه"><select value={selectedCycle?.id||""} onChange={(event)=>{setFreezeDryOutputCycleId(event.target.value);setFreezeDryGradeRows([{id:1,grade:"A",weightKg:""}]);setFreezeDryScaleMode("GRADING")}} style={pwInput}>{completingCycles.map((cycle)=><option key={cycle.id} value={cycle.id}>{cycle.code} · {cycle.machineId} · ورودی {cycle.inputWeightKg} kg</option>)}</select></PWField><PWNotice>محصول: <b>{cycleParents[0]?.product||"—"}</b> · وزن موجود چرخه: <b>{cycleInputKg.toFixed(3)} kg</b> · تعداد والدها: <b>{cycleParents.length}</b></PWNotice><div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden",marginTop:12}}><div style={{display:"grid",gridTemplateColumns:".35fr 1fr 1fr .35fr",gap:8,padding:10,background:"#eef4f1",fontSize:11,fontWeight:800}}><span>#</span><span>گرید نهایی</span><span>وزن خروجی (kg)</span><span></span></div>{freezeDryGradeRows.map((row,index)=><div key={row.id} style={{display:"grid",gridTemplateColumns:".35fr 1fr 1fr .35fr",gap:8,padding:10,borderTop:"1px solid #e1eae6",alignItems:"center"}}><b>{index+1}</b><select value={row.grade} onChange={(event)=>updateFreezeDryGradeRow(row.id,"grade",event.target.value)} style={pwInput}>{["A++","A+","A","B","Industrial"].map((grade)=><option key={grade}>{grade}</option>)}</select><input type="number" min="0.001" step="0.001" value={row.weightKg} onChange={(event)=>updateFreezeDryGradeRow(row.id,"weightKg",event.target.value)} required style={pwInput}/><button type="button" disabled={freezeDryGradeRows.length===1} onClick={()=>removeFreezeDryGradeRow(row.id)} style={{border:0,background:"transparent",color:"#b84242"}}>حذف</button></div>)}</div><div style={{margin:"10px 0"}}><PWButton secondary onClick={addFreezeDryGradeRow}>＋ افزودن گرید خروجی</PWButton></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"12px 0"}}><PWNotice>ورودی<br/><b>{cycleInputKg.toFixed(3)} kg</b></PWNotice><PWNotice>خروج تفکیک‌شده<br/><b>{totalGradedKg.toFixed(3)} kg</b></PWNotice><PWNotice>افت فرآیند<br/><b>{processLossKg.toFixed(3)} kg</b></PWNotice></div><PWButton disabled={!selectedCycle||!(totalGradedKg>0)||processLossKg<0}>قفل خروجی‌ها و ارسال به بسته‌بندی</PWButton></form>}</section>
                <section style={{border:"1px solid #d8e4df",borderRadius:14,padding:16,background:"#fff"}}><h3 style={{marginTop:0}}>۲. توزین و بسته‌بندی تک‌به‌تک</h3><p style={{fontSize:12,color:"#657770"}}>خروج جدید و مانده قبلی فقط در صورت یکسان‌بودن محصول و گرید قابل ترکیب‌اند.</p>{!freezeDryPackagingEligible.length?<PWEmpty>هنوز خروجی فریزدرای گریدشده‌ای برای بسته‌بندی قفل نشده است.</PWEmpty>:<div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden",marginBottom:12}}>{freezeDryPackagingEligible.map((item)=>{const incompatible=!!packagingBase&&(item.product!==packagingBase.product||item.grade!==packagingBase.grade);return <label key={item.id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto",gap:9,padding:10,borderTop:"1px solid #e1eae6",alignItems:"center",opacity:incompatible?.45:1}}><input type="checkbox" disabled={incompatible} checked={freezeDryPackagingSourceIds.includes(item.id)} onChange={(event)=>{setFreezeDryPackagingSourceIds((current)=>event.target.checked?[...current,item.id]:current.filter((id)=>id!==item.id));if(event.target.checked)setFreezeDryScaleMode("PACKAGING")}}/><span><b className="font-mono">{item.batchCode||item.code}</b> · {item.product} / {item.grade}</span><b>{item.weightKg.toFixed(3)} kg</b></label>})}</div>}<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><PWField label="پاکت متالایز"><select value={freezeDryPouchCode} onChange={(event)=>{const code=event.target.value;setFreezeDryPouchCode(code);const next=PW_DRY_POUCHES.find((row)=>row.code===code);if(next)setFreezeDryPackageScaleKg(next.fillWeightGrams/1000);setFreezeDryScaleMode("PACKAGING")}} style={pwInput}>{PW_DRY_POUCHES.map((row)=><option key={row.code} value={row.code}>{row.name} · وزن ظرف {row.tareWeightGrams} g</option>)}</select></PWField><PWField label="رطوبت‌گیر"><select value={freezeDryAbsorberCode} onChange={(event)=>{setFreezeDryAbsorberCode(event.target.value);setFreezeDryScaleMode("PACKAGING")}} style={pwInput}>{PW_DRY_ABSORBERS.map((row)=><option key={row.code} value={row.code}>{row.name}{row.weightGrams?` · ${row.weightGrams} g`:""}</option>)}</select></PWField></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,margin:"12px 0"}}><PWNotice>وزن خالص آنلاین<br/><b>{Math.round(packageNetKg*1000)} g</b></PWNotice><PWNotice>پاکت + رطوبت‌گیر<br/><b>{pouch.tareWeightGrams+absorber.weightGrams} g</b></PWNotice><PWNotice>وزن ناخالص<br/><b>{Math.round(packageGrossKg*1000)} g</b></PWNotice></div><PWNotice>موجودی انتخاب‌شده: <b>{availableWeightKg.toFixed(3)} kg</b></PWNotice><PWButton disabled={!selectedSources.length||availableWeightKg<packageNetKg} onClick={packageOneFreezeDryUnit}>ثبت این بسته، چاپ برچسب و بستن</PWButton><div style={{marginTop:16,padding:13,border:"1px solid #d8e4df",borderRadius:11,background:"#fafcfb"}}><h4 style={{margin:"0 0 5px"}}>بستن نشست و ثبت مانده</h4><div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,alignItems:"end"}}><PWField label="QR سبد مانده"><input value={freezeDryRemainderCode} onChange={(event)=>setFreezeDryRemainderCode(event.target.value)} style={{...pwInput,fontFamily:"monospace"}} placeholder="CTR-..."/></PWField><PWButton secondary onClick={()=>setFreezeDryRemainderScanOpen(true)}>⌗ اسکن سبد</PWButton></div><ScanSimulator open={freezeDryRemainderScanOpen} title="اسکن سبد مانده فریزدرای" suggestedCode={freezeDryRemainderCode||"CTR-008"} onClose={()=>setFreezeDryRemainderScanOpen(false)} onScan={setFreezeDryRemainderCode}/><div style={{marginTop:10}}><PWButton secondary disabled={!selectedSources.length||(!freezeDryRemainderCode&&availableWeightKg>0)} onClick={closeFreezeDryPackaging}>بستن نشست و ثبت مانده</PWButton></div></div></section>
              </div><div style={{marginTop:16}}><h3>بسته‌های آماده‌شده فریزدرای</h3>{!freezeDryPreparedPackages.length?<PWEmpty>هنوز بسته‌ای ساخته نشده است.</PWEmpty>:<div style={{border:"1px solid #d8e4df",borderRadius:11,overflow:"hidden"}}>{freezeDryPreparedPackages.slice().reverse().map((item)=><div key={item.id} style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",padding:10,borderTop:"1px solid #e1eae6",fontSize:12}}><b className="font-mono">{item.code}</b><span>{item.product} / {item.grade}</span><span className="font-mono">{item.pouchCode}</span><b>{item.weightKg.toFixed(3)} kg</b><span>{item.labelPrintedAt?"برچسب چاپ شد":"—"}</span></div>)}</div>}</div>
            </div>
          })()}
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
                        cycle.type === "DRY" &&
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
                      ).filter((action:string)=>!(cycle.type==="FREEZE_DRY"&&action==="FINISH")).map((action: string) => (
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
                            item.trays.map((t) => `سینی ${t.sequence} · ${t.quantityKg} kg`).join("، ") ||
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
  return <section className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-2xl border border-[#1b5a46] bg-[#082b20] p-4 text-white shadow-xl" aria-label={`کنسول توزین ${mode === "entry" ? "ورود" : "خروج"} سورتینگ`}>
    <div className="grid grid-cols-[1.05fr_1.45fr_1.15fr_1fr] gap-3" dir="rtl">
      <div className="flex flex-col justify-between rounded-xl border border-[#1b5a46] bg-[#061f17] p-3">
        <div className="flex items-center justify-between text-[11px]"><b className="text-[#c9f7e4]">● باسکول رومیزی ۱</b><span className="font-mono text-[#62e5ad]">10 Hz</span></div>
        <div className="mt-3 rounded-lg border border-[#1b5a46] bg-[#0d382a] p-2 text-[10px]"><div className="flex justify-between"><span>لودسل آنلاین</span><b className="font-mono text-[#62e5ad]">RS485</b></div><div className="mt-2 flex justify-between text-[#8eb8a8]"><span>قرائت پایدار</span><b>± 0.002 kg</b></div></div>
        <div className="mt-3 rounded-lg border border-[#1b5a46] px-3 py-2 text-center text-[10px] text-[#62e5ad]">✓ ثبات سیگنال حسگر تأیید شد</div>
        {code && <div className="mt-3 rounded-lg bg-[#041711] p-2 text-center"><small className="block text-[#8eb8a8]">سریال سبد جاری</small><b className="font-mono text-xl text-[#62e5ad]">{code}</b></div>}
      </div>
      <div className="rounded-xl border border-[#1b5a46] bg-[#061f17] p-4">
        <div className="flex justify-between text-[11px] text-[#c9f7e4]"><b>{mode === "entry" ? "وزن خالص جدید" : "وزن خالص"}</b><span className="font-mono text-[#62e5ad]">SENS: HIGH</span></div>
        <div className="my-[18px] flex items-baseline justify-center gap-2" dir="ltr"><strong className="font-mono text-[40px] tracking-[.1em]">{number(net)}</strong><span className="rounded bg-[#0d382a] px-2 py-1 text-[10px] text-[#62e5ad]">kg</span></div>
        <div className="flex justify-between border-t border-white/10 pt-2 text-[10px]"><span>وزن ظرف</span><b className="font-mono text-[#62e5ad]">{number(tare)} kg</b></div>
      </div>
      <div className="rounded-xl border border-[#1b5a46] bg-[#061f17] p-4">
        <div className="flex justify-between text-[11px] text-[#c9f7e4]"><b>{mode === "entry" ? "وزن خالص قبلی" : "وزن ناخالص"}</b><span className="font-mono text-[#62e5ad]">GROSS</span></div>
        <div className="my-[18px] flex items-baseline justify-center gap-2" dir="ltr"><strong className="font-mono text-[36px] tracking-[.1em]">{number(mode === "entry" ? previousNet || 0 : gross)}</strong><span className="rounded bg-[#0d382a] px-2 py-1 text-[10px] text-[#62e5ad]">kg</span></div>
        <div className="flex justify-between border-t border-white/10 pt-2 text-[10px]"><span>{mode === "entry" ? "اختلاف" : "وضعیت"}</span><b className="font-mono text-[#62e5ad]">{mode === "entry" ? `${number(net - (previousNet || 0))} kg` : "READY"}</b></div>
      </div>
      <div className="flex flex-col justify-between gap-2 rounded-xl border border-[#1b5a46] bg-[#0a3326] p-3">
        {mode === "entry" ? <button type="button" onClick={onRead} className="rounded-xl border border-[#2b765b] bg-[#14513d] px-3 py-3 text-[11px] font-bold">↻ ثبت وزن جدید</button> : <div className="rounded-xl border border-[#2b765b] bg-[#061f17] px-3 py-3 text-center text-[11px] font-bold text-[#62e5ad]">● وزن آنلاین پس از اسکن سبد</div>}
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
    [entryWeightStates, setEntryWeightStates] = useState<Record<string, SortingEntryWeightState>>({}),
    [outputCode, setOutputCode] = useState(""),
    [gross, setGross] = useState(""),
    [grade, setGrade] = useState("A"),
    [size, setSize] = useState("درشت"),
    [destination, setDestination] = useState("FRESH_EXPORT"),
    [qualityCheckRequired, setQualityCheckRequired] = useState(false),
    [lossReason, setLossReason] = useState(""),
    [outputs, setOutputs] = useState<any[]>([]),
    [error, setError] = useState(initialStep === "output" && !activeSortingSession ? "هیچ نشست سورتینگ فعالی برای ثبت خروج وجود ندارد." : ""),
    [staged, setStaged] = useState<string[]>([]),
    [weighingCode, setWeighingCode] = useState(""),
    [outputScanOpen, setOutputScanOpen] = useState(false),
    [inputScanOpen, setInputScanOpen] = useState(false)
  const scale = "STABLE"
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
    compatibleEligibleSources=eligibleSources.filter((source:any)=>!sources.length||(source.product===sources[0].product&&String(source.grade||"").trim()===String(sources[0].grade||"").trim())),
    weighingSource = sources.find((source: any) => pwCode(source.code) === pwCode(weighingCode)) || sources[sources.length - 1],
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
    if (sources.length && String(sources[0]?.grade||"").trim() !== String(source.grade||"").trim())
      return setError(`همه ورودی‌های یک نشست سورت باید یک گرید باشند؛ گرید نشست ${sources[0]?.grade||"نامشخص"} است.`)
    setInputCodes([...inputCodes, source.code])
    setEntryWeightStates(
      pwSelectSortingEntryWeightState(
        entryWeightStates,
        weighingCode,
        source.code,
        entryWeights,
      ),
    )
    setWeighingCode(source.code)
    setScanCode("")
    setError("")
  }
  function captureEntryWeight(source: any) {
    const measured = Number((Number(source.gross) - Number(source.tare || 0)).toFixed(3))
    if (!(measured > 0)) return setError("ترازو وزن معتبر دریافت نکرد.")
    setEntryWeights({ ...entryWeights, [pwCode(source.code)]: measured })
    setEntryWeightStates(
      pwCaptureSortingEntryWeightState(entryWeightStates, source.code),
    )
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
    if (new Set(sources.map((source:any)=>String(source.grade||"").trim())).size!==1)
      return setError("همه ورودی‌های یک نشست سورت باید یک گرید یکسان داشته باشند.")
    if (activeSortingSession)
      return setError("یک نشست سورتینگ در حال اجراست؛ ابتدا خروج آن را ثبت کنید.")
    try {
      const next = readProductionLedger()
      const session = {
        id: pwId(next, "SORT"),
        receiptId: batch.id,
        inputCodes: [...inputCodes],
        inputProduct: sources[0].product,
        inputGrade: sources[0].grade,
        entryWeights: { ...entryWeights },
        status: "IN_PROGRESS",
        startedAt: new Date().toISOString(),
      }
      next.sortingSessions = [...(next.sortingSessions || []), session]
      pwEvent(next, "شروع نشست سورتینگ", session.id, {
        receiptId: batch.id,
        inputCodes: session.inputCodes,
        inputProduct: session.inputProduct,
        inputGrade: session.inputGrade,
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
      setEntryWeightStates({})
      setWeighingCode("")
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
    const selectedCode = selected.qr || selected.code,
      selectedTare = Number(selected.tare ?? selected.tareWeightKg ?? 0),
      measuredNet = Math.min(18.5, Math.max(0, inputWeight - total))
    setOutputCode(selectedCode)
    setGross((measuredNet + selectedTare).toFixed(3))
    setStaged([...new Set([...staged, selectedCode])])
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
              code={weighingSource?.code || compatibleEligibleSources[0]?.code}
              gross={Number(weighingSource?.gross || 0)}
              tare={Number(weighingSource?.tare || 0)}
              net={Number(entryWeights[pwCode(weighingSource?.code)] ?? ((weighingSource?.gross || 0) - (weighingSource?.tare || 0)))}
              previousNet={Number((weighingSource?.gross || 0) - (weighingSource?.tare || 0))}
              onRead={() => weighingSource && captureEntryWeight(weighingSource)}
            />
            <Card className="p-5">
            <h3 className="font-bold mb-3">ورود به سورتینگ · اسکن سبدهای ورودی</h3>
            {step === "input" && (
              <><div aria-label="سبدهای شناسایی‌شده برای سورت" className="mb-3 rounded-lg bg-[#edf8f3] p-3 text-[11px] text-[#365c4f]"><b>{compatibleEligibleSources.length} سبد سازگار در سردخانه و آماده ورود به سورت شناسایی شد.</b>{sources.length?<span className="block mt-1">قفل نشست: <b>{sources[0].product} · گرید {sources[0].grade}</b>؛ سبد با گرید دیگر باید در نشست جدا وارد شود.</span>:<span className="block mt-1">با اسکن اولین سبد، محصول و گرید این نشست قفل می‌شود.</span>}{compatibleEligibleSources.length>0?<span className="block mt-1 font-mono">سبد بعدی: {compatibleEligibleSources[0].code} · {compatibleEligibleSources[0].product} · {compatibleEligibleSources[0].grade}</span>:<span className="block mt-1">سبد سازگار دیگری برای این نشست وجود ندارد.</span>}</div><div className="flex gap-2"><input aria-label="اسکن QR ورود سورتینگ" className={field + " font-mono"} value={scanCode} onChange={(event) => setScanCode(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") scanInput() }} placeholder="اسکن QR سبد ورودی"/><button className={primary} disabled={!scanCode.trim()} onClick={() => scanInput()}>افزودن سبد</button><button className="rounded-lg border border-[#176b50] px-4 text-[12px] font-bold text-[#176b50]" onClick={() => setInputScanOpen(true)}>⌗ شبیه‌ساز اسکن</button></div><ScanSimulator open={inputScanOpen} title="اسکن سبد ورودی سورتینگ" suggestedCode={compatibleEligibleSources[0]?.code || ""} onClose={() => setInputScanOpen(false)} onScan={scanInput}/></>
            )}
            <div className="mt-4 overflow-hidden rounded-xl border border-[#d8e4df] bg-white">
              {sources.map((source: any) => (
                <div
                  key={source.code}
                  className={`grid grid-cols-[1.15fr_1.25fr_1.2fr_.45fr] items-center gap-4 border-b border-[#e6eeea] px-5 py-3 text-[12px] last:border-b-0 ${pwCode(weighingSource?.code) === pwCode(source.code) ? "bg-[#f7fcf9]" : "bg-white"}`}
                >
                  <b className="font-mono text-[13px]">{source.code}</b>
                  <button onClick={() => {setEntryWeightStates(pwSelectSortingEntryWeightState(entryWeightStates,weighingCode,source.code,entryWeights));setWeighingCode(source.code)}} className={`mx-auto min-w-[150px] rounded-xl border px-3 py-1.5 text-[10px] font-bold ${entryWeightStates[pwCode(source.code)] === "CAPTURED" ? "border-[#72d9ad] bg-[#ebfff6] text-[#176b50]" : entryWeightStates[pwCode(source.code)] === "PENDING" ? "border-[#efbd4e] bg-[#fff9e9] text-[#9a6420]" : "border-[#cfd9d5] bg-[#f5f7f6] text-[#718079]"}`}>{entryWeightStates[pwCode(source.code)] === "CAPTURED" ? "✓ وزن جدید ثبت شد" : entryWeightStates[pwCode(source.code)] === "PENDING" ? "در انتظار ثبت وزن" : "وزن قبلی انتخاب شد"}</button>
                  <span className="text-[#718079]">آخرین وزن: <b className="rounded bg-[#f1f3f2] px-2 py-1 font-mono text-[#18302a]">{(source.gross - source.tare).toFixed(3)} kg</b></span>
                  <button
                    onClick={() => {
                      setInputCodes(
                        inputCodes.filter((code) => code !== source.code),
                      )
                      const next = { ...entryWeights }
                      delete next[pwCode(source.code)]
                      setEntryWeights(next)
                      const nextStates = { ...entryWeightStates }
                      delete nextStates[pwCode(source.code)]
                      setEntryWeightStates(nextStates)
                      if (pwCode(weighingCode) === pwCode(source.code))
                        setWeighingCode("")
                    }}
                    className="text-red-700"
                    disabled={step !== "input"}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-[#e7f1ec] rounded-lg text-[12px]">
              {sources.length} سبد · {sources.length?`${sources[0].product} / گرید ${sources[0].grade} · `:""}وزن قابل سورت{" "}
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
              onRead={undefined}
            />
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Card className="p-4">
                <h3 className="font-bold mb-3">
                  خروج از سورتینگ · اسکن، توزین و تعیین مقصد هر خروجی
                </h3>
                <div className="mb-3 rounded-lg bg-[#edf8f3] p-3 text-[11px] text-[#365c4f]">گرید ورودی نشست فقط برای جلوگیری از اختلاط ورودی‌ها قفل است؛ در خروج، اپراتور می‌تواند برای هر سبد گرید و اندازه نهایی جدید ثبت کند.</div>
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
                      با اسکن سبد روی باسکول، وزن پایدار همان لحظه به‌صورت آنلاین ثبت می‌شود.
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
                <div className="my-3 rounded-xl border border-[#cde3da] bg-[#edf7f3] p-3 text-[12px] text-[#176b50]">وزن خروجی پس از اسکن سبد به‌صورت آنلاین از باسکول خوانده می‌شود؛ خالص فعلی <b className="font-mono">{gross && net > 0 ? net.toFixed(3) : "0.000"} kg</b> است.</div>
                <p className="mb-3 rounded-lg border border-[#cde3da] bg-[#edf7f3] p-3 text-[12px] text-[#176b50]">
                  شجره والد این خروجی خودکار و متناسب با وزن ثبت‌شده سبدهای ورودی نشست محاسبه می‌شود.
                </p>
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

function inventoryActionName(value:any){
  const action=String(value||"").trim()
  if(!action)return "فعلاً اقدام دیگری لازم نیست"
  if(/ثبت خروج اسلایس نشست|انجام عملیات اسلایس/.test(action))return "در مرحله اسلایس و منتظر ثبت خروج"
  if(/اسکن ورود به اسلایس|منتظر ورود دوباره به اسلایس/.test(action))return "در انتظار اسلایس"
  if(/ثبت خروج از فریز و بسته‌بندی|انجام عملیات فریز/.test(action))return "در حال فریزینگ و منتظر ثبت خروج و بسته‌بندی"
  if(/ثبت خروج از خشک‌کن و بسته‌بندی|انجام عملیات خشک‌کن/.test(action))return "در حال خشک‌شدن و منتظر ثبت خروج و بسته‌بندی"
  if(/ثبت ورود به دستگاه فریزدرای|ثبت ورود سینی‌ها به فریزدرای/.test(action))return "در انتظار ورود به دستگاه فریزدرای"
  if(/اسکن ورود به شست‌وشو/.test(action))return "در انتظار شست‌وشو"
  if(/انجام شست‌وشوی نشست|انجام عملیات شست‌وشو/.test(action))return "در مرحله شست‌وشو و منتظر ثبت خروج"
  if(/اسکن ورود به بسته‌بندی/.test(action))return "در انتظار بسته‌بندی"
  return action
}

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
  const derivedBatchByItem=new Map<string,string>(),legacySortGroups=new Map<string,string>(),receiptContainerCodes=new Set(receipt.baskets.map((basket:any)=>String(basket.code)))
  productionItems.forEach((item: any) => {
    let code=item.batchCode
    if(!code&&item.stage==="SORTED"){
      const parentKey=[...(item.parentIds||String(item.parentId||"").split(","))].filter(Boolean).sort().join("+")
      const groupKey=[parentKey,item.product,item.grade,item.size,item.destination||item.operationalDestination].join("|")
      code=legacySortGroups.get(groupKey)||`BA-SORT-${String(legacySortGroups.size+1).padStart(3,"0")}`
      legacySortGroups.set(groupKey,code)
    }
    code=code||item.code
    derivedBatchByItem.set(String(item.id||item.code),code)
    productGroups.set(code, [...(productGroups.get(code) || []), item])
  })
  const parentBatch=(value:any)=>{const raw=String(value||"");if(!raw)return "";if(raw.startsWith(`${receipt.id}:`)||receiptContainerCodes.has(raw))return receipt.id;return derivedBatchByItem.get(raw)||raw}
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
    const parents = [...new Set(items.flatMap((item: any) => item.parentBatchIds || item.parentIds || String(item.parentId || "").split(",")).map(parentBatch).filter(Boolean))]
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
    ...receiptBaskets.map((basket: any) => ({ code: basket.code, batchCode: receipt.id, product: basket.product, grade: basket.grade, weightKg: Number(basket.gross || 0) - Number(basket.tare || 0), location: inventoryLocationName(basket.currentLocation || basket.zone), state: inventoryStatusNames[basket.currentState || basket.status] || basket.currentState || basket.status || receipt.status, nextAction: inventoryActionName(basket.nextAction) })),
    ...productionItems.flatMap((item: any) => {
      const codes = [item.containerCode, ...(item.trays || []).map((tray: any) => tray.code)].filter(Boolean)
      return codes.map((code: string) => ({ code, batchCode: item.batchCode || item.code, product: item.product, grade: item.grade, weightKg: codes.length === 1 ? Number(item.weightKg || 0) : Number((item.trays || []).find((tray: any) => tray.code === code)?.quantityKg || 0), location: inventoryLocationName(item.currentLocation || item.zone), state: inventoryStatusNames[item.currentState] || inventoryStageName(item.stage), nextAction: inventoryActionName(item.nextAction) }))
    }),
  ]
  const operations = [
    ...(ledger.sortingSessions || []).map((session: any) => ({ code: session.id, kind: "SESSION", title: "نشست سورتینگ", status: session.status, inputs: session.inputCodes || [], outputs: session.outputIds || [], machine: "ایستگاه سورتینگ" })),
    ...(ledger.washSessions || []).map((session: any) => ({ code: session.id, kind: "SESSION", title: "نشست شست‌وشو", status: session.status, inputs: session.inputIds || [], outputs: session.childIds || session.outputs || [], machine: `${session.product || "محصول"} · گرید ${session.grade || "—"}` })),
    ...(ledger.slicingSessions || []).map((session: any) => ({ code: session.id, kind: "SESSION", title: "نشست اسلایس", status: session.status, inputs: session.inputIds || [], outputs: session.outputIds || [], machine: "ایستگاه اسلایس" })),
    ...(ledger.cycles || []).map((cycle: any) => ({ code: cycle.id, kind: "CYCLE", title: cycle.type === "FREEZE_DRY" ? "چرخه فریزدرای" : cycle.type === "DRY" ? "چرخه خشک‌کن" : "چرخه فریز", status: cycle.status, inputs: cycle.itemIds || [], outputs: [], machine: cycle.machineId || "دستگاه تعیین نشده" })),
  ]
  batches.sort((a,b)=>Number(b.agingWarning)-Number(a.agingWarning)||Number(b.agingDays)-Number(a.agingDays)||String(a.code).localeCompare(String(b.code)))
  return { receipt, ledger, batches, containers, operations }
}

function buildPrototypeWorkQueue(model=buildInventoryModel(false)){
  return model.batches.map((row:any,index:number)=>{const action=row.nextActions[0]||"بررسی وضعیت موجودی",overdue=Math.max(0,Number(row.agingDays)-PROTOTYPE_AGING_WARNING_DAYS+1),priority=row.agingWarning?Math.min(100,70+Math.min(20,overdue)):50;return{id:`TSK-${String(index+1).padStart(3,"0")}`,batchCode:row.code,type:action,responsible:"آماده دریافت توسط اپراتور",priority,priorityLabel:`P${Math.max(1,Math.ceil(priority/25))}`,agingDays:Number(row.agingDays)||0,agingWarning:!!row.agingWarning,zone:row.locations.join("، ")}}).sort((a:any,b:any)=>b.priority-a.priority||b.agingDays-a.agingDays||a.id.localeCompare(b.id))
}

function InventoryBatchDetails({ row }: { row: any }) {
  const units=(row.rows||[]).map((item:any)=>({key:String(item.id??item.code??item.containerCode),container:item.containerCode||item.code||"بدون ظرف",weightKg:Number(item.weightKg??(Number(item.gross||0)-Number(item.tare||0))),location:inventoryLocationName(item.currentLocation||item.zone),stage:inventoryStageName(item.stage||item.currentState||item.status),nextAction:inventoryActionName(item.nextAction)}))
  return <div className="border-t bg-[#fbfdfc] p-4 grid grid-cols-3 gap-3 text-[12px]">
    <div className="bg-white border rounded-lg p-3"><small className="block text-[#718079]">ظروف حامل فعلی</small><b className="font-mono">{row.containers.join("، ") || "بدون ظرف؛ تخصیص فرایندی"}</b></div>
    <div className="bg-white border rounded-lg p-3"><small className="block text-[#718079]">بچ‌های ورودی</small><b className="font-mono">{row.parents.join("، ") || "مبدأ دریافت"}</b></div>
    <div className="bg-white border rounded-lg p-3"><small className="block text-[#718079]">مقصد نهایی</small><b>{row.destination.join("، ") || "هنوز تعیین نشده"}</b></div>
    {units.length>1&&<div className="col-span-3 bg-white border rounded-lg overflow-hidden"><div className="grid grid-cols-[.8fr_.6fr_1.2fr_1.4fr] gap-2 bg-[#eef4f1] p-2 text-[10px] font-bold text-[#718079]"><span>سبد مستقل</span><span>وزن</span><span>موقعیت / مرحله فعلی</span><span>اقدام بعدی</span></div>{units.map((unit:any)=><div key={unit.key} className="grid grid-cols-[.8fr_.6fr_1.2fr_1.4fr] gap-2 border-t p-2 items-center"><b className="font-mono">{unit.container}</b><b>{unit.weightKg.toFixed(3)} kg</b><span>{unit.location} / {unit.stage}</span><span>{unit.nextAction}</span></div>)}</div>}
    <div className="col-span-3 bg-[#edf8f3] rounded-lg p-3"><b>اقدام بعدی: </b>{row.nextActions.join("، ") || "فعلاً اقدام دیگری لازم نیست"}</div>
  </div>
}

function InventoryBatchRow({ row }: { row: any }) {
  return <details className="border border-[#d8e4df] rounded-xl bg-white overflow-hidden">
    <summary className="cursor-pointer list-none grid grid-cols-[1fr_.8fr_1.1fr_.65fr_.8fr_1.15fr] gap-3 items-center p-4">
      <div><InventoryKindBadge kind={row.kind} /><b className="block font-mono mt-2 text-[#183e38]">{row.code}</b>{row.rows?.length>1&&<small className="block text-[#176b50] mt-1">{row.rows.length} سبد مستقل در این بچ مشترک</small>}</div>
      <span><small className="block text-[#718079]">محصول / گرید</small><b>{row.product || "—"} · {row.grade || "—"}</b></span>
      <span><small className="block text-[#718079]">موقعیت / مرحله فعلی</small><b>{row.locations.join("، ")} / {inventoryStageName(row.stage)}</b></span>
      <span><small className="block text-[#718079]">وزن خالص</small><b>{row.weightKg.toFixed(3)} kg</b></span>
      <span><small className="block text-[#718079]">مقصد نهایی</small><b>{row.destination.join("، ") || "هنوز تعیین نشده"}</b></span>
      <span><small className="block text-[#718079]">اقدام بعدی</small><b>{row.nextActions.join("، ") || "فعلاً اقدام دیگری لازم نیست"}</b></span>
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

function ContainersWorkspaceScreen(){
  const STORE="storemesh.prototype.containers",batch=readPrototypeBatch(),production=readProductionLedger();
  const zones=[{id:"RECEIVING",label:"دریافت"},{id:"COLD_STORAGE",label:"سردخانه"},{id:"SORTING",label:"سورتینگ"},{id:"WASHING",label:"شست‌وشو"},{id:"SLICING",label:"اسلایس"},{id:"FREEZING",label:"فریز"},{id:"DRYING",label:"خشک‌کن"},{id:"PACKAGING",label:"بسته‌بندی"},{id:"SHIPPING",label:"ارسال"}];
  const seed=[{qr:"CTR-001",type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["RECEIVING","COLD_STORAGE","SORTING"],last:"امروز ۰۹:۳۰",status:"فعال"},{qr:"CTR-002",type:"سبد پلاستیکی",tare:1.3,capacity:25,zones:["RECEIVING"],last:"دیروز ۱۵:۱۰",status:"خراب",damageReason:"ترک بدنه"},{qr:"CTR-003",type:"سبد پلاستیکی",tare:1.28,capacity:25,zones:["SORTING","WASHING","COLD_STORAGE"],last:"امروز ۱۱:۰۰",status:"فعال"}];
  const [rows,setRows]=useState<any[]>(()=>{try{return JSON.parse(localStorage.getItem(STORE)||"null")||seed}catch{return seed}}),[filter,setFilter]=useState<"ALL"|"ACTIVE"|"DAMAGED"|"SINGLE_USE">("ALL"),[form,setForm]=useState<any>({type:"سبد پلاستیکی",tare:1.2,capacity:25,zones:["RECEIVING","SORTING"]}),[created,setCreated]=useState(""),[editRow,setEditRow]=useState<any>(null),[damageRow,setDamageRow]=useState<any>(null),[damageReason,setDamageReason]=useState("");
  const inputClass="w-full h-12 rounded-xl border border-[#d5e1db] bg-white px-3 text-[12px] outline-none focus:border-[#176b50]",persist=(next:any[])=>{setRows(next);localStorage.setItem(STORE,JSON.stringify(next));window.dispatchEvent(new Event("storemesh-data"))},toggleZone=(id:string)=>setForm((current:any)=>({...current,zones:current.zones.includes(id)?current.zones.filter((value:string)=>value!==id):[...current.zones,id]})),prefix=(type:string)=>type==="سینی فرایندی"?"TRY":type==="کانتینر عمومی"?"CTR":"BSK";
  const create=()=>{if(form.tare<0||form.capacity<=form.tare||!form.zones.length)return;const code=`${prefix(form.type)}-${String(rows.filter(row=>String(row.qr).startsWith(prefix(form.type)+"-")).length+1).padStart(4,"0")}`;persist([...rows,{...form,qr:code,last:"استفاده نشده",status:"فعال",singleUse:false}]);setCreated(code)},saveEdit=()=>{if(!editRow||form.tare<0||form.capacity<=form.tare||!form.zones.length)return;persist(rows.map(row=>row.qr===editRow.qr?{...row,tare:form.tare,capacity:form.capacity,zones:form.zones}:row));setEditRow(null)},markDamaged=()=>{if(!damageRow||!damageReason.trim())return;persist(rows.map(row=>row.qr===damageRow.qr?{...row,status:"خراب",damageReason,last:"امروز · گزارش خرابی"}:row));setDamageRow(null);setDamageReason("")};
  const activeReceiptCodes=batch.baskets.filter(item=>!(production.consumedInputs||[]).includes(`${batch.id}:${item.code}`)).map(item=>pwCode(item.code)),activeProductionCodes=(production.items||[]).filter(item=>!item.consumed).flatMap(item=>[pwCode(item.containerCode),...(item.trays||[]).map((tray:any)=>pwCode(tray.code))]).filter(Boolean),singles=batch.baskets.filter(item=>item.code.startsWith("TMP-")).map(item=>({qr:item.code,type:"ظرف یک‌بارمصرف تأمین‌کننده",tare:null,capacity:item.gross,zones:[item.zone||"RECEIVING"],last:batch.createdAt,status:"درحال‌استفاده",singleUse:true})),occupied=new Set([...activeReceiptCodes,...activeProductionCodes]),all=[...rows,...singles],shown=filter==="ALL"?all:filter==="SINGLE_USE"?singles:rows.filter(row=>filter==="ACTIVE"?row.status==="فعال":row.status==="خراب"),free=rows.filter(row=>row.status==="فعال"&&!occupied.has(pwCode(row.qr))).length,used=rows.filter(row=>row.status==="فعال"&&occupied.has(pwCode(row.qr))).length,zoneNames=(row:any)=>row.zones.map((id:string)=>zones.find(zone=>zone.id===id)?.label||id).join(" / "),openEdit=(row:any)=>{setForm({type:row.type,tare:row.tare,capacity:row.capacity,zones:[...row.zones]});setEditRow(row)};
  return <div className="flex-1 bg-[#f4f7f5] p-6 overflow-auto text-[#18302a]" dir="rtl">
    <div className="mb-6"><small className="tracking-[.18em] text-[#718079]">STOREMESH / IRAN</small><h1 className="text-[27px] font-extrabold mt-1">کانتینرها</h1><h2 className="text-[20px] font-bold mt-6">مدیریت کانتینرها</h2><p className="text-[#718079] text-[12px] mt-1">کنترل ظرفیت، محصول یکتا و جابه‌جایی گروهی</p></div>
    <div className="grid grid-cols-4 gap-4 mb-5">{[["کل ظرف‌ها",all.length,"□","bg-[#e1f2eb] text-[#16825b]"],["آزاد",free,"◇","bg-[#e5eefb] text-[#3177c8]"],["در حال استفاده",used,"!","bg-[#fff0dc] text-[#d07826]"],["خراب / قرنطینه",rows.filter(row=>row.status==="خراب").length,"⊘","bg-[#fbe6e6] text-[#c84646]"]].map(([label,count,icon,color]:any)=><div key={label} className="bg-white border border-[#d8e4df] rounded-2xl p-5 flex items-center gap-4 shadow-sm"><span className={`grid h-12 w-12 place-items-center rounded-xl text-[22px] ${color}`}>{icon}</span><div className="mr-auto"><small className="text-[#718079]">{label}</small><b className="block text-[23px]">{count}</b></div></div>)}</div>
    <section className="bg-white border border-[#d8e4df] rounded-2xl p-5 shadow-sm mb-5"><div className="flex items-center gap-2 mb-5"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e1f2eb] text-[#176b50]">↟</span><h3 className="font-bold text-[17px]">ایجاد کانتینر</h3></div><div className="grid grid-cols-3 gap-4"><label className="text-[11px] font-bold">نوع<select className={inputClass} value={form.type} onChange={event=>setForm({...form,type:event.target.value})}><option>سبد پلاستیکی</option><option>سبد استیل</option><option>سینی فرایندی</option><option>کانتینر عمومی</option></select></label><label className="text-[11px] font-bold">ظرفیت kg<input aria-label="ظرفیت کانتینر" type="number" className={inputClass} value={form.capacity} onChange={event=>setForm({...form,capacity:Number(event.target.value)})}/></label><label className="text-[11px] font-bold">وزن خالی ظرف kg<input aria-label="وزن خالی کانتینر" type="number" step="0.01" className={inputClass} value={form.tare} onChange={event=>setForm({...form,tare:Number(event.target.value)})}/></label></div><h4 className="font-bold text-[11px] mt-4 mb-2">زون‌های مجاز این ظرف</h4><div className="flex flex-wrap gap-2">{zones.map(zone=><button key={zone.id} onClick={()=>toggleZone(zone.id)} className={`h-9 rounded-lg border px-3 text-[10px] ${form.zones.includes(zone.id)?"bg-[#176b50] border-[#176b50] text-white":"bg-white border-[#d8e4df]"}`}>{zone.label}{form.zones.includes(zone.id)?" ✓":" +"}</button>)}</div><p className="text-[10px] text-[#718079] mt-3">این ظرف در {form.zones.length} زون مجاز است؛ وزن اول همان وزن خالی آن است.</p><div className="border-t mt-5 pt-4 flex items-center gap-2"><button disabled={!form.zones.length||form.tare<0||form.capacity<=form.tare} onClick={create} className="bg-[#176b50] disabled:opacity-40 text-white rounded-xl px-6 h-12 text-[12px] font-bold">ایجاد ظرف</button><button disabled={!created} onClick={()=>window.print()} className="bg-[#176b50] disabled:opacity-40 text-white rounded-xl px-6 h-12 text-[12px] font-bold">چاپ کد</button>{created&&<div className="mr-auto rounded-xl bg-[#edf8f3] px-4 py-3 text-[11px]"><span>آخرین کد ساخته‌شده: </span><b className="font-mono text-[#176b50]">{created}</b></div>}</div></section>
    <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#e1f2eb] text-[#176b50]">↟</span><h3 className="font-bold text-[17px]">فهرست کانتینرها</h3></div><div className="flex gap-2">{[["ALL","همه"],["ACTIVE","فعال"],["DAMAGED","خراب"],["SINGLE_USE","یک‌بارمصرف"]].map(([id,label])=><button key={id} onClick={()=>setFilter(id as any)} className={`rounded-lg border px-3 py-2 text-[10px] ${filter===id?"bg-[#123f35] text-white":"bg-white border-[#d8e4df]"}`}>{label}</button>)}</div></div>
    <div className="grid grid-cols-4 gap-4">{shown.map((row:any)=>{const occupiedNow=occupied.has(pwCode(row.qr)),ratio=occupiedNow?Math.min(96,65+Number(row.capacity||0)%30):18;return <article key={row.qr} className="bg-white border border-[#d8e4df] rounded-2xl p-4 shadow-sm min-h-[215px]"><div className="flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-[9px] font-bold ${row.status==="خراب"?"bg-[#fbe6e6] text-[#b84242]":occupiedNow?"bg-[#fff0dc] text-[#d07826]":"bg-[#dff3e9] text-[#16825b]"}`}>{row.status==="خراب"?"DAMAGED":occupiedNow?"ACTIVE":"AVAILABLE"}</span><span className="text-[#176b50]">□</span></div><b className="block font-mono text-[15px] mt-5">{row.qr}</b><small className="block text-[#718079] mt-1 h-8">{row.type} · {zoneNames(row)}</small><div className="h-2 rounded-full bg-[#edf2ef] mt-4 overflow-hidden"><div className={`h-full rounded-full ${row.status==="خراب"?"bg-[#d16b3d]":"bg-[#2d9a72]"}`} style={{width:`${ratio}%`}}/></div><p className="text-[10px] text-[#718079] mt-2">ظرفیت {row.capacity} kg · {occupiedNow?"در حال استفاده":"آزاد"}</p><b className="block text-[11px] text-[#176b50] mt-2">وزن خالی ظرف: {row.singleUse?"—":`${row.tare} kg`}</b>{!row.singleUse&&row.status==="فعال"&&<div className="flex gap-3 mt-4 text-[10px] font-bold"><button onClick={()=>openEdit(row)} className="text-[#176b50]">ویرایش</button><button onClick={()=>{setDamageRow(row);setDamageReason("")}} className="text-[#b84242]">ثبت خرابی</button></div>}</article>})}</div>
    {!shown.length&&<div className="bg-white rounded-2xl p-10 text-center text-[#718079]">کانتینری در این فیلتر وجود ندارد.</div>}
    {(editRow||damageRow)&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center p-6"><div className="bg-white rounded-2xl p-6 w-[680px] relative"><button onClick={()=>{setEditRow(null);setDamageRow(null)}} className="absolute left-4 top-3 text-[22px]">×</button>{editRow?<><h3 className="font-bold text-[18px]">ویرایش {editRow.qr}</h3><div className="grid grid-cols-2 gap-3 mt-4"><label className="text-[11px] font-bold">وزن خالی<input type="number" step="0.01" className={inputClass} value={form.tare} onChange={event=>setForm({...form,tare:Number(event.target.value)})}/></label><label className="text-[11px] font-bold">ظرفیت<input type="number" className={inputClass} value={form.capacity} onChange={event=>setForm({...form,capacity:Number(event.target.value)})}/></label></div><div className="flex flex-wrap gap-2 mt-4">{zones.map(zone=><button key={zone.id} onClick={()=>toggleZone(zone.id)} className={`rounded-lg border px-3 py-2 text-[10px] ${form.zones.includes(zone.id)?"bg-[#176b50] text-white":"border-[#d8e4df]"}`}>{zone.label}</button>)}</div><button onClick={saveEdit} className="w-full mt-5 bg-[#176b50] text-white rounded-xl py-3 font-bold">ذخیره تغییرات</button></>:<><h3 className="font-bold text-[18px]">ثبت خرابی {damageRow.qr}</h3><p className="text-[#718079] text-[11px] mt-1">کد ظرف حفظ و برای استفاده بعدی قفل می‌شود.</p><textarea value={damageReason} onChange={event=>setDamageReason(event.target.value)} className="w-full border rounded-xl p-3 mt-4" placeholder="علت خرابی"/><button disabled={!damageReason.trim()} onClick={markDamaged} className="w-full mt-4 bg-[#b84242] disabled:opacity-40 text-white rounded-xl py-3 font-bold">ثبت خرابی</button></>}</div></div>}
  </div>
}

function InventoryScreen() {
  const [tab, setTab] = useState<"BATCHES" | "CONTAINERS" | "OPERATIONS">("BATCHES")
  const [query, setQuery] = useState("")
  const [locationFilter,setLocationFilter]=useState("ALL")
  const [selectedBatch,setSelectedBatch]=useState<any>(null)
  const model = buildInventoryModel(false)
  const needle = query.trim().toLowerCase()
  const matchesLocation=(row:any,key:string)=>{const text=[row.stage,...row.locations,...row.destination,...row.nextActions].join(" ");if(key==="ALL")return true;if(key==="COLD_ROOM")return text.includes("سردخانه");if(key==="QC")return text.includes("کیفیت")||text.includes("قرنطینه");return text.includes(PW_ZONES[key]||key)}
  const batches = model.batches.filter((row: any) => [row.code, row.product, row.grade, ...row.containers, ...row.parents].join(" ").toLowerCase().includes(needle)&&matchesLocation(row,locationFilter))
  const containers = model.containers.filter((row: any) => [row.code, row.batchCode, row.product, row.grade, row.location, row.state].join(" ").toLowerCase().includes(needle))
  const operations = model.operations.filter((row: any) => [row.code, row.title, row.status, row.machine, ...row.inputs].join(" ").toLowerCase().includes(needle))
  const totalWeight = model.batches.reduce((sum: number, row: any) => sum + row.weightKg, 0)
  const activeOperations = model.operations.filter((row: any) => !["COMPLETED", "CANCELLED", "SCRAPPED"].includes(row.status)).length
  const tabs = [{ id: "BATCHES", label: "بچ‌های محصول", count: model.batches.length }, { id: "CONTAINERS", label: "ظروف حامل محصول", count: model.containers.length }, { id: "OPERATIONS", label: "نشست‌ها و چرخه‌ها", count: model.operations.length }] as const
  const locationFilters=[{id:"ALL",label:"همه"},{id:"RECEIVING",label:"دریافت"},{id:"COLD_ROOM",label:"سردخانه"},{id:"SORTING",label:"سورتینگ"},{id:"WASHING",label:"شست‌وشو"},{id:"SLICING",label:"اسلایس"},{id:"FREEZING",label:"فریز"},{id:"DRYING",label:"خشک‌کن"},{id:"PACKAGING",label:"بسته‌بندی"},{id:"SHIPPING",label:"ارسال"},{id:"QC",label:"قرنطینه"}]
  return <div className="flex-1 min-h-0 overflow-auto bg-[#f4f7f5] p-5 text-[#18302a]" dir="rtl">
    <div className="flex items-start justify-between mb-5"><div><small className="tracking-[.18em] text-[#718079]">STOREMESH / IRAN</small><h1 className="font-extrabold text-[28px] mt-1">موجودی</h1></div><div className="flex gap-2">{tabs.map(item=><button key={item.id} onClick={()=>setTab(item.id)} className={`h-11 rounded-xl border px-4 text-[12px] font-bold ${tab===item.id?"bg-[#176b50] border-[#176b50] text-white":"bg-white border-[#d8e4df]"}`}>{item.label}<span className="mr-2 opacity-70">{item.count}</span></button>)}</div></div>
    <div className="flex gap-3 mb-4"><div className="relative flex-1"><span className="absolute right-4 top-3 text-[#718079]">⌕</span><input aria-label="جست‌وجوی موجودی" value={query} onChange={event=>setQuery(event.target.value)} placeholder={tab==="BATCHES"?"جست‌وجوی کد، محصول، گرید یا ظرف":"جست‌وجوی کد، وضعیت یا موقعیت"} className="w-full h-12 border border-[#d8e4df] rounded-xl pr-10 pl-4 bg-white outline-none focus:border-[#176b50]"/></div><div className="bg-white border border-[#d8e4df] rounded-xl h-12 px-5 flex items-center gap-3 text-[11px]"><span>وزن خالص کل</span><b className="text-[#176b50] text-[16px]">{totalWeight.toFixed(3)} kg</b></div><div className="bg-white border border-[#d8e4df] rounded-xl h-12 px-5 flex items-center gap-3 text-[11px]"><span>عملیات باز</span><b className="text-[16px]">{activeOperations}</b></div></div>
    {tab==="BATCHES"&&<div className="flex gap-2 overflow-x-auto pb-4">{locationFilters.map(item=>{const count=model.batches.filter((row:any)=>matchesLocation(row,item.id)).length;return <button key={item.id} onClick={()=>setLocationFilter(item.id)} className={`h-9 whitespace-nowrap rounded-lg border px-3 text-[11px] ${locationFilter===item.id?"bg-[#123f35] border-[#123f35] text-white":"bg-white border-[#d8e4df]"}`}><b>{item.label}</b><span className="mr-2 font-mono">{count}</span></button>})}</div>}
    {tab === "BATCHES" && <div className="bg-white border border-[#d8e4df] rounded-2xl shadow-sm overflow-hidden"><div className="flex items-center justify-between px-5 py-4 border-b"><div className="flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-[#e1f2eb] text-[#176b50] grid place-items-center">↟</span><h2 className="font-bold text-[17px]">موجودی لحظه‌ای</h2><span className="bg-[#e1f2eb] text-[#176b50] rounded-full px-2 py-0.5 text-[10px]">{batches.length}</span></div><p className="text-[11px] text-[#718079]">مجموع وزن این نما: <b className="text-[#176b50]">{batches.reduce((sum:number,row:any)=>sum+row.weightKg,0).toFixed(3)} kg</b></p></div><div className="overflow-x-auto"><div className="min-w-[1060px]"><div className="grid grid-cols-[1.1fr_.9fr_.5fr_.7fr_.85fr_1.35fr_1fr_1.5fr_.55fr] gap-2 px-4 py-3 bg-[#fbfdfc] text-[10px] font-bold text-[#718079]"><span>کد</span><span>محصول</span><span>گرید</span><span>وزن</span><span>سن نگهداری</span><span>موقعیت / مرحله فعلی</span><span>مقصد نهایی</span><span>اقدام بعدی</span><span>جزئیات</span></div>{!batches.length?<div className="p-10 text-center text-[#718079]">موجودی منطبق با جست‌وجو و فیلتر پیدا نشد.</div>:batches.map((row:any)=><div key={row.code} className={`grid grid-cols-[1.1fr_.9fr_.5fr_.7fr_.85fr_1.35fr_1fr_1.5fr_.55fr] gap-2 px-4 py-4 border-t text-[12px] items-center hover:bg-[#fbfdfc] ${row.agingWarning?"bg-[#fffaf2]":""}`}><div><b className="font-mono text-[#163f35]">{row.code}</b>{row.rows?.length>1&&<small className="block text-[#718079] mt-1">{row.rows.length} سبد مستقل</small>}</div><b>{row.product||"—"}</b><span>{row.grade||"—"}</span><b className="text-[14px]">{row.weightKg.toFixed(3)} kg</b><div><b>{row.agingDays} روز</b>{row.agingWarning&&<small className="block mt-1 rounded-full bg-[#fff0dc] text-[#c67518] px-2 py-1 text-[9px] font-bold w-fit">در حال پیرشدن</small>}</div><span className="justify-self-start rounded-full bg-[#e1f2eb] text-[#176b50] px-3 py-1 text-[10px] font-bold">{row.locations.join("، ")} / {inventoryStageName(row.stage)}</span><span>{row.destination.join("، ")||"تعیین نشده"}</span><b>{row.nextActions.join("، ")||"فعلاً اقدام دیگری لازم نیست"}</b><button onClick={()=>setSelectedBatch(row)} className="h-9 rounded-lg border border-[#d8e4df] bg-white text-[#176b50]">دفتر</button></div>)}</div></div></div>}
    {tab === "CONTAINERS" && <div className="bg-white border border-[#d8e4df] rounded-2xl shadow-sm overflow-hidden"><div className="grid grid-cols-[1fr_1fr_1fr_.7fr_1fr_1.4fr] gap-3 bg-[#fbfdfc] px-5 py-3 text-[10px] text-[#718079] font-bold"><span>کد ظرف</span><span>محتوای فعلی</span><span>محصول / گرید</span><span>وزن خالص</span><span>موقعیت</span><span>وضعیت و اقدام بعدی</span></div>{!containers.length ? <div className="p-8 text-center text-[#718079]">ظرف حامل محصول پیدا نشد.</div> : containers.map((row: any) => <div key={`${row.code}-${row.batchCode}`} className="grid grid-cols-[1fr_1fr_1fr_.7fr_1fr_1.4fr] gap-3 px-5 py-4 border-t text-[12px] items-center"><div><InventoryKindBadge kind="CONTAINER" /><b className="block font-mono mt-2">{row.code}</b></div><b className="font-mono">{row.batchCode}</b><b>{row.product} · {row.grade}</b><b>{row.weightKg.toFixed(3)} kg</b><span>{row.location}</span><div><b>{row.state}</b><small className="block text-[#718079] mt-1">{row.nextAction}</small></div></div>)}</div>}
    {tab === "OPERATIONS" && <div className="grid grid-cols-2 gap-3">{!operations.length ? <div className="col-span-2 bg-white rounded-2xl p-8 text-center text-[#718079]">نشست یا چرخه‌ای ثبت نشده است.</div> : operations.map((row: any) => <div key={row.code} className="bg-white border border-[#d8e4df] rounded-2xl p-4"><div className="flex justify-between"><div><InventoryKindBadge kind={row.kind}/><b className="block font-mono mt-2">{row.code}</b></div><span className="bg-[#eef4f1] rounded-full px-3 py-1 text-[11px] font-bold self-start">{inventoryStatusNames[row.status]||row.status}</span></div><h3 className="font-bold mt-3">{row.title}</h3><p className="text-[11px] text-[#718079] mt-1">{row.machine} · {row.inputs.length} ورودی · {row.outputs.length} خروجی</p></div>)}</div>}
    {selectedBatch&&<div className="fixed inset-0 z-50 bg-[#09231dcc] flex items-center justify-center p-6" onClick={()=>setSelectedBatch(null)}><div className="bg-white rounded-2xl w-[920px] max-h-[86vh] overflow-auto" onClick={event=>event.stopPropagation()}><div className="flex justify-between items-center p-5 border-b"><div><small className="text-[#718079]">دفتر موجودی و رهگیری</small><h3 className="font-bold font-mono text-[20px]">{selectedBatch.code}</h3></div><button onClick={()=>setSelectedBatch(null)} className="text-[24px]">×</button></div><InventoryBatchDetails row={selectedBatch}/></div></div>}
  </div>
}

function TraceScreen() { return <div className="flex-1 min-h-0 overflow-auto"><ProductionInventorySummary history /><LegacyTraceScreen /></div> }

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
  const tasks=buildPrototypeWorkQueue(),agingTasks=tasks.filter((task:any)=>task.agingWarning)
  return (
    <div className="flex-1 bg-[#f4f7f5] p-5 overflow-auto" dir="rtl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]">کارها</h2>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[13px]">صف واقعی اقدام‌های بعدی موجودی؛ هشدار سن نگهداری اولویت کار را بالا می‌برد.</p>
        </div>
        <GreenBtn>+ کار جدید</GreenBtn>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard label="کارهای باز" value={String(tasks.length)} />
        <StatCard label="اولویت ناشی از پیرشدن" value={String(agingTasks.length)} />
        <StatCard label="قدیمی‌ترین موجودی" value={`${Math.max(0,...tasks.map((task:any)=>task.agingDays))} روز`} />
      </div>

      <Card>
        <div className="grid grid-cols-[.6fr_1fr_1fr_1.6fr_1fr] gap-3 px-4 py-3 border-b bg-[#fbfdfc] text-[10px] font-bold text-[#718079]"><span>اولویت</span><span>بچ</span><span>سن نگهداری</span><span>اقدام اپراتور</span><span>وضعیت تخصیص</span></div>
        {!tasks.length?<div className="p-10 text-center text-[#718079]">کاری در صف نیست.</div>:tasks.map((task:any)=><div key={task.id} className={`grid grid-cols-[.6fr_1fr_1fr_1.6fr_1fr] gap-3 px-4 py-4 border-b items-center text-[12px] ${task.agingWarning?"bg-[#fffaf2]":"bg-white"}`}><span className={`rounded-full px-3 py-1 text-center font-bold ${task.agingWarning?"bg-[#fbe6e6] text-[#c64545]":"bg-[#e1f2eb] text-[#176b50]"}`}>{task.priorityLabel} · {task.priority}</span><b className="font-mono">{task.batchCode}</b><div><b>{task.agingDays} روز</b>{task.agingWarning&&<small className="block text-[#c67518] mt-1">در حال پیرشدن؛ اولویت خودکار</small>}</div><div><b>{task.type}</b><small className="block text-[#718079] mt-1">{task.zone}</small></div><span>{task.responsible}</span></div>)}
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
    { screen: "containers", label: "کانتینرها", desc: "تعریف سبدها، وزن خالی، ظرفیت و زون‌های مجاز" },
    { screen: "consumables", label: "اقلام مصرفی", desc: "تعریف، موجودی و سفارش مواد مصرفی بسته‌بندی" },
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
  ensurePrototypeTestFixtures();
  const [screen, setScreen] = useState<WebScreen>("dashboard");
  const [productionHomeKey,setProductionHomeKey]=useState(0);
  const section = getActiveSidebarSection(screen);
  const { title, subtitle } = screenTitles[screen];
  const navigateFromSidebar=(next:WebScreen)=>{if(next==="production")setProductionHomeKey(value=>value+1);setScreen(next)};

  function renderScreen() {
    switch (screen) {
      case "dashboard": return <DashboardScreen navigate={setScreen} />;
      case "receiving": return <ReceivingScreen navigate={setScreen} />;
      case "containers": return <ContainersWorkspaceScreen />;
      case "inventory": return <InventoryScreen />;
      case "production": return <ProductionScreen key={productionHomeKey} />;
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
        <Sidebar screen={screen} onNavigate={navigateFromSidebar} />
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
