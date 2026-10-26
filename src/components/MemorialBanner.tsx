import React from 'react';
import { AppLang } from '../types';

interface MemorialBannerProps {
  currentLang: AppLang;
}

export const MemorialBanner: React.FC<MemorialBannerProps> = ({ currentLang }) => {
  return (
    <div className="space-y-6">
      {/* Grand Market Visual Showcase (As requested: Traditional carpet market with spread Persian carpet) */}
      <div className="glass-card rounded-3xl p-4 md:p-6 shadow-2xl border-2 border-amber-500/70 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/40">
        <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl group">
          <img
            src="/src/assets/images/grand_carpet_market_spread_1793033316697.jpg"
            alt="بازار بزرگ دیجیتال فرش ایران و جهان با قالی پهن شده در سرای اصالت"
            className="w-full h-64 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black w-fit mb-2 shadow-lg">
              <i className="fa-solid fa-store"></i>
              <span>بازار بزرگ دیجیتال فرش ایران و جهان</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-amber-300 drop-shadow-md">
              سرای باشکوه فرش ایرانی؛ نمایشگاه دائمی سراسر کشور
            </h2>
            <p className="text-xs md:text-sm text-slate-200 mt-2 max-w-3xl leading-relaxed">
              «هر فرش‌فروش در سرتاسر ایران یک غرفه دیجیتال در بازار بزرگ فرش ایران و جهان». ارائه شده توسط فرش مرحوم حسین علی میری و پسران (تهران، خیابان خیام شمالی، روبروی سید نصرالدین، پلاک ۴۸).
            </p>
          </div>
        </div>
      </div>

      {/* Memorial Tribute Banner */}
      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl border-2 border-amber-500/60 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl p-1.5 gold-grad shadow-2xl shadow-amber-500/20 overflow-hidden bg-slate-950">
              <img
                src="/assets/aistudio/IMG_20180404_194737_7ae1e915.jpg"
                alt="مرحوم حاج حسین‌علی میری"
                className="w-full h-full object-cover rounded-xl filter sepia-[0.08] saturate-[1.12] brightness-[1.03] contrast-[1.02]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-slate-950">
              روحش شاد و یادش گرامی
            </div>
          </div>

          <div className="space-y-3 text-center md:text-right flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-inner">
              <i className="fa-solid fa-gem text-amber-400"></i>
              <span>آستان مقدس اصالت و هنر فرش دستباف ایران و جهان</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black gold-text tracking-tight leading-snug">
              یادبود استاد فقید و پیشکسوت صنف فرش: مرحوم حاج حسین‌علی میری
            </h3>

            <p className="text-sm md:text-base text-amber-200 font-bold italic tracking-wide leading-relaxed">
              (ارائه‌ای از فرش مرحوم حسین علی میری و پسران)
            </p>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              این پلتفرم و بزرگ‌بازار دیجیتال، گامی‌است استوار در راستای جاودان‌سازی نام، راه و مرام مردان بزرگی که عمر خود را صرف اعتلای هنر اصیل فرش ایرانی، صداقت در تجارت و تکریم بافندگان و تجار در سراسر جهان نمودند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

