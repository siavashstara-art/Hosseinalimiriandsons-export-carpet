import React, { useState } from 'react';
import { AppLang } from '../types';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
}

export const MerchantServiceShop: React.FC<{ currentLang: AppLang }> = ({ currentLang }) => {
  const [purchasedServices, setPurchasedServices] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const services: ServiceItem[] = [
    { id: 'cert', title: 'صدور شناسنامه اصالت دیجیتال (۵ عدد)', description: 'صدور ۵ گواهی اصالت با QR Code اختصاصی و ثبت در دیتابیس مرکزی', price: 2500000, icon: 'fa-certificate' },
    { id: 'golden', title: 'اشتراک ویترین طلایی (ماهیانه)', description: 'قرارگیری در صدر نتایج، نشان ویژه طلایی و اولویت در نمایش به مشتریان جهانی', price: 4500000, icon: 'fa-star' },
    { id: 'auction', title: 'اجاره اتاق مزایده (تک جلسه)', description: '۴ ساعت دسترسی کامل به زیرساخت مزایده زمان‌دار زنده با برند اختصاصی', price: 1500000, icon: 'fa-gavel' },
  ];

  const handlePurchase = (service: ServiceItem) => {
    // Simulate payment process
    setPurchasedServices([...purchasedServices, service.id]);
    setSuccessMsg(`سرویس "${service.title}" با موفقیت خریداری و اعتبار آن به پنل شما اضافه شد.`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-500/30 space-y-8 bg-slate-950/90">
      <div className="text-center space-y-2 border-b border-amber-500/20 pb-5">
        <h2 className="text-2xl md:text-3xl font-black gold-text tracking-tight">
          پنل خدمات تخصصی و خرید سرویس‌های ارزش‌افزوده
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          تجار و فرش‌فروشان گرامی؛ شما می‌توانید با خرید سرویس‌های زیر، اصالت فرش‌های خود را تضمین کرده و فروش خود را به‌طور چشمگیری افزایش دهید. تمامی پرداخت‌ها پیش‌پرداخت بوده و بلافاصله فعال می‌گردند.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-bold text-center animate-bounce">
          <i className="fa-solid fa-circle-check ml-1.5"></i>
          {successMsg}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800 bg-slate-900/60 hover:border-amber-500/40 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl gold-grad flex items-center justify-center text-slate-950 text-xl shadow-lg">
                <i className={`fa-solid ${service.icon}`}></i>
              </div>
              <h3 className="font-black text-amber-200 text-sm">{service.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{service.description}</p>
            </div>
            <div className="pt-4 space-y-3">
              <div className="text-emerald-400 font-black text-lg font-mono text-center">
                {service.price.toLocaleString()} تومان
              </div>
              <button
                onClick={() => handlePurchase(service)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold text-xs transition"
              >
                پرداخت و فعال‌سازی آنی
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
