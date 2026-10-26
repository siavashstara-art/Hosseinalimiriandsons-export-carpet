import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface CarpetAuthAndModerationProps {
  currentLang: AppLang;
}

interface UserAuthRecord {
  fullName: string;
  nationalId: string;
  phoneNumber: string;
  isVerified: boolean;
  verifiedAt?: string;
  trustScore: number;
  remainingQuota: number;
  totalAdsSubmitted: number;
}

interface AuthenticatedAd {
  id: string;
  title: string;
  category: 'handmade' | 'machine';
  priceToman: number;
  areaSqm: number;
  raj: number;
  city: string;
  sellerNationalId: string;
  sellerName: string;
  image: string;
  status: 'pending_admin' | 'approved' | 'rejected_anomaly' | 'rejected_duplicate';
  adminNote?: string;
  createdAt: string;
  pricePerSqm: number;
  suggestedMinPrice: number;
  suggestedMaxPrice: number;
}

export const CarpetAuthAndModeration: React.FC<CarpetAuthAndModerationProps> = ({ currentLang }) => {
  // Load saved auth user or default state
  const [authData, setAuthData] = useState<UserAuthRecord>(() => {
    const saved = localStorage.getItem('alimiri_user_auth_identity');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      fullName: '',
      nationalId: '',
      phoneNumber: '',
      isVerified: false,
      trustScore: 85,
      remainingQuota: 3,
      totalAdsSubmitted: 0,
    };
  });

  // Verification step form state
  const [inputName, setInputName] = useState(authData.fullName);
  const [inputNationalId, setInputNationalId] = useState(authData.nationalId);
  const [inputPhone, setInputPhone] = useState(authData.phoneNumber);
  const [verificationError, setVerificationError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Ad Submission Form State
  const [adTitle, setAdTitle] = useState('');
  const [adCategory, setAdCategory] = useState<'handmade' | 'machine'>('handmade');
  const [adPriceToman, setAdPriceToman] = useState<number>(120); // in Million Tomans
  const [adAreaSqm, setAdAreaSqm] = useState<number>(9);
  const [adRaj, setAdRaj] = useState<number>(50);
  const [adCity, setAdCity] = useState('تهران');
  const [adImage, setAdImage] = useState('https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80');
  const [adSubmitMessage, setAdSubmitMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Loaded Ads List
  const [adsList, setAdsList] = useState<AuthenticatedAd[]>(() => {
    const saved = localStorage.getItem('alimiri_authenticated_ads_registry');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'ad-101',
        title: 'قالیچه اعلای تبریز ۶۰ رج چله ابریشم',
        category: 'handmade',
        priceToman: 180,
        areaSqm: 6,
        raj: 60,
        city: 'تبریز',
        sellerNationalId: '0061234567',
        sellerName: 'محمد علی تبریزی',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        status: 'approved',
        createdAt: '1403/08/12',
        pricePerSqm: 30,
        suggestedMinPrice: 20,
        suggestedMaxPrice: 45,
      },
      {
        id: 'ad-102',
        title: 'فرش دستباف کاشان طرح لچک ترنج',
        category: 'handmade',
        priceToman: 95,
        areaSqm: 12,
        raj: 40,
        city: 'کاشان',
        sellerNationalId: '0059876543',
        sellerName: 'رضا کاشانی',
        image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
        status: 'pending_admin',
        createdAt: '1403/08/15',
        pricePerSqm: 7.9,
        suggestedMinPrice: 6,
        suggestedMaxPrice: 15,
      }
    ];
  });

  // Admin view toggle
  const [activeSubTab, setActiveSubTab] = useState<'my_auth' | 'submit_ad' | 'admin_panel'>('my_auth');

  useEffect(() => {
    localStorage.setItem('alimiri_user_auth_identity', JSON.stringify(authData));
  }, [authData]);

  useEffect(() => {
    localStorage.setItem('alimiri_authenticated_ads_registry', JSON.stringify(adsList));
  }, [adsList]);

  // Iranian National ID validation algorithm (کد ملی ۱۰ رقمی)
  const validateIranianNationalId = (code: string): boolean => {
    if (!/^\d{10}$/.test(code)) return false;
    // Check for repetitive digits
    if (/^(\d)\1{9}$/.test(code)) return false;
    
    const check = parseInt(code.charAt(9), 10);
    let sum = 0;
    for (let i = 0; i < 9; ++i) {
      sum += parseInt(code.charAt(i), 10) * (10 - i);
    }
    const rem = sum % 11;
    return (rem < 2 && check === rem) || (rem >= 2 && check === 11 - rem);
  };

  // Iranian Mobile Number validation (09xxxxxxxxx)
  const validateIranianMobile = (phone: string): boolean => {
    return /^09\d{9}$/.test(phone);
  };

  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');
    setSuccessMsg('');

    if (!inputName.trim() || inputName.length < 3) {
      setVerificationError('لطفاً نام و نام خانوادگی کامل خود را وارد کنید.');
      return;
    }

    if (!validateIranianNationalId(inputNationalId)) {
      setVerificationError('کد ملی وارد شده نامعتبر است (باید ۱۰ رقم صحیح بر اساس الگوریتم ثبت احوال باشد).');
      return;
    }

    if (!validateIranianMobile(inputPhone)) {
      setVerificationError('شماره موبایل وارد شده نامعتبر است (باید با 09 شروع شده و ۱۱ رقم باشد).');
      return;
    }

    // Success verification
    const verifiedRecord: UserAuthRecord = {
      fullName: inputName.trim(),
      nationalId: inputNationalId.trim(),
      phoneNumber: inputPhone.trim(),
      isVerified: true,
      verifiedAt: new Date().toLocaleDateString('fa-IR'),
      trustScore: 95,
      remainingQuota: authData.remainingQuota > 0 ? authData.remainingQuota : 3,
      totalAdsSubmitted: authData.totalAdsSubmitted,
    };

    setAuthData(verifiedRecord);
    setSuccessMsg('احراز هویت کد ملی و شماره موبایل با موفقیت در سامانه ثبت احوال و اپراتور تایید شد!');
  };

  const handleLogoutAuth = () => {
    setAuthData({
      fullName: '',
      nationalId: '',
      phoneNumber: '',
      isVerified: false,
      trustScore: 85,
      remainingQuota: 3,
      totalAdsSubmitted: 0,
    });
    setInputName('');
    setInputNationalId('');
    setInputPhone('');
    setSuccessMsg('اطلاعات احراز هویت پاک شد.');
  };

  // Submit Ad with Anti-Duplicate & Price Sanity Check
  const handleAddNewAd = (e: React.FormEvent) => {
    e.preventDefault();
    setAdSubmitMessage(null);

    if (!authData.isVerified) {
      setAdSubmitMessage({
        type: 'error',
        text: 'برای ثبت آگهی، ابتدا باید احراز هویت کد ملی و شماره موبایل خود را در بخش بالا تکمیل کنید.'
      });
      setActiveSubTab('my_auth');
      return;
    }

    if (!adTitle.trim() || adTitle.length < 5) {
      setAdSubmitMessage({ type: 'error', text: 'عنوان آگهی باید حداقل ۵ حرف باشد.' });
      return;
    }

    // 1. Anti-Duplicate Check: Check if this user has already posted an ad with very similar title in the last 14 days
    const isDuplicate = adsList.some(
      ad => ad.sellerNationalId === authData.nationalId &&
            ad.title.trim().toLowerCase() === adTitle.trim().toLowerCase()
    );

    if (isDuplicate) {
      setAdSubmitMessage({
        type: 'error',
        text: 'خطای ضدتکرار (Anti-Duplicate): شما قبلاً آگهی مشابهی با این عنوان ثبت کرده‌اید. ثبت آگهی تکراری در سیستم ممنوع است.'
      });
      return;
    }

    // 2. Price Sanity Control
    const pricePerSqm = adPriceToman / (adAreaSqm || 1);
    let minReasonablePerSqm = adCategory === 'handmade' ? (adRaj * 0.3) : 1.5;
    let maxReasonablePerSqm = adCategory === 'handmade' ? (adRaj * 2.5) : 8.0;

    let suggestedMin = Math.round(minReasonablePerSqm * adAreaSqm);
    let suggestedMax = Math.round(maxReasonablePerSqm * adAreaSqm);

    let status: 'pending_admin' | 'approved' | 'rejected_anomaly' = 'pending_admin';
    let adminNote = 'در انتظار بازبینی و تایید اصالت توسط ادمین داخلی پلتفرم';

    if (adPriceToman < suggestedMin * 0.4) {
      status = 'rejected_anomaly';
      adminNote = `رد شده به دلیل قیمت غیرواقعی پایین (${adPriceToman} میلیون تومان). حداقل قیمت عرف برای این مشخصات ${suggestedMin} میلیون تومان است.`;
    } else if (adPriceToman > suggestedMax * 2.5) {
      status = 'rejected_anomaly';
      adminNote = `رد شده به دلیل قیمت غیرواقعی بالا و نجومی (${adPriceToman} میلیون تومان). حداکثر قیمت کارشناسی ${suggestedMax} میلیون تومان است.`;
    } else {
      status = 'pending_admin';
      adminNote = 'گواهی اصالت اولیه صادر شد. پس از تایید نهایی ادمین داخلی، در ویترین استان قرار می‌گیرد.';
    }

    const newAd: AuthenticatedAd = {
      id: 'ad-' + Date.now(),
      title: adTitle.trim(),
      category: adCategory,
      priceToman: Number(adPriceToman),
      areaSqm: Number(adAreaSqm),
      raj: Number(adRaj),
      city: adCity,
      sellerNationalId: authData.nationalId,
      sellerName: authData.fullName,
      image: adImage,
      status,
      adminNote,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      pricePerSqm: Number(pricePerSqm.toFixed(1)),
      suggestedMinPrice: suggestedMin,
      suggestedMaxPrice: suggestedMax,
    };

    setAdsList([newAd, ...adsList]);
    setAuthData(prev => ({
      ...prev,
      totalAdsSubmitted: prev.totalAdsSubmitted + 1,
      remainingQuota: Math.max(0, prev.remainingQuota - 1)
    }));

    if (status === 'rejected_anomaly') {
      setAdSubmitMessage({
        type: 'error',
        text: `ثبت آگهی رد شد! ${adminNote}`
      });
    } else {
      setAdSubmitMessage({
        type: 'success',
        text: 'آگهی شما با موفقیت ثبت شد و با موفقیت از فیلتر ضدتکرار عبور کرد. در صف تاییدیه داخلی ادمین قرار گرفت.'
      });
      setAdTitle('');
    }
  };

  const handleAdminAction = (adId: string, newStatus: 'approved' | 'rejected_anomaly', note: string) => {
    setAdsList(prev => prev.map(ad => ad.id === adId ? { ...ad, status: newStatus, adminNote: note } : ad));
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-500/30 space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-2 border-b border-amber-500/20 pb-5">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black shadow-inner border border-amber-500/40">
          <i className="fa-solid fa-shield-halved text-amber-400"></i>
          <span>سامانه جامع احراز هویت، اصالت‌سنجی و نظارت داخلی فرش</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black gold-text tracking-tight">
          کنترل اصالت، ضدتکرار و قیمت‌گذاری منصفانه
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          مطابق ضوابط پلتفرم، تمامی آگهی‌ها نیازمند تطابق کد ملی با شماره موبایل مالک، تاییدیه اصالت فرش و نظارت داخلی قیمت‌ها بدون وابستگی به صنف خارج از سازمان هستند.
        </p>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-amber-500/20">
        <button
          onClick={() => setActiveSubTab('my_auth')}
          className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeSubTab === 'my_auth'
              ? 'gold-grad text-slate-950 shadow-lg'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-id-card text-sm"></i>
          <span>احراز هویت کد ملی</span>
        </button>

        <button
          onClick={() => setActiveSubTab('submit_ad')}
          className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeSubTab === 'submit_ad'
              ? 'gold-grad text-slate-950 shadow-lg'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-circle-plus text-sm"></i>
          <span>ثبت آگهی امن</span>
        </button>

        <button
          onClick={() => setActiveSubTab('admin_panel')}
          className={`py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            activeSubTab === 'admin_panel'
              ? 'gold-grad text-slate-950 shadow-lg'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-gavel text-sm"></i>
          <span>مدیریت و تاییدیه داخلی ({adsList.filter(a => a.status === 'pending_admin').length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: MY AUTHENTICATION */}
      {activeSubTab === 'my_auth' && (
        <div className="space-y-6">
          {authData.isVerified ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-300 text-2xl font-bold">
                    <i className="fa-solid fa-user-check"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-300">حساب کاربری احراز هویت‌شده</h3>
                    <p className="text-xs text-slate-300">کد ملی و سیم‌کارت به نام شما در سامانه تأیید شد.</p>
                  </div>
                </div>
                <button
                  onClick={handleLogoutAuth}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>ویرایش یا خروج</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-slate-400 block">نام و نام خانوادگی:</span>
                  <span className="text-sm font-bold text-slate-100">{authData.fullName}</span>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-slate-400 block">کد ملی (تایید ثبت احوال):</span>
                  <span className="text-sm font-bold text-amber-300 tracking-wider">{authData.nationalId}</span>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-slate-400 block">شماره موبایل (به نام ملی):</span>
                  <span className="text-sm font-bold text-indigo-300 tracking-wider">{authData.phoneNumber}</span>
                </div>
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-slate-400 block">سهمیه آگهی رایگان باقی‌مانده:</span>
                  <span className="text-sm font-black text-emerald-400">{authData.remainingQuota} آگهی</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyIdentity} className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-amber-500/20 pb-3">
                <div className="w-10 h-10 rounded-xl gold-grad flex items-center justify-center text-slate-950 font-black">
                  <i className="fa-solid fa-fingerprint"></i>
                </div>
                <div>
                  <h3 className="text-base font-black text-amber-300">فرم احراز هویت هوشمند ملی</h3>
                  <p className="text-xs text-slate-300">وارد کردن نام، کد ملی و شماره موبایل منطبق با کد ملی الزامی است.</p>
                </div>
              </div>

              {verificationError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold">
                  <i className="fa-solid fa-triangle-exclamation ml-1.5"></i>
                  {verificationError}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                  <i className="fa-solid fa-circle-check ml-1.5"></i>
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">نام و نام خانوادگی (مطابق کارت ملی):</label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="مثال: اکبر علیمیری"
                    className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">کد ملی (۱۰ رقم بدون خط تیره):</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={inputNationalId}
                    onChange={(e) => setInputNationalId(e.target.value)}
                    placeholder="مثال: 0061234567"
                    className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-wider focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">شماره موبایل (به نام صاحب کد ملی):</label>
                  <input
                    type="text"
                    maxLength={11}
                    value={inputPhone}
                    onChange={(e) => setInputPhone(e.target.value)}
                    placeholder="مثال: 09123456789"
                    className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-indigo-300 font-mono tracking-wider focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl gold-grad text-slate-950 font-black text-xs shadow-lg hover:brightness-115 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-shield-check"></i>
                  <span>تایید و ثبت احراز هویت ملی</span>
                </button>
              </div>
            </form>
          )}

          {/* Practical Step-by-Step Guide for National ID & Phone Verification */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-list-check text-amber-400"></i>
              <span>راهنمای عملی و گام‌به‌گام احراز هویت کد ملی و شماره موبایل</span>
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">۱</span>
                <h5 className="font-bold text-slate-200 text-xs">ورود نام کامل</h5>
                <p className="text-[11px] text-slate-400">نام و نام خانوادگی خود را دقیقاً مطابق با کارت ملی هوشمند وارد کنید.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">۲</span>
                <h5 className="font-bold text-slate-200 text-xs">کد ملی ۱۰ رقمی</h5>
                <p className="text-[11px] text-slate-400">کد ملی ۱۰ رقمی بدون خط تیره را وارد کنید تا الگوریتم ثبت‌احوال اعتبارسنچی کند.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">۳</span>
                <h5 className="font-bold text-slate-200 text-xs">سیم‌کارت به نام</h5>
                <p className="text-[11px] text-slate-400">شماره موبایل باید با ۰۹ شروع شده و به نام همان کد ملی ثبت شده باشد.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">۴</span>
                <h5 className="font-bold text-slate-200 text-xs">تایید نهایی و سهمیه</h5>
                <p className="text-[11px] text-slate-400">پس از تایید، نشان کاربر احراز هویت‌شده و سهمیه آگهی امن فعال می‌شود.</p>
              </div>
            </div>
          </div>

          {/* Legal Liabilities & Terms of Digital Certificate of Authenticity */}
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl p-6 space-y-3">
            <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-scale-balanced text-amber-400"></i>
              <span>آیا صدور گواهی اصالت دیجیتال تبعات حقوقی دارد؟ (پاسخ حقوقی و صنفی)</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>بله کاملاً!</strong> گواهی اصالت دیجیتال صادر شده توسط سامانه (حاوی QR Code و امضای دیجیتال پلتفرم) یک <strong>سند تعهدآور حقوقی و صنفی</strong> است. فروشنده با ثبت کد ملی و دریافت این گواهی برای فرش خود، قانوناً مسئول اصالت متریال (ابریشم خالص، پشم اعلا، کرک)، رجشمار اعلامی و قیمت منصفانه است.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              در صورت اثبات هرگونه مغایرت، تقلب در متریال یا ارائه اطلاعات خلاف واقع، پلتفرم حق دارد علاوه بر مسدودسازی دائم حساب کاربری، گواهی صادره را ابطال کرده و خسارت وارده را از طریق مراجع قانونی مطالبه نماید. این نظارت داخلی تضمین‌کننده اعتماد خریداران داخلی و خارجی است.
            </p>
          </div>

          {/* Guidelines on Anti-Duplicate and Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-amber-500/20 p-5 rounded-2xl space-y-2">
              <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <i className="fa-solid fa-clone text-amber-400"></i>
                <span>قانون ضدتکرار آگهی‌ها (Anti-Duplicate Engine)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                سیستم به‌صورت هوشمند بررسی می‌کند که هیچ کاربری نتواند یک فرش را با مشخصات و عنوان تکراری چندین بار آگهی کند. هر آگهی ثبت‌شده به کد ملی ثبت‌کننده متصل است.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-amber-500/20 p-5 rounded-2xl space-y-2">
              <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-amber-400"></i>
                <span>تاییدیه اصالت و کنترل قیمت داخلی</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                قیمت‌های غیرواقعی یا نجومی به طور خودکار شناسایی شده و پیش از انتشار در بازار، توسط تیم نظارت داخلی پلتفرم بررسی و تایید می‌شوند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SUBMIT SECURE AD */}
      {activeSubTab === 'submit_ad' && (
        <form onSubmit={handleAddNewAd} className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-grad flex items-center justify-center text-slate-950 font-black">
                <i className="fa-solid fa-plus"></i>
              </div>
              <div>
                <h3 className="text-base font-black text-amber-300">ثبت آگهی فرش با فیلتر هوشمند اصالت و قیمت</h3>
                <p className="text-xs text-slate-300">ثبت آگهی مستقیماً به کد ملی احراز شده‌ی شما وصل است.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full">
              سهمیه باقی‌مانده: {authData.remainingQuota}
            </span>
          </div>

          {adSubmitMessage && (
            <div className={`p-3.5 rounded-xl text-xs font-bold border ${
              adSubmitMessage.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}>
              <i className={`fa-solid ${adSubmitMessage.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'} ml-1.5`}></i>
              {adSubmitMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">عنوان آگهی فرش:</label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="مثال: قالیچه دستباف تبریز ۵۰ رج ابریشم"
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">دسته‌بندی:</label>
              <select
                value={adCategory}
                onChange={(e) => setAdCategory(e.target.value as 'handmade' | 'machine')}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
              >
                <option value="handmade">فرش دستباف اصیل</option>
                <option value="machine">فرش ماشینی استاندارد</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">قیمت (میلیون تومان):</label>
              <input
                type="number"
                value={adPriceToman}
                onChange={(e) => setAdPriceToman(Number(e.target.value))}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">متراژ (متر مربع):</label>
              <input
                type="number"
                value={adAreaSqm}
                onChange={(e) => setAdAreaSqm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">رجشمار (تعداد گره در ۷ سانت):</label>
              <input
                type="number"
                value={adRaj}
                onChange={(e) => setAdRaj(Number(e.target.value))}
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">استان / شهر:</label>
              <input
                type="text"
                value={adCity}
                onChange={(e) => setAdCity(e.target.value)}
                placeholder="مثال: اصفهان"
                className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl gold-grad text-slate-950 font-black text-xs shadow-lg hover:brightness-115 transition flex items-center gap-2"
            >
              <i className="fa-solid fa-check-double"></i>
              <span>ثبت و اعتبارسنجی خودکار آگهی</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: ADMIN & MODERATION PANEL */}
      {activeSubTab === 'admin_panel' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-clipboard-check text-amber-400"></i>
              <span>لیست نظارت و تاییدیه داخلی ادمین پلتفرم</span>
            </h3>
            <span className="text-xs text-slate-400">تعداد کل آگهی‌ها: {adsList.length}</span>
          </div>

          <div className="space-y-3">
            {adsList.map((ad) => {
              const isPending = ad.status === 'pending_admin';
              const isApproved = ad.status === 'approved';
              const isRejected = ad.status === 'rejected_anomaly';

              return (
                <div key={ad.id} className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-20 h-20 rounded-xl object-cover border border-amber-500/30 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-slate-100">{ad.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          isRejected ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {isApproved ? 'تاییدشده توسط ادمین' : isRejected ? 'رد شده (غیرمتعارف)' : 'در انتظار بازبینی'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 flex items-center gap-3">
                        <span>فروشنده: <b>{ad.sellerName}</b> (کدملی: {ad.sellerNationalId})</span>
                        <span>شهر: <b>{ad.city}</b></span>
                      </div>
                      <div className="text-xs text-amber-300 font-bold">
                        قیمت: {ad.priceToman} میلیون تومان ({ad.areaSqm} متر | رج {ad.raj})
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        نظر سامانه/ادمین: {ad.adminNote}
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleAdminAction(ad.id, 'approved', 'تایید اصالت و قیمت‌گذاری توسط مدیر فنی پلتفرم')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-check"></i>
                          <span>تایید آگهی</span>
                        </button>
                        <button
                          onClick={() => handleAdminAction(ad.id, 'rejected_anomaly', 'رد شده به دلیل مغایرت قیمت یا عدم تطابق اصالت')}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <i className="fa-solid fa-xmark"></i>
                          <span>رد آگهی</span>
                        </button>
                      </>
                    )}
                    {!isPending && (
                      <button
                        onClick={() => handleAdminAction(ad.id, isApproved ? 'rejected_anomaly' : 'approved', 'تغییر وضعیت دستی توسط ادمین')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition"
                      >
                        تغییر وضعیت
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
