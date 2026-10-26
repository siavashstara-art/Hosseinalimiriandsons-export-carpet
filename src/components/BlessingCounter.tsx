import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';

interface BlessingCounterProps {
  currentLang: AppLang;
}

export const BlessingCounter: React.FC<BlessingCounterProps> = ({ currentLang }) => {
  const t = i18n[currentLang];
  const [count, setCount] = useState<number>(() => {
    const saved = localStorage.getItem('alimiri_salawat_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [target, setTarget] = useState<number>(100);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('alimiri_salawat_count', count.toString());
  }, [count]);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Ignore web audio errors
    }
  };

  const increment = () => {
    setCount((prev) => prev + 1);
    playClickSound();
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const decrement = () => {
    setCount((prev) => Math.max(0, prev - 1));
  };

  const reset = () => {
    if (window.confirm(currentLang === 'fa' ? 'آیا از صفر کردن شمارشگر مطمئن هستید؟' : 'Reset counter?')) {
      setCount(0);
    }
  };

  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  return (
    <section className="glass-card rounded-2xl p-6 space-y-5 text-center shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h2 className="text-sm md:text-base font-bold text-amber-400 flex items-center justify-center gap-2">
          <i className="fa-solid fa-heart-pulse text-amber-400 text-lg animate-pulse"></i>
          <span>{t.counterTitle}</span>
        </h2>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
            soundEnabled
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
          <span>{soundEnabled ? (currentLang === 'fa' ? 'صوت فعال' : 'Sound ON') : (currentLang === 'fa' ? 'صوت بی‌صدا' : 'Sound OFF')}</span>
        </button>
      </div>

      <div className="py-4 space-y-2">
        <div className="text-6xl md:text-7xl font-black gold-text tracking-widest font-mono">
          {count.toLocaleString()}
        </div>
        <div className="text-xs text-amber-300/80 font-medium italic max-w-lg mx-auto">
          {t.counterDedication}
        </div>
      </div>

      {/* Target Progress Bar */}
      <div className="space-y-1.5 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-semibold text-slate-400">
          <span>{t.counterTarget} {target}</span>
          <span className="text-amber-300 font-mono font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3 p-0.5 border border-slate-800">
          <div
            className="gold-grad h-full rounded-full transition-all duration-300 shadow-sm shadow-amber-500/30"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Counter Controls */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          onClick={increment}
          className="gold-grad hover:opacity-95 text-slate-950 font-black px-10 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-transform flex items-center gap-2"
        >
          <i className="fa-solid fa-plus text-base"></i>
          <span>{t.countBtn}</span>
        </button>

        <button
          onClick={decrement}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-5 py-3.5 rounded-2xl text-xs transition active:scale-95 border border-slate-700"
        >
          <i className="fa-solid fa-minus me-1"></i>
          <span>-۱</span>
        </button>

        <button
          onClick={reset}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-3.5 rounded-2xl text-xs transition active:scale-95 border border-slate-700"
        >
          <i className="fa-solid fa-rotate-left me-1"></i>
          <span>{t.resetBtn}</span>
        </button>
      </div>

      {/* Preset Target Selectors */}
      <div className="flex justify-center gap-2 pt-1 text-xs">
        <span className="text-slate-400 font-medium me-1 my-auto">هدف:</span>
        {[14, 100, 313, 1000].map((num) => (
          <button
            key={num}
            onClick={() => setTarget(num)}
            className={`px-3 py-1 rounded-xl font-bold transition ${
              target === num
                ? 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </section>
  );
};
