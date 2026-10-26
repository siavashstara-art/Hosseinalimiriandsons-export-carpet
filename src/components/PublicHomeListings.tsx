import React, { useState, useEffect } from 'react';
import { AppLang, PublicHomeListing } from '../types';

interface PublicHomeListingsProps {
  currentLang: AppLang;
  selectedProvinceName?: string;
  selectedCityName?: string;
}

export const PublicHomeListings: React.FC<PublicHomeListingsProps> = ({
  currentLang,
  selectedProvinceName,
  selectedCityName
}) => {

  const [activeSubTab, setActiveSubTab] = useState<'gallery' | 'wizard'>('wizard');
  const [step, setStep] = useState<number>(1);
  const [listings, setListings] = useState<PublicHomeListing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Paywall Modal State
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [paywallReason, setPaywallReason] = useState<'excess_quota' | 'ladder' | 'pinned'>('excess_quota');
  const [targetListingId, setTargetListingId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'shetab' | 'shaparak' | 'crypto'>('shetab');

  // Filter States for Gallery
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'handmade' | 'machine'>('all');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState<string>('all');

  // Wizard Form Fields
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'
  ]);
  const [aiModerationStatus, setAiModerationStatus] = useState<'idle' | 'checking' | 'passed' | 'failed'>('idle');
  const [aiModerationMessage, setAiModerationMessage] = useState<string>('');

  const [formTitle, setFormTitle] = useState<string>('');
  const [formCategory, setFormCategory] = useState<'handmade' | 'machine'>('handmade');
  const [formCondition, setFormCondition] = useState<'new' | 'like_new' | 'used' | 'needs_repair'>('like_new');
  const [formDimensions, setFormDimensions] = useState<string>('۶ متری (۲ در ۳ متر)');
  const [formMaterial, setFormMaterial] = useState<string>('پشم اعلای صادراتی چله پنبه');
  const [formDescription, setFormDescription] = useState<string>('');
  
  const [formPriceToman, setFormPriceToman] = useState<string>('35');
  const [formPriceUSD, setFormPriceUSD] = useState<string>('580');

  const [formProvince, setFormProvince] = useState<string>('تهران');
  const [formCity, setFormCity] = useState<string>('تهران');
  const [formNeighborhood, setFormNeighborhood] = useState<string>('ستارخان');
  const [formAddress, setFormAddress] = useState<string>('');
  const [formGps, setFormGps] = useState<{ lat: number; lng: number } | null>(null);

  const [formSellerName, setFormSellerName] = useState<string>('');
  const [formSellerPhone, setFormSellerPhone] = useState<string>('');
  const [formNationalId, setFormNationalId] = useState<string>('');

  // Contact info visibility toggle map for gallery
  const [revealedContacts, setRevealedContacts] = useState<Record<string, boolean>>({});

  // Preset sample carpet images for quick wizard testing
  const PRESET_CARPET_PHOTOS = [
    { url: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80', title: 'فرش لچک ترنج سرخ' },
    { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', title: 'فرش افشان آبی' },
    { url: 'https://images.unsplash.com/photo-1545232979-fbf59232075a?auto=format&fit=crop&w=800&q=80', title: 'قالیچه ابریشمی قم' },
    { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', title: 'فرش ماشینی ۱۵۰۰ شانه' }
  ];

  // Fetch Public Listings on Mount
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/public-listings');
      const data = await res.json();
      if (data.success) {
        const mappedListings: PublicHomeListing[] = (data.listings || []).map((l: any) => ({
          id: l.id,
          title: l.title,
          category: l.category,
          condition: l.condition,
          dimensionsCm: l.dimensions_cm,
          material: l.material,
          description: l.description,
          priceTomanMillion: l.price_toman_million,
          priceUSD: l.price_usd,
          province: l.province,
          city: l.city,
          neighborhood: l.neighborhood,
          address: l.address,
          gpsLocation: l.gps_location,
          sellerName: l.seller_name,
          sellerPhone: l.seller_phone,
          nationalIdMasked: l.national_id_masked,
          images: l.images,
          isPromoted: l.is_promoted,
          isPinned: l.is_pinned,
          promotionType: l.promotion_type,
          createdAt: l.created_at
        }));
        setListings(mappedListings);
      }
    } catch (err) {
      console.error('Failed to load public listings', err);
    } finally {
      setLoading(false);
    }
  };



  // AI Quality Moderation check simulation
  const handleAiPhotoModeration = () => {
    setAiModerationStatus('checking');
    setTimeout(() => {
      setAiModerationStatus('passed');
      setAiModerationMessage('✓ تصویر فرش با کیفیت مطلوب تایید شد. هیچ انحراف تصویری یا خطایی یافت نشد.');
    }, 1000);
  };

  // Capture GPS Location
  const handleCaptureGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormGps({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setSuccessMessage('موقعیت جغرافیایی GPS شما با موفقیت ثبت گردید.');
        },
        () => {
          // Fallback to Tehran coordinates if user denies or in sandbox
          setFormGps({ lat: 35.6892, lng: 51.3890 });
          setSuccessMessage('موقعیت تقریبی مرکز شهر بر روی نقشه ثبت شد.');
        }
      );
    } else {
      setFormGps({ lat: 35.6892, lng: 51.3890 });
    }
  };

  // Validate Iranian National ID (10-digit checksum)
  const isValidNationalId = (id: string): boolean => {
    const cleanId = id.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim();
    if (!/^\d{10}$/.test(cleanId)) return false;
    if (/^(\d)\1{9}$/.test(cleanId)) return false;
    const check = parseInt(cleanId[9], 10);
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanId[i], 10) * (10 - i);
    }
    const remainder = sum % 11;
    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
  };

  // Validate Mobile Number
  const isValidMobile = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[\s-]/g, '').trim();
    return /^09\d{9}$/.test(cleanPhone);
  };

  // Step 5 Submit Listing
  const handleSubmitListing = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formTitle.trim()) {
      setErrorMessage('لطفاً عنوان مناسب برای آگهی فرش خانگی خود وارد کنید.');
      return;
    }
    if (!formSellerName.trim()) {
      setErrorMessage('نام و نام خانوادگی فروشنده الزامی است.');
      return;
    }
    if (!isValidMobile(formSellerPhone)) {
      setErrorMessage('شماره موبایل وارد شده نامعتبر است. فرمت صحیح: 09123456789');
      return;
    }
    if (!isValidNationalId(formNationalId)) {
      setErrorMessage('کد ملی ۱۰ رقمی وارد شده نامعتبر است.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/public-listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          category: formCategory,
          condition: formCondition,
          dimensions_cm: formDimensions,
          material: formMaterial,
          description: formDescription,
          price_toman_million: Number(formPriceToman) || 30,
          price_usd: Number(formPriceUSD) || 500,
          province: formProvince,
          city: formCity,
          neighborhood: formNeighborhood,
          address: formAddress,
          gps_location: formGps,
          seller_name: formSellerName,
          seller_phone: formSellerPhone,
          national_id: formNationalId,
          images: formImages
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || 'خطا در ثبت آگهی خانگی');
        return;
      }

      if (data.requiresPayment) {
        // Quota Exceeded -> Open Paywall Modal
        setPaywallReason('excess_quota');
        setShowPaywallModal(true);
        setErrorMessage(data.message);
        return;
      }

      setSuccessMessage('🎉 آگهی فرش خانگی شما با موفقیت و به صورت رایگان منتشر گردید.');
      fetchListings();
      setActiveSubTab('gallery');
      // Reset step
      setStep(1);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  // Paywall Payment Confirmation
  const handleConfirmPaywallPayment = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public-listings/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: targetListingId,
          promotion_type: paywallReason,
          payment_method: selectedPaymentMethod
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`کد پیگیری تراکنش: ${data.transactionRef} - ${data.message}`);
        setShowPaywallModal(false);
        fetchListings();
        setActiveSubTab('gallery');
      } else {
        setErrorMessage(data.error || 'پرداخت ناموفق بود.');
      }
    } catch (err: any) {
      setErrorMessage('خطا در فرایند پرداخت شتابی.');
    } finally {
      setLoading(false);
    }
  };

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    const matchesCondition = selectedConditionFilter === 'all' || item.condition === selectedConditionFilter;

    const matchesProvince = !selectedProvinceName || selectedProvinceName === 'سراسر کشور (ایران)' || (item.province && (item.province.includes(selectedProvinceName) || selectedProvinceName.includes(item.province))) || item.city.includes(selectedProvinceName);
    const matchesCity = !selectedCityName || selectedCityName === 'all' || item.city.includes(selectedCityName);

    return matchesSearch && matchesCategory && matchesCondition && matchesProvince && matchesCity;
  });


  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'new': return '✨ نو (کاملاً آکبند)';
      case 'like_new': return '🌟 در حد نو (بسیار تمیز)';
      case 'used': return '🌿 پاخورده (استفاده شده سالم)';
      case 'needs_repair': return '🛠️ نیازمند مرمت / روفو';
      default: return cond;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="glass-card rounded-3xl p-6 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <i className="fa-solid fa-house-chimney text-amber-400"></i>
              <span>ماژول تخصصی آگهی‌های مردمی و خانگی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black gold-text">
              ثبت و فروش مستقیم فرش منزل (عموم مردم)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              درگاهی ویژه برای افرادی که قصد فروش فرش‌های موجود در منزل خود را به صورت مستقیم و بدون واسطه دارند.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl text-center space-y-1 shrink-0 shadow-lg">
            <div className="text-xs text-amber-300 font-bold">سهمیه رایگان هر کد ملی:</div>
            <div className="text-2xl font-black text-amber-400">۳ آگهی فعال</div>
            <div className="text-[10px] text-slate-400">احراز هویت با کد ملی + موبایل</div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 pt-5 border-t border-slate-800 mt-4">
          <button
            onClick={() => setActiveSubTab('wizard')}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeSubTab === 'wizard'
                ? 'gold-grad text-slate-950 shadow-lg font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
            <span>افزودن آگهی جدید (فرم گام‌به‌گام ۵ مرحله‌ای)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gallery')}
            className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
              activeSubTab === 'gallery'
                ? 'gold-grad text-slate-950 shadow-lg font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <i className="fa-solid fa-grip text-sm"></i>
            <span>بازارچه فرش‌های خانگی ({listings.length} آگهی)</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-xl animate-fade-in">
          <i className="fa-solid fa-circle-exclamation text-rose-400 text-lg shrink-0"></i>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 shadow-xl animate-fade-in">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg shrink-0"></i>
          <span>{successMessage}</span>
        </div>
      )}

      {/* SUB-TAB 1: 5-STEP WIZARD FORM */}
      {activeSubTab === 'wizard' && (
        <div className="glass-card rounded-3xl p-6 space-y-6 border border-amber-500/30 shadow-2xl">
          {/* Step Progress Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300">
              <span>مرحله {step} از ۵</span>
              <span>
                {step === 1 && 'گام اول: آپلود و سنجش کیفیت تصویر فرش'}
                {step === 2 && 'گام دوم: عنوان و دسته‌بندی فرش'}
                {step === 3 && 'گام سوم: مشخصات، ابعاد و وضعیت سلامتی'}
                {step === 4 && 'گام چهارم: قیمت‌گذاری (تومان و دلار)'}
                {step === 5 && 'گام پنجم: موقعیت مکانی، GPS و مشخصات مالکیتی'}
              </span>
            </div>

            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="gold-grad h-full transition-all duration-500"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-5 gap-1 pt-1 text-[11px] text-center font-bold text-slate-400">
              <button onClick={() => setStep(1)} className={`p-1.5 rounded-xl border ${step === 1 ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-800'}`}>
                ۱. تصویر
              </button>
              <button onClick={() => setStep(2)} className={`p-1.5 rounded-xl border ${step === 2 ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-800'}`}>
                ۲. دسته‌بندی
              </button>
              <button onClick={() => setStep(3)} className={`p-1.5 rounded-xl border ${step === 3 ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-800'}`}>
                ۳. مشخصات
              </button>
              <button onClick={() => setStep(4)} className={`p-1.5 rounded-xl border ${step === 4 ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-800'}`}>
                ۴. قیمت
              </button>
              <button onClick={() => setStep(5)} className={`p-1.5 rounded-xl border ${step === 5 ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-slate-800'}`}>
                ۵. آدرس و GPS
              </button>
            </div>
          </div>

          {/* STEP 1: PHOTO UPLOAD & AI QUALITY MODERATION */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <i className="fa-solid fa-camera text-amber-400"></i>
                  <span>بارگذاری تصویر فرش خانگی (با پایش هوش مصنوعی)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  لطفاً تصویری واضح از فرش خانگی خود انتخاب فرمایید. هوش مصنوعی کیفیت نور، شفافیت و مناسب بودن عکس را بررسی می‌کند.
                </p>
              </div>

              {/* Current Selected Image Preview */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-amber-500/40 rounded-3xl p-6 bg-slate-950/60 relative group">
                <img
                  src={formImages[0]}
                  alt="Carpet Preview"
                  className="w-full max-h-72 object-cover rounded-2xl shadow-xl border border-amber-500/30"
                />

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleAiPhotoModeration}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40 text-xs transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-robot text-amber-400"></i>
                    <span>تست سنجش هوشمند کیفیت عکس</span>
                  </button>
                </div>
              </div>

              {/* AI Moderation Status Box */}
              {aiModerationStatus === 'checking' && (
                <div className="bg-slate-900 p-3 rounded-2xl text-xs text-amber-300 flex items-center gap-2 border border-amber-500/30">
                  <i className="fa-solid fa-circle-notch fa-spin text-amber-400"></i>
                  <span>در حال بررسی شفافیت تصویر و عدم وجود موارد نامناسب...</span>
                </div>
              )}

              {aiModerationStatus === 'passed' && (
                <div className="bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
                  <span>{aiModerationMessage}</span>
                </div>
              )}

              {/* Quick Select Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">انتخاب سریع از نمونه عکس‌های فرش:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_CARPET_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFormImages([preset.url])}
                      className={`p-2 rounded-2xl border text-right space-y-1 transition ${
                        formImages[0] === preset.url
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <img src={preset.url} alt={preset.title} className="w-full h-16 object-cover rounded-xl" />
                      <div className="text-[10px] font-bold truncate">{preset.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-2xl gold-grad text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition"
                >
                  <span>ادامه به مرحله بعد (عنوان و دسته‌بندی)</span>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TITLE & CATEGORY */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <i className="fa-solid fa-heading text-amber-400"></i>
                  <span>عنوان آگهی و دسته‌بندی ساختاری</span>
                </h3>
                <p className="text-xs text-slate-300">
                  نوع ساختار فرش خانگی را مشخص فرمایید (دستباف خانگی یا ماشینی خانگی).
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">عنوان آگهی (مثال: فرش ۶ متری دستباف تبریز طرح ماهی):</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="عنوان دقیق و جذاب برای خریداران"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-300">دسته‌بندی اصلی فرش:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormCategory('handmade')}
                      className={`p-4 rounded-2xl border text-center space-y-1.5 transition ${
                        formCategory === 'handmade'
                          ? 'gold-grad text-slate-950 font-black border-amber-400 shadow-xl'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <i className="fa-solid fa-gem text-lg block"></i>
                      <div className="text-xs font-bold">فرش دستباف خانگی</div>
                      <div className="text-[10px] opacity-80">اصیل، بافت دست و با ارزش هنری</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormCategory('machine')}
                      className={`p-4 rounded-2xl border text-center space-y-1.5 transition ${
                        formCategory === 'machine'
                          ? 'gold-grad text-slate-950 font-black border-amber-400 shadow-xl'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <i className="fa-solid fa-industry text-lg block"></i>
                      <div className="text-xs font-bold">فرش ماشینی خانگی</div>
                      <div className="text-[10px] opacity-80">دارای شانه و تراکم مشخص صنعتی</div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 font-bold text-xs border border-slate-800 hover:bg-slate-800"
                >
                  <i className="fa-solid fa-arrow-right ml-1.5"></i>
                  <span>مرحله قبل</span>
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-2xl gold-grad text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2"
                >
                  <span>ادامه به مرحله بعد (مشخصات و ابعاد)</span>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONDITION, SPECS & DIMENSIONS */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-amber-400"></i>
                  <span>وضعیت سلامتی، ابعاد و جنس فرش</span>
                </h3>
                <p className="text-xs text-slate-300">
                  توضیحات دقیق به خریداران کمک می‌کند تا با اطمینان خاطر انتخاب کنند.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">وضعیت ظاهری و سلامت فرش:</label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="new">✨ نو (کاملاً آکبند / داخل کاور)</option>
                    <option value="like_new">🌟 در حد نو (کم‌کارکرد و بسیار تمیز)</option>
                    <option value="used">🌿 پاخورده (استفاده شده در خانه سالم)</option>
                    <option value="needs_repair">🛠️ نیازمند مرمت / روفوگری</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">ابعاد و متراژ (به متر یا شش/دوازده متری):</label>
                  <input
                    type="text"
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="مثال: ۶ متری (۲ در ۳) یا ۱۲ متری"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-amber-300">جنس متریال (چله، پرز و تار و پود):</label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    placeholder="مثال: چله ابریشم، پرز پشم مرینوس، ۱۰۰٪ اکریلیک"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-amber-300">توضیحات تکمیلی و تاریخچه فرش در خانه:</label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="توضیح دهید فرش چند سال در خانه بوده، نحوه شستشو، و علت فروش چیست..."
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 font-bold text-xs border border-slate-800 hover:bg-slate-800"
                >
                  <i className="fa-solid fa-arrow-right ml-1.5"></i>
                  <span>مرحله قبل</span>
                </button>

                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-2xl gold-grad text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2"
                >
                  <span>ادامه به مرحله بعد (قیمت‌گذاری)</span>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PRICING (TOMAN & USD) */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <i className="fa-solid fa-coins text-amber-400"></i>
                  <span>تعیین قیمت پیشنهادی فروش</span>
                </h3>
                <p className="text-xs text-slate-300">
                  قیمت مدنظر خود را به میلیون تومان درج نمایید. معادل دلاری جهت نمایش به مشتریان بین‌المللی محاسبه می‌شود.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30">
                  <label className="text-xs font-bold text-amber-300">قیمت پیشنهادی (میلیون تومان):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formPriceToman}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormPriceToman(val);
                        // Convert to USD estimated
                        if (val) {
                          setFormPriceUSD(Math.round(Number(val) * 16.6).toString());
                        }
                      }}
                      placeholder="مثال: 45"
                      className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-amber-300 text-lg font-black focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xs font-bold text-amber-400 shrink-0">میلیون تومان</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30">
                  <label className="text-xs font-bold text-amber-300">معادل تخمینی دلاری ($ USD):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formPriceUSD}
                      onChange={(e) => setFormPriceUSD(e.target.value)}
                      placeholder="مثال: 750"
                      className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-emerald-300 text-lg font-black focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xs font-bold text-emerald-400 shrink-0">دلار آمریکا</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200 leading-relaxed flex items-center gap-3">
                <i className="fa-solid fa-lightbulb text-amber-400 text-lg shrink-0"></i>
                <span>
                  نکته قیمت‌گذاری: قیمت منصفانه و شفاف باعث جلب اعتماد بیشتر خریداران و فروش سریع‌تر فرش خانگی شما می‌شود.
                </span>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 font-bold text-xs border border-slate-800 hover:bg-slate-800"
                >
                  <i className="fa-solid fa-arrow-right ml-1.5"></i>
                  <span>مرحله قبل</span>
                </button>

                <button
                  onClick={() => setStep(5)}
                  className="px-6 py-3 rounded-2xl gold-grad text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2"
                >
                  <span>ادامه به مرحله نهایی (آدرس و ثبت GPS)</span>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: LOCATION, ADDRESS, GPS & IDENTITY */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-amber-400"></i>
                  <span>آدرس، GPS و مشخصات احراز هویت مالک</span>
                </h3>
                <p className="text-xs text-slate-300">
                  جهت جلوگیری از آگهی‌های فیک، ثبت شماره موبایل و کد ملی ۱۰ رقمی صاحب آگهی الزامی است.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">استان:</label>
                  <input
                    type="text"
                    value={formProvince}
                    onChange={(e) => setFormProvince(e.target.value)}
                    placeholder="استان محل نگهداری فرش"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">شهر:</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="شهر محل سکونت"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">محله / منطقه:</label>
                  <input
                    type="text"
                    value={formNeighborhood}
                    onChange={(e) => setFormNeighborhood(e.target.value)}
                    placeholder="محله (مثال: سعادت‌آباد)"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">ثبت لوکیشن GPS دستگاه:</label>
                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    className="w-full p-3.5 rounded-2xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-crosshairs text-indigo-400 text-sm"></i>
                    <span>
                      {formGps ? `GPS ثبت شد (${formGps.lat.toFixed(2)}, ${formGps.lng.toFixed(2)})` : 'ثبت موقعیت جغرافیایی GPS خودکار'}
                    </span>
                  </button>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-amber-300">آدرس دقیق جهت هماهنگی بازدید خانگی:</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="خیابان، پلاک، واحد..."
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">نام و نام خانوادگی فروشنده:</label>
                  <input
                    type="text"
                    value={formSellerName}
                    onChange={(e) => setFormSellerName(e.target.value)}
                    placeholder="نام مالک"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-300">شماره موبایل فعال (دریافت SMS):</label>
                  <input
                    type="text"
                    value={formSellerPhone}
                    onChange={(e) => setFormSellerPhone(e.target.value)}
                    placeholder="09121234567"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-amber-300">کد ملی ۱۰ رقمی (شناسه هویت معتبر):</label>
                  <input
                    type="text"
                    value={formNationalId}
                    onChange={(e) => setFormNationalId(e.target.value)}
                    placeholder="کد ملی ۱۰ رقمی بدون خط تیره‌"
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[10px] text-slate-400 pt-1">
                    🔒 کد ملی شما به صورت ماسک‌شده (به عنوان مثال ۰۰۱۹***۵۴۳) نمایش داده خواهد شد و محفوظ می‌باشد.
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-300 font-bold text-xs border border-slate-800 hover:bg-slate-800"
                >
                  <i className="fa-solid fa-arrow-right ml-1.5"></i>
                  <span>مرحله قبل</span>
                </button>

                <button
                  disabled={loading}
                  onClick={handleSubmitListing}
                  className="px-8 py-3.5 rounded-2xl gold-grad text-slate-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 hover:scale-105 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>در حال انتشار آگهی...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>انتشار نهایی آگهی فرش خانگی</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: GALLERY VIEW */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="glass-card p-4 rounded-2xl space-y-3 border border-amber-500/20 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute right-3.5 top-3.5 text-slate-500 text-xs"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو در عنوان، شهر، یا محله..."
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value as any)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="all">همه دسته‌ها (دستباف و ماشینی)</option>
                  <option value="handmade">فقط فرش دستباف خانگی</option>
                  <option value="machine">فقط فرش ماشینی خانگی</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedConditionFilter}
                  onChange={(e) => setSelectedConditionFilter(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="new">نو و آکبند</option>
                  <option value="like_new">در حد نو</option>
                  <option value="used">پاخورده</option>
                  <option value="needs_repair">نیازمند مرمت</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredListings.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-3 rounded-3xl border border-amber-500/20">
              <i className="fa-solid fa-house-crack text-4xl text-amber-500/40"></i>
              <div className="text-slate-300 font-bold text-sm">هیچ آگهی فرش خانگی با مشخصات انتخابی یافت نشد.</div>
              <button
                onClick={() => setActiveSubTab('wizard')}
                className="px-4 py-2 rounded-xl gold-grad text-slate-950 font-bold text-xs shadow-lg inline-block mt-2"
              >
                اولین آگهی خانگی خود را ثبت کنید
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className={`glass-card rounded-3xl overflow-hidden border transition duration-300 hover:scale-[1.01] flex flex-col justify-between shadow-xl ${
                    item.isPinned
                      ? 'border-amber-400 bg-amber-500/5 ring-2 ring-amber-400/20'
                      : 'border-amber-500/30'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={item.images[0] || 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-52 object-cover"
                    />

                    {/* Badges Overlay */}
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black shadow-lg ${
                        item.category === 'handmade' ? 'bg-amber-500 text-slate-950' : 'bg-indigo-600 text-white'
                      }`}>
                        {item.category === 'handmade' ? 'دستباف خانگی' : 'ماشینی خانگی'}
                      </span>

                      {item.isPinned && (

                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-500 text-slate-950 shadow-lg flex items-center gap-1">
                          <i className="fa-solid fa-thumbtack text-[9px]"></i>
                          <span>ویژه پین شده</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                        {getConditionLabel(item.condition)}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-black text-amber-200 text-base leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                          <span className="text-slate-400">ابعاد: </span>
                          <span className="font-bold text-amber-300">{item.dimensionsCm}</span>
                        </div>

                        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                          <span className="text-slate-400">متریال: </span>
                          <span className="font-bold text-amber-300 truncate">{item.material}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Owner Location */}
                    <div className="space-y-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">قیمت فروش خانگی:</div>
                          <div className="text-lg font-black text-amber-400">
                            {item.priceTomanMillion} <span className="text-xs font-normal text-amber-300">میلیون تومان</span>
                          </div>
                        </div>

                        <div className="text-left bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                          <div className="text-[10px] text-emerald-400">معادل ارز:</div>
                          <div className="text-sm font-bold text-emerald-300">${item.priceUSD} USD</div>
                        </div>
                      </div>

                      {/* Location Badge */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <i className="fa-solid fa-location-dot text-rose-400"></i>
                          <span className="font-bold text-slate-200">{item.province}، {item.city} ({item.neighborhood})</span>
                        </div>

                        {item.gpsLocation && (
                          <div className="text-indigo-400 font-bold flex items-center gap-1">
                            <i className="fa-solid fa-crosshairs text-[10px]"></i>
                            <span>دارای لوکیشن GPS</span>
                          </div>
                        )}
                      </div>

                      {/* Contact Owner Section */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>مالک: <strong className="text-amber-300">{item.sellerName}</strong></span>
                          <span>کد ملی: <code className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded">{item.nationalIdMasked}</code></span>
                        </div>

                        {revealedContacts[item.id] ? (
                          <div className="bg-amber-500/20 border border-amber-500/50 p-3 rounded-2xl text-center space-y-1 animate-fade-in">
                            <div className="text-[10px] text-amber-300">شماره تماس مستقیم مالک فرش:</div>
                            <div className="text-base font-black text-amber-200 tracking-wider font-mono">
                              {item.sellerPhone}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRevealedContacts(prev => ({ ...prev, [item.id]: true }))}
                            className="w-full py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 transition flex items-center justify-center gap-2"
                          >
                            <i className="fa-solid fa-phone"></i>
                            <span>نمایش شماره تماس فروشنده خانگی</span>
                          </button>
                        )}
                      </div>

                      {/* Promotion Upgrades Button */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => {
                            setTargetListingId(item.id);
                            setPaywallReason('ladder');
                            setShowPaywallModal(true);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-bold transition flex items-center justify-center gap-1"
                        >
                          <i className="fa-solid fa-turn-up text-amber-400 text-[10px]"></i>
                          <span>نردبان آگهی (۱۰۰ هزار تومان)</span>
                        </button>

                        <button
                          onClick={() => {
                            setTargetListingId(item.id);
                            setPaywallReason('pinned');
                            setShowPaywallModal(true);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition flex items-center justify-center gap-1"
                        >
                          <i className="fa-solid fa-thumbtack text-amber-400 text-[10px]"></i>
                          <span>پین ویژه (۳۵۰ هزار تومان)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PAYWALL & MONETIZATION UPGRADE MODAL */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 border border-amber-500/40 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="text-amber-300 font-black text-lg flex items-center gap-2">
                <i className="fa-solid fa-credit-card text-amber-400"></i>
                <span>درگاه پرداخت و شارژ سهمیه آگهی</span>
              </div>

              <button
                onClick={() => setShowPaywallModal(false)}
                className="w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-slate-100 flex items-center justify-center border border-slate-800"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs text-amber-200 leading-relaxed">
                {paywallReason === 'excess_quota' && (
                  <p>
                    سهمیه ۳ آگهی فعال رایگان کد ملی شما تکمیل شده است. برای انتشار آگهی مازاد، تعرفه مصوب <strong>۲۰۰,۰۰۰ تومان</strong> را پرداخت فرمایید.
                  </p>
                )}
                {paywallReason === 'ladder' && (
                  <p>
                    جهت انتقال آگهی خانگی شما به بالاترین سطر تالار (نردبان)، تعرفه <strong>۱۰۰,۰۰۰ تومان</strong> محاسبه گردیده است.
                  </p>
                )}
                {paywallReason === 'pinned' && (
                  <p>
                    جهت سنجاق کردن (Pin) آگهی شما در صدر تمامی آگهی‌ها با نشان کلکسیونی، تعرفه <strong>۳۵۰,۰۰۰ تومان</strong> محاسبه شده است.
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300">روش پرداخت الکترونیکی:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedPaymentMethod('shetab')}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${
                      selectedPaymentMethod === 'shetab'
                        ? 'gold-grad text-slate-950 font-black border-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <i className="fa-solid fa-credit-card text-base block mb-1"></i>
                    <span>کارت شتاب</span>
                  </button>

                  <button
                    onClick={() => setSelectedPaymentMethod('shaparak')}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${
                      selectedPaymentMethod === 'shaparak'
                        ? 'gold-grad text-slate-950 font-black border-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <i className="fa-solid fa-building-columns text-base block mb-1"></i>
                    <span>شاپرک بانک</span>
                  </button>

                  <button
                    onClick={() => setSelectedPaymentMethod('crypto')}
                    className={`p-3 rounded-2xl border text-center text-xs font-bold transition ${
                      selectedPaymentMethod === 'crypto'
                        ? 'gold-grad text-slate-950 font-black border-amber-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <i className="fa-solid fa-coins text-base block mb-1"></i>
                    <span>ارز دیجیتال</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowPaywallModal(false)}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800"
              >
                انصراف
              </button>

              <button
                disabled={loading}
                onClick={handleConfirmPaywallPayment}
                className="px-6 py-2.5 rounded-2xl gold-grad text-slate-950 font-black text-xs shadow-xl flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>در حال اتصال به بانک...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>تایید و پرداخت دیجیتال</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
