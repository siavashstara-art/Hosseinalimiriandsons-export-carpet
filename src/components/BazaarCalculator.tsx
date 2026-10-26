import React, { useState } from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';

interface BazaarCalculatorProps {
  currentLang: AppLang;
}

export const BazaarCalculator: React.FC<BazaarCalculatorProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  const [lengthCm, setLengthCm] = useState<string>('300'); // 3 meters
  const [widthCm, setWidthCm] = useState<string>('200');  // 2 meters
  const [raj, setRaj] = useState<string>('50');           // 50 Raj

  const [result, setResult] = useState<{
    areaSqM: number;
    totalKnots: number;
    silkWeightKg: number;
    woolWeightKg: number;
    daysOneWeaver: number;
  } | null>(null);

  const handleCalculate = () => {
    const l = parseFloat(lengthCm);
    const w = parseFloat(widthCm);
    const r = parseFloat(raj);

    if (isNaN(l) || isNaN(w) || isNaN(r) || l <= 0 || w <= 0 || r <= 0) {
      alert(currentLang === 'fa' ? 'لطفاً مقادیر معتبر ابعاد و رجشمار را وارد کنید' : 'Enter valid numbers');
      return;
    }

    const area = (l * w) / 10000; // m²
    // Knots in length = (length / 7) * raj
    // Knots in width = (width / 7) * raj
    const knotsLength = (l / 7) * r;
    const knotsWidth = (w / 7) * r;
    const totalKnots = Math.round(knotsLength * knotsWidth);

    // Approximate material weights
    // High density silk ~ 1.4kg per m², Wool ~ 2.2kg per m²
    const silkWeight = Math.round(area * 1.4 * 10) / 10;
    const woolWeight = Math.round(area * 2.2 * 10) / 10;

    // Weaving duration: average weaver ties 7,000 knots per 8-hour workday
    const daysOneWeaver = Math.round(totalKnots / 7000);

    setResult({
      areaSqM: Math.round(area * 100) / 100,
      totalKnots,
      silkWeightKg: silkWeight,
      woolWeightKg: woolWeight,
      daysOneWeaver,
    });
  };

  return (
    <section className="glass-card rounded-2xl p-5 md:p-6 space-y-6 shadow-2xl">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-sm md:text-base font-bold text-amber-400 flex items-center gap-2">
          <i className="fa-solid fa-calculator text-amber-400 text-lg"></i>
          <span>{t.calcAreaTitle}</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block mb-1 text-slate-300 font-semibold">{t.lengthCm}</label>
          <input
            type="number"
            value={lengthCm}
            onChange={(e) => setLengthCm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-slate-300 font-semibold">{t.widthCm}</label>
          <input
            type="number"
            value={widthCm}
            onChange={(e) => setWidthCm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-slate-300 font-semibold">{t.rajNumber}</label>
          <input
            type="number"
            value={raj}
            onChange={(e) => setRaj(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full gold-grad text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg active:scale-95 transition"
      >
        {t.calcAreaBtn}
      </button>

      {result && (
        <div className="glass-card-amber p-5 rounded-2xl border border-amber-500/40 space-y-3 animate-fade-in">
          <div className="font-bold text-amber-300 text-sm border-b border-amber-500/20 pb-2">
            خلاصه مشخصات مهندسی و بافت فرش:
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{t.carpetArea}</span>
              <strong className="text-amber-200 text-base font-mono">{result.areaSqM} m²</strong>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{t.totalKnots}</span>
              <strong className="text-emerald-400 text-base font-mono">{result.totalKnots.toLocaleString()}</strong>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{t.estSilkWeight}</span>
              <strong className="text-amber-200 text-sm font-mono">{result.silkWeightKg} kg ابریشم / {result.woolWeightKg} kg پشم</strong>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">{t.estWeaveTime}</span>
              <strong className="text-amber-200 text-sm font-mono">{result.daysOneWeaver} روز کاری (~{(result.daysOneWeaver / 30).toFixed(1)} ماه)</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
