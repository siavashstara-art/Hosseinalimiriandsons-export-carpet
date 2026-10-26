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
    { id: 'counter', labelFa: 'شمارشگر برکت', labelEn: 'Blessing Counter', icon: 'fa-heart-pulse' },
    { id: 'authmod', labelFa: '🔑 احراز هویت ملی و اصالت‌سنجی', labelEn: 'National ID & Auth', icon: 'fa-fingerprint' },
    { id: 'serviceshop', labelFa: '🛍️ فروشگاه خدمات و پنل درآمدزایی', labelEn: 'Services & Monetization', icon: 'fa-store' },
    { id: 'tour360', labelFa: '🌐 تور مجازی ۳۶۰ درجه', labelEn: '360 Virtual Tour', icon: 'fa-vr-cardboard' },
    { id: 'timedauction', labelFa: '⏳ اتاق مزایده زمان‌دار', labelEn: 'Timed Auction Room', icon: 'fa-gavel' },
    { id: 'booths', labelFa: 'حجره‌های بازار (کد ملی)', labelEn: 'Merchant Booths', icon: 'fa-store' },
    { id: 'homelistings', labelFa: '🏠 آگهی خانگی (عموم)', labelEn: 'Sell Home Rug', icon: 'fa-house-chimney' },
    { id: 'customorder', labelFa: 'سفارش بافت ویژه (مشاهیر/پرچم)', labelEn: 'Custom Orders', icon: 'fa-paintbrush' },
    { id: 'appraisalreq', labelFa: 'درخواست کارشناسی فرش', labelEn: 'Appraisal Request', icon: 'fa-microchip' },
    { id: 'machinerugs', labelFa: 'فرش ماشینی (شانه/تراکم)', labelEn: 'Machine Rugs', icon: 'fa-industry' },
    { id: 'raj', labelFa: 'رجشمار هوشمند', labelEn: 'Smart Raj Counter', icon: 'fa-camera-retro' },
    { id: 'evaluator', labelFa: 'کارشناسی AI', labelEn: 'AI Appraisal', icon: 'fa-award' },
    { id: 'museum', labelFa: 'تالار موزه و حراجی', labelEn: 'Museum & Auctions', icon: 'fa-landmark' },
    { id: 'referrals', labelFa: 'لیگ معرفان و ستاره‌ها', labelEn: 'Referral League', icon: 'fa-trophy' },
    { id: 'translator', labelFa: 'مترجم اصطلاحات', labelEn: 'Bazaar Translator', icon: 'fa-microphone' },
    { id: 'story', labelFa: 'استوری و پست‌ساز', labelEn: 'Story Creator', icon: 'fa-photo-film' },
    { id: 'calculator', labelFa: 'محاسبه‌گر قیمت و متراژ', labelEn: 'Price & Knot Calc', icon: 'fa-calculator' },
    { id: 'videopromo', labelFa: '🎬 تیزر کافه بازار (۳۰ ثانیه)', labelEn: 'Bazaar Promo Video', icon: 'fa-clapperboard' },
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center pb-2">
                <span className="text-[9px] font-black text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded-full border border-amber-500/50 shadow">
                  نشان رسمی بازار
                </span>
              </div>
            </div>
            {/* Outer decorative ring */}
            <div className="absolute -inset-1 rounded-full border border-amber-500/40 pointer-events-none animate-pulse"></div>
          </div>

          {/* Logo Badge Inscription as requested by user */}
          <div className="px-4 py-1 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black text-xs md:text-sm shadow-inner tracking-wider">
            {t.logoBadgeText || "بازار بزرگ دیجیتال فرش ایران و جهان"}
          </div>

          {/* Main App Title - Large Bold Font */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black gold-text tracking-tight drop-shadow-md text-center leading-tight">
            {t.brandTitle}
          </h1>

          {/* Subtitle directly below in parentheses with smaller font */}
          <p className="text-sm sm:text-base md:text-lg text-amber-300 font-bold italic tracking-wide text-center mt-1">
            {t.brandSub}
          </p>

          {/* Slogan Banner */}
          <div className="mt-3 text-xs sm:text-sm font-bold bg-amber-500/15 border border-amber-500/40 text-amber-200 px-4 py-2 rounded-2xl shadow-inner max-w-2xl mx-auto leading-relaxed flex items-center justify-center gap-2">
            <i className="fa-solid fa-store text-amber-400 shrink-0"></i>
            <span>{t.brandSlogan}</span>
          </div>
        </div>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs text-amber-300 font-bold shadow-inner mt-2">
          <i className="fa-solid fa-gem text-amber-400"></i>
          <span>{themeConfig.tributeHighlight}</span>
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'gold-grad text-slate-950 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <i className={`fa-solid ${tab.icon} ${isActive ? 'text-slate-950' : 'text-amber-400'}`}></i>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

