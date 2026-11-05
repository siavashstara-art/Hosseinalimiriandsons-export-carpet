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
    boothName: 'حجره مرکزی و ویترین فرش میری',
    nationalId: '0012345678',
    phoneNumber: '09121234567',
    marketType: 'handmade',
    verified: true,
    reputationStars: 5.0,
    adCount: 2,
    adQuotaMax: 3,
    city: 'تهران (بازار بزرگ)',
    phone: '۰۲۱-۵۵۶۲۱۲۳۴',
    joinDate: '۱۳۵۰ (قدمت ۵۰ ساله)',
    bio: 'خاندان اصیل تجارت فرش دستباف، صادرکننده قالی‌های ابریشم قم و تبریز با مهر اصالت حاج حسینعلی میری.',
    followersCount: 3840
  },
  {
    id: 'booth-2',
    merchantName: 'استاد علیرضا تبریزی',
    boothName: 'نگارخانه قالی شاهکار تبریز',
    nationalId: '1378901234',
    phoneNumber: '09141112233',
    marketType: 'handmade',
    verified: true,
    reputationStars: 4.9,
    adCount: 3,
    adQuotaMax: 3,
    city: 'تبریز (تیمچه مظفریه)',
    phone: '۰۴۱-۳۵۲۳۹۸۷۶',
    joinDate: '۱۳۷۸',
    bio: 'ویترین اختصاصی قالی‌های ریزبافت ۶۰ و ۷۰ رج چله ابریشم نقشه سالاری و نامی با نظارت مستقیم استاد تبریزی.',
    followersCount: 2490
  },
  {
    id: 'booth-3',
    merchantName: 'مهندس کاظمی',
    boothName: 'ویترین فرش ماشینی کاشان نوین',
    nationalId: '1289012345',
    phoneNumber: '09139876543',
    marketType: 'machine',
    verified: true,
    reputationStars: 4.8,
    adCount: 3,
    adQuotaMax: 3,
    city: 'کاشان',
    phone: '۰۳۱-۵۵۴۴۳۳۲۲',
    joinDate: '۱۳۹۸',
    bio: 'تولید و عرضه فرش‌های ماشینی صادراتی ۱۲۰۰ و ۱۵۰۰ شانه با الیاف آکریلیک بایر آلمان و گارانتی ۵ ساله.',
    followersCount: 1620
  }
];

export const INITIAL_LISTINGS: CarpetListing[] = [
  {
    id: 'list-1',
    title: 'شاهکار ۶ متری تبریز ۶۰ رج چله ابریشم (طرح سالاری)',
    category: 'handmade',
    priceTomanMillion: 240,
    priceUSD: 4000,
    boothName: 'حجره مرکزی و ویترین فرش میری',
    nationalIdMasked: '۰۰۱***۵۶۷۸',
    isVerifiedMerchant: true,
    city: 'تهران',
    image: heroRugImg,
    description: 'اثری بی‌نظیر و موزه‌ای با رنگرزی کاملاً گیاهی سنتی، گل‌ابریشم برجسته، بدون هیچ‌گونه عیب یا کجی در پود.',
    raj: 60,
    warpMaterial: 'چله ابریشم اصل',
    likesCount: 384,
    viewsCount: 1940,
    isDirectChatAvailable: true
  },
  {
    id: 'list-2',
    title: 'فرش ماشینی ۱۲۰۰ شانه تراکم ۳۶۰۰ آکریلیک هیت‌ست',
    category: 'machine',
    priceTomanMillion: 18.5,
    priceUSD: 310,
    boothName: 'ویترین فرش ماشینی کاشان نوین',
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
    },
    likesCount: 152,
    viewsCount: 820,
    isDirectChatAvailable: true
  }
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'merchant';
  text: string;
  time: string;
}

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
  const [viewMode, setViewMode] = useState<'showrooms' | 'allCarpets'>('showrooms');
  const [selectedBoothProfile, setSelectedBoothProfile] = useState<BoothMerchant | null>(null);

  // Social & Dignity States (Likes, Follows)
  const [likes, setLikes] = useState<Record<string, number>>({
    'list-1': 384,
    'list-2': 152
  });
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [followers, setFollowers] = useState<Record<string, number>>({
    'booth-1': 3840,
    'booth-2': 2490,
    'booth-3': 1620
  });
  const [userFollowed, setUserFollowed] = useState<Record<string, boolean>>({});

  // Direct Chat Modal State (گفتگوی اختصاصی و استعلام قیمت)
  const [chatModalOpen, setChatModalOpen] = useState<boolean>(false);
  const [activeChatListing, setActiveChatListing] = useState<CarpetListing | null>(null);
  const [activeChatMerchant, setActiveChatMerchant] = useState<BoothMerchant | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isMerchantTyping, setIsMerchantTyping] = useState<boolean>(false);

  // Registration & Ad Modals
  const [showRegModal, setShowRegModal] = useState<boolean>(false);
  const [showNewAdModal, setShowNewAdModal] = useState<boolean>(false);
  const [selectedBoothForAd, setSelectedBoothForAd] = useState<BoothMerchant | null>(null);
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [pendingAdData, setPendingAdData] = useState<any>(null);

  // Registration Form State
  const [merchantName, setMerchantName] = useState<string>('');
  const [boothName, setBoothName] = useState<string>('');
  const [boothBio, setBoothBio] = useState<string>('');
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

  // Handle Likes (چشم‌نوازی و لایک اثر)
  const handleToggleLike = (listingId: string) => {
    setUserLiked((prev) => {
      const isCurrentlyLiked = !!prev[listingId];
      const newStatus = !isCurrentlyLiked;
      setLikes((likeMap) => ({
        ...likeMap,
        [listingId]: Math.max(0, (likeMap[listingId] || 0) + (newStatus ? 1 : -1))
      }));
      return { ...prev, [listingId]: newStatus };
    });
  };

  // Handle Follow / Unfollow (دنبال کردن غرفه)
  const handleToggleFollow = (boothId: string) => {
    setUserFollowed((prev) => {
      const isFollowing = !!prev[boothId];
      const newStatus = !isFollowing;
      setFollowers((followerMap) => ({
        ...followerMap,
        [boothId]: Math.max(0, (followerMap[boothId] || 0) + (newStatus ? 1 : -1))
      }));
      return { ...prev, [boothId]: newStatus };
    });
  };

  // Open Direct Chat & Price Inquiry
  const handleOpenDirectChat = (listing: CarpetListing, merchant?: BoothMerchant) => {
    const foundMerchant = merchant || booths.find((b) => b.boothName === listing.boothName) || booths[0];
    setActiveChatListing(listing);
    setActiveChatMerchant(foundMerchant);
    setChatMessages([
      {
        id: 'msg-1',
        sender: 'merchant',
        text: `درود و عرض ادب خدمت شما علاقه‌مند به هنر فاخر قالی ایرانی. من «${foundMerchant.merchantName}» از ${foundMerchant.boothName} هستم. برای استعلام قیمت نهایی، شرایط بازدید حضوری یا مشاهده شناسنامه کامل اثر در خدمت شما هستم.`,
        time: 'لحظاتی پیش'
      }
    ]);
    setChatModalOpen(true);
  };

  // Send Direct Message
  const handleSendChatMessage = (textToSend?: string) => {
    const content = (textToSend || chatInputText).trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: content,
      time: 'الان'
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInputText('');
    setIsMerchantTyping(true);

    setTimeout(() => {
      setIsMerchantTyping(false);
      let replyText = 'سلامت باشید. قیمت ثبت شده با احترام به هنر دستباف، همراه با شناسنامه اصالت و امکان کارشناسی در بازار بزرگ محاسبه شده است. تخفیف جزیی پای معامله برای خریدار واقعی و اصیل لحاظ خواهد شد.';
      if (content.includes('ویدئو') || content.includes('گره')) {
        replyText = 'با کمال میل! ویدئوی باکیفیت از چله، پشت گره‌ها و شیرازه فرش آماده شده و تا دقایقی دیگر از طریق پیام‌رسان برای شماره تماس شما ارسال خواهد شد.';
      } else if (content.includes('قیمت') || content.includes('استعلام')) {
        replyText = `قیمت پیشنهادی روز این اثر ${activeChatListing?.priceTomanMillion || 240} میلیون تومان (${activeChatListing?.priceUSD || 4000} دلار) برآورد شده و تحویل بیمه‌شده در سراسر کشور یا گمرک فرودگاه امام خمینی فراهم است.`;
      }
      const merchantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'merchant',
        text: replyText,
        time: 'الان'
      };
      setChatMessages((prev) => [...prev, merchantMsg]);
    }, 900);
  };

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
      setAuthError(`⚠️ کد ملی (${cleanNatId}) قبلاً در سیستم ثبت شده است. هر شخص با شناسه ملی خود تنها مجاز به ثبت ۱ غرفه است.`);
      return;
    }

    const duplicatePhone = booths.find((b) => b.phoneNumber === cleanPhone);
    if (duplicatePhone) {
      setAuthError(`⚠️ شماره موبایل (${cleanPhone}) قبلاً به غرفه دیگری اختصاص یافته است.`);
      return;
    }

    const newBoothId = `booth-${Date.now()}`;
    const newBooth: BoothMerchant = {
      id: newBoothId,
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
      joinDate: new Date().toLocaleDateString('fa-IR'),
      bio: boothBio || 'ویترین اختصاصی فرش‌های فاخر و اصیل در بستر بزرگ بازار دیجیتال فرش',
      followersCount: 1
    };

    setBooths([newBooth, ...booths]);
    setFollowers((prev) => ({ ...prev, [newBoothId]: 1 }));
    setShowRegModal(false);
    setMerchantName('');
    setBoothName('');
    setBoothBio('');
    setNationalId('');
    setPhoneNumber('');

    alert(`✅ غرفه و ویترین «${boothName}» با موفقیت ثبت شد.\nشانس نمایش فرش‌های شما در تالار بین‌المللی با احراز کد ملی (${cleanNatId}) فعال شد.`);
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

    const newId = `list-${Date.now()}`;
    const adData: CarpetListing = {
      id: newId,
      title: adTitle || 'فرش فاخر بازار',
      category: selectedBoothForAd.marketType,
      priceTomanMillion: parseFloat(adPriceToman) || 100,
      priceUSD: parseFloat(adPriceUSD) || 1500,
      boothName: selectedBoothForAd.boothName,
      nationalIdMasked: `${selectedBoothForAd.nationalId.slice(0, 3)}***${selectedBoothForAd.nationalId.slice(-4)}`,
      isVerifiedMerchant: true,
      city: selectedBoothForAd.city,
      image: heroRugImg,
      description: adDescription || 'توضیحات اثر کارشناسی شده و فاخر.',
      likesCount: 1,
      viewsCount: 10,
      isDirectChatAvailable: true
    };

    // Check Quota
    if (selectedBoothForAd.adCount >= selectedBoothForAd.adQuotaMax) {
      setPendingAdData(adData);
      setShowNewAdModal(false);
      setShowPaywallModal(true);
    } else {
      publishAd(selectedBoothForAd.id, adData, false);
      setShowNewAdModal(false);
      alert('🎉 اثر فاخر شما با موفقیت و به صورت رایگان از سهمیه کد ملی در ویترین غرفه منتشر شد.');
    }
  };

  // Publish Helper Function
  const publishAd = (boothId: string, adData: CarpetListing, isPaid: boolean) => {
    setListings([adData, ...listings]);
    setLikes((prev) => ({ ...prev, [adData.id]: 1 }));
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
    alert('💳 پرداخت تعرفه غرفه مازاد (۱۵۰,۰۰۰ تومان) با موفقیت انجام گردید.\nاثر شما با احترام در ویترین بین‌المللی به نمایش درآمد.');
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
      {/* Top Title & Philosophy Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-amber-500/30 pb-4 gap-3">
        <div>
          <h2 className="text-base md:text-xl font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-store text-amber-400"></i>
            <span>غرفه‌های اختصاصی و ویترین اینستاگرامی فرش (Instagram Showrooms)</span>
          </h2>
          <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
            حفظ شأن و اصالت فرش فاخر ایرانی؛ هر هنرمند و تاجر صاحب یک غرفه اختصاصی با قابلیت گفتگوی زنده، استعلام قیمت، لایک و تحسین اثر
          </p>
        </div>

        <button
          onClick={() => {
            setAuthError(null);
            setShowRegModal(true);
          }}
          className="gold-grad text-slate-950 font-black px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
        >
          <i className="fa-solid fa-plus-circle text-base"></i>
          <span>ساخت غرفه اختصاصی جدید (مانند اینستاگرام)</span>
        </button>
      </div>

      {/* Dignity & Anti-Bulk Selling Charter Note */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/60 border border-amber-500/40 p-4 rounded-2xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
          <i className="fa-solid fa-gem text-amber-400"></i>
          <span>منشور حفظ وقار و شأن فرش دستباف:</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          فرش نفیس، روح و فرهنگ چندصدساله ایران‌زمین است و نباید به شیوه فله‌ای عرضه شود. در این پلتفرم هر غرفه‌دار گالری مستقل خود را دارد؛ خریداران و عاشقان فرش می‌توانند آثار را لایک کنند، چشم‌نوازی آن را تحسین کرده و در فضایی محترمانه از طریق چت مستقیم با استادکار استعلام قیمت بگیرند.
        </p>
      </div>

      {/* Market Segmentation Tabs */}
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
          <span>غرفه‌های فرش دستباف اعلا (شاهکارهای اصیل)</span>
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
          <span>غرفه‌های فرش ماشینی (تولیدکنندگان برند)</span>
        </button>
      </div>

      {/* View Switcher: Showrooms Grid vs All Carpets Gallery */}
      <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-2xl border border-slate-800 text-xs">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode('showrooms');
              setSelectedBoothProfile(null);
            }}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              viewMode === 'showrooms' && !selectedBoothProfile
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-store"></i>
            <span>ویترین غرفه‌داران (پروفایل‌ها)</span>
          </button>

          <button
            onClick={() => {
              setViewMode('allCarpets');
              setSelectedBoothProfile(null);
            }}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 ${
              viewMode === 'allCarpets'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-images"></i>
            <span>گالری شاهکارهای فرش (با لایک و چت)</span>
          </button>
        </div>

        <span className="text-[11px] text-amber-300/80 hidden sm:inline font-mono">
          {filteredBooths.length} غرفه فعال | {filteredListings.length} اثر به نمایش گذاشته شده
        </span>
      </div>

      {/* Selected Booth Profile View (Instagram-style Detailed Showroom) */}
      {selectedBoothProfile ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Back Button */}
          <button
            onClick={() => setSelectedBoothProfile(null)}
            className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-2 font-bold mb-2 cursor-pointer"
          >
            <i className="fa-solid fa-arrow-right"></i>
            <span>بازگشت به تمام غرفه‌ها</span>
          </button>

          {/* Instagram-style Header Card */}
          <div className="glass-card p-6 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 space-y-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar / Crest */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-600 shadow-xl">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400 text-3xl font-black">
                    <i className="fa-solid fa-shop"></i>
                  </div>
                </div>
                {selectedBoothProfile.verified && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center border-2 border-slate-950 shadow" title="تایید اصالت هویت با کد ملی">
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 text-center sm:text-start space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <h3 className="text-lg md:text-xl font-black text-amber-200">{selectedBoothProfile.boothName}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    {selectedBoothProfile.city}
                  </span>
                </div>

                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  {selectedBoothProfile.bio || 'ویترین اختصاصی فرش‌های فاخر با تضمین اصالت و بافت دستباف ایرانی.'}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs pt-1">
                  <div>
                    <strong className="text-amber-400 font-black">{selectedBoothProfile.adCount}</strong>
                    <span className="text-slate-400 mr-1">اثر نمایشی</span>
                  </div>
                  <div>
                    <strong className="text-amber-400 font-black">
                      {(followers[selectedBoothProfile.id] || selectedBoothProfile.followersCount || 100).toLocaleString('fa-IR')}
                    </strong>
                    <span className="text-slate-400 mr-1">دنبال‌کننده</span>
                  </div>
                  <div>
                    <strong className="text-amber-400 font-black">{selectedBoothProfile.reputationStars} ★</strong>
                    <span className="text-slate-400 mr-1">امتیاز اعتبار</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Follow, Chat, Add Listing */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleToggleFollow(selectedBoothProfile.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow ${
                    userFollowed[selectedBoothProfile.id]
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : 'gold-grad text-slate-950'
                  }`}
                >
                  <i className={`fa-solid ${userFollowed[selectedBoothProfile.id] ? 'fa-check' : 'fa-user-plus'}`}></i>
                  <span>{userFollowed[selectedBoothProfile.id] ? 'دنبال شده' : 'دنبال کردن غرفه'}</span>
                </button>

                <button
                  onClick={() => handleOpenNewAdModal(selectedBoothProfile)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5 transition"
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>افزودن فرش به غرفه</span>
                </button>
              </div>
            </div>
          </div>

          {/* Carpets in this Booth */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-cubes-stacked text-amber-400"></i>
              <span>ویترین آثار این غرفه:</span>
            </h4>

            {filteredListings.filter((l) => l.boothName === selectedBoothProfile.boothName).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-950/60 rounded-2xl border border-slate-800">
                هنوز اثری در این غرفه ثبت نشده است. با دکمه «افزودن فرش به غرفه» اولین شاهکار را نمایش دهید.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredListings
                  .filter((l) => l.boothName === selectedBoothProfile.boothName)
                  .map((list) => {
                    const isLiked = !!userLiked[list.id];
                    const likeCount = likes[list.id] || list.likesCount || 0;

                    return (
                      <div
                        key={list.id}
                        className="glass-card p-4 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 space-y-3 bg-slate-950/90 transition shadow-xl"
                      >
                        <div className="relative h-48 rounded-xl overflow-hidden border border-amber-500/30">
                          <img src={list.image} alt={list.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleToggleLike(list.id)}
                            className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition hover:scale-105 active:scale-95"
                          >
                            <i className={`fa-solid fa-heart ${isLiked ? 'text-rose-500' : 'text-slate-400'}`}></i>
                            <span className="text-slate-200">{likeCount}</span>
                          </button>
                        </div>

                        <div className="space-y-1 text-xs">
                          <h5 className="font-bold text-amber-200 text-sm truncate">{list.title}</h5>
                          <p className="text-slate-400 text-[11px] line-clamp-2">{list.description}</p>
                        </div>

                        <div className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">ارزش عادلانه:</span>
                            <strong className="text-amber-300 font-mono text-sm">{list.priceTomanMillion} م تومان</strong>
                          </div>
                          <div className="text-end">
                            <span className="text-[10px] text-slate-400 block">قیمت دلاری:</span>
                            <strong className="text-emerald-400 font-mono">${list.priceUSD.toLocaleString()} USD</strong>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenDirectChat(list, selectedBoothProfile)}
                          className="w-full gold-grad text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow active:scale-95 transition"
                        >
                          <i className="fa-solid fa-comments"></i>
                          <span>گفتگوی اختصاصی و استعلام قیمت</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      ) : viewMode === 'showrooms' ? (
        /* Showrooms Directory (Instagram-style Profiles List) */
        <div className="space-y-4">
          <h3 className="text-sm font-black text-amber-300 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>ویترین غرفه‌داران و اصناف معتبر فرش ({activeMarket === 'handmade' ? 'دستباف' : 'ماشینی'}):</span>
            <span className="text-xs text-slate-400">تعداد: {filteredBooths.length}</span>
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {filteredBooths.map((b) => {
              const quotaUsed = b.adCount;
              const isFollowing = !!userFollowed[b.id];
              const followerCount = followers[b.id] || b.followersCount || 100;

              return (
                <div
                  key={b.id}
                  className="glass-card p-5 rounded-2xl border border-amber-500/30 space-y-4 bg-slate-900/80 hover:border-amber-500/60 transition shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shrink-0 shadow">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400 text-lg font-black">
                          <i className="fa-solid fa-shop"></i>
                        </div>
                      </div>
                      <div>
                        <div className="font-black text-amber-200 text-sm flex items-center gap-1.5">
                          <span>{b.boothName}</span>
                          {b.verified && (
                            <i className="fa-solid fa-circle-check text-emerald-400 text-xs" title="احراز کد ملی و شماره موبایل"></i>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          مدیر غرفه: <strong className="text-slate-200 me-2">{b.merchantName}</strong> | شهر: <strong className="text-slate-200">{b.city}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleFollow(b.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow ${
                        isFollowing
                          ? 'bg-slate-800 text-slate-300 border border-slate-700'
                          : 'gold-grad text-slate-950 font-black'
                      }`}
                    >
                      <i className={`fa-solid ${isFollowing ? 'fa-check' : 'fa-user-plus'}`}></i>
                      <span>{isFollowing ? 'دنبال شده' : 'دنبال کردن'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    {b.bio || 'عرضه مستقیم فرش‌های فاخر از کارگاه و حجره سنتی با تضمین کیفیت و ارسال امن.'}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-center">
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">دنبال‌کننده:</span>
                      <strong className="text-amber-300 font-mono">{followerCount.toLocaleString('fa-IR')}</strong>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">آثار در ویترین:</span>
                      <strong className="text-emerald-400 font-mono">{quotaUsed} اثر</strong>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">امتیاز اعتبار:</span>
                      <strong className="text-amber-400 font-mono">{b.reputationStars} ★</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <button
                      onClick={() => setSelectedBoothProfile(b)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-amber-500/30"
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span>مشاهده ویترین کامل غرفه</span>
                    </button>

                    <button
                      onClick={() => handleOpenNewAdModal(b)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 flex items-center gap-1 transition"
                      title="ثبت اثر جدید"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>افزودن فرش</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* All Carpets Gallery Mode with Likes and Chat */
        <div className="space-y-4">
          <h3 className="text-sm font-black text-amber-300 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>شاهکارهای ثبت شده در ویترین‌های تایید شده ({activeMarket === 'handmade' ? 'دستباف اعلا' : 'ماشینی'}):</span>
            <span className="text-xs text-slate-400">تعداد آثار: {filteredListings.length}</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredListings.map((list) => {
              const isLiked = !!userLiked[list.id];
              const likeCount = likes[list.id] || list.likesCount || 0;

              return (
                <div
                  key={list.id}
                  className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-3 bg-slate-950/90 transition shadow-xl"
                >
                  <div className="relative h-48 rounded-xl overflow-hidden border border-amber-500/20">
                    <img src={list.image} alt={list.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleToggleLike(list.id)}
                      className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition hover:scale-105 active:scale-95"
                    >
                      <i className={`fa-solid fa-heart ${isLiked ? 'text-rose-500 scale-110' : 'text-slate-400'} transition-transform`}></i>
                      <span className="text-slate-200">{likeCount}</span>
                    </button>
                    <div className="absolute bottom-2 right-2 bg-slate-950/90 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] text-amber-300 font-bold">
                      حجره: {list.boothName}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-slate-100 text-sm truncate">{list.title}</div>
                    <div className="text-slate-400 text-[11px] line-clamp-2">{list.description}</div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">ارزش عادلانه:</span>
                      <strong className="text-amber-300 font-mono text-sm">{list.priceTomanMillion} م تومان</strong>
                    </div>
                    <div className="text-end">
                      <span className="text-[10px] text-slate-400 block">قیمت دلاری:</span>
                      <strong className="text-emerald-400 font-mono">${list.priceUSD.toLocaleString()} USD</strong>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenDirectChat(list)}
                      className="flex-1 gold-grad text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow active:scale-95 transition"
                    >
                      <i className="fa-solid fa-comments text-sm"></i>
                      <span>گفتگوی اختصاصی و استعلام قیمت</span>
                    </button>

                    <button
                      onClick={() => {
                        const targetBooth = booths.find((b) => b.boothName === list.boothName);
                        if (targetBooth) setSelectedBoothProfile(targetBooth);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs transition"
                      title="مشاهده غرفه این اثر"
                    >
                      <i className="fa-solid fa-shop"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Direct Chat & Price Negotiation Modal (صفحه گفتگوی اختصاصی و استعلام قیمت) */}
      {chatModalOpen && activeChatListing && activeChatMerchant && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4">
          <div className="glass-card rounded-3xl max-w-lg w-full border-2 border-amber-500 bg-[#090d18] text-slate-100 shadow-2xl overflow-hidden flex flex-col h-[560px]">
            {/* Chat Header */}
            <div className="p-4 bg-slate-950 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-amber-400 font-bold">
                    <i className="fa-solid fa-user-tie"></i>
                  </div>
                </div>
                <div>
                  <div className="font-black text-amber-200 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{activeChatMerchant.merchantName}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="پاسخگوی برخط"></span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {activeChatMerchant.boothName} | {activeChatMerchant.city}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setChatModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg p-2"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Rug Mini Showcase in Chat Header */}
            <div className="bg-amber-500/10 p-2.5 px-4 border-b border-amber-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <img src={activeChatListing.image} alt={activeChatListing.title} className="w-9 h-9 rounded object-cover border border-amber-500/40 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-slate-200 block truncate text-[11px]">{activeChatListing.title}</span>
                  <span className="text-[10px] text-amber-300 font-mono">قیمت پایه: {activeChatListing.priceTomanMillion} م تومان</span>
                </div>
              </div>

              <span className="text-[10px] bg-slate-900 px-2 py-1 rounded text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                گفتگوی امن و بدون واسطه
              </span>
            </div>

            {/* Quick Inquiry Chips */}
            <div className="p-2 bg-slate-900/60 border-b border-slate-800 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => handleSendChatMessage('سلام و درود، آیا برای این اثر تخفیف پای معامله در نظر می‌گیرید؟')}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 whitespace-nowrap"
              >
                استعلام تخفیف پای معامله
              </button>
              <button
                onClick={() => handleSendChatMessage('امکان ارسال ویدئوی واضح از چله و پشت گره‌ها هست؟')}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 whitespace-nowrap"
              >
                درخواست ویدئو از گره‌ها
              </button>
              <button
                onClick={() => handleSendChatMessage('شرایط ارسال بیمه‌شده و هماهنگی رؤیت حضوری چطور است؟')}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700 whitespace-nowrap"
              >
                رؤیت حضوری و ارسال
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/70 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed text-[11px] ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-br-none'
                        : 'bg-slate-900 text-slate-100 border border-amber-500/30 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-75 block text-end mt-1 font-mono">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isMerchantTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-800 text-[10px] text-amber-300 flex items-center gap-1.5 animate-pulse">
                    <i className="fa-solid fa-pen"></i>
                    <span>غرفه‌دار در حال نوشتن پاسخ است...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="پیام یا استعلام قیمت خود را تایپ کنید..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="gold-grad text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <i className="fa-solid fa-paper-plane"></i>
                <span className="hidden sm:inline">ارسال</span>
              </button>
            </form>
          </div>
        </div>
      )}

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
                <span>ثبت غرفه و ویترین اختصاصی (احراز هویت دو عاملی)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تطابق کد ملی معتبر و شماره موبایل فعال | ساخت ویترین اینستاگرامی با شأن بالا
              </p>
            </div>

            {authError && (
              <div className="bg-rose-500/15 border border-rose-500/50 p-3 rounded-xl text-rose-300 text-xs font-semibold leading-relaxed">
                {authError}
              </div>
            )}

            <form onSubmit={handleRegisterBooth} className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-slate-300 font-bold">نام و نام خانوادگی صاحب غرفه / استادکار:</label>
                <input
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="مثلاً: استاد محمد سالاری"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-bold">نام غرفه یا نگارخانه فرش:</label>
                <input
                  type="text"
                  required
                  value={boothName}
                  onChange={(e) => setBoothName(e.target.value)}
                  placeholder="مثلاً: نگارخانه فرش ابریشم سالاری"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-300 font-bold">بیوگرافی و معرفی کارگاه (نمایش در هدر اینستاگرام):</label>
                <textarea
                  rows={2}
                  value={boothBio}
                  onChange={(e) => setBoothBio(e.target.value)}
                  placeholder="مثلاً: بافنده و صادرکننده قالی‌های تمام ابریشم با ۳۰ سال سابقه در بازار مظفریه تبریز..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-bold">کد ملی (۱۰ رقم معتبر):</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="۰۰۱۲۳۴۵۶۷۹"
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
                  <label className="block mb-1 text-slate-300 font-bold">نوع بازار:</label>
                  <select
                    value={regMarketType}
                    onChange={(e) => setRegMarketType(e.target.value as CarpetCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="handmade">فرش دستباف اعلا</option>
                    <option value="machine">فرش ماشینی درجه یک</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-300 font-bold">شهر فعالیت:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثلاً: تبریز / تهران"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition mt-3 text-xs"
              >
                تایید هویت و ایجاد ویترین اختصاصی
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Carpet Modal */}
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
                <i className="fa-solid fa-cloud-arrow-up text-amber-400"></i>
                <span>ثبت اثر در ویترین «{selectedBoothForAd.boothName}»</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تطابق با استانداردهای وقار فرش؛ نمایش با نشان اصالت و امکان چت مستقیم
              </p>
            </div>

            <form onSubmit={handlePostAdSubmission} className="space-y-3.5 text-xs">
              <div>
                <label className="block mb-1 text-slate-300 font-bold">عنوان کامل اثر:</label>
                <input
                  type="text"
                  required
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  placeholder="مثلاً: قالیچه ۶ متری تبریز طرح نامی چله ابریشم"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-300 font-bold">ارزش (میلیون تومان):</label>
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
                  <label className="block mb-1 text-slate-300 font-bold">ارزش دلاری ($ USD):</label>
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
                <label className="block mb-1 text-slate-300 font-bold">توضیحات و مشخصات کارشناسی اثر:</label>
                <textarea
                  rows={3}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  placeholder="مشخصات چله، نوع گره، قدمت، رنگرزی، استاد بافنده..."
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
                    سهمیه آگهی‌های رایگان کد ملی شما به پایان رسیده است. با تایید این فرم به درگاه پرداخت تعرفه غرفه مازاد (۱۵۰,۰۰۰ تومان) هدایت می‌شوید.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-500/15 border border-emerald-500/40 p-3 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-emerald-400 text-base"></i>
                  <span>این اثر به صورت رایگان از سهمیه کد ملی غرفه شما منتشر خواهد شد.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition mt-2 text-xs"
              >
                {selectedBoothForAd.adCount >= selectedBoothForAd.adQuotaMax
                  ? 'انتقال به درگاه پرداخت غرفه مازاد'
                  : 'انتشار در ویترین اختصاصی'}
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
              <h3 className="font-black text-amber-300 text-base">درگاه پرداخت سهمیه مازاد غرفه</h3>
              <p className="text-xs text-slate-400">سهمیه رایگان کد ملی به اتمام رسیده است</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>تعرفه انتشار مازاد:</span>
                <strong className="text-amber-300 font-mono text-sm">۱۵۰,۰۰۰ تومان</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>شناسه اثر:</span>
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
                <span>پرداخت اینترنتی و نمایش فوری در ویترین</span>
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
