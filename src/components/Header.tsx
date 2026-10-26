import React from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';
import brandCrestImg from '../assets/images/alimiri_brand_crest_1792998593279.jpg';

interface HeaderProps {
  currentLang: AppLang;
  onLanguageChange: (lang: AppLang) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
}) => {
  const t = i18n[currentLang];

  const tabs = [
    { id: 'counter', labelFa: 'شمارشگر برکت', labelEn: 'Blessing Counter', labelAr: 'عداد البركة', icon: 'fa-heart-pulse' },
    { id: 'raj', labelFa: 'رجشمار هوشمند', labelEn: 'Smart Raj Counter', labelAr: 'عداد الرج', icon: 'fa-camera-retro' },
    { id: 'evaluator', labelFa: 'کارشناسی و شناسنامه', labelEn: 'AI Appraisal', labelAr: 'التقييم والهوية', icon: 'fa-award' },
    { id: 'translator', labelFa: 'مترجم اصطلاحات', labelEn: 'Bazaar Translator', labelAr: 'مترجم السوق', icon: 'fa-microphone' },
    { id: 'story', labelFa: 'استوری و پست‌ساز', labelEn: 'Story Creator', labelAr: 'صانع القصص', icon: 'fa-photo-film' },
    { id: 'calculator', labelFa: 'محاسبه‌گر متراژ', labelEn: 'Knot Calculator', labelAr: 'حاسبة النسيج', icon: 'fa-calculator' },
    { id: 'creator', labelFa: 'شناسنامه خالق اثر', labelEn: 'Creator Profile', labelAr: 'سيرة المبتكر', icon: 'fa-id-card' },
  ];

  return (
    <header className="space-y-4 mb-6">
      {/* Language Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between glass-card p-3 rounded-2xl shadow-xl gap-3">
        <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
          <i className="fa-solid fa-globe text-amber-400 text-base"></i>
          <span>{t.selectLang}</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => onLanguageChange('fa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              currentLang === 'fa'
                ? 'gold-grad text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            فارسی
          </button>
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              currentLang === 'en'
                ? 'gold-grad text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => onLanguageChange('ar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              currentLang === 'ar'
                ? 'gold-grad text-slate-950 shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Brand & Tribute Header Box */}
      <div className="glass-card rounded-3xl p-6 text-center space-y-4 shadow-2xl border-t-2 border-amber-500 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full p-1 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 mb-2 overflow-hidden bg-slate-950">
            <img
              src={brandCrestImg}
              alt="Hossein Alimiri & Sons Crest"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-black gold-text tracking-tight">
            {t.brandTitle}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-medium max-w-xl mx-auto mt-1 leading-relaxed">
            {t.brandSub}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs text-amber-300 font-bold shadow-inner">
          <i className="fa-solid fa-location-dot text-amber-400"></i>
          <span>{t.brandAddress}</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const label =
            currentLang === 'en'
              ? tab.labelEn
              : currentLang === 'ar'
              ? tab.labelAr
              : tab.labelFa;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'gold-grad text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
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
