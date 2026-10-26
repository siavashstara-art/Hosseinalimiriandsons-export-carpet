import React, { useState } from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';

interface BazaarVideoPromoProps {
  currentLang: AppLang;
}

export const BazaarVideoPromo: React.FC<BazaarVideoPromoProps> = ({ currentLang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSecond, setCurrentSecond] = useState(0);

  const scriptTimeline = [
    { second: '۰۰:۰۰ - ۰۰:۰۵', title: 'مقدمه و هویت', desc: 'نمایش نشان رسمی بازار و یادبود مرحوم حاج حسین علی میری (تهران، خیابان خیام).' },
    { second: '۰۰:۰۵ - ۰۰:۱۲', title: 'شعار کلیدی', desc: 'هر فرش‌فروش در سراسر ایران یک غرفه دیجیتال در بازار بزرگ فرش ایران و جهان.' },
    { second: '۰۰:۱۲ - ۰۰:۲۰', title: 'قابلیت‌های هوش مصنوعی', desc: 'رجشمار هوشمند با دوربین، کارشناسی تخصصی اصالت و تشخیص گره پشت فرش.' },
    { second: '۰۰:۲۰ - ۰۰:۲۶', title: 'استان‌بندی و حجره‌ها', desc: 'تفکیک جغرافیایی بازار غرفه‌داران و آگهی‌های مردمی در سراسر استان‌های کشور.' },
    { second: '۰۰:۲۶ - ۰۰:۳۰', title: 'دعوت به اقدام (CTA)', desc: 'دانلود رایگان از کافه بازار و نصب فوری پلتفرم تخصصی.' },
  ];

  return (
    <section className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl border border-amber-500/40">
      <div className="flex flex-wrap items-center justify-between border-b border-amber-500/30 pb-4 gap-3">
        <div>
          <h2 className="text-base md:text-lg font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-clapperboard text-amber-400"></i>
            <span>تیزر تبلیغاتی ۳۰ ثانیه‌ای کافه بازار و آپارات</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            سناریو، استوری‌برد و پیش‌نمایش ویدیوی معرفی رسمی جهت انتشار در کافه بازار و آپارات
          </p>
        </div>

        <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/30">
          🎬 ۳۰ ثانیه استاندارد کافه بازار
        </span>
      </div>

      {/* Video Preview Simulator */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/50 p-6 shadow-2xl text-center space-y-4">
        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse shadow">
          🔴 پیش‌نمایش زنده تیزر (30s)
        </div>

        <div className="py-8 space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full gold-grad flex items-center justify-center text-slate-950 shadow-2xl">
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-2xl`}></i>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-black text-amber-300">
              {isPlaying ? 'در حال پخش تیزر ۳۰ ثانیه‌ای...' : 'برای شروع پخش تیزر کلیک کنید'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              بزرگ بازار دیجیتال فرش ایران و جهان — ارائه‌ای از فرش مرحوم حسین علی میری و پسران
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-6 py-2.5 rounded-xl gold-grad text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition"
          >
            {isPlaying ? 'توقف پخش' : 'پخش تیزر'}
          </button>
          <button
            onClick={() => alert('لینک دانلود فایل ویدیو (MP4 کیفیت ۱۰۸۰p) برای کافه بازار کپی شد.')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs border border-amber-500/40 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i>
            <span>دانلود فایل ویدیو (MP4)</span>
          </button>
        </div>
      </div>

      {/* Script Timeline Breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
          <i className="fa-solid fa-list-check"></i>
          <span>سناریوی لحظه‌به‌لحظه (Timeline Script):</span>
        </h3>

        <div className="grid gap-2.5">
          {scriptTimeline.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
                  {item.second}
                </span>
                <div>
                  <h4 className="font-bold text-amber-200 text-xs">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-center">
                بخش {idx + 1} از ۵
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Café Bazaar Submission Notes */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
        <div className="font-bold flex items-center gap-1.5">
          <i className="fa-solid fa-circle-info text-amber-400"></i>
          <span>نکات انتشار در کافه بازار و آپارات:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-300">
          <li>فرمت ویدیو: MP4 (H.264 / AAC) با رزولوشن ۱۰۸۰×۱۹۲۰ (عمودی برای اسکرین‌شات و پرومو کافه بازار).</li>
          <li>حداکثر حجم مجاز: کمتر از ۱۵ مگابایت برای بارگذاری روان در پنل توسعه‌دهندگان کافه بازار.</li>
          <li>ذکر دقیق آدرس دفتر مرکزی: تهران، خیابان خیام شمالی، روبروی سید نصرالدین، بازار فرش ایران، پلاک ۴۸.</li>
        </ul>
      </div>
    </section>
  );
};
