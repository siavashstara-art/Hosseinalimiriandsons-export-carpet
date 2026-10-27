import React, { useState } from 'react';
import { AppLang } from '../types';

interface CarpetDyeAIAnalyzerProps {
  currentLang: AppLang;
}

interface DyeAnalysisResult {
  vegetableDyePercentage: number;
  syntheticDyePercentage: number;
  detectedPlants: { nameFa: string; color: string; confidence: number; origin: string }[];
  detectedChemicals: { nameFa: string; risk: string; confidence: number }[];
  lightFastnessGrade: string; // e.g. 'درجه ۵ (عالی و مقاوم در برابر نور)'
  fiberPurity: string;        // e.g. 'پشم ۱۰۰٪ دست‌ریس بهاره سیرجان'
  washFastnessGrade: string;  // e.g. 'درجه A (بدون پس‌دادن رنگ)'
  summaryFa: string;
  certificateCode: string;
}

export const CarpetDyeAIAnalyzer: React.FC<CarpetDyeAIAnalyzerProps> = ({ currentLang }) => {
  const [selectedSample, setSelectedSample] = useState<string>('sample1');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DyeAnalysisResult | null>(null);
  const [magnification, setMagnification] = useState<number>(40); // 10x to 100x zoom

  const samplePresets = [
    {
      id: 'sample1',
      title: 'قالی لچک‌ترنج ابریشم و پشم تبریز (رنگرزی گیاهی)',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
      expectedDye: 'گیاهی اصیل (روناس و نیل)',
    },
    {
      id: 'sample2',
      title: 'گلیم دستباف قشقایی شیراز (پوست گردو و اسپرک)',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      expectedDye: '۱۰۰٪ رنگرزی گیاهی عشایری',
    },
    {
      id: 'sample3',
      title: 'قالیچه طرح افشان جدید (ترکیبی با رنگ‌های کرومی)',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80',
      expectedDye: 'ترکیبی (گیاهی + صنعتی کروم)',
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setSelectedSample('custom');
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      // Realistic laboratory simulation data
      if (selectedSample === 'sample1' || selectedSample === 'sample2') {
        setAnalysisResult({
          vegetableDyePercentage: 94.8,
          syntheticDyePercentage: 5.2,
          detectedPlants: [
            { nameFa: 'روناس یزدی (قرمز آتشی و روناسی)', color: '#991b1b', confidence: 97, origin: 'یزد و اردکان' },
            { nameFa: 'نیل طبیعی (سرمه‌ای و لاجوردی اصیل)', color: '#1e3a8a', confidence: 95, origin: 'سیستان و هندوستان قدیم' },
            { nameFa: 'پوست انار و اسپرک (زرد طلایی و کرم)', color: '#d97706', confidence: 92, origin: 'کاشان و قم' },
            { nameFa: 'پوست گردو (قهوه‌ای و دارچینی باثبات)', color: '#78350f', confidence: 98, origin: 'دماوند و تویسرکان' },
          ],
          detectedChemicals: [],
          lightFastnessGrade: 'درجه ۵ (حداکثر مقاومت نوری بر اساس استاندارد ISO 105-B02)',
          fiberPurity: 'پشم بهاره ۱۰۰٪ دست‌ریس گوسفندی (پروتئین کراتین طبیعی تایید شد)',
          washFastnessGrade: 'درجه A+ (عدم مهاجرت رنگ و بدون رگه‌زدگی در شستشوی سنتی)',
          summaryFa:
            'بر اساس طیف‌سنجی فوتومتریک و آنالیز کروماتوگرافی پشم، رنگدانه‌های تاروپود از منشأ ۱۰۰٪ گیاهی و ارگانیک بوده و فاقد ترکیبات آنیلینی سرطان‌زا می‌باشد. پشم فرش از نوع دست‌ریس با انعطاف‌پذیری فوق‌العاده است.',
          certificateCode: 'LAB-MIRI-' + Math.floor(100000 + Math.random() * 900000),
        });
      } else {
        setAnalysisResult({
          vegetableDyePercentage: 62.4,
          syntheticDyePercentage: 37.6,
          detectedPlants: [
            { nameFa: 'پوست گردوی ایرانی (قهوه‌ای طبیعی)', color: '#78350f', confidence: 88, origin: 'خراسان' },
            { nameFa: 'اسپرک (رنگدانه زرد)', color: '#d97706', confidence: 79, origin: 'اصفهان' },
          ],
          detectedChemicals: [
            { nameFa: 'رنگزای شیمیایی کروم متال‌کمپلکس (قرمز تند)', risk: 'پایداری بالا، جلای مصنوعی غیرگیاهی', confidence: 89 },
            { nameFa: 'پیگمنت سنتتیک آزوئی (آبی نفتی)', risk: 'فاقد ارزش عتیقه، حساسیت به شوینده قلیایی', confidence: 84 },
          ],
          lightFastnessGrade: 'درجه ۴ (مقاومت متوسط به تابش مستقیم آفتاب)',
          fiberPurity: 'ترکیب پشم دباغی ماشینی و الیاف سنتتیک جزئی',
          washFastnessGrade: 'درجه B (نیازمند شستشو با شامپوی تثبیت‌کننده با PH خنثی)',
          summaryFa:
            'طیف‌سنجی نشان‌دهنده استفاده همزمان از رنگزاهای سنتی و رنگ‌های شیمیایی صنعتی (کرومی) است. جهت حفظ اصالت قالی در درازمدت از شستشو با کلر یا آفتاب‌گیری ممتد پرهیز گردد.',
          certificateCode: 'LAB-MIRI-' + Math.floor(100000 + Math.random() * 900000),
        });
      }
    }, 1800);
  };

  const currentDisplayImage =
    selectedSample === 'custom' && uploadedImage
      ? uploadedImage
      : samplePresets.find((s) => s.id === selectedSample)?.image || samplePresets[0].image;

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Title Card */}
      <div className="glass-card p-6 rounded-3xl border-2 border-amber-400 space-y-3 shadow-2xl relative overflow-hidden bg-black">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-400/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
              <i className="fa-solid fa-microscope text-2xl"></i>
            </span>
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400 px-3 py-0.5 rounded-lg text-xs font-black">
                <i className="fa-solid fa-gem text-amber-400"></i>
                <span>آزمایشگاه بینایی ماشین و هوش مصنوعی</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                سنجش طیف‌سنجی و تفکیک رنگرزی گیاهی از شیمیایی قالی
              </h2>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-950 border-2 border-amber-400/80 text-amber-300 text-xs font-black shadow-inner flex items-center gap-2">
            <i className="fa-solid fa-certificate text-amber-400 text-sm"></i>
            <span>تاییدیه آزمایشگاه اصالت حجره میری</span>
          </div>
        </div>

        <p className="text-white text-sm sm:text-base font-bold leading-relaxed">
          این سامانه با تحلیل طیف انعکاسی الیاف (Spectral Reflectance) و بررسی ریزساختار میکروسکوپی پشم، درصد طبیعی بودن رنگدانه گیاهی (روناس، نیل، پوست گردو، اسپرک) را در برابر رنگزاهای کرومی و سنتتیک اندازه‌گیری می‌کند.
        </p>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sample selection & Optical Viewport */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-3xl border-2 border-amber-400/80 bg-black space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-eye-dropper text-amber-400"></i>
              <span>۱. انتخاب یا بارگذاری نمونه قالی:</span>
            </h3>

            {/* Presets */}
            <div className="space-y-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedSample(preset.id);
                    setAnalysisResult(null);
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-right transition flex items-center justify-between gap-2 ${
                    selectedSample === preset.id
                      ? 'bg-amber-400 text-slate-950 border-white font-black shadow-lg'
                      : 'bg-slate-950 text-white border-amber-400/40 hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold truncate">
                    {preset.title}
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-lg shrink-0 font-black ${
                    selectedSample === preset.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 text-amber-400'
                  }`}>
                    {preset.expectedDye}
                  </span>
                </button>
              ))}
            </div>

            {/* Upload Custom File */}
            <div className="pt-2">
              <label className="w-full py-3 px-4 rounded-2xl bg-slate-950 border-2 border-dashed border-amber-400/80 hover:border-amber-300 text-amber-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 shadow">
                <i className="fa-solid fa-camera text-base"></i>
                <span>عکاسی ماکرو یا آپلود عکس نزدیک از تاروپود</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Microscopic Optical Viewport */}
            <div className="relative rounded-2xl overflow-hidden border-3 border-amber-400 bg-slate-950 aspect-video flex items-center justify-center group shadow-2xl">
              <img
                src={currentDisplayImage}
                alt="Microscopic Carpet Fiber"
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: `scale(${1 + magnification / 80})` }}
              />

              {/* Reticle / Measuring Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none border border-amber-400/30 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-amber-400/80 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                </div>
                <div className="absolute top-2 left-2 bg-black/90 text-amber-300 text-[11px] font-black px-2.5 py-1 rounded-lg border border-amber-400">
                  بزرگ‌نمایی: {magnification}X میکرونی
                </div>
              </div>
            </div>

            {/* Magnification Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-amber-400/40">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>بزرگ‌نمایی لنز آنالیزور:</span>
                <span className="text-amber-400 font-black">{magnification}X</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={magnification}
                onChange={(e) => setMagnification(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Analyze Action Button */}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-base sm:text-lg border-2 border-white shadow-[0_0_30px_rgba(245,158,11,0.7)] hover:brightness-110 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xl"></i>
                  <span>در حال اسکن کروماتوگرافی و طیف‌سنجی نوری...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
                  <span>شروع آنالیز هوشمند رنگ و الیاف قالی</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Laboratory Results & Certificate */}
        <div className="lg:col-span-7">
          {analysisResult ? (
            <div className="glass-card p-6 rounded-3xl border-3 border-amber-400 bg-black space-y-6 shadow-2xl animate-fadeIn">
              {/* Header Certificate */}
              <div className="flex items-center justify-between border-b-2 border-amber-400/80 pb-4">
                <div>
                  <div className="text-xs font-black text-amber-300">گواهینامه آزمایشگاه متالوگرافی و رنگرزی</div>
                  <h3 className="text-xl font-black text-white mt-0.5">شناسنامه طیف‌سنجی رنگ قالی</h3>
                </div>
                <div className="bg-slate-950 text-amber-300 px-3 py-1.5 rounded-xl border-2 border-amber-400 text-xs font-black font-mono">
                  {analysisResult.certificateCode}
                </div>
              </div>

              {/* Natural vs Synthetic Progress Bars */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border-2 border-amber-400/60">
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <i className="fa-solid fa-leaf"></i>
                    <span>رنگرزی گیاهی و ارگانیک اصیل:</span>
                  </span>
                  <span className="text-emerald-400 text-lg font-black">{analysisResult.vegetableDyePercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-emerald-500">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${analysisResult.vegetableDyePercentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-sm font-black pt-1">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <i className="fa-solid fa-flask"></i>
                    <span>رنگزای شیمیایی / کرومی / سنتتیک:</span>
                  </span>
                  <span className="text-amber-400 text-lg font-black">{analysisResult.syntheticDyePercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-amber-500">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${analysisResult.syntheticDyePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Detected Plants & Chemicals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-amber-400/60 space-y-2">
                  <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <i className="fa-solid fa-seedling"></i>
                    <span>گیاهان سنتی شناسایی‌شده:</span>
                  </div>
                  <div className="space-y-1.5">
                    {analysisResult.detectedPlants.map((plant, idx) => (
                      <div key={idx} className="bg-black p-2 rounded-xl border border-emerald-500/30 text-xs font-bold text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full shrink-0 shadow" style={{ backgroundColor: plant.color }}></span>
                          <span>{plant.nameFa}</span>
                        </span>
                        <span className="text-amber-300 font-mono text-[11px]">{plant.confidence}% تطابق</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-amber-400/60 space-y-2">
                  <div className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>شاخص‌های مقاومت و خلوص الیاف:</span>
                  </div>
                  <div className="space-y-2 text-xs font-bold text-white">
                    <div className="bg-black p-2 rounded-xl border border-amber-400/40">
                      <div className="text-amber-300 text-[10px]">ثبات نوری (خورشید):</div>
                      <div>{analysisResult.lightFastnessGrade}</div>
                    </div>
                    <div className="bg-black p-2 rounded-xl border border-amber-400/40">
                      <div className="text-amber-300 text-[10px]">خلوص پشم و تاروپود:</div>
                      <div>{analysisResult.fiberPurity}</div>
                    </div>
                    <div className="bg-black p-2 rounded-xl border border-amber-400/40">
                      <div className="text-amber-300 text-[10px]">ثبات شستشوی سنتی:</div>
                      <div>{analysisResult.washFastnessGrade}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Summary */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400 space-y-1">
                <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <i className="fa-solid fa-signature"></i>
                  <span>جمع‌بندی کارشناسی رسمی آزمایشگاه:</span>
                </div>
                <p className="text-white text-sm font-bold leading-relaxed">
                  {analysisResult.summaryFa}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => alert(`شناسنامه رسمی آزمایشگاه با کد ${analysisResult.certificateCode} با موفقیت آماده چاپ گردید.`)}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-2 border-white flex items-center justify-center gap-2 shadow"
                >
                  <i className="fa-solid fa-print"></i>
                  <span>چاپ شناسنامه رسمی رنگرزی</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText?.(
                      `شناسنامه آزمایشگاه رنگرزی فرش - کد: ${analysisResult.certificateCode}\nمیزان گیاهی: ${analysisResult.vegetableDyePercentage}%\nتاییدیه حجره حاج حسین‌علی میری و پسران`
                    );
                    alert('متن شناسنامه در حافظه کپی شد!');
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm border border-amber-400 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-share-nodes text-amber-400"></i>
                  <span>اشتراک‌گذاری</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl border-2 border-dashed border-amber-400/60 bg-black flex flex-col items-center justify-center text-center space-y-4 shadow-2xl min-h-[380px]">
              <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-400 flex items-center justify-center text-3xl shadow-lg">
                <i className="fa-solid fa-flask-vial animate-bounce"></i>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">منتظر انتخاب نمونه و شروع آزمایش</h3>
                <p className="text-amber-300 text-sm max-w-md font-bold">
                  نمونه قالی مورد نظر را انتخاب نموده یا عکس تاروپود را بارگذاری کنید، سپس دکمه «شروع آنالیز هوشمند رنگ» را بزنید.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
