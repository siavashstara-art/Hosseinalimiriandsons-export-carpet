import React, { useState } from 'react';
import { AppLang } from '../types';
import { i18n } from '../constants/translations';

interface BazaarCalculatorProps {
  currentLang: AppLang;
}

export const BazaarCalculator: React.FC<BazaarCalculatorProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  // Tab state inside calculator: 'specs' (متراژ و تار و پود) vs 'price' (قیمت‌گذاری)
  const [calcMode, setCalcMode] = useState<'specs' | 'price'>('price');

  // Specs Calculator State
  const [lengthCm, setLengthCm] = useState<string>('300'); // 3 meters
  const [widthCm, setWidthCm] = useState<string>('200');  // 2 meters
  const [rajSpecs, setRajSpecs] = useState<string>('50'); // 50 Raj

  const [specsResult, setSpecsResult] = useState<{
    areaSqM: number;
    totalKnots: number;
    silkWeightKg: number;
    woolWeightKg: number;
    daysOneWeaver: number;
  } | null>(null);

  // Price Estimator State
  const [priceArea, setPriceArea] = useState<string>('6');     // 6 m²
  const [priceRaj, setPriceRaj] = useState<string>('50');       // 50 Raj
  const [priceAge, setPriceAge] = useState<string>('5');        // 5 years
  const [priceWarp, setPriceWarp] = useState<'cotton' | 'silk'>('silk');
  const [pricePattern, setPricePattern] = useState<'tabriz' | 'kashan' | 'nain' | 'isfahan' | 'qom'>('tabriz');

  const [priceResult, setPriceResult] = useState<{
    loToman: number;
    hiToman: number;
  } | null>(null);

  // Parse Persian/Arabic digits
  const toEnglishDigits = (str: string) => {
    const map: Record<string, string> = {
      '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
      '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9'
    };
    return String(str).replace(/[۰-۹٠-٩]/g, (c) => map[c] || c);
  };

  const parseNum = (val: string) => {
    const n = parseFloat(toEnglishDigits(val).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const handleCalculateSpecs = () => {
    const l = parseNum(lengthCm);
    const w = parseNum(widthCm);
    const r = parseNum(rajSpecs);

    if (l <= 0 || w <= 0 || r <= 0) {
      alert(currentLang === 'fa' ? 'لطفاً ابعاد و رج معتبر وارد کنید' : 'Enter valid dimensions');
      return;
    }

    const area = (l * w) / 10000; // m²
    const knotsLength = (l / 7) * r;
    const knotsWidth = (w / 7) * r;
    const totalKnots = Math.round(knotsLength * knotsWidth);

    const silkWeight = Math.round(area * 1.4 * 10) / 10;
    const woolWeight = Math.round(area * 2.2 * 10) / 10;
    const daysOneWeaver = Math.round(totalKnots / 7000);

    setSpecsResult({
      areaSqM: Math.round(area * 100) / 100,
      totalKnots,
      silkWeightKg: silkWeight,
      woolWeightKg: woolWeight,
      daysOneWeaver,
    });
  };

  const handleCalculatePrice = () => {
    const area = parseNum(priceArea);
    const raj = parseNum(priceRaj);
    const age = parseNum(priceAge);

    if (area <= 0 || raj <= 0) {
      alert(t.priceError || 'لطفاً اطلاعات را کامل و صحیح وارد کنید.');
      return;
    }

    const warpFactors = { cotton: 1.0, silk: 1.8 };
    const patternFactors = { tabriz: 1.2, kashan: 1.3, nain: 1.5, isfahan: 1.4, qom: 1.6 };

    const base = area * raj * 15 * 0.05;
    const withWarp = base * warpFactors[priceWarp];
    const withPat = withWarp * patternFactors[pricePattern];
    const ageFactor = Math.max(0.7, 1 - age * 0.02);
    const finalVal = withPat * ageFactor;

    const lo = Math.round(finalVal * 0.8);
    const hi = Math.round(finalVal * 1.2);

    setPriceResult({ loToman: lo, hiToman: hi });
  };

  return (
    <section className="glass-card rounded-2xl p-5 md:p-6 space-y-6 shadow-2xl">
      {/* Tab Switcher: Price Estimator vs Specs Calculator */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setCalcMode('price')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              calcMode === 'price'
                ? 'gold-grad text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <i className="fa-solid fa-coins text-sm"></i>
            <span>{t.calcPriceTitle}</span>
          </button>

          <button
            onClick={() => setCalcMode('specs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              calcMode === 'specs'
                ? 'gold-grad text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <i className="fa-solid fa-calculator text-sm"></i>
            <span>{t.calcAreaTitle}</span>
          </button>
        </div>

        <span className="text-[11px] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/30">
          {t.estBadge}
        </span>
      </div>

      {/* MODE 1: RUG PRICE CALCULATOR */}
      {calcMode === 'price' && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block mb-1 text-slate-300 font-semibold">{t.phArea}</label>
              <input
                type="text"
                value={priceArea}
                onChange={(e) => setPriceArea(e.target.value)}
                placeholder={t.phArea}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-semibold">{t.phRaj}</label>
              <input
                type="text"
                value={priceRaj}
                onChange={(e) => setPriceRaj(e.target.value)}
                placeholder={t.phRaj}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-semibold">{t.phAge}</label>
              <input
                type="text"
                value={priceAge}
                onChange={(e) => setPriceAge(e.target.value)}
                placeholder={t.phAge}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block mb-1 text-slate-300 font-semibold">جنس چله (تار):</label>
              <select
                value={priceWarp}
                onChange={(e) => setPriceWarp(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-semibold focus:border-amber-500 focus:outline-none"
              >
                <option value="cotton">{t.optCotton}</option>
                <option value="silk">{t.optSilk}</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-semibold">مکتب بافت / شهر:</label>
              <select
                value={pricePattern}
                onChange={(e) => setPricePattern(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-semibold focus:border-amber-500 focus:outline-none"
              >
                <option value="tabriz">تبریز اصیل</option>
                <option value="isfahan">اصفهان فاخر</option>
                <option value="qom">قم تمام ابریشم</option>
                <option value="nain">نائین اعلا</option>
                <option value="kashan">کاشان سنتی</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculatePrice}
            className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg active:scale-95 transition"
          >
            {t.calcPriceBtn}
          </button>

          {priceResult && (
            <div className="glass-card-amber p-5 rounded-2xl border border-amber-500/40 space-y-2 text-xs text-center animate-fade-in">
              <div className="font-black text-amber-300 text-lg">
                بازه قیمت تخمینی: <span className="font-mono text-white text-xl">{priceResult.loToman}</span> تا <span className="font-mono text-white text-xl">{priceResult.hiToman}</span> میلیون تومان
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                ⚠️ این قیمت بر اساس الگوریتم بازار فرش میری تخمینی است و قیمت نهایی پس از کارشناسی حضوری و بررسی دقیق سلامت خاب و رنگ تعیین می‌گردد.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: RUG SPECS & KNOT CALCULATOR */}
      {calcMode === 'specs' && (
        <div className="space-y-5 animate-fade-in">
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
                value={rajSpecs}
                onChange={(e) => setRajSpecs(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleCalculateSpecs}
            className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg active:scale-95 transition"
          >
            {t.calcAreaBtn}
          </button>

          {specsResult && (
            <div className="glass-card-amber p-5 rounded-2xl border border-amber-500/40 space-y-3 animate-fade-in">
              <div className="font-bold text-amber-300 text-sm border-b border-amber-500/20 pb-2">
                مشخصات فنی و مهندسی بافت:
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">{t.carpetArea}</span>
                  <strong className="text-amber-200 text-base font-mono">{specsResult.areaSqM} m²</strong>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">{t.totalKnots}</span>
                  <strong className="text-emerald-400 text-base font-mono">{specsResult.totalKnots.toLocaleString()}</strong>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">{t.estSilkWeight}</span>
                  <strong className="text-amber-200 text-sm font-mono">{specsResult.silkWeightKg} kg ابریشم / {specsResult.woolWeightKg} kg پشم</strong>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">{t.estWeaveTime}</span>
                  <strong className="text-amber-200 text-sm font-mono">{specsResult.daysOneWeaver} روز کاری</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
