import { useState } from "react";
import WebApp from "./web/WebApp";
import PDAApp from "./pda/PDAApp";
import TerminalApp from "./terminal/TerminalApp";

type AppMode = "hub" | "web" | "pda" | "terminal";

function HubCard({
  label,
  sublabel,
  count,
  desc,
  onClick,
  accent,
}: {
  label: string;
  sublabel: string;
  count: string;
  desc: string;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-start p-8 rounded-3xl text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold text-[16px] transition-transform group-hover:scale-110"
        style={{ background: accent }}
      >
        SM
      </div>
      <div className="mb-2">
        <span
          className="font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold text-[11px] tracking-[2px] mb-1 block"
          style={{ color: accent }}
        >
          {sublabel}
        </span>
        <h3 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[26px]" dir="rtl">
          {label}
        </h3>
      </div>
      <p className="font-['Vazirmatn:Regular',sans-serif] text-[#8db8a8] text-[14px] mb-5 leading-relaxed" dir="rtl">
        {desc}
      </p>
      <div className="flex items-center gap-2">
        <span
          className="font-['Vazirmatn:Regular',sans-serif] text-[14px] px-3 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)", color: "#adc8bf", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          {count}
        </span>
        <span className="font-['Vazirmatn:Regular',sans-serif] text-[#5c8d7d] text-[13px]">وارد شوید →</span>
      </div>
    </button>
  );
}

function Hub({ onEnter }: { onEnter: (mode: AppMode) => void }) {
  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: "linear-gradient(171deg, #0d3028 0%, #1d7659 100%)" }}
    >
      {/* Header */}
      <div className="px-12 py-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#c6a45c] rounded-2xl flex items-center justify-center" style={{ width: 48, height: 48 }}>
            <span className="font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold text-white text-[14px]">SM</span>
          </div>
          <div>
            <span className="font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold text-[#dfc176] text-[11px] tracking-[2px] block">
              STOREMESH · COMPLETE UX INVENTORY
            </span>
            <span className="font-['Vazirmatn:Regular',sans-serif] text-[#adc8bf] text-[13px]">
              نسخه پروتوتایپ کامل · ۳۶ صفحه
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {["۲۰ صفحه Web", "۹ صفحه PDA", "۷ صفحه Terminal", "۳۶ Screen"].map((tag) => (
            <span
              key={tag}
              className="font-['Vazirmatn:Regular',sans-serif] text-white text-[14px] px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)", border: "0.9px solid rgba(255,255,255,0.13)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="px-12 pb-10">
        <p className="font-['Vazirmatn:ExtraBold',sans-serif] font-extrabold text-[#dfc176] text-[11px] tracking-[2px] mb-3">
          STOREMESH · COMPLETE UX INVENTORY
        </p>
        <h1 className="font-['Vazirmatn:Bold',sans-serif] font-bold text-white text-[48px] mb-3" dir="rtl">
          تمام صفحات محصول در یک Canvas
        </h1>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#c4d8d1] text-[18px]">
          Web Operations + PDA + Industrial Terminal · RTL · Vazirmatn · پروتوتایپ تعاملی کامل
        </p>
      </div>

      {/* Cards */}
      <div className="px-12 pb-16 grid grid-cols-3 gap-6 flex-1">
        <HubCard
          label="مرکز عملیات وب"
          sublabel="WEB OPERATIONS · 20 SCREENS"
          count="۲۰ صفحه"
          desc="داشبورد، دریافت، موجودی، تولید، کیفیت، بسته‌بندی، ارسال، رهگیری و تنظیمات — تمام Routeهای واقعی storemesh-web در یک دسکتاپ کامل"
          accent="#c6a45c"
          onClick={() => onEnter("web")}
        />
        <HubCard
          label="اپلیکیشن PDA"
          sublabel="PDA · 9 SCREENS"
          count="۹ صفحه"
          desc="Touch-first، اسکن سخت‌افزاری و صف آفلاین — ورود اپراتور، انتخاب نقش، اسکن QR، موجودی سیار، کارها، ارسال و انتقال داخلی"
          accent="#35a17b"
          onClick={() => onEnter("pda")}
        />
        <HubCard
          label="ترمینال ایستگاهی"
          sublabel="TERMINAL · 7 SCREENS"
          count="۷ صفحه"
          desc="جریان‌های کامل دستگاه‌محور — ورود، انتخاب وظیفه، دریافت و توزین، بسته‌بندی، کنترل کیفیت، اقلام مصرفی، انتقال بین سایت و تکمیل"
          accent="#176b50"
          onClick={() => onEnter("terminal")}
        />
      </div>

      {/* Footer */}
      <div className="px-12 pb-8 border-t border-[rgba(255,255,255,0.08)] pt-6 flex justify-between items-center">
        <div>
          <p className="font-['Vazirmatn:Regular',sans-serif] text-[#5c8d7d] text-[13px]">WEB OPERATIONS · 20 SCREENS</p>
          <p className="font-['Vazirmatn:Bold',sans-serif] font-bold text-[#18302a] text-[22px]" dir="rtl" style={{ color: "#adc8bf" }}>مرکز عملیات وب</p>
        </div>
        <p className="font-['Vazirmatn:Regular',sans-serif] text-[#718079] text-[14px]" dir="rtl">تمام Routeهای واقعی storemesh-web</p>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<AppMode>("hub");

  if (mode === "web") return <WebApp onExit={() => setMode("hub")} />;
  if (mode === "pda") return <PDAApp onExit={() => setMode("hub")} />;
  if (mode === "terminal") return <TerminalApp onExit={() => setMode("hub")} />;

  return <Hub onEnter={setMode} />;
}
