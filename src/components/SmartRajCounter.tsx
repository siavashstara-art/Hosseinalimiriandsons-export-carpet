import React, { useState } from 'react';
import { AppLang, RugAnalysisResult } from '../types';
import { i18n } from '../constants/translations';
import sampleKnotImg from '../assets/images/rug_back_knot_sample_1792998593324.jpg';

interface SmartRajCounterProps {
  currentLang: AppLang;
}

export const SmartRajCounter: React.FC<SmartRajCounterProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  const [manualKnots, setManualKnots] = useState<string>('');
  const [calculatedRaj, setCalculatedRaj] = useState<number | null>(null);
  const [calculatedDensity, setCalculatedDensity] = useState<number | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<RugAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Manual calculation logic: knots per 7cm = Raj count
  const calculateManual = () => {
    const knots = parseFloat(manualKnots);
    if (isNaN(knots) || knots <= 0) {
      alert(currentLang === 'fa' ? 'لطفاً تعداد معتبر گره در ۷ سانتیمتر را وارد کنید' : 'Enter valid knot count');
      return;
    }
    const raj = Math.round(knots);
    // Knots per meter = (knots / 0.07)
    // Knots per sq meter = (knots / 0.07)^2
    const density = Math.round(Math.pow(knots / 0.07, 2));

    setCalculatedRaj(raj);
    setCalculatedDensity(density);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      setErrorMessage(null);
      await analyzeImageWithAi(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImageWithAi = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAiResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/analyze-rug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          analysisType: 'back',
          targetLang: currentLang,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze rug back image.');
      }

      setAiResult(data.result);
      if (data.result?.rajEstimate) {
        setCalculatedRaj(data.result.rajEstimate);
        if (data.result.totalKnotDensitySqMeter) {
          setCalculatedDensity(data.result.totalKnotDensitySqMeter);
        } else {
          setCalculatedDensity(Math.round(Math.pow(data.result.rajEstimate / 0.07, 2)));
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with AI server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getQualityTierDesc = (raj: number) => {
    if (raj < 30) {
      return {
        labelFa: 'درشت‌باف (عشایری و روستایی)',
        labelEn: 'Coarse Weave (Tribal & Rustic)',
        labelAr: 'نسيج خشن (قبلي وقروي)',
        color: 'text-yellow-400',
        descFa: 'مناسب برای فرش‌های ایلیاتی، خرسک و گبه با مقاومت بالا و خاب بلند.',
      };
    } else if (raj <= 45) {
      return {
        labelFa: 'متوسط تجاری (بافت استاندارد بازار)',
        labelEn: 'Medium Commercial Standard',
        labelAr: 'نسيج متوسط تجاري',
        color: 'text-amber-400',
        descFa: 'کیفیت خوب برای استفاده مداوم خانگی با گوشت مناسب و نقش‌های متنوع.',
      };
    } else if (raj <= 60) {
      return {
        labelFa: 'ریزباف فاخر (صاداراتی و اعلا)',
        labelEn: 'Fine Luxury Weave (Export Quality)',
        labelAr: 'نسيج فاخر دقيق',
        color: 'text-emerald-400',
        descFa: 'ظرافت عالی، معمولاً با چله ابریشم و گل‌های ابریشمی در مکاتب تبریز، اصفهان و قم.',
      };
    } else {
      return {
        labelFa: 'فوق‌العاده ریزباف (تمام ابریشم موزه‌ای / کلکسیونی)',
        labelEn: 'Ultra-Fine Masterpiece (Silk Museum Quality)',
        labelAr: 'نسيج حريري دقيق جداً (متحفي)',
        color: 'text-cyan-300',
        descFa: 'شاهکار هنری دستباف با تراکم خیره‌کننده و ظرافت مینیاتوری فوق‌العاده.',
      };
    }
  };

  return (
    <section className="glass-card rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <h2 className="text-sm md:text-base font-bold text-amber-400 flex items-center gap-2">
          <i className="fa-solid fa-camera-retro text-amber-400 text-lg"></i>
          <span>{t.rajTitle}</span>
        </h2>
        <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/30">
          {t.rajScale}
        </span>
      </div>

      {/* Input Options Split: Camera Upload vs Manual Entry */}
      <div className="grid md:grid-cols-2 gap-5 text-xs">
        {/* Camera / Image Upload Dropzone */}
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-amber-500/40 hover:border-amber-500 rounded-2xl p-6 cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition group relative overflow-hidden min-h-[180px]">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Rug Back Capture"
                className="w-full h-36 object-cover rounded-xl border border-amber-500/30"
              />
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <i className="fa-solid fa-camera text-amber-400 text-2xl"></i>
                </div>
                <span className="font-bold text-amber-200 text-center text-xs md:text-sm">
                  {t.cameraBtn}
                </span>
                <span className="text-[11px] text-slate-400 text-center mt-1">
                  عکس از پشت فرش (۷ سانتیمتر) بگیرید یا فایل آن را انتخاب کنید
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          {isAnalyzing && (
            <div className="glass-card-amber p-3.5 rounded-xl text-center space-y-2">
              <i className="fa-solid fa-spinner fa-spin text-amber-400 text-xl"></i>
              <div className="text-xs font-bold text-amber-200">{t.aiKnotAnalyzing}</div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-950/50 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs">
              <i className="fa-solid fa-triangle-exclamation me-1.5"></i>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Manual Knot Input Box */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 border border-slate-800">
          <div className="space-y-3">
            <div className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
              <i className="fa-solid fa-ruler-combined text-amber-400"></i>
              <span>{t.manualGuide}</span>
            </div>

            <div className="flex justify-between items-center text-slate-200 border-b border-slate-800 pb-3">
              <span className="font-semibold">{t.knotsLabel}</span>
              <input
                type="number"
                value={manualKnots}
                onChange={(e) => setManualKnots(e.target.value)}
                placeholder="مثلاً ۵۰"
                className="w-28 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center text-amber-300 text-base font-black focus:border-amber-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              * خط‌کش ۷ سانتیمتری روی پشت فرش قرار داده و گره‌های موازی در ۷ سانت را بشمارید.
            </p>
          </div>

          <button
            onClick={calculateManual}
            className="w-full gold-grad text-slate-950 font-black py-3 rounded-xl text-xs shadow-lg active:scale-95 transition"
          >
            {t.calcBtn}
          </button>
        </div>
      </div>

      {/* Result Display Card */}
      {calculatedRaj !== null && (
        <div className="glass-card-amber p-5 rounded-2xl border border-amber-500/40 space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between border-b border-amber-500/20 pb-3 gap-2">
            <div className="font-black text-amber-300 text-lg flex items-center gap-2">
              <i className="fa-solid fa-award text-amber-400"></i>
              <span>{t.rajResult} <span className="text-2xl font-mono text-white me-1">{calculatedRaj}</span> رج</span>
            </div>
            {calculatedDensity && (
              <div className="text-xs text-amber-200 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30">
                {t.densityMeter} <strong className="font-mono text-white text-sm">{calculatedDensity.toLocaleString()}</strong> گره/m²
              </div>
            )}
          </div>

          {/* Quality Tier Analysis */}
          {(() => {
            const tier = getQualityTierDesc(calculatedRaj);
            return (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">{t.qualityTier}</span>
                  <span className={`font-black text-sm ${tier.color}`}>
                    {currentLang === 'en' ? tier.labelEn : currentLang === 'ar' ? tier.labelAr : tier.labelFa}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {tier.descFa}
                </p>
              </div>
            );
          })()}

          {/* AI Multimodal Analysis Findings */}
          {aiResult && (
            <div className="pt-2 border-t border-amber-500/20 space-y-2 text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <i className="fa-solid fa-microchip"></i>
                <span>تحلیل هوشمند گره و بافت:</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-300">
                {aiResult.warpWeftMaterial && (
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">جنس تار و پود:</span>
                    <strong className="text-amber-200">{aiResult.warpWeftMaterial}</strong>
                  </div>
                )}
                {aiResult.knotType && (
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">نوع گره:</span>
                    <strong className="text-amber-200">{aiResult.knotType}</strong>
                  </div>
                )}
                {aiResult.dyeType && (
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">نوع رنگرزی:</span>
                    <strong className="text-amber-200">{aiResult.dyeType}</strong>
                  </div>
                )}
                {aiResult.authenticityScore && (
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">امتیاز اصالت بافت:</span>
                    <strong className="text-emerald-400">{aiResult.authenticityScore} / ۱۰۰</strong>
                  </div>
                )}
              </div>
              {aiResult.detailedAppraisal && (
                <p className="text-slate-300 italic pt-1 leading-relaxed">
                  "{aiResult.detailedAppraisal}"
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Visual Reference Backdrop */}
      <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/60 flex flex-wrap md:flex-nowrap items-center gap-4 text-xs">
        <img
          src={sampleKnotImg}
          alt="Sample Knot Backing"
          className="w-16 h-16 rounded-xl object-cover border border-amber-500/30 shrink-0"
        />
        <div className="space-y-1">
          <div className="font-bold text-amber-300">راهنمای کارشناسی رجشمار حجره میری:</div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            در بازار بزرگ فرش ایران، «رج» به تعداد گره‌های بافته‌شده در ۷ سانتیمتر گویند. فرش‌های تبریز، قم و اصفهان بیشترین دقت در استاندارد ۷ سانتیمتر را دارند.
          </p>
        </div>
      </div>
    </section>
  );
};
