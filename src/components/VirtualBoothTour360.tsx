import React, { useState } from 'react';
import { AppLang } from '../types';

interface VirtualBoothTour360Props {
  currentLang: AppLang;
}

export const VirtualBoothTour360: React.FC<VirtualBoothTour360Props> = ({ currentLang }) => {
  const [activeSpot, setActiveSpot] = useState<'showroom' | 'loom' | 'dye_workshop' | 'vault'>('showroom');
  const [isRotating, setIsRotating] = useState(true);

  const spots = [
    {
      id: 'showroom',
      titleFa: 'تالار مرکزی نمایشگاه و حجره مرصع',
      titleEn: 'Main Imperial Showroom & Gallery',
      descFa: 'نمایشگاه دائمی قالی‌های نفیس صادراتی تبریز، اصفهان و قم با نورپردازی موزه ای.',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'loom',
      titleFa: 'کارگاه دارقالی و اساتید بافنده',
      titleEn: 'Master Weaver Loom Workshop',
      descFa: 'محیط واقعی خلق شاهکارهای دستباف با رجشمار بالا زیر نظر اساتید نامی صنف.',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'dye_workshop',
      titleFa: 'کارگاه رنگرزی گیاهی سنتی',
      titleEn: 'Traditional Botanical Dye Studio',
      descFa: 'استفاده از روناس، نیل، پوست گردو و اسپرک جهت ثبات رنگ مادام‌العمر قالی‌ها.',
      image: 'https://images.unsplash.com/photo-1582582494705-f829b31478b4?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'vault',
      titleFa: 'خزانه امن و گواهی اصالت دیجیتال',
      titleEn: 'Secure Vault & Digital Certificate Archive',
      descFa: 'نگهداری اسناد حقوقی، شناسنامه‌های بین‌المللی و ضمانت‌نامه‌های رسمی صادرات.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const currentSpotData = spots.find(s => s.id === activeSpot) || spots[0];

  return (
    <div className="glass-card rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden border border-amber-500/30">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
        <div>
          <h2 className="text-base md:text-lg font-black gold-text flex items-center gap-2">
            <i className="fa-solid fa-vr-cardboard text-amber-400 animate-pulse"></i>
            <span>تور مجازی ۳۶۰ درجه بازار و حجره‌های مرکزی</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            مشاهده همه‌جانبه و تعاملی از فضای نمایشگاهی، کارگاه‌های بافت و خزانه اصالت فرش حسن‌علی میری
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <i className="fa-solid fa-circle text-[8px] text-emerald-400 animate-ping"></i>
            حالت تعاملی ۳۶۰ درجه فعال
          </span>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
        <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
          <i className="fa-solid fa-circle-info text-amber-400"></i>
          تور مجازی ۳۶۰ درجه چیست و چه کاربردی دارد؟
        </h4>
        <p>
          تور مجازی ۳۶۰ درجه فناوری پیشرفته‌ای است که به خریداران داخلی و خارجی اجازه می‌دهد بدون نیاز به حضور فیزیکی در بازار فرش، تمامی زوایای حجره، کیفیت گره‌ها پشت و روی قالی، نوع تار و پود (ابریشم یا کرک) و جزئیات نقشه را به صورت پانورامای همه‌جانبه بررسی کنند. این ابزار شفافیت معاملات را به ۱۰۰٪ می‌رساند.
        </p>
      </div>

      {/* Panorama Viewer Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden h-80 md:h-96 bg-slate-950 border-2 border-amber-500/40 shadow-2xl group">
        <img
          src={currentSpotData.image}
          alt={currentSpotData.titleFa}
          className={`w-full h-full object-cover transition-transform duration-1000 ${isRotating ? 'scale-105 filter brightness-105' : 'scale-100'}`}
        />

        {/* Overlay Vignette & Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full text-xs shadow-lg">
              {currentSpotData.titleFa}
            </span>
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="bg-slate-900/80 hover:bg-slate-900 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/40 transition shadow"
            >
              <i className={`fa-solid ${isRotating ? 'fa-pause' : 'fa-play'} ml-1.5`}></i>
              {isRotating ? 'توقف چرخش نما' : 'شروع چرخش ۳۶۰ درجه'}
            </button>
          </div>
          <p className="text-xs text-slate-200 font-medium max-w-2xl">
            {currentSpotData.descFa}
          </p>
        </div>

        {/* Interactive Hotspots */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur p-2.5 rounded-2xl border border-amber-500/30 flex items-center gap-2">
          <i className="fa-solid fa-compass text-amber-400 animate-spin"></i>
          <span className="text-xs text-amber-200 font-bold">راهبری نقاط نمایشی</span>
        </div>
      </div>

      {/* Spot Selector Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {spots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => setActiveSpot(spot.id as any)}
            className={`p-3 rounded-2xl text-start transition border ${
              activeSpot === spot.id
                ? 'gold-grad text-slate-950 font-black shadow-lg scale-105 border-amber-400'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border-slate-800'
            }`}
          >
            <div className="text-xs font-bold truncate">{spot.titleFa}</div>
            <div className={`text-[10px] mt-1 ${activeSpot === spot.id ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
              مشاهده زاویه ۳۶۰ درجه
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
