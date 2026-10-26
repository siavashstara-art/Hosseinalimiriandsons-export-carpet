import React, { useState } from 'react';
import { AppLang, TransTargetLang, GlossaryTerm } from '../types';
import { i18n } from '../constants/translations';
import { BAZAAR_GLOSSARY } from '../constants/glossary';

interface BazaarTranslatorProps {
  currentLang: AppLang;
}

export const BazaarTranslator: React.FC<BazaarTranslatorProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  const [targetLang, setTargetLang] = useState<TransTargetLang>('en');
  const [sourceText, setSourceText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [transResult, setTransResult] = useState<any | null>(null);

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleQuickTermClick = (item: GlossaryTerm) => {
    setSourceText(item.faTerm);
    setTransResult({
      originalTerm: item.faTerm,
      translatedTerm:
        targetLang === 'en'
          ? item.enTerm
          : targetLang === 'ar'
          ? item.arTerm
          : item.faTerm,
      phoneticPronunciation: item.phoneticEn || item.phoneticFa,
      bazaarContext:
        targetLang === 'en'
          ? item.enDesc
          : targetLang === 'ar'
          ? item.arDesc
          : item.faDesc,
    });
  };

  const handleTranslate = async () => {
    const raw = sourceText.trim();
    if (!raw) return;

    // Check local dictionary first
    const matched = BAZAAR_GLOSSARY.find(
      (g) => g.faTerm.includes(raw) || raw.includes(g.faTerm)
    );

    if (matched) {
      handleQuickTermClick(matched);
      return;
    }

    // Call server AI endpoint if not found in local quick dictionary
    setIsTranslating(true);
    setTransResult(null);

    try {
      const response = await fetch('/api/gemini/translate-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: raw,
          targetLang,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to translate term.');
      }

      setTransResult(data.result);
    } catch (err: any) {
      alert(err.message || 'Error translating term.');
    } finally {
      setIsTranslating(false);
    }
  };

  const playSpeechAudio = async (textToSpeak: string) => {
    if (!textToSpeak) return;
    setIsPlayingAudio(true);

    // Try browser SpeechSynthesis first for immediate zero-latency feedback
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(textToSpeak);
        const langMap: Record<string, string> = { en: 'en-US', ar: 'ar-SA', fa: 'fa-IR', az: 'az-AZ' };
        u.lang = langMap[targetLang] || 'en-US';
        u.onend = () => setIsPlayingAudio(false);
        u.onerror = () => speakWithServerAi(textToSpeak);
        window.speechSynthesis.speak(u);
        return;
      } catch (e) {
        // Fallback to Gemini TTS
      }
    }

    await speakWithServerAi(textToSpeak);
  };

  const speakWithServerAi = async (textToSpeak: string) => {
    try {
      const response = await fetch('/api/gemini/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, voice: 'Kore' }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate speech audio.');
      }

      const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);
      await audio.play();
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  return (
    <section className="glass-card rounded-2xl p-5 md:p-6 space-y-5 shadow-2xl">
      <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm md:text-base font-bold text-amber-400 flex items-center gap-2">
          <i className="fa-solid fa-microphone text-amber-400 text-lg"></i>
          <span>{t.transTitle}</span>
        </h2>
      </div>

      {/* Target Language Buttons */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <button
          onClick={() => setTargetLang('en')}
          className={`p-2.5 rounded-xl font-bold transition text-center ${
            targetLang === 'en'
              ? 'gold-grad text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setTargetLang('ar')}
          className={`p-2.5 rounded-xl font-bold transition text-center ${
            targetLang === 'ar'
              ? 'gold-grad text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          العربية
        </button>
        <button
          onClick={() => setTargetLang('az')}
          className={`p-2.5 rounded-xl font-bold transition text-center ${
            targetLang === 'az'
              ? 'gold-grad text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          آذری
        </button>
        <button
          onClick={() => setTargetLang('ku')}
          className={`p-2.5 rounded-xl font-bold transition text-center ${
            targetLang === 'ku'
              ? 'gold-grad text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          کوردی
        </button>
      </div>

      {/* Input Text Area & Translate Button */}
      <div className="relative space-y-2">
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          rows={2}
          placeholder={t.typeOrSelect}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 focus:border-amber-500 focus:outline-none"
        ></textarea>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            className="gold-grad hover:opacity-95 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
          >
            {isTranslating ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>در حال ترجمه...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-language text-base"></i>
                <span>{t.translateBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Terms Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
          <i className="fa-solid fa-bolt text-amber-400"></i>
          <span>{t.quickTerms}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {BAZAAR_GLOSSARY.map((item) => (
            <button
              key={item.id}
              onClick={() => handleQuickTermClick(item)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95 hover:border-amber-500/40"
            >
              {item.faTerm}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Result Output Box */}
      {transResult && (
        <div className="glass-card-amber p-5 rounded-2xl border border-amber-500/40 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="text-amber-200 font-black text-base">
              {transResult.translatedTerm || transResult.originalTerm}
            </div>
            {transResult.phoneticPronunciation && (
              <span className="text-xs text-slate-400 italic font-mono">
                / {transResult.phoneticPronunciation} /
              </span>
            )}
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {transResult.bazaarContext || transResult.literalMeaning}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
            <button
              onClick={() => playSpeechAudio(transResult.translatedTerm || transResult.originalTerm)}
              disabled={isPlayingAudio}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
            >
              <i className={`fa-solid ${isPlayingAudio ? 'fa-spinner fa-spin' : 'fa-volume-high'}`}></i>
              <span>{isPlayingAudio ? t.speechGenerating : t.speechPlay}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
