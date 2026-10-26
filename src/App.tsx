import React, { useState, useEffect } from 'react';
import { AppLang } from './types';
import { Header } from './components/Header';
import { BlessingCounter } from './components/BlessingCounter';
import { SmartRajCounter } from './components/SmartRajCounter';
import { CarpetEvaluator } from './components/CarpetEvaluator';
import { BazaarTranslator } from './components/BazaarTranslator';
import { StoryCreator } from './components/StoryCreator';
import { BazaarCalculator } from './components/BazaarCalculator';
import { CreatorProfile } from './components/CreatorProfile';

export default function App() {
  const [currentLang, setCurrentLang] = useState<AppLang>('fa');
  const [activeTab, setActiveTab] = useState<string>('counter');

  useEffect(() => {
    const root = document.getElementById('htmlRoot');
    if (root) {
      root.lang = currentLang;
      root.dir = currentLang === 'en' ? 'ltr' : 'rtl';
    }
  }, [currentLang]);

  return (
    <div className="rug-pattern min-h-screen p-3 md:p-6 max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header & Navigation */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Contents */}
      <main className="space-y-6">
        {activeTab === 'counter' && <BlessingCounter currentLang={currentLang} />}
        {activeTab === 'raj' && <SmartRajCounter currentLang={currentLang} />}
        {activeTab === 'evaluator' && <CarpetEvaluator currentLang={currentLang} />}
        {activeTab === 'translator' && <BazaarTranslator currentLang={currentLang} />}
        {activeTab === 'story' && <StoryCreator currentLang={currentLang} />}
        {activeTab === 'calculator' && <BazaarCalculator currentLang={currentLang} />}
        {activeTab === 'creator' && <CreatorProfile currentLang={currentLang} />}
      </main>

      {/* Footer */}
      <footer className="glass-card rounded-2xl p-4 text-center text-xs text-slate-400 space-y-2 border border-amber-500/20">
        <div className="font-bold text-amber-300">
          فرش حسینعلی میری و پسران | بازار بزرگ فرش ایران
        </div>
        <div>
          کلیه حقوق مادی و معنوی پلتفرم متعلق به <strong className="text-amber-200">آقای اکبر علیمیری</strong> می‌باشد.
        </div>
        <div className="text-[11px] text-slate-400">
          شهر مجازی توانا | اکوسیستم آفرینش | ABCTFBNV Meta
        </div>
      </footer>
    </div>
  );
}
