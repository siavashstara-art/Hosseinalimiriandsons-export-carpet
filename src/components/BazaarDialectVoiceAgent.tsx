import React, { useState, useEffect } from 'react';
import { AppLang } from '../types';

interface BazaarDialectVoiceAgentProps {
  currentLang: AppLang;
  onNavigateTab: (tabId: string) => void;
}

interface Persona {
  id: string;
  nameFa: string;
  marketFa: string;
  accentTitleFa: string;
  avatarIcon: string;
  voicePitch: number;
  voiceRate: number;
  greetingFa: string;
  speechGreetingFa: string;
}

interface QAItem {
  questionFa: string;
  answerFa: string;
  speechAnswerFa: string;
  targetTab?: string;
  actionTextFa?: string;
}

export const BazaarDialectVoiceAgent: React.FC<BazaarDialectVoiceAgentProps> = ({
  currentLang,
  onNavigateTab,
}) => {
  const personas: Persona[] = [
    {
      id: 'tabrizi',
      nameFa: 'حاج‌اوغلی تبریزی',
      marketFa: 'تیمچه مظفریه، بازار تبریز',
      accentTitleFa: 'لهجه شیرین آذری-فارسی (متخصص رج‌های ۵۰ به بالا)',
      avatarIcon: 'fa-user-tie',
      voicePitch: 0.95,
      voiceRate: 0.9,
      greetingFa: 'سلام جانم سنه قوربان! بنده در خدمت سرکارم. هر سوالی راجع به رج تبریز، ابریشم و قالی‌های سرای مظفریه داری بفرما.',
      speechGreetingFa: 'سلام جانم سنه قوربان. حاج اوغلی در خدمت شماست. بفرما قالی تبریز و رج‌شمار چی میخوای جانیم.',
    },
    {
      id: 'esfahani',
      nameFa: 'اوستا رضای اصفهانی',
      marketFa: 'سرای گلشن، میدان نقش‌جهان اصفهان',
      accentTitleFa: 'لهجه گرم اصفهانی (نکته‌سنج رنگ‌های گیاهی و ابریشم خفت)',
      avatarIcon: 'fa-glasses',
      voicePitch: 1.1,
      voiceRate: 0.88,
      greetingFa: 'سلامت باشین دادا! در خدمتیم. اگه دنبال فرشی هستین که صد سال مثل روز اول جلا بدهد، بپرسید تا با حساب و کتاب بگم خدمتتون.',
      speechGreetingFa: 'سلامت باشین دادا. اوستا رضا در خدمت شوماس. قالی اصفهان و رنگ طبیعی روناس میخوای بپرس تا بگم.',
    },
    {
      id: 'tehrani',
      nameFa: 'حاج‌آقا میری بازار بزرگ',
      marketFa: 'سرای بوعلی، بازار بزرگ تهران',
      accentTitleFa: 'لحن تهرانی قدیم و پهلوانی (امین صنف و پیشکسوت)',
      avatarIcon: 'fa-vest',
      voicePitch: 0.85,
      voiceRate: 0.86,
      greetingFa: 'یا علی مدد! صفا آوردی اخوی. قالی دستباف برکت خونس، نون حلاله. هر جاش کار با موبایل برات ثقیله، بگو تا با دست برات راه بندازم.',
      speechGreetingFa: 'یا علی مدد همکار گرامی. حاج آقا میری در خدمت شماست. هر مرحله‌ای برات سخته بگو تا برات انجام بدم داداش.',
    },
  ];

  const [activePersonaId, setActivePersonaId] = useState<string>('tehrani');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'agent'; text: string; actionTab?: string; actionText?: string }[]>([]);
  const [customQuestion, setCustomQuestion] = useState<string>('');

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  const commonQuestions: QAItem[] = [
    {
      questionFa: 'چطور بفهمم این قالی چند رج است و ارزشش چقدره؟',
      answerFa:
        'قربان شکل ماهت، یک خط‌کش ۷ سانتی بذار پشت قالی. تعداد گره‌هایی که توی این ۷ سانت جا شده رو بشمار؛ اگه ۴۰ تا بود میشه ۴۰ رج، اگه ۵۰ تا بود میشه ۵۰ رج اعلا. همین الان می‌تونی دکمه ردشمار رو بزنی تا برات حساب کنم.',
      speechAnswerFa:
        'خط کش هفت سانتی را پشت قالی بگذار. تعداد گره ها را بشمار. اگر پنجاه تا بود یعنی پنجاه رج تبریزه. دکمه ردشمار را بزن تا خودم برایت حساب کنم.',
      targetTab: 'raj',
      actionTextFa: 'ورود مستقیم به ابزار ردشمار و رج‌شمار',
    },
    {
      questionFa: 'از کجا مطمئن شوم رنگ‌های قالی گیاهی هستند و پس نمی‌دهند؟',
      answerFa:
        'دستت درد نکنه، سوال فنی پرسیدی! قالی رنگ گیاهی مثل پوست گردو و روناس، جلا و درخشش طبیعی داره و با پارچه سفید نم‌دار رنگ پس نمی‌ده. بخش آزمایشگاه بینایی ماشین ما هم با هوش مصنوعی طیف نوری پشم رو آزمایش می‌کنه.',
      speechAnswerFa:
        'یک پارچه سفید نمدار روی فرش بکشید. اگر رنگ نداد و بوی طبیعی پشم داد گیاهی است. در بخش آزمایشگاه هوش مصنوعی هم میتوانید درصد گیاهی بودن را بسنجید.',
      targetTab: 'evaluator',
      actionTextFa: 'ورود به آزمایشگاه تشخیص رنگ گیاهی',
    },
    {
      questionFa: 'من کار با گوشی بلد نیستم، چطور حجره‌ام را ثبت کنم؟',
      answerFa:
        'اصلاً غصه نخور برادر من. فقط نام حجره‌ات رو بگو، کد ملی ۱۰ رقمی و شماره موبایل. من و پسرهای حجره میری همه رو برات ثبت می‌کنیم تا نشان اصالت بازار برات صادر بشه.',
      speechAnswerFa:
        'اصلا نگران نباشید. فقط کدملی و نام حجره تان را وارد کنید. بدون کار پیچیده اینترنتی غرفه شما رسمی ثبت میشود.',
      targetTab: 'booths',
      actionTextFa: 'ورود به بخش ثبت حجره با کد ملی',
    },
    {
      questionFa: 'چطور برای مشتری راه دور در تلگرام یا واتساپ عکس و قیمت بفرستم؟',
      answerFa:
        'بارک‌الله! با ابزار استوریساز ما، یک عکس از قالی انتخاب می‌کنی، سیستم خودکار یک پوستر مجلل با آرم حجره شما، ابعاد و قیمت برات درست می‌کنه تا با یک کلیک توی واتساپ بفرستی.',
      speechAnswerFa:
        'با ابزار استوریساز بازار، اندازه و قیمت را بنویسید تا پوستر شکیل با مهر حجره شما آماده و مستقیم به تلگرام مشتری ارسال شود.',
      targetTab: 'story',
      actionTextFa: 'ورود به استوریساز تلگرام و واتساپ',
    },
  ];

  useEffect(() => {
    // Initial welcome message from persona
    setChatLog([
      {
        sender: 'agent',
        text: activePersona.greetingFa,
      },
    ]);
  }, [activePersonaId]);

  const speak = (text: string, persona: Persona) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fa-IR';
    utterance.pitch = persona.voicePitch;
    utterance.rate = persona.voiceRate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleAskQuestion = (qa: QAItem) => {
    setChatLog((prev) => [
      ...prev,
      { sender: 'user', text: qa.questionFa },
      { sender: 'agent', text: qa.answerFa, actionTab: qa.targetTab, actionText: qa.actionTextFa },
    ]);
    speak(qa.speechAnswerFa, activePersona);
  };

  const handleSendCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    const q = customQuestion;
    setCustomQuestion('');

    const matched = commonQuestions.find((item) =>
      q.includes('رج') ? item.questionFa.includes('رج') :
      q.includes('رنگ') ? item.questionFa.includes('رنگ') :
      q.includes('حجره') ? item.questionFa.includes('حجره') :
      q.includes('استوری') || q.includes('تلگرام') ? item.questionFa.includes('تلگرام') : false
    );

    const answer = matched
      ? matched.answerFa
      : `قربان وجودت، در رابطه با «${q}»، در خدمتت هستیم. کارشناسان حجره حاج حسین‌علی میری و پسران تلفنی تمام مراحل را برای شما انجام می‌دهند. تلفن: ۰۲۱۵۵۶۳۸۲۹۱`;

    const speech = matched ? matched.speechAnswerFa : answer;

    setChatLog((prev) => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'agent', text: answer, actionTab: matched?.targetTab, actionText: matched?.actionTextFa },
    ]);
    speak(speech, activePersona);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" dir="rtl">
      {/* Title Header */}
      <div className="glass-card p-6 rounded-3xl border-2 border-amber-400 bg-black space-y-3 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-400/40 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
              <i className="fa-solid fa-headset text-2xl"></i>
            </span>
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400 px-3 py-0.5 rounded-lg text-xs font-black">
                <i className="fa-solid fa-microphone-lines text-amber-400"></i>
                <span>دستیار صوتی هوشمند پیشکسوت بازار</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                مشاور صوتی با لهجه‌های بومی بازار (تبریز، اصفهان، تهران)
              </h2>
            </div>
          </div>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black border-2 border-white flex items-center gap-2 shadow-lg animate-pulse"
            >
              <i className="fa-solid fa-volume-xmark text-sm"></i>
              <span>قطع صدای مشاور</span>
            </button>
          )}
        </div>

        <p className="text-white text-sm sm:text-base font-bold leading-relaxed">
          اگر خواندن متن‌های طولانی برای شما دشوار است یا مایلید با زبان گرم و صمیمی بازاریان سوال بپرسید، پیشکسوت مورد نظر خود را انتخاب کنید و سوالتان را بشنوید.
        </p>
      </div>

      {/* Persona Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {personas.map((persona) => {
          const isSelected = persona.id === activePersonaId;
          return (
            <button
              key={persona.id}
              onClick={() => {
                setActivePersonaId(persona.id);
                speak(persona.speechGreetingFa, persona);
              }}
              className={`p-4 rounded-2xl border-3 text-right transition flex items-center gap-3 ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-white font-black shadow-[0_0_25px_rgba(245,158,11,0.6)] scale-[1.02]'
                  : 'bg-slate-950 text-white border-amber-400/50 hover:border-amber-400'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                isSelected ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-white'
              }`}>
                <i className={`fa-solid ${persona.avatarIcon}`}></i>
              </div>
              <div className="truncate">
                <div className="font-black text-sm">{persona.nameFa}</div>
                <div className="text-[11px] opacity-80">{persona.marketFa}</div>
                <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{persona.accentTitleFa.split(' ')[0]}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dialogue Box */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border-3 border-amber-400 bg-black space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-400/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-sm font-black text-white">
              در حال گفتگو با {activePersona.nameFa} ({activePersona.marketFa})
            </span>
          </div>
          <button
            onClick={() => speak(activePersona.speechGreetingFa, activePersona)}
            className="text-xs font-black text-amber-300 hover:text-white flex items-center gap-1.5"
          >
            <i className="fa-solid fa-volume-high"></i>
            <span>پخش مجدد صدای خوش‌آمد</span>
          </button>
        </div>

        {/* Chat History Viewport */}
        <div className="space-y-3 max-h-96 overflow-y-auto p-2">
          {chatLog.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-start' : 'items-end'
              }`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl border-2 text-sm sm:text-base font-bold leading-relaxed shadow-lg ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 border-amber-400/60 text-white text-right'
                    : 'bg-amber-400/10 border-amber-400 text-white text-right'
                }`}
              >
                <div className="text-[11px] font-black text-amber-300 mb-1 flex items-center gap-1.5">
                  <i className={`fa-solid ${msg.sender === 'user' ? 'fa-user' : activePersona.avatarIcon}`}></i>
                  <span>{msg.sender === 'user' ? 'شما (حجره‌دار محترم):' : `${activePersona.nameFa}:`}</span>
                </div>
                <p>{msg.text}</p>

                {msg.actionTab && (
                  <div className="pt-3">
                    <button
                      onClick={() => onNavigateTab(msg.actionTab!)}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow border border-white"
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      <span>{msg.actionText || 'ورود به بخش مربوطه'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Elder Quick-Question Chips */}
        <div className="space-y-2 pt-2 border-t border-amber-400/40">
          <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
            <i className="fa-solid fa-circle-question"></i>
            <span>پرسش‌های متداول پیشکسوتان و بازاریان (کلیک کنید تا صوتی پاسخ داده شود):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {commonQuestions.map((qa, index) => (
              <button
                key={index}
                onClick={() => handleAskQuestion(qa)}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white border border-amber-400/50 hover:border-amber-400 text-right text-xs sm:text-sm font-bold flex items-center justify-between gap-2 transition active:scale-98 shadow"
              >
                <span className="truncate">{qa.questionFa}</span>
                <i className="fa-solid fa-volume-high text-amber-400 text-xs shrink-0"></i>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Bar */}
        <div className="flex gap-2 pt-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCustomQuestion()}
            placeholder="یا سوال خود را به زبان خودتان بنویسید (مثلاً: قیمت فرش چند؟)..."
            className="flex-1 bg-slate-950 text-white placeholder-slate-400 px-4 py-3 rounded-2xl border-2 border-amber-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button
            onClick={handleSendCustomQuestion}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm border-2 border-white shadow flex items-center gap-2 active:scale-95 transition"
          >
            <span>بپرس</span>
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
