import React, { useState } from 'react';
import { AppLang } from '../types';

interface CarpetBlockchainPassportProps {
  currentLang: AppLang;
}

interface CarpetPassport {
  id: string;
  nationalAssetId: string;
  blockHash: string;
  smartContractStandard: string;
  titleFa: string;
  originCityFa: string;
  masterWeaverFa: string;
  patternDesignerFa: string;
  dimensionFa: string;
  rajFa: string;
  knotCountTotal: string;
  dyeTypeFa: string;
  warpAndWeftFa: string;
  creationYearFa: string;
  ownerNameMasked: string;
  boothIssuerFa: string;
  issuingDate: string;
  isVerifiedOnChain: boolean;
  qrPayloadUrl: string;
  image: string;
}

export const CarpetBlockchainPassport: React.FC<CarpetBlockchainPassportProps> = ({ currentLang }) => {
  const initialPassports: CarpetPassport[] = [
    {
      id: 'pass-001',
      nationalAssetId: 'IR-CARPET-2026-TBZ-88941',
      blockHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      smartContractStandard: 'ERC-721 Persian Heritage NFT / ISO-24342',
      titleFa: 'شاهکار لچک‌ترنج ابریشم اعلای تبریز (نقشه شیخ‌صفی)',
      originCityFa: 'تبریز - آذربایجان شرقی',
      masterWeaverFa: 'استاد علی‌اکبر مراغه‌ای و دختران',
      patternDesignerFa: 'طراحی نقشه: استاد میرمصور ارژنگی',
      dimensionFa: '۳ × ۴ متر (۱۲ متری سلطنتی)',
      rajFa: '۶۰ رج اعلا (سایه روشن سه بعدی)',
      knotCountTotal: '۵٬۱۸۴٬۰۰۰ گره ترکی متقارن',
      dyeTypeFa: '۱۰۰٪ گیاهی سنتی (روناس یزد، نیل هند، پوست گردو)',
      warpAndWeftFa: 'چله تمام ابریشم اصل کژین با پشم بهاره',
      creationYearFa: '۱۳۹۸ تا ۱۴۰۲ هجری شمسی (۴ سال بافت مداوم)',
      ownerNameMasked: 'حاج ع*** م*** (ثبت در دفتر اسناد رسمی شماره ۱۲ بازار)',
      boothIssuerFa: 'حجره حاج حسین‌علی میری و پسران (سرای بوعلی)',
      issuingDate: '۱۴۰۳/۰۴/۱۵',
      isVerifiedOnChain: true,
      qrPayloadUrl: 'https://carpet-auth.gov.ir/verify/IR-CARPET-2026-TBZ-88941',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'pass-002',
      nationalAssetId: 'IR-CARPET-2026-ISF-11029',
      blockHash: '0xa4b19283e742c091d3e85fa924185bc104fa283d71e29302ba71829031ef8211',
      smartContractStandard: 'ERC-721 Persian Heritage NFT / ISO-24342',
      titleFa: 'قالیچه شکارگاه افشان اصفهان (مکتب صیرفیان)',
      originCityFa: 'اصفهان - میدان نقش‌جهان',
      masterWeaverFa: 'استادکاران کارگاه مرکزی اصفهان',
      patternDesignerFa: 'استاد محمود فرشچیان (مکتب نگارگری)',
      dimensionFa: '۱.۵ × ۲.۲ متر (ذرع و نیم پرده‌ای)',
      rajFa: '۷۰ رج زرین ابریشم‌بافت',
      knotCountTotal: '۲٬۸۸۰٬۰۰۰ گره دستباف',
      dyeTypeFa: 'رنگرزی گیاهی جوشانده سنتی با ثبات درجه ۵',
      warpAndWeftFa: 'تار و پود ابریشم خالص شیراز',
      creationYearFa: '۱۴۰۰ تا ۱۴۰۳ هجری شمسی',
      ownerNameMasked: 'بازرگانی بین‌المللی فرش پارس',
      boothIssuerFa: 'حجره حاج حسین‌علی میری و پسران',
      issuingDate: '۱۴۰۴/۰۱/۲۰',
      isVerifiedOnChain: true,
      qrPayloadUrl: 'https://carpet-auth.gov.ir/verify/IR-CARPET-2026-ISF-11029',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const [passports, setPassports] = useState<CarpetPassport[]>(initialPassports);
  const [selectedPassportId, setSelectedPassportId] = useState<string>('pass-001');
  const [searchNationalCode, setSearchNationalCode] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<CarpetPassport | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // New Certificate creation form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newOrigin, setNewOrigin] = useState<string>('تبریز');
  const [newRaj, setNewRaj] = useState<string>('۵۰ رج');
  const [newWeaver, setNewWeaver] = useState<string>('');
  const [newDimension, setNewDimension] = useState<string>('۶ متری (۲ × ۳)');

  const activePassport = passports.find((p) => p.id === selectedPassportId) || passports[0];

  const handleVerify = () => {
    if (!searchNationalCode.trim()) return;
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const found = passports.find((p) =>
        p.nationalAssetId.toLowerCase().includes(searchNationalCode.trim().toLowerCase()) ||
        p.blockHash.toLowerCase().includes(searchNationalCode.trim().toLowerCase())
      );
      if (found) {
        setVerificationResult(found);
      } else {
        alert('شناسنامه با این کد ثبت ملی در دفترکل زنجیره بلوکی یافت نشد. لطفاً کد را با دقت بررسی کنید.');
      }
    }, 1200);
  };

  const handleCreatePassport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('لطفاً عنوان قالی را وارد کنید.');
      return;
    }

    const randomAsset = `IR-CARPET-2026-${newOrigin.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const newPass: CarpetPassport = {
      id: `pass-${Date.now()}`,
      nationalAssetId: randomAsset,
      blockHash: randomHash,
      smartContractStandard: 'ERC-721 Persian Heritage NFT / ISO-24342',
      titleFa: newTitle,
      originCityFa: `${newOrigin} - ایران`,
      masterWeaverFa: newWeaver || 'استادکاران نامدار بومی',
      patternDesignerFa: 'طراحی سنتی اسلیمی بازار',
      dimensionFa: newDimension,
      rajFa: newRaj,
      knotCountTotal: '۳٬۲۰۰٬۰۰۰ گره دستباف متقارن',
      dyeTypeFa: '۱۰۰٪ رنگرزی گیاهی سنتی ارگانیک',
      warpAndWeftFa: 'تاروپود پشم بهاره و چله پنبه اعلا',
      creationYearFa: '۱۴۰۴ هجری شمسی',
      ownerNameMasked: 'حجره حاج حسین‌علی میری و پسران',
      boothIssuerFa: 'حجره حاج حسین‌علی میری و پسران',
      issuingDate: new Date().toLocaleDateString('fa-IR'),
      isVerifiedOnChain: true,
      qrPayloadUrl: `https://carpet-auth.gov.ir/verify/${randomAsset}`,
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
    };

    setPassports((prev) => [newPass, ...prev]);
    setSelectedPassportId(newPass.id);
    setIsModalOpen(false);
    setNewTitle('');
    setNewWeaver('');
    alert(`شناسنامه ضدجعل با کد ثبت ملی ${randomAsset} با موفقیت در زنجیره بلوکی ثبت گردید!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Title Card */}
      <div className="glass-card p-6 rounded-3xl border-2 border-amber-400 bg-black space-y-3 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-400/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
              <i className="fa-solid fa-passport text-2xl"></i>
            </span>
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400 px-3 py-0.5 rounded-lg text-xs font-black">
                <i className="fa-solid fa-link text-amber-400"></i>
                <span>پاسپورت ملی دیجیتال و فناوری بلاکچین</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                شناسنامه ضدجعل دیجیتال و توکن اصالت فرش ایران (Digital Passport & NFT)
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black border-2 border-white flex items-center gap-2 shadow-lg active:scale-95 transition"
          >
            <i className="fa-solid fa-plus-circle text-base"></i>
            <span>صدور شناسنامه جدید برای قالی</span>
          </button>
        </div>

        <p className="text-white text-sm sm:text-base font-bold leading-relaxed">
          برای حفظ میراث ملی فرش ایران و جلوگیری از جعل در گمرک‌ها و حراجی‌های بین‌المللی دبی و اروپا، شناسنامه هر قالی با هش رمزنگاری‌شده ضدجعل (SHA-256) و کد QR استعلام ثبت کشوری صادر می‌شود.
        </p>
      </div>

      {/* Verification Query Bar */}
      <div className="glass-card p-4 rounded-2xl border-2 border-amber-400 bg-slate-950 flex flex-col sm:flex-row items-center gap-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-black text-amber-300 shrink-0">
          <i className="fa-solid fa-magnifying-glass text-amber-400"></i>
          <span>استعلام اصالت شناسنامه (کد رهگیری ملی یا هش بلاکچین):</span>
        </div>
        <div className="flex-1 w-full flex gap-2">
          <input
            type="text"
            value={searchNationalCode}
            onChange={(e) => setSearchNationalCode(e.target.value)}
            placeholder="مثال: IR-CARPET-2026-TBZ-88941 یا بخشی از کد هش..."
            className="flex-1 bg-black text-white px-3.5 py-2 rounded-xl border border-amber-400 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-300"
          />
          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs border border-white flex items-center gap-1.5 shrink-0"
          >
            {isVerifying ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
            <span>استعلام آنی</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Passport Viewport & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Passport Catalog List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="glass-card p-4 rounded-2xl border-2 border-amber-400 bg-black space-y-2.5 shadow-xl">
            <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-folder-open text-amber-400"></i>
              <span>فهرست شناسنامه‌های ثبتی حجره:</span>
            </h3>

            <div className="space-y-2">
              {passports.map((pass) => {
                const isSelected = pass.id === selectedPassportId;
                return (
                  <button
                    key={pass.id}
                    onClick={() => {
                      setSelectedPassportId(pass.id);
                      setVerificationResult(null);
                    }}
                    className={`w-full p-3 rounded-xl border-2 text-right transition flex items-center gap-3 ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-white font-black shadow-lg scale-[1.01]'
                        : 'bg-slate-950 text-white border-amber-400/40 hover:border-amber-400'
                    }`}
                  >
                    <img src={pass.image} alt={pass.titleFa} className="w-12 h-12 rounded-lg object-cover border border-amber-400 shrink-0" />
                    <div className="truncate text-xs">
                      <div className="font-black">{pass.titleFa}</div>
                      <div className="text-[10px] font-mono opacity-80 mt-0.5">{pass.nationalAssetId}</div>
                      <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">{pass.originCityFa}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Royal Hologram Passport Certificate */}
        <div className="lg:col-span-8">
          <div className="relative rounded-3xl border-4 border-amber-400 bg-gradient-to-br from-black via-slate-950 to-black p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.5)] overflow-hidden">
            {/* Guilloche / Luxury Security Pattern Background */}
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-amber-400/20 pointer-events-none animate-spin" style={{ animationDuration: '60s' }}></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full border border-amber-400/10 pointer-events-none"></div>

            {/* Certificate Header with Crest */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-amber-400/80 pb-4 text-center sm:text-right">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-lg text-xs font-black">
                  <i className="fa-solid fa-award"></i>
                  <span>جمهوری اسلامی ایران • سازمان مالکیت معنوی و ثبت اسناد</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  شناسنامه رسمی اصالت و هویت فرش دستباف ایران
                </h3>
                <div className="text-amber-300 text-xs font-bold font-mono">
                  NATIONAL HERITAGE DIGITAL PASSPORT & NFT TWIN
                </div>
              </div>

              {/* Gold Hologram Badge */}
              <div className="w-20 h-20 rounded-full border-2 border-amber-300 bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-700 flex flex-col items-center justify-center text-slate-950 shadow-2xl p-1 text-center shrink-0">
                <i className="fa-solid fa-stamp text-xl"></i>
                <span className="text-[9px] font-black tracking-tighter leading-tight mt-0.5">اصالت تایید شد</span>
                <span className="text-[7px] font-mono">GENUINE</span>
              </div>
            </div>

            {/* Top Specs Bar: National ID & Hash */}
            <div className="bg-black/90 p-3.5 rounded-2xl border-2 border-amber-400/60 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-white font-bold">شناسه ثبت ملی اثر:</span>
                <span className="text-amber-400 font-mono font-black text-sm bg-slate-950 px-3 py-1 rounded-lg border border-amber-400">
                  {activePassport.nationalAssetId}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-white font-bold">هش رمزنگاری‌شده بلاکچین (SHA-256):</span>
                <span className="text-emerald-400 font-mono text-[11px] truncate max-w-full sm:max-w-md bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/40">
                  {activePassport.blockHash}
                </span>
              </div>
            </div>

            {/* Certificate Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-bold">
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">نام اثر و نقشه:</span>
                <span className="text-white font-black">{activePassport.titleFa}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">خاستگاه و اقلیم بافت:</span>
                <span className="text-white font-black">{activePassport.originCityFa}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">نام استاد بافنده / کارگاه:</span>
                <span className="text-white font-black">{activePassport.masterWeaverFa}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">طراح نقشه / مکتب هنری:</span>
                <span className="text-white font-black">{activePassport.patternDesignerFa}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">ابعاد و رج‌شمار دقیق:</span>
                <span className="text-white font-black">{activePassport.dimensionFa} • {activePassport.rajFa}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">تعداد کل گره‌های شمرده شده:</span>
                <span className="text-white font-black">{activePassport.knotCountTotal}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">نوع رنگرزی و پایداری:</span>
                <span className="text-white font-black">{activePassport.dyeTypeFa}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                <span className="text-amber-300 text-xs block">جنس چله، تار و پود:</span>
                <span className="text-white font-black">{activePassport.warpAndWeftFa}</span>
              </div>
            </div>

            {/* Footer QR Code & Trust Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-amber-400/60 pt-4 bg-slate-950 p-4 rounded-2xl border border-amber-400/40">
              <div className="space-y-1 text-center sm:text-right">
                <div className="text-xs font-black text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                  <i className="fa-solid fa-building-shield text-amber-400"></i>
                  <span>صادرکننده رسمی شناسنامه:</span>
                </div>
                <div className="text-white font-black text-sm">{activePassport.boothIssuerFa}</div>
                <div className="text-[11px] text-slate-300 font-bold">تاریخ صدور: {activePassport.issuingDate} • معتبر تا ابد</div>
              </div>

              {/* QR Verification Visual */}
              <div className="flex items-center gap-3 bg-black p-2 rounded-xl border border-amber-400">
                <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(activePassport.qrPayloadUrl)}`}
                    alt="Certificate QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[10px] text-white font-bold leading-tight">
                  <div className="text-amber-300 font-black">اسکن با دوربین:</div>
                  <div>استعلام آنلاین گمرک</div>
                  <div>و خریداران خارجی</div>
                </div>
              </div>
            </div>

            {/* Print & Export Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => alert(`شناسنامه ضدجعل قالی با کد ${activePassport.nationalAssetId} در صف چاپ لوکس با سربرگ طلایی قرار گرفت.`)}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-2 border-white flex items-center justify-center gap-2 shadow"
              >
                <i className="fa-solid fa-print"></i>
                <span>چاپ سربرگ و شناسنامه زرکوب</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(activePassport.blockHash);
                  alert('هش رمزنگاری شده بلاکچین در حافظه دستگاه کپی شد!');
                }}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm border border-amber-400 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-copy text-amber-400"></i>
                <span>کپی کد هش بلاکچین</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Passport Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border-4 border-amber-400 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-amber-400 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <i className="fa-solid fa-file-signature text-amber-400"></i>
                <span>صدور شناسنامه جدید ضدجعل برای قالی</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-red-400 text-xl font-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePassport} className="space-y-3 text-xs sm:text-sm font-bold">
              <div>
                <label className="text-amber-300 block mb-1">عنوان قالی / طرح نقشه:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثلاً: قالی ۶ متری لچک‌ترنج ابریشم تبریز"
                  className="w-full bg-slate-950 border border-amber-400 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-amber-300 block mb-1">شهر خاستگاه بافت:</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-400 rounded-xl p-2.5 text-white"
                  >
                    <option value="تبریز">تبریز</option>
                    <option value="اصفهان">اصفهان</option>
                    <option value="قم">قم</option>
                    <option value="کاشان">کاشان</option>
                    <option value="نایین">نایین</option>
                    <option value="شیراز">شیراز</option>
                  </select>
                </div>

                <div>
                  <label className="text-amber-300 block mb-1">رج‌شمار قالی:</label>
                  <input
                    type="text"
                    value={newRaj}
                    onChange={(e) => setNewRaj(e.target.value)}
                    placeholder="مثلاً: ۵۰ رج اعلا"
                    className="w-full bg-slate-950 border border-amber-400 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-amber-300 block mb-1">ابعاد فرش:</label>
                <input
                  type="text"
                  value={newDimension}
                  onChange={(e) => setNewDimension(e.target.value)}
                  placeholder="مثلاً: ۲ × ۳ متر (۶ متری)"
                  className="w-full bg-slate-950 border border-amber-400 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-amber-300 block mb-1">نام بافنده یا کارگاه بافت:</label>
                <input
                  type="text"
                  value={newWeaver}
                  onChange={(e) => setNewWeaver(e.target.value)}
                  placeholder="مثلاً: کارگاه استاد حبیبیان نایین"
                  className="w-full bg-slate-950 border border-amber-400 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black border-2 border-white shadow"
                >
                  ثبت در شبکه بلاکچین و صدور شناسنامه
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-4 rounded-xl bg-slate-900 text-white border border-slate-700"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
