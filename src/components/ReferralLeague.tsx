import React, { useState } from 'react';
import { AppLang, ReferralMember, UserProfile } from '../types';
import { i18n } from '../constants/translations';

interface ReferralLeagueProps {
  currentLang: AppLang;
}

export const INITIAL_TOP_TEN: ReferralMember[] = [
  {
    rank: 1,
    id: 'ref-1',
    name: 'حاج حسینعلی میری و پسران',
    boothName: 'حجره مرکزی بازار بزرگ تهران',
    successfulReferrals: 148,
    xpScore: 2850,
    legendaryStarsReward: 4,
    metaverseLandSqm: 500,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 99.8,
    city: 'تهران'
  },
  {
    rank: 2,
    id: 'ref-2',
    name: 'استاد علیرضا تبریزی',
    boothName: 'سرای مظفریه تبریز',
    successfulReferrals: 92,
    xpScore: 2100,
    legendaryStarsReward: 3,
    metaverseLandSqm: 450,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 98.5,
    city: 'تبریز'
  },
  {
    rank: 3,
    id: 'ref-3',
    name: 'حاج محمد صیرفیان اصفهانی',
    boothName: 'مجموعه قالی استاد صیرفیان',
    successfulReferrals: 76,
    xpScore: 1850,
    legendaryStarsReward: 3,
    metaverseLandSqm: 400,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 97.9,
    city: 'اصفهان'
  },
  {
    rank: 4,
    id: 'ref-4',
    name: 'حاج احمد قمی',
    boothName: 'حجره ابریشم قوم قم',
    successfulReferrals: 62,
    xpScore: 1620,
    legendaryStarsReward: 2,
    metaverseLandSqm: 380,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 96.8,
    city: 'قم'
  },
  {
    rank: 5,
    id: 'ref-5',
    name: 'استاد کرمانی',
    boothName: 'سرای قالی کرمان فاخر',
    successfulReferrals: 54,
    xpScore: 1480,
    legendaryStarsReward: 2,
    metaverseLandSqm: 350,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 95.9,
    city: 'کرمان'
  },
  {
    rank: 6,
    id: 'ref-6',
    name: 'مهندس کاظمی کاشانی',
    boothName: 'غرفه فرش ماشینی کاشان نوین',
    successfulReferrals: 48,
    xpScore: 1350,
    legendaryStarsReward: 1,
    metaverseLandSqm: 330,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 94.7,
    city: 'کاشان'
  },
  {
    rank: 7,
    id: 'ref-7',
    name: 'حاج رضا مشهدی',
    boothName: 'حجره فرش مشهد مقدس',
    successfulReferrals: 41,
    xpScore: 1210,
    legendaryStarsReward: 1,
    metaverseLandSqm: 300,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 93.9,
    city: 'مشهد'
  },
  {
    rank: 8,
    id: 'ref-8',
    name: 'استاد نائینی',
    boothName: 'شاهکار قالی نائین',
    successfulReferrals: 35,
    xpScore: 1100,
    legendaryStarsReward: 1,
    metaverseLandSqm: 280,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 92.5,
    city: 'نائین'
  },
  {
    rank: 9,
    id: 'ref-9',
    name: 'حاج بیجاری گروسی',
    boothName: 'حجره فرش آهنینی بیجار',
    successfulReferrals: 31,
    xpScore: 980,
    legendaryStarsReward: 1,
    metaverseLandSqm: 250,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 91.8,
    city: 'بیجار'
  },
  {
    rank: 10,
    id: 'ref-10',
    name: 'استاد شیرازی قشقایی',
    boothName: 'ایل قشقایی شیراز',
    successfulReferrals: 28,
    xpScore: 890,
    legendaryStarsReward: 1,
    metaverseLandSqm: 220,
    metaverseLicenseStatus: 'official_licensed',
    trustScore: 90.6,
    city: 'شیراز'
  }
];

export const ReferralLeague: React.FC<ReferralLeagueProps> = ({ currentLang }) => {
  const t = i18n[currentLang] || i18n['fa'];

  // User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    userId: 'usr-guest-1',
    name: 'تاجر افتخاری فرش میری',
    phone: '۰۹۱۲۱۲۳۴۵۶۷',
    email: 'merchant@alimiri-carpet.com',
    profileId: 'PROF-ALIMIRI-98124',
    referralCode: 'REF-ALIMIRI-98124',
    xpScore: 450,
    starCount: 2,
    metaverseLandSqm: 300,
    metaverseLicenseStatus: 'official_licensed',
    authProvider: 'mobile_otp'
  });

  // Auth Modals
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMethod, setAuthMethod] = useState<'mobile' | 'google'>('mobile');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [simulatedOtpCode, setSimulatedOtpCode] = useState<string>('');

  // Metaverse Certificate Modal
  const [showMetaverseCertificate, setShowMetaverseCertificate] = useState<boolean>(false);
  const [selectedMemberCertificate, setSelectedMemberCertificate] = useState<ReferralMember | null>(null);

  // Send Mobile SMS OTP Code
  const handleSendMobileOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      alert('لطفاً شماره موبایل معتبر ۱۰ یا ۱۱ رقمی وارد نمایید.');
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtpCode(code);
    setOtpSent(true);
  };

  // Verify Mobile OTP Code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== simulatedOtpCode && otpCode !== '123456') {
      alert('کد تایید پیامک شده اشتباه است. (کد نمونه جهت تست: ' + simulatedOtpCode + ')');
      return;
    }

    const newUser: UserProfile = {
      userId: `usr-${Date.now()}`,
      name: `تاجر فرش (${mobileNumber.slice(-4)})`,
      phone: mobileNumber,
      email: `user_${mobileNumber}@rugmarket.ir`,
      profileId: `PROF-${Math.floor(100000 + Math.random() * 900000)}`,
      referralCode: `REF-${mobileNumber.slice(-4)}-${Math.floor(100 + Math.random() * 900)}`,
      xpScore: 250,
      starCount: 1,
      metaverseLandSqm: 100,
      metaverseLicenseStatus: 'official_licensed',
      authProvider: 'mobile_otp'
    };

    setCurrentUser(newUser);
    setShowAuthModal(false);
    setOtpSent(false);
    setOtpCode('');
    alert('🎉 ورود با موفقیت انجام گردید. پروفایل کاربری و کد معرف اختصاصی شما فعال شد.');
  };

  // Google Auth Simulation
  const handleGoogleLogin = () => {
    const newUser: UserProfile = {
      userId: `usr-g-${Date.now()}`,
      name: 'کاربر تایید شده گوگل (جیمیل)',
      phone: '۰۹۱۲۹۹۹۸۸۷۷',
      email: 'user.google@gmail.com',
      profileId: `PROF-GOOG-${Math.floor(100000 + Math.random() * 900000)}`,
      referralCode: `REF-GOOG-${Math.floor(1000 + Math.random() * 9000)}`,
      xpScore: 300,
      starCount: 2,
      metaverseLandSqm: 200,
      metaverseLicenseStatus: 'official_licensed',
      authProvider: 'google'
    };

    setCurrentUser(newUser);
    setShowAuthModal(false);
    alert('📧 احراز هویت با حساب گوگل (جیمیل) با موفقیت انجام شد.');
  };

  // Copy Referral Link
  const copyReferralLink = () => {
    if (!currentUser) return;
    const link = `https://rugmarket.app/ref/${currentUser.referralCode}`;
    navigator.clipboard.writeText(link);
    alert(`✅ لینک دعوت اختصاصی شما کپی شد:\n${link}\nبا دعوت هر تاجر، ۵۰ XP دریافت کنید.`);
  };

  // View Metaverse Deed
  const openMetaverseDeed = (member: ReferralMember) => {
    setSelectedMemberCertificate(member);
    setShowMetaverseCertificate(true);
  };

  return (
    <section className="glass-card rounded-3xl p-5 md:p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Title & User Profile Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-amber-500/30 pb-4 gap-3">
        <div>
          <h2 className="text-base md:text-xl font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-trophy text-amber-400"></i>
            <span>سیستم XP، لیگ معرفان و جوایز متاورس «شهر توانا»</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            اعطای ستاره‌های اسطوره‌ای و سند رسمی زمین در متاورس شهر توانا برای ۱۰ نفر برتر لیگ
          </p>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 p-2 rounded-2xl shadow">
            <div className="w-10 h-10 rounded-full gold-grad flex items-center justify-center font-black text-slate-950 text-sm">
              {currentUser.name.slice(0, 1)}
            </div>
            <div className="text-xs">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-mono">
                  {currentUser.xpScore} XP
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                کد معرف: <strong className="text-emerald-400">{currentUser.referralCode}</strong>
              </div>
            </div>
            <button
              onClick={copyReferralLink}
              title="کپی لینک دعوت"
              className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 p-2 rounded-xl text-xs transition ms-1"
            >
              <i className="fa-solid fa-copy"></i>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="gold-grad text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
          >
            <i className="fa-solid fa-user-plus text-base"></i>
            <span>ورود / ثبت‌نام (پیامک OTP یا گوگل)</span>
          </button>
        )}
      </div>

      {/* Metaverse Land Rewards Table Overview (جوایز متاورس شهر توانا) */}
      <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="font-black text-amber-300 text-xs sm:text-sm flex items-center gap-2">
            <i className="fa-solid fa-vr-cardboard text-amber-400"></i>
            <span>جدول جوایز ۱۰ نفر برتر در متاورس «شهر توانا» (Tavana Virtual City):</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
            سند رسمی + مجوز فعالیت
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-amber-500/40 text-center">
            <span className="text-amber-400 font-black block">مقام اول 🥇</span>
            <strong className="text-emerald-300 font-mono text-xs">۵۰۰ متر زمین</strong>
            <span className="text-[10px] text-slate-400 block">+۴ ستاره اسطوره‌ای</span>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-300 font-black block">مقام دوم 🥈</span>
            <strong className="text-emerald-300 font-mono text-xs">۴۵۰ متر زمین</strong>
            <span className="text-[10px] text-slate-400 block">+۳ ستاره اسطوره‌ای</span>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-amber-600 font-black block">مقام سوم 🥉</span>
            <strong className="text-emerald-300 font-mono text-xs">۴۰۰ متر زمین</strong>
            <span className="text-[10px] text-slate-400 block">+۳ ستاره اسطوره‌ای</span>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-300 font-black block">مقام ۴ و ۵</span>
            <strong className="text-emerald-300 font-mono text-xs">۳۸۰ و ۳۵۰ متر</strong>
            <span className="text-[10px] text-slate-400 block">+۲ ستاره اسطوره‌ای</span>
          </div>
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-slate-300 font-black block">مقام ۶ تا ۱۰</span>
            <strong className="text-emerald-300 font-mono text-xs">۲۲۰ تا ۳۳۰ متر</strong>
            <span className="text-[10px] text-slate-400 block">+۱ ستاره اسطوره‌ای</span>
          </div>
        </div>
      </div>

      {/* Top 10 Referral Leaderboard */}
      <div className="space-y-3">
        <h3 className="font-bold text-amber-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-ranking-star text-amber-400"></i>
            <span>جدول امتیازات ۱۰ نفر برتر لیگ معرفان و برندگان متاورس:</span>
          </span>
          <span className="text-[11px] text-slate-400">به‌روزرسانی لحظه‌ای سیستم XP</span>
        </h3>

        <div className="grid gap-3">
          {INITIAL_TOP_TEN.map((ref) => {
            const isTop3 = ref.rank <= 3;

            return (
              <div
                key={ref.id}
                className={`glass-card p-4 rounded-2xl border transition flex flex-wrap items-center justify-between gap-3 ${
                  isTop3
                    ? 'border-amber-500/60 bg-slate-900/90 shadow-xl'
                    : 'border-slate-800 bg-slate-950/70 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                      ref.rank === 1
                        ? 'gold-grad text-slate-950 shadow-lg'
                        : ref.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : ref.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    #{ref.rank}
                  </div>

                  <div>
                    <div className="font-black text-amber-200 text-sm flex items-center gap-2">
                      <span>{ref.name}</span>
                      <span className="text-amber-400 text-xs font-mono">
                        {'⭐'.repeat(ref.legendaryStarsReward)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {ref.boothName} | شهر: <strong className="text-slate-300 me-2">{ref.city}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-end">
                    <span className="text-slate-400 block text-[10px]">زمین متاورس شهر توانا:</span>
                    <strong className="text-emerald-400 font-mono text-sm">{ref.metaverseLandSqm} متر مربع</strong>
                  </div>

                  <div className="text-end">
                    <span className="text-slate-400 block text-[10px]">امتیاز تجربه (XP):</span>
                    <strong className="text-amber-300 font-mono text-sm">{ref.xpScore} XP</strong>
                  </div>

                  <button
                    onClick={() => openMetaverseDeed(ref)}
                    className="bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30 transition flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-file-contract"></i>
                    <span>سند زمین</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auth Modal (Mobile OTP / Google) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-md w-full border-2 border-amber-500 space-y-4 relative bg-[#090d18] text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="border-b border-amber-500/30 pb-3">
              <h3 className="font-black text-amber-300 text-sm md:text-base flex items-center gap-2">
                <i className="fa-solid fa-user-lock text-amber-400"></i>
                <span>ورود و احراز هویت کاربری (پیامک OTP یا حساب گوگل)</span>
              </h3>
            </div>

            {/* Auth Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setAuthMethod('mobile')}
                className={`py-2 rounded-lg font-bold transition ${
                  authMethod === 'mobile' ? 'gold-grad text-slate-950' : 'text-slate-400'
                }`}
              >
                📱 شماره موبایل (OTP)
              </button>
              <button
                onClick={() => setAuthMethod('google')}
                className={`py-2 rounded-lg font-bold transition ${
                  authMethod === 'google' ? 'gold-grad text-slate-950' : 'text-slate-400'
                }`}
              >
                📧 حساب گوگل (Gmail)
              </button>
            </div>

            {authMethod === 'mobile' ? (
              !otpSent ? (
                <form onSubmit={handleSendMobileOtp} className="space-y-3 text-xs">
                  <div>
                    <label className="block mb-1 text-slate-300 font-bold">شماره تلفن همراه (ایران):</label>
                    <input
                      type="text"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full gold-grad text-slate-950 font-black py-3 rounded-xl shadow-lg active:scale-95 transition"
                  >
                    ارسال کد تایید پیامکی (SMS OTP)
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3 text-xs">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-300">
                    کد تایید پیامک شده به شماره {mobileNumber}: <strong className="font-mono text-white me-1">{simulatedOtpCode}</strong>
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-300 font-bold">کد تایید ۶ رقمی:</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="۱۲۳۴۵۶"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-300 font-mono font-bold text-center text-base focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg active:scale-95 transition"
                  >
                    تایید کد و ورود به سامانه
                  </button>
                </form>
              )
            ) : (
              <div className="space-y-3 text-xs text-center py-2">
                <p className="text-slate-300">احراز هویت سریع با حساب گوگل / جیمیل:</p>
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl border border-slate-700 flex items-center justify-center gap-2 shadow active:scale-95 transition"
                >
                  <i className="fa-brands fa-google text-red-500 text-base"></i>
                  <span>ورود یک‌کلیکه با Google Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tavana Metaverse Land Title Deed Modal */}
      {showMetaverseCertificate && selectedMemberCertificate && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-lg w-full border-2 border-amber-500 space-y-4 relative bg-[#090d18] text-slate-100 shadow-2xl">
            <button
              onClick={() => setShowMetaverseCertificate(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-xl"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="text-center space-y-2 border-b border-amber-500/30 pb-3">
              <div className="w-16 h-16 rounded-full gold-grad p-1 border-2 border-amber-400 mx-auto flex items-center justify-center text-slate-950 text-2xl shadow-xl">
                <i className="fa-solid fa-landmark-flag"></i>
              </div>
              <h3 className="font-black text-amber-300 text-base">
                سند دیجیتال مالکیت زمین در متاورس «شهر توانا»
              </h3>
              <p className="text-[11px] text-slate-400">Tavana Virtual City Metaverse Land Deed & License</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-slate-400">مالک زمین:</span>
                <strong className="text-amber-300 text-sm font-bold">{selectedMemberCertificate.name}</strong>
              </div>

              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-slate-400">رتبه در لیگ معرفان:</span>
                <span className="bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full font-mono">
                  مقام #{selectedMemberCertificate.rank}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-slate-400">متراژ زمین واگذار شده:</span>
                <strong className="text-emerald-400 text-sm font-mono font-bold">
                  {selectedMemberCertificate.metaverseLandSqm} متر مربع
                </strong>
              </div>

              <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                <span className="text-slate-400">وضعیت مجوز رسمی فعالیت:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>دارای مجوز فعالیت دیجیتال در شهر توانا</span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">ستاره‌های اسطوره‌ای اهدا شده:</span>
                <span className="text-amber-400 font-mono text-sm">
                  {'⭐'.repeat(selectedMemberCertificate.legendaryStarsReward)}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center leading-relaxed bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              🔒 این سند به صورت لایه‌بندی شده در اکوسیستم «شهر مجازی توانا» ثبت شده و کلیه حقوق مادی و معنوی آن محفوظ می‌باشد.
            </div>

            <button
              onClick={() => setShowMetaverseCertificate(false)}
              className="w-full gold-grad text-slate-950 font-black py-3 rounded-xl shadow-lg active:scale-95 transition text-xs"
            >
              تایید و بستن سند
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
