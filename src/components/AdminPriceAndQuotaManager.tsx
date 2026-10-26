import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface AdminPriceAndQuotaManagerProps {
  currentLang: AppLang;
}

interface AdPricingConfig {
  normalAdPrice: number; // in Tomans
  goldenAdPrice: number;
  priorityAdPrice: number;
  currency: string;
}

export const AdminPriceAndQuotaManager: React.FC<AdminPriceAndQuotaManagerProps> = ({ currentLang }) => {
  // Pricing state
  const [pricing, setPricing] = useState<AdPricingConfig>(() => {
    const saved = localStorage.getItem('alimiri_ad_pricing_config');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      normalAdPrice: 180000,
      goldenAdPrice: 550000,
      priorityAdPrice: 950000,
      currency: 'تومان'
    };
  });

  const [normalInput, setNormalInput] = useState(pricing.normalAdPrice.toString());
  const [goldenInput, setGoldenInput] = useState(pricing.goldenAdPrice.toString());
  const [priorityInput, setPriorityInput] = useState(pricing.priorityAdPrice.toString());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quota Renewal simulated state
  const [selectedPackage, setSelectedPackage] = useState<'normal_3' | 'golden_5' | 'priority_10'>('golden_5');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  useEffect(() => {
    localStorage.setItem('alimiri_ad_pricing_config', JSON.stringify(pricing));
  }, [pricing]);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    const updated: AdPricingConfig = {
      normalAdPrice: Number(normalInput) || 180000,
      goldenAdPrice: Number(goldenInput) || 550000,
      priorityAdPrice: Number(priorityInput) || 950000,
      currency: 'تومان'
    };

    setPricing(updated);
    setSuccessMsg('تعرفه‌های جدید قیمت‌گذاری آگهی‌ها در ادمین با موفقیت ذخیره و در سراسر پلتفرم اعمال شد!');
  };

  const handleSimulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      // Update user quota in localStorage
      const userAuthSaved = localStorage.getItem('alimiri_user_auth_identity');
      let currentQuota = 3;
      if (userAuthSaved) {
        try {
          const parsed = JSON.parse(userAuthSaved);
          currentQuota = (parsed.remainingQuota || 0) + (selectedPackage === 'normal_3' ? 3 : selectedPackage === 'golden_5' ? 5 : 10);
          parsed.remainingQuota = currentQuota;
          localStorage.setItem('alimiri_user_auth_identity', JSON.stringify(parsed));
        } catch { /* ignore */ }
      }
    }, 1500);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl border border-amber-500/30">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-amber-500/20 pb-5">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black shadow-inner border border-amber-500/40">
          <i className="fa-solid fa-tags text-amber-400"></i>
          <span>ماژول مدیریت قیمت‌گذاری و درگاه تمدید سهمیه آگهی</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black gold-text tracking-tight">
          تنظیم تعرفه آگهی‌ها و مکانیزم پرداخت و شارژ سهمیه
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          مدیریت نرخ آگهی‌های عادی، طلایی و اولویت‌دار و سیستم شارژ مجدد سهمیه کاربران از طریق درگاه پرداخت بانکی شتاب.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Section 1: Admin Price Configuration Form */}
        <form onSubmit={handleSavePricing} className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-base font-black text-amber-300 flex items-center gap-2 border-b border-amber-500/20 pb-3">
            <i className="fa-solid fa-sliders text-amber-400"></i>
            <span>تعیین نرخ مصوب انواع آگهی (توسط ادمین)</span>
          </h3>

          {successMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
              <i className="fa-solid fa-circle-check ml-1.5"></i>
              {successMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">قیمت آگهی عادی (تومان):</label>
              <input
                type="number"
                value={normalInput}
                onChange={(e) => setNormalInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-wider focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">قیمت آگهی طلایی (ویژه) (تومان):</label>
              <input
                type="number"
                value={goldenInput}
                onChange={(e) => setGoldenInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-wider focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">قیمت آگهی اولویت‌دار / فوری (تومان):</label>
              <input
                type="number"
                value={priorityInput}
                onChange={(e) => setPriorityInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-wider focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl gold-grad text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            <span>ذخیره و اعمال تعرفه‌های جدید</span>
          </button>
        </form>

        {/* Section 2: Quota Renewal & Payment Gateway Simulation */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-black text-amber-300 flex items-center gap-2 border-b border-amber-500/20 pb-3">
              <i className="fa-solid fa-credit-card text-amber-400"></i>
              <span>مکانیزم خرید و تمدید سهمیه آگهی (درگاه بانکی شتاب)</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              کاربران و تجار پس از اتمام سهمیه رایگان خود می‌توانند یکی از پکیج‌های زیر را انتخاب کرده و از طریق درگاه امن بانکی سهمیه آگهی خود را فورا شارژ کنند.
            </p>

            <div className="space-y-3">
              <div
                onClick={() => setSelectedPackage('normal_3')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                  selectedPackage === 'normal_3' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                }`}
              >
                <div>
                  <h4 className="font-bold text-slate-200 text-xs">پکیج ۳ عددی آگهی عادی</h4>
                  <p className="text-[10px] text-slate-400">مناسب برای کاربران شخصی</p>
                </div>
                <span className="font-mono font-black text-emerald-400 text-xs">{(pricing.normalAdPrice * 3).toLocaleString()} تومان</span>
              </div>

              <div
                onClick={() => setSelectedPackage('golden_5')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                  selectedPackage === 'golden_5' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                }`}
              >
                <div>
                  <h4 className="font-bold text-amber-300 text-xs">پکیج ۵ عددی آگهی طلایی (ویژه)</h4>
                  <p className="text-[10px] text-slate-400">پرفروش‌ترین پکیج حجره‌داران</p>
                </div>
                <span className="font-mono font-black text-amber-400 text-xs">{(pricing.goldenAdPrice * 5).toLocaleString()} تومان</span>
              </div>

              <div
                onClick={() => setSelectedPackage('priority_10')}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                  selectedPackage === 'priority_10' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-950'
                }`}
              >
                <div>
                  <h4 className="font-bold text-indigo-300 text-xs">پکیج ۱۰ عددی اولویت‌دار (حرفه‌ای)</h4>
                  <p className="text-[10px] text-slate-400">ویژه صادرکنندگان و تجار بزرگ</p>
                </div>
                <span className="font-mono font-black text-indigo-400 text-xs">{(pricing.priorityAdPrice * 10).toLocaleString()} تومان</span>
              </div>
            </div>

            {paymentStatus === 'success' && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold animate-pulse">
                <i className="fa-solid fa-circle-check ml-1.5"></i>
                پرداخت موفق! تراکنش شاپرک ثبت شد و سهمیه آگهی شما با موفقیت شارژ گردید.
              </div>
            )}
          </div>

          <button
            onClick={handleSimulatePayment}
            disabled={paymentStatus === 'processing'}
            className="w-full py-3 rounded-xl gold-grad text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            {paymentStatus === 'processing' ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                <span>در حال اتصال به درگاه امن بانکی شتاب...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-lock"></i>
                <span>پرداخت آنلاین و شارژ فوری سهمیه آگهی</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
