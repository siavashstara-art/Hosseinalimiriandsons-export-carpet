import React, { useState, useEffect } from 'react';
import { AppLang } from './types';
import { i18n } from './constants/translations';
import { CULTURAL_THEMES } from './constants/themes';
import { Header } from './components/Header';
import { BlessingCounter } from './components/BlessingCounter';
import { BoothManager } from './components/BoothManager';
import { CustomOrderPortal } from './components/CustomOrderPortal';
import { AppraisalRequestPortal } from './components/AppraisalRequestPortal';
import { MachineRugSection } from './components/MachineRugSection';
import { SmartRajCounter } from './components/SmartRajCounter';
import { CarpetEvaluator } from './components/CarpetEvaluator';
import { MuseumGallery } from './components/MuseumGallery';
import { ReferralLeague } from './components/ReferralLeague';
import { BazaarTranslator } from './components/BazaarTranslator';
import { StoryCreator } from './components/StoryCreator';
import { BazaarCalculator } from './components/BazaarCalculator';
import { PublicHomeListings } from './components/PublicHomeListings';
import { ReportEngine } from './components/ReportEngine';
import { AdminAdPanel } from './components/AdminAdPanel';
import { AdSlider } from './components/AdSlider';
import { EthicalCharter } from './components/EthicalCharter';
import { CreatorProfile } from './components/CreatorProfile';
import { MemorialBanner } from './components/MemorialBanner';
import { BazaarVideoPromo } from './components/BazaarVideoPromo';
import { CarpetAuthAndModeration } from './components/CarpetAuthAndModeration';
import { VirtualBoothTour360 } from './components/VirtualBoothTour360';
import { TimedAuctionRoom } from './components/TimedAuctionRoom';
import { MerchantServiceShop } from './components/MerchantServiceShop';

export default function App() {
  const [currentLang, setCurrentLang] = useState<AppLang>('fa');
  const [activeTab, setActiveTab] = useState<string>('counter');
  const [isLightMode, setIsLightMode] = useState<boolean>(() => {
    return localStorage.getItem('alimiri_theme_mode') === 'light';
  });

  // Global Regional Location State
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('all');
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('سراسر کشور (ایران)');
  const [selectedCityName, setSelectedCityName] = useState<string>('all');

  const handleSelectRegion = (provinceId: string, provinceNameFa: string, cityNameFa: string = 'all') => {
    setSelectedProvinceId(provinceId);
    setSelectedProvinceName(provinceNameFa);
    setSelectedCityName(cityNameFa);
  };

  const t = i18n[currentLang] || i18n['fa'];
  const themeConfig = CULTURAL_THEMES[currentLang] || CULTURAL_THEMES['fa'];

  useEffect(() => {
    const root = document.getElementById('htmlRoot');
    if (root) {
      root.lang = currentLang;
      root.dir = (currentLang === 'fa' || currentLang === 'ar') ? 'rtl' : 'ltr';
    }
  }, [currentLang]);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('alimiri_theme_mode', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('alimiri_theme_mode', 'dark');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
  };

  return (
    <div
      className="rug-pattern min-h-screen p-3 md:p-6 max-w-4xl mx-auto space-y-6 pb-12 transition-colors duration-500"
      style={{
        background: isLightMode ? undefined : themeConfig.bgGradient
      }}
    >
      {/* Top Header & 8-Language Cultural Theme Bar & Regional Location Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLightMode={isLightMode}
        onToggleTheme={toggleTheme}
        selectedProvinceId={selectedProvinceId}
        selectedCity={selectedCityName}
        onSelectRegion={handleSelectRegion}
      />

      {/* In-App Ad Slider Placement */}
      <AdSlider currentLang={currentLang} />

      {/* Memorial Tribute Banner */}
      <MemorialBanner currentLang={currentLang} />

      {/* Main Tab Contents */}
      <main className="space-y-6">
        {activeTab === 'counter' && <BlessingCounter currentLang={currentLang} />}
        {activeTab === 'authmod' && <CarpetAuthAndModeration currentLang={currentLang} />}
        {activeTab === 'serviceshop' && <MerchantServiceShop currentLang={currentLang} />}
        {activeTab === 'tour360' && <VirtualBoothTour360 currentLang={currentLang} />}
        {activeTab === 'timedauction' && <TimedAuctionRoom currentLang={currentLang} />}
        {activeTab === 'booths' && (
          <BoothManager
            currentLang={currentLang}
            selectedProvinceName={selectedProvinceName}
            selectedCityName={selectedCityName}
          />
        )}
        {activeTab === 'homelistings' && (
          <PublicHomeListings
            currentLang={currentLang}
            selectedProvinceName={selectedProvinceName}
            selectedCityName={selectedCityName}
          />
        )}
        {activeTab === 'customorder' && <CustomOrderPortal currentLang={currentLang} />}
        {activeTab === 'appraisalreq' && <AppraisalRequestPortal currentLang={currentLang} />}
        {activeTab === 'machinerugs' && <MachineRugSection currentLang={currentLang} />}
        {activeTab === 'raj' && <SmartRajCounter currentLang={currentLang} />}
        {activeTab === 'evaluator' && <CarpetEvaluator currentLang={currentLang} />}
        {activeTab === 'museum' && <MuseumGallery currentLang={currentLang} />}
        {activeTab === 'referrals' && <ReferralLeague currentLang={currentLang} />}
        {activeTab === 'translator' && <BazaarTranslator currentLang={currentLang} />}
        {activeTab === 'story' && <StoryCreator currentLang={currentLang} />}
        {activeTab === 'calculator' && <BazaarCalculator currentLang={currentLang} />}
        {activeTab === 'videopromo' && <BazaarVideoPromo currentLang={currentLang} />}
        {activeTab === 'report' && <ReportEngine currentLang={currentLang} />}
        {activeTab === 'adminads' && <AdminAdPanel currentLang={currentLang} />}
        {activeTab === 'charter' && <EthicalCharter currentLang={currentLang} />}
        {activeTab === 'creator' && <CreatorProfile currentLang={currentLang} />}
      </main>



      {/* Footer */}
      <footer className="glass-card rounded-2xl p-5 text-center text-xs text-slate-400 space-y-3 border border-amber-500/20 shadow-2xl">
        <div className="font-black text-amber-300 text-base">
          {t.brandTitle}
        </div>
        <div className="text-amber-200/90 text-xs italic font-bold">
          {t.brandSub}
        </div>

        {/* Official Slogan */}
        <div className="text-xs text-slate-300 font-semibold max-w-2xl mx-auto py-2 px-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 leading-relaxed">
          <i className="fa-solid fa-store text-amber-400 ml-1.5"></i>
          <span>{t.brandSlogan}</span>
        </div>

        {/* Official Address */}
        <div className="text-xs text-amber-300 font-bold max-w-xl mx-auto py-1.5 px-3 bg-slate-900/80 rounded-xl border border-amber-500/30 flex items-center justify-center gap-2">
          <i className="fa-solid fa-location-dot text-amber-400 shrink-0"></i>
          <span>آدرس دفتر مرکزی: {t.officeAddressFull}</span>
        </div>

        {/* Official Carpet Union External Links */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
          <a
            href={t.unionSellersLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold border border-amber-500/30 hover:border-amber-400 transition text-xs shadow group"
          >
            <i className="fa-solid fa-building-columns text-amber-400 group-hover:scale-110 transition"></i>
            <span>{t.unionSellersTitle}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
          </a>

          <a
            href={t.unionExportersLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold border border-amber-500/30 hover:border-amber-400 transition text-xs shadow group"
          >
            <i className="fa-solid fa-plane-departure text-amber-400 group-hover:scale-110 transition"></i>
            <span>{t.unionExportersTitle}</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
          </a>
        </div>

        <div className="text-[11px] text-slate-300 pt-1">
          کلیه حقوق مادی و معنوی پلتفرم متعلق به <strong className="text-amber-200 font-bold">آقای اکبر علیمیری</strong> می‌باشد.
        </div>
        <div className="text-[10px] text-slate-400 font-medium">
          شهر مجازی توانا | اکوسیستم آفرینش | ABCTFBNV Meta
        </div>
      </footer>
    </div>
  );
}
