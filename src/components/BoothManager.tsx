import React, { useState } from 'react';
import { AppLang, BoothMerchant, CarpetListing, CarpetCategory } from '../types';
import { i18n } from '../constants/translations';
import heroRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';

interface BoothManagerProps {
  currentLang: AppLang;
  selectedProvinceName?: string;
  selectedCityName?: string;
}


// Helper: Iranian National ID Validation Checksum Algorithm
export function isValidIranianNationalId(id: string): boolean {
  const cleanId = id.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
  if (!/^\d{10}$/.test(cleanId)) return false;
  if (/^(\d)\1{9}$/.test(cleanId)) return false; // Reject 1111111111, 0000000000, etc.
  const check = parseInt(cleanId[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanId[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
}

// Helper: Iranian Mobile Number Format Validation
export function isValidIranianMobile(phone: string): boolean {
  const cleanPhone = phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();
  return /^09\d{9}$/.test(cleanPhone);
}

export const INITIAL_BOOTHS: BoothMerchant[] = [
  {
    id: 'booth-1',
    merchantName: 'حاج حسینعلی میری و پسران',
    boothName: 'حجره مرکزی فرش میری (بازار بزرگ)',
    nationalId: '0012345678',
    phoneNumber: '09121234567',
    marketType: 'handmade',
    verified: true,
    reputationStars: 5.0,
    adCount: 2,
    adQuotaMax: 3,
    city: 'تهران (بازار بزرگ)',
    phone: '۰۲۱-۵۵۶۲۱۲۳۴',
    joinDate: '۱۳۵۰ (قدمت ۵۰ ساله)'
  },
  {
    id: 'booth-2',
    merchantName: 'استاد علیرضا تبریزی',
    boothName: 'غرفه قالی شاهکار تبریز',
    nationalId: '1378901234',
    phoneNumber: '09141112233',
    marketType: 'handmade',
    verified: true,
    reputationStars: 4.9,
    adCount: 3,
    adQuotaMax: 3,
    city: 'تبریز (بازار مظفریه)',
    phone: '۰۴۱-۳۵۲۳۹۸۷۶',
    joinDate: '۱۳۷۸'
  },
  {
    id: 'booth-3',
    merchantName: 'مهندس کاظمی',
    boothName: 'غرفه فرش ماشینی کاشان نوین',
    nationalId: '1289012345',
    phoneNumber: '09139876543',
    marketType: 'machine',
    verified: true,
    reputationStars: 4.8,
    adCount: 3,
    adQuotaMax: 3,
    city: 'کاشان',
    phone: '۰۳۱-۵۵۴۴۳۳۲۲',
    joinDate: '۱۳۹۸'
  }
];

export const INITIAL_LISTINGS: CarpetListing[] = [
  {
    id: 'list-1',
    title: 'قالیچه ۶ متری تبریز ۶۰ رج چله ابریشم',
    category: 'handmade',
    priceTomanMillion: 240,
    priceUSD: 4000,
    boothName: 'حجره مرکزی فرش میری',
    nationalIdMasked: '۰۰۱***۵۶۷۸',
    isVerifiedMerchant: true,
    city: 'تهران',
    image: heroRugImg,
    description: 'چله ابریشم، گل‌برجسته با رنگرزی گیاهی سنتی، بدون هیچ‌گونه عیب یا کجی.',
    raj: 60,
    warpMaterial: 'چله ابریشم'
  },
  {
    id: 'list-2',
    title: 'فرش ماشینی ۱۲۰۰ شانه تراکم ۳۶۰۰ آکریلیک هیت‌ست',
    category: 'machine',
    priceTomanMillion: 18.5,
    priceUSD: 310,
    boothName: 'غرفه فرش ماشینی کاشان نوین',
    nationalIdMasked: '۱۲۸***۲۳۴۵',
    isVerifiedMerchant: true,
    city: 'کاشان',
    image: heroRugImg,
    description: 'فرش ماشینی درجه یک کاشان، ۱۲۰۰ شانه واقعی، الیاف آکریلیک بایر آلمان، ضد حساسیت و بدون پرزدهی.',
    machineSpecs: {
      reedCount: 1200,
      density: 3600,
      fiberType: '100% آکریلیک هیت‌ست',
      yarnOrigin: 'بایر آلمان'
    }
  }
];

export const BoothManager: React.FC<BoothManagerProps> = ({
  currentLang,
  selectedProvinceName,
  selectedCityName
}) => {
  const t = i18n[currentLang] || i18n['fa'];

  // State
  const [activeMarket, setActiveMarket] = useState<CarpetCategory>('handmade');
  const [booths, setBooths] = useState<BoothMerchant[]>(INITIAL_BOOTHS);
  const [listings, setListings] = useState<CarpetListing[]>(INITIAL_LISTINGS);


  // Modals
  const [showRegModal, setShowRegModal] = useState<boolean>(false);
  const [showNewAdModal, setShowNewAdModal] = useState<boolean>(false);
  const [selectedBoothForAd, setSelectedBoothForAd] = useState<BoothMerchant | null>(null);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [pendingAdData, setPendingAdData] = useState<any>(null);

  // Registration Form State
  const [merchantName, setMerchantName] = useState<string>('');
  const [boothName, setBoothName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [regMarketType, setRegMarketType] = useState<CarpetCategory>('handmade');
  const [city, setCity] = useState<string>('تهران');
  const [phone, setPhone] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // New Ad Form State
  const [adTitle, setAdTitle] = useState<string>('');
  const [adPriceToman, setAdPriceToman] = useState<string>('');
  const [adPriceUSD, setAdPriceUSD] = useState<string>('');
  const [adDescription, setAdDescription] = useState<string>('');

  // Handle Dual-Factor Booth Registration
  const handleRegisterBooth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    // 1. Validate National ID Checksum
    if (!isValidIranianNationalId(nationalId)) {
      setAuthError('❌ کد ملی ۱۰ رقمی وارد شده از نظر ساختاری و الگوریتم کنترلی نامعتبر است.');
      return;
    }

    // 2. Validate Mobile Number
    if (!isValidIranianMobile(phoneNumber)) {
      setAuthError('❌ شماره موبایل وارد شده نامعتبر است. شماره باید با 09 شروع شده و ۱۱ رقم باشد.');
      return;
    }

    // 3. Unique 1-to-1 Constraint Check (National ID & Phone uniqueness)
    const cleanNatId = nationalId.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
    const cleanPhone = phoneNumber.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();

    const duplicateNatId = booths.find((b) => b.nationalId === cleanNatId);
    if (duplicateNatId) {
      setAuthError(`⚠️ کد ملی (${cleanNatId}) قبلاً در سیستم ثبت شده است. هر شخص با شناسه ملی خود تنها مجاز به ثبت ۱ حجره است.`);
      return;
    }

    const duplicatePhone = booths.find((b) => b.phoneNumber === cleanPhone);
    if (duplicatePhone) {
      setAuthError(`⚠️ شماره موبایل (${cleanPhone}) قبلاً به حجره دیگری اختصاص یافته است.`);
      return;
    }

    const newBooth: BoothMerchant = {
      id: `booth-${Date.now()}`,
      merchantName,
      boothName,
      nationalId: cleanNatId,
      phoneNumber: cleanPhone,
      marketType: regMarketType,
      verified: true,
      reputationStars: 5.0,
      adCount: 0,
      adQuotaMax: 3, // Default 3 free active listings per National ID
      city: city || 'تهران',
      phone: phone || cleanPhone,
      joinDate: new Date().toLocaleDateString('fa-IR')
    };

    setBooths([newBooth, ...booths]);
    setShowRegModal(false);
    setMerchantName('');
    setBoothName('');
    setNationalId('');
    setPhoneNumber('');

    alert(`✅ حجره «${boothName}» با موفقیت ثبت و با استعلام کد ملی (${cleanNatId}) احراز هویت گردید.\nسهمیه شما: ۳ آگهی فعال رایگان.`);
  };

  // Open Ad Modal for a Specific Booth
  const handleOpenNewAdModal = (booth: BoothMerchant) => {
    setSelectedBoothForAd(booth);
    setAdTitle('');
    setAdPriceToman('');
    setAdPriceUSD('');
    setAdDescription('');
    setShowNewAdModal(true);
  };

  // Submit Ad & Quota Paywall Evaluation
  const handlePostAdSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoothForAd) return;

    const adData = {
      id: `list-${Date.now()}`,
      title: adTitle || 'فرش فاخر بازار',
      category: selectedBoothForAd.marketType,
      priceTomanMillion: parseFloat(adPriceToman) || 100,
      priceUSD: parseFloat(adPriceUSD) || 1500,
      boothName: selectedBoothForAd.boothName,
      nationalIdMasked: `${selectedBoothForAd.nationalId.slice(0, 3)}***${selectedBoothForAd.nationalId.slice(-4)}`,
      isVerifiedMerchant: true,
      city: selectedBoothForAd.city,
      image: heroRugImg,
      description: adDescription || 'توضیحات آگهی کارشناسی شده.'
    };

    // Check Quota
    if (selectedBoothForAd.adCount >= selectedBoothForAd.adQuotaMax) {
      // Quota Exceeded -> Open Paywall Modal
      setPendingAdData(adData);
      setShowNewAdModal(false);
      setShowPaywallModal(true);
    } else {
      // Within Free Quota -> Publish Free
      publishAd(selectedBoothForAd.id, adData, false);
      setShowNewAdModal(false);
      alert('🎉 آگهی شما با موفقیت و به صورت رایگان از سهمیه کد ملی منتشر شد.');
    }
  };

  // Publish Helper Function
  const publishAd = (boothId: string, adData: CarpetListing, isPaid: boolean) => {
    setListings([adData, ...listings]);
    setBooths((prevBooths) =>
      prevBooths.map((b) =>
        b.id === boothId ? { ...b, adCount: b.adCount + 1 } : b
      )
    );
  };

  // Handle Paywall Gateway Payment Completion
  const handlePaywallPayment = () => {
    if (!selectedBoothForAd || !pendingAdData) return;
    publishAd(selectedBoothForAd.id, pendingAdData, true);
    setShowPaywallModal(false);
    setPendingAdData(null);
    alert('💳 پرداخت تعرفه آگهی مازاد (۱۵۰,۰۰۰ تومان) با موفقیت انجام گردید.\nآگهی شما در تالار بین‌المللی منتشر شد.');
  };

  const filteredBooths = booths.filter((b) => {
    const matchesMarket = b.marketType === activeMarket;
    const matchesProvince = !selectedProvinceName || selectedProvinceName === 'سراسر کشور (ایران)' || (b.province && (b.province.includes(selectedProvinceName) || selectedProvinceName.includes(b.province))) || b.city.includes(selectedProvinceName);
    const matchesCity = !selectedCityName || selectedCityName === 'all' || b.city.includes(selectedCityName);
    return matchesMarket && matchesProvince && matchesCity;
  });

  const filteredListings = listings.filter((l) => {
    const matchesMarket = l.category === activeMarket;
    const matchesProvince = !selectedProvinceName || selectedProvinceName === 'سراسر کشور (ایران)' || (l.province && (l.province.includes(selectedProvinceName) || selectedProvinceName.includes(l.province))) || l.city.includes(selectedProvinceName);
    const matchesCity = !selectedCityName || selectedCityName === 'all' || l.city.includes(selectedCityName);
    return matchesMarket && matchesProvince && matchesCity;
  });


  return (
    <section className="glass-card rounded-3xl p-5 md:p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Title & Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-amber-500/30 pb-4 gap-3">
        <div>
          <h2 className="text-base md:text-xl font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-store text-amber-400"></i>
            <span>حجره بازار دیجیتال (احراز هویت کد ملی + شماره موبایل)</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            تفکیک دقیق بازار دستباف و ماشینی | احراز هویت دو عاملی | مدل سهمیه رایگان و نظارت بر کد ملی
          </p>
        </div>

        <button
          onClick={() => {
            setAuthError(null);
            setShowRegModal(true);
          }}
          className="gold-grad text-slate-950 font-black px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
        >
          <i className="fa-solid fa-user-shield text-base"></i>
          <span>ثبت حجره با کد ملی و موبایل</span>
        </button>
      </div>

      {/* Market Segmentation Tabs (تفکیک ساختاری بازارها) */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950/80 rounded-2xl border border-amber-500/30">
        <button
          onClick={() => setActiveMarket('handmade')}
          className={`py-3 px-4 rounded-xl text-xs md:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeMarket === 'handmade'
              ? 'gold-grad text-slate-950 shadow-xl scale-[1.01]'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          <i className="fa-solid fa-hands-holding-circle text-amber-400"></i>
          <span>حجره بازار فرش دستباف اعلا (Handmade Market)</span>
        </button>

        <button
          onClick={() => setActiveMarket('machine')}
          className={`py-3 px-4 rounded-xl text-xs md:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeMarket === 'machine'
              ? 'gold-grad text-slate-950 shadow-xl scale-[1.01]'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          <i className="fa-solid fa-industry text-amber-400"></i>
          <span>حجره بازار فرش ماشینی (Machine Rug Market)</span>
        </button>
      </div>

      {/* Freemium & Security Info Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs space-y-2 text-amber-200">
        <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
          <i className="fa-solid fa-scale-balanced"></i>
          <span>ضوابط اقتصادی و سهمیه آگهی‌های کد ملی:</span>
        </div>
        <ul className="grid sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
          <li className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            <span><strong>۳ آگهی رایگان:</strong> برای هر شناسه ملی در ماه</span>
          </li>
          <li className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <i className="fa-solid fa-fingerprint text-amber-400"></i>
            <span><strong>احراز یکتا:</strong> جلوگیری از ثبت آگهی فیک</span>
          </li>
          <li className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800">
            <i className="fa-solid fa-credit-card text-indigo-400"></i>
            <span><strong>درگاه آگهی مازاد:</strong> تعرفه ۱۵۰,۰۰۰ تومان</span>
          </li>
        </ul>
      </div>

      {/* Merchants Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-amber-300 flex items-center justify-between border-b border-slate-800 pb-2">
          <span>حجره‌های فعال بازار ({activeMarket === 'handmade' ? 'دستباف' : 'ماشینی'}):</span>
          <span className="text-xs text-slate-400 font-normal">تعداد غرفه‌ها: {filteredBooths.length}</span>
        </h3>

        {filteredBooths.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/50 rounded-2xl border border-slate-800">
            هنوز حجره‌ای در این بخش ثبت نشده است. با کد ملی و شماره موبایل خود اولین غرفه را ایجاد کنید.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredBooths.map((b) => {
              const quotaUsed = b.adCount;
              const quotaRemaining = Math.max(0, b.adQuotaMax - b.adCount);
              const isQuotaFull = quotaUsed >= b.adQuotaMax;

              return (
                <div
                  key={b.id}
                  className="glass-card p-5 rounded-2xl border border-amber-500/30 space-y-3 bg-slate-900/80 hover:border-amber-500/60 transition shadow-xl"
                >
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                    <div>
                      <div className="font-black text-amber-200 text-sm flex items-center gap-2">
                        <span>{b.boothName}</span>
                        {b.verified && (
                          <i
                            className="fa-solid fa-circle-check text-emerald-400 text-xs"
                            title="احراز هویت شده با کد ملی و شماره موبایل"
                          ></i>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        تاجر: <strong className="text-slate-200 me-2">{b.merchantName}</strong> | شهر: <strong className="text-slate-200">{b.city}</strong>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="text-amber-400 font-bold text-xs flex items-center justify-end gap-1">
                        <i className="fa-solid fa-star text-amber-400"></i>
                        <span>{b.reputationStars}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">اعتبار حجره</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">شناسه ملی احراز شده:</span>
                      <strong className="text-amber-300 font-mono">
                        {b.nationalId.slice(0, 3)}***{b.nationalId.slice(-4)}
                      </strong>
                    </div>

                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">وضعیت سهمیه آگهی:</span>
                      <strong className={isQuotaFull ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                        {quotaUsed} از {b.adQuotaMax} استفاده شده
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">📞 {b.phoneNumber}</span>
                    <button
                      onClick={() => handleOpenNewAdModal(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                        isQuotaFull
                          ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
                      }`}
                    >
                      <i className={`fa-solid ${isQuotaFull ? 'fa-credit-card' : 'fa-plus'}`}></i>
                      <span>{isQuotaFull ? 'ثبت آگهی مازاد (با تعرفه)' : 'ثبت آگهی جدید (رایگان)'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Listings in this Market Segment */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-black text-amber-300 flex items-center justify-between">
          <span>آگهی‌های تایید شده در تالار بین‌المللی ({activeMarket === 'handmade' ? 'دستباف اعلا' : 'ماشینی'}):</span>
          <span className="text-xs text-slate-400">تعداد آگهی: {filteredListings.length}</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {filteredListings.map((list) => (
            <div
              key={list.id}
              className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3 bg-slate-950/90 hover:border-amber-500/40 transition"
            >
              <div className="relative h-44 rounded-xl overflow-hidden border border-amber-500/20">
                <img src={list.image} alt={list.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-slate-950/90 border border-amber-500/40 px-2.5 py-1 rounded-full text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                  <span>کد ملی: {list.nationalIdMasked}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-100 text-sm truncate">{list.title}</div>
                <div className="text-slate-400 text-[11px]">{list.description}</div>
              </div>

              <div className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">ارزش عادلانه:</span>
                  <strong className="text-amber-300 font-mono text-sm">{list.priceTomanMillion} میلیون تومان</strong>
                </div>
                <div className="text-end">
                  <span className="text-[10px] text-slate-400 block">قیمت دلاری:</span>
                  <strong className="text-emerald-400 font-mono">${list.priceUSD.toLocaleString()} USD</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                <span>حجره: <strong className="text-amber-200">{list.boothName}</strong></span>
                <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                  شناسنامه تایید شده
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual-Factor Booth Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-lg w-full border-2 border-amber-500 space-y-4 relative bg-[#090d18] text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowRegModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="border-b border-amber-500/30 pb-3">
              <h3 className="font-black text-amber-300 text-sm md:text-base flex items-center gap-2">
                <i className="fa-solid fa-id-card text-amber-400"></i>
                <span>ثبت حجره تجاری و احراز هویت دو عاملی</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تطابق کد ملی معتبر و شماره موبایل فعال | جلوگیری از دلالان ناسالم
              </p>
            </div>

            {authError && (
              <div className="bg-rose-500/15 border border-rose-500/50 p-3 rounded-xl text-rose-300 text-xs font-semibold leading-relaxed">
                {authError}
              </div>
            )}

            <form onSubmit={handleRegisterBooth} className="space-y-3.5 text-xs">
              <div>
                <label className="block mb-1 text-slate-300 font-bold">نام و نام خانوادگی تاجر (منطبق با کارت ملی):</label>
                <input
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="مثلاً: حاج رضا میری"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-bold">نام حجره / غرفه تجاری:</label>
                <input
                  type="text"
                  required
                  value={boothName}
                  onChange={(e) => setBoothName(e.target.value)}
                  placeholder="مثلاً: حجره قالی ابریشم میری"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-bold">کد ملی (شناسه ۱۰ رقمی معتبر):</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="۰۰۱۲۳۴۵۶۷۸"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-300 font-bold">شماره موبایل فعال (۰۹...):</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-bold">دسته‌بندی بازار حجره:</label>
                  <select
                    value={regMarketType}
                    onChange={(e) => setRegMarketType(e.target.value as CarpetCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="handmade">فرش دستباف اعلا</option>
                    <option value="machine">فرش ماشینی (شانه/تراکم)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-300 font-bold">شهر یا بازار فعالیت:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثلاً: تهران (بازار بزرگ)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition mt-2 text-xs"
              >
                استعلام کد ملی + تایید احراز هویت و ایجاد حجره
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Ad Posting Modal */}
      {showNewAdModal && selectedBoothForAd && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-lg w-full border-2 border-amber-500 space-y-4 relative bg-[#090d18] text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowNewAdModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="border-b border-amber-500/30 pb-3">
              <h3 className="font-black text-amber-300 text-sm md:text-base flex items-center gap-2">
                <i className="fa-solid fa-plus-circle text-amber-400"></i>
                <span>ثبت آگهی جدید در حجره «{selectedBoothForAd.boothName}»</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                سهمیه استفاده شده: {selectedBoothForAd.adCount} از {selectedBoothForAd.adQuotaMax} آگهی رایگان
              </p>
            </div>

            <form onSubmit={handlePostAdSubmission} className="space-y-3.5 text-xs">
              <div>
                <label className="block mb-1 text-slate-300 font-bold">عنوان دقیق آگهی فرش:</label>
                <input
                  type="text"
                  required
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="مثلاً: قالیچه ۶ متری چله ابریشم تبریز ۶۰ رج"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-bold">قیمت (میلیون تومان):</label>
                  <input
                    type="number"
                    required
                    value={adPriceToman}
                    onChange={(e) => setAdPriceToman(e.target.value)}
                    placeholder="مثلاً: ۲۴۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-300 font-bold">قیمت دلاری ($ USD):</label>
                  <input
                    type="number"
                    required
                    value={adPriceUSD}
                    onChange={(e) => setAdPriceUSD(e.target.value)}
                    placeholder="مثلاً: ۴۰۰۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-bold">توضیحات و مشخصات کارشناسی:</label>
                <textarea
                  rows={3}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="مشخصات چله، نوع گره، قدمت، رنگرزی..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
                ></textarea>
              </div>

              {selectedBoothForAd.adCount >= selectedBoothForAd.adQuotaMax ? (
                <div className="bg-amber-500/15 border border-amber-500/40 p-3 rounded-xl text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-300">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>تکمیل سهمیه رایگان:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    سهمیه آگهی‌های رایگان کد ملی شما به پایان رسیده است. با تایید این فرم به درگاه پرداخت تعرفه آگهی مازاد (۱۵۰,۰۰۰ تومان) هدایت می‌شوید.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-500/15 border border-emerald-500/40 p-3 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-400 text-base"></i>
                  <span>این آگهی به صورت رایگان از سهمیه کد ملی شما کسر خواهد شد.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition mt-2 text-xs"
              >
                {selectedBoothForAd.adCount >= selectedBoothForAd.adQuotaMax
                  ? 'انتقال به درگاه پرداخت آگهی مازاد'
                  : 'انتشار رایگان آگهی'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Freemium Paywall Payment Gateway Modal */}
      {showPaywallModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border-2 border-amber-500 space-y-4 relative bg-[#090d18] text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="text-center space-y-2 border-b border-amber-500/30 pb-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center mx-auto text-amber-400 text-2xl">
                <i className="fa-solid fa-credit-card"></i>
              </div>
              <h3 className="font-black text-amber-300 text-base">درگاه پرداخت آگهی مازاد شتاب</h3>
              <p className="text-xs text-slate-400">سهمیه رایگان کد ملی به اتمام رسیده است</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>تعرفه آگهی مازاد:</span>
                <strong className="text-amber-300 font-mono text-sm">۱۵۰,۰۰۰ تومان</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>شناسه آگهی:</span>
                <span className="font-mono text-slate-200">RUG-AUTH-2026</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>کد ملی تاجر:</span>
                <span className="font-mono text-amber-300">
                  {selectedBoothForAd?.nationalId ? `${selectedBoothForAd.nationalId.slice(0, 3)}***${selectedBoothForAd.nationalId.slice(-4)}` : '---'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <button
                onClick={handlePaywallPayment}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-lock text-sm"></i>
                <span>پرداخت اینترنتی و انتشار فوری آگهی</span>
              </button>

              <button
                onClick={() => setShowPaywallModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-400 py-2.5 rounded-xl text-xs transition"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
