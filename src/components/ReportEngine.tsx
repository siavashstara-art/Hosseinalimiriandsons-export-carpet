import React, { useState } from 'react';
import { AppLang, ReportTicket } from '../types';
import { i18n } from '../constants/translations';

interface ReportEngineProps {
  currentLang: AppLang;
}

export const ReportEngine: React.FC<ReportEngineProps> = ({ currentLang }) => {
  const t = i18n[currentLang] || i18n['fa'];

  const [targetType, setTargetType] = useState<'ad' | 'booth' | 'user'>('ad');
  const [targetId, setTargetId] = useState<string>('');
  const [reasonCategory, setReasonCategory] = useState<ReportTicket['reasonCategory']>('fraud');
  const [description, setDescription] = useState<string>('');
  const [reporterContact, setReporterContact] = useState<string>('');

  const [tickets, setTickets] = useState<ReportTicket[]>([
    {
      id: 'REP-9901',
      targetType: 'ad',
      targetId: 'آگهی کد #۱۰۴۲ (فرش تبریز)',
      reasonCategory: 'fake_handcraft',
      description: 'عرضه فرش ماشینی به عنوان دستباف ابریشم',
      reporterContact: '۰۹۱۲***۸۸۹۹',
      createdAt: '۱۴۰۵/۰۸/۰۲',
      status: 'banned'
    }
  ]);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId || !description) {
      alert('لطفاً شناسه مورد تخلف و شرح گزارش را وارد کنید.');
      return;
    }

    const newTicket: ReportTicket = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      targetType,
      targetId,
      reasonCategory,
      description,
      reporterContact,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      status: 'union_referred'
    };

    setTickets([newTicket, ...tickets]);
    setDescription('');
    setTargetId('');
    alert('🚩 گزارش تخلف با موفقیت ثبت شد! پرونده جهت بن دائم و ارجاع به اتحادیه فرش صادر گردید.');
  };

  return (
    <section className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="border-b border-rose-500/30 pb-4">
        <h2 className="text-base md:text-lg font-black text-rose-400 flex items-center gap-2">
          <i className="fa-solid fa-flag text-rose-500"></i>
          <span>سامانه گزارش تخلفات، بن دائم و ارجاع به اتحادیه فرش</span>
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          مبارزه با کلاهبرداری، گران‌فروشی فاحش، مال سرقتی، عرضه فرش ماشینی به‌جای دستباف و نقض ضوابط اخلاقی
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        {/* Report Form */}
        <form onSubmit={handleReportSubmit} className="space-y-3.5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div className="font-bold text-amber-300 text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
            <i className="fa-solid fa-shield-cat text-rose-400"></i>
            <span>ثبت گزارش تخلف و پرچم‌گذاری (🚩 Report):</span>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-semibold">موضوع تخلف:</label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="ad">آگهی فرش یا محصول</option>
              <option value="booth">غرفه و حجره تجاری</option>
              <option value="user">کاربر / خریدار / فروشنده</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-semibold">شناسه / لینک یا نام مورد تخلف:</label>
            <input
              type="text"
              required
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="مثلاً: آگهی شماره ۱۰۴۲ یا حجره کاشان"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-semibold">دسته علت گزارش:</label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="fraud">کلاهبرداری مالی یا عدم تحویل کالا</option>
              <option value="fake_handcraft">عرضه فرش ماشینی به عنوان دستباف</option>
              <option value="overpricing">گران‌فروشی فاحش و سوءاستفاده از ناآگاهی خریدار</option>
              <option value="stolen">مشکوک به مال سرقتی یا بدون سند</option>
              <option value="ethical">نقض منشور اخلاقی (سیاسی، تصاویر نامناسب، توهین)</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-semibold">شرح کامل تخلف و مستندات:</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات دقیق جهت بررسی ضابطین قضایی و بازرسان اتحادیه..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-semibold">شماره تماس شما (جهت پیگیری محرمانه):</label>
            <input
              type="text"
              value={reporterContact}
              onChange={(e) => setReporterContact(e.target.value)}
              placeholder="۰۹۱۲..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-3 rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-ban"></i>
            <span>ثبت گزارش و درخواست بن دائم (Permanent Ban)</span>
          </button>
        </form>

        {/* Guild Notice & Legal Disclaimer */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-rose-950/40 p-4 rounded-2xl border border-rose-500/40 text-rose-200 space-y-2">
            <div className="font-bold text-sm flex items-center gap-2 text-rose-300">
              <i className="fa-solid fa-gavel"></i>
              <span>مجازات تخلفات تجاری و برخورد انضباطی:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-300">
              هرگونه کلاهبرداری، گران‌فروشی فاحش یا عدم تطابق فرش منجر به **بن دائم حساب (Permanent Ban)** بدون هشدار قبلی شده و پرونده به **«اتحادیه فرش»** و **«اتحادیه صادرکنندگان»** جهت پیگرد کیفری ارجاع خواهد شد.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-amber-500/30 space-y-2 text-slate-300">
            <div className="font-bold text-xs text-amber-300 flex items-center gap-2">
              <i className="fa-solid fa-building-columns"></i>
              <span>سلب مسئولیت داوری درون‌صنفی:</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              پلتفرم به هیچ عنوان مرجع حل اختلاف مالی همکاران (چک، نسیه، حساب‌کتاب میان خود فرش‌فروشان) نیست؛ این موارد صرفاً برای رسیدگی به کمیسیون حل اختلاف اتحادیه فرش ارجاع می‌شود.
            </p>
          </div>

          {/* Submitted tickets log */}
          <div className="space-y-2">
            <div className="font-bold text-amber-300 text-xs">آخرین گزارش‌های ارجاع‌شده به اتحادیه:</div>
            {tickets.map((t) => (
              <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-[11px]">
                <div>
                  <span className="font-mono text-rose-400 font-bold me-2">{t.id}</span>
                  <span className="text-slate-200">{t.targetId}</span>
                </div>
                <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full text-[10px] border border-rose-800">
                  {t.status === 'banned' ? 'بن دائم شده' : 'ارجاع به اتحادیه'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
