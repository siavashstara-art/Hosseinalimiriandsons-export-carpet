import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface MerchantAuctionLicensingProps {
  currentLang: AppLang;
}

interface AuctionLicense {
  id: string;
  merchantName: string;
  nationalId: string;
  licenseType: 'rental_monthly' | 'rental_session' | 'permanent_purchase';
  pricePaid: number;
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending_payment';
  roomTitle: string;
  totalAuctionsHosted: number;
}

export const MerchantAuctionLicensingPortal: React.FC<MerchantAuctionLicensingProps> = ({ currentLang }) => {
  const [licenses, setLicenses] = useState<AuctionLicense[]>(() => {
    const saved = localStorage.getItem('alimiri_auction_licenses_registry');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'lic-001',
        merchantName: 'حجره فرش مرصع تبریز (استاد تبریزی)',
        nationalId: '0061234567',
        licenseType: 'permanent_purchase',
        pricePaid: 35, // Million Tomans
        startDate: '1403/08/01',
        expiryDate: 'دائمی (Permanent)',
        status: 'active',
        roomTitle: 'اتاق مزایده اختصاصی تبریز - لوتوس',
        totalAuctionsHosted: 12
      },
      {
        id: 'lic-002',
        merchantName: 'سرای ابریشم اصفهان (حاج مهدی)',
        nationalId: '0059876543',
        licenseType: 'rental_monthly',
        pricePaid: 4.5, // Million Tomans per month
        startDate: '1403/08/15',
        expiryDate: '1403/09/15',
        status: 'active',
        roomTitle: 'حراجی ماهانه شاهکار اصفهان',
        totalAuctionsHosted: 4
      }
    ];
  });

  // New License Form State
  const [merchantName, setMerchantName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [roomTitle, setRoomTitle] = useState('');
  const [licenseType, setLicenseType] = useState<'rental_session' | 'rental_monthly' | 'permanent_purchase'>('rental_monthly');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('alimiri_auction_licenses_registry', JSON.stringify(licenses));
  }, [licenses]);

  const getPriceForType = (type: string) => {
    switch (type) {
      case 'rental_session': return 1.5; // 1.5 Million Tomans per session
      case 'rental_monthly': return 4.5; // 4.5 Million Tomans per month
      case 'permanent_purchase': return 35.0; // 35 Million Tomans permanent license
      default: return 4.5;
    }
  };

  const handleAcquireLicense = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!merchantName.trim() || !nationalId.trim() || !roomTitle.trim()) {
      setErrorMsg('لطفاً نام حجره، کد ملی و عنوان اتاق مزایده را به طور کامل وارد کنید.');
      return;
    }

    if (!/^\d{10}$/.test(nationalId)) {
      setErrorMsg('کد ملی وارد شده باید ۱۰ رقمی و معتبر باشد.');
      return;
    }

    const price = getPriceForType(licenseType);
    const today = new Date().toLocaleDateString('fa-IR');
    let expiry = 'یک ماهه (تا ۳۰ روز آینده)';
    if (licenseType === 'rental_session') expiry = 'تک جلسه (مدت ۴ ساعت)';
    if (licenseType === 'permanent_purchase') expiry = 'دائمی و مادام‌العمر (Permanent)';

    const newLicense: AuctionLicense = {
      id: 'lic-' + Date.now(),
      merchantName: merchantName.trim(),
      nationalId: nationalId.trim(),
      licenseType,
      pricePaid: price,
      startDate: today,
      expiryDate: expiry,
      status: 'active',
      roomTitle: roomTitle.trim(),
      totalAuctionsHosted: 0
    };

    setLicenses([newLicense, ...licenses]);
    setSuccessMsg(`تبریک! لایسنس اتاق مزایده آنلاین با موفقیت برای حجره شما فعال شد. مبلغ پرداختی: ${price} میلیون تومان.`);
    setMerchantName('');
    setNationalId('');
    setRoomTitle('');
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-500/30 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 border-b border-amber-500/20 pb-5">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black shadow-inner border border-amber-500/40">
          <i className="fa-solid fa-store text-amber-400"></i>
          <span>سامانه واگذاری و درآمدزایی از پلتفرم حراج آنلاین (B2B SaaS)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black gold-text tracking-tight">
          فروش و اجاره اتاق مزایده آنلاین به تجار و حجره‌داران فرش
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          سایر تجار، صادرکنندگان و گالری‌های فرش می‌توانند زیرساخت اختصاصی اتاق مزایده زمان‌دار ما را به صورت ماهیانه، جلسه‌ای یا خرید دائمی لایسنس اجاره یا خریداری کنند.
        </p>
      </div>

      {/* Pricing Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Plan 1: Session Rental */}
        <div className={`glass-card rounded-2xl p-5 space-y-4 border ${licenseType === 'rental_session' ? 'border-amber-500 bg-amber-500/10 shadow-xl' : 'border-slate-800 bg-slate-900/80'}`}>
          <div className="flex justify-between items-center">
            <span className="bg-slate-800 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">تک جلسه (موقتی)</span>
            <span className="text-emerald-400 font-black text-base font-mono">۱.۵ م ت</span>
          </div>
          <h3 className="font-black text-amber-200 text-sm">اجاره اتاق مزایده تک جلسه</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            مناسب برای برگزاری یک رویداد حراجی ۴ ساعته ویژه برای معرفی قالیچه‌های خاص به مشتریان خاص.
          </p>
          <button
            onClick={() => setLicenseType('rental_session')}
            className={`w-full py-2 rounded-xl text-xs font-bold transition ${
              licenseType === 'rental_session' ? 'gold-grad text-slate-950 font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            انتخاب این طرح
          </button>
        </div>

        {/* Plan 2: Monthly Rental */}
        <div className={`glass-card rounded-2xl p-5 space-y-4 border ${licenseType === 'rental_monthly' ? 'border-amber-500 bg-amber-500/10 shadow-xl scale-105' : 'border-slate-800 bg-slate-900/80'}`}>
          <div className="flex justify-between items-center">
            <span className="bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-black">پرفروش‌ترین</span>
            <span className="text-emerald-400 font-black text-lg font-mono">۴.۵ م ت / ماه</span>
          </div>
          <h3 className="font-black text-amber-200 text-sm">اجاره ماهیانه اتاق مزایده اختصاصی</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            برگزاری نامحدود جلسات حراج در طول ۳۰ روز با برند اختصاصی حجره شما و پشتیبانی فنی ۲۴ ساعته.
          </p>
          <button
            onClick={() => setLicenseType('rental_monthly')}
            className={`w-full py-2 rounded-xl text-xs font-bold transition ${
              licenseType === 'rental_monthly' ? 'gold-grad text-slate-950 font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            انتخاب این طرح
          </button>
        </div>

        {/* Plan 3: Permanent Purchase */}
        <div className={`glass-card rounded-2xl p-5 space-y-4 border ${licenseType === 'permanent_purchase' ? 'border-amber-500 bg-amber-500/10 shadow-xl' : 'border-slate-800 bg-slate-900/80'}`}>
          <div className="flex justify-between items-center">
            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/40">خرید دائمی</span>
            <span className="text-emerald-400 font-black text-base font-mono">۳۵ م ت</span>
          </div>
          <h3 className="font-black text-amber-200 text-sm">خرید مادام‌العمر لایسنس اتاق مزایده</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            تملک دائمی سورس و پنل اتاق مزایده با قابلیت نصب بر روی هاست اختصاصی حجره‌دار و بدون پرداخت حق اشتراک ماهانه.
          </p>
          <button
            onClick={() => setLicenseType('permanent_purchase')}
            className={`w-full py-2 rounded-xl text-xs font-bold transition ${
              licenseType === 'permanent_purchase' ? 'gold-grad text-slate-950 font-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            انتخاب این طرح
          </button>
        </div>
      </div>

      {/* Acquisition Form */}
      <form onSubmit={handleAcquireLicense} className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-black text-amber-300 flex items-center gap-2 border-b border-amber-500/20 pb-3">
          <i className="fa-solid fa-file-contract text-amber-400"></i>
          <span>فرم ثبت سفارش خرید یا اجاره اتاق مزایده آنلاین برای حجره شما</span>
        </h3>

        {successMsg && (
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
            <i className="fa-solid fa-circle-check ml-1.5"></i>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold">
            <i className="fa-solid fa-triangle-exclamation ml-1.5"></i>
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">نام حجره / شرکت / گالری:</label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              placeholder="مثال: سرای فرش ابریشم اصفهان"
              className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">کد ملی مدیر حجره (احراز هویت):</label>
            <input
              type="text"
              maxLength={10}
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="مثال: 0061234567"
              className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono tracking-wider focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">نام دلخواه اتاق مزایده:</label>
            <input
              type="text"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              placeholder="مثال: حراجی تخصصی اصفهان"
              className="w-full bg-slate-950 border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl gold-grad text-slate-950 font-black text-xs shadow-lg hover:brightness-115 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span>نهایی‌سازی و فعال‌سازی فوری لایسنس ({getPriceForType(licenseType)} میلیون تومان)</span>
          </button>
        </div>
      </form>

      {/* Active Licenses Registry Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-amber-400"></i>
          <span>فهرست حجره‌داران و تجار دارای لایسنس فعال اتاق مزایده</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-start">نام حجره / تجار</th>
                <th className="p-3.5 text-start">کد ملی مدیر</th>
                <th className="p-3.5 text-start">نوع لایسنس</th>
                <th className="p-3.5 text-start">عنوان اتاق مزایده</th>
                <th className="p-3.5 text-start">تاریخ شروع / انقضا</th>
                <th className="p-3.5 text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {licenses.map((lic) => (
                <tr key={lic.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3.5 font-bold text-amber-200">{lic.merchantName}</td>
                  <td className="p-3.5 font-mono text-slate-300">{lic.nationalId}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {lic.licenseType === 'permanent_purchase' ? 'خرید دائمی' : lic.licenseType === 'rental_monthly' ? 'اجاره ماهیانه' : 'اجاره تک جلسه'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-200 font-bold">{lic.roomTitle}</td>
                  <td className="p-3.5 text-slate-400 text-[11px]">{lic.startDate} ➔ {lic.expiryDate}</td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      فعال
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
