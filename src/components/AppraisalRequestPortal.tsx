import React, { useState } from 'react';
import { AppLang, AppraisalRequest } from '../types';
import { i18n } from '../constants/translations';
import heroRugImg from '../assets/images/rug_hero_showcase_1792998592659.jpg';
import knotSampleImg from '../assets/images/rug_back_knot_sample_1792998593324.jpg';

interface AppraisalRequestPortalProps {
  currentLang: AppLang;
}

export const MOCK_APPRAISAL_REQUESTS: AppraisalRequest[] = [
  {
    id: 'APP-801',
    ownerName: 'استاد احمد کاشانی',
    contactPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    carpetDimensions: '۲۰۰ × ۳۰۰ سانتیمتر (۶ متری)',
    notes: 'قالیچه قدیمی بافت کاشان، چله ابریشم، خاب سالم بدون هیچ‌گونه مرمت ناگفته.',
    frontImageBase64: heroRugImg,
    backImageBase64: knotSampleImg,
    status: 'certified',
    createdAt: '۱۴۰۵/۰۸/۰۱'
  }
];

export const AppraisalRequestPortal: React.FC<AppraisalRequestPortalProps> = ({ currentLang }) => {
  const t = i18n[currentLang] || i18n['fa'];

  const [requests, setRequests] = useState<AppraisalRequest[]>(MOCK_APPRAISAL_REQUESTS);

  // Form State
  const [ownerName, setOwnerName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [carpetDimensions, setCarpetDimensions] = useState<string>('6_meter');
  const [notes, setNotes] = useState<string>('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFrontImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBackImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !contactPhone) {
      alert('لطفاً نام متقاضی و شماره تماس را وارد کنید.');
      return;
    }

    const newReq: AppraisalRequest = {
      id: `APP-${Math.floor(100 + Math.random() * 900)}`,
      ownerName,
      contactPhone,
      carpetDimensions,
      notes,
      frontImageBase64: frontImage || heroRugImg,
      backImageBase64: backImage || knotSampleImg,
      status: 'pending_review',
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    setRequests([newReq, ...requests]);
    setOwnerName('');
    setNotes('');
    setFrontImage(null);
    setBackImage(null);
    alert('📋 درخواست کارشناسی تخصصی فرش شما با موفقیت در سامانه ثبت شد!');
  };

  const getStatusBadge = (status: AppraisalRequest['status']) => {
    switch (status) {
      case 'certified': return { label: '✅ کارشناسی تکمیل و شناسنامه صادر شد', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'analyzing': return { label: '🔍 در حال آنالیز هوش مصنوعی و هیئت کارشناسان', style: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      default: return { label: '⏳ ثبت اولیه - در صف بررسی اولیه', style: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <section className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="border-b border-amber-500/30 pb-4">
        <h2 className="text-base md:text-lg font-black gold-text flex items-center gap-2">
          <i className="fa-solid fa-microchip text-amber-400"></i>
          <span>درگاه ثبت‌نام و درخواست «کارشناسی تخصصی و صدور شناسنامه فرش»</span>
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          ثبت درخواست ارزیابی اصالت، قدمت، نوع گره و سلامت فیزیکی توسط تیم کارشناسان حجره میری
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-xs">
        {/* Request Form */}
        <form onSubmit={handleSubmitRequest} className="space-y-3.5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div className="font-bold text-amber-300 text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
            <i className="fa-solid fa-file-signature text-amber-400"></i>
            <span>ثبت درخواست کارشناسی:</span>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-bold">نام و نام خانوادگی متقاضی / مالک:</label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="نام کامل مالک فرش"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-amber-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-300 font-bold">شماره تماس مستقیم:</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="۰۹۱۲..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-bold">ابعاد تقریب فرش:</label>
              <input
                type="text"
                value={carpetDimensions}
                onChange={(e) => setCarpetDimensions(e.target.value)}
                placeholder="مثلاً ۶ متری یا ۲ در ۳"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-slate-300 font-bold">تصویر روی فرش (با کیفیت):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFrontImageUpload}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-300 file:bg-amber-500 file:text-slate-950 file:border-0 file:rounded-lg file:px-2 file:py-1 file:font-bold cursor-pointer"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-bold">تصویر پشت فرش (۷ سانت):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackImageUpload}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-300 file:bg-amber-500 file:text-slate-950 file:border-0 file:rounded-lg file:px-2 file:py-1 file:font-bold cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-300 font-bold">سابقه و توضیحات اولیه فرش:</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توضیحات مربوط به محل خرید، قدمت تخمینی یا سلامت ریشه‌ها..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:border-amber-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full gold-grad text-slate-950 font-black py-3.5 rounded-xl shadow-lg active:scale-95 transition"
          >
            ارسال درخواست کارشناسی و ثبت در سامانه
          </button>
        </form>

        {/* Request Tracker */}
        <div className="space-y-4">
          <div className="font-bold text-amber-300 text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
            <i className="fa-solid fa-clock-rotate-left text-amber-400"></i>
            <span>پیگیری پرونده‌های کارشناسی ثبت‌شده:</span>
          </div>

          <div className="grid gap-3">
            {requests.map((req) => {
              const st = getStatusBadge(req.status);

              return (
                <div key={req.id} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 bg-slate-900/80">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-amber-400 font-bold text-[10px] me-2">{req.id}</span>
                      <strong className="text-amber-200 font-bold text-xs">{req.ownerName}</strong>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${st.style}`}>
                      {st.label}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 italic">
                    "{req.notes}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>تاریخ ثبت: {req.createdAt}</span>
                    <span className="text-amber-300 font-mono">{req.contactPhone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
