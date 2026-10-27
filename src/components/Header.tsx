import React from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';
import { CULTURAL_THEMES } from '../constants/themes';
import { LocationSelector } from './LocationSelector';
import brandCrestImg from '../assets/images/alimiri_brand_crest_1792998593279.jpg';

interface HeaderProps {
  currentLang: AppLang;
  onLanguageChange: (lang: AppLang) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  selectedProvinceId: string;
  selectedCity: string;
  onSelectRegion: (provinceId: string, provinceNameFa: string, cityNameFa: string) => void;
  onOpenWizard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
  isLightMode,
  onToggleTheme,
  selectedProvinceId,
  selectedCity,
  onSelectRegion,
  onOpenWizard,
}) => {
  const t = i18n[currentLang] || i18n['fa'];
  const themeConfig = CULTURAL_THEMES[currentLang] || CULTURAL_THEMES['fa'];

  const languages: { id: AppLang; label: string; flag: string }[] = [
    { id: 'fa', label: 'فارسی / دری', flag: '🇮🇷' },
    { id: 'zh', label: '中文', flag: '🇨🇳' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { id: 'fr', label: 'Français', flag: '🇫🇷' },
    { id: 'it', label: 'Italiano', flag: '🇮🇹' },
    { id: 'ja', label: '日本語', flag: '🇯🇵' },
  ];

  const tabs = [
    { id: 'raj', labelFa: '🔍 ردشمار و رج‌شمار قالی', labelEn: 'Raj & Knot Counter', icon: 'fa-ruler-combined' },
    { id: 'dyeai', labelFa: '🔬 آزمایشگاه رنگرزی گیاهی (AI)', labelEn: 'Dye AI Lab', icon: 'fa-microscope' },
    { id: 'arrug', labelFa: '🏠 پرو واقعیت افزوده فرش (AR)', labelEn: 'AR Rug Visualizer', icon: 'fa-cube' },
    { id: 'voiceagent', labelFa: '🎙️ مشاور صوتی پیشکسوت بازار', labelEn: 'Bazaar Voice Agent', icon: 'fa-headset' },
    { id: 'passport', labelFa: '🔗 شناسنامه بلاکچین و NFT', labelEn: 'Blockchain Passport', icon: 'fa-passport' },
    { id: 'story', labelFa: '📱 استوریساز تلگرام و اینستاگرام', labelEn: 'Story & Post Creator', icon: 'fa-bullhorn' },
    { id: 'booths', labelFa: '🏪 حجره‌های بازار (کد ملی)', labelEn: 'Merchant Booths', icon: 'fa-store' },
    { id: 'tour360', labelFa: '🌐 تور مجازی ۳۶۰ درجه', labelEn: '360 Virtual Tour', icon: 'fa-vr-cardboard' },
    { id: 'timedauction', labelFa: '⏳ اتاق مزایده زمان‌دار', labelEn: 'Timed Auction Room', icon: 'fa-gavel' },
    { id: 'serviceshop', labelFa: '🛍️ فروشگاه خدمات و پنل درآمدزایی', labelEn: 'Services & Monetization', icon: 'fa-bag-shopping' },
    { id: 'authmod', labelFa: '🔑 احراز هویت ملی و اصالت‌سنجی', labelEn: 'National ID & Auth', icon: 'fa-fingerprint' },
    { id: 'homelistings', labelFa: '🏠 آگهی خانگی (عموم)', labelEn: 'Sell Home Rug', icon: 'fa-house-chimney' },
    { id: 'customorder', labelFa: 'سفارش بافت ویژه (مشاهیر/پرچم)', labelEn: 'Custom Orders', icon: 'fa-paintbrush' },
    { id: 'appraisalreq', labelFa: 'درخواست کارشناسی فرش', labelEn: 'Appraisal Request', icon: 'fa-microchip' },
    { id: 'machinerugs', labelFa: 'فرش ماشینی (شانه/تراکم)', labelEn: 'Machine Rugs', icon: 'fa-industry' },
    { id: 'evaluator', labelFa: 'کارشناسی AI', labelEn: 'AI Appraisal', icon: 'fa-award' },
    { id: 'museum', labelFa: 'تالار موزه و حراجی', labelEn: 'Museum & Auctions', icon: 'fa-landmark' },
    { id: 'referrals', labelFa: 'لیگ معرفان و ستاره‌ها', labelEn: 'Referral League', icon: 'fa-trophy' },
    { id: 'calculator', labelFa: 'محاسبه‌گر قیمت و متراژ', labelEn: 'Price & Knot Calc', icon: 'fa-calculator' },
    { id: 'translator', labelFa: 'مترجم اصطلاحات بازار', labelEn: 'Bazaar Translator', icon: 'fa-microphone' },
    { id: 'videopromo', labelFa: '🎬 تیزر کافه بازار (۳۰ ثانیه)', labelEn: 'Bazaar Promo Video', icon: 'fa-clapperboard' },
    { id: 'counter', labelFa: '📿 شمارشگر برکت و یادبود', labelEn: 'Blessing Counter', icon: 'fa-heart-pulse' },
    { id: 'report', labelFa: '🚩 گزارش تخلفات', labelEn: 'Report Violation', icon: 'fa-flag' },
    { id: 'adminads', labelFa: '📢 مدیریت تبلیغات (ادمین)', labelEn: 'Admin Ads', icon: 'fa-bullhorn' },
    { id: 'charter', labelFa: 'منشور حقوقی و اخلاقی', labelEn: 'Ethical Charter', icon: 'fa-scale-balanced' },
    { id: 'creator', labelFa: 'شناسنامه خالق اثر', labelEn: 'Creator Profile', icon: 'fa-id-card' },
  ];

  return (
    <header className="space-y-4 mb-6">
      {/* 8-Language Cultural Dynamic Theme Selector */}
      <div className="glass-card p-3 rounded-2xl shadow-2xl space-y-2 border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
            <i className="fa-solid fa-globe text-amber-400 text-sm"></i>
            <span>زبان و موتور تمینگ فرهنگی (Cultural Theme Engine):</span>
          </div>

          <button
            onClick={onToggleTheme}
            title="تغییر تم تاریک / روشن"
            className="px-3 py-1 rounded-xl text-xs font-bold transition bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow active:scale-95"
          >
            <i className={`fa-solid ${isLightMode ? 'fa-moon text-indigo-400' : 'fa-sun text-amber-400'}`}></i>
            <span className="hidden sm:inline">{isLightMode ? 'شب (Dark)' : 'روز (Light)'}</span>
          </button>
        </div>

        {/* 8 Language Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 pt-1">
          {languages.map((lang) => {
            const isSelected = currentLang === lang.id;

            return (
              <button
                key={lang.id}
                onClick={() => onLanguageChange(lang.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'gold-grad text-slate-950 shadow-lg scale-105 font-black'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="truncate">{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cultural Heritage Header Box */}
      <div className="glass-card rounded-3xl p-6 text-center space-y-3 shadow-2xl border-t-2 border-amber-500 relative overflow-hidden">
        <div className="relative flex flex-col items-center justify-center space-y-2">
          {/* Royal Logo Emblem with Inscribed Title */}
          <div className="relative flex items-center justify-center">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1.5 gold-grad shadow-2xl shadow-amber-500/20 overflow-hidden bg-slate-950 flex items-center justify-center relative group">
              <img
                src={brandCrestImg}
                alt="Hossein Ali Miri & Sons Crest"
                className="w-full h-full object-cover rounded-full opacity-90 group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end justify-center pb-2">
                <span className="text-xs font-black text-white bg-black px-3 py-1 rounded-full border-2 border-amber-400 shadow-xl">
                  نشان رسمی بازار
                </span>
              </div>
            </div>
            {/* Outer decorative ring */}
            <div className="absolute -inset-1 rounded-full border-2 border-amber-400 pointer-events-none animate-pulse"></div>
          </div>

          {/* Logo Badge Inscription - High Contrast WCAG AAA */}
          <div className="px-5 py-2 rounded-2xl border-2 border-amber-400 bg-slate-950 text-white font-black text-xs md:text-sm shadow-xl tracking-wider inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-white">{t.logoBadgeText || "بازار بزرگ دیجیتال فرش ایران و جهان"}</span>
          </div>

          {/* Main App Title - Large Bold Font with Maximum Contrast */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,1)] text-center leading-tight">
            <span className="text-white">
              {t.brandTitle}
            </span>
          </h1>

          {/* Subtitle directly below in parentheses - High Contrast WCAG AAA (Crisp White on Solid Dark) */}
          <div className="mt-2 inline-block">
            <div className="bg-slate-950 text-white border-2 border-amber-400 px-5 py-2 rounded-2xl shadow-xl font-black text-sm sm:text-base md:text-lg flex items-center justify-center gap-2.5">
              <i className="fa-solid fa-certificate text-amber-400 text-base shrink-0"></i>
              <span className="text-white font-black tracking-wide">
                {t.brandSub}
              </span>
            </div>
          </div>

          {/* Slogan Banner - High Contrast, Bold, Radiant & Fully Visible with White Text */}
          <div className="mt-3.5 px-5 py-3.5 rounded-2xl border-2 border-amber-400 bg-slate-950 text-white shadow-2xl max-w-2xl mx-auto leading-relaxed flex items-center justify-center gap-3 text-center">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg font-black">
              <i className="fa-solid fa-store text-base"></i>
            </span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 shrink-0">
                شعار سراسری:
              </span>
              <span className="text-xs sm:text-sm md:text-base font-black tracking-normal leading-snug text-white">
                {t.brandSlogan}
              </span>
            </div>
          </div>
        </div>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-slate-950 border-2 border-amber-400/80 px-5 py-2 rounded-full text-xs text-white font-black shadow-lg mt-2">
          <i className="fa-solid fa-gem text-amber-400 text-sm"></i>
          <span className="text-white font-black">{themeConfig.tributeHighlight}</span>
        </div>

        {/* Elder & Traditional Merchant Step-by-Step Guide Trigger */}
        {onOpenWizard && (
          <button
            type="button"
            onClick={onOpenWizard}
            className="mt-3 w-full max-w-2xl mx-auto py-3.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm sm:text-base md:text-lg border-2 border-white shadow-[0_0_30px_rgba(245,158,11,0.7)] flex items-center justify-between gap-3 transition hover:scale-[1.01] active:scale-98 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-lg text-xl group-hover:rotate-12 transition">
                <i className="fa-solid fa-compass"></i>
              </span>
              <div className="text-right">
                <div className="font-black text-slate-950 flex flex-wrap items-center gap-2">
                  <span>راهنمای قدم‌به‌قدم ویژه بازاریان سنتی و پیشکسوتان</span>
                  <span className="bg-emerald-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    بدون نیاز به کار با موبایل
                  </span>
                </div>
                <div className="text-slate-900 text-xs font-bold hidden sm:block mt-0.5">
                  تمام مراحل ملی: ثبت با کد ملی، خط‌کش ۷ سانت، عکسبرداری قالی، و استوری تلگرام
                </div>
              </div>
            </div>
            <div className="bg-slate-950 text-amber-400 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black shrink-0 flex items-center gap-1.5 shadow">
              <span>شروع کنید</span>
              <i className="fa-solid fa-arrow-left"></i>
            </div>
          </button>
        )}
      </div>

      {/* Quick Jump Bar for Essential Tools (Story Maker, Raj Counter, Blessing Counter, Services) */}
      <div className="glass-card p-3 rounded-2xl border border-amber-500/30 shadow-lg space-y-2">
        <div className="text-xs font-black text-white flex items-center gap-2 px-1">
          <i className="fa-solid fa-bolt text-amber-400 text-sm"></i>
          <span>دسترسی مستقیم و فوری به ابزارهای کلیدی:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => onTabChange('raj')}
            className={`p-2.5 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
              activeTab === 'raj'
                ? 'gold-grad text-slate-950 border-amber-300 font-black'
                : 'bg-slate-950 border-amber-400/80 hover:border-amber-400 text-white'
            }`}
          >
            <i className="fa-solid fa-ruler-combined text-amber-400 text-sm"></i>
            <span className={activeTab === 'raj' ? 'text-slate-950' : 'text-white'}>ردشمار و رج‌شمار</span>
          </button>

          <button
            onClick={() => onTabChange('story')}
            className={`p-2.5 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
              activeTab === 'story'
                ? 'gold-grad text-slate-950 border-amber-300 font-black'
                : 'bg-slate-950 border-amber-400/80 hover:border-amber-400 text-white'
            }`}
          >
            <i className="fa-brands fa-instagram text-pink-400 text-sm"></i>
            <i className="fa-brands fa-telegram text-sky-400 text-sm"></i>
            <span className={activeTab === 'story' ? 'text-slate-950' : 'text-white'}>استوریساز</span>
          </button>

          <button
            onClick={() => onTabChange('booths')}
            className={`p-2.5 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
              activeTab === 'booths'
                ? 'gold-grad text-slate-950 border-amber-300 font-black'
                : 'bg-slate-950 border-amber-400/80 hover:border-amber-400 text-white'
            }`}
          >
            <i className="fa-solid fa-store text-amber-400 text-sm"></i>
            <span className={activeTab === 'booths' ? 'text-slate-950' : 'text-white'}>حجره‌های بازار</span>
          </button>

          <button
            onClick={() => onTabChange('tour360')}
            className={`p-2.5 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
              activeTab === 'tour360'
                ? 'gold-grad text-slate-950 border-amber-300 font-black'
                : 'bg-slate-950 border-amber-400/80 hover:border-amber-400 text-white'
            }`}
          >
            <i className="fa-solid fa-vr-cardboard text-amber-400 text-sm"></i>
            <span className={activeTab === 'tour360' ? 'text-slate-950' : 'text-white'}>تور ۳۶۰ درجه</span>
          </button>

          <button
            type="button"
            onClick={onOpenWizard}
            className="p-2.5 rounded-xl border-2 text-xs font-black flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md bg-emerald-700 hover:bg-emerald-600 border-amber-300 text-white col-span-2 sm:col-span-1"
          >
            <i className="fa-solid fa-compass text-amber-300 text-sm animate-pulse"></i>
            <span className="text-white">راهنمای سنتی</span>
          </button>
        </div>
      </div>

      {/* Regional Location Selector Bar */}
      <LocationSelector
        selectedProvinceId={selectedProvinceId}
        selectedCity={selectedCity}
        onSelectRegion={onSelectRegion}
      />

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const label = currentLang === 'en' ? tab.labelEn : tab.labelFa;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-black whitespace-nowrap shrink-0 transition-all shadow-md ${
                isActive
                  ? 'gold-grad text-slate-950 border-2 border-amber-300 scale-[1.03]'
                  : 'bg-black hover:bg-slate-900 text-white border-2 border-amber-400/80 hover:border-amber-400'
              }`}
            >
              <i className={`fa-solid ${tab.icon} ${isActive ? 'text-slate-950' : 'text-amber-300'} text-base`}></i>
              <span className={isActive ? 'text-slate-950' : 'text-white'}>{label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

