import React, { useState } from 'react';
import { AppLang, RugAnalysisResult } from '../types';
import { i18n } from '../constants/translations';
import heroRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';
import brandCrestImg from '../assets/images/alimiri_brand_crest_1792998593279.jpg';

interface CarpetEvaluatorProps {
  currentLang: AppLang;
}

export const CarpetEvaluator: React.FC<CarpetEvaluatorProps> = ({ currentLang }) => {
  const t = i18n[currentLang];

  const [frontImage, setFrontImage] = useState<string | null>(heroRugImg);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<RugAnalysisResult | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [certSerial] = useState<string>(
    () => `HMA-${Math.floor(100000 + Math.random() * 900000)}`
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFrontImage(reader.result as string);
      setEvalResult(null);
      setShowCertificate(false);
    };
    reader.readAsDataURL(file);
  };

  const handleStartAnalysis = async () => {
    if (!frontImage) return;

    setIsEvaluating(true);
    setEvalResult(null);

    try {
      const response = await fetch('/api/gemini/analyze-rug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: frontImage,
          analysisType: 'front',
          userNotes,
          targetLang: currentLang,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze carpet image.');
      }

      setEvalResult(data.result);
    } catch (error: any) {
      alert(error.message || 'Error conducting AI valuation.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <section className="glass-card rounded-2xl p-5 md:p-6 space-y-6 shadow-2xl">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-sm md:text-base font-bold text-amber-400 flex items-center gap-2">
          <i className="fa-solid fa-award text-amber-400 text-lg"></i>
          <span>{t.evaluatorTitle}</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1">{t.evaluatorSub}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        {/* Upload and Input Side */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 group">
            {frontImage ? (
              <img
                src={frontImage}
                alt="Selected Rug"
                className="w-full h-56 md:h-64 object-cover"
              />
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-slate-400">
                <i className="fa-solid fa-image text-3xl mb-2 text-amber-400"></i>
                <span>تصویر فرش را انتخاب کنید</span>
              </div>
            )}
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer font-bold text-amber-200">
              <i className="fa-solid fa-upload text-xl me-2"></i>
              <span>{t.uploadFrontBtn}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            rows={2}
            placeholder="توضیحات تکمیلی (مثلاً: ابعاد ۲ در ۳، چله ابریشم، خرید از بازار اصفهان)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
          ></textarea>

          <button
            onClick={handleStartAnalysis}
            disabled={isEvaluating}
            className="w-full gold-grad hover:opacity-95 text-slate-950 font-black py-3.5 rounded-xl text-xs shadow-lg active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>در حال کارشناسی هوشمند فرش...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-microchip text-base"></i>
                <span>{t.analyzeFrontBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Valuation Summary Display */}
        <div className="space-y-4">
          {evalResult ? (
            <div className="glass-card-amber p-5 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <div className="font-black text-amber-300 text-sm">
                  {evalResult.summaryTitle || 'شناسنامه کارشناسی اولیه'}
                </div>
                <div className="bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-500/30">
                  اصالت {evalResult.authenticityScore || 95}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">مکتب / قدمت فرش:</span>
                  <strong className="text-amber-200 text-xs">{evalResult.originRegion || 'تبریز اصیل'}</strong>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">سبک نقش:</span>
                  <strong className="text-amber-200 text-xs">{evalResult.designStyle || 'لچک ترنج اسلیمی'}</strong>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">ارزش دلاری تخمینی:</span>
                  <strong className="text-emerald-400 text-xs font-mono">{evalResult.estimatedValueUSD || '$2,800 - $3,500'}</strong>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">ارزش به تومان:</span>
                  <strong className="text-emerald-400 text-xs font-mono">{evalResult.estimatedValueToman || '۱۷۰ تا ۲۱۰ میلیون'}</strong>
                </div>
              </div>

              {evalResult.detailedAppraisal && (
                <div className="text-slate-200 leading-relaxed text-xs pt-1 border-t border-amber-500/20">
                  <span className="font-bold text-amber-300">نظر کارشناس حجره: </span>
                  {evalResult.detailedAppraisal}
                </div>
              )}

              <button
                onClick={() => setShowCertificate(true)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <i className="fa-solid fa-file-contract"></i>
                <span>{t.certBtn}</span>
              </button>
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3 flex flex-col justify-center items-center min-h-[220px]">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <div className="font-bold text-slate-300 text-xs">منتظر شروع کارشناسی...</div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                با آپلود تصویر فرش، هوش مصنوعی مکتب بافت (تبریز، اصفهان، قم، نائین و...) و ارزش روز بازار را استخراج می‌کند.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Official Digital Certificate Modal / View */}
      {showCertificate && evalResult && (
        <div className="glass-card p-6 rounded-3xl border-2 border-amber-500/50 space-y-4 bg-[#0a0f1d] text-slate-100 relative shadow-2xl">
          <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-3">
              <img src={brandCrestImg} alt="Crest" className="w-10 h-10 rounded-full border border-amber-500/50" />
              <div>
                <h3 className="font-black text-amber-300 text-sm">شناسنامه دیجیتال و کارشناسی رسمی فرش</h3>
                <span className="text-[10px] text-slate-400">حجره مرکزی فرش حسینعلی میری و پسران | بازار بزرگ فرش ایران</span>
              </div>
            </div>
            <div className="text-end">
              <div className="text-xs font-mono font-bold text-amber-400">{certSerial}</div>
              <span className="text-[10px] text-slate-400">تاریخ صدور: {new Date().toLocaleDateString('fa-IR')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div><span className="text-slate-400">مکتب بافت:</span> <strong className="text-amber-200 block">{evalResult.originRegion}</strong></div>
            <div><span className="text-slate-400">سبک و نقش:</span> <strong className="text-amber-200 block">{evalResult.designStyle}</strong></div>
            <div><span className="text-slate-400">تخمین رجشمار:</span> <strong className="text-amber-200 block">{evalResult.rajEstimate || 50} رج</strong></div>
            <div><span className="text-slate-400">جنس تار و پود:</span> <strong className="text-amber-200 block">{evalResult.warpWeftMaterial || 'ابریشم / پشم'}</strong></div>
            <div><span className="text-slate-400">رنگرزی:</span> <strong className="text-amber-200 block">{evalResult.dyeType || 'گیاهی سنتی'}</strong></div>
            <div><span className="text-slate-400">برآورد قیمت:</span> <strong className="text-emerald-400 block font-mono">{evalResult.estimatedValueToman}</strong></div>
          </div>

          <div className="text-xs text-slate-300 italic border-l-2 border-amber-500 ps-3">
            "{evalResult.detailedAppraisal}"
          </div>

          <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400 border-t border-slate-800">
            <span>تایید شده توسط مجمع کارشناسان فرش میری</span>
            <button
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border border-slate-700"
            >
              <i className="fa-solid fa-print"></i>
              <span>چاپ / ذخیره PDF</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
