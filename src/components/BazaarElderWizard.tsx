import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface BazaarElderWizardProps {
  currentLang: AppLang;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

interface WizardStep {
  id: number;
  titleFa: string;
  badgeFa: string;
  targetTab?: string;
  icon: string;
  summaryFa: string;
  elderInstructionsFa: string[];
  speechTextFa: string;
  tipForApprenticeFa: string;
  actionButtonTextFa: string;
}

export const BazaarElderWizard: React.FC<BazaarElderWizardProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [apprenticeMode, setApprenticeMode] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: WizardStep[] = [
    {
      id: 1,
      titleFa: 'ثبت حجره شما در سامانه ملی با کد ملی و شماره همراه',
      badgeFa: 'قدم اول: هویت و جواز کسب',
      targetTab: 'booths',
      icon: 'fa-id-card',
      summaryFa: 'برای اینکه خریداران در سراسر ایران و جهان به شما اعتماد کنند، نام حجره و کد ملی خود را ثبت کنید.',
      elderInstructionsFa: [
        'کد ملی ۱۰ رقمی خود و شماره تلفن همراه را در بخش حجره‌های بازار وارد کنید.',
        'نیازی به بلد بودن کارهای پیچیده اینترنتی نیست؛ فقط نام حجره (مثلاً حجره حاج احمد در سرای بوعلی) را بنویسید.',
        'پس از ثبت، نشان رسمی و تأییدیه اصالت کشوری برای حجره شما فعال می‌شود.',
      ],
      speechTextFa:
        'سلام حاج آقای محترم و همکار گرامی بازار. در قدم اول، فقط کافیست نام حجره، شماره همراه و کد ملی خود را وارد کنید تا غرفه رسمی شما در بازار سراسری ایران ثبت شود و خریداران با خیال راحت و اطمینان از شما خرید کنند.',
      tipForApprenticeFa: 'نکته برای شاگرد حجره: کد ملی صاحب حجره را بدون خط تیره وارد کنید تا نشان غرفه معتبر و تأییدیه هویت فعال گردد.',
      actionButtonTextFa: 'ورود مستقیم به بخش ثبت حجره و غرفه',
    },
    {
      id: 2,
      titleFa: 'محاسبه فوری رج و تراکم قالی با خط‌کش ۷ سانت یا دوربین',
      badgeFa: 'قدم دوم: ردشمار و سنجش گره',
      targetTab: 'raj',
      icon: 'fa-ruler-combined',
      summaryFa: 'بدون نیاز به ضرب و تقسیم و ماشین‌حساب، رج قالی (تعداد گره در ۷ سانتی‌متر) دقیقاً محاسبه می‌شود.',
      elderInstructionsFa: [
        'خط‌کش فلزی ۷ سانت معمولی بازار را روی پشت قالی بگذارید.',
        'تعداد گره‌های شمرده شده را بزنید یا اجازه دهید دوربین خودکار آن را بشمارد.',
        'سیستم بلافاصله به شما می‌گوید این قالی چند رج است (مثلاً ۴۰ رج، ۵۰ رج تبریز یا ۶۰ رج صیرفیان) و چقدر ارزش دارد.',
      ],
      speechTextFa:
        'در قدم دوم، خط‌کش هفت سانتی را پشت قالی بگذارید. بدون نیاز به حساب و کتاب، تعداد گره در هفت سانت را وارد کنید تا سیستم خودکار رج و تراکم دقیق فرش را تعیین کند.',
      tipForApprenticeFa: 'نکته برای شاگرد حجره: در بخش ردشمار، دکمه دوربین عکاسی را بزنید تا با هوش مصنوعی گره‌ها اتوماتیک شمرده شوند.',
      actionButtonTextFa: 'ورود مستقیم به ابزار ردشمار و رج‌شمار قالی',
    },
    {
      id: 3,
      titleFa: 'عکسبرداری ساده از قالی (ترنج، لچک و پشت فرش)',
      badgeFa: 'قدم سوم: معرفی تصویری فرش',
      targetTab: 'story',
      icon: 'fa-camera-retro',
      summaryFa: 'یک عکس از نمای کل قالی و یک عکس از پشت قالی با نور خوب روز بیندازید.',
      elderInstructionsFa: [
        'قالی را روی زمین صاف یا تخت باز کنید.',
        'موبایل را مستقیم بالای فرش بگیرید تا نقشه فرش کج نیفتد.',
        'بهترین نور، روشنایی روز در حجره یا زیر هالوژن ملایم بدون سایه تند است.',
        'اگر دستتان لرزش دارد، گوشی را به شاگرد حجره یا پسرتان بدهید تا دکمه عکس را فشار دهد.',
      ],
      speechTextFa:
        'در قدم سوم، یک عکس واضح از رو و یک عکس از پشت فرش بیندازید. نور طبیعی پنجره حجره بهترین کیفیت را به رنگ‌های دستباف می‌دهد.',
      tipForApprenticeFa: 'نکته برای شاگرد حجره: از زاویه بالا عمود بگیرید تا گوشه‌های فرش جمع نشود و رنگ‌ها طبیعی باشد.',
      actionButtonTextFa: 'ورود به ابزار عکاسی و استوریساز',
    },
    {
      id: 4,
      titleFa: 'ساخت خودکار استوری و اعلامیه فروش برای تلگرام و واتساپ',
      badgeFa: 'قدم چهارم: ارسال برای مشتریان',
      targetTab: 'story',
      icon: 'fa-paper-plane',
      summaryFa: 'با یک دکمه، پوستر و استوری شیک و آراسته همراه با قیمت و ابعاد برای شما آماده می‌شود.',
      elderInstructionsFa: [
        'ابعاد (مثلاً ۶ متری، ۹ متری یا ذرع و نیم) و قیمت مورد نظرتان را وارد کنید.',
        'دکمه «ساخت کارت استوری» را بزنید؛ پوستر لوکس با نشان رسمی حجره شما خودکار آماده می‌شود.',
        'همانجا دکمه «اشتراک در واتساپ و تلگرام» را بزنید تا مستقیم به لیست مخاطبان و همکاران بازار ارسال شود.',
      ],
      speechTextFa:
        'در قدم چهارم، اندازه و قیمت قالی را انتخاب کنید و دکمه ساخت استوری را بزنید. سیستم پوستر رسمی با مهر حجره شما را آماده می‌کند تا مستقیماً به تلگرام یا واتساپ مشتریان بفرستید.',
      tipForApprenticeFa: 'نکته برای شاگرد حجره: می‌توانید قالب استوری اینستاگرام را با سایز عمودی انتخاب و مستقیم در پیج یا کانال تلگرام حجره ذخیره کنید.',
      actionButtonTextFa: 'ورود به استوریساز و ساخت پوستر قالی',
    },
    {
      id: 5,
      titleFa: 'حضور در اتاق مزایده زمان‌دار و تور مجازی ۳۶۰ درجه حجره',
      badgeFa: 'قدم پنجم: فروش به خریداران سراسری و بین‌المللی',
      targetTab: 'timedauction',
      icon: 'fa-gavel',
      summaryFa: 'قالی‌های خاص و عتیقه خود را در تالار حراجی بگذارید یا اجازه دهید مشتری در حجره‌تان گردش کند.',
      elderInstructionsFa: [
        'اگر قالی خاص یا تخته فرش عتیقه دارید، در بخش مزایده قیمت پایه را بگذارید تا خریداران از شهرهای مختلف پیشنهاد قیمت دهند.',
        'مشتریانی که نمی‌توانند حضوری به بازار تهران، تبریز یا اصفهان بیایند با تور ۳۶۰ درجه از حجره شما دیدن می‌کنند.',
        'تسویه حساب از طریق درگاه امن و حواله مستقیم بانکی با تأیید فاکتور رسمی انجام می‌شود.',
      ],
      speechTextFa:
        'در قدم پنجم، می‌توانید فرش‌های ممتاز را در حراجی زمان‌دار قرار دهید تا خریداران با بالاترین پیشنهاد قالی شما را بخرند. خریداران خارجی و شهرستانی نیز می‌توانند حجره شما را سه‌بعدی تماشا کنند.',
      tipForApprenticeFa: 'نکته برای شاگرد حجره: زمان مزایده را بین ۱ تا ۳ روز تنظیم کنید و عکس‌های باکیفیت بارگذاری کنید.',
      actionButtonTextFa: 'مشاهده اتاق مزایده و تور حجره',
    },
    {
      id: 6,
      titleFa: 'کمک تلفنی فوری و پشتیبانی حضوری حجره حاج حسین‌علی میری',
      badgeFa: 'قدم ششم: پشتیبانی و همراهی پیشکسوتان',
      targetTab: 'creator',
      icon: 'fa-phone-volume',
      summaryFa: 'اگر در هر مرحله‌ای کار با موبایل برایتان سخت بود، کارشناسان بازار تلفنی مرحله به مرحله انجام می‌دهند.',
      elderInstructionsFa: [
        'اگر چشمتان ضعیف است یا خواندن صفحه‌نمایش دشوار است، از دکمه بلندگوی صوتی در بالای هر صفحه استفاده کنید.',
        'کارشناسان فنی حجره مرکزی آماده‌اند تمام مراحل ثبت فرش‌های شما را تلفنی یا حضوری در بازار بزرگ برای شما انجام دهند.',
        'شماره تماس مستقیم پشتیبانی پیشکسوتان: ۰۲۱-۵۵۶۳۸۲۹۱ یا ۰۹۱۲۱۱۱۱۱۱۱',
      ],
      speechTextFa:
        'حاج آقای عزیز، اگر در هر مرحله‌ای سوالی داشتید یا کار با موبایل برایتان سخت بود، تیم پشتیبانی حجره حاج حسین‌علی میری و پسران تلفنی تمام کارها را برای شما انجام می‌دهند. عزت و سلامت باشید.',
      tipForApprenticeFa: 'نکته برای شاگرد حجره: در صورت نیاز می‌توانید درخواست کارشناس حضوری به حجره ثبت کنید تا تمام موجودی قالی‌های شما را فهرست کند.',
      actionButtonTextFa: 'مشاهده اطلاعات تماس و پشتیبانی بازار',
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Stop speech when closing or changing steps
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStepIndex, isOpen]);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('مرورگر شما از قابلیت پخش صوتی پشتیبانی نمی‌کند.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fa-IR';
    utterance.rate = 0.88; // Slightly slower, very articulate and warm for elders
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps((prev) => [...prev, currentStep.id]);
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleGoToFeature = (tabId?: string) => {
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps((prev) => [...prev, currentStep.id]);
    }
    if (tabId) {
      onNavigateTab(tabId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-3xl bg-black border-4 border-amber-400 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.5)] p-5 sm:p-8 space-y-6 text-white my-auto max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b-2 border-amber-400/80 pb-4 gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-xl text-xs sm:text-sm font-black shadow">
              <i className="fa-solid fa-compass text-base"></i>
              <span>راهنمای ویژه پیشکسوتان و بازاریان سنتی (بدون نیاز به سواد دیجیتال)</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
              مراحل گام‌به‌گام ملی فرش ایران: آسان، خوانا و گویا
            </h2>
            <p className="text-amber-300 text-xs sm:text-sm font-bold">
              حجره حاج حسین‌علی میری و پسران — راهنمای عملی برای هر پیرمرد و جوان بازاری
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 sm:p-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-lg transition active:scale-95 border-2 border-white shadow-xl shrink-0"
            title="بستن راهنما"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Apprentice Mode & Voice Switch Toolbar */}
        <div className="bg-slate-950 p-4 rounded-2xl border-2 border-amber-400/80 flex flex-wrap items-center justify-between gap-3 shadow-inner">
          <button
            onClick={() => handleSpeak(currentStep.speechTextFa)}
            className={`px-4 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 border-2 transition active:scale-95 shadow-lg ${
              isSpeaking
                ? 'bg-red-600 border-white text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 border-amber-300 text-white'
            }`}
          >
            <i className={`fa-solid ${isSpeaking ? 'fa-stop' : 'fa-volume-high'} text-lg`}></i>
            <span>{isSpeaking ? 'توقف صدای راهنما' : '🔊 پخش صوتی توضیحات این مرحله (بلند بخوان)'}</span>
          </button>

          <button
            onClick={() => setApprenticeMode((prev) => !prev)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black border-2 transition flex items-center gap-2 ${
              apprenticeMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                : 'bg-slate-900 text-white border-amber-400/60 hover:bg-slate-800'
            }`}
          >
            <i className="fa-solid fa-user-group text-sm"></i>
            <span>{apprenticeMode ? 'حالت شاگرد حجره و فرزندان (فعال)' : 'فعال‌سازی راهنمای شاگرد حجره'}</span>
          </button>
        </div>

        {/* Step Indicator Progress (1 to 6) */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {steps.map((st, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isDone = completedSteps.includes(st.id);

            return (
              <button
                key={st.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-2 sm:p-2.5 rounded-xl border-2 text-center transition flex flex-col items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 border-white font-black scale-105 shadow-xl ring-2 ring-amber-300'
                    : isDone
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center gap-1 font-black text-sm sm:text-base">
                  {isDone && <i className="fa-solid fa-check text-xs text-emerald-400"></i>}
                  <span>گام {st.id}</span>
                </div>
                <span className="text-[10px] sm:text-xs truncate max-w-full font-bold">
                  {st.badgeFa.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Main Card */}
        <div className="bg-slate-950 p-6 rounded-3xl border-3 border-amber-400 space-y-5 shadow-2xl relative">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
              <i className={`fa-solid ${currentStep.icon}`}></i>
            </div>
            <div>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400 px-3 py-0.5 rounded-lg text-xs font-black">
                {currentStep.badgeFa}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                {currentStep.titleFa}
              </h3>
            </div>
          </div>

          {/* Simple Explanation for Elders */}
          <div className="bg-black/90 p-4 rounded-2xl border-2 border-amber-400/50 space-y-2">
            <div className="text-amber-300 font-black text-sm flex items-center gap-2">
              <i className="fa-solid fa-hand-holding-heart text-amber-400"></i>
              <span>خلاصه به زبان ساده بازار:</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentStep.summaryFa}
            </p>
          </div>

          {/* Step-by-Step Practical Bullets */}
          <div className="space-y-3 pt-1">
            <div className="text-white font-black text-sm flex items-center gap-2">
              <i className="fa-solid fa-list-check text-amber-400 text-base"></i>
              <span>کارهایی که باید انجام دهید (قدم‌به‌قدم):</span>
            </div>
            <div className="space-y-2.5">
              {currentStep.elderInstructionsFa.map((inst, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-black p-3.5 rounded-xl border border-amber-400/40"
                >
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow">
                    {i + 1}
                  </span>
                  <p className="text-white text-base sm:text-lg font-bold leading-relaxed">
                    {inst}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Apprentice Mode Box (if activated) */}
          {apprenticeMode && (
            <div className="p-4 rounded-2xl bg-amber-950/60 border-2 border-amber-300 space-y-1.5 animate-fadeIn">
              <div className="text-amber-300 font-black text-xs sm:text-sm flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-base"></i>
                <span>راهنمای کمکی مخصوص شاگرد حجره، پسر یا منشی:</span>
              </div>
              <p className="text-white text-sm sm:text-base font-bold leading-normal">
                {currentStep.tipForApprenticeFa}
              </p>
            </div>
          )}

          {/* Direct Action Trigger Button */}
          {currentStep.targetTab && (
            <div className="pt-2">
              <button
                onClick={() => handleGoToFeature(currentStep.targetTab)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black text-lg sm:text-xl shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:brightness-110 transition active:scale-98 flex items-center justify-center gap-3 border-2 border-white"
              >
                <i className={`fa-solid ${currentStep.icon} text-xl`}></i>
                <span>{currentStep.actionButtonTextFa}</span>
                <i className="fa-solid fa-arrow-left text-lg"></i>
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar: Previous / Next & Emergency Help */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`flex-1 sm:flex-none px-5 py-3 rounded-2xl font-black text-base border-2 transition flex items-center justify-center gap-2 ${
                currentStepIndex === 0
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-slate-950 border-amber-400 text-white hover:bg-slate-900 active:scale-95'
              }`}
            >
              <i className="fa-solid fa-arrow-right"></i>
              <span>قدم قبلی</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-base border-2 transition flex items-center justify-center gap-2 ${
                currentStepIndex === steps.length - 1
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-amber-400 border-white text-slate-950 hover:bg-amber-300 active:scale-95 shadow-lg'
              }`}
            >
              <span>قدم بعدی</span>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          </div>

          {/* Direct Phone Hotline for Elders */}
          <a
            href="tel:02155638291"
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 border-2 border-white shadow-xl transition active:scale-95"
          >
            <i className="fa-solid fa-phone text-base animate-bounce"></i>
            <span>تلفن مشاوره و پشتیبانی حجره: ۰۲۱۵۵۶۳۸۲۹۱</span>
          </a>
        </div>
      </div>
    </div>
  );
};
