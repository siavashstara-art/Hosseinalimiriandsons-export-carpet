import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface AccessibilitySuiteProps {
  currentLang: AppLang;
}

export const AccessibilitySuite: React.FC<AccessibilitySuiteProps> = ({ currentLang }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('alimiri_high_contrast') === 'true';
  });
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>(() => {
    return (localStorage.getItem('alimiri_font_size') as any) || 'normal';
  });
  const [adhdReadingRuler, setAdhdReadingRuler] = useState<boolean>(() => {
    return localStorage.getItem('alimiri_adhd_ruler') === 'true';
  });
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return localStorage.getItem('alimiri_reduce_motion') === 'true';
  });
  const [dyslexicSpacing, setDyslexicSpacing] = useState<boolean>(() => {
    return localStorage.getItem('alimiri_dyslexic_spacing') === 'true';
  });
  const [rulerTop, setRulerTop] = useState<number>(200);

  // Apply High Contrast class
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('ultra-high-contrast');
      localStorage.setItem('alimiri_high_contrast', 'true');
    } else {
      document.body.classList.remove('ultra-high-contrast');
      localStorage.setItem('alimiri_high_contrast', 'false');
    }
  }, [highContrast]);

  // Apply Font Size class
  useEffect(() => {
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    document.body.classList.add(`font-size-${fontSizeLevel}`);
    localStorage.setItem('alimiri_font_size', fontSizeLevel);
  }, [fontSizeLevel]);

  // Apply Reduce Motion class
  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
      localStorage.setItem('alimiri_reduce_motion', 'true');
    } else {
      document.body.classList.remove('reduce-motion');
      localStorage.setItem('alimiri_reduce_motion', 'false');
    }
  }, [reduceMotion]);

  // Apply Dyslexic/ADHD Spacing class
  useEffect(() => {
    if (dyslexicSpacing) {
      document.body.classList.add('adhd-spacing');
      localStorage.setItem('alimiri_dyslexic_spacing', 'true');
    } else {
      document.body.classList.remove('adhd-spacing');
      localStorage.setItem('alimiri_dyslexic_spacing', 'false');
    }
  }, [dyslexicSpacing]);

  // Track mouse/touch for ADHD Reading Ruler
  useEffect(() => {
    if (!adhdReadingRuler) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setRulerTop(clientY);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [adhdReadingRuler]);

  // Text to Speech reader helper
  const speakHelp = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('مرورگر شما از قابلیت خوانش صوتی پشتیبانی نمی‌کند.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="تنظیمات دسترسی‌پذیری و تمرکز معلولین و ADHD"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black p-3.5 rounded-2xl shadow-2xl border-2 border-slate-950 flex items-center gap-2.5 transition transform hover:scale-105 active:scale-95 group"
          title="دسترسی‌پذیری ویژه کم‌بینایی، نابینایی و ADHD"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center font-black text-lg shadow">
            <i className="fa-solid fa-universal-access"></i>
          </div>
          <span className="font-black text-xs sm:text-sm">
            دسترس‌پذیری و تمرکز ADHD
          </span>
          <span className="bg-slate-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-md font-bold">
            {highContrast || adhdReadingRuler || fontSizeLevel !== 'normal' ? 'فعال' : 'تنظیمات'}
          </span>
        </button>
      </div>

      {/* ADHD Reading Ruler Guide Overlay */}
      {adhdReadingRuler && (
        <div
          className="fixed inset-x-0 pointer-events-none z-40 transition-transform duration-75"
          style={{ top: `${rulerTop - 25}px`, height: '50px' }}
        >
          {/* Top dimming veil */}
          <div
            className="fixed inset-x-0 top-0 bg-slate-950/60 pointer-events-none"
            style={{ height: `${Math.max(0, rulerTop - 25)}px` }}
          ></div>
          {/* Active reading line */}
          <div className="w-full h-full border-y-2 border-amber-400 bg-amber-400/10 backdrop-blur-[1px] shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-between px-6">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow">
              خط‌خوان تمرکز ADHD
            </span>
            <span className="text-amber-300 text-xs font-bold">
              محل مطالعه
            </span>
          </div>
          {/* Bottom dimming veil */}
          <div
            className="fixed inset-x-0 bottom-0 bg-slate-950/60 pointer-events-none"
            style={{ top: `${rulerTop + 25}px` }}
          ></div>
        </div>
      )}

      {/* Accessibility Settings Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-950 border-4 border-amber-400 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl text-white relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-400/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow">
                  <i className="fa-solid fa-universal-access"></i>
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    تنظیمات دسترس‌پذیری (کم‌بینایی، معلولیت و ADHD)
                  </h3>
                  <p className="text-xs text-amber-300 font-bold">
                    استاندارد بین‌المللی WCAG AAA و بهینه‌سازی توجه
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-lg border border-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Feature 1: Ultra High Contrast */}
            <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-black text-sm text-white flex items-center gap-2">
                  <i className="fa-solid fa-circle-half-stroke text-amber-400 text-base"></i>
                  <span>کنتراست فوق‌العاده بالا (Ultra High Contrast)</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  حذف کامل خطوط زرد کمرنگ و گرادیان‌ها؛ متن‌های سفید براق بر روی پس‌زمینه مشکی خالص با کنتراست ۲۱ به ۱.
                </p>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition ${
                  highContrast
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-800 text-white border border-slate-700'
                }`}
              >
                {highContrast ? 'فعال ✓' : 'غیرفعال'}
              </button>
            </div>

            {/* Feature 2: Font Size Scaling */}
            <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 space-y-2.5">
              <div className="font-black text-sm text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-magnifying-glass-plus text-amber-400 text-base"></i>
                  <span>اندازه قلم و درشت‌نمایی متون:</span>
                </div>
                <span className="text-xs text-amber-300 font-bold">
                  {fontSizeLevel === 'normal' ? 'معمولی (۱۰۰٪)' : fontSizeLevel === 'large' ? 'بزرگ (۱۲۵٪)' : 'خیلی درشت (۱۵۰٪)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFontSizeLevel('normal')}
                  className={`p-2.5 rounded-xl text-xs font-black border transition ${
                    fontSizeLevel === 'normal'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                      : 'bg-slate-800 text-white border-slate-700'
                  }`}
                >
                  A (معمولی)
                </button>
                <button
                  onClick={() => setFontSizeLevel('large')}
                  className={`p-2.5 rounded-xl text-sm font-black border transition ${
                    fontSizeLevel === 'large'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                      : 'bg-slate-800 text-white border-slate-700'
                  }`}
                >
                  A+ (بزرگ)
                </button>
                <button
                  onClick={() => setFontSizeLevel('xlarge')}
                  className={`p-2.5 rounded-xl text-base font-black border transition ${
                    fontSizeLevel === 'xlarge'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                      : 'bg-slate-800 text-white border-slate-700'
                  }`}
                >
                  A++ (فوق‌درشت)
                </button>
              </div>
            </div>

            {/* Feature 3: ADHD Reading Ruler */}
            <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-black text-sm text-white flex items-center gap-2">
                  <i className="fa-solid fa-ruler-horizontal text-amber-400 text-base"></i>
                  <span>خط‌خوان تمرکز ADHD (Reading Guide)</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  نوار هدایت‌کننده متحرک که به دنبال انگشت یا ماوس حرکت کرده و سایر بخش‌ها را کم‌نور می‌کند تا پرش ذهنی و حواس‌پرتی مهار شود.
                </p>
              </div>
              <button
                onClick={() => setAdhdReadingRuler(!adhdReadingRuler)}
                className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition ${
                  adhdReadingRuler
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-800 text-white border border-slate-700'
                }`}
              >
                {adhdReadingRuler ? 'فعال ✓' : 'غیرفعال'}
              </button>
            </div>

            {/* Feature 4: Reduce Motion & Distractions */}
            <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-black text-sm text-white flex items-center gap-2">
                  <i className="fa-solid fa-pause text-amber-400 text-base"></i>
                  <span>آرام‌سازی بصری و توقف انیمیشن‌ها (Reduce Motion)</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  توقف تمام لرزش‌ها، پالس‌ها و ترنزیشن‌های متحرک برای جلوگیری از خستگی چشم و بیش‌تحریکی ذهنی افراد مبتلا به ADHD.
                </p>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition ${
                  reduceMotion
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-800 text-white border border-slate-700'
                }`}
              >
                {reduceMotion ? 'فعال ✓' : 'غیرفعال'}
              </button>
            </div>

            {/* Feature 5: Dyslexia / ADHD Letter & Line Spacing */}
            <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-black text-sm text-white flex items-center gap-2">
                  <i className="fa-solid fa-text-height text-amber-400 text-base"></i>
                  <span>فاصله‌گذاری روان خطوط (خوانش آسان)</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  افزایش فاصله بین کلمات و سطرهای متن برای جلوگیری از به‌هم‌ریختگی حروف در چشم کم‌بینایان و افراد دارای نارساخوانی.
                </p>
              </div>
              <button
                onClick={() => setDyslexicSpacing(!dyslexicSpacing)}
                className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition ${
                  dyslexicSpacing
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-slate-800 text-white border border-slate-700'
                }`}
              >
                {dyslexicSpacing ? 'فعال ✓' : 'غیرفعال'}
              </button>
            </div>

            {/* Feature 6: Speech Synthesizer Tester */}
            <div className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-800 space-y-2">
              <div className="font-black text-sm text-white flex items-center gap-2">
                <i className="fa-solid fa-volume-high text-amber-400 text-base"></i>
                <span>روخوانی صوتی هوشمند (Screen Reader):</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                شنیدن عنوان و پیام بازار بزرگ فرش با صدای بلند:
              </p>
              <button
                onClick={() =>
                  speakHelp(
                    'بازار بزرگ دیجیتال فرش ایران و جهان. ارائه‌ای از فرش مرحوم حسین علی میری و پسران. هر فرش فروش در سرتاسر ایران یک غرفه دیجیتال در بازار بزرگ فرش ایران و جهان.'
                  )
                }
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
              >
                <i className="fa-solid fa-play"></i>
                <span>پخش صوتی عنوان و شعار بازار</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-2xl text-sm shadow-xl hover:opacity-95 transition"
            >
              ذخیره و بستن پنجره دسترسی‌پذیری
            </button>
          </div>
        </div>
      )}
    </>
  );
};
