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
    <section className="glass-card rounded-3xl p-5 md:p-7 space-y-6 shadow-2xl border-2 border-amber-500/40">
      <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-800 pb-4 gap-3">
        <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow">
            <i className="fa-solid fa-camera-retro text-lg"></i>
          </span>
          <span className="text-white">{t.rajTitle}</span>
        </h2>
        <span className="text-xs sm:text-sm bg-slate-950 text-white px-4 py-2 rounded-xl font-black border-2 border-amber-400 shadow-md">
          {t.rajScale}
        </span>
      </div>

      {/* Input Options Split: Camera Upload vs Manual Entry */}
      <div className="grid md:grid-cols-2 gap-5 text-sm">
        {/* Camera / Image Upload Dropzone */}
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center border-2 border-amber-400 rounded-3xl p-6 cursor-pointer bg-slate-950 hover:bg-slate-900 transition group relative overflow-hidden min-h-[200px] shadow-xl">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Rug Back Capture"
                className="w-full h-44 object-cover rounded-2xl border-2 border-amber-400"
              />
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-lg">
                  <i className="fa-solid fa-camera text-2xl"></i>
                </div>
                <span className="font-black text-white text-center text-sm sm:text-base">
                  {t.cameraBtn}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-200 text-center mt-2 leading-relaxed bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                  📷 عکس از پشت فرش (۷ سانتیمتر) بگیرید یا فایل آن را انتخاب کنید
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
            <div className="bg-slate-950 border-2 border-amber-400 p-4 rounded-2xl text-center space-y-2 shadow-xl">
              <i className="fa-solid fa-spinner fa-spin text-amber-400 text-2xl"></i>
              <div className="text-sm font-black text-white">{t.aiKnotAnalyzing}</div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-950 border-2 border-rose-500 text-white p-4 rounded-2xl text-xs sm:text-sm font-bold">
              <i className="fa-solid fa-triangle-exclamation me-1.5 text-rose-400"></i>
              {errorMessage}
            </div>
          )}
        </div>

        {/* Manual Knot Input Box */}
        <div className="bg-slate-950 p-6 rounded-3xl flex flex-col justify-between space-y-5 border-2 border-amber-400/80 shadow-xl">
          <div className="space-y-4">
            <div className="text-white font-black text-sm sm:text-base flex items-center gap-2 border-b border-slate-800 pb-2">
              <i className="fa-solid fa-ruler-combined text-amber-400 text-lg"></i>
              <span>{t.manualGuide}</span>
            </div>

            <div className="flex justify-between items-center text-white border-b border-slate-800 pb-4">
              <span className="font-black text-sm sm:text-base">{t.knotsLabel}</span>
              <input
                type="number"
                value={manualKnots}
                onChange={(e) => setManualKnots(e.target.value)}
                placeholder="مثلاً ۵۰"
                className="w-32 bg-black border-2 border-amber-400 rounded-2xl p-3 text-center text-white text-xl font-black focus:ring-2 focus:ring-amber-300 focus:outline-none shadow-inner"
              />
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              📏 <strong className="text-white">روش کار:</strong> خط‌کش ۷ سانتیمتری را روی پشت فرش قرار داده و تعداد گره‌های در امتداد ۷ سانت را بشمارید.
            </p>
          </div>

          <button
            onClick={calculateManual}
            className="w-full gold-grad text-slate-950 font-black py-4 rounded-2xl text-sm sm:text-base shadow-xl active:scale-95 transition hover:opacity-95"
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

      {/* Visual Reference Backdrop & Official Miri Bazaar Guide - High Contrast WCAG AAA */}
      <div className="border-2 border-amber-400 rounded-3xl p-6 bg-slate-950 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 border-b-2 border-slate-800 pb-5">
          <div className="relative shrink-0">
            <img
              src={sampleKnotImg}
              alt="نمونه گره و ردشمار پشت فرش ایرانی"
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-lg">
              مقیاس ۷ سانت
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs sm:text-sm font-black mb-1 shadow">
              <i className="fa-solid fa-certificate"></i>
              <span>راهنمای کارشناسی تخصصی اصالت بافت</span>
            </div>
            <h3 className="text-lg md:text-2xl font-black text-white leading-tight">
              راهنمای رج‌شمار و ردشمار حجره حاج حسین‌علی میری و پسران
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-200">
              استانداردهای اصیل بازارهای سنتی تبریز، اصفهان، کاشان، قم، نایین و مشهد
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm font-bold leading-relaxed">
          <div className="bg-slate-900 p-5 rounded-2xl border-2 border-slate-700 space-y-2 shadow-lg">
            <div className="text-white text-base font-black flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                <i className="fa-solid fa-ruler"></i>
              </span>
              <span>تعریف سنتی «رج» و «رد» در بازار:</span>
            </div>
            <p className="text-slate-100 text-xs sm:text-sm font-bold leading-loose">
              در بازار بزرگ فرش ایران، «رج» یا «رد» به تعداد گره‌های موازی بافته‌شده در ۷ سانتیمتر در امتداد چله گویند. هرچه تعداد گره در این مقیاس بیشتر باشد، بافت فرش ریزتر، فشرده‌تر و ارزش هنری آن چندبرابر است.
            </p>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border-2 border-slate-700 space-y-2 shadow-lg">
            <div className="text-white text-base font-black flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                <i className="fa-solid fa-calculator"></i>
              </span>
              <span>نحوه اندازه‌گیری صحیح و تجربی:</span>
            </div>
            <p className="text-slate-100 text-xs sm:text-sm font-bold leading-loose">
              یک خط‌کش معمولی را روی پشت فرش بگذارید و فاصله ۷ سانتیمتر را مشخص کنید. گره‌های افقی را دقیق بشمارید. عدد شمرده‌شده دقیقاً «رج فرش» شماست (مانند ۵۰ رج اصفهان یا ۶۰ رج اعلای چله‌ابریشم تبریز).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
